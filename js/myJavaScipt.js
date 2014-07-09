var doc = document,
    listAnswerContent,
    activeTestIndex,
    countQuestion,
    activeQuestion;

function echo(str){
    console.log(str);
}

var getAnswer = function(){
    var answer;

    var listRadio = doc.querySelectorAll('#listAnswer ul li input');

    for(var i = 0; i < listRadio.length; ++i){
        if(listRadio[i].checked){
           answer = listRadio[i].value;
        }
    }
    //checkAnswer(answer, i);
};

var checkAnswer = function(answer){

};

var skipAnswer= function(){
    if( ++activeQuestion < countQuestion){
        echo(countQuestion);
        getActiveTestTitleAnswer(activeQuestion);
        getActiveTestImgAnswer(activeQuestion);
        getListAnswer(activeQuestion);
        getNumberAnswer(activeQuestion + 1);
    }else{
        echo('sds');
    }
};

var setActiveTestName = function(){
    //установить название текста
    var div = doc.getElementById('test');
    div.firstElementChild.firstChild.nodeValue = activeTestIndex.title;
    getActiveTestTitleAnswer(0);
    getActiveTestImgAnswer(0);
    getListAnswer(0);
    getNumberAnswer(1);
    listAnswerContent.style.display = '';
};

var nextAnswer = function(){

    if(++activeQuestion < countQuestion){
        echo(countQuestion);
        getActiveTestTitleAnswer(activeQuestion);
        getActiveTestImgAnswer(activeQuestion);
        getListAnswer(activeQuestion);
        getNumberAnswer(activeQuestion + 1);
    }else{
        echo('sds');
    }

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
        str += "<li><input type='radio' name='answer' value='"+i+"'>"+listAnswers[i]+"</li>\n";
    }

    doc.getElementById('listAnswer').innerHTML = "<ul>"+str+"</ul>";
};

var getActiveTestIndex = function(){

    for(var test in quizData){
        if(quizData[test].title ===  this.firstChild.nodeValue){
            activeTestIndex = quizData[test];
            countQuestion = activeTestIndex.questions.length;
            activeQuestion = 0;
            update();
        }
    }
};

var update = function(){
    doc.getElementById('test').classList.remove('hidden');
};

window.onload = function() {
    //listElementLI = doc.getElementById('listAnswer');

    listAnswerContent = doc.getElementById('test');

    var listTestA = doc.querySelectorAll('#listTest ul li a');

    for (var i = 0; i < listTestA.length; ++i) {
        listTestA[i].addEventListener('click', getActiveTestIndex);
        listTestA[i].addEventListener('click', setActiveTestName);
    }
    doc.getElementById('reply').addEventListener('click', getAnswer);
    doc.getElementById('reply').addEventListener('click', nextAnswer);

    doc.getElementById('skip').addEventListener('click', skipAnswer);
}



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