$(function(){
    $('.history .icon-hand').click(function(){
        $(this).addClass('hide').next().removeClass('hide');
        $('.history').addClass('start');
        $('.history-list>li').each(function(i, ele){
            var $line = $('.history .line');
            var time = i === 0 ? 500 : 1000;
            var delay = i === 0 ? 0 : 500;
            var size = i === 0 ? 0 : 4;

            $line.delay(delay).animate({
                height:  $('.history-list>li').eq(i).position().top+size
            }, time, "linear", function(){
                $(ele).addClass('active');
            });
        });
    });

    $('.history .icon-btn-refresh').click(function(){
        $(this).addClass('hide').prev().removeClass('hide');
        $('.history .line').stop(true, true).css('height', 0);
        $('.history').removeClass('start').find('.active').removeClass('active');
    });
});
