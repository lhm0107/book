var efAudio = function(media) {
	this.effects = [
		'correct',
		'wrong',
		'fireworks',
		'again',
		'clap',
	];
	this.create();
};

function audioControl(ele){
    ele.pause();
    if (!isNaN(ele.duration)) {
        ele.currentTime = 0;
    }
}

var $unitGoal = $('#unitGoal');
function unitGoalClose(o){
	if ($unitGoal.is(':visible') && $(o).attr('id') !== 'unitGoal') {
		$unitGoal.find('[data-toggle="layerClse"]').trigger('click');
	}
}

function interactionStop(){
	$('.btn-inter-group').removeClass('pointer-none');

	if($('.interacting').length){
		$('.interacting').each(function(){
			var $t = $(this);

			$t.removeClass('interacting');

			if(!$t.hasClass('audio-single')){
				$t.children().removeClass('visible');
				$('[data-inter="#'+$t.attr('id')+'"]').removeClass('hide');
				$('.btn-inter-reset').removeClass('show');
			}
		});
	}
}

function audioStop(prop){
	interactionStop();

	$('audio, video:not([autoplay])').each(function(){
		audioControl($(this)[0]);
	});
}

efAudio.prototype.create = function() {
	var effectLen = this.effects.length;
	var i = 0;
	var audio = null;
	var src = 'media/audio/';
	var file;

	var audioWrap = document.createElement('div');
	audioWrap.className = 'effect-audio-wrap';
	audioWrap.setAttribute('style', 'display: none');

	for (i = 0; i < effectLen; i++) {
		audio = document.createElement('audio');
		audio.id = 'effect-audio-' + this.effects[i];
		audio.className = 'effect-audio';
		file = this.effects[i];

		audio.preload = 'auto';
		//audio.autoplay = true;
		audio.src = src + file + '.mp3';
		audioWrap.appendChild(audio);
	}

	$('body').append(audioWrap);
};

efAudio.prototype.play = function(type) {
	var audio = null;
	audio = document.getElementById('effect-audio-' + type);
	if (!audio) {
		return;
	}

	audioStop();
	setTimeout(function() {
		audio.play();
	}, 100);
};

var effectAudio = new efAudio();

function toggleAudioPlay(target, t){
    var audio = document.getElementById(target);

    $('audio').not('#'+target).each(function(){
		audioControl($(this)[0]);
	});

	interactionStop();

    if(t.dataset.toggle === 'layer' && $(t.dataset.target).is(':visible')){
        audioControl(audio);
        return false;
    }

    //$unitGoal.length && unitGoalClose(t.dataset.target);

    audio.paused ? audio.play() : audioControl(audio);
}

