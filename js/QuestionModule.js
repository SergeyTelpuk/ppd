function QuestionModule(appWrapper) {

    this.wrapper = appWrapper;

    this.activeQuestionIndex = 0;
    this.indexActiveTest = 0;
    this.countAnsweredQuestion = 0;

    this.img = null;
    this.listTestName = this.wrapper.getElementsByClassName('namesTest')[0];
    this.hidden = this.wrapper.getElementsByClassName('hidden')[0];
    this.floatWindows = this.wrapper.getElementsByClassName('hidden')[1];
    this.closedWindows = this.wrapper.getElementsByClassName('closed')[0];
    this.testList = this.wrapper.getElementsByClassName('testList')[0];
    this.activeQuestions = this.wrapper.getElementsByClassName('activeQuestions')[0];
    this.contentQuestions = this.wrapper.getElementsByClassName('content')[0];
    this.imgQuestions = this.wrapper.getElementsByClassName('imgQuestions')[0];
    this.button = this.wrapper.getElementsByClassName('button')[0];
    this.listAnswers = this.wrapper.getElementsByClassName('listAnswers')[0];
    this.skipAnswerButton = this.wrapper.getElementsByClassName('skipAnswerButton')[0];
}

QuestionModule.prototype.setIndexActiveTest = function(indexActive) {
    this.indexActiveTest = indexActive;
};

QuestionModule.prototype.listTestEvent = function(evt) {

    var e = evt || window.event;
    var target = e.target || e.srcElement;

    if (target.tagName.toUpperCase() === 'A') {
        this.setIndexActiveTest(target.getAttribute('data-id-question'));
        app.objStatistics.buildTestWidget(target.getAttribute('data-id-question'));
        this.buildQuestion(0);
        this.testList.className = 'hidden';
        Utils.removeClass(this.hidden, 'hidden');
    }
};

QuestionModule.prototype.buttonTestEvent = function(evt) {
    
    var e = evt || window.event;
    var target = e.target || e.srcElement;
    
    if (target.className === 'answerButton') {
        this.clickNextButton();
    } else if (target.className === 'skipAnswerButton') {
        this.clickSkipButton();
    }
};

QuestionModule.prototype.createContentList = function(id, listAnswers) {
    var li = document.createElement('LI');
    var input = document.createElement('INPUT');
    var textAnswers = document.createTextNode(listAnswers[id]);
    input.setAttribute('type', 'radio');
    input.setAttribute('name', 'answer');
    input.setAttribute('value', id);
    //устанавливаем default
    if (parseInt(id, 10) === 0) {
        input.setAttribute('checked', 'true');
    }
    li.appendChild(textAnswers);
    li.appendChild(input);
    li.appendChild(textAnswers);
    return li;
};

QuestionModule.prototype.createListAnswers = function(listAnswers) {
    var ul = document.createElement('UL');
    for (var id in listAnswers) {
        var li = this.createContentList(id, listAnswers);
        ul.appendChild(li);
    }
    return ul;
};

QuestionModule.prototype.buildQuestion = function(indexActive) {
    this.activeQuestionIndex = indexActive;
    this.activeQuestions.innerText = this.activeQuestionIndex + 1;
    this.contentQuestions.innerText = quizData[this.indexActiveTest].questions[this.activeQuestionIndex].question;

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
    this.listAnswers.appendChild(this.createListAnswers(quizData[this.indexActiveTest].questions[this.activeQuestionIndex].answers));
};

QuestionModule.prototype.getActiveQuestionIndex = function(idx) {
    var countQuestions = quizData[this.indexActiveTest].questions.length;

    if (this.countAnsweredQuestion === countQuestions) {
        Utils.addClass(this.skipAnswerButton, 'hidden');
        return false;
    } else {
        if (this.countAnsweredQuestion === countQuestions - 1) {
            Utils.addClass(this.skipAnswerButton, 'hidden');
        }
        idx = ++idx > (countQuestions - 1) ? 0 : idx;
        while (quizData[this.indexActiveTest].questions[idx].answeredQuestion) {
            idx = ++idx > (countQuestions - 1) ? 0 : idx;
        }
        return idx;
    }

};

QuestionModule.prototype.clickNextButton = function() {
    var inputListRadio = this.listAnswers.getElementsByTagName('input');
    this.setAnsweredQuestion();

    for (var idInput = 0; idInput < inputListRadio.length; ++idInput) {
        if (inputListRadio[idInput].checked) {
            var answer = parseInt(inputListRadio[idInput].value, 10);
            if ((++answer) === parseInt(quizData[this.indexActiveTest].questions[this.activeQuestionIndex].right, 10)) {
                app.objStatistics.displayShowRightQuestions(++app.objStatistics.rightQuestions);
                this.nextBuildQuestion();
            } else {
                Utils.removeClass(this.floatWindows, 'hidden');
            }
        }
    }
};

QuestionModule.prototype.setAnsweredQuestion = function(){
    quizData[this.indexActiveTest].questions[this.activeQuestionIndex].answeredQuestion = true;
    ++this.countAnsweredQuestion;
};

QuestionModule.prototype.nextBuildQuestion = function(){
    var id = this.getActiveQuestionIndex(this.activeQuestionIndex);
    if (id !== false) {
        Utils.deleteOptionsQuestion(this.listAnswers, this.listAnswers.firstChild);
        this.buildQuestion(id);
    } else {
        alert('Статистика');
        this.setFlagPassedTest();
        this.resetTest();
    }
};


QuestionModule.prototype.clickSkipButton = function() {
    var id = this.getActiveQuestionIndex(this.activeQuestionIndex);
    Utils.deleteOptionsQuestion(this.listAnswers, this.listAnswers.firstChild);
    this.buildQuestion(id);
};

QuestionModule.prototype.closedWindowsClick = function(evt){
    Utils.addClass(this.floatWindows, 'hidden');
    app.objStatistics.displayShowWrongQuestions(++app.objStatistics.wrongQuestions);
    this.nextBuildQuestion();
};


QuestionModule.prototype.createListTest = function() {
    var ul = document.createElement('UL'),
        self = this;
    self.listTestName.appendChild(ul);
    
    ul.addEventListener('click', function(evt) {
        evt.preventDefault();
        self.listTestEvent(evt);
        return false;
    });

    self.button.addEventListener('click', function(evt) {
        self.buttonTestEvent(evt);
        return false;
    });


    self.closedWindows.addEventListener('click', function(evt) {
        self.closedWindowsClick(evt);
        return false;
    });

    for (var testId in quizData) {
        var text = document.createTextNode(quizData[testId].title);
        var li = document.createElement('LI');
        var a = document.createElement('A');
        a.setAttribute("href", '');
        a.setAttribute("data-id-question", testId);
        a.appendChild(text);
        li.appendChild(a);
        ul.appendChild(li);
    }
};

QuestionModule.prototype.resetTest = function() {
    Utils.addClass(this.hidden, 'hidden');
    Utils.removeClass(this.testList, 'hidden');
    Utils.addClass(this.testList, 'testList');
    Utils.removeClass(this.skipAnswerButton, 'hidden');
    Utils.deleteOptionsQuestion(this.listAnswers, this.listAnswers.firstChild);
    Utils.resetFlagsANDanswers(this);
};

QuestionModule.prototype.setFlagPassedTest = function() {
    var indexTest = quizData.indexOf(quizData[this.indexActiveTest]);
    var passedTest = this.listTestName.getElementsByTagName('A')[indexTest];
    console.log(this.indexActiveTest);
    passedTest.innerText += " + ";
};