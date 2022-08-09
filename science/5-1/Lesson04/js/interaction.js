$(function(){
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
