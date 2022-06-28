$(function(){
	"use strict";

	var $btnInterGroup = $('.btn-inter-group');

	$('[data-inter]').click(function(){
		var $t = $(this);
		var $root = $(this.dataset.inter);
		var startItem = $(this.dataset.inter).children().first();

		$('audio, video:not([autoplay])').each(function(){
			audioControl($(this)[0]);
		});

		if ($unitGoal.is(':visible')) {
			$unitGoal.hide().closest('.layer-wrp').removeClass('open');
		}

		$root.addClass('interacting');
		$t.addClass('hide');

		if($t.parent().hasClass('btn-inter-group')){
			$t.parent().addClass('pointer-none');

			!$t.siblings('.icon-hand').not('.hide').length && $t.parent().find('.icon-btn-refresh').addClass('show');
		}


		if($root.hasClass('audio-single')){
			setTimeout(function() {
				document.getElementById($root.data('audio')).play();
			}, 100);
			$root.children().addClass('visible');
			return false;
		}

		if(startItem.hasClass('visible')){
			$root.children().removeClass('visible');
			startItem.width();
			startItem.addClass('visible');
		}else{
			startItem.addClass('visible');
		}

		if(startItem.data('audio')){
			setTimeout(function() {
				document.getElementById(startItem.data('audio')).play();
			}, 100);
		}
	});

	$('[data-audio]').each(function(i, ele){
		document.getElementById(ele.dataset.audio).ontimeupdate = function(){
			if(this.currentTime === this.duration){

				if($(ele).hasClass('audio-single')){
					$(ele).parent().removeClass('interacting');
					$btnInterGroup.removeClass('pointer-none');
					return false;
				}

				var $nextItem = $(ele).next();

				if($nextItem.length){
					$nextItem.addClass('visible');
					$nextItem.data('audio') && document.getElementById($nextItem.data('audio')).play();
				}else{
					$(ele).parent().removeClass('interacting');
					$btnInterGroup.removeClass('pointer-none');
					!$btnInterGroup.length && $('.btn-inter-reset').addClass('show');
					//$('[data-inter-reset="#'+$(ele).parent().attr('id')+'"]').addClass('show');
				}
			}
		}
	});

	$('.btn-inter-reset').click(function(){
		$('.btn-inter-group').removeClass('pointer-none');


		$('[data-inter]').each(function(){
			$(this).removeClass('hide');
			$(this.dataset.inter).removeClass('interacting').children().removeClass('visible');
		})


		$('.btn-inter-reset').removeClass('show');

		$('audio').each(function(){
			audioControl($(this)[0]);
		});
	});






	$('.js-interaction').click(function  () {
		var t = $(this);
		var target = t.attr('data-target') ? $(t.attr('data-target')) : t.parents('.interaction');

		if (!t.hasClass('re')) {
			t.addClass('active');
			target.addClass('active');
		}else {
			target.removeClass('active');
			t.removeClass('re');
		}
	});

	$('.last-motion').on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd animationend webkitAnimationEnd',function  () {
		var t = $(this);
		var target = t.attr('data-target') ? $(t.attr('data-target')) : t.parents('.interaction').find('.js-interaction');

		target.removeClass('active').addClass('re');
	});
});
