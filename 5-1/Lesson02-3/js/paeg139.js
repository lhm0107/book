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
    $('.act2').click(function () {
        $('.act2').addClass('active');
    });
    $('.act4').click(function () {
        $('.act4').addClass('active');
    });
    $('.act6').click(function () {
        $('.act6').addClass('active');
    });
    $('.act10').click(function () {
        $('.act10').addClass('active');
    });
});