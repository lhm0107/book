$(function(){
	"use strict";

    new Swiper('.mind-slider-wrap .swiper-container', {
        nextButton: '.mind-slider-wrap .swiper-button-next',
        prevButton: '.mind-slider-wrap .swiper-button-prev',
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

    var $dragItem = $('.mindmap .drag-obj');
    var $dropItem = $('.mindmap .painting-area');

	$dragItem.on('touchmove',function(event){
		event.preventDefault();
		event.stopPropagation();
	});

	$dragItem.draggable({
		helper: 'clone',
        appendTo: '.mindmap',
		scope: 'box',
		start: function(){
			$(this).addClass('dragging');
		},
		stop: function(){
			$(this).removeClass('dragging');
		}
	});

    $dropItem.droppable({
        accept: '.drag-obj',
		scope: 'box',
		tolerance: 'fit',
        drop: function(e, ui){
			var $t = $(this);
			var $dragItem = $(ui.draggable);

			if(!$dragItem.hasClass('drag-item-clone')){
				var newDrag = ui.draggable.clone();
				$t.append(newDrag);

				newDrag.removeClass('dragging').addClass('drag-item-clone').css({
					top: ui.helper.offset().top - 166,
					left: ui.helper.offset().left - 10
				}).draggable({
					scope: 'box',
					revert: 'invalid',
					revertDuration: 0
				});
				$dragItem.draggable('option', 'disabled', true);
			}
        }
    });

	$('.mindmap-top .icon-del').click(function(){
		$dropItem.find('.drag-obj').remove();
		$dragItem.draggable('option', 'disabled', false);
	});
});
