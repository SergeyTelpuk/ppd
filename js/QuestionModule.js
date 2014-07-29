function QuestionModule(appWrapper, QuizzApp, $) {
    this.$ = $;
    this.$appWrapper = appWrapper;
    this.QuizzApp = QuizzApp;

    this.activeQuestionIndex = 0;
    this.indexActiveTest = 0;
    this.countAnsweredQuestion = 0;

    this.$widget = this.$('.widget', this.$appWrapper);

    this.$contentQuestions = this.$('.contentQuestions', this.$appWrapper);
    this.$contentQuestion = this.$('.contentQuestion', this.$appWrapper);

    this.$resetTestPassed = this.$('.resetTestPassed', this.$appWrapper);
    this.$listTestName = this.$('.namesTest', this.$appWrapper);

    this.$floatWindows = this.$('.floatWindows' ,this.$appWrapper);
    this.$closedWindows = this.$('.closed', this.$appWrapper);
    this.$wrongContent = this.$('.wrongContent', this.$appWrapper);
    this.$testList = this.$('.testList', this.$appWrapper);

    this.$listAnswers = this.$('.listAnswers', this.$appWrapper);
}

QuestionModule.prototype.getIndexActiveTest = function(){
    return this.indexActiveTest;
};

QuestionModule.prototype.setIndexActiveTest = function (indexActive) {
    this.indexActiveTest = indexActive;

    this.QuizzApp.objParseModule.setTestId(indexActive);
    this.QuizzApp.objParseModule.stringifyStorage();

};

QuestionModule.prototype.setCountAnsweredQuestion = function (countAnsweredQuestion) {
    this.countAnsweredQuestion = countAnsweredQuestion;
};

QuestionModule.prototype.getCountQuestion = function () {
    return quizData[this.getIndexActiveTest()].questions.length;
};

QuestionModule.prototype.buildOneQuestion = function(){
    if(!this.QuizzApp.objRouter.getFlagRouterHash()){
        this.buildQuestion();
    }else{
        location.hash = 'test/' + (parseInt(this.getIndexActiveTest(),10) + 1) + '/' + 1;
    }
};

QuestionModule.prototype.listTestEvent = function (evt) {
    var target = evt.target;

    if (target.tagName.toUpperCase() === 'A') {
        this.setIndexActiveTest(target.getAttribute('data-id-question'));
        this.buildOneQuestion();
        this.$testList.hide();
        this.$contentQuestions.show();
    }
};

QuestionModule.prototype.repeatTest = function () {
    Utils.resetFlagsANDanswers(this);
    this.$floatWindows.hide();

    this.$listAnswers.empty();
    Utils.JSONppdLocalStorageRepeat();
    this.QuizzApp.objRouter.clearHash();
    this.QuizzApp.objRouter.setRouter(this.getIndexActiveTest(), this.getActiveQuestionIndex());
};

QuestionModule.prototype.getActiveQuestionIndex = function(){
    return  parseInt(this.activeQuestionIndex,10);
};
QuestionModule.prototype.setActiveQuestionIndex = function(indexActiveQuestion){
    this.activeQuestionIndex = parseInt(indexActiveQuestion, 10);
};

QuestionModule.prototype.getSkipAnswerButtonFlag = function () {
    if((this.getCountQuestion() - 1) === this.countAnsweredQuestion){
        return false;
    }
    return true;
};

QuestionModule.prototype.buildQuestion = function () {
    var source = this.$.trim(this.$('#questionTemplate').html());
    var template = Handlebars.compile(source);
    this.$contentQuestion.html(template({
        title: quizData[this.getIndexActiveTest()].title,
        question: quizData[this.getIndexActiveTest()].questions[this.getActiveQuestionIndex()].question,
        questionImg: quizData[this.getIndexActiveTest()].questions[this.getActiveQuestionIndex()].questionImg,
        listAnswer: quizData[this.getIndexActiveTest()].questions[this.getActiveQuestionIndex()].answers,
        skipAnswerButton: this.getSkipAnswerButtonFlag()
    }));
};

QuestionModule.prototype.getNextActiveQuestionIndex = function (idx) {
    do {
        idx = ++idx > (quizData[this.getIndexActiveTest()].questions.length - 1) ? 0 : idx;
    } while (quizData[this.getIndexActiveTest()].questions[idx].answeredQuestion);

    return idx;

};

QuestionModule.prototype.clickNextButton = function (answerID) {

    this.setAnsweredQuestion();

    if ((++answerID) === parseInt(quizData[this.getIndexActiveTest()].questions[this.getActiveQuestionIndex()].right, 10)) {
        this.QuizzApp.objStatistics.changeRightQuestions(null);
        this.QuizzApp.objParseModule.setAnswerRightQuestLocalStorage(this.getActiveQuestionIndex());
        this.nextQuestion();
    } else {
        this.QuizzApp.objParseModule.setAnswerWrongQuestLocalStorage(this.getActiveQuestionIndex());
        this.QuizzApp.objStatistics.changeWrongQuestions(null);
        this.setWrongContent();
        this.$floatWindows.show();
    }

    this.QuizzApp.objParseModule.stringifyStorage();
};

QuestionModule.prototype.setWrongContent = function () {
    this.$wrongContent.html('<p class="wrong">Вы ответили не правильно!</p>' +
        '<p>Правильный ответ:<br><span class="right">' + quizData[this.getIndexActiveTest()].questions[this.getActiveQuestionIndex()].answers[quizData[this.indexActiveTest].questions[this.activeQuestionIndex].right - 1] +
        '</span></p>');
};

QuestionModule.prototype.setAnsweredQuestion = function () {
    quizData[this.getIndexActiveTest()].questions[this.getActiveQuestionIndex()].answeredQuestion = true;
    ++this.countAnsweredQuestion;
};

QuestionModule.prototype.nextBuildQuestion = function () {
    var id = this.getNextActiveQuestionIndex(this.getActiveQuestionIndex());
    this.QuizzApp.objRouter.setRouter(this.getIndexActiveTest(), id);
};

QuestionModule.prototype.clickSkipButton = function () {
    this.nextBuildQuestion();
};

QuestionModule.prototype.reset = function () {
    Utils.JSONppdLocalStorageReset();
    this.setFlagPassedTestLocalStorage(this.QuizzApp.objParseModule);
    this.setFlagPassedTest(this.QuizzApp.objParseModule);
    this.resetTest();
};

