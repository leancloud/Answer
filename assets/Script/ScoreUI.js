// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: {
            type: cc.ProgressBar,
            default: null,
        },
        label: {
            type: cc.Label,
            default: null,
        },

        totalScore: 0,
        score: 0,
    },

    add(s) {
        this.score += s;
        console.log(this.totalScore + ", " + this.score);
        this.updateUI();
        return this.score;
    },

    updateUI() {
        this.progressBar.progress = this.score / this.totalScore;
        this.label.string = this.score;
    }
});
