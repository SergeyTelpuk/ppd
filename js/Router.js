var Router = {
    "activeTestID": null,
    "activeQuestionID": null
};

Router.checkRouter = function () {
    var routers = location.hash.split('/');

    if (/^\d+$/.test(routers[1]) && /^\d+$/.test(routers[2])) {
        this.activeTestID = parseInt(routers[1], 10) - 1;
        this.activeQuestionID = parseInt(routers[2], 10) - 1;

        app.objQuestion.buildQuestion(this.activeQuestionID);
        app.objParseModule.setQuestionID(this.activeQuestionID);
        app.objParseModule.stringifyStorage();

    }
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