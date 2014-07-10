var doc = document,
    replyButton =  doc.getElementsByClassName('reply')[0],
    skipButton =  doc.getElementsByClassName('skip')[0],
    listAnswerContent,
    activeTestIndex,
    countQuestion,
    activeQuestion,
    activeAnswerRight,
    countRightAnswer = [],
    skipAnswerArr = [],
    answerRight = doc.getElementsByClassName('countRightAnswer')[0],
    wrongRight = doc.getElementsByClassName('countWrongAnswer')[0],
    countSkipAnswer = 0,
    flag;



function echo(str){
    console.log(str);
}
var removeClass = function(element ,nameClass){
    element.classList.remove(nameClass);
};

var addClass = function(element ,nameClass){
    element.classList.add(nameClass);
};

var checkAnswer = function(answer){
    //debugger;
    console.log(typeof answer);
    if(typeof answer !== "undefined") {
        if (parseInt(answer) === activeAnswerRight) {
            countRightAnswer.push('+');//правильный ответ
            ++answerRight.innerText;
        } else {
              // debugger;
            alert(activeTestIndex.questions[activeQuestion].wrongAnswersComment+"\nПравильный ответ: "+activeTestIndex.questions[activeQuestion].answers[activeAnswerRight]);
            countRightAnswer.push('-'); //неправильный
            ++wrongRight.innerText;
        }
    }


};

var getAnswer = function(){
    var answer,
        listRadio = doc.querySelectorAll('#listAnswer ul li input');
    for(var i = 0; i < listRadio.length; ++i){
        if(listRadio[i].checked){
           answer = listRadio[i].value;
           break;
        }
    }
    if(flag){
        activeQuestion = skipAnswerArr[countSkipAnswer];
    }
    checkAnswer(answer);
};



var skipAnswer= function(){
    if(activeQuestion === 0 ){
        skipAnswerArr.push(activeQuestion);
    }else if( activeQuestion !== 0 && activeQuestion < countQuestion){
        skipAnswerArr.push(activeQuestion)
    }

    if( ++activeQuestion < countQuestion){
        getActiveTestTitleAnswer(activeQuestion);
        getActiveTestImgAnswer(activeQuestion);
        getListAnswer(activeQuestion);
        setActiveAnswerRight(activeQuestion);
        getNumberAnswer(activeQuestion + 1);

    }else if(skipAnswerArr.length > 0){
        if(countSkipAnswer === skipAnswerArr.length){
            countSkipAnswer = 0;
        }
        flag = true;
        getActiveTestTitleAnswer(skipAnswerArr[countSkipAnswer]);
        getActiveTestImgAnswer(skipAnswerArr[countSkipAnswer]);
        getListAnswer(skipAnswerArr[countSkipAnswer]);
        setActiveAnswerRight(skipAnswerArr[countSkipAnswer]);
        getNumberAnswer(skipAnswerArr[countSkipAnswer] + 1);
        ++countSkipAnswer;
    }
};

var setActiveTestName = function(){
    //установить название текста
    doc.getElementById('test').firstElementChild.firstChild.nodeValue = activeTestIndex.title;
    getActiveTestTitleAnswer(0);
    getActiveTestImgAnswer(0);
    getListAnswer(0);
    setActiveAnswerRight(0);
    getNumberAnswer(1);
};

var nextAnswer = function(){

    if(++activeQuestion < countQuestion && !flag){
        getActiveTestTitleAnswer(activeQuestion);
        getActiveTestImgAnswer(activeQuestion);
        getListAnswer(activeQuestion);
        setActiveAnswerRight(activeQuestion);
        getNumberAnswer(activeQuestion + 1);

        if(activeQuestion == countQuestion-1 && skipAnswerArr.length === 0){
            addClass(skipButton, 'hidden');
        }
    }else if(skipAnswerArr.length > 0 && flag){
        if(countSkipAnswer === skipAnswerArr.length){
            countSkipAnswer = 0;
        }
        getActiveTestTitleAnswer(skipAnswerArr[countSkipAnswer-1]);
        getActiveTestImgAnswer(skipAnswerArr[countSkipAnswer-1]);
        getListAnswer(skipAnswerArr[countSkipAnswer-1]);
        setActiveAnswerRight(skipAnswerArr[countSkipAnswer-1]);
        getNumberAnswer(skipAnswerArr[countSkipAnswer-1] + 1);
        //skipAnswerArr.pop(countSkipAnswer);
        if( skipAnswerArr.length === 1){
            addClass(skipButton, 'hidden');
        }
        ++countSkipAnswer;
    }
};

//установка активеого ответа
var setActiveAnswerRight = function(i){
    activeAnswerRight = activeTestIndex.questions[i].right;
};

//установка вопросса
var getActiveTestTitleAnswer = function(i){
    doc.getElementById('questionText').firstChild.nodeValue = activeTestIndex.questions[i].content;
};

var getNumberAnswer =  function(numberQuestion){
     doc.getElementById('numberAnswer').firstChild.nodeValue = ": "  + numberQuestion + ' / ' + countQuestion
};

//установка картинки
var getActiveTestImgAnswer = function(i){
    doc.getElementById('imgAnswer').src= activeTestIndex.questions[i].img;
};

var getListAnswer = function(i){
    var li,str = '',
        listAnswers = activeTestIndex.questions[i].answers;
    for( var i = 0; i < listAnswers.length; ++i){
        str += "<li><input type='radio' name='answer' value='"+i+"' checked >"+listAnswers[i]+"</li>\n";
    }

    doc.getElementById('listAnswer').innerHTML = "<ul>"+str+"</ul>";
};

var getActiveTestIndex = function(){

    for(var test in quizData){
        if(quizData[test].title ===  this.firstChild.nodeValue){
            activeTestIndex = quizData[test];
            countQuestion = activeTestIndex.questions.length;
            activeQuestion = 0;
            removeClass(doc.getElementById('test'), 'hidden');
        }
    }
};

window.onload = function() {

    listAnswerContent = doc.getElementById('test');

    var listTestA = doc.querySelectorAll('#listTest ul li a');

    for (var i = 0; i < listTestA.length; ++i) {
        listTestA[i].addEventListener('click', getActiveTestIndex);
        listTestA[i].addEventListener('click', setActiveTestName);
    }
    replyButton.addEventListener('click', getAnswer);
    replyButton.addEventListener('click', nextAnswer);

    skipButton.addEventListener('click', skipAnswer);
};



//QuizzApp = function(){
//
//    this.questionCnt = document.getElementsByName();
//}
//
//QuizzApp.prototype.init = function(){
//
//}
//
//var app = new QuizzApp();
//
//app.init();