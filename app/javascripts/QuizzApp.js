define(['LocalStorage', 'Question', 'Statistics', 'Router', 'Timer'],
	function(LocalStorage, Question, Statistics ,Router, Timer){

		"use strict"

		function QuizzApp() { }

		QuizzApp.prototype.setAnsweredQuestionFalse = function(){
			_.each(this.quizData, function(num){
				num.answeredQuestion = false;
			});
		};

		QuizzApp.prototype.init = function () {

			var self = this;

			self.$wrapper = $('.appWrapper');

            self.objLocalStorage =  LocalStorage;

            self.objQuestion =  Question;

            self.objStatistics =  Statistics;

            self.objRouter =  Router;


			$.getJSON( 'app/json/quizData.json', function(data){

				self.quizData = data;

				self.setAnsweredQuestionFalse();

				self.objQuestion.setQuizData(data);
				self.objQuestion.setObjQuizzApp(self);
				self.objQuestion.setAppWrapper(self.$wrapper);

				self.objQuestion.hiddenAjaxLoader();

				self.objQuestion.buildTestWidget(self);


				self.objRouter.setQuizData(data);
				self.objQuestion.createListTest(Router);

				self.objQuestion.buildQuestionIFexit(LocalStorage, Statistics, Timer);

				self.objQuestion.setFlagPassedTest(LocalStorage);
			});
		};

		return new QuizzApp();
	});



