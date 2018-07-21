module.exports = class extends think.Model {
    async getList() {
        const list = await this.select();
        const data = {};
        for (const i in list) {
            data[list[i].name] = JSON.parse(list[i].value);
        }
        return data;
    }
};