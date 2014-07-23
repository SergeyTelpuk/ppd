function QuestionModule(appWrapper) {

    this.appWrapper = appWrapper;

    this.activeQuestionIndex = 0;
    this.indexActiveTest = 0;
    this.countAnsweredQuestion = 0;

    this.img = null;
    this.exitTest = this.appWrapper.getElementsByClassName('exitTest')[0];
    this.listTestName = this.appWrapper.getElementsByClassName('namesTest')[0];
    this.hidden = this.appWrapper.getElementsByClassName('hidden')[0];
    this.floatWindows = this.appWrapper.getElementsByClassName('hidden')[1];
    this.closedWindows = this.appWrapper.getElementsByClassName('closed')[0];
    this.wrongContent = this.appWrapper.getElementsByClassName('wrongContent')[0];
    this.testList = this.appWrapper.getElementsByClassName('testList')[0];
    this.activeQuestions = this.appWrapper.getElementsByClassName('activeQuestions')[0];
    this.contentQuestions = this.appWrapper.getElementsByClassName('content')[0];
    this.imgQuestions = this.appWrapper.getElementsByClassName('imgQuestions')[0];
    this.button = this.appWrapper.getElementsByClassName('button')[0];
    this.listAnswers = this.appWrapper.getElementsByClassName('listAnswers')[0];
    this.skipAnswerButton = this.appWrapper.getElementsByClassName('skipAnswerButton')[0];
}

