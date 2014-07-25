function QuestionModule(appWrapper) {
    this.$appWrapper = appWrapper;

    this.activeQuestionIndex = 0;
    this.indexActiveTest = 0;
    this.countAnsweredQuestion = 0;

    this.$img = null;

    this.$resetTestPassed = $('.resetTestPassed', this.$appWrapper);
    this.$exitTest = $('.exitTest' ,this.$appWrapper);
    this.$listTestName = $('.namesTest', this.$appWrapper);
    this.$hidden = $('.hidden', this.$appWrapper).eq(0);
    this.$floatWindows = $('.hidden' ,this.$appWrapper).eq(1);
    this.$closedWindows = $('.closed', this.$appWrapper);
    this.$wrongContent = $('.wrongContent', this.$appWrapper);
    this.$testList = $('.testList', this.$appWrapper);
    this.$activeQuestions = $('.activeQuestions', this.$appWrapper);
    this.$contentQuestions = $('.content', this.$appWrapper);
    this.$imgQuestions = $('.imgQuestions', this.$appWrapper);
    this.$button = $('.button', this.$appWrapper);
    this.$listAnswers = $('.listAnswers', this.$appWrapper);
    this.$skipAnswerButton = $('.skipAnswerButton', this.$appWrapper);
    this.$answerButton = $('.answerButton', this.$appWrapper);
}

QuestionModule.prototype.getIndexActiveTest = function(){
    return this.indexActiveTest;
};

QuestionModule.prototype.setIndexActiveTest = function (indexActive) {
    this.indexActiveTest = indexActive;

    app.objParseModule.setTestId(indexActive);
    app.objParseModule.stringifyStorage();

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
        app.objStatistics.testWidget(target.getAttribute('data-id-question'));
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
    app.objStatistics.testWidget(this.indexActiveTest);
    app.objRouter.clearHash();
    app.objRouter.setRouter(this.indexActiveTest, 0);
};

QuestionModule.prototype.getContentLI = function (id, listAnswers) {
    if (parseInt(id, 10) === 0) {
        return $('<li><input type="radio" name="answer" value="'+id+'" checked=true >'+listAnswers+'</li>');
    }
    return  $('<li><input type="radio" name="answer" value="'+id+'" >'+listAnswers+'</li>');
};

QuestionModule.prototype.getContentUL = function (listAnswers) {
    var $ul = $('<ul/>');
    for (var id = 0; id < listAnswers.length; ++id) {
        $ul.append(this.getContentLI(id, listAnswers[id]));
    }
    return $ul;
};

QuestionModule.prototype.buildQuestion = function (indexActive) {
    this.activeQuestionIndex = indexActive;
    this.$activeQuestions.text(this.activeQuestionIndex + 1);
    this.$contentQuestions.text(quizData[this.indexActiveTest].questions[this.activeQuestionIndex].question);

    try {
        if (this.$img === null && quizData[this.indexActiveTest].questions[this.activeQuestionIndex].questionImg) {
            this.$img = $('<img/>').attr('src', quizData[this.indexActiveTest].questions[this.activeQuestionIndex].questionImg);
            this.$imgQuestions.append(this.$img);
        } else if (quizData[this.indexActiveTest].questions[this.activeQuestionIndex].questionImg) {
            this.$img.attr('src',  quizData[this.indexActiveTest].questions[this.activeQuestionIndex].questionImg);
            this.$img.removeClass('hidden');
        } else if (!quizData[this.indexActiveTest].questions[this.activeQuestionIndex].questionImg && this.$img) {
            this.$img.addClass('hidden');
        }
    } catch (e) {
        console.log(e.message);
    }
    this.$listAnswers.append(this.getContentUL(quizData[this.indexActiveTest].questions[this.activeQuestionIndex].answers));
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
    var $answerID = parseInt($('input:radio[name=answer]:checked').val(),10);

    this.setAnsweredQuestion();

    if ((++$answerID) === parseInt(quizData[this.indexActiveTest].questions[this.activeQuestionIndex].right, 10)) {
        app.objStatistics.showRightQuestions(++app.objStatistics.rightQuestions);
        app.objParseModule.setAnswerRightQuestLocalStorage(this.activeQuestionIndex);
        this.nextQuestion();
    } else {
        app.objParseModule.setAnswerWrongQuestLocalStorage(this.activeQuestionIndex);
        app.objStatistics.showWrongQuestions(++app.objStatistics.wrongQuestions);
        this.setWrongContent();
        this.$floatWindows.removeClass('hidden');
    }

    app.objParseModule.stringifyStorage();
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
    app.objRouter.setRouter(this.indexActiveTest, id);
};

