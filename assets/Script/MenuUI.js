// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var AV = require('LeanCloud');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            // 如果是微信小游戏平台，则通过微信登录
            AV.User.loginWithWeapp().then(user => {
            
            }).catch(console.error);
        } else {
            // 否则，则模拟第三方登录
            AV.User.signUpOrlogInWithAuthData({
                // 微博（weibo）用 uid
                // 微信（weixin）和 QQ（qq）用 openid
                "openid": "oPrJ7uM5Y5oeypd0fyqQcKCaRv3o",
                "access_token": "OezXcEiiBSKSxW0eoylIeNFI3H7HsmxM7dUj1dGRl2dXJOeIIwD4RTW7Iy2IfJePh6jj7OIs1GwzG1zPn7XY_xYdFYvISeusn4zfU06NiA1_yhzhjc408edspwRpuFSqtYk0rrfJAcZgGBWGRp7wmA",
                "expires_in": "2016-01-06T11:43:11.904Z"
            }, 'weixin').then(function (s) {
            }, function (e) {
          
            });
        }
    },

    onLevelButtonClicked(event, customEventData) {
        cc.director.loadScene("match");
    },

    onAboutButtonClicked(event, customEventData) {

    },
});
