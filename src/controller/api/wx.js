const BaseRest = require('../rest.js');

module.exports = class extends BaseRest {
  // jssdk 生成signature
  async getAction() {
    const data = this.wxData
   
    return this.jsonp(data);
  }
};
