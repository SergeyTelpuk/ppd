function Statistics(appWrapper) {
    this.appWrapper = appWrapper;
    this.rightQuestions = 0;
    this.wrongQuestions = 0;
    this.titleTest = this.appWrapper.getElementsByClassName('titleTest')[0];
    this.question = this.appWrapper.getElementsByClassName('countQuestions')[0];
    this.countRightQuestions = this.appWrapper.getElementsByClassName('right')[0];
    this.countWrongQuestions = this.appWrapper.getElementsByClassName('wrong')[0];
}

Statistics.prototype.showRightQuestions = function (text) {
    this.countRightQuestions.innerText = text;
};

Statistics.prototype.showWrongQuestions = function (text) {
    this.countWrongQuestions.innerText = text;
};

Statistics.prototype.testWidget = function (indexActive) {
    this.titleTest.innerText = quizData[indexActive].title;
    this.question.innerText = quizData[indexActive].questions.length;
    this.showRightQuestions(this.rightQuestions);
    this.showWrongQuestions(this.wrongQuestions);
};

Statistics.prototype.getWrongWindowsStatic = function (self) {
    if (this.wrongQuestions > (this.rightQuestions + this.wrongQuestions) / 2) {
        return '<p class="wrong">Ваша статистика!</p>' +
            '<p>правильных: ' + '<span class="right">' + this.rightQuestions + '</span><br>' +
            '<span class="wrong">неправильных: ' + this.wrongQuestions + '</span></p>' +
            '<span class="wrong"><button class="repeat">Повторить</button></span>';
    } else {
        return '<p class="wrong">Ваша статистика!</p>' +
            '<p>правильных: ' + '<span class="right">' + this.rightQuestions + '</span><br>' +
            '<span class="wrong">неправильных: ' + this.wrongQuestions + '</span></p>' +
            '<span class="right">Вы молодец!!!<span>';
    }

};
