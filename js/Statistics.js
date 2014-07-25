function Statistics(appWrapper) {
    this.$appWrapper = appWrapper;
    this.rightQuestions = 0;
    this.wrongQuestions = 0;

    this.$titleTest = $('.titleTest', this.$appWrapper);
    this.$countQuestions =  $('.countQuestions', this.$appWrapper);

    this.$countRightQuestions = $('.right', this.$appWrapper);
    this.$countWrongQuestions = $('.wrong',this.$appWrapper);
}

Statistics.prototype.showRightQuestions = function (text) {
    this.$countRightQuestions.text(text);
};

Statistics.prototype.showWrongQuestions = function (text) {
    this.$countWrongQuestions.text(text);
};

Statistics.prototype.setRightQuestions = function(count){
    this.rightQuestions = count;
};

Statistics.prototype.setWrongQuestions = function(count){
    this.wrongQuestions = count;
};


Statistics.prototype.testWidget = function (indexActive) {
    this.$titleTest.text(quizData[indexActive].title);
    this.$countQuestions.text(quizData[indexActive].questions.length);
    this.showRightQuestions(this.rightQuestions);
    this.showWrongQuestions(this.wrongQuestions);
};

Statistics.prototype.getWrongWindowsStatic = function () {
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
