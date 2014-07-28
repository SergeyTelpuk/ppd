function QuestionModule(appWrapper, QuizzApp, $) {
    this.$ = $;
    this.$appWrapper = appWrapper;
    this.QuizzApp = QuizzApp;

    this.activeQuestionIndex = 0;
    this.indexActiveTest = 0;
    this.countAnsweredQuestion = 0;

    this.$img = null;

    this.$widget = this.$('.widget', this.$appWrapper);

    this.$resetTestPassed = this.$('.resetTestPassed', this.$appWrapper);
    this.$listTestName = this.$('.namesTest', this.$appWrapper);
    this.$hidden = this.$('.hidden', this.$appWrapper).eq(0);
    this.$floatWindows = this.$('.hidden' ,this.$appWrapper).eq(1);
    this.$closedWindows = this.$('.closed', this.$appWrapper);
    this.$wrongContent = this.$('.wrongContent', this.$appWrapper);
    this.$testList = this.$('.testList', this.$appWrapper);
    this.$contentQuestions = this.$('.content', this.$appWrapper);
    this.$imgQuestions = this.$('.imgQuestions', this.$appWrapper);
    this.$button = this.$('.button', this.$appWrapper);
    this.$listAnswers = this.$('.listAnswers', this.$appWrapper);
    this.$skipAnswerButton = this.$('.skipAnswerButton', this.$appWrapper);
    this.$answerButton = this.$('.answerButton', this.$appWrapper);
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


QuestionModule.prototype.buildOneQuestion = function(){
    if(!app.objRouter.getFlagRouterHash()){
        this.buildQuestion(0);
    }else{
        location.hash = 'test/' + (parseInt(this.getIndexActiveTest(),10) + 1) + '/' + 1;
    }
};

QuestionModule.prototype.listTestEvent = function (evt) {
    var target = evt.target;

    if (target.tagName.toUpperCase() === 'A') {
        this.setIndexActiveTest(target.getAttribute('data-id-question'));
        this.buildOneQuestion();
        this.$testList.addClass('hidden');
        this.$hidden.removeClass('hidden');
    }
};

QuestionModule.prototype.buttonTestEvent = function (evt) {
    var target = evt.target;

    if (target.className === 'answerButton') {
        this.clickNextButton();
    } else if (target.className === 'skipAnswerButton') {
        this.clickSkipButton();
    }
};

QuestionModule.prototype.repeatTest = function (evt) {
    Utils.resetFlagsANDanswers(this);
    this.$floatWindows.addClass('hidden');

    this.$skipAnswerButton.removeClass('hidden');
    this.$listAnswers.empty();
    Utils.JSONppdLocalStorageRepeat();
    this.QuizzApp.objRouter.clearHash();
    this.QuizzApp.objRouter.setRouter(this.getIndexActiveTest(), this.getActiveQuestionIndex());
};

QuestionModule.prototype.getContentLI = function (id, listAnswers) {
    if (parseInt(id, 10) === 0) {
        return this.$('<li><input type="radio" name="answer" value="'+id+'" checked=true >'+listAnswers+'</li>');
    }
    return  this.$('<li><input type="radio" name="answer" value="'+id+'" >'+listAnswers+'</li>');
};

QuestionModule.prototype.getContentUL = function (listAnswers) {
    var $ul = this.$('<ul/>');
    for (var id = 0; id < listAnswers.length; ++id) {
        $ul.append(this.getContentLI(id, listAnswers[id]));
    }
    return $ul;
};

QuestionModule.prototype.getActiveQuestionIndex = function(){
    return  parseInt(this.activeQuestionIndex,10);
};
QuestionModule.prototype.setActiveQuestionIndex = function(indexActiveQuestion){
    this.activeQuestionIndex = parseInt(indexActiveQuestion, 10);
};


QuestionModule.prototype.buildQuestion = function (indexActiveQuestion) {

    this.setActiveQuestionIndex(indexActiveQuestion);

//    var source = $.trim($('#questionTemplate').html());
//    var template = Handlebars.compile(source);
//    console.log(template);


    //this.$activeQuestions.text(this.activeQuestionIndex + 1);

    this.$contentQuestions.text(quizData[this.getIndexActiveTest()].questions[this.getActiveQuestionIndex()].question);

    try {
        if (this.$img === null && quizData[this.getIndexActiveTest()].questions[this.getActiveQuestionIndex()].questionImg) {
            this.$img = this.$('<img/>').attr('src', quizData[this.getIndexActiveTest()].questions[this.getActiveQuestionIndex()].questionImg);
            this.$imgQuestions.append(this.$img);
        } else if (quizData[this.getIndexActiveTest()].questions[this.getActiveQuestionIndex()].questionImg) {
            this.$img.attr('src',  quizData[this.indexActiveTest].questions[this.getActiveQuestionIndex()].questionImg);
            this.$img.removeClass('hidden');
        } else if (!quizData[this.indexActiveTest].questions[this.getActiveQuestionIndex()].questionImg && this.$img) {
            this.$img.addClass('hidden');
        }
    } catch (e) {
        console.log(e.message);
    }

    this.$listAnswers.append(this.getContentUL(quizData[this.getIndexActiveTest()].questions[this.getActiveQuestionIndex()].answers));
};

QuestionModule.prototype.hiddenButtonSkip = function () {
    if (this.countAnsweredQuestion === quizData[this.indexActiveTest].questions.length - 1) {
        this.$skipAnswerButton.addClass('hidden');
    }
};

QuestionModule.prototype.getNextActiveQuestionIndex = function (idx) {
    this.hiddenButtonSkip();

    do {
        idx = ++idx > (quizData[this.indexActiveTest].questions.length - 1) ? 0 : idx;
    } while (quizData[this.indexActiveTest].questions[idx].answeredQuestion);

    return idx;

};

QuestionModule.prototype.clickNextButton = function () {
    var $answerID = parseInt(this.$('input:radio[name=answer]:checked').val(),10);

    this.setAnsweredQuestion();

    if ((++$answerID) === parseInt(quizData[this.indexActiveTest].questions[this.activeQuestionIndex].right, 10)) {
        this.QuizzApp.objStatistics.changeRightQuestions(null);
        this.QuizzApp.objParseModule.setAnswerRightQuestLocalStorage(this.getActiveQuestionIndex());
        this.nextQuestion();
    } else {
        this.QuizzApp.objParseModule.setAnswerWrongQuestLocalStorage(this.getActiveQuestionIndex());
        this.QuizzApp.objStatistics.changeWrongQuestions(null);
        this.setWrongContent();
        this.$floatWindows.removeClass('hidden');
    }

    this.QuizzApp.objParseModule.stringifyStorage();
};

QuestionModule.prototype.setWrongContent = function () {
    this.$wrongContent.html('<p class="wrong">Вы ответили не правильно!</p>' +
        '<p>Правильный ответ:<br><span class="right">' + quizData[this.indexActiveTest].questions[this.activeQuestionIndex].answers[quizData[this.indexActiveTest].questions[this.activeQuestionIndex].right - 1] +
        '</span></p>');
};

QuestionModule.prototype.setAnsweredQuestion = function () {
    quizData[this.indexActiveTest].questions[this.activeQuestionIndex].answeredQuestion = true;
    ++this.countAnsweredQuestion;
};

QuestionModule.prototype.nextBuildQuestion = function () {
    var id = this.getNextActiveQuestionIndex(this.activeQuestionIndex);
    this.QuizzApp.objRouter.setRouter(this.indexActiveTest, id);
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
    if (this.countAnsweredQuestion < quizData[this.indexActiveTest].questions.length) {
        this.$floatWindows.addClass('hidden');
        this.nextBuildQuestion();
    } else if (this.countAnsweredQuestion === quizData[this.indexActiveTest].questions.length) {
        var self = this;

        this.$wrongContent.html(this.QuizzApp.objStatistics.getWrongWindowsStatic());

        if (self.$('.repeat', this.$appWrapper).length) {
            self.$('.repeat', this.$appWrapper).on('click', function (evt) {
                self.repeatTest(evt)
                return false;
            });
        }
        this.$floatWindows.removeClass('hidden');
        ++this.countAnsweredQuestion;
    } else {
        this.$listAnswers.empty();
        this.$floatWindows.addClass('hidden');
        this.QuizzApp.objRouter.clearHash();
        this.reset();
    }
};


QuestionModule.prototype.closedTest = function () {
    this.$listAnswers.empty();
    this.$floatWindows.addClass('hidden');
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

QuestionModule.prototype.addEventListenerButton = function () {
    var self = this;
    self.$button.on('click', function (evt) {
        self.buttonTestEvent(evt);
        return false;
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
    var source = this.$.trim($('#testListTitleTemplate').html());
    var template = Handlebars.compile(source);
    var content = template({list: quizData});
    this.$listTestName.append(content);

    this.addEventListenerUL(this.$listTestName.children('ul'));


    this.addEventListenerButton();

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

        for (var id = 0; id < objParseModule.getAnsweredWrongQuestion(); ++id) {
            quizData[objParseModule.getTestId()].questions[objParseModule.getAnsweredWrongQuestion()[id]].answeredQuestion = true;
        }

        this.setCountAnsweredQuestion(objParseModule.getAnsweredRightQuestion().length + objParseModule.getAnsweredWrongQuestion().length);
        this.setIndexActiveTest(objParseModule.getTestId());
        this.hiddenButtonSkip();

        objStatistics.changeRightQuestions(objParseModule.getAnsweredRightQuestion().length);
        objStatistics.changeWrongQuestions(objParseModule.getAnsweredWrongQuestion().length);
        objStatistics.changeActiveQuestion(objParseModule.getQuestionID());

        this.buildQuestion(objParseModule.getQuestionID());

        this.$testList.addClass('hidden');
        this.$hidden.removeClass('hidden');
    }
};

QuestionModule.prototype.resetTest = function () {
    this.$hidden.addClass('hidden');
    this.$testList.removeClass('hidden');

    this.$testList.addClass('testList');
    this.$skipAnswerButton.removeClass('hidden');
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