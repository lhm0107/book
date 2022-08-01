$(function(){
    $('.btn-quiz').click(function(){
        $('.quiz-list').children().removeClass('active').eq($(this).index()).addClass('active');
        $('#quiz').show();
    });

    $('[data-toggle=answer-quiz]').click(function(){
        var question = $($(this).data('target'));
        var target = question.find('.form-control');
        var isCorrect = isAnswer = true;
        var num = target.length, dataNum = 0

        target.each(function(){
            var tV = $.trim($(this).val().replace(/\s|　/gi, '')),
                dA = $(this).parent().attr('data-answer'),
                dArray = dA.indexOf('@@') > -1 && dA.split('@@');

            if(tV==''){
                isAnswer = false;
                return false;
            }

            if(dArray[1] && $.inArray(tV,dArray) === -1){
                isCorrect = false;
                return false;
            }else if(!dArray && tV!==dA.replace(/\s|　/gi, '')){
                isCorrect = false;
                return false;
            }
        });

        if(!isAnswer){
            showMsg('#answerMsg');
            return false;
        }

        if(isCorrect){
            showMsg('#finalEvltGood');
            effectAudio.play('correct');
            question.addClass('answered');
            $('.btn-quiz').eq(question.index()).addClass('correct');
        }else if(question.hasClass('again')) {
            question.removeClass('again').addClass('answered');
        }else{
            showMsg('#finalEvltOnemore');
            effectAudio.play('again');
            question.addClass('again');
            target.find('input').val('');
        }
    });

    $('[data-toggle="answer-refresh"]').click(function(){
        $('.heritage').eq($(this).closest('li').index()).removeClass('correct');
    });
});
