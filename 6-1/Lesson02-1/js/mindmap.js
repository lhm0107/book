$(function(){
	"use strict";

    new Swiper('.mind-slider-wrap .swiper-container', {
        nextButton: '.mind-slider-wrap .swiper-button-next',
        prevButton: '.mind-slider-wrap .swiper-button-prev',
        slidesPerView: 6,
        slidesPerGroup: 6,
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

    // var $dragItem = $('.drag-item');
    // var $dragLayer = $('#layerDragDrop');
    // var $dragBtn = $('.btn-drag-start');
    // var $dropItem = $('.drop-item');
    // var $dropzone = $('.dropzone');
    //
	// $dragItem.on('touchmove',function(event){
	// 	event.preventDefault();
	// 	event.stopPropagation();
	// });
    //
	// $dragItem.draggable({
	// 	helper: 'clone',
    //     appendTo: '.dragdrop',
	// 	start: function(){
	// 		$(this).addClass('dragging');
	// 	},
	// 	stop: function(){
	// 		$(this).removeClass('dragging');
	// 	}
	// });
    //
    // $dropItem.droppable({
    //     accept: '.drag-item',
    //     disabled: true,
    //     drop: function(e, ui){
    //         var $t = $(this);
    //         var newDrag = ui.draggable.clone().removeClass('dragging ui-draggable ui-draggable-handle');
    //         var idx = $dropItem.index(this);
    //
    //         $t.append(newDrag);
    //         $t.droppable('option', 'disabled', true);
    //         $(ui.draggable).draggable('option', 'disabled', true);
    //         $t.next().hide();
    //
    //         if(idx === 7){
    //             $dragLayer.hide();
    //             $dropzone.removeClass('active');
    //         }else{
    //             $dropItem.eq(idx+1).droppable('option', 'disabled', false);
    //             $dragBtn.eq(idx+1).show();
    //         }
    //     }
    // });
    //
    // $dragBtn.click(function(){
    //     if($dropzone.hasClass('active')){
    //         $dragLayer.hide().next().removeClass('active');
    //     }else{
    //         $dragLayer.show().next().addClass('active');
    //         $(this).prev().droppable('option', 'disabled', false);
    //     }
    // });
    //
    // $dragLayer.find('[data-toggle="layerClse"]').click(function(){
    //     $dropzone.removeClass('active');
    // });
});
