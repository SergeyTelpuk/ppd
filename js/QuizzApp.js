function QuizzApp() {
    this.objStatistics;
    this.objQuestion;
    this.objParseModule;
    this.objRouter;
}

QuizzApp.prototype.init = function () {
    var $wrapper = $('.appWrapper');

    this.objParseModule = new ParseModule();

    this.objQuestion = new QuestionModule($wrapper);

    this.objStatistics = new Statistics($wrapper);

    this.objRouter = new Router(this.objQuestion, this.objParseModule, this.objStatistics);

    this.objQuestion.createListTest();

    this.objQuestion.buildQuestionIFexit(this.objParseModule, this.objStatistics);

    this.objQuestion.setFlagPassedTest(this.objParseModule);


};

var app = new QuizzApp();
app.init();


