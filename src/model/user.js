module.exports = class extends think.Model {
  /**
   * @Description 验证密码
   * @Author      jinsong5
   * @DateTime    2018-07-19
   * @param       {Object}   userInfo [description]
   * @param       {String}   password [description]
   * @return      {[type]}            [description]
   */
  verifyPassword(userInfo={}, password="") {
    // console.log(think.md5(think.md5('') + ''))
    return think.md5(think.md5(password) + userInfo.encrypt) === userInfo.password;
  }
  /**
   * @Description 生成密码
   * @Author      jinsong5
   * @DateTime    2018-07-19
   * @param       {Object}   userInfo [description]
   * @param       {String}   password [description]
   * @return      {[type]}            [description]
   */
  sign(userInfo={}, password=""){
    
    return think.md5(think.md5(password) + userInfo.encrypt);
  }
};
