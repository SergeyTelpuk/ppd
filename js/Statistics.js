function Statistics(appWrapper) {
    this.doc = appWrapper;
    this.rightQuestions = 0;
    this.wrongQuestions = 0;
    this.titleTest = this.doc.getElementsByClassName('titleTest')[0];
    this.question = this.doc.getElementsByClassName('countQuestions')[0];
    this.countRightQuestions = this.doc.getElementsByClassName('right')[0];
    this.countWrongQuestions = this.doc.getElementsByClassName('wrong')[0];
}

Statistics.prototype.displayShowRightQuestions = function(text) {
    this.countRightQuestions.innerText = text;
};

Statistics.prototype.displayShowWrongQuestions = function(text) {
    this.countWrongQuestions.innerText = text;
};

Statistics.prototype.buildTestWidget = function(indexActive) {
    this.titleTest.innerText = quizData[indexActive].title;
    this.question.innerText = quizData[indexActive].questions.length;
    this.displayShowRightQuestions(this.rightQuestions);
    this.displayShowWrongQuestions(this.wrongQuestions);
};