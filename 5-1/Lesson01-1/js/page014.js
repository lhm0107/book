$(function(){
	"use strict";

	var magnify;

	$('.btn-magnify').click(function(){
		var $t = $(this);
		if($t.hasClass('on')){
			$t.removeClass('on')
			$('.word-bubble [class*=icon-btn]').not($t).removeClass('pointer-none');;
			magnify.destroy();
		}else{
			$t.addClass('on');
			$('.word-bubble [class*=icon-btn]').not($t).addClass('pointer-none');
			magnify = $('.enlarge-image').magnify({
				afterLoad: function(e) {
					$('.magnify').addClass('init');
				}
		    });
		}
	});


	$('html').on({
		magnifystart: function() {
			$('.magnify').removeClass('init');
		}
	});
});
