var doc = document,
    activeQuestionIndex = indexActiveTest = rightQuestions = wrongQuestions = countAnsweredQuestion = 0, img = null,
    listTestName = doc.getElementsByClassName('namesTest')[0],
    hidden = doc.getElementsByClassName('hidden')[0],
    testList = doc.getElementsByClassName('testList')[0],
    titleTest = doc.getElementsByClassName('titleTest')[0],
    question = doc.getElementsByClassName('countQuestions')[0],
    activeQuestions = doc.getElementsByClassName('activeQuestions')[0],
    countRightQuestions = doc.getElementsByClassName('right')[0],
    countWrongQuestions = doc.getElementsByClassName('wrong')[0],
    contentQuestions = doc.getElementsByClassName('content')[0],
    imgQuestions = doc.getElementsByClassName('imgQuestions')[0],
    button = doc.getElementsByClassName('button')[0],
    listAnswers = doc.getElementsByClassName('listAnswers')[0],
    answerButton = doc.getElementsByClassName('answerButton')[0],
    skipAnswerButton = doc.getElementsByClassName('skipAnswerButton')[0];

var displayShowRightQuestions = function(text) {
    countRightQuestions.innerText = text;
};

var displayShowWrongQuestions = function(text) {
    countWrongQuestions.innerText = text;
};

var createContentList = function(li, id, listAnswers) {
    var input = doc.createElement('INPUT');
    var textAnswers = doc.createTextNode(listAnswers[id]);
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

var createLisAnswers = function(listAnswers) {
    var ul = doc.createElement('UL');
    for (var id in listAnswers) {
        var li = doc.createElement('LI');
        li = createContentList(li, id, listAnswers);
        ul.appendChild(li);
    }
    return ul;
};
//построить вопрос
var buildQuestion = function(indexActive) {
    activeQuestionIndex = indexActive;
    activeQuestions.innerText = activeQuestionIndex + 1;
    contentQuestions.innerText = quizData[indexActiveTest].questions[activeQuestionIndex].question;

    if (img === null && quizData[indexActiveTest].questions[activeQuestionIndex].questionImg) {
        img = doc.createElement('IMG');
        img.src = quizData[indexActiveTest].questions[activeQuestionIndex].questionImg;
        imgQuestions.appendChild(img);
    } else if (quizData[indexActiveTest].questions[activeQuestionIndex].questionImg) {
        img.src = quizData[indexActiveTest].questions[activeQuestionIndex].questionImg;
        if (img.className === 'hidden') {
            removeClass(img, 'hidden');
        }
    } else if (!quizData[indexActiveTest].questions[activeQuestionIndex].questionImg && img) {
        addClass(img, 'hidden');
    }

    listAnswers.appendChild(createLisAnswers(quizData[indexActiveTest].questions[activeQuestionIndex].answers));
};

//построить тест
var buildTestWidget = function(indexActive) {
    //установить активный тест
    indexActiveTest = indexActive;
    titleTest.innerText = quizData[indexActiveTest].title;
    question.innerText = quizData[indexActiveTest].questions.length;
    displayShowRightQuestions(rightQuestions);
    displayShowWrongQuestions(wrongQuestions);
};

var addClass = function(element, nameClass) {
    element.classList.add(nameClass);
};
var removeClass = function(element, nameClass) {
    element.classList.remove(nameClass);
};

var ListTestEvent = function(e) {
    var event = e || window.event;
    var target = event.target || event.srcElement;
    var linkActiv = listTestName.getElementsByTagName('A');
    for (var id in linkActiv) {
        if (linkActiv[id] === target) {
            buildTestWidget(id);
            buildQuestion(0);
        }
    }
    testList.className = 'hidden';
    removeClass(hidden, 'hidden');
};

var buttonTestEvent = function(e) {
    var event = e || window.event;
    var target = event.target || event.srcElement;
    if (target.className === 'answerButton') {
        clikNextButton();
    } else if (target.className === 'skipAnswerButton') {
        clickSkipButton();
    }
};
//создание элементов списка
var createListTest = function() {
    var ul = doc.createElement('UL');
    listTestName.appendChild(ul);
    ul.addEventListener('click', ListTestEvent);
    button.addEventListener('click', buttonTestEvent);
    for (var testId in quizData) {
        var text = doc.createTextNode(quizData[testId].title);
        var li = doc.createElement('LI');
        var a = doc.createElement('A');
        a.setAttribute("href", '#');
        a.appendChild(text);
        li.appendChild(a);
        ul.appendChild(li);
    }
};

var deleteOptionsQuestion = function() {
    listAnswers.removeChild(listAnswers.firstChild);
};

var getIndex = function(idx) {
    var countQuestions = quizData[indexActiveTest].questions.length;

    if (countAnsweredQuestion === countQuestions) {
        addClass(skipAnswerButton, 'hidden');
        return false;
    } else {
        if (countAnsweredQuestion === countQuestions - 1) {
            addClass(skipAnswerButton, 'hidden');
        }
        idx = ++idx > (countQuestions - 1) ? 0 : idx;
        while (quizData[indexActiveTest].questions[idx].answeredQuestion) {
            idx = ++idx > (countQuestions - 1) ? 0 : idx;
        }
        return idx;
    }

};

var resetFlagsANDanswers = function() {
    activeQuestionIndex = indexActiveTest = rightQuestions = wrongQuestions = countAnsweredQuestion = 0;
    for (var id in quizData[indexActiveTest].questions) {
        quizData[indexActiveTest].questions[id].answeredQuestion = false;
    }
};
var setFlagPassedTest = function() {
    var indexTest = quizData.indexOf(quizData[indexActiveTest]);
    var passedTest = listTestName.getElementsByTagName('A')[indexTest];
    passedTest.innerText += " + ";
};

var clikNextButton = function() {
    var inputListRadio = listAnswers.getElementsByTagName('input');
    for (var idInput = 0; idInput < inputListRadio.length; ++idInput) {
        if (inputListRadio[idInput].checked) {
            var answer = parseInt(inputListRadio[idInput].value, 10);
            if ((++answer) === parseInt(quizData[indexActiveTest].questions[activeQuestionIndex].right, 10)) {
                displayShowRightQuestions(++rightQuestions);
            } else {
                displayShowWrongQuestions(++wrongQuestions);
                alert(quizData[indexActiveTest].questions[activeQuestionIndex].wrongAnswersComment);
            }
        }
    }
    quizData[indexActiveTest].questions[activeQuestionIndex].answeredQuestion = true;
    ++countAnsweredQuestion;
    var id = getIndex(activeQuestionIndex);
    if (id !== false) {
        deleteOptionsQuestion();
        buildQuestion(id);
    } else {
        alert('Статистика');
        hidden.className = 'hidden';
        removeClass(testList, 'hidden');
        removeClass(skipAnswerButton, 'hidden');
        deleteOptionsQuestion();
        setFlagPassedTest();
        resetFlagsANDanswers();
    }
};

var clickSkipButton = function() {
    var id = getIndex(activeQuestionIndex);
    deleteOptionsQuestion();
    buildQuestion(id);
};
//добавляем элемент в нашу глобальную переменную
(function() {
    for (var idQuest in quizData) {
        var idQuizData = quizData[idQuest].questions;
        for (var i in idQuizData) {
            idQuizData[i].answeredQuestion = false;
            idQuizData[i].wrongAnswersComment = "Не правильно отвечен вопрос!";
        }
    }
})();

(function() {
    createListTest();
})();