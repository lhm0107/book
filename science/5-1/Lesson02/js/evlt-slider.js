new Swiper('.evlt-slider-wrap .swiper-container', {
	pagination: '.evlt-slider-wrap .swiper-pagination',
	paginationClickable: true,
	paginationBulletRender: function (swiper, index, className) {
	return '<span class="' + className + '">' + (index + 1) + '</span>';
	},
	nextButton: '.evlt-slider-wrap .swiper-button-next',
	prevButton: '.evlt-slider-wrap .swiper-button-prev',
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
