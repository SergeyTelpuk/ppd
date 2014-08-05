define(function(){

    function ParseModule() {

        if(!(this instanceof ParseModule)){
            return new ParseModule();
        }

        this.JSONppdLocalStorage = {
            "testID": null,
            "questionID": 0,
            "answeredRightQuestion": [],
            "answeredWrongQuestion": [],
            "passedTests" : []
        }
    };

    ParseModule.prototype.resetTestPassed = function(){
        this.JSONppdLocalStorage.passedTests = [];
    };

    ParseModule.prototype.setTestId = function (testId) {
        this.JSONppdLocalStorage.testID = testId;
    };

    ParseModule.prototype.setQuestionID = function (questionID) {
        this.JSONppdLocalStorage.questionID = questionID;
    };

    ParseModule.prototype.setAnswerRightQuestLocalStorage = function (answerIndex) {
        this.JSONppdLocalStorage.answeredRightQuestion.push(answerIndex);
    };

    ParseModule.prototype.setAnswerWrongQuestLocalStorage = function(answerIndex){
        this.JSONppdLocalStorage.answeredWrongQuestion.push(answerIndex);
    };

    ParseModule.prototype.getTestId = function () {
        return this.JSONppdLocalStorage.testID;
    };

    ParseModule.prototype.getQuestionID = function () {
        return this.JSONppdLocalStorage.questionID;
    };

    ParseModule.prototype.getAnsweredRightQuestion = function () {
        return this.JSONppdLocalStorage.answeredRightQuestion;
    };
    ParseModule.prototype.getAnsweredWrongQuestion  = function(){
        return this.JSONppdLocalStorage.answeredWrongQuestion;
    };

    ParseModule.prototype.setPassedTests = function(testActiveId){
        if(this.JSONppdLocalStorage.passedTests.length > 0){
            for(var i = 0; i <  this.JSONppdLocalStorage.passedTests.length; ++i){
                if(this.JSONppdLocalStorage.passedTests[i] === testActiveId){
                    return false;
                }
            }
            this.JSONppdLocalStorage.passedTests.push(testActiveId);
        }else{
            this.JSONppdLocalStorage.passedTests.push(testActiveId);
        }
    };

    ParseModule.prototype.getPassedTests = function(){
        return  this.JSONppdLocalStorage.passedTests;
    };


    ParseModule.prototype.stringifyStorage = function () {
        localStorage.setItem('JSONppdLocalStorage', JSON.stringify(this.JSONppdLocalStorage));
    };

    ParseModule.prototype.parseStorage = function () {
        this.JSONppdLocalStorage = JSON.parse(localStorage.getItem('JSONppdLocalStorage'));
    };

    return ParseModule;
});