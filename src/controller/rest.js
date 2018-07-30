const assert = require('assert');
const request = require('request')
const config = require('../config/config')
const sha1 = require('sha1')

module.exports = class extends think.Controller {
    constructor(ctx) {
        super(ctx);
        this.resource = this.getResource();
        this.id = this.getId();
 
        assert(think.isFunction(this.model), 'this.model must be a function');
        this.modelInstance = this.model(this.resource); 
    }

    async __before(action) {
        this.header('Access-Control-Allow-Origin', '*');
        const url = this.get('url')
        const ticket = await this.getTicket()
        
        const string1=`jsapi_ticket=${ticket}&noncestr=${config.noncestr}&timestamp=${new Date().getTime()}&url=${url}`
        this.wxData = url? Object.assign({},{
            appId:config.appId,
            signature:sha1(string1),
            timestamp:new Date().getTime(),
            noncestr:config.noncestr
        }):{};

        try {
            this.userInfo = await this.ctx.session('userInfo');
        } catch (err) {
            this.userInfo = {};
        }
        if (this.resource !== 'token' && this.ctx.method !== 'GET' && think.isEmpty(this.userInfo)) {
            this.ctx.status = 401;
            return this.ctx.fail(-1, '请登录后操作');
        }
    }

    getResource() {

        return this.ctx.controller.split('/').slice(-1)[0];
    }

    getId() {
        const id = this.get('id');
        if (id && (think.isString(id) || think.isNumber(id))) {
            return id;
        }
        const last = this.ctx.path.split('/').slice(-1)[0];
        if (last !== this.resource) {
            return last;
        }
        return '';
    }

    async getAction() {
        let data;
        const pk = this.modelInstance.pk;
        if (this.id) {
            data = await this.modelInstance.where({
                [pk]: this.id }).find();
            return this.success(data);
        }
        data = await this.modelInstance.order(pk + ' desc').select();
        return this.success(data);
    }

    async postAction() {
        const pk = this.modelInstance.pk;
        const data = this.post();
        delete data[pk];
        if (think.isEmpty(data)) {
            return this.fail('data is empty');
        }
        const insertId = await this.modelInstance.add(data);
        if (insertId) {
            data[pk] = insertId;
            
        } else {
            return this.success({ id: insertId });
        }
    }

    async deleteAction() {
        if (!this.id) {
            return this.fail('params error');
        }
        const pk = this.modelInstance.pk;
        const rows = await this.modelInstance.where({
            [pk]: this.id }).delete();
        if (rows) {
            return this.success({ affectedRows: rows }, '删除成功');
        } else {
            return this.fail(1000, '删除失败');
        }
    }

    async putAction() {
        if (!this.id) {
            return this.fail('params error');
        }
        const pk = this.modelInstance.pk;
        const data = this.post();
        data[pk] = this.id;
        if (think.isEmpty(data)) {
            return this.fail('data is empty');
        }
        const rows = await this.modelInstance.where({
            [pk]: this.id }).update(data);
        if (rows) {

            return this.success({ affectedRows: rows }, '更新成功');
        } else {
            return this.fail(1000, '更新失败');
        }
    }

    __call() {
        let method = this.http.method.toLowerCase();
        if (method === 'options') {
            this.setCorsHeader();
            this.end();
            return;
        }
        this.setCorsHeader();
        return super.__call();
    }
    setCorsHeader() {
        this.header('Access-Control-Allow-Origin', this.header('origin') || '*');
        this.header('Access-Control-Allow-Headers', 'x-requested-with');
        this.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,DELETE");
        this.header('Access-Control-Allow-Credentials', 'true');
    }

    async getAT() {
      return new Promise((res,rej)=>{
        request.get({
            url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+config.appId+'&secret=f938c3b8f804b5d479d2034342ad4669',
        },
        function(error, response, body) {
            const data = JSON.parse(body)
            if(data.errcode){

                rej(data)
            }else{
                res(data.access_token)
            }
  
        });
      })
    }
    async getTicket(){
      const at = await this.getAT()

    
      return new Promise((res,rej)=>{
         if(at.errcode){
           
            return rej(at)
         }
         request.get({
            url: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+at+'&type=jsapi',
        },
        function(error,response,body) {
     
           res(JSON.parse(body).ticket)
        });
      })
    }

};