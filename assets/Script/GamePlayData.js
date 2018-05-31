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
var Constants = require('Constants');
var MatchUI = require('MatchUI');

cc.Class({
    extends: cc.Component,

    properties: {
        matchUI: {
            type: MatchUI,
            default: null,
        },

        rivalData: null,
        questionsData: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.game.addPersistRootNode(this.node);
    },

    start () {
        var param = {
            count: 3
        };
        var self = this;
        // 先获取对手数据
        AV.Cloud.run('getRival', param).then(function (rivalData) {
            self.rivalData = rivalData;
            // 刷新匹配显示
            self.matchUI.updateUI(rivalData);
            // 再获取问题数据
            var query = new AV.Query('Question');
            query.limit = Constants.QuestionsCount;
            query.find().then(function (questions) {
                console.log(questions);
                self.questionsData = questions;
                cc.director.preloadScene("gameplay", function () {
                    console.log("preload gameplay ok");
                    self.scheduleOnce(function () {
                        cc.director.loadScene("gameplay");
                        console.log("load gameplay ok");
                    }, 1);
                });
            }, function (error) {
                console.error(error);
            });         
        }, function (err) {
            console.log("getRival error: " + err);
        });
    },
});
