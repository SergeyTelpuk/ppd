var test,
    doc = document,
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
    skipAnswerButton = doc.getElementsByClassName('skipAnswerButton')[0],
    activeQuestion,
    rightQuestions = [],
    wrongQuestions = [];

//получение тестов
var arrayTest = function() {
    var array = [];
    for (var testId in quizData) {
        array[testId] = quizData[testId].title;
    }
    return array;
}();

//найти тест
var setTest = function(testId) {
    test = quizData[testId];
};

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
        if (parseInt(id) === 0) {
            input.setAttribute('checked', 'true');
        }
        li.appendChild(input);
        li.appendChild(textAnswers);
        ul.appendChild(li);
    }
    return ul;
};
//построить вопрос
var buildQuestion = function(question) {
    activeQuestion = question;
    activeQuestions.innerText = activeQuestion.index + 1;
    contentQuestions.innerText = question.content;
    imgQuestions.appendChild(function(img) {
        var imgtest = doc.createElement('IMG');
        imgtest.src = img;
        return imgtest;
    }(question.img));
    listAnswers.appendChild(createLisAnswers(question.answers));
};

//построить тест
var buildTestWidget = function() {
    titleTest.innerText = test.title;
    question.innerText = test.questions.length;
    displayShowRightQuestions(rightQuestions);
    displayShowWrongQuestions(wrongQuestions);
    buildQuestion(test.questions[0]);
};

var repleceClass = function(element, nameClass) {
    element.className = 'hidden';
};

var romeveClass = function(element, nameClass) {
    element.classList.remove(nameClass);
};

//создание элементов списка
var createListTest = function() {
    var listTestName = doc.getElementsByClassName('namesTest')[0];
    var ul = doc.createElement('UL');
    listTestName.appendChild(ul);
    for (var testId in arrayTest) {
        var text = doc.createTextNode(arrayTest[testId]);
        var li = doc.createElement('LI');
        var a = doc.createElement('A');
        a.setAttribute("href", '#');
        //построение контента теста
        a.addEventListener('click', function(x) {
            return function() {
                setTest(x);
            };
        }(testId));

        a.addEventListener('click', buildTestWidget);

        a.addEventListener('click', function() {
            repleceClass(testList, 'hidden');
        });
        a.addEventListener('click', function() {
            romeveClass(hidden, 'hidden');
        });
        a.appendChild(text);
        li.appendChild(a);
        ul.appendChild(li);
    }

}();

var deleteQuestion = function() {
    contentQuestions.removeChild(contentQuestions.firstChild);
    imgQuestions.removeChild(imgQuestions.firstChild);
    listAnswers.removeChild(listAnswers.firstChild);

};

var getIndex = function(idx) {
    var countFlag = 0;
    ++idx;

    for (var id in test.questions) {
        if (test.questions[id].flag) {
            ++countFlag;
        }
    }
    if (countFlag === test.questions.length) {
        return false;
    } else if (countFlag === test.questions.length - 1) {
        repleceClass(skipAnswerButton, 'hidden');
        return idx;
    }
    else {
        idx = idx > test.questions[test.questions.length - 1].index ? 0 : idx;
        while (test.questions[idx].flag) {
            idx = ++idx > test.questions[test.questions.length - 1].index ? 0 : idx;
        }

        return idx;
    }

};

var clikNextButton = function() {
    var inputListRadio = listAnswers.getElementsByTagName('input');
    for (var idInput = 0; idInput < inputListRadio.length; ++idInput) {
        if (inputListRadio[idInput].checked) {
            var answer = inputListRadio[idInput].value;
            if (parseInt(answer) === activeQuestion.right) {
                rightQuestions.push(activeQuestion);
                displayShowRightQuestions(rightQuestions);
            } else {
                wrongQuestions.push(activeQuestion);
                displayShowWrongQuestions(wrongQuestions);
                alert(activeQuestion.wrongAnswersComment);
            }
        }
    }
    activeQuestion.flag = true;
    var id = getIndex(activeQuestion.index);
    if (id >= 0 && id !== false) {
        deleteQuestion();
        buildQuestion(test.questions[id], activeQuestion.index);
    } else {
        repleceClass(skipAnswerButton, 'hidden');
        alert('Статистика');
    }
};

var clikSkipButton = function() {
    var id = getIndex(activeQuestion.index);
    deleteQuestion();
    buildQuestion(test.questions[id], activeQuestion.index);

};

(function() {
    doc.getElementsByClassName('answerButton')[0].addEventListener('click', clikNextButton);
    doc.getElementsByClassName('skipAnswerButton')[0].addEventListener('click', clikSkipButton);
})();









