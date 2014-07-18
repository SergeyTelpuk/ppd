function QuizzApp() {
    this.objStatistics;
    this.objQuestion;
    this.JSONppdLocalStorage = null;
}

QuizzApp.prototype.init = function() {
    var wrapper = document.getElementsByClassName('appWrapper')[0];
    this.objQuestion = new QuestionModule(wrapper);
    this.objStatistics = new Statistics(wrapper);

    if(typeof this.JSONppdLocalStorage.testID === null){
        this.objQuestion.createListTest();
    }else{

        for(var id = 0;  id <  this.JSONppdLocalStorage.answeredRightQuestion.length; ++id){
            quizData[this.JSONppdLocalStorage.testID].questions[this.JSONppdLocalStorage.answeredRightQuestion[id]].answeredQuestion = true;
        }
        this.objQuestion.setIndexActiveTest(this.JSONppdLocalStorage.testID);
        this.objStatistics.testWidget(this.JSONppdLocalStorage.testID);
        this.objQuestion.buildQuestion(this.JSONppdLocalStorage.questionID);
        this.objQuestion.createListTest();
        this.objQuestion.testList.className = 'hidden';
        Utils.removeClass(this.objQuestion.hidden, 'hidden');
    }

};

QuizzApp.prototype.localStorage = function(){
    if(!localStorage.getItem('JSONppdLocalStorage')){
        localStorage.setItem('JSONppdLocalStorage', JSON.stringify(JSONppdLocalStorage));
    }
    this.JSONppdLocalStorage = JSON.parse(localStorage.getItem('JSONppdLocalStorage'));
};
var app = new QuizzApp();
app.localStorage();
app.init();


