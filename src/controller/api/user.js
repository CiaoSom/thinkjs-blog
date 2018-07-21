const BaseRest = require('../rest.js');

module.exports = class extends BaseRest {
    /**
     * @Description 查询用户信息
     * @Author      jinsong5
     * @DateTime    2018-07-19
     * @return      {[type]}   [description]
     */
    async getAction() {
        const userInfo = this.userInfo;
        if (think.isEmpty(userInfo)) {
            this.ctx.status = 401;
            return this.fail(-1, '请登录后操作');
        }
        let data;
        // id为router对应id字段，即用户名
        if (this.id) {
            data = await this.modelInstance.where({ username: this.id }).fieldReverse('id,password,encrypt').find();
            data.avator = 'http://img4.imgtn.bdimg.com/it/u=3726090184,4141419313&fm=214&gp=0.jpg'
            return this.success(data);
        } else {
            data = await this.modelInstance.select();
            return this.success(data);
        }
    }
    /**
     * @Description 更新用户信息
     * @Author      jinsong5
     * @DateTime    2018-07-19
     * @return      {[type]}   [description]
     */
    async putAction() {

        const userInfo = await this.modelInstance.where({ username: this.id }).find();
        let data = this.post();
        if (think.isEmpty(data)) {
            return this.fail(1000, '数据不能为空');
        }

        if (!think.isEmpty(data.password)) {
            if (data.newPassword !== data.confirmPassword) {
                return this.fail(1000, '两次密码不一致');
            }

            if (!this.modelInstance.verifyPassword(userInfo, data.password)) {
                return this.fail(1000, '旧密码不正确');
            }

            data.password = this.modelInstance.sign(userInfo, data.newPassword);
        }
        const rows = await this.modelInstance.where({ id: userInfo.id }).update(data);
        if (rows) {
            return this.success({ affectedRows: rows }, '更新成功');
        } else {
            return this.fail(1000, '更新失败');
        }
    }
};