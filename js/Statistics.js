function Statistics(appWrapper, $) {
    this.$ = $;

    this.$appWrapper = appWrapper;

    this.$countWrong = this.$('.wrong', this.$appWrapper);
    this.$countRight = this.$('.right', this.$appWrapper);

    this.$activeQuestions = this.$('.activeQuestions',  this.$appWrapper);

}

Statistics.prototype.changeWrongQuestions = function (count) {
    if(count === null){
        this.$countWrong.text(parseInt(this.$countWrong.text(), 10) + 1)
    }else{
        this.$countWrong.text(count)
    }

};

Statistics.prototype.changeRightQuestions = function (count) {
    if(count === null){
        this.$countRight.text(parseInt(this.$countRight.text(), 10) + 1);
    }else{
        this.$countRight.text(count);
    }

};

Statistics.prototype.changeActiveQuestion = function (index) {
    this.$activeQuestions.text(index+1);
};

Statistics.prototype.getWrongWindowsStatic = function () {
    if (parseInt(this.$countWrong.text(),10) > (parseInt(this.$countRight.text(),10) + parseInt(this.$countWrong.text(),10)) / 2) {
        return '<p class="wrong">Ваша статистика!</p>' +
            '<p>правильных: ' + '<span class="right">' +parseInt(this.$countRight.text(),10) + '</span><br>' +
            '<span class="wrong">неправильных: ' + parseInt(this.$countWrong.text(),10) + '</span></p>' +
            '<span class="wrong"><button class="repeat">Повторить</button></span>';
    } else {
        return '<p class="wrong">Ваша статистика!</p>' +
            '<p>правильных: ' + '<span class="right">' + parseInt(this.$countRight.text(),10) + '</span><br>' +
            '<span class="wrong">неправильных: ' + parseInt(this.$countWrong.text(),10) + '</span></p>' +
            '<span class="right">Вы молодец!!!<span>';
    }

};
