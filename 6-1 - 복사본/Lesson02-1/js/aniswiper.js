$(function(){
	"use strict";

	var target;

	new Swiper('.chapter-question .swiper-container', {
		speed: 400,
		pagination: $('.swiper-pagination'),
		nextButton: $('.swiper-button-next'),
		prevButton: $('.swiper-button-prev'),
		paginationClickable: true,
		observer: true,
		observeParents: true,
	});

	var aniSwiper = new Swiper('.ani-swiper', {
		speed: 400,
		pagination: $('.ani-swiper .swiper-pagination'),
		nextButton: $('.ani-swiper .swiper-button-next'),
		prevButton: $('.ani-swiper .swiper-button-prev'),
		paginationClickable: true,
		observer: true,
		observeParents: true,
		onSlideChangeEnd: function (swiper) {
			var title = $('.icon-btn-enlarge[data-num="'+swiper.activeIndex+'"]').data('title');
			target.find('.modal-title').text(title);
		}
	});

	$('.chapter-question .icon-btn-enlarge').on('click', function () {
		var t =  $(this);
		var num = t.data('num')*1;
		target = $(t.attr('data-target'));
		$(t.attr('data-target')).find('.modal-title').text(t.data('title'));
		setTimeout(function(){
			aniSwiper.slideTo(num);
		},250);
	});
});
