function Statistics(appWrapper, $) {
    this.$ = $;

    this.$appWrapper = appWrapper;

    this.$countWrong = this.$('.wrong', this.$appWrapper);
    this.$countRight = this.$('.right', this.$appWrapper);

    this.$activeQuestions = this.$('.activeQuestions',  this.$appWrapper);

}

Statistics.prototype.changeWrongQuestions = function (count) {
        count === null ? this.$countWrong.text(parseInt(this.$countWrong.text(), 10) + 1) : this.$countWrong.text(count);
};

Statistics.prototype.changeRightQuestions = function (count) {
     count === null ? this.$countRight.text(parseInt(this.$countRight.text(), 10) + 1): this.$countRight.text(count);
};

Statistics.prototype.changeActiveQuestion = function (index) {
    this.$activeQuestions.text(index+1);
};

Statistics.prototype.changeActiveQuestion = function (index) {
    this.$activeQuestions.text(index+1);
};

Statistics.prototype.changeCountQuestion = function(count){
  this.$('.countQuestions').text(count)
};

Statistics.prototype.getWrongWindowsStatic = function () {
    if (parseInt(this.$countWrong.text(),10) > (parseInt(this.$countRight.text(),10) + parseInt(this.$countWrong.text(),10)) / 2) {
        return '<p class="statistics">Ваша статистика!</p>' +
            '<p class="statisticsRight">правильных: '+parseInt(this.$countRight.text(),10) + '</p>' +
            '<p class="statisticsWrong">неправильных: ' + parseInt(this.$countWrong.text(),10) + '</p>' +
            '<p><h1 class="repeat">Повторить</h1></p>';
    } else {
        return '<p class="statistics">Ваша статистика!</p>' +
            '<p class="statisticsRight">правильных: '+ parseInt(this.$countRight.text(),10) + '</p>' +
            '<p class="statisticsWrong">неправильных:' + parseInt(this.$countWrong.text(),10) + '</p>' +
            '<p class="statisticsRight">Вы молодец!!!</p>';
    }

};
