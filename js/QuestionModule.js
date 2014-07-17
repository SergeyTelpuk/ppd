function QuestionModule(appWrapper) {

    this.doc = appWrapper;

    this.activeQuestionIndex = 0;
    this.indexActiveTest = 0;
    this.countAnsweredQuestion = 0;

    this.img = null;
    this.listTestName = this.doc.getElementsByClassName('namesTest')[0];
    this.hidden = this.doc.getElementsByClassName('hidden')[0];
    this.testList = this.doc.getElementsByClassName('testList')[0];
    this.activeQuestions = this.doc.getElementsByClassName('activeQuestions')[0];
    this.contentQuestions = this.doc.getElementsByClassName('content')[0];
    this.imgQuestions = this.doc.getElementsByClassName('imgQuestions')[0];
    this.button = this.doc.getElementsByClassName('button')[0];
    this.listAnswers = this.doc.getElementsByClassName('listAnswers')[0];
    this.skipAnswerButton = this.doc.getElementsByClassName('skipAnswerButton')[0];
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
    for (var idInput = 0; idInput < inputListRadio.length; ++idInput) {
        if (inputListRadio[idInput].checked) {
            var answer = parseInt(inputListRadio[idInput].value, 10);
            if ((++answer) === parseInt(quizData[this.indexActiveTest].questions[this.activeQuestionIndex].right, 10)) {
                app.objStatistics.displayShowRightQuestions(++app.objStatistics.rightQuestions);
            } else {
                app.objStatistics.displayShowWrongQuestions(++app.objStatistics.wrongQuestions);
                alert(quizData[this.indexActiveTest].questions[this.activeQuestionIndex].wrongAnswersComment);
            }
        }
    }
    quizData[this.indexActiveTest].questions[this.activeQuestionIndex].answeredQuestion = true;
    ++this.countAnsweredQuestion;
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


QuestionModule.prototype.createListTest = function() {
    var ul = document.createElement('UL'),
        self = this;
    this.listTestName.appendChild(ul);
    
    ul.addEventListener('click', function(evt) {
        evt.preventDefault();
        self.listTestEvent(evt);
        return false;
    });

    this.button.addEventListener('click', function(evt) {
        self.buttonTestEvent(evt);
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