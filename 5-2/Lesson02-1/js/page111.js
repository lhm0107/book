$(function () {
    $('.icon-btn-refresh').click(function () {
        $('.answer-area').find('.answer-wrp').removeClass('active');
        $('.start-btn').removeClass('on');
        $('.tbl').find('.active, .answer-show').removeClass('active').removeClass('answer-show');
    });

    $('.icon-btn-chk').click(function () {
        $('.tbl').addClass('answer-show');
    });

    $('.start-btn').click(function () {
        $(this).addClass('on');
        $('.answer-area').find('.answer-wrp').addClass('active');
    });

    $('.radio-act1').click(function () {
        $('.act1').addClass('active');
    });
    $('.radio-act1-1').click(function () {
        $('.tbl').find('.act1').removeClass('active');
    });
    $('.radio-act2').click(function () {
        $('.non-act2').addClass('active');
    });
    $('.radio-act2-1').click(function () {
        $('.tbl').find('.non-act2').removeClass('active');
    });
    $('.radio-act3').click(function () {
        $('.non-act3').addClass('active');
    });
    $('.radio-act3-1').click(function () {
        $('.tbl').find('.non-act3').removeClass('active');
    });
    $('.radio-act4').click(function () {
        $('.act4').addClass('active');
    });
    $('.radio-act4-1').click(function () {
        $('.tbl').find('.act4').removeClass('active');
    });
    $('.radio-act5').click(function () {
        $('.non-act5').addClass('active');
    });
    $('.radio-act5-1').click(function () {
        $('.tbl').find('.non-act5').removeClass('active');
    });
    $('.radio-act6').click(function () {
        $('.non-act6').addClass('active');
    });
    $('.radio-act6-1').click(function () {
        $('.tbl').find('.non-act6').removeClass('active');
    });
    $('.radio-act7').click(function () {
        $('.act7').addClass('active');
    });
    $('.radio-act7-1').click(function () {
        $('.tbl').find('.act7').removeClass('active');
    });
    $('.radio-act8').click(function () {
        $('.non-act8').addClass('active');
    });
    $('.radio-act8-1').click(function () {
        $('.tbl').find('.non-act8').removeClass('active');
    });
});