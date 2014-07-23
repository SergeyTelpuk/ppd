var Router = {
    "activeTestID": null,
    "activeQuestionID": null,
    "flagRouterHash": true
};

Router.setActiveTestID = function (test) {
    Router.activeTestID = test;
};

Router.setActiveQuestionID = function (question) {
    Router.activeQuestionID = question;
};

Router.getActiveTestID = function () {
    return Router.activeTestID;
};

Router.getActiveQuestionID = function () {
    return Router.activeQuestionID;
};

Router.buildQuestion = function (activeTestID, activeQuestionID) {

    if (app.objQuestion.listAnswers.firstChild) {
        Utils.deleteOptionsQuestion(app.objQuestion.listAnswers, app.objQuestion.listAnswers.firstChild);
    }

    app.objStatistics.testWidget(activeTestID);

    app.objQuestion.setIndexActiveTest(activeTestID);
    app.objQuestion.buildQuestion(activeQuestionID);
    app.objParseModule.setQuestionID(activeQuestionID);
    app.objParseModule.stringifyStorage();
};

Router.checkNextTest = function (test) {
    if (Router.activeTestID !== test && Router.activeTestID !== null) {
        Utils.resetFlagsANDanswers(app.objQuestion);
        Utils.JSONppdLocalStorageANDRightdWrongReset();
        if (app.objQuestion.skipAnswerButton.classList.contains('hidden')) {
            Utils.removeClass(app.objQuestion.skipAnswerButton, 'hidden');
        }
    }
};

Router.floatWindows = function () {
    var floatWindows = app.objQuestion.getIndexActiveTest();
    app.objQuestion.wrongContent.innerHTML = '<span class="wrong">Нет такого теста с таким вопросом!!!</span>' +
        '<p class="routerWrong">При закрытии окна вы будите отправлены на следующий неотвеченный вопрос!</p>';
    Utils.removeClass(floatWindows, 'hidden');
};

Router.checkFlagHash = function () {
    if (Router.flagRouterHash) {
        location.hash = 'test/' + (parseInt(Router.getActiveTestID(), 10) + 1) + '/' + (parseInt(Router.getActiveQuestionID(), 10) + 1);
    } else {
        Router.buildQuestion(Router.getActiveTestID(), Router.getActiveQuestionID());
    }

};

Router.getFlagRouterHash = function () {
    return  Router.flagRouterHash;
}


Router.buildQuestionHash = function (evt) {
    var routers = location.hash.split('/');

    if (/^\d{1,2}$/.test(routers[1]) && /^\d{1,2}$/.test(routers[2])) {

        Router.checkNextTest((parseInt(routers[1], 10) - 1));

        Router.setActiveTestID((parseInt(routers[1], 10) - 1));
        Router.setActiveQuestionID((parseInt(routers[2], 10) - 1));

        Router.buildQuestion(Router.getActiveTestID(), Router.getActiveQuestionID());
    }

};

Router.clearHash = function(){
    location.hash = ''
};

Router.setRouter = function (idTest, idQuestion) {
    Router.setActiveTestID(idTest);
    Router.setActiveQuestionID(idQuestion);
    Router.checkFlagHash();
};

Router.addEventListenerHash = function () {
    if (Router.flagRouterHash) {
        window.addEventListener('hashchange', this.buildQuestionHash);
    }

};
