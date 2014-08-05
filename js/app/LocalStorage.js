define(function(){

    function LocalStorage() {

        if(!(this instanceof LocalStorage)){
            return new LocalStorage();
        }

        this.JSONppdLocalStorage = {
            "testID": null,
            "questionID": 0,
            "answeredRightQuestion": [],
            "answeredWrongQuestion": [],
            "passedTests" : []
        }
    }

    LocalStorage.prototype.resetTestPassed = function(){
        this.JSONppdLocalStorage.passedTests = [];
    };

    LocalStorage.prototype.setTestId = function (testId) {
        this.JSONppdLocalStorage.testID = testId;
    };

    LocalStorage.prototype.setQuestionID = function (questionID) {
        this.JSONppdLocalStorage.questionID = questionID;
    };

    LocalStorage.prototype.setAnswerRightQuestLocalStorage = function (answerIndex) {
        this.JSONppdLocalStorage.answeredRightQuestion.push(answerIndex);
    };

    LocalStorage.prototype.setAnswerWrongQuestLocalStorage = function(answerIndex){
        this.JSONppdLocalStorage.answeredWrongQuestion.push(answerIndex);
    };

    LocalStorage.prototype.getTestId = function () {
        return this.JSONppdLocalStorage.testID;
    };

    LocalStorage.prototype.getQuestionID = function () {
        return this.JSONppdLocalStorage.questionID;
    };

    LocalStorage.prototype.getAnsweredRightQuestion = function () {
        return this.JSONppdLocalStorage.answeredRightQuestion;
    };
    LocalStorage.prototype.getAnsweredWrongQuestion  = function(){
        return this.JSONppdLocalStorage.answeredWrongQuestion;
    };

    LocalStorage.prototype.setPassedTests = function(testActiveId){
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

    LocalStorage.prototype.getPassedTests = function(){
        return  this.JSONppdLocalStorage.passedTests;
    };


    LocalStorage.prototype.stringifyStorage = function () {
        localStorage.setItem('JSONppdLocalStorage', JSON.stringify(this.JSONppdLocalStorage));
    };

    LocalStorage.prototype.parseStorage = function () {
        this.JSONppdLocalStorage = JSON.parse(localStorage.getItem('JSONppdLocalStorage'));
    };

    return LocalStorage;
});