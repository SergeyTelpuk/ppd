$(function($){
    function QuizzApp() {
        this.objStatistics;
        this.objQuestion;
        this.objParseModule;
        this.objRouter;
        this.quizData;
    };

    QuizzApp.prototype.setFlagFalse = function(){
        for (var idQuest in this.quizData) {
            var idQuizData = this.quizData[idQuest].questions;
            for (var i in idQuizData) {
                idQuizData[i].answeredQuestion = false;
            }
        }
    };

    QuizzApp.prototype.init = function () {
        var self = this;

        var $wrapper = $('.appWrapper');

        $.getJSON( 'js/json/quizData.json', function(data){

            self.quizData = data;

            self.setFlagFalse();

            self.objParseModule = new ParseModule();

            self.objQuestion = new QuestionModule($wrapper, self, self.quizData);

            self.objQuestion.buildTestWidget();

            self.objStatistics = new Statistics($wrapper);

            self.objRouter = new Router(self.objQuestion, self.objParseModule, self.objStatistics, self.quizData);

            self.objQuestion.createListTest();

            self.objQuestion.buildQuestionIFexit(self.objParseModule, self.objStatistics);

            self.objQuestion.setFlagPassedTest(self.objParseModule);
        });
    };

    var app = new QuizzApp();
    app.init();
}(jQuery));



