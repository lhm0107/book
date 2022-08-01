$(function(){
    $('.order-inter-btn>button').each(function(e){
		var $t = $(this);
		var root = $t.parent().data('parent');

		$t.click(function(){

            $(root).find('.order-inter-content').children().eq(e).addClass('active');
            $t.addClass('hide');

            document.getElementById(this.dataset.audio).ontimeupdate = function(){
                if(this.currentTime === this.duration){
                    $(root).find('.order-inter-content').children().eq(e).addClass('motion-end');
                    $t.next().removeClass('hide');
                }
            }

			if(!$t.next().length){
				$('.btn-order-reset[data-target="'+root+'"]').removeClass('hide');
			}
 		});
	});

	$('.btn-order-reset').click(function(){
		var $handBtn = $(this.dataset.target).find('.order-inter-btn').children();
		$(this.dataset.target).find('.order-inter-content').children().removeClass('motion-end active');
		$handBtn.addClass('hide').eq(0).removeClass('hide');
        $handBtn.each(function(){
            audioPause($('#'+this.dataset.audio)[0]);
        });
		$(this).addClass('hide');
	});
});
