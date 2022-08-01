$(function(){
    var i;
    var $child = $('.inter').children();

    $('.icon-hand').click(function(){
        i = 0;
        $(this).toggleClass('re');
        $child.toggleClass('hide');
    });

    $('.bubble-left').on("animationend", function(){
        i++;

        if(i<3){
            $child.addClass('hide');
            $child.width();
            $child.removeClass('hide');
        }
    });
});
