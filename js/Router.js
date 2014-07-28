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
    this.objQuestion.$listAnswers.empty();

    this.objStatistics.changeActiveQuestion(activeQuestionID);

    this.objQuestion.setIndexActiveTest(activeTestID);
    this.objQuestion.buildQuestion(activeQuestionID);
    this.objParseModule.setQuestionID(activeQuestionID);
    this.objParseModule.stringifyStorage();
};

Router.prototype.checkNextTest = function (test) {
    if (this.getActiveTestID() !== test && this.getActiveTestID() !== null) {
        Utils.resetFlagsANDanswers(this.objQuestion);
        Utils.JSONppdLocalStorageANDRightdWrongReset();
        this.objQuestion.$skipAnswerButton.removeClass('hidden');
    }
};

Router.prototype.floatWindowsQuestion = function () {
    this.objQuestion.$wrongContent.html('<span class="wrong">Нет такого вопроса!!!</span>' +
        '<p class="routerWrong">При закрытии окна вы будите отправлены на следующий неотвеченный текущего теста вопрос!</p>');
    this.objQuestion.$floatWindows.removeClass('hidden');
};

Router.prototype.floatWindowsTest = function () {
    this.objQuestion.$wrongContent.html('<span class="wrong">Нет такого теста!!!</span>' +
        '<p class="routerWrong">При закрытии окна вы будите отправлены на следующий неотвеченный вопрос текущего теста!</p>');
    this.objQuestion.$floatWindows.removeClass('hidden');
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

Router.prototype.intervalQuestionInclude = function(testID ,questionID){
    if(quizData[testID].questions.length <= questionID){
        return false;
    }
    return true;
};

Router.prototype.intervalTestInclude = function(testID){
    if(quizData.length <= testID){
        return false;
    }
    return true;
};

Router.prototype.checkPassedQuestion = function(testID, questionID){
        if(quizData[testID].questions[questionID].answeredQuestion === true){
           this.objQuestion.$answerButton.addClass('hidden');
        }else{
           this.objQuestion.$answerButton.removeClass('hidden');
        }
};

Router.prototype.buildQuestionHash = function () {
    var routers = location.hash.split('/');
    var testID = parseInt(routers[1], 10) - 1;
    var questionID = parseInt(routers[2], 10) - 1;
    if (!isNaN(testID)){
        if (/^\d{1,2}$/.test(testID) && testID >= 0 && this.intervalTestInclude(testID)) {
            this.checkNextTest(testID);
            this.setActiveTestID(testID);
            if (/^\d{1,2}$/.test(questionID) && this.intervalQuestionInclude(testID, questionID)) {
                this.setActiveQuestionID(questionID);
                this.buildQuestion(this.getActiveTestID(), this.getActiveQuestionID());
                this.checkPassedQuestion(testID, questionID);
            } else {
                this.objQuestion.setIndexActiveTest(testID);
                this.floatWindowsQuestion();
            }
        } else {
            this.floatWindowsTest();
        }
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
        $(window).on('hashchange', function(){
            self.buildQuestionHash();
            return false;});
    }

};
