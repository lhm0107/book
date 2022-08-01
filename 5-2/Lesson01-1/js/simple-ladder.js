$(function(){
    var $lodderCheck = $('.ladder-check');
    var $lodderLine = $('.lodder-line');
    var $lodderResult = $('.lodder-result');

    $('.path').each(function(){
        this.style.strokeDasharray = this.getTotalLength();
        this.style.strokeDashoffset = this.getTotalLength();
    });

    $('.ladder-check').on('change', function(){
        var index = $(this).index('.ladder-check');

        $lodderCheck.prop('disabled', true);
        $lodderLine.eq(index).addClass('on').siblings('.lodder-line.on').addClass('hidden');


        $lodderLine.eq(index).find('.path').on('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function () {
            $lodderResult.filter('[data-result="'+(index+1)+'"]').addClass('on');
            $lodderLine.filter('.hidden').removeClass('hidden');
            $lodderCheck.prop('disabled', false);
        });
    });

    $('.ladder-refresh').click(function(){
        $lodderLine.removeClass('on');
        $lodderResult.removeClass('on');
        $lodderCheck.prop('disabled', false);
    });
});
