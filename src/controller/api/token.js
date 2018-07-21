const BaseRest = require('../rest.js');

module.exports = class extends BaseRest {
  // token 生成
  async postAction() {
    const username = this.post('username');
    const password = this.post('password');
    const user = this.model('user');
    //TODO,过滤查询信息
    const userInfo = await user.where({ username: username }).find();
    if (think.isEmpty(userInfo)) {
      return this.fail('用户不存在');
    }
    const result = user.verifyPassword(userInfo, password);
    if (think.isEmpty(result)) {
      return this.fail('密码不正确');
    }
    // 删除对象上的属性
    delete userInfo.password
    delete userInfo.encrypt
    // 更新最近登录时间
    user.where({ username: username }).update({'last_login_time': (new Date()).getTime() / 1000});
    // 这里使用了一个插件叫thinkjs-session-jwt  底层基于node-jsonwebtoken
    const token = await this.session('userInfo', userInfo);
    return this.success({ token });
  }
};
