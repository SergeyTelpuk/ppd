function QuizzApp() {
    this.objStatistics;
    this.objQuestion;
    this.localStorage;
}

QuizzApp.prototype.init = function () {
    var wrapper = document.getElementsByClassName('appWrapper')[0];

    this.localStorage = new LocalStorage();

    if (JSON.parse(localStorage.getItem('JSONppdLocalStorage'))) {
        this.localStorage.parseStorage();
    } else {
        this.localStorage.stringifyStorage();
    }


    this.objQuestion = new QuestionModule(wrapper);
    this.objStatistics = new Statistics(wrapper);

    this.objQuestion.createListTest();

    if (this.localStorage.getTestId() !== null) {
        for (var id = 0; id < this.localStorage.getAnsweredRightQuestion().length; ++id) {
            quizData[this.localStorage.getTestId()].questions[this.localStorage.getAnsweredRightQuestion()[id]].answeredQuestion = true;
        }

        for (var id = 0; id < this.localStorage.getAnsweredWrongQuestion(); ++id) {
            quizData[this.localStorage.getTestId()].questions[this.localStorage.getAnsweredWrongQuestion()[id]].answeredQuestion = true;
        }

        this.objQuestion.setCountAnsweredQuestion(this.localStorage.getAnsweredRightQuestion().length + this.localStorage.getAnsweredWrongQuestion().length);

        this.objQuestion.hiddenButtonSkip();

        this.objQuestion.setIndexActiveTest(this.localStorage.getTestId());

        this.objStatistics.setRightQuestions(this.localStorage.getAnsweredRightQuestion().length);
        this.objStatistics.setWrongQuestions(this.localStorage.getAnsweredWrongQuestion().length);
        this.objStatistics.testWidget(this.localStorage.getTestId());


        this.objQuestion.buildQuestion(this.localStorage.getQuestionID());
        this.objQuestion.testList.className = 'hidden';
        Utils.removeClass(this.objQuestion.hidden, 'hidden');
    }

};

var app = new QuizzApp();
app.init();


