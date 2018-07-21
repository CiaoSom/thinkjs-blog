module.exports = class extends think.Model {
  // 模型关联
  get relation() {
    return {
      category: {
        type: think.Model.BELONG_TO,
        model: 'meta',
        key: 'category_id',
        fKey: 'id',
        field: 'id,name,slug,description,count'
      },
      tag: {
        type: think.Model.MANY_TO_MANY,
        model: 'meta',
        rModel: 'relationships',
        rfKey: 'meta_id',
        key: 'id',
        fKey: 'content_id',
        field: 'id,name,slug,description,count'
      },
      user: {
        type: think.Model.BELONG_TO,
        model: 'user',
        key: 'uid',
        fKey: 'id',
        field: 'id,username,email,qq,github,weibo,zhihu'
      }
    };
  }
  /**
   * @Description 更新正文阅读量
   * @Author      jinsong5
   * @DateTime    2018-07-19
   * @param       {[type]}   map [description]
   * @return      {[type]}       [description]
   */
  updateViewNums(map){
    return this.where(map).increment('view', 1); 
  }
  /**
   * @Description 添加文章
   * @Author      jinsong5
   * @DateTime    2018-07-19
   * @param       {[type]}   data [description]
   * @return      {[type]}        [description]
   */
  async insert(data) {
    const tag = data.tag;
    delete data.tag;
    data = this.parseContent(data);
    const id = await this.add(data);
    if (id) {
      // 添加标签关系
      const tagData = [];
      for (var i in tag) {
        tagData.push({
          content_id: id,
          meta_id: tag[i]
        });
      }
      think.model('relationships').addMany(tagData);
      // 更新文章数量
      this.updateCount(data.category_id, tag);
    }
    return id;
  }

  /**
   * @Description 更新文章
   * @Author      jinsong5
   * @DateTime    2018-07-19
   * @param       {[type]}   id   [description]
   * @param       {[type]}   data [description]
   * @return      {[type]}        [description]
   */
  async save(id, data) {
    // 查询修改前数据
    const oldData = await this.where({ id: id }).find();
    // 修改分类统计
    if (oldData.category_id !== data.category_id) {
      think.model('meta').where({ id: oldData.category_id }).decrement('count');
    }

    // 更新数据
    data = this.parseContent(data);
    data.id = id;
    const res = await this.where({ id: data.id }).update(data);

    if (res) {
  
      this.updateCount(data.category_id);
    }

    return res;
  }
  async delet(id){
    //查询数据
    // const data = await this.where({ id: id }).find();
    const res = await this.where({ id: id }).delete();
    // let tagIds = [];
    if(res){
      // for(var i=0;i<data.tag.length;i++){
      //   tagIds.push(data.tag[i].id)
      // }
      this.updateCount(data.category_id);
    }
    return res
  }
  /**
   * @Description 更新文章数量
   * @Author      jinsong5
   * @DateTime    2018-07-19
   * @param       {[type]}   categoryId [description]
   * @param       {[type]}   tagData    [description]
   * @return      {[type]}              [description]
   */
  async updateCount(categoryId) {
    // 更新分类数量
    let tagData=[];
    const categoryCount = await this.where({ category_id: categoryId }).count();
    const tags = await think.model('meta').where({type:'tag'}).select();
    for(var i=0;i<tags.length;i++){
      tagData.push(tags[i].id)
    }
    think.model('meta').where({ id: categoryId }).update({ count: categoryCount });
    // 更新所有标签数量
    for (var i in tagData) {
      const tagCount = await think.model('relationships').where({ meta_id: tagData[i] }).count();
      await think.model('meta').where({ id: tagData[i] }).update({ count: tagCount });
     
    }
  }
  /**
   * @Description 处理内容，生成文章简介
   * @Author      jinsong5
   * @DateTime    2018-07-19
   * @param       {[type]}   data [description]
   * @return      {[type]}        [description]
   */
  parseContent(data) {
    // 描述处理
    if (data.content.indexOf('<!--more-->') > -1) {
      data.description = data.content.split('<!--more-->')[0]; // 写文章内容时，description部分是<!--more-->前面的部分,要自己写
    } else {
      data.description = '';
    }
    // 唯一标识处理
    if (!data.slug) {
      data.slug = think.md5(new Date());
    }
    return data;
  }

};