QuestionModule.prototype.clickSkipButton = function () {
    this.nextBuildQuestion();
};

QuestionModule.prototype.reset = function () {
    Utils.JSONppdLocalStorageReset();
    this.setFlagPassedTestLocalStorage(app.objParseModule);
    this.setFlagPassedTest(app.objParseModule);
    this.resetTest();
};

QuestionModule.prototype.nextQuestion = function () {
    if (this.countAnsweredQuestion < quizData[this.indexActiveTest].questions.length) {
        this.$floatWindows.addClass('hidden');
        this.nextBuildQuestion();
    } else if (this.countAnsweredQuestion === quizData[this.indexActiveTest].questions.length) {
        var self = this;

        this.$wrongContent.html(app.objStatistics.getWrongWindowsStatic());

        if ($('.repeat').length) {
            $('.repeat', this.$appWrapper).on('click', function (evt) {
                self.repeatTest(evt)
                return false;
            });
        }
        this.$floatWindows.removeClass('hidden');
        ++this.countAnsweredQuestion;
    } else {
        this.$listAnswers.empty();
        this.$floatWindows.addClass('hidden');
        app.objRouter.clearHash();
        this.reset();
    }
};


QuestionModule.prototype.closedTest = function () {
    this.$listAnswers.empty();
    this.$floatWindows.addClass('hidden');
    Utils.JSONppdLocalStorageReset();
    app.objRouter.clearHash();
    this.resetTest();


};

QuestionModule.prototype.addEventListenerExitTest = function () {
    var self = this;
    self.$exitTest.on('click', function (evt) {
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
    app.objParseModule.resetTestPassed();
    app.objParseModule.stringifyStorage();
    this.setFlagPassedTest(app.objParseModule);
};

QuestionModule.prototype.addEventListenerResetPassedTest = function(){
    var self = this;
    self.$resetTestPassed.on('click', function(){
        self.resetTestPassed();
        return false;
    });
};

QuestionModule.prototype.createListTest = function () {
    var $ul = $('<ul/>');

    for (var testId in quizData) {
        var $li = $('<li>' +
            '<a href="" data-id-question ='+testId+'>'+quizData[testId].title+'</a>'+
            '<span></span>' +
            '</li>');
        $ul.append($li);
    }

    this.$listTestName.append($ul);

    this.addEventListenerUL($ul);

    this.addEventListenerExitTest();

    this.addEventListenerButton();

    this.addEventListenerClosedWindows();

    this.addEventListenerResetPassedTest();

    app.objRouter.addEventListenerHash();

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

        objStatistics.setRightQuestions(objParseModule.getAnsweredRightQuestion().length);
        objStatistics.setWrongQuestions(objParseModule.getAnsweredWrongQuestion().length);
        objStatistics.testWidget(objParseModule.getTestId());

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
    var $passedTest =  $('span' ,this.$listTestName);

    for (var i = 0; i < $passedTest.length; ++i) {
        $passedTest.eq(i).html('');
    }

    for (var i = 0; i < arrayTest.length; ++i) {
        $passedTest.eq(i).html('&#10004');
    }
};