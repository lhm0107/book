$(function(){
    function wordCheck(target, direction){
        var isEnd = true;
        var point = $(target).parent('.point.'+direction);

        if(!$(target).val()){
            return false;
        }

        $(target).each(function(){
            if($(this).val().replace(/\s|　/gi, '') === ''){
                isEnd = false;
                return false;
            }
        });

        if(isEnd && !point.find('.icon-btn-chk').length){
            point.append('<button type="button" class="icon-btn-chk" data-toggle="answer-word">정답체크</button>');
            point.find('[data-toggle="answer-word"]').data('target', target);
        }else if(!isEnd){
            point.find('.icon-btn-chk').remove();
        }
    }

    $('.cross-word input').on('change keyup',function(){
    	var $t = $(this);
    	var val = $t.val().replace(/\s|　/gi, '');
        var verNum = this.dataset.ver;
        var horNum = this.dataset.hor;

        verNum && wordCheck('[data-ver="'+verNum+'"]', 'ver');
        horNum && wordCheck('[data-hor="'+horNum+'"]', 'hor');
    });

    $('body').on('click', '[data-toggle="answer-word"]', function(){
        var isCorrect = true;
        var $t = $(this);
        var input = $($t.data('target'));

        input.each(function(i, ele){
            if($(ele).val() !== $(ele).parent().data('answer')){
                isCorrect = false;
                return false;
            }
        });

        input.prop('disabled', true);

        if(isCorrect){
            showMsg('#stamp');
            effectAudio.play('correct');
        }else{
            $t.after('<button type="button" class="icon-btn-refresh" data-toggle="answer-word-refresh">다시하기</button>');
            $t.next('[data-toggle="answer-word-refresh"]').data('target', $t.data('target'));

            input.each(function(i, ele){
                if($(ele).val() !== $(ele).parent().data('answer')){
                    $(ele).addClass('wrong');
                }
            });
        }

        $t.remove();
    });

    $('body').on('click', '[data-toggle="answer-word-refresh"]', function(){
        var $t = $(this);
        var input = $($t.data('target'));
        input.filter('.wrong').removeClass('wrong').prop('disabled', false).val('');
        $t.remove();
    });

    $('.cross-word-refresh').click(function(){
        $('.cross-word button').remove();
        $('.cross-word input').prop('disabled', false).removeClass('wrong');
    });
});
