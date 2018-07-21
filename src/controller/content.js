const Base = require('./base.js');
module.exports = class extends Base {
    /**
     * @Description 文章列表
     * @Author      jinsong5
     * @DateTime    2018-07-20
     * @return      {[type]}   [description]
     */
    async listAction() {
        const map = {
            status: 99,
            type: 'post'
        };
        const page = this.get('page') || 1;
        const pageSize = this.get('pageSize') || 5;
        const contents = await this.model('content').where(map).page(page, pageSize).fieldReverse('content,markdown').order('create_time desc').countSelect();
        this.assign('contents', contents);
        return this.display('list');
    }
    /**
     * @Description 正文页
     * @Author      jinsong5
     * @DateTime    2018-07-20
     * @return      {[type]}   [description]
     */
    async detailAction() {
        const contentModel = this.model('content')
        const _this = this;
        const map = {
            slug: _this.get('slug'),
            status: 99,
            type: 'post'
        }
        const content = await contentModel.where(map).find();
        if (think.isEmpty(content)) {
            return this.redirect('/');
        }
        // // 填充页面
        this.assign('content', content)
        this.assign('title', content.title)
        //  // 更新阅读量
        contentModel.updateViewNums(map)
        return this.display('content');
    }
    /**
     * @Description 标签，分类，集合
     * @Author      jinsong5
     * @DateTime    2018-07-20
     * @return      {[type]}   [description]
     */
    async musterAction() {
        const map = {
            status: 99,
            type: 'post'
        };
        let meta = {};
        if (this.get('category')) {
            const categoryId = await this.model('meta').where({ slug: this.get('category'), type: 'category' }).getField('id', true);
            meta = { key: 'category', value: this.get('category') };
            if (categoryId) {
                map['category_id'] = categoryId;
            }
        }

        if (this.get('tag')) {
            const tags = await this.model('meta').where({ slug: this.get('tag'), type: 'tag' }).getField('id');
            const contentIds = await this.model('relationships').where({ meta_id: ['IN', tags] }).getField('content_id');
            meta = { key: 'tag', value: this.get('tag') };
            if (contentIds) {
                map['id'] = ['IN', contentIds];
            }
        }

        this.assign('meta', meta);
        this.assign('title', meta.value);
        const page = this.get('page') || 1;
        const pageSize = this.get('pageSize') || 6;
        const contents = await this.model('content').where(map).page(page, pageSize).fieldReverse('content,markdown').order('create_time desc').countSelect();
        this.assign('contents', contents);
        return this.display('muster');
    }
    /**
     * @Description 文章归档
     * @Author      jinsong5
     * @DateTime    2018-07-20
     * @return      {[type]}   [description]
     */
    async archivesAction() {
        const map = {
            type: 'post',
            status: 99
        };
        const data = await this.model('content').field('slug,title,create_time,category_id').where(map).order('create_time desc').select();
        const list = {};
        for (const i in data) {
            data[i].create_time *= 1000;
            const month = think.datetime(data[i].create_time, 'MM, YYYY');
            if (!list[month]) {
                list[month] = [];
            }
            list[month].push(data[i]);
        }
        this.assign('title', 'archives');
        this.assign('list', list);
        return this.display('archives');
    }
    /**
     * @Description 页面详情
     * @Author      jinsong5
     * @DateTime    2018-07-20
     * @return      {[type]}   [description]
     */
    async pageAction() {
        const map = {
            slug: this.get('slug'),
            type: 'page',
            status: 99
        };
        const content = await this.model('content').where(map).find();
        this.model('content').updateViewNums(map)
        this.assign('title', content.title);
        this.assign('content', content);
        return this.display('page');
    }
};