(function() {
    for (var idQuest in quizData) {
        var idQuizData = quizData[idQuest].questions;
        for (var i in idQuizData) {
            idQuizData[i].answeredQuestion = false;
            idQuizData[i].wrongAnswersComment = "Не правильно отвечен вопрос!";
        }
    }
})();


