$(function(){
	"use strict";

	// 손가락 클릭 - 오디오 자동 순차 재생
	var $btnInterGroup = $('.btn-inter-group');

	$('[data-inter]').click(function(){
		var $t = $(this);
		var $root = $(this.dataset.inter);
		var startItem = $(this.dataset.inter).children().first();

		$('audio, video:not([autoplay])').each(function(){
			audioPause($(this)[0]);
		});

		unitGoalClose();

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

		if(startItem.data('auto-audio')){
			setTimeout(function() {
				document.getElementById(startItem.data('auto-audio')).play();
			}, 100);
		}
	});

	$('[data-auto-audio]').each(function(i, ele){
		document.getElementById(ele.dataset.autoAudio).ontimeupdate = function(){
			if(this.currentTime === this.duration){

				if($(ele).hasClass('audio-single')){
					$(ele).parent().removeClass('interacting');
					$btnInterGroup.removeClass('pointer-none');
					return false;
				}

				var $nextItem = $(ele).next();

				if($nextItem.length){
					$nextItem.addClass('visible');
					$nextItem.data('auto-audio') && document.getElementById($nextItem.data('auto-audio')).play();
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
			audioPause($(this)[0]);
		});
	});

	// 손가락 순차등장
	$('.order-inter-btn>button').each(function(e){
		var $t = $(this);
		var root = $t.parent().data('parent');

		$t.click(function(){

			if($t.data('audio')){
				$(root).find('.order-inter-content').children().eq(e).addClass('active');
				$t.addClass('hide');

				document.getElementById(this.dataset.audio).ontimeupdate = function(){
					if(this.currentTime === this.duration){
						$t.next().removeClass('hide');
					}
				}
			}else{
				$(root).find('.order-inter-content').children().eq(e).addClass('active');
				$t.addClass('hide').next().removeClass('hide');
			}

			if(!$t.next().length){
				$('.btn-order-reset[data-target="'+root+'"]').removeClass('hide');
			}
 		});
	});

	$('.btn-order-reset').click(function(){
		var $handBtn = $(this.dataset.target).find('.order-inter-btn').children();
		$(this.dataset.target).find('.order-inter-content').children().removeClass('active');
		$handBtn.addClass('hide').eq(0).removeClass('hide');
		if($handBtn.data('audio')){
			$handBtn.each(function(){
				audioPause($('#'+this.dataset.audio)[0]);
			});
		}
		$(this).addClass('hide');
	});
});
