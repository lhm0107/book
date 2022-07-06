$(function(){
	"use strict";
	var $dragItem = $('.drag-fix');
	var $dropBox = $('.drop-fix');

	$dragItem.on('touchmove',function(event){
		event.preventDefault();
		event.stopPropagation();
	});

	$dragItem.draggable({
		helper: 'clone',
		scope: 'fbox',
		revertDuration: 0,
		start: function(){
			$(this).addClass('dragging');
		},
		stop: function(){
			$(this).removeClass('dragging');
		}
	});

	$dropBox.droppable({
		accept: '.drag-fix',
		scope: 'fbox',
		drop: function(e, ui){
			var $dropItem = $(this);
			var $dragItem = $(ui.draggable);
			var dropArr = String($dropItem.data('drop')).indexOf(',') !== -1 && $dropItem.data('drop').split(',');

			if(($dragItem.data('drop') === $dropItem.data('drop')) || $.inArray(String($dragItem.data('drop')),dropArr)>-1){
				effectAudio.play('correct');
				$dropItem.append(ui.draggable.html());
				$dragItem.draggable('option', 'disabled', true);
				$dropItem.droppable('option', 'disabled', true);

				var inputVal = $dragItem.attr('data-text') || $dragItem.text();

				if($dropItem.prev().val()){
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
		target.find('.drag-fix').draggable('option', 'disabled', false);

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
