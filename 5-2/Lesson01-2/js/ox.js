$('.answer-ox input').change(function(){
    var question = $(this).closest('.layer-wrp');

    if(this.dataset.answer === ''){
        showMsg('#finalEvltGood');
        effectAudio.play('correct');
        question.addClass('answered');
    }else if(question.hasClass('again')) {
        question.removeClass('again').addClass('answered wrong');
    }else{
        showMsg('#finalEvltOnemore');
        effectAudio.play('again');
        question.addClass('again');
        $(this).prop('checked', false);
    }
});


var btn = document.querySelectorAll('.btn-ox-start');

btn.forEach(function(item){
    item.onclick = function(){
        toggleAudioPlay(this.dataset.audio, this);
    }
});

$('.btn-ox-reset').click(function(){
    $(this).closest('.answered').removeClass('answered again wrong');
    $(this.dataset.target).find('input').prop('checked', false);
});
