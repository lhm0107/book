var swiper = [];
$(function(){
	"use strict";
	$('.slider-wrap:not(.evlt-slider-wrap) .swiper-container').each(function  (i) {
		var t = $(this);
		swiper[i] = new Swiper(t, {
			nextButton: t.find('.swiper-button-next'),
			prevButton: t.find('.swiper-button-prev'),
			pagination: t.find('.swiper-pagination'),
			paginationClickable: true,
			observer: true,
  			observeParents: true,
			effect: t.attr('data-effect'),
            touchRatio: 1
		});
	});
});
