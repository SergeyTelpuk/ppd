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

Utils.JSONppdLocalStorageRepeat = function () {
    console.log( app.localStorage.JSONppdLocalStorage.answeredWrongQuestion);
    app.localStorage.JSONppdLocalStorage.questionID = 0;
    app.localStorage.JSONppdLocalStorage.answeredRightQuestion = [];
    app.localStorage.JSONppdLocalStorage.answeredWrongQuestion = [];
    app.localStorage.stringifyStorage();
};

