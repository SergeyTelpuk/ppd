define(['jquery', 'underscore', 'handlebars', 'ParseModule', 'QuestionModule', 'Statistics', 'Router'],
    function($, _, Handlebars, ParseModule ,QuestionModule, Statistics ,Router){

        function QuizzApp() {

            if(!(this instanceof QuizzApp)){
                return new QuizzApp();
            }

            this.objStatistics;
            this.objQuestion;
            this.objParseModule;
            this.objRouter;
            this.quizData;
        };

        QuizzApp.prototype.setFlagFalse = function(){
            _.each(this.quizData, function(num){
                num.answeredQuestion = false;
            });
        };

        QuizzApp.prototype.init = function () {
            var self = this;

            var $wrapper = $('.appWrapper');


            $.getJSON( 'js/json/quizData.json', function(data){

                self.quizData = data;

                self.setFlagFalse();

                self.objParseModule = new ParseModule();

                self.objQuestion = new QuestionModule($wrapper, self, self.quizData);

                self.objQuestion.hiddenAjaxLoader();

                self.objQuestion.buildTestWidget();

                self.objStatistics = new Statistics($wrapper);

                self.objRouter = new Router(self.objQuestion, self.objParseModule, self.objStatistics, self.quizData);

                self.objQuestion.createListTest();

                self.objQuestion.buildQuestionIFexit(self.objParseModule, self.objStatistics);

                self.objQuestion.setFlagPassedTest(self.objParseModule);
            });
        };

        return new QuizzApp();
    });



