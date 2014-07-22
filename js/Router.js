var Router = {
    "activeTestID": null,
    "activeQuestionID": null
};


Router.checkRouter = function () {
    var routers = location.hash.split('/');

    if (/^\d{1,2}$/.test(routers[1]) && /^\d{1,2}$/.test(routers[2])) {

        if(this.activeTestID !== (parseInt(routers[1], 10) - 1) && this.activeTestID !== null ){
            Utils.resetFlagsANDanswers(app.objQuestion);
            Utils.JSONppdLocalStorageANDRightdWrongReset();
            if(app.objQuestion.skipAnswerButton.classList.contains('hidden')){
                Utils.removeClass(app.objQuestion.skipAnswerButton, 'hidden');
            }
        }

        if(app.objQuestion.listAnswers.firstChild){
            Utils.deleteOptionsQuestion(app.objQuestion.listAnswers, app.objQuestion.listAnswers.firstChild);
        }


        this.activeTestID = parseInt(routers[1], 10) - 1;
        this.activeQuestionID = parseInt(routers[2], 10) - 1;

        app.objStatistics.testWidget(this.activeTestID);

        app.objQuestion.setIndexActiveTest(this.activeTestID);
        app.objQuestion.buildQuestion(this.activeQuestionID);
        app.objParseModule.setQuestionID(this.activeQuestionID);
        app.objParseModule.stringifyStorage();
    };
};



Router.clearHash = function () {
    location.hash = '';
};

Router.setRouter = function (idTest, idQuestion) {
    location.hash = 'test/' + (parseInt(idTest, 10) + 1) + '/' + (parseInt(idQuestion, 10) + 1);
};

Router.addEventListenerHash = function () {
    window.addEventListener('hashchange', this.checkRouter);
};