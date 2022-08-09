$(function(){
    var i;
    var $line = $('.line');

    $('.icon-hand').click(function(){
        i = 0;
        $(this).toggleClass('re');
        $line.toggleClass('show');
    });

    $('.left').first().on("animationend", function(){
        i++;

        if(i<3){
            $line.removeClass('show');
            $line.width();
            $line.addClass('show');
        }
    });
});
