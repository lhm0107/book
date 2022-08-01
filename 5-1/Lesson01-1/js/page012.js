$(function(){
	"use strict";

	var dragdropSwiper = new Swiper('.drag-area .swiper-container', {
		nextButton: '.drag-area .swiper-button-next',
		prevButton: '.drag-area .swiper-button-prev',
		slidesPerView: 4,
		slidesPerGroup: 4,
		observer: true,
		observeParents: true,
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

	var $dragItem = $('.drag-fix');
	var $dropBox = $('.drop-fix');

	$dragItem.on('touchmove',function(event){
		event.preventDefault();
		event.stopPropagation();
	});

	$dragItem.draggable({
		helper: 'clone',
		scope: 'fbox',
		appendTo: '.modal-body',
		revertDuration: 0,
		start: function(){
			$(this).addClass('dragging');
		},
		stop: function(){
			$(this).removeClass('dragging');

			if(!$(this).hasClass('ui-draggable-disabled')){
				effectAudio.play('again');
			}
		}
	});

	$('.map').droppable({
		scope: 'fbox',
		tolerance: 'fit',
		drop: function(){
			effectAudio.play('again');
		}
	});

	$dropBox.each(function(i){
		var $t = $(this);
		$t.droppable({
			accept: '.drag-fix[data-drop="'+$t.data('drop')+'"]',
			scope: 'fbox',
			greedy: true,
			drop: function(e, ui){
				var $dropItem = $(this);
				var $dragItem = $(ui.draggable);
				var dropArr = String($dropItem.data('drop')).indexOf(',') !== -1 && $dropItem.data('drop').split(',');


				effectAudio.play('correct');
				$dragItem.draggable('option', 'disabled', true);
				$dropItem.droppable('option', 'disabled', true);

				$('.drop-fix-bg>div').eq(i).show();

				var inputVal = $dragItem.attr('data-text') || $dragItem.text();
			}
	    });
	});

	$('.drop-refresh').click(function(){
		$('.drop-fix').droppable('option', 'disabled', false).empty();
		$('.drag-fix').draggable('option', 'disabled', false);
		$('.drop-fix-bg>div').hide();
	});
});