QuestionModule.prototype.getIndexActiveTest = function(){
//    return  this.floatWindows;
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
    if(!Router.getFlagRouterHash()){
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
        Utils.addClass(this.testList,'hidden');
        Utils.removeClass(this.hidden, 'hidden');
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
    Utils.addClass(this.floatWindows, 'hidden');
    Utils.removeClass(this.skipAnswerButton, 'hidden');
    Utils.deleteOptionsQuestion(this.listAnswers, this.listAnswers.firstChild);
    Utils.JSONppdLocalStorageRepeat();
    app.objStatistics.testWidget(this.indexActiveTest);
    Router.clearHash();
    Router.setRouter(this.indexActiveTest, 0);
};

QuestionModule.prototype.getContentLI = function (id, listAnswers) {
    var li = document.createElement('LI');
    var input = document.createElement('INPUT');
    var textAnswers = document.createTextNode(listAnswers);
    input.setAttribute('type', 'radio');
    input.setAttribute('name', 'answer');
    input.setAttribute('value', id);
    if (parseInt(id, 10) === 0) {
        input.setAttribute('checked', 'true');
    }
    li.appendChild(textAnswers);
    li.appendChild(input);
    li.appendChild(textAnswers);
    return li;
};

QuestionModule.prototype.getContentUL = function (listAnswers) {
    var ul = document.createElement('UL');
    for (var id = 0; id < listAnswers.length; ++id) {
        var li = this.getContentLI(id, listAnswers[id]);
        ul.appendChild(li);
    }
    return ul;
};

QuestionModule.prototype.buildQuestion = function (indexActive) {
    this.activeQuestionIndex = indexActive;
    this.activeQuestions.innerText = this.activeQuestionIndex + 1;
    this.contentQuestions.innerText = quizData[this.indexActiveTest].questions[this.activeQuestionIndex].question;

    try {
        if (this.img === null && quizData[this.indexActiveTest].questions[this.activeQuestionIndex].questionImg) {
            this.img = document.createElement('IMG');
            this.img.src = quizData[this.indexActiveTest].questions[this.activeQuestionIndex].questionImg;
            this.imgQuestions.appendChild(this.img);
        } else if (quizData[this.indexActiveTest].questions[this.activeQuestionIndex].questionImg) {
            this.img.src = quizData[this.indexActiveTest].questions[this.activeQuestionIndex].questionImg;
            if (this.img.className === 'hidden') {
                Utils.removeClass(this.img, 'hidden');
            }
        } else if (!quizData[this.indexActiveTest].questions[this.activeQuestionIndex].questionImg && this.img) {
            Utils.addClass(this.img, 'hidden');
        }
    } catch (e) {
        console.log(e.message);
    }

    this.listAnswers.appendChild(this.getContentUL(quizData[this.indexActiveTest].questions[this.activeQuestionIndex].answers));
};

QuestionModule.prototype.hiddenButtonSkip = function () {
    if (this.countAnsweredQuestion === quizData[this.indexActiveTest].questions.length - 1) {
        Utils.addClass(this.skipAnswerButton, 'hidden');
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
    var inputListRadio = this.listAnswers.getElementsByTagName('input');
    this.setAnsweredQuestion();

    for (var idInput = 0; idInput < inputListRadio.length; ++idInput) {
        if (inputListRadio[idInput].checked) {
            var answer = parseInt(inputListRadio[idInput].value, 10);
            if ((++answer) === parseInt(quizData[this.indexActiveTest].questions[this.activeQuestionIndex].right, 10)) {
                app.objStatistics.showRightQuestions(++app.objStatistics.rightQuestions);
                app.objParseModule.setAnswerRightQuestLocalStorage(this.activeQuestionIndex);
                this.nextQuestion();
            } else {
                app.objParseModule.setAnswerWrongQuestLocalStorage(this.activeQuestionIndex);
                app.objStatistics.showWrongQuestions(++app.objStatistics.wrongQuestions);
                this.setWrongContent();
                Utils.removeClass(this.floatWindows, 'hidden');
            }
        }
    }
    app.objParseModule.stringifyStorage();
};

QuestionModule.prototype.setWrongContent = function () {
    this.wrongContent.innerHTML = '<p class="wrong">Вы ответили не правильно!</p>' +
        '<p>Правильный ответ:<br><span class="right">' + quizData[this.indexActiveTest].questions[this.activeQuestionIndex].answers[quizData[this.indexActiveTest].questions[this.activeQuestionIndex].right - 1] +
        '</span></p>';
};

QuestionModule.prototype.setAnsweredQuestion = function () {
    quizData[this.indexActiveTest].questions[this.activeQuestionIndex].answeredQuestion = true;
    ++this.countAnsweredQuestion;
};

QuestionModule.prototype.nextBuildQuestion = function () {
    var id = this.getNextActiveQuestionIndex(this.activeQuestionIndex);
    Router.setRouter(this.indexActiveTest, id);
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

QuestionModule.prototype.nextQuestion = function (evt) {
    if (this.countAnsweredQuestion < quizData[this.indexActiveTest].questions.length) {
        Utils.addClass(this.floatWindows, 'hidden');
        this.nextBuildQuestion();
    } else if (this.countAnsweredQuestion === quizData[this.indexActiveTest].questions.length) {
        var self = this;

        this.wrongContent.innerHTML = app.objStatistics.getWrongWindowsStatic();

        if (this.appWrapper.getElementsByClassName('repeat')[0]) {
            this.appWrapper.getElementsByClassName('repeat')[0].addEventListener('click', function (evt) {
                self.repeatTest(evt)
                return false;
            });
        }
        Utils.removeClass(this.floatWindows, 'hidden');
        ++this.countAnsweredQuestion;
    } else {
        Utils.deleteOptionsQuestion(this.listAnswers, this.listAnswers.firstChild);
        Utils.addClass(this.floatWindows, 'hidden');
        Router.clearHash();
        this.reset();
    }
};


QuestionModule.prototype.closedTest = function () {
    Utils.deleteOptionsQuestion(this.listAnswers, this.listAnswers.firstChild);
    Utils.addClass(this.floatWindows, 'hidden');
    Utils.JSONppdLocalStorageReset();
    Router.clearHash();
    this.resetTest();


};

QuestionModule.prototype.addEventListenerExitTest = function () {
    var self = this;
    self.exitTest.addEventListener('click', function (evt) {
        evt.preventDefault();
        self.closedTest(evt);
        return false;
    });
};


QuestionModule.prototype.addEventListenerUL = function (ul) {
    var self = this;
    ul.addEventListener('click', function (evt) {
        evt.preventDefault();
        self.listTestEvent(evt);
        return false;
    });
};

QuestionModule.prototype.addEventListenerButton = function () {
    var self = this;
    self.button.addEventListener('click', function (evt) {
        self.buttonTestEvent(evt);
        return false;
    });
};

QuestionModule.prototype.addEventListenerClosedWindows = function () {
    var self = this;

    self.closedWindows.addEventListener('click', function (evt) {
        self.nextQuestion(evt);
        return false;
    });
};

QuestionModule.prototype.createListTest = function () {
    var ul = document.createElement('UL');

    this.listTestName.appendChild(ul);

    for (var testId in quizData) {
        var text = document.createTextNode(quizData[testId].title);
        var li = document.createElement('LI');
        var a = document.createElement('A');
        var span = document.createElement('SPAN')
        a.setAttribute("href", '');
        a.setAttribute("data-id-question", testId);
        a.appendChild(text);
        li.appendChild(a);
        li.appendChild(span);
        ul.appendChild(li);
    }

    this.addEventListenerUL(ul);

    this.addEventListenerExitTest();

    this.addEventListenerButton();

    this.addEventListenerClosedWindows();

    Router.addEventListenerHash();

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
        this.testList.className = 'hidden';
        Utils.removeClass(this.hidden, 'hidden');
    }
};

QuestionModule.prototype.resetTest = function () {
    Utils.addClass(this.hidden, 'hidden');
    Utils.removeClass(this.testList, 'hidden');
    Utils.addClass(this.testList, 'testList');
    Utils.removeClass(this.skipAnswerButton, 'hidden');
    Utils.resetFlagsANDanswers(this);
};

QuestionModule.prototype.setFlagPassedTestLocalStorage = function (objParseModule) {
    objParseModule.parseStorage();
    objParseModule.setPassedTests(this.indexActiveTest);
    objParseModule.stringifyStorage();
};

QuestionModule.prototype.setFlagPassedTest = function (objParseModule) {
    var arrayTest = objParseModule.getPassedTests();
    if (arrayTest) {
        for (var i = 0; i < arrayTest.length; ++i) {
            var passedTest = this.listTestName.getElementsByTagName('A')[i];
            passedTest.parentNode.lastChild.innerHTML = '&#10004'
        }
    }
};