QuestionModule.prototype.nextQuestion = function () {
    if (this.countAnsweredQuestion < quizData[this.getIndexActiveTest()].questions.length) {
        this.$floatWindows.hide();
        this.nextBuildQuestion();
    } else if (this.countAnsweredQuestion === quizData[this.getIndexActiveTest()].questions.length) {
        var self = this;

        this.$wrongContent.html(this.QuizzApp.objStatistics.getWrongWindowsStatic());

        if (self.$('.repeat', this.$appWrapper).length) {
            self.$('.repeat', this.$appWrapper).on('click', function (evt) {
                self.repeatTest(evt)
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


QuestionModule.prototype.closedTest = function () {
    this.$listAnswers.empty();
    this.$floatWindows.hide();
    Utils.JSONppdLocalStorageReset();
    this.QuizzApp.objRouter.clearHash();
    this.resetTest();


};

QuestionModule.prototype.addEventListenerExitTest = function () {
    var self = this;
    self.$('.exitTest', this.$appWrapper).on('click', function (evt) {
        evt.preventDefault();
        self.closedTest();
        return false;
    });
};


QuestionModule.prototype.addEventListenerUL = function ($ul) {
    var self = this;
    $ul.on('click', function (evt) {
        evt.preventDefault();
        self.listTestEvent(evt);
        return false;
    });
};

QuestionModule.prototype.addEventListenerContentQuestion = function () {

    this.$contentQuestion.on('click',  {self: this}, function(event){
        if(event.target.className === 'skipAnswerButton'){
            event.data.self.clickSkipButton();
        }else if(event.target.className === 'answer'){
            event.data.self.clickNextButton(event.target.getAttribute('data-answers'));
        }
    });

};

QuestionModule.prototype.addEventListenerClosedWindows = function () {
    var self = this;

    self.$closedWindows.on('click', function (evt) {
        self.nextQuestion(evt);
        return false;
    });
};

QuestionModule.prototype.resetTestPassed = function(){
    this.QuizzApp.objParseModule.resetTestPassed();
    this.QuizzApp.objParseModule.stringifyStorage();
    this.setFlagPassedTest(this.QuizzApp.objParseModule);
};

QuestionModule.prototype.addEventListenerResetPassedTest = function(){
    var self = this;
    self.$resetTestPassed.on('click', function(){
        self.resetTestPassed();
        return false;
    });
};

QuestionModule.prototype.buildTestWidget = function () {
    var source = this.$.trim(this.$('#widgetTemplate').html());
    var template = Handlebars.compile(source)
    this.$widget.append(template({
        countQuestions: 0,
        activeQuestions: 0,
        countRight: 0,
        countWrong: 0
    }));
};

QuestionModule.prototype.createListTest = function () {
    var source = this.$.trim(this.$('#testListTitleTemplate').html());
    var template = Handlebars.compile(source);
    var content = template({list: quizData});
    this.$listTestName.append(content);

    this.addEventListenerUL(this.$listTestName.children('ul'));

    this.addEventListenerContentQuestion();

    this.addEventListenerClosedWindows();

    this.addEventListenerResetPassedTest();

    this.addEventListenerExitTest();

    this.QuizzApp.objRouter.addEventListenerHash();

};

QuestionModule.prototype.buildQuestionIFexit = function (objParseModule, objStatistics) {

    if (JSON.parse(localStorage.getItem('JSONppdLocalStorage'))) {
        objParseModule.parseStorage();
    } else {
        objParseModule.stringifyStorage();
    }

    if (objParseModule.getTestId() !== null) {

        for (var id = 0; id < objParseModule.getAnsweredRightQuestion().length; ++id) {
            quizData[objParseModule.getTestId()].questions[objParseModule.getAnsweredRightQuestion()[id]].answeredQuestion = true;
        }

        for (var id = 0; id < objParseModule.getAnsweredWrongQuestion().length; ++id) {
            quizData[objParseModule.getTestId()].questions[objParseModule.getAnsweredWrongQuestion()[id]].answeredQuestion = true;
        }

        this.setCountAnsweredQuestion(objParseModule.getAnsweredRightQuestion().length + objParseModule.getAnsweredWrongQuestion().length);
        this.setIndexActiveTest(objParseModule.getTestId());

        objStatistics.changeRightQuestions(objParseModule.getAnsweredRightQuestion().length);
        objStatistics.changeWrongQuestions(objParseModule.getAnsweredWrongQuestion().length);
        objStatistics.changeActiveQuestion(objParseModule.getQuestionID());
        objStatistics.changeCountQuestion(this.getCountQuestion());

        this.setActiveQuestionIndex(objParseModule.getQuestionID());

        this.buildQuestion();

        this.QuizzApp.objRouter.checkPassedQuestion(this.getIndexActiveTest(), this.getActiveQuestionIndex());


        this.$contentQuestions.show();
        this.$testList.hide();

    }else{
        this.$contentQuestions.hide();
        this.$testList.show();
    }
};

QuestionModule.prototype.resetTest = function () {
    this.$contentQuestions.hide();
    this.$testList.show();
    this.$testList.addClass('testList');
    Utils.resetFlagsANDanswers(this);
};

QuestionModule.prototype.setFlagPassedTestLocalStorage = function (objParseModule) {
    objParseModule.parseStorage();
    objParseModule.setPassedTests(this.indexActiveTest);
    objParseModule.stringifyStorage();
};

QuestionModule.prototype.setFlagPassedTest = function (objParseModule) {
    var arrayTest = objParseModule.getPassedTests();
    var $passedTest =  this.$('span' ,this.$listTestName);

    for (var i = 0; i < $passedTest.length; ++i) {
        $passedTest.eq(i).html('');
    }

    for (var i = 0; i < arrayTest.length; ++i) {
        $passedTest.eq(i).html('&#10004');
    }
};