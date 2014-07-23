function Router(objQuestion, objParseModule, objStatistics) {
    this.activeTestID =  null;
    this.activeQuestionID = null;
    this.flagRouterHash = true;
    this.objQuestion = objQuestion;
    this.objParseModule = objParseModule;
    this.objStatistics = objStatistics;
};

Router.prototype.setActiveTestID = function (test) {
    this.activeTestID = test;
};

Router.prototype.setActiveQuestionID = function (question) {
    this.activeQuestionID = question;
};

Router.prototype.getActiveTestID = function () {
    return this.activeTestID;
};

Router.prototype.getActiveQuestionID = function () {
    return this.activeQuestionID;
};

Router.prototype.buildQuestion = function (activeTestID, activeQuestionID) {
    if (this.objQuestion.listAnswers.firstChild) {
        Utils.deleteOptionsQuestion(this.objQuestion.listAnswers, this.objQuestion.listAnswers.firstChild);
    }

    this.objStatistics.testWidget(activeTestID);

    this.objQuestion.setIndexActiveTest(activeTestID);
    this.objQuestion.buildQuestion(activeQuestionID);
    this.objParseModule.setQuestionID(activeQuestionID);
    this.objParseModule.stringifyStorage();
};

Router.prototype.checkNextTest = function (test) {
    if (this.getActiveTestID() !== test && this.getActiveTestID() !== null) {
        Utils.resetFlagsANDanswers(this.objQuestion);
        Utils.JSONppdLocalStorageANDRightdWrongReset();
        if (this.objQuestion.skipAnswerButton.classList.contains('hidden')) {
            Utils.removeClass(this.objQuestion.skipAnswerButton, 'hidden');
        }
    }
};

Router.prototype.floatWindows = function () {
    var floatWindows = this.objQuestion.getIndexActiveTest();
    this.objQuestion.wrongContent.innerHTML = '<span class="wrong">Нет такого теста с таким вопросом!!!</span>' +
        '<p class="routerWrong">При закрытии окна вы будите отправлены на следующий неотвеченный вопрос!</p>';
    Utils.removeClass(floatWindows, 'hidden');
};

Router.prototype.checkFlagHash = function () {
    if (this.flagRouterHash) {
        location.hash = 'test/' + (parseInt(this.getActiveTestID(), 10) + 1) + '/' + (parseInt(this.getActiveQuestionID(), 10) + 1);
    } else {
        this.buildQuestion(this.getActiveTestID(), this.getActiveQuestionID());
    }

};

Router.prototype.getFlagRouterHash = function () {
    return  this.flagRouterHash;
}


Router.prototype.buildQuestionHash = function (evt) {
    var routers = location.hash.split('/');
    if (/^\d{1,2}$/.test(routers[1]) && /^\d{1,2}$/.test(routers[2])) {

        this.checkNextTest((parseInt(routers[1], 10) - 1));

        this.setActiveTestID((parseInt(routers[1], 10) - 1));
        this.setActiveQuestionID((parseInt(routers[2], 10) - 1));

        this.buildQuestion(this.getActiveTestID(), this.getActiveQuestionID());
    }

};

Router.prototype.clearHash = function(){
    location.hash = ''
};

Router.prototype.setRouter = function (idTest, idQuestion) {
    this.setActiveTestID(idTest);
    this.setActiveQuestionID(idQuestion);
    this.checkFlagHash();
};

Router.prototype.addEventListenerHash = function () {
    if (this.flagRouterHash) {
        var self = this;
        window.addEventListener('hashchange', function(evt){
            self.buildQuestionHash();
            return false;});
    }

};
