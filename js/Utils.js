var Utils = {};

Utils.deleteOptionsQuestion = function (parentNode, childNode) {
    parentNode.removeChild(childNode);
};

Utils.addClass = function (element, nameClass) {
    element.classList.add(nameClass);
};

Utils.removeClass = function (element, nameClass) {
    element.classList.remove(nameClass);
};

Utils.resetFlagsANDanswers = function (thisObj) {
    thisObj.activeQuestionIndex = thisObj.countAnsweredQuestion = 0;
    app.objStatistics.rightQuestions = app.objStatistics.wrongQuestions = 0;
    for (var id in quizData[thisObj.indexActiveTest].questions) {
        quizData[thisObj.indexActiveTest].questions[id].answeredQuestion = false;
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

