$(function(){
	"use strict";
	$('.icon-hand').click(function(){
        var $img = $(this).siblings('img');
        var $interDiv = $(this).prev('div');

        $interDiv.toggleClass('active');
        $(this).hide();
        
        if ( $interDiv.hasClass('active') ){
            $img.css('opacity','0');
        }
	});
});
