function Statistics(appWrapper) {
    this.appWrapper = appWrapper;
    this.rightQuestions = 0;
    this.wrongQuestions = 0;
    this.titleTest = this.appWrapper.getElementsByClassName('titleTest')[0];
    this.question = this.appWrapper.getElementsByClassName('countQuestions')[0];
    this.countRightQuestions = this.appWrapper.getElementsByClassName('right')[0];
    this.countWrongQuestions = this.appWrapper.getElementsByClassName('wrong')[0];
}

Statistics.prototype.displayShowRightQuestions = function (text) {
    this.countRightQuestions.innerText = text;
};

Statistics.prototype.displayShowWrongQuestions = function (text) {
    this.countWrongQuestions.innerText = text;
};

Statistics.prototype.buildTestWidget = function (indexActive) {
    this.titleTest.innerText = quizData[indexActive].title;
    this.question.innerText = quizData[indexActive].questions.length;
    this.displayShowRightQuestions(this.rightQuestions);
    this.displayShowWrongQuestions(this.wrongQuestions);
};

Statistics.prototype.setWrongWindowsStatic = function (self) {
    var repeatTest = '';
    if (this.wrongQuestions > (this.rightQuestions + this.wrongQuestions) / 2) {
        repeatTest += '<span class="wrong"><button class="repeat">Повторить</button></span>';
        self.wrongContent.innerHTML = '<p class="wrong">Ваша статистика!</p>' +
            '<p>правильных: ' + '<span class="right">' + this.rightQuestions + '</span><br>' +
            '<span class="wrong">неправильных: ' + this.wrongQuestions + '</span></p>' +
            repeatTest;
        this.appWrapper.getElementsByClassName('repeat')[0].addEventListener('click',
            function (evt) {
                self.repeatTest(evt);
                return false;
            });
    } else {
        repeatTest += '<span class="right">Вы молодец!!!<span>';
        self.wrongContent.innerHTML = '<p class="wrong">Ваша статистика!</p>' +
            '<p>правильных: ' + '<span class="right">' + this.rightQuestions + '</span><br>' +
            '<span class="wrong">неправильных: ' + this.wrongQuestions + '</span></p>' +
            repeatTest;
    }

};
