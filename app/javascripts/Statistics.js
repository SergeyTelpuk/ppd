define(function(){

    "use strict";

    function Statistics() {

        this.$appWrapper = $('.appWrapper');

        this.$countWrong = null;
        this.$countRight = null;
        this.$activeQuestions = null;
        this.$countQuestions = null;

    }

	Statistics.prototype.setElementsJquery = function(){
		this.$countQuestions = $('.countQuestions', this.$appWrapper);
		this.$activeQuestions = $('.activeQuestions', this.$appWrapper);
		this.$countWrong =  $('.wrong', this.$appWrapper);
		this.$countRight =  $('.right', this.$appWrapper);

	};

    Statistics.prototype.changeWrongQuestions = function (count) {
        count === null ? this.$countWrong.text(parseInt(this.$countWrong.text(), 10) + 1) : this.$countWrong.text(count);
    };

    Statistics.prototype.changeRightQuestions = function (count) {
        count === null ? this.$countRight.text(parseInt(this.$countRight.text(), 10) + 1): this.$countRight.text(count);
    };

    Statistics.prototype.changeActiveQuestion = function (index) {
        this.$activeQuestions.text(index+1);
    };

    Statistics.prototype.changeCountQuestion = function(count){
        this.$countQuestions.text(count);

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

    return new Statistics();
});
