function LocalStorage() {
    this.JSONppdLocalStorage = {
        "testID": null,
        "questionID": 0,
        "answeredRightQuestion": [],
        "answeredWrongQuestion": []
    }
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

LocalStorage.prototype.stringifyStorage = function () {
    localStorage.setItem('JSONppdLocalStorage', JSON.stringify(this.JSONppdLocalStorage));
}

LocalStorage.prototype.parseStorage = function () {
    this.JSONppdLocalStorage = JSON.parse(localStorage.getItem('JSONppdLocalStorage'));
};




