define(['LocalStorage', 'Question', 'Statistics', 'Router'],
    function(LocalStorage, Question, Statistics ,Router){

        function QuizzApp() {
            if(!(this instanceof QuizzApp)){
                return new QuizzApp();
            }
        }

        QuizzApp.prototype.setAnsweredQuestionFalse = function(){
            _.each(this.quizData, function(num){
                num.answeredQuestion = false;
            });
        };

        QuizzApp.prototype.init = function () {
            var self = this;

            var $wrapper = $('.appWrapper');


            $.getJSON( 'js/json/quizData.json', function(data){

                self.quizData = data;

                self.setAnsweredQuestionFalse();

                self.objLocalStorage = new LocalStorage();

                self.objQuestion = new Question($wrapper, self, self.quizData);

                self.objQuestion.hiddenAjaxLoader();

                self.objQuestion.buildTestWidget();

                self.objStatistics = new Statistics($wrapper);

                self.objRouter = new Router(self.objQuestion, self.objLocalStorage, self.objStatistics, self.quizData);

                self.objQuestion.createListTest();

                self.objQuestion.buildQuestionIFexit(self.objLocalStorage, self.objStatistics);

                self.objQuestion.setFlagPassedTest(self.objLocalStorage);
            });
        };

        return new QuizzApp();
    });



