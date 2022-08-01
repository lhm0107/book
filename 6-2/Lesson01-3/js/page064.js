$(function(){
    $('.scratch').each(function(){
        var scratch = $(this);
        var fg = scratch.data('fg');
        $(this).wScratchPad({
            size        : 10,
            bg          : 'transparent',
            fg          : fg,
            scratchDown  : function(e){
                scratch.addClass('done').find('.invisible').removeClass('invisible');
            }
        });
    });

    tabSwiper[0].params.touchRatio = 0;
});
