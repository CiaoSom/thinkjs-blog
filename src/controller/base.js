module.exports = class extends think.Controller {
    async __before() {
        const config = await think.model('config').getList();
        const user = await think.model('user').cache('user').find();
        
        this.assign('site', config.site);
        this.assign('title', "");
        this.assign('user', user);
    }
};