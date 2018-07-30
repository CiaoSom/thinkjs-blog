;
(function(global) {
    "use strict";
    var WX = function(options) {
        this.options = {
            link: window.location.href,
            title: document.title,
            desc: '',
            imgUrl: '',
            success: function() {},
            cancel: function() {}
        }

        _assign(this.options, options)
        this.init();

    };
    WX.prototype = {
        init: function() {
            const _this = this;
            wx.ready(function() {
                wx.onMenuShareTimeline(_this.options)
                wx.onMenuShareAppMessage(_assign(_this.options, {
                    type: 'link',
                    dataUrl: ''
                }))
                wx.onMenuShareQQ(_this.options)
                wx.onMenuShareQZone(_this.options)
            });
            $.ajax({
                url: '/api/wx',
                data: {
                    url: location.href.indexOf('#') >= 0 ? location.href.substring(0, location.href.indexOf('#')) : location.href
                },
                dataType: 'jsonp',
                success: function(res) {
                    wx.config({
                        appId: res.appId, // 必填，公众号的唯一标识
                        timestamp: res.timestamp, // 必填，生成签名的时间戳
                        nonceStr: res.nonceStr, // 必填，生成签名的随机串
                        signature: res.signature, // 必填，签名，见附录1
                        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });
                }
            });

        }
    };
    /**
     * @Description 对象合并
     * @Author      jinsong5
     * @DateTime    2018-07-27
     * @param       {[type]}   tar [description]
     * @param       {[type]}   obj [description]
     * @return      {[type]}       [description]
     */
    var _assign = function(tar, obj) {
        if (Object.assign(tar, obj)) return Object.assign(tar, obj)
        var val;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                val = obj[key];
                if (val == null || val === "") {
                    continue
                }
                tar[key] = val
            }
        }
        return tar
    }
    //兼容CommonJs规范
    if (typeof module !== 'undefined' && module.exports) module.exports = WX;
    //兼容AMD/CMD规范
    if (typeof define === 'function') define(function() { return WX; });

    global.WX = WX;

})(this);