$(function(){
	"use strict";

	//문제팝업
	var $finalChkButtons = $('.final-chk-buttons');
	if($finalChkButtons.length){
		$finalChkButtons.each(function(){
			$(this).data('chance', 1);
		});
	}

	$('#wrap').append('<div id="answerMsg" class="answer-msg" data-toggle="layerClse"><p class="txt">답안을 입력하세요.</p></div>');

	//텍스트
	$('.form-overlay input, .form-overlay textarea').on({
		focus:function(){
			$(this).parent().addClass('on');
		},
		blur:function  () {
			if ($(this).val().replace(/\s|　/gi, '')=='') {
				$(this).parent().removeClass('on');
			}
		}
	}).each(function(){
		var $t = $(this);
		setTimeout(function(){
			if(!$t.val().replace(/\s|　/gi, '')){
				$t.parent().removeClass('on');
			}
		},2000);
	});

	$('.only-num').keyup(function(){
		$(this).val($(this).val().replace(/[^0-9]/g,""));
	});

	$('.not-hangul').keyup(function(){
		$(this).val($(this).val().replace(/[^a-zA-Z0-9]/gi,""));
	});

	var prevVal = '';
	$('.only-num-point').keyup(function(){
		var obj = this;
		var point = $(this).attr('data-point') || 1;
		var regexp = new RegExp('^\\d*(\\.\\d{0,'+point+'})?$');
		obj.value.search(regexp) ? obj.value = prevVal : prevVal = obj.value;
	});


	//버튼
	$('.btn-toggle').click(function  () {
		var t = $(this);
		t.parent().toggleClass('on');
		$($(this).attr('data-target')).toggle();
	});

	$('.btn-toggle-class').click(function(){
		$($(this).attr('data-target')).toggleClass('active');
	});

    $('.btn-toggle-class2').click(function(){
		$($(this).attr('data-target')).toggleClass('active');
        var t = $(this);
		t.parent().toggleClass('open');
	});

	$('[data-toggle="tab"]').click(function  (e) {
		e.preventDefault();
		var t = $(this),
			target = t.attr('data-target'),
			slide = t.attr('data-swiper');
		target && $(target).addClass('active').siblings().removeClass('active');
		if(slide) $('#modalFinalEvlt').length ? testSwiper[slide].slideTo(0) : swiper[slide].slideTo(0);
		t.parent().addClass('active').siblings().removeClass('active');
	});

	$('.btn-inline-video').click(function(){
		var t = $(this);
		var inlineMove = $(this.dataset.target);
		var vid = inlineMove.find('video')[0];
		inlineMove.toggle();

		vid.onended = function() {
			vid.load();
			inlineMove.hide();
		};

		if(t.hasClass('icon-btn-close')){
			vid.pause();
			vid.load();
		}else{
			vid.play();
		}
	});

	// layer
	$(document).on('click', '[data-toggle=layer]', function(){
		var btn = $(this),
			o = btn.attr('data-target'),
			oParent = btn.attr('data-chk') ? $(btn.attr('data-chk')) : $(o).closest('.layer-wrp');

		// 값 없으면 리턴
		var isAnswer = false;

		if (o.substring(1,10)!='layerSelf' && !oParent.hasClass('box-q') && !btn.hasClass('icon-ibtn-group')) {
			var inputLength = oParent.find('input').length,
				textLength = oParent.find('textarea').length;
			if(textLength && inputLength){
				var num = textLength + inputLength, dataNum = 0;
				oParent.find('textarea').each(function(){
					if($(this).val().replace(/\s|　/gi, '')!==''){
						dataNum++
					}
				});
				oParent.find('input').each(function(){
					if($(this).val().replace(/\s|　/gi, '')){
						dataNum++
					}
				});
				if (dataNum == num) isAnswer = true;
				if(!isAnswer){
				   $(o).hide().closest('.layer-wrp').removeClass('open');
					showMsg('#answerMsg');
				   return false;
				}
			} else if(o.substring(1)!='layerSelf' && inputLength){
				var num = inputLength, dataNum = 0;
				oParent.find('input').each(function(){
					if($(this).val().replace(/\s|　/gi, '')){
						dataNum++
					}
				});
				if (dataNum == num) isAnswer = true;
				if(!isAnswer){
				   $(o).hide().closest('.layer-wrp').removeClass('open');
					showMsg('#answerMsg');
				   return false;
				}
			} else if (textLength) {
				var num = textLength, dataNum = 0;
				oParent.find('textarea').each(function(){
					if($(this).val().replace(/\s|　/gi, '')!==''){
						dataNum++
					}
				});
				if (dataNum == num) isAnswer = true;
				if(!isAnswer){
				   $(o).hide().closest('.layer-wrp').removeClass('open');
					showMsg('#answerMsg');
				   return false;
				}

			}
		}

		if(btn.data('layer-accordion')){
			$('[data-toggle="layerClse"]').not(o).hide().closest('.layer-wrp').removeClass('open');
		}

		$(o).toggle().closest('.layer-wrp').toggleClass('open');

		this.onclick == null && audioStop();

		$unitGoal.length && unitGoalClose(o);

		if ($(o).hasClass('layer-info')) {
			$('.layer-info').each(function  () {
				var t = $(this);
				t.attr('id') != o.substring(1) && t.hide().closest('.layer-wrp').removeClass('open');
			});
		}
		return false;
	});

	$('body').on('click','[data-toggle=layerClse]',function(event){
		var t = $(this);
		var $layer = t.parent();

		if(t.hasClass('icon-layer-clse')){
			audioStop();
			t.parent().hide().closest('.layer-wrp').removeClass('open');
		}

		if($(event.target).is('a,a *,button,input,textarea,label,[role=button],label *, .event-disabled, .event-disabled *')){
			return;
		}

		this.children[0].onclick == null && audioStop();

		event.stopPropagation();
		t.hide().closest('.layer-wrp').removeClass('open');
	});

	$('[id^=drawHelper] .close').click(function(){
		$(this).parent().hide().closest('.layer-wrp').removeClass('open').find('[data-toggle=layer]').removeClass('on');
	});

	// modal
	if($('.wrapper #qLine').length){
		qLine('qLine');
	}

	$('[data-toggle=modal]').click(function(){
		var target = $($(this).attr('data-target'));
		audioStop();
		$unitGoal.length && unitGoalClose(target);

		if(target.hasClass('modal-dim')){
			target.before('<div class="dim"></div>');
		}

		if(target.find('video').length && target.hasClass('modal-video-overlay')){
			target.show();
			target.find('video')[0].play();
		}else{
			target.show(0, function  () {
				$('body').addClass('modal-open');
				if(target.find('#qLine').length && !target.find('#canvasqLine').length){
					qLine('qLine');
				}
			});
		}
		return false;
	});

	$('[data-dismiss=modal]').click(function(){
		var $modal = $(this).closest('.modal');
		var time = $modal.hasClass('modal-slide') ? 600 : 400;

		$('body').removeClass('modal-open');

		setTimeout(function(){
			$modal.hide().find('video.playing').removeClass('playing');
			$modal.find('video').length && audioControl($modal.find('video')[0]);
			$('.dim').remove();
		},time);

		return false;
	});

	$('button.btn-narr').click(function(){
		$(this).toggleClass('open').parents('.modal').find('.narr').toggle();
        if( $(this).text() == '자막 보기'){
            $(this).text('자막 닫기');
            } else {
            $(this).text('자막 보기');
        }
    });
	$('.btn-test-modal').click(function() {
		var	num = $(this).attr('data-swiper'),
			slide = num ? num : 0;

		if (num && num.indexOf(',')) {
			var arr = num.split(',');
			for (var i=0; i<arr.length; i++) {
				testSwiper[arr[i]].update();
				testSwiper[arr[i]].slideTo(0);
			}
		}else {
			testSwiper[slide].update();
			testSwiper[slide].slideTo(0);
		}
	});

	// 정답확인
	$('[data-toggle=answer]').click(function(){
		var t = $(this),
			o = $(t.attr('data-target'));
		// 값 없으면 리턴
		var isAnswer = false;

		if(t.attr('data-multi')){
			var prop1 = o.find('input[type=text]').length? false : true,  prop2 = false;
			var num = o.find('input[type=text]').length, dataNum = 0;
			var num2 = o.find('input[type=radio]').length, dataNum2 = 0;
			o.find('input[type=text]').each(function(){
				if($(this).val().replace(/\s|　/gi, '')){
					dataNum++
				}
				if (dataNum == num) prop1 = true;
			});
			o.find('input[type=radio]').each(function  () {
				if ($(this).is(':checked')) {
					dataNum2++
				}
				if (dataNum2 == num2/2) prop2 = true;
			});

			if(!prop1 || !prop2){
				o.removeClass('answered');
				showMsg('#answerMsg');
				return false;
			}
		} else if(o.find('textarea').length){
			var num = o.find('textarea').length, dataNum = 0;
			o.find('textarea').each(function(){
				if($(this).val().replace(/\s|　/gi, '')!==''){
					dataNum++
				}
				if (dataNum == num) isAnswer = true;
			});
			if(!isAnswer){
				o.removeClass('answered');
				showMsg('#answerMsg');
				return false;
			}
		} else if(o.find('input[type="text"]').length){
			var num = o.find('input').length, dataNum = 0;
			o.find('input').each(function(){
				if($(this).val().replace(/\s|　/gi, '')){
					dataNum++
				}
				if (dataNum == num) isAnswer = true;
			});
			if(!isAnswer){
				o.removeClass('answered');
				showMsg('#answerMsg');
				return false;
			}
		} else if (o.find('input[type="radio"]').length) {
			var num = o.find('input').length, dataNum = 0;
			if(o.find('.q-label-wrp').length){
				o.find('.q-label-wrp').each(function(){
					if(!$(this).find('.q-label-wrp input[type=radio]').is(':checked')){
						isAnswer = false;
						return false;
					}else{
						isAnswer = true;
					}
				});
			}else{
				o.find('input').each(function  () {
					if ($(this).is(':checked')) {
						dataNum++
					}
					if (dataNum == num/2) isAnswer = true;
				});
			}
			if(!isAnswer){
				showMsg('#answerMsg');
				return false;
			}
		}

		t.hasClass('chk-data-button') && t.toggleClass('a-checked');

		o.toggleClass('answered');

		if(o.attr('data-qtype')==='radio' || o.attr('data-qtype')==='check'){
			o.find('input[data-answer]').toggleClass('answer-chk');
		}
		return false;
	});

	//되돌리기
	$('[data-toggle=answer-refresh]').click(function(){
		var t = $(this),
			target= $(t.attr('data-target')),
			chkAnswer = target.find('.a-checked');

		if(t.parent().hasClass('final-chk-buttons') && target.hasClass('answered')){
			t.parent().data('chance', 1);
		}

		chkAnswer.removeClass('a-checked');
		$('.answer-chk').removeClass('answer-chk');
        $('.test-swiper .swiper-button-next').css('visibility','hidden');

		target.removeClass('answered open answer-o answer-x').find('.answered').removeClass('answered open answer-o answer-x');
		target.find('.drop-refresh').length && !$(this).hasClass('drop-refresh') && $('.drop-refresh').click();
		target.find('.refresh-line').length && !$(this).hasClass('refresh-line') && $('.refresh-line').click();
		target.find('.layer-wrp.open').removeClass('open').find('.layer').hide();
		// 사용자 입력데이터 삭제
		var delItm;
		target.find('input,textarea').each(function(i){
			var t = $(this);
			t.prop('checked',false);
			t.filter('[type=text],textarea').val('');
			if(i===0){
				delItm = $(this).attr('id');
			} else {
				delItm  = delItm+', '+$(this).attr('id');
			}
		});
		if(parent.API_ANNOTATION_INPUT_DELETE){
			parent.API_ANNOTATION_INPUT_DELETE(delItm);
		}
		return false;
	});

	// 테스트페이지 전체 정답확인
	$('[data-toggle=answer-all]').click(function(){
		var qI,
			all = $($(this).attr('data-target')),
			allObjCheck = all.find('[data-toggle=answer-final],[data-toggle=answer],[data-toggle=answer-line]'),
			allObj = allObjCheck.filter(function(i,ele){
				return !$(ele).hasClass('a-checked');
			}),
			t = $(this);

		if(t.hasClass('a-checked')){
			t.removeClass('a-checked');
			allObjCheck.filter('.a-checked').click().removeClass('a-checked');
		}else{
			var isNotAnswer = false;

			allObj.each(function(){
				$(this).trigger('click');
				if(!$(this).hasClass('a-checked')){
					isNotAnswer = true;
					return false;
				}
			});

			if(isNotAnswer){
				allObj.filter('.a-checked').trigger('click');
			}else{
				t.addClass('a-checked');
			}
		}
	});

	// 마무리 문제
	// 데이터 전송 준비
	var assessmentItem = $('assessmentItem'),
		namePrev='';

	$('[data-toggle=answer-final]').click(function(){
		var t = $(this),
			o = $(t.attr('data-target'));

		// 값 없으면 리턴
		var isAnswer = false;
		if(t.attr('data-multi')){
			var prop1 = o.find('input[type=text]').length ? false : true,  prop2 = false;
			var num = o.find('input[type=text]').length, dataNum = 0;
			o.find('input[type=text]').each(function(){
				if($(this).val().replace(/\s|　/gi, '')){
					dataNum++
				}
				if (dataNum == num) prop1 = true;
			});

			o.find('.q-label-wrp').each(function(){
				if(!$(this).find('.q-label-wrp input[type=radio]').is(':checked')){
					prop2 = false;
					return false;
				}else{
					prop2 = true;
				}
			});
			if(!prop1 || !prop2){
				showMsg('#answerMsg');
				return false;
			}
			isAnswer = true;
		} else if(o.attr('data-qtype')==='radio' || o.attr('data-qtype')==='checkbox'){
			var ox = o.find('.answer-ox'), dataNum = 0;
			if(!o.find('input').is(':checked')){
				showMsg('#answerMsg');
				return false;
			}

			if(o.find('.q-label-wrp').length){
				o.find('.q-label-wrp').each(function(){
					if(!$(this).find('.q-label-wrp input[type=radio]').is(':checked')){
						isAnswer = false;
						return false;
					}else{
						isAnswer = true;
					}
				});
			}else if(ox) {
				ox.each(function  () {
					$(this).find('input').is(':checked') && dataNum++;
				});
				if (dataNum !== ox.length) {
					showMsg('#answerMsg');
					return false;
				}
				isAnswer = true;
			}else{
				isAnswer = true;
			}
		} else if(o.find('textarea').length || o.find('input[type="text"]').length){
			var target = o.find('textarea, input');
			var num = target.length, dataNum = 0;
			target.each(function(){
				if($(this).val().replace(/\s|　/gi, '')!==''){
					dataNum++
				}
				if (dataNum == num) isAnswer = true;
			});
		}

		if(!isAnswer){
		   t.removeClass('a-checked');
		   o.removeClass('answered answer-x answer-o');
	       showMsg('#answerMsg');
		   return false;
		}

		if(o.hasClass('answered')){
			t.removeClass('a-checked');
			o.removeClass('answered answer-o answer-x').find('.answer-chk').removeClass('answer-chk');
			// 사용자 입력데이터 삭제
			var delItm;
			o.find('input,textarea').each(function(i){
				var t = $(this);
				if(i===0){
					delItm = $(this).attr('id');
				} else {
					delItm  = delItm+', '+$(this).attr('id');
				}
			});
			if(parent.API_ANNOTATION_INPUT_DELETE){
				parent.API_ANNOTATION_INPUT_DELETE(delItm);
			}

			if(t.parent().hasClass('final-chk-buttons')){
				t.parent().data('chance', 1);
			}
			return;
		}

		var isCorrect = false,
			answer = o.find('correctResponse').text().replace(/[\n\t\r]/g,'');

		if(!answer){
			o.addClass('no-answered');
            answer = o.find('modalFeedback').text().replace(/[\n\t\r]/g,'');
        }

		// 답 확인 부분
		if(t.attr('data-ex')){
			var target = o.find('.form-control:not(.donot)').length ? o.find('.form-control:not(.donot)') : o.find('input.sr-only');
			target.each(function(){
				var tV = $.trim($(this).val()).replace(/[^(가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9)]/gi,'').split(""),
					dA = $(this).parent().attr('data-answer').split("");
					num = 0;

				for(var i = 0; i < tV.length ; i++) {
					for(var j = 0; j< dA.length; j++) {
						if(tV[i] == dA[j]) {
							num++;
						}
					}
				}

				if(dA.length===num && !o.hasClass('answer-x')){
					isCorrect = true;
				}
			});
		} else if(t.attr('data-multi')){
			var mc = 0;
			o.find('[data-answer]').each(function(){
				var mt = $(this);
				var ma = mt.find('input:checked').val() || $.trim(mt.find('input').val());
	 			var mv = mt.attr('data-answer');
				var mArray = mv.indexOf('@@') > -1 && mv.split('@@');

				(ma === mv || $.inArray(ma,mArray)>-1) && mc++;
 			});
			if(o.find('[data-answer]').length === mc){
				isCorrect = true;
			}
		} else if(o.attr('data-qtype')==='radio'){
			// radio
			o.find('input[data-answer]').addClass('answer-chk');
			var num = o.find('input[data-answer]').length;
			if(o.find('input[data-answer]:checked').length===num){
				isCorrect = true;
			}
		} else if(o.attr('data-qtype')==='checkbox'){
			// checkbox
			o.find('input[data-answer]').addClass('answer-chk');
			var c = o.find('input[data-answer]').length;

			if(c>0 && o.find('input[data-answer]:checked').length===c && o.find('input:checked').length===c){
				isCorrect = true;
			}
		} else if (o.attr('data-qtype')==='multipleBlank' || o.attr('data-qtype')==='text'){
			// multipletext
			isCorrect = true;

			if(o.find('assessmentItem').attr('data-response-type') !=='essay'){
				var target = o.find('.form-control:not(.donot)').length ? o.find('.form-control:not(.donot)') : o.find('input.sr-only');
				target.each(function(){
					var tV = $.trim($(this).val()),
						dA = $(this).parent().attr('data-answer') || o.attr('data-answer'),
						dArray = dA.indexOf('@@') > -1 && dA.split('@@');

					if(dArray[1] && $.inArray(tV,dArray) === -1){
						isCorrect = false;
						return false;
					}else if(!dArray && tV!==dA){
						isCorrect = false;
						return false;
					}
				});
			}
		} else if (o.find('assessmentItem').attr('data-response-type')==='etc'){
			isCorrect = true;
		}

		if(!isCorrect && t.parent().hasClass('final-chk-buttons') && t.parent().data('chance')){
			t.parent().data('chance', '');
			showMsg('#finalEvltOnemore');
			effectAudio.play('again');
			setTimeout(function(){
				t.next('.icon-btn-refresh').trigger('click');
			},1000);
			return false;
		}else if(t.parent().hasClass('final-chk-buttons') && isCorrect){
			showMsg('#finalEvltGood');
			effectAudio.play('correct');
        }else if(t.parent().hasClass('final-chk2-buttons') && isCorrect){
			showMsg('#finalEvltCheck');
		}else if(t.closest('.evlt-slider-wrap').length && isCorrect){
			showMsg('#stamp');
		}

		t.addClass('a-checked');
		o.addClass('answered');

		($('.test-swiper').length && o.closest('.swiper-slide').length) && $('.test-swiper .swiper-button-next').css('visibility', 'visible');


		isCorrect ? o.addClass('answer-o') : o.addClass('answer-x');

		// 데이터 전송
		//if(t.parents('#modalArrangeCont').length || t.parents('#modalSmallEvlt').length) return false;

		var $itemObject = t.closest('assessmentItem'),
			userVal=[],
			userDesc = $('h1:first').text(),
			userNum = $itemObject.find('.final-q>b,.tit2>b,h3>b,.tit>b:not(.ox-o):not(.ox-x)').text();

		if(!$itemObject.length){
			$itemObject = $(this).nextAll('assessmentItem');
		}
		if(userNum===''){
			userNum = $itemObject.parent('.text-q').children('b').text();
		}
		// 대단원 평가 문제
		if($('.modal').is(':visible')){
			userDesc = $('.modal:visible h2').text();
		}
		// 대단원 마무리
		if(userDesc==='대단원 마무리'){
			var num = 2;
			if($('h2.half-title').text()==='핵심 개념 정리하기'){
				num = 1;
			}
			userDesc = userDesc+' '+num+'-';
		}
		// 대단원 평가 문제
		if(userDesc==='대단원 평가 문제'){
			var tabType = t.closest('.tab-pane').attr('id');
			if(tabType==='tab1'){
				tabType = '기본';
			} else {
				tabType = '실력';
			}
			userDesc = userDesc+' - '+tabType+'-';
		}
		// 직접입력
		if(o.attr('data-desc')){
			userDesc = o.attr('data-desc');
		}


		o.find('input,textarea').each(function(i){
			var t = $(this);
			if(t.is('[type=text]') || t.is('textarea')){
				userVal.push(t.val());
			} else if(t.is(':checked')){
				userVal.push(t.val());
			}
		});

		DTCaliperSensor.fire({
			correct: isCorrect,
			itemObject: $itemObject[0],
			value: o.find('correctResponse').text().replace(/[\n\t\r]/g,''),
			userValue: userVal.join(','),
			description: userDesc+' '+userNum,
			pageNumber: $('#num b').text()
		});

		return false;
	});

// 체크박스 갯수제한
/*	$('[data-qtype=checkbox] input[type=checkbox]').click(function(){
		var t = $(this),
			o = t.closest('[data-qtype=checkbox]'),
			num = o.find('[data-answer]').length;
			if(o.find('input[type=checkbox]:checked').length>num){
				//alert(num+'개만 골라주세요');
				return false;
			}
	});
*/

	$('.chk-dsc-type').click(function  () {
		var t = $(this),
			pa = t.closest('.no-answered');
		if (pa.hasClass('answered')) {
			t.next().show().parent().addClass('open');
		}else {
			t.next().hide();
			pa.find('.open').removeClass('open');
		}
	});

	// 단어
	$('.btn-dic').each(function(){
		var t = $(this),
			tTx = t.text(),
			tL = t.offset().left,
			tC = '',
			lt = '',
			ll = '';
		if(t.attr('data-type')){
			tTx = t.attr('data-type');
		}
		tC = dicList[tTx].content;
		if(tC.length>20){
			ll = ' layer-limit';
		}
		t.wrap('<span class="layer-wrp explanation-wrp'+lt+'"></span>').append('<span class="layer explanation'+ll+'">'+tC+'</span>');
	}).off('click').click(function(){
		var t = $(this);
		$('.btn-dic').not(t).parent().removeClass('on').find('.layer').hide();
		t.children('.layer').toggle().end().parent().toggleClass('on');
		return false;
	});



	// input
	// ch-2-hd-itx
	$('[data-placeholder]').on('keyup change',function(){
		var t = $(this);
		var ph = t.attr('data-placeholder');

		if(!t.val() || t.val().replace(/\s|　/gi, '')===ph.replace(/\s|　/gi, '')){
			t.val(ph+' ').addClass('placeholder');
		}else{
			t.removeClass('placeholder');
		}
	});

	$('.learn input').after('<i></i>');
	// android maxlength
	$('input').on('keyup change',function(){
		var t = $(this),
			v = t.val(),
			m = t.attr('maxlength');
		if(v.length > m){
            t.val(v.substring(0,m));
        }
	});

	// img drag
	$('img').on('dragstart', function(event) { event.preventDefault(); });



	// dic
	function makeList(data){
		var pnHtml = '<a class="active" href="" data-group="1">1</a>';

		l.html(data);

		for (var i = 2; i < l.find('li').length/5+1; i++){
			var pnInit = '';
			if(i>5){
				pnInit = 'not';
			}
			pnHtml = pnHtml+'<a class="'+pnInit+'" href="" data-group="'+Math.ceil(i/5)+'">'+i+'</a>';
		}

		if(l.find('li').length>25){
			pnHtml = '<a class="icon-pn" href=""></a>'+pnHtml+'<a class="icon-pn-next" href=""></a>';
		}
		pn.html(pnHtml);

		pn.find('a').not('[class^=icon-]').click(function(){
			$(this).addClass('active').siblings().removeClass('active');
			l.find('li.d-flex').removeClass('d-flex');
			l.find('li[data-group='+$(this).text()+']').addClass('d-flex');
			return false;
		});

		pn.find('[class^=icon-]').click(function(){
			var o = pn.find('a').not('[class^=icon-]').filter(':visible:last').next();
			if($(this).hasClass('icon-pn')){
				o = pn.find('a').not('[class^=icon-]').filter(':visible:first').prev();
			}
			if(o.hasClass('icon-pn') || o.hasClass('icon-pn-next')){
				return false;
			}
			pn.find('a:not(.not)').not('[class^=icon-]').addClass('not');
			pn.find('a[data-group='+o.attr('data-group')+']').removeClass('not');
			o.click();
			return false;
		});
	}

    $(document).on("click",".lst-dic h4",function(){
       $(this).siblings('p').slideToggle(300);
    } );

	function cho_hangul(str){
		var cho = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
		var result = "";
		var code = str.charCodeAt(0)-44032;
		if(code>-1 && code<11172){
			result = cho[Math.floor(code/588)];
		}
		if(result==='ㄲ'){
			result='ㄱ';
		} else if(result==='ㄸ'){
			result='ㄷ';
		} else if(result==='ㅃ'){
			result='ㅂ';
		} else if(result==='ㅆ'){
			result='ㅅ';
		} else if(result==='ㅉ'){
			result='ㅈ';
		}
		return result;
	}
	if($('#modalDic').length){
		// start
		var l = $('#lstDic');
		var pn = $('#pnDic');
		var dicHtml = '',
			dicI = 1;


		$.each(dicList,function(index,item){
			var dicInit = '';
			if(dicI<6){
				dicInit = 'd-flex';
			}
			dicHtml = dicHtml+'<li class="'+dicInit+'" data-chapter="'+item.chapter+'" data-group="'+Math.ceil(dicI/5)+'"><h4>'+index+'</h4><p>'+item.content+'</p></li>';
			++dicI;
		});
		makeList(dicHtml);

		// sort
		$('.dic-sort>button').click(function(){
			var t = $(this);
			t.addClass('active').siblings().removeClass('active');
			$('ul.tab-dic').eq(t.index()).removeClass('hide').siblings().addClass('hide');
			$(t.attr('data-target')).find('>li:first-child>[role=button]').click();
			$("#dicSrch input").val('');
		});

		// tabDicChapter
		$('#tabDicChapter [role="button"]').click(function(){
			var dicHtml = '',
				dicI = 1,
				t = $(this),
				tI = Number(t.attr('data-href'));
			t.parent().addClass('active').siblings().removeClass('active');

			if(tI===0){
				$.each(dicList,function(index,item){
					var dicInit = '';
					if(dicI<6){
						dicInit = 'd-flex';
					}
					dicHtml = dicHtml+'<li class="'+dicInit+'" data-chapter="'+item.chapter+'" data-group="'+Math.ceil(dicI/5)+'"><h4>'+index+'</h4><p>'+item.content+'</p></li>';
					++dicI;
				});
			} else {
				$.each(dicList,function(index,item){
					var dicInit = '';
					if(item.chapter===tI){
						if(dicI<6){
							dicInit = 'd-flex';
						}
						dicHtml = dicHtml+'<li class="'+dicInit+'" data-chapter="'+item.chapter+'" data-group="'+Math.ceil(dicI/5)+'"><h4>'+index+'</h4><p>'+item.content+'</p></li>';
						++dicI;
					}
				});
			}
			makeList(dicHtml);
			$("#dicSrch input").val('');
			return false;
		});

		// tabDicAlphabet
		$('#tabDicAlphabet [role="button"]').click(function(){
			var dicHtml = '',
				dicI = 1,
				t = $(this),
				tI = t.attr('data-href');
			t.parent().addClass('active').siblings().removeClass('active');
			// make array
			var dicListArray = [];
			$.each(dicList,function(index,value){
				dicListArray.push({
					name:index,
					value:value
				});
			});
			dicListArray.sort(function (a, b) {
				return(a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
			});
			if(tI==='0'){
				$.each(dicListArray,function(index){
					var dicInit = '',
						item = dicListArray[index];
					if(dicI<6){
						dicInit = 'd-flex';
					}
					dicHtml = dicHtml+'<li class="'+dicInit+'" data-chapter="'+item.value.chapter+'" data-group="'+Math.ceil(dicI/5)+'"><h4>'+item.name+'</h4><p>'+item.value.content+'</p></li>';
					++dicI;
				});
			} else {
				$.each(dicListArray,function(index){
					var dicInit = '',
						item = dicListArray[index];
					if(cho_hangul(item.name)===tI){
						if(dicI<6){
							dicInit = 'd-flex';
						}
						dicHtml = dicHtml+'<li class="'+dicInit+'" data-chapter="'+item.value.chapter+'" data-group="'+Math.ceil(dicI/5)+'"><h4>'+item.name+'</h4><p>'+item.value.content+'</p></li>';
						++dicI;
					}
				});
			}
			makeList(dicHtml);
			$("#dicSrch input").val('');
			return false;
		});



		// search
		$('#dicSrch button').click(function(){
			$('.tab-dic>li:first-child').addClass('active').siblings().removeClass('active');
			$('.dic-sort>button:first-child').addClass('active').siblings().removeClass('active');
			var t = $(this),
				v = t.prev().val(),
				dicHtml = '',
				dicI = 1;
			$.each(dicList,function(index,item){
				var dicInit = '';
				if(index.match(new RegExp(v,'gi'))){
					if(dicI<6){
						dicInit = 'd-flex';
					}
					dicHtml = dicHtml+'<li class="'+dicInit+'" data-chapter="'+item.chapter+'" data-group="'+Math.ceil(dicI/5)+'"><h4>'+index+'</h4><p>'+item.content+'</p></li>';
					++dicI;
				} else {
					//dicHtml = '<li class="show mt30 text-center"><h4>검색결과가 없습니다</h4></li>';
				}
			});
			makeList(dicHtml);
		});
		$("#dicSrch input").keyup(function(e){
			if(e.keyCode===13){
				$('#dicSrch button').click();
			}
		});
	}
});

/*
 * jQuery UA plugin
 *
 * based on jquery.browser.addEnvClass.js
 * https://gist.github.com/373298
 */

(function ($) {

    $.ua = {
        platform: {},
        browser: {},
        engine: {}
    };

    var ua = navigator.userAgent,
        uaPlatform = $.ua.platform,
        uaBrowser = $.ua.browser,
        uaEngine = $.ua.engine;

    // detect platform
    if (/Windows/.test(ua)) {
        uaPlatform.name = 'win';
        uaPlatform.win = true;
    } else if (/Mac/.test(ua)) {
        uaPlatform.name = 'mac';
        uaPlatform.mac = true;
    } else if (/Linux/.test(ua)) {
        uaPlatform.name = 'linux';
        uaPlatform.linux = true;
    } else if (/iPhone|iPod/.test(ua)) {
        uaPlatform.name = 'iphone';
        uaPlatform.iphone = true;
    } else if (/iPad/.test(ua)) {
        uaPlatform.name = 'ipad';
        uaPlatform.ipad = true;
    } else if (/Android/.test(ua)) {
        uaPlatform.name = 'android';
        uaPlatform.android = true;
    } else {
        uaPlatform.name = 'unknown-platform';
        uaPlatform.unknown = true;
    }

    // detect browser
    if (/MSIE/.test(ua)) {
        uaBrowser.name = 'msie';
        uaBrowser.msie = true;
    } else if (/Firefox/.test(ua)) {
        uaBrowser.name = 'firefox';
        uaBrowser.firefox = true;
    } else if (/Safari/.test(ua)) {
        uaBrowser.name = 'safari';
        uaBrowser.safari = true;
    } else if (/Opera/.test(ua)) {
        uaBrowser.name = 'opera';
        uaBrowser.opera = true;
    } else {
        uaBrowser.name = 'unknown-browser';
        uaBrowser.unknown = true;
    }

    // chrome override
    if (/Chrome/.test(ua)) {
        uaBrowser.name = 'chrome';
        uaBrowser.chrome = true;
        uaBrowser.safari = false;
    }

    // detect browser version
    if (uaBrowser.msie) {
        uaBrowser.version = /MSIE (\d+(\.\d+)*)/.exec(ua)[1];
    } else if (uaBrowser.firefox) {
        uaBrowser.version = /Firefox\/(\d+(\.\d+)*)/.exec(ua)[1];
    } else if (uaBrowser.opera) {
        uaBrowser.version = /Version\/? ?(\d+(\.\d+)*)/.exec(ua)[1];
    } else if (uaBrowser.safari) {
        uaBrowser.version = /Version\/(\d+(\.\d+)*)/.exec(ua)[1];
    } else if (uaBrowser.chrome) {
        uaBrowser.version = /Chrome\/(\d+(\.\d+)*)/.exec(ua)[1];
    } else {
        uaBrowser.version = 0;
    }

    // detect engine
    if (/Trident/.test(ua) || uaBrowser.msie) {
        uaEngine.name = 'trident';
        uaEngine.trident = true;
    } else if (/Gecko/.test(ua)) {
        uaEngine.name = 'gecko';
        uaEngine.gecko = true;
    } else if (/Presto/.test(ua)) {
        uaEngine.name = 'presto';
        uaEngine.presto = true;
    } else {
        uaEngine.name = 'unknown-engine';
        uaEngine.unknown = true;
    }

    // override WebKit
    if (/WebKit/.test(ua)) {
        uaEngine.name = 'webkit';
        uaEngine.gecko = false;
        uaEngine.webkit = true;
    }


    // add classes to html element
    $('#wrap').addClass([
        uaPlatform.name,
        uaBrowser.name,
        uaBrowser.name + parseInt(uaBrowser.version, 10)
    ].join(' '));

});

var showMsg = function (target){
	$(target).stop(true, true).fadeIn(200).delay(1000).fadeOut(200);
}
