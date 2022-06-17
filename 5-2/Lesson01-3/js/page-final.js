var testSwiper = [];
$(function(){
	"use strict";

	function stopVideo (){
		var videos = Array.prototype.slice.call(document.getElementsByTagName("video"));
		videos.forEach(function(video){
			video.pause();
			video.currentTime = 0;
		});
	}

	var testSlider = $('.test-swiper');
	testSlider.each(function  (i) {
		var t = $(this),
			prop = t.find('.swiper-slide').length>1;
            t.attr('data-slider',i);
            testSwiper[i] = new Swiper(t, {
			simulateTouch: false,
			pagination: t.prev('.swiper-tab'),
            nextButton: t.find('.swiper-button-next'),
			paginationClickable: true,
			paginationElement:'a',
			shortSwipes:false,
			longSwipes:false,
			followFinger:false,
            touchMoveStopPropagation:false,
			observer: true,
  			observeParents: true,
			paginationBulletRender: function (swiper, index, className) {
				return '<li class="' + className + '"><a>'+(index + 1)+'</a></li>';
			},
			onSlideChangeStart: function (el) {
				stopVideo();

				testSlider.find('.swiper-button-next').css('visibility','hidden');

				if(testSlider.find('.swiper-slide').eq(el.activeIndex).find('.a-checked').length){
					testSlider.find('.swiper-button-next').css('visibility','visible');
				}
			}
		});
	});

	// 확인 후 수정 필요
	$('.modal-body .test-item .icon-btn-chk, .modal-body .test-item:last-child .form-control').focus(function  () {
		var t = $(this),
			currentIndex = t.parents('.test-swiper').attr('data-slider'),
			moveIndex = t.parents('.swiper-slide').index();

		if (testSwiper[currentIndex].activeIndex !== moveIndex) {
			testSlider.scrollLeft(0);
			testSwiper[currentIndex].slideTo(moveIndex);
		}
	});
});
