$(function(){
    $('.scratch').wScratchPad({
        size        : 10,
        bg          : 'transparent',
        fg          : '#ffffff',
        scratchDown  : function(e){
            $('.scratch').addClass('done').find('.invisible').removeClass('invisible');
        }
    });
});
