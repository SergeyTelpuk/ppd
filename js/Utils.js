var Utils = {};

Utils.resetFlagsANDanswers = function (thisObj) {
    thisObj.activeQuestionIndex = thisObj.countAnsweredQuestion = 0;
    thisObj.QuizzApp.objStatistics.changeRightQuestions(0);
    thisObj.QuizzApp.objStatistics.changeWrongQuestions(0);
    thisObj.QuizzApp.objStatistics.changeActiveQuestion(0);
    for (var id in quizData[thisObj.getIndexActiveTest()].questions) {
        quizData[thisObj.getIndexActiveTest()].questions[id].answeredQuestion = false;
    }
};
Utils.JSONppdLocalStorageANDRightdWrongReset = function () {
    app.objParseModule.JSONppdLocalStorage.answeredRightQuestion = [];
    app.objParseModule.JSONppdLocalStorage.answeredWrongQuestion = [];
};

Utils.JSONppdLocalStorageRepeat = function () {
    app.objParseModule.JSONppdLocalStorage.questionID = 0;
    Utils.JSONppdLocalStorageANDRightdWrongReset();
    app.objParseModule.stringifyStorage();
};

Utils.JSONppdLocalStorageReset = function () {
    app.objParseModule.JSONppdLocalStorage.testID = null;
    app.objParseModule.JSONppdLocalStorage.questionID = 0;
    Utils.JSONppdLocalStorageANDRightdWrongReset();
    app.objParseModule.stringifyStorage();
};

