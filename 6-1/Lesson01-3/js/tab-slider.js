var tabSwiper = [];
$(function(){
	"use strict";
	$('.tab-swiper .swiper-container').each(function  (i) {
		var t = $(this);
		var $root = t.closest('.tab-swiper');
		tabSwiper[i] = new Swiper(t, {
			nextButton: $root.find('.swiper-button-next'),
			prevButton: $root.find('.swiper-button-prev'),
			observer: true,
  			observeParents: true,
			effect: t.attr('data-effect'),
			onSlideChangeStart: function (swiper) {
				$root.find('.nav').children().eq(swiper.activeIndex).addClass('active').siblings().removeClass('active');
			}
		});
	});

	$('.tab-swiper .nav>button').click(function(){
		var t = $(this);
		var num = t.parent().data('num');
		tabSwiper[num].slideTo(t.index());
		t.addClass('active').siblings().removeClass('active');
	});
});
