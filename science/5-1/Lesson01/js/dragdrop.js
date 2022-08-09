$(function(){
	"use strict";
	var $dragItem = $('.drag-item');
	var $dropBox = $('.drop-item');

	$dragItem.on('touchmove',function(event){
		event.preventDefault();
		event.stopPropagation();
	});

	$dragItem.draggable({
		helper: 'clone',
		scope: 'box',
		start: function(){
			$(this).addClass('dragging');
		},
		stop: function(){
			$(this).removeClass('dragging');
		}
	});

	$dropBox.droppable({
		accept: '.drag-item',
		scope: 'box',
		drop: function(e, ui){
			var $t = $(this);
			var $dragItem = $(ui.draggable);
			var dragChance = $dragItem.data('chance') || $dragItem.attr('data-chance');
			var dropChance = $t.data('chance');

			if($dragItem.parent()[0] !== this && $t.find('.drag-item').length){
				var $before = $t.find('.drag-item');
				var $root = $before.data('root');

				$root.find('.drag-item:not(.dragging)').eq($before.data('index')).draggable('option', 'disabled', false);
				$before.remove();
				$t.prev().val('');
			}

			if($dragItem.hasClass('drag-item-clone')){
				//$dragItem.parent().droppable('option', 'disabled', false);
				$t.append(ui.draggable);
				$dragItem.css({top: 0, left: 0}).draggable();
			}else{
				var newDrag = ui.draggable.clone();
				var dragRoot = $dragItem.closest('.drag-area');
				var index = dragRoot.find('.drag-item').index($dragItem);

				(dragChance === 1 || !dragChance) && $dragItem.draggable('option', 'disabled', true);

				$t.append(newDrag);
				newDrag.removeClass('dragging').addClass('drag-item-clone').data({
					'index': index,
					'root': dragRoot
				}).draggable({
					scope: 'box',
					revert: true,
					revertDuration: 0
				});

				dragChance && $dragItem.data('chance', --dragChance);
			}

			//(!dropChance || $t.children().length === dropChance) && $t.droppable('option', 'disabled', true);

			var inputVal = $dragItem.attr('data-text') || $dragItem.text();

			if(dropChance && $t.prev().val()){
				$t.prev().val($t.prev().val()+', '+inputVal)
			}else{
				$t.prev().val(inputVal)
			}
		}
    });

	$('.drop-refresh').click(function(){
		var target = this.dataset.target ? $(this.dataset.target) : $('body');
		target.find('.drop-item').droppable('option', 'disabled', false).children().remove();
		target.find('.drag-item').draggable('option', 'disabled', false).data('chance', 0);
	});

	setTimeout(function(){
		$dropBox.prev().each(function(){
			var $input = $(this);
			var val = $input.val().replace(/\s|　/gi, '');
			if(val){
				var ele;

				$dragItem.each(function(){
					var $drag = $(this);
					if($drag.text().replace(/\s|　/gi, '') === val && !$input.next().children().length){
						ele = $drag.clone().removeClass('ui-draggable ui-draggable-handle').addClass('drag-item-clone');
						$drag.draggable('option', 'disabled', true);
						$input.next().append(ele);
						$input.next().children().draggable({
							scope: 'box',
							revert: true,
							revertDuration: 0
						});
						$input.next().droppable('option', 'disabled', true);
					}
				});
			}
		});
	},2000);
});
