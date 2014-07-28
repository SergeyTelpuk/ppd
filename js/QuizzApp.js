function QuizzApp() {
    this.objStatistics;
    this.objQuestion;
    this.objParseModule;
    this.objRouter;
}

QuizzApp.prototype.init = function (jQuery) {
    var $wrapper = jQuery('.appWrapper');

    this.objParseModule = new ParseModule();

    this.objQuestion = new QuestionModule($wrapper, this, jQuery);

    this.objQuestion.buildTestWidget();

    this.objStatistics = new Statistics($wrapper, jQuery);

    this.objRouter = new Router(this.objQuestion, this.objParseModule, this.objStatistics, jQuery);

    this.objQuestion.createListTest();

    this.objQuestion.buildQuestionIFexit(this.objParseModule, this.objStatistics);

    this.objQuestion.setFlagPassedTest(this.objParseModule);


};

var app = new QuizzApp();
app.init(jQuery);


