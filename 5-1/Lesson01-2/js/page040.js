$(function(){
	"use strict";

	var magnify;

	$('.btn-magnify').click(function(){
		var $t = $(this);
		if($t.hasClass('on')){
			$t.removeClass('on')
			magnify.destroy();
		}else{
			$t.addClass('on');
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
