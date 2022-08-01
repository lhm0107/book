var swiper = [];
$(function(){
	"use strict";
	$('.evlt-slider-wrap .swiper-container').each(function  (i) {
		var t = $(this);
		swiper[i] = new Swiper(t, {
			pagination: t.find('.swiper-pagination'),
			paginationClickable: true,
            paginationBulletRender: function (swiper, index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
            },
            nextButton: t.find('.swiper-button-next'),
			prevButton: t.find('.swiper-button-prev'),
           	shortSwipes:false,
			longSwipes:false,
			followFinger:false,
            touchMoveStopPropagation:false,
			observer: true,
  			observeParents: true,
			threshold: 10,
			preventClicks : false,
			preventClicksPropagation : false,
			simulateTouch : false,
			allowTouchMove : false,
            
		});
	});

	// 확인후 수정
	$('.focus-item').focus(function  () {
		var t = $(this),
			moveIndex = t.parents('.swiper-slide').index();

		if (testSwipe.activeIndex !== moveIndex) {
			$('.test-swiper').scrollLeft(0);
			testSwipe.slideTo(moveIndex);
		}
	});
});
