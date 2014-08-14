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

			$.getJSON( 'app/json/quizData.json', function(data){

				self.quizData = data;

				self.setAnsweredQuestionFalse();

				self.objLocalStorage =  LocalStorage;

				self.objQuestion =  Question;

				self.objQuestion.setQuizData(self.quizData);
				self.objQuestion.setObjQuizzApp(self);
				self.objQuestion.setAppWrapper(self.$wrapper);


				self.objQuestion.hiddenAjaxLoader();

				self.objStatistics =  Statistics;

				self.objQuestion.buildTestWidget(self);



				self.objRouter =  Router;
				self.objRouter.setQuizData(self.quizData);
				self.objQuestion.createListTest(Router);


				self.objQuestion.buildQuestionIFexit(self.objLocalStorage, self.objStatistics, Timer);

				self.objQuestion.setFlagPassedTest(self.objLocalStorage);
			});
		};

		return new QuizzApp();
	});



