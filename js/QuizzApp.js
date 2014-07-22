function QuizzApp() {
    this.objStatistics;
    this.objQuestion;
    this.objParseModule;
}

QuizzApp.prototype.init = function () {
    var wrapper = document.getElementsByClassName('appWrapper')[0];

    this.objParseModule = new ParseModule();

    this.objQuestion = new QuestionModule(wrapper);

    this.objStatistics = new Statistics(wrapper);

    this.objQuestion.createListTest();

    this.objQuestion.buildQuestionIFexit(this.objParseModule, this.objStatistics);

    this.objQuestion.setFlagPassedTest(this.objParseModule);


};

var app = new QuizzApp();
app.init();


