function QuizzApp() {
    this.objStatistics;
    this.objQuestion;
}

QuizzApp.prototype.init = function() {
    var wrapper = document.getElementsByClassName('appWrapper')[0];
    this.objQuestion = new QuestionModule(wrapper);
    this.objStatistics = new Statistics(wrapper);
    this.objQuestion.createListTest();
};

var app = new QuizzApp();
app.init();


