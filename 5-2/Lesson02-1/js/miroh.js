var $miroh = $('#miroh'),
    correct,
    tStep = $('#mirohStep').children(),
    tQ = $('#mirohQ').children(),
    i = 0;

function gameReset(){
    $miroh.removeClass('start').find('li, button').removeClass('active on done wrong');
    $('.start-boardgame>img').show();
    i = 0;
}

function nextStep(correct){
    !i && $('.start-boardgame').children().hide();

    i && tQ.eq(i-1).addClass('done');
    tStep.removeClass('active').eq(i).addClass('active');

    if(!correct){
        tStep.eq(i-1).addClass('wrong');
        tQ.eq(i-1).append('<button type="button" class="icon-btn-refresh btn-game-prev">되돌리기</button>');
        return false;
    }

    tQ.eq(i).addClass('active');
    i++;
}

$('.btn-game-start').click(function(){
    $miroh.addClass('start');
    $('.btn-game-refresh').show();
    nextStep(true);
});

$(document).on('click', '.btn-game-prev', function(){
    var $t = $(this);

    $t.parent().removeClass('done').find('.on').removeClass('on');
    tStep.eq(i-1).removeClass('wrong').addClass('active');
    tStep.eq(i).removeClass('active');
    $t.remove();
});


$('.btn-game-finish').click(function(){
    effectAudio.play('fireworks');
    $('.modal-alert-finish').modal('hide');
    $('.latest.active').parent().addClass('finish');
});

$('.btn-game-refresh').click(gameReset);

$('[data-toggle="ox"]').click(function(){
    var $t = $(this);

    if($t.attr('class') === $t.parent().data('answer')){
        correct = true;
        $t.parent().next().length ? effectAudio.play('correct') : effectAudio.play('fireworks');
    }else{
        effectAudio.play('wrong');
        correct = false;
    }

    $t.addClass('on');

    nextStep(correct);
});
