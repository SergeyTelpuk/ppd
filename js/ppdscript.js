var doc = document,
    activeQuestionIndex,
    rightQuestions = [],
    wrongQuestions = [],
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
    listAnswers = doc.getElementsByClassName('listAnswers')[0],
    skipAnswerButton = doc.getElementsByClassName('skipAnswerButton')[0];

var displayShowRightQuestions = function(count) {
    countRightQuestions.innerText = count.length;
};

var displayShowWrongQuestions = function(count) {
    countWrongQuestions.innerText = count.length;
};

var createLisAnswers = function(listAnswers) {
    var ul = doc.createElement('UL');
    for (var id in listAnswers) {
        var li = doc.createElement('LI');
        var input = doc.createElement('INPUT');
        var textAnswers = doc.createTextNode(listAnswers[id]);
        input.setAttribute('type', 'radio');
        input.setAttribute('name', 'answer');
        input.setAttribute('value', id);
        //устанавливаем default
        if (parseInt(id, 10) === 0) {
            input.setAttribute('checked', 'true');
        }
        li.appendChild(input);
        li.appendChild(textAnswers);
        ul.appendChild(li);
    }
    return ul;
};
//построить вопрос
var buildQuestion = function(indexActive) {
    activeQuestionIndex = indexActive;
    activeQuestions.innerText = activeQuestionIndex + 1;
    contentQuestions.innerText = quizData[indexActiveTest].questions[activeQuestionIndex].question;

    if (quizData[indexActiveTest].questions[activeQuestionIndex].questionImg) {
        imgQuestions.appendChild(function(img) {
            var imgtest = doc.createElement('IMG');
            imgtest.src = img;
            return imgtest;
        }(quizData[indexActiveTest].questions[activeQuestionIndex].questionImg));
    }

    listAnswers.appendChild(createLisAnswers(quizData[indexActiveTest].questions[activeQuestionIndex].answers));
};

//построить тест
var buildTestWidget = function(indexActive) {
    //установить активный тест
    indexActiveTest = indexActive;
    titleTest.innerText = quizData[indexActive].title;
    question.innerText = quizData[indexActive].questions.length;
    displayShowRightQuestions(rightQuestions);
    displayShowWrongQuestions(wrongQuestions);
    buildQuestion(0);
};

var repleceClass = function(element, nameClass) {
    element.className = nameClass;
};

var romeveClass = function(element, nameClass) {
    element.classList.remove(nameClass);
};

//создание элементов списка
var createListTest = function() {
    var ul = doc.createElement('UL');
    listTestName.appendChild(ul);
    for (var testId in quizData) {
        var text = doc.createTextNode(quizData[testId].title);
        var li = doc.createElement('LI');
        var a = doc.createElement('A');
        a.setAttribute("href", '#');

        a.addEventListener('click', function(index) {
            return function() {
                buildTestWidget(index);
            };
        }(testId));

        a.addEventListener('click', function() {
            repleceClass(testList, 'hidden');
        });
        a.addEventListener('click', function() {
            repleceClass(hidden, 'hiddenShowDisplay');
        });
        a.appendChild(text);
        li.appendChild(a);
        ul.appendChild(li);
    }

};

var deleteQuestion = function() {
    contentQuestions.removeChild(contentQuestions.firstChild);
    //проверка на картику
    if (imgQuestions.firstChild) {
        imgQuestions.removeChild(imgQuestions.firstChild);
    }

    listAnswers.removeChild(listAnswers.firstChild);

};

var getIndex = function(idx) {
    var countFlag = 0;
    var countQuestions = quizData[indexActiveTest].questions.length;

    for (var id in quizData[indexActiveTest].questions) {
        if (quizData[indexActiveTest].questions[id].flag) {
            ++countFlag;
        }
    }

    if (countFlag === countQuestions) {
        skipAnswerButton.style.display = 'none';
        return false;
    } else {
        if (countFlag === countQuestions - 1) {
            skipAnswerButton.style.display = 'none';
        }
        idx = ++idx > (countQuestions - 1) ? 0 : idx;
        while (quizData[indexActiveTest].questions[idx].flag) {
            idx = ++idx > (countQuestions - 1) ? 0 : idx;
        }
        return idx;
    }

};

var resetFlagsANDanswers = function() {
    rightQuestions = [];
    wrongQuestions = [];
    for (var id in quizData[indexActiveTest].questions) {
        quizData[indexActiveTest].questions[id].flag = false;
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
                rightQuestions.push(1);
                displayShowRightQuestions(rightQuestions);
            } else {
                wrongQuestions.push(1);
                displayShowWrongQuestions(wrongQuestions);
                alert(quizData[indexActiveTest].questions[activeQuestionIndex].wrongAnswersComment);
            }
        }
    }
    quizData[indexActiveTest].questions[activeQuestionIndex].flag = true;
    var id = getIndex(activeQuestionIndex);
    if (id >= 0 && id !== false) {
        deleteQuestion();
        buildQuestion(id);
    } else {
        alert('Статистика');
        repleceClass(doc.getElementsByClassName('hiddenShowDisplay')[0], 'hidden');
        repleceClass(doc.getElementsByClassName('hidden')[0], 'hiddenShowDisplay');
        skipAnswerButton.style.display = '';
        deleteQuestion();
        resetFlagsANDanswers();
        setFlagPassedTest();

    }
};

var clikSkipButton = function() {
    var id = getIndex(activeQuestionIndex);
    deleteQuestion();
    buildQuestion(id);

};
(function() {
    for (var idQuest in quizData) {
        var idQuizData = quizData[idQuest].questions;
        for (var i in idQuizData) {
            idQuizData[i].flag = false;
            idQuizData[i].wrongAnswersComment = "Не правильно отвечен вопрос!";
        }
    }
})();

(function() {
    createListTest();
    doc.getElementsByClassName('answerButton')[0].addEventListener('click', clikNextButton);
    doc.getElementsByClassName('skipAnswerButton')[0].addEventListener('click', clikSkipButton);
})();









