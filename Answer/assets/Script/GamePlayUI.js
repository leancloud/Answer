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
var GamePlayData = require('GamePlayData');
var ScoreUI = require('ScoreUI');
var ResultPanel = require('ResultPanel');

cc.Class({
    extends: cc.Component,

    properties: {
        titleLabel: {
            type: cc.Label,
            default: null,
        },
        // 答题倒计时显示
        timeLabel: {
            type: cc.Label,
            default: null,
        },
        contentLabel: {
            type: cc.Label,
            default: null,
        },
        optionPanel: {
            type: cc.Node,
            default: null,
        },
        optionPrefab: {
            type: cc.Prefab,
            default: null,
        },
        myScoreUI: {
            type: ScoreUI,
            default: null,
        },
        rivalScoreUI: {
            type: ScoreUI,
            default: null,
        },
        resultPanel: {
            type: ResultPanel,
            default: null,
        },
        // 数据
        // 对手数据
        rival: null,
        // 本关卡所有问题数据
        questions: null,
        // 当前问题
        question: null,
        // 当前问题索引
        index: -1,
        // 得分
        myScore: 0,
        rivalScore: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    start() {
        var gamePlayDataNode = cc.find("GamePlayData");
        var gamePlayData = gamePlayDataNode.getComponent(GamePlayData);
        this.rival = gamePlayData.rivalData;
        this.questions = gamePlayData.questionsData;
        cc.game.removePersistRootNode(gamePlayDataNode);
        // 初始化 UI
        var totalScore = Constants.QuestionScore * Constants.QuestionsCount;
        this.myScoreUI.totalScore = totalScore;
        this.rivalScoreUI.totalScore = totalScore;
        this.index = 0;
        this.newQuestion();
    },

    newQuestion() {
        if (this.index == this.questions.length) {
            // 答题结束
            console.log("answer over: " + this.myScore + ", " + this.rivalScore);
            var result = this.myScore > this.rivalScore ? "Win" : "Lose";
            this.resultPanel.show(result, this.myScore);
            // 保存用户得分
            var user = AV.User.current();
            user.set('score', this.myScore);
            user.save();
            return;
        }
        this.question = this.questions[this.index];
        this.titleLabel.string = (this.index + 1) + "/" + this.questions.length;
        this.contentLabel.string = this.question.get('content');
        // 创建选项
        this.optionPanel.removeAllChildren();
        var options = this.question.get('options');
        for (var i = 0; i < options.length; i++) {
            var option = options[i];
            var optionButton = cc.instantiate(this.optionPrefab);
            optionButton.parent = this.optionPanel;
            optionButton.tag = i;
            var optionLabel = optionButton.getComponentInChildren(cc.Label);
            optionLabel.string = option;
            // 注册点击事件
            var optionClickHandler = new cc.Component.EventHandler();
            optionClickHandler.target = this.node;
            optionClickHandler.component = "GamePlayUI";
            optionClickHandler.handler = "onOptionButtonClicked";
            optionClickHandler.customEventData = i;
            var button = optionButton.getComponent(cc.Button);
            button.clickEvents = [];
            button.clickEvents.push(optionClickHandler);
        }
        // 显示答题索引
        this.titleLabel.string = (this.index + 1) + "/" + Constants.QuestionsCount;
        // 开启定时器
        this.timer = Constants.QuestionTimer;
        if (this.timerCallback) {
            this.unschedule(this.timerCallback);
        }
        this.timerCallback = function() {
            if (this.timer < 0) {
                // 时间到，开始下一题
                this.unschedule(this.timerCallback);
                this.newQuestion();
            } else {
                this.timeLabel.string = this.timer + "s";
                this.timer--;
            }
        }
        this.schedule(this.timerCallback, 1);
    },

    onBackButtonClicked(event, customEventData) {
        cc.director.loadScene("menu");
    },

    onOptionButtonClicked(event, customEventData) {
        // 获取这个问题的答案索引
        var answerIndex = this.question.get('answerIndex');
        var optionButtons = this.optionPanel.getComponentsInChildren(cc.Button);
        for (var i = 0; i < optionButtons.length; i++) {
            var optionButton = optionButtons[i];
            if (i === answerIndex) {
                // 答案选项设置为「绿色」
                optionButton.disabledColor = new cc.Color(0, 255, 0);
            } else {
                if (i === customEventData) {
                    // 用户选错选项设置为「红色」
                    optionButton.disabledColor = new cc.Color(255, 0, 0);
                } else {
                    optionButton.disabledColor = new cc.Color(225, 225, 225);
                }
            }
            // 所有选项按钮设置为「不可用」状态
            optionButton.interactable = false;
        }
        // 计算得分
        if (answerIndex == customEventData) {
            var score = this.timer / Constants.QuestionTimer * Constants.QuestionScore;
            this.myScore = this.myScoreUI.add(score);
        }
        // 刷新对手得分
        var rivalQuestions = this.rival.questions;
        var rivalQuestion = rivalQuestions[this.index];
        if (rivalQuestion.right === true) {
            this.rivalScore = this.rivalScoreUI.add(rivalQuestion.score);
        }
        // 开始下一题
        var self = this;
        this.scheduleOnce(function() {
            self.index++;
            self.newQuestion();
        }, 2);
    },
});
