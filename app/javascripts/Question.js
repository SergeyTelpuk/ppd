define(['Utils', 'Timer'],
    function(Utils, Timer){

        "use strict"

        function Question() {

            this.activeQuestionIndex = 0;
            this.indexActiveTest = 0;
            this.countAnsweredQuestion = 0;


            this.$appWrapper = $('.appWrapper');

            this.$widget = $('.widget',this.$appWrapper);

            this.$ajaxLoader = $('.ajaxLoader', this.$appWrapper);

            this.$contentQuestions = $('.contentQuestions', this.$appWrapper);
            this.$contentQuestion = $('.contentQuestion', this.$appWrapper);

            this.$resetTestPassed = $('.resetTestPassed', this.$appWrapper);
            this.$listTestName = $('.namesTest', this.$appWrapper);

            this.$floatWindows = $('.floatWindows', this.$appWrapper);
            this.$closedWindows = $('.closed', this.$appWrapper);
            this.$wrongContent = $('.wrongContent', this.$appWrapper);
            this.$testList = $('.testList', this.$appWrapper);

            this.$listAnswers = $('.listAnswers', this.$appWrapper);
        }

        Question.prototype.setObjQuizzApp = function(objQuizzApp){
            this.QuizzApp = objQuizzApp;
        };

        Question.prototype.setQuizData = function(quizData){
            this.quizData = quizData;
        };

        Question.prototype.setAppWrapper = function(appWrapper){
            this.$appWrapper = appWrapper;
        };

        Question.prototype.getIndexActiveTest = function () {
            return this.indexActiveTest;
        };

        Question.prototype.setIndexActiveTest = function (indexActive) {
            this.indexActiveTest = indexActive;

            this.QuizzApp.objLocalStorage.setTestId(indexActive);
            this.QuizzApp.objLocalStorage.stringifyStorage();

        };

        Question.prototype.hiddenAjaxLoader = function () {
            this.$ajaxLoader.hide();
        };

        Question.prototype.setCountAnsweredQuestion = function (countAnsweredQuestion) {
            this.countAnsweredQuestion = countAnsweredQuestion;
        };

        Question.prototype.getCountQuestion = function () {
            return this.quizData[this.getIndexActiveTest()].questions.length;
        };

        Question.prototype.buildOneQuestion = function () {
            if (!this.QuizzApp.objRouter.getFlagRouterHash()) {
                this.buildQuestion();
            } else {
                location.hash = 'test/' + (parseInt(this.getIndexActiveTest(), 10) + 1) + '/' + 1;
            }
        };

        Question.prototype.listTestEvent = function (evt) {
            var target = evt.target;

            if (target.tagName.toUpperCase() === 'A') {
                this.setIndexActiveTest(target.getAttribute('data-id-question'));
                this.buildOneQuestion();
                this.$testList.hide();
                this.$contentQuestions.show();
            }
        };

        Question.prototype.repeatTest = function () {
            Utils.resetFlagsANDanswers(this);
            Timer.reset();
            Timer.start(this);
            this.$floatWindows.hide();

            this.$listAnswers.empty();
            Utils.JSONppdLocalStorageRepeat(this.QuizzApp.objLocalStorage);
            this.QuizzApp.objRouter.clearHash();
            this.QuizzApp.objRouter.setRouter(this.getIndexActiveTest(), this.getActiveQuestionIndex());
        };

        Question.prototype.getActiveQuestionIndex = function () {
            return  parseInt(this.activeQuestionIndex, 10);
        };

        Question.prototype.setActiveQuestionIndex = function (indexActiveQuestion) {
            this.activeQuestionIndex = parseInt(indexActiveQuestion, 10);
        };

        Question.prototype.getSkipAnswerButtonFlag = function () {
            if ((this.getCountQuestion() - 1) === this.countAnsweredQuestion) {
                return false;
            }
            return true;
        };

        Question.prototype.buildQuestion = function () {
            this.$contentQuestion.html(HbsTemplate.templates.question({
                title: this.quizData[this.getIndexActiveTest()].title,
                question: this.quizData[this.getIndexActiveTest()].questions[this.getActiveQuestionIndex()].question,
                questionImg: this.quizData[this.getIndexActiveTest()].questions[this.getActiveQuestionIndex()].questionImg,
                listAnswer: this.quizData[this.getIndexActiveTest()].questions[this.getActiveQuestionIndex()].answers,
                skipAnswerButton: this.getSkipAnswerButtonFlag()
            }));
        };

        Question.prototype.getNextActiveQuestionIndex = function (idx) {
            do {
                idx = ++idx > (this.quizData[this.getIndexActiveTest()].questions.length - 1) ? 0 : idx;
            } while (this.quizData[this.getIndexActiveTest()].questions[idx].answeredQuestion);

            return idx;

        };

        Question.prototype.clickNextButton = function (answerID) {

            this.setAnsweredQuestion();

            if ((++answerID) === parseInt(this.quizData[this.getIndexActiveTest()].questions[this.getActiveQuestionIndex()].right, 10)) {
                this.QuizzApp.objStatistics.changeRightQuestions(null);
                this.QuizzApp.objLocalStorage.setAnswerRightQuestLocalStorage(this.getActiveQuestionIndex());
                this.nextQuestion();
            } else {
                this.QuizzApp.objLocalStorage.setAnswerWrongQuestLocalStorage(this.getActiveQuestionIndex());
                this.QuizzApp.objStatistics.changeWrongQuestions(null);
                this.setWrongContent();
                this.$floatWindows.show();
            }

            this.QuizzApp.objLocalStorage.stringifyStorage();
        };

        Question.prototype.setWrongContent = function () {
            this.$wrongContent.html('<p class="statisticsWrong">Вы ответили не правильно!</p>' +
                '<p class="statisticsRight">Правильный ответ:</p>' +
                '<p>' + this.quizData[this.getIndexActiveTest()]
                .questions[this.getActiveQuestionIndex()]
                .answers[this.quizData[this.getIndexActiveTest()]
                .questions[this.getActiveQuestionIndex()].right - 1] +
                '</p>');
        };

        Question.prototype.setAnsweredQuestion = function () {
            this.quizData[this.getIndexActiveTest()].questions[this.getActiveQuestionIndex()].answeredQuestion = true;
            ++this.countAnsweredQuestion;
        };

        Question.prototype.nextBuildQuestion = function () {
            var id = this.getNextActiveQuestionIndex(this.getActiveQuestionIndex());
            this.QuizzApp.objRouter.setRouter(this.getIndexActiveTest(), id);
        };

        Question.prototype.clickSkipButton = function () {
            this.nextBuildQuestion();
        };

        Question.prototype.reset = function () {
            Utils.JSONppdLocalStorageReset(this.QuizzApp.objLocalStorage);

            if(Timer.getDuration() > 0){
                this.setFlagPassedTestLocalStorage(this.QuizzApp.objLocalStorage);
            }
            Timer.reset();
            this.setFlagPassedTest(this.QuizzApp.objLocalStorage);
            this.resetTest();
        };

        Question.prototype.nextQuestion = function () {
            if (Timer.getDuration() > 0 && this.countAnsweredQuestion < this.quizData[this.getIndexActiveTest()].questions.length) {
                this.$floatWindows.hide();
                this.nextBuildQuestion();
            } else if (Timer.getDuration() > 0 && this.countAnsweredQuestion === this.quizData[this.getIndexActiveTest()].questions.length) {
                var self = this;

                this.$wrongContent.html(this.QuizzApp.objStatistics.getWrongWindowsStatic());

                if ($('.repeat', this.$appWrapper).length) {
                    $('.repeat', this.$appWrapper).on('click', function (evt) {
                        self.repeatTest(evt);
                        return false;
                    });
                }
                this.$floatWindows.show();
                ++this.countAnsweredQuestion;
            } else {
                this.$listAnswers.empty();
                this.$floatWindows.hide();
                this.QuizzApp.objRouter.clearHash();
                this.reset();
            }
        };


        Question.prototype.closedTest = function () {
            this.$listAnswers.empty();
            this.$floatWindows.hide();
            Utils.JSONppdLocalStorageReset(this.QuizzApp.objLocalStorage);
            Timer.reset();
            this.QuizzApp.objRouter.clearHash();
            this.resetTest();
        };

        Question.prototype.addEventListenerExitTest = function () {
            var self = this;
            $('.exitTest', this.$appWrapper).on('click', function (evt) {
                evt.preventDefault();
                self.closedTest();
                return false;
            });
        };

        Question.prototype.startTimer = function(){
            Timer.setDuration(Timer.timer);
            Timer.start(this);
        };

        Question.prototype.addEventListenerUL = function ($ul) {
            var self = this;
            $ul.on('click', function (evt) {
                evt.preventDefault();
                self.listTestEvent(evt);
                self.startTimer();
                return false;
            });
        };

        Question.prototype.addEventListenerContentQuestion = function () {

            this.$contentQuestion.on('click', {self: this}, function (event) {
                if (event.target.className === 'skipAnswerButton') {
                    event.data.self.clickSkipButton();
                } else if (event.target.className === 'answer') {
                    event.data.self.clickNextButton(event.target.getAttribute('data-answers'));
                }
            });

        };

        Question.prototype.addEventListenerClosedWindows = function () {
            var self = this;

            self.$closedWindows.on('click', function (evt) {
                self.nextQuestion(evt);
                return false;
            });
        };

        Question.prototype.resetTestPassed = function () {
            this.QuizzApp.objLocalStorage.resetTestPassed();
            this.QuizzApp.objLocalStorage.stringifyStorage();
            this.setFlagPassedTest(this.QuizzApp.objLocalStorage);
        };

        Question.prototype.addEventListenerResetPassedTest = function () {
            var self = this;
            self.$resetTestPassed.on('click', function () {
                self.resetTestPassed();
                return false;
            });
        };

        Question.prototype.buildTestWidget = function (objQuizzApp) {
            this.$widget.append(HbsTemplate.templates.widget({
                countQuestions: 0,
                activeQuestions: 0,
                countRight: 0,
                countWrong: 0
            }));
	        objQuizzApp.objStatistics.setElementsJquery();
            this.$widget.show();
        };

        Question.prototype.createListTest = function (Router) {
            this.$listTestName.append(HbsTemplate.templates.tests({list: this.quizData}));

            this.addEventListenerUL(this.$listTestName.children('ul'));

            this.addEventListenerContentQuestion();

            this.addEventListenerClosedWindows();

            this.addEventListenerResetPassedTest();

            this.addEventListenerExitTest();

            Router.addEventListenerHash();


        };

        Question.prototype.buildQuestionIFexit = function (objLocalStorage, objStatistics, Timer) {

            if (JSON.parse(localStorage.getItem('JSONppdLocalStorage'))) {
                objLocalStorage.parseStorage();
            } else {
                objLocalStorage.stringifyStorage();
            }

            if (objLocalStorage.getTestId() !== null) {

                for (var id = 0; id < objLocalStorage.getAnsweredRightQuestion().length; ++id) {
                    this.quizData[objLocalStorage.getTestId()].questions[objLocalStorage.getAnsweredRightQuestion()[id]].answeredQuestion = true;
                }

                for (var id = 0; id < objLocalStorage.getAnsweredWrongQuestion().length; ++id) {
                    this.quizData[objLocalStorage.getTestId()].questions[objLocalStorage.getAnsweredWrongQuestion()[id]].answeredQuestion = true;
                }

                if ((objLocalStorage.getAnsweredWrongQuestion().length + objLocalStorage.getAnsweredRightQuestion().length) !== this.getCountQuestion()) {
                    this.setCountAnsweredQuestion(objLocalStorage.getAnsweredRightQuestion().length + objLocalStorage.getAnsweredWrongQuestion().length);
                    this.setIndexActiveTest(objLocalStorage.getTestId());

                    objStatistics.changeRightQuestions(objLocalStorage.getAnsweredRightQuestion().length);
                    objStatistics.changeWrongQuestions(objLocalStorage.getAnsweredWrongQuestion().length);
                    objStatistics.changeActiveQuestion(objLocalStorage.getQuestionID());
                    objStatistics.changeCountQuestion(this.getCountQuestion());

                    this.setActiveQuestionIndex(objLocalStorage.getQuestionID());

                    this.buildQuestion();

                    this.QuizzApp.objRouter.checkPassedQuestion(this.getIndexActiveTest(), this.getActiveQuestionIndex());

                    Timer.setDuration(objLocalStorage.getTimer());

                    Timer.start(this);

                    this.$contentQuestions.show();
                    this.$testList.hide();
                } else {
                    Utils.resetFlagsANDanswers(this);
                    Utils.JSONppdLocalStorageANDRightdWrongReset(objLocalStorage);
                    Utils.JSONppdLocalStorageReset(objLocalStorage);
                    this.setFlagPassedTestLocalStorage(objLocalStorage);
                    this.$contentQuestions.hide();
                    this.$testList.show();
                }
            } else {
                this.$contentQuestions.hide();
                this.$testList.show();
            }
        };

        Question.prototype.resetTest = function () {
            this.$contentQuestions.hide();
            this.$testList.show();
            this.$testList.addClass('testList');
            Utils.resetFlagsANDanswers(this);
        };

        Question.prototype.setFlagPassedTestLocalStorage = function (objLocalStorage) {
            objLocalStorage.parseStorage();
            objLocalStorage.setPassedTests(this.getIndexActiveTest());
            objLocalStorage.stringifyStorage();
        };

        Question.prototype.setFlagPassedTest = function (objLocalStorage) {
            var $passedTest = $('span', this.$listTestName);

            _.each($passedTest, function (num, key) {
                $passedTest.eq(key).html('');
            });

            _.each(objLocalStorage.getPassedTests(), function (num) {
                $passedTest.eq(num).html('&#10004');
            });

        };

        return new Question();
    });