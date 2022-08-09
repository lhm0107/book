$(function(){
	"use strict";

	if($('.layer-ttakji .swiper-container').length){
		var slides = $('.layer-ttakji .swiper-container').data('slides') || 5;
		var dragdropSwiper = new Swiper('.layer-ttakji .swiper-container', {
			nextButton: '.swiper-button-next',
			prevButton: '.swiper-button-prev',
			slidesPerView: slides,
			slidesPerGroup: slides,
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
	}

	var $dragItem = $('.drag-fix');
	var $dropBox = $('.drop-fix');
	var target = 'parent';

	$dragItem.on('touchmove',function(event){
		event.preventDefault();
		event.stopPropagation();
	});

	$dragItem.each(function(){
		var $t = $(this);
		if($t.closest('.layer-ttakji').length){
			target = $t.closest('.layer-ttakji');
		}

		$t.draggable({
			helper: 'clone',
			scope: 'fbox',
			revertDuration: 0,
			appendTo: target,
			start: function(){
				$(this).addClass('dragging');
			},
			stop: function(){
				$(this).removeClass('dragging');
			}
		});
	});

	$dropBox.droppable({
		accept: '.drag-fix',
		scope: 'fbox',
		drop: function(e, ui){
			var $dropItem = $(this);
			var $dragItem = $(ui.draggable);
			var dragItemCnt = $dragItem.attr('data-drop-count') ;
			var dropArr = String($dropItem.data('drop')).indexOf(',') !== -1 && $dropItem.data('drop').split(',');
			var dropChance = $dropItem.data('chance');

			if(($dragItem.data('drop') === $dropItem.data('drop')) || $.inArray(String($dragItem.data('drop')),dropArr)>-1){
				effectAudio.play('correct');
				$dropItem.append(ui.draggable.html()); 
				if (dragItemCnt>1) { // 드래그 아이템  여러번 드래그 필요시
					$dragItem.attr('data-drop-count' , dragItemCnt - 1 ) ; 
				} else {
					$dragItem.draggable('option', 'disabled', true);
				}

				(!dropChance || $dropItem.children().length === dropChance) && $dropItem.droppable('option', 'disabled', true);

				var inputVal = $dragItem.attr('data-text') || $dragItem.text();

				if(dropChance && $dropItem.prev().val()){
					$dropItem.prev().val($dropItem.prev().val()+', '+inputVal)
				}else{
					$dropItem.prev().val(inputVal);
				}

				$dragItem.closest('.layer-ttakji').length && $('.ttakji-refresh[data-target="#'+$dragItem.closest('.layer-ttakji').attr('id')+'"]').show();
			}else{
				effectAudio.play('again');
			}
		}
    });

	$('.drop-refresh').click(function(){
		var target = this.dataset.refresh ? $(this.dataset.refresh) : $('body');
		target.find('.drop-fix').droppable('option', 'disabled', false).empty();

		target.find('.drag-fix').each(function(){
			$(this).draggable('option', 'disabled', false);
			if ($(this).data('drop-count')) {
				var dragVal = $(this).data('drop') ;
				var dropVal = target.find('.drop-fix[data-drop='+dragVal+']').length  ;
				$(this).attr('data-drop-count',dropVal) ;
			}
		});

		$(this).hasClass('ttakji-refresh') && $(this).hide();
	});

	// setTimeout(function(){
	// 	$dropBox.prev().each(function(){
	// 		var $input = $(this);
	// 		var val = $input.val().replace(/\s|　/gi, '');
	// 		if(val){
	// 			var ele;
	//
	// 			$dragItem.each(function(){
	// 				var $drag = $(this);
	// 				if($drag.text().replace(/\s|　/gi, '') === val && !$input.next().children().length){
	// 					ele = $drag.clone().removeClass('ui-draggable ui-draggable-handle').addClass('drag-item-clone');
	// 					$drag.draggable('option', 'disabled', true);
	// 					$input.next().append(ele);
	// 					$input.next().children().draggable({
	// 						scope: 'box',
	// 						revert: true,
	// 						revertDuration: 0
	// 					});
	// 					$input.next().droppable('option', 'disabled', true);
	// 				}
	// 			});
	// 		}
	// 	});
	// },2000);
});
