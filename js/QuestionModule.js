function QuestionModule(appWrapper, QuizzApp, quizData) {
    this.quizData = quizData;

    this.$appWrapper = appWrapper;
    this.QuizzApp = QuizzApp;

    this.activeQuestionIndex = 0;
    this.indexActiveTest = 0;
    this.countAnsweredQuestion = 0;

    this.$widget = $('.widget', this.$appWrapper);

    this.$ajaxLoader = $('.ajaxLoader', this.$appWrapper);

    this.$contentQuestions = $('.contentQuestions', this.$appWrapper);
    this.$contentQuestion = $('.contentQuestion', this.$appWrapper);

    this.$resetTestPassed = $('.resetTestPassed', this.$appWrapper);
    this.$listTestName = $('.namesTest', this.$appWrapper);

    this.$floatWindows = $('.floatWindows' ,this.$appWrapper);
    this.$closedWindows = $('.closed', this.$appWrapper);
    this.$wrongContent = $('.wrongContent', this.$appWrapper);
    this.$testList = $('.testList', this.$appWrapper);

    this.$listAnswers = $('.listAnswers', this.$appWrapper);
}

QuestionModule.prototype.getIndexActiveTest = function(){
    return this.indexActiveTest;
};

QuestionModule.prototype.setIndexActiveTest = function (indexActive) {
    this.indexActiveTest = indexActive;

    this.QuizzApp.objParseModule.setTestId(indexActive);
    this.QuizzApp.objParseModule.stringifyStorage();

};

QuestionModule.prototype.hiddenAjaxLoader = function(){
    this.$ajaxLoader.hide();
};

QuestionModule.prototype.setCountAnsweredQuestion = function (countAnsweredQuestion) {
    this.countAnsweredQuestion = countAnsweredQuestion;
};

QuestionModule.prototype.getCountQuestion = function () {
    return this.quizData[this.getIndexActiveTest()].questions.length;
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
    Utils.JSONppdLocalStorageRepeat(this.QuizzApp.objParseModule);
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
    var source = $('#questionTemplate').html();
    var template = Handlebars.compile(source);
    this.$contentQuestion.html(template({
        title: this.quizData[this.getIndexActiveTest()].title,
        question: this.quizData[this.getIndexActiveTest()].questions[this.getActiveQuestionIndex()].question,
        questionImg: this.quizData[this.getIndexActiveTest()].questions[this.getActiveQuestionIndex()].questionImg,
        listAnswer: this.quizData[this.getIndexActiveTest()].questions[this.getActiveQuestionIndex()].answers,
        skipAnswerButton: this.getSkipAnswerButtonFlag()
    }));
};

QuestionModule.prototype.getNextActiveQuestionIndex = function (idx) {
    do {
        idx = ++idx > (this.quizData[this.getIndexActiveTest()].questions.length - 1) ? 0 : idx;
    } while (this.quizData[this.getIndexActiveTest()].questions[idx].answeredQuestion);

    return idx;

};

QuestionModule.prototype.clickNextButton = function (answerID) {

    this.setAnsweredQuestion();

    if ((++answerID) === parseInt(this.quizData[this.getIndexActiveTest()].questions[this.getActiveQuestionIndex()].right, 10)) {
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
    this.$wrongContent.html('<p class="statisticsWrong">Вы ответили не правильно!</p>' +
        '<p class="statisticsRight">Правильный ответ:</p>' +
        '<p>' + this.quizData[this.getIndexActiveTest()]
        .questions[this.getActiveQuestionIndex()]
        .answers[this.quizData[this.getIndexActiveTest()]
        .questions[this.getActiveQuestionIndex()].right - 1] +
        '</p>');
};

QuestionModule.prototype.setAnsweredQuestion = function () {
    this.quizData[this.getIndexActiveTest()].questions[this.getActiveQuestionIndex()].answeredQuestion = true;
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
    Utils.JSONppdLocalStorageReset(this.QuizzApp.objParseModule);
    this.setFlagPassedTestLocalStorage(this.QuizzApp.objParseModule);
    this.setFlagPassedTest(this.QuizzApp.objParseModule);
    this.resetTest();
};

QuestionModule.prototype.nextQuestion = function () {
    if (this.countAnsweredQuestion < this.quizData[this.getIndexActiveTest()].questions.length) {
        this.$floatWindows.hide();
        this.nextBuildQuestion();
    } else if (this.countAnsweredQuestion === this.quizData[this.getIndexActiveTest()].questions.length) {
        var self = this;

        this.$wrongContent.html(this.QuizzApp.objStatistics.getWrongWindowsStatic());

        if ($('.repeat', this.$appWrapper).length) {
            $('.repeat', this.$appWrapper).on('click', function (evt) {
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
    Utils.JSONppdLocalStorageReset(this.QuizzApp.objParseModule);
    this.QuizzApp.objRouter.clearHash();
    this.resetTest();
};

QuestionModule.prototype.addEventListenerExitTest = function () {
    var self = this;
    $('.exitTest', this.$appWrapper).on('click', function (evt) {
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
    var source = $('#widgetTemplate').html();
    var template = Handlebars.compile(source)
    this.$widget.append(template({
        countQuestions: 0,
        activeQuestions: 0,
        countRight: 0,
        countWrong: 0
    }));
    this.$widget.show();
};

QuestionModule.prototype.createListTest = function () {
    var source = $('#testListTitleTemplate').html();
    var template = Handlebars.compile(source);
    var content = template({list: this.quizData});
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
            this.quizData[objParseModule.getTestId()].questions[objParseModule.getAnsweredRightQuestion()[id]].answeredQuestion = true;
        }

        for (var id = 0; id < objParseModule.getAnsweredWrongQuestion().length; ++id) {
            this.quizData[objParseModule.getTestId()].questions[objParseModule.getAnsweredWrongQuestion()[id]].answeredQuestion = true;
        }

        if((objParseModule.getAnsweredWrongQuestion().length +  objParseModule.getAnsweredRightQuestion().length) !== this.getCountQuestion()){
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
            Utils.resetFlagsANDanswers(this);
            Utils.JSONppdLocalStorageANDRightdWrongReset(objParseModule);
            Utils.JSONppdLocalStorageReset(objParseModule);
            this.setFlagPassedTestLocalStorage(objParseModule);
            this.$contentQuestions.hide();
            this.$testList.show();
        }
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
    objParseModule.setPassedTests(this.getIndexActiveTest());
    objParseModule.stringifyStorage();
};

QuestionModule.prototype.setFlagPassedTest = function (objParseModule) {
    var $passedTest =  $('span' ,this.$listTestName);

    _.each( $passedTest,function(num, key){
        $passedTest.eq(key).html('');
    });

    _.each(objParseModule.getPassedTests(), function(num, key){
        $passedTest.eq(key).html('&#10004');
    });

};