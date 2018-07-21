const BaseRest = require('../rest.js');

module.exports = class extends BaseRest {
  /**
   * @Description 添加分类
   * @Author      jinsong5
   * @DateTime    2018-07-19
   * @return      {[type]}   [description]
   */
  async postAction() {
    const userInfo = this.userInfo;
    const data = {
      uid: userInfo.id,
      name: this.post('name'),
      slug: this.post('slug'),
      type: this.post('type'),
      sort: this.post('sort'),
      description: this.post('description')
    };
 
    const id = await this.modelInstance.add(data);
    if (id) {
      return this.success({ id: id }, '添加成功');
    } else {
      return this.fail(1000, '添加失败');
    }
  }
  /**
   * @Description 更新分类
   * @Author      jinsong5
   * @DateTime    2018-07-19
   * @return      {[type]}   [description]
   */
  async putAction() {
  	
  	if (!this.id) {
      return this.fail(1001, '分类不存在');
    }
    const userInfo = this.userInfo;
    const data = {
      uid: userInfo.id,
      name: this.post('name'),
      slug: this.post('slug'),
      type: this.post('type'),
      sort: this.post('sort'),
      description: this.post('description')
    };
    const rows = await this.modelInstance.where({id:this.id}).update(data)

    if (rows) {
      return this.success({ affectedRows: rows }, '更新成功');
    } else {
      return this.fail(1000, '更新失败');
    }
  }
  /**
   * @Description 查询分类
   * @Author      jinsong5
   * @DateTime    2018-07-19
   * @return      {[type]}   [description]
   */
  async getAction() {
    let data;
    if (this.id) {
      data = await this.modelInstance.where({ id: this.id }).find();
      return this.success(data);
    }
    const type = this.get('type') || 'category';
    data = await this.modelInstance.where({ type: type }).order('sort desc').select();
    return this.success(data);
  }
  /**
   * @Description 删除分类
   * @Author      jinsong5
   * @DateTime    2018-07-19
   * @return      {[type]}   [description]
   */
  async deleteAction() {
  	if (!this.id) {
      return this.fail(1001, '分类不存在');
    }
    const rows = await this.modelInstance.where({ id: this.id }).delete();
    if (rows) {
      return this.success({ affectedRows: rows }, '删除成功');
    } else {
      return this.fail(1000, '删除失败');
    }
  }
};
