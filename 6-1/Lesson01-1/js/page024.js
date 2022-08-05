$(function(){
    $('.scratch').each(function(){
        var scratch = $(this);
        var fg = scratch.data('fg');
        $(this).wScratchPad({
            size        : 10,
            bg          : 'transparent',
            fg          : '#f7f7f7',
            scratchDown  : function(e){
                scratch.addClass('done').find('.invisible').removeClass('invisible');
            }
        });
    });

    new Swiper('.swiper-container', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        pagination: '.swiper-pagination',
        paginationClickable: true,
        observer: true,
        observeParents: true,
        touchRatio: 0
    });
});
