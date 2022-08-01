$(function(){
	"use strict";
	var dragdropSwiper = new Swiper('.dragdrop .swiper-container', {
		nextButton: '.swiper-button-next',
		prevButton: '.swiper-button-prev',
		slidesPerView: 5,
		slidesPerGroup: 5,
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

    $('.swiper-slide').click(function(){
        var $t = $(this);
        $('.badge-text').html('<strong>'+$t.find('.sr-only').text()+'</strong> '+$t.find('img').attr('alt'));
    });

    var $dragItem = $('.drag-item');
    var $dragLayer = $('#layerDragDrop');
    var $dragBtn = $('.btn-drag-start');
    var $dropItem = $('.drop-item');
    var $dropzone = $('.dropzone');
	var $resetBtn = $('.drop-refresh');

	$dragItem.on('touchmove',function(event){
		event.preventDefault();
		event.stopPropagation();
	});

	$dragItem.draggable({
		helper: 'clone',
        appendTo: '.dragdrop',
		start: function(){
			$(this).addClass('dragging');
		},
		stop: function(){
			$(this).removeClass('dragging');
		}
	});

    $dropItem.droppable({
        accept: '.drag-item',
        disabled: true,
        drop: function(e, ui){
            var $t = $(this);
            var newDrag = ui.draggable.clone().removeClass('dragging ui-draggable ui-draggable-handle');
            var idx = $dropItem.index(this);

			$resetBtn.show();

            $t.append(newDrag);
            $t.droppable('option', 'disabled', true);
            $(ui.draggable).draggable('option', 'disabled', true);
            $t.next().hide();

            if(idx === 7){
                $dragLayer.hide();
                $dropzone.removeClass('active');
            }else{
                $dropItem.eq(idx+1).droppable('option', 'disabled', false);
                $dragBtn.eq(idx+1).show();
            }
        }
    });

    $dragBtn.click(function(){
        if($dropzone.hasClass('active')){
            $dragLayer.hide().next().removeClass('active');
        }else{
            $dragLayer.show().next().addClass('active');
            $(this).prev().droppable('option', 'disabled', false);
        }
    });

    $dragLayer.find('[data-toggle="layerClse"]').click(function(){
        $dropzone.removeClass('active');
    });

	$('.drop-refresh').click(function(){
		$dropItem.droppable('option', 'disabled', false).children().remove();
		$dragItem.draggable('option', 'disabled', false);
		$('.badge-text').html('딱지를 클릭하면 설명을 볼 수 있어요');
		dragdropSwiper.slideTo(0);
		$dragBtn.hide().eq(0).show();
	});
});
