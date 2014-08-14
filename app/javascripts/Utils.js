define(function(){
	"use strict"

	var Utils = {};

	Utils.resetFlagsANDanswers = function (thisObj) {
		thisObj.activeQuestionIndex = thisObj.countAnsweredQuestion = 0;
		thisObj.QuizzApp.objStatistics.changeRightQuestions(0);
		thisObj.QuizzApp.objStatistics.changeWrongQuestions(0);
		thisObj.QuizzApp.objStatistics.changeActiveQuestion(0);
		for (var id in thisObj.quizData[thisObj.getIndexActiveTest()].questions) {
			thisObj.quizData[thisObj.getIndexActiveTest()].questions[id].answeredQuestion = false;
		}
	};
	Utils.JSONppdLocalStorageANDRightdWrongReset = function (objParseModule) {
		objParseModule.JSONppdLocalStorage.answeredRightQuestion = [];
		objParseModule.JSONppdLocalStorage.answeredWrongQuestion = [];
	};

	Utils.JSONppdLocalStorageRepeat = function (objParseModule) {
		objParseModule.JSONppdLocalStorage.questionID = 0;
		Utils.JSONppdLocalStorageANDRightdWrongReset(objParseModule);
		objParseModule.stringifyStorage();
	};

	Utils.JSONppdLocalStorageReset = function (objParseModule) {
		objParseModule.JSONppdLocalStorage.testID = null;
		objParseModule.JSONppdLocalStorage.questionID = 0;
        objParseModule.JSONppdLocalStorage.timer = 0;
		Utils.JSONppdLocalStorageANDRightdWrongReset(objParseModule);
		objParseModule.stringifyStorage();
	};

	return Utils;
});

