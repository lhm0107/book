function qLine(o){
	"use strict";
	$('.q-line').each(function(){
		var t = $(this);
		var btn = '<button type="button" class="icon-btn-refresh refresh-line"><span class="sr-only">지우기</span></button>';

		if(t.hasClass('q-line-final')){
			$(this.dataset.target).find('.final-chk-buttons').append(btn)
		}else{
			t.before(btn)
		}

		t.prepend('<canvas id="canvas'+t.attr('id')+'" class="canvas"></canvas>').find('.q-line-btn').each(function(i){
			if(!$(this).attr('data-no')){
				$(this).attr('data-no',i+1);
			}
			$(this).attr('data-toggle','q-line').append('<button type="button" class="text-hide">선택</button>');
		});
	});
	// 리사이즈 보정
	function appZoom(){
		if(parent.ZOOMVALUE == undefined) {
			parent.ZOOMVALUE = 1;
		}
		return parent.ZOOMVALUE;
	}
	function offsetValue(value){
		return value/appZoom();
	}
	function qLineInner(o){
		o = $('#'+o);
		var btn = o.find('[data-toggle=q-line]');
		var canvas = document.getElementById(o.find('canvas').attr('id'));
		var ctx;
		var sx, sy;
		var ex, ey;
		var drawing;
		var backup;
		var backupClear;
		var startGroup,startLine;
		canvas.width=o.width();
		canvas.height=o.height();
		ctx = canvas.getContext("2d");
		var a = $(o.attr('data-target'));
		a.data('line','');
		var multi = o.attr('data-multiline');
		var userValIs = o.children('input.q-userline').val();
		var userVal = userValIs ? userValIs.split(',') : [];

		// 지우기
		a.find('.icon-btn-refresh').css('z-index','1').on('click touchstart',function(){
			if($(this).parent().hasClass('final-chk-buttons') && a.hasClass('answered')){
				$(this).parent().data('chance', 1);
			}
            
			$('.test-swiper .swiper-button-next').css('visibility','hidden');
			a.data('line','');
			a.removeClass('answered answer-o answer-x a-checked');
			o.removeClass('drawing');
			o.find('.q-line-btn').removeClass('line-start line-done');
			ctx.clearRect(0,0,canvas.width,canvas.height);
			ctx.lineWidth = '2'
			ctx.strokeStyle = '#0042ff';
			backup='';
			backupClear='';
			$(a.find('[data-toggle=answer-line]')).removeClass('a-checked');
			o.find('input.q-userline').val('');
			userVal = [];
			userAnswers = {};
		});

		// 정답체크
		$(a.find('[data-toggle=answer-line]')).click(function(){
			var $t = $(this);
			var aD = a.attr('data-answer');
			var aL = a.data('line');
			var aLArray = aL.split(',').sort().toString();

			if(a.attr('data-answer').split(',').length!==aL.split(',').length){
				showMsg('#answerMsg');
				return false;
			}

			if(!a.hasClass('answered')){
				// 체크
				backup = ctx.getImageData(0, 0, canvas.width, canvas.height);
				var prop = (aD===aLArray);

				if(!prop && $t.parent().hasClass('final-chk-buttons') && $t.parent().data('chance')){
					$t.parent().data('chance', '');
					showMsg('#finalEvltOnemore');
					effectAudio.play('again');
					setTimeout(function(){
						$t.next('.icon-btn-refresh').trigger('click');
					},1000);
					return false;
				}else if($t.parent().hasClass('final-chk-buttons') && prop){
					showMsg('#finalEvltGood');
					effectAudio.play('correct');
                    $('.swiper-button-next').css('visibility','visible');
				}

				$t.addClass('a-checked');
				a.addClass('answered');
                $('.swiper-button-next').css('visibility','visible');
				if(prop){
					a.addClass('answer-o');
				} else {
					a.addClass('answer-x');
				}


				var aArray = aD.split(',').sort();
				for(var i=0;i<aArray.length;i++){
					aD = aArray[i];
					var aO = o.find('[data-no='+aD.split('-')[0]+']').children('button');
					var aO2 = o.find('[data-no='+aD.split('-')[1]+']').children('button');
					var aX = offsetValue(aO.offset().left-o.offset().left)+3;
					var aY = offsetValue(aO.offset().top-o.offset().top)+3;
					var aX2 = offsetValue(aO2.offset().left-o.offset().left)+3;
					var aY2 = offsetValue(aO2.offset().top-o.offset().top)+3;
					ctx.beginPath();
					ctx.moveTo(aX,aY);
					ctx.lineTo(aX2,aY2);
					ctx.lineWidth = '4'
					ctx.strokeStyle = 'rgba(231,20,49,.5)'
					ctx.stroke();
					ctx.closePath();
				}
				var $itemObject = $t.closest('assessmentItem'),
					userDesc = $('.modal:visible h2').text(),
					userNum = $itemObject.parent('.text-q').children('b').text();

				if($t.parents('#modalArrangeCont').length || $t.parents('#modalSmallEvlt').length) return false;

				DTCaliperSensor.fire({
					correct: prop,
					itemObject: $itemObject[0],
					value: $itemObject.find('correctResponse').text().replace(/[\n\t\r]/g,''),
					userValue: aLArray,
					description: userDesc+' '+userNum,
					pageNumber: $('#num b').text()
				});
			} else {
				$t.removeClass('a-checked');
				// 해제
				a.removeClass('answered answer-o answer-x');
				ctx.putImageData(backup,0,0);
				$t.parent('.final-chk-buttons').data('chance', 1);
			}
		});

		function redrawAll(answer) {
			answer += '';
			ctx.clearRect(0,0,canvas.width,canvas.height);
			var i = 0;

		    for (var i = 0; i < userAnswers.length; i++) {
		        if (userAnswers[i].isVisible) {
		            drawLinePath(userAnswers[i]);
		        }
		    }
			for (var variable in userAnswers) {
				if(variable.split('-')[0] === answer || variable.split('-')[1] === answer){
					var vbtn = variable.split('-');
					vbtn.forEach(function(item, i){
						o.find('[data-no="'+item+'"]').removeClass('line-done');
					});
					delete userAnswers[variable];
					userVal.splice(i,1);
				}else{
					var arr = userAnswers[variable];
					drawLinePath(arr[0],arr[1],arr[2],arr[3]);
				}
				i++;
			}
			a.data('line', userVal.join(','));
			o.children('input.q-userline').val(userVal.join(','));
		}

		function drawLinePath(sx,sy,ex,ey) {
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.lineTo(ex, ey);
			ctx.lineWidth = '2'
			ctx.strokeStyle = '#0042ff';
			ctx.stroke();
			ctx.closePath();
		}

		o.on('click',function(e){
			var t;
			o.find('.line-start-m').removeClass('line-start-m');
			if(!o.hasClass('drawing')){
				// 시작
				if($(e.target).closest('.q-line-btn').length){
					t = $(e.target).closest('.q-line-btn');
				} else {
					return;
				}

				if(t.hasClass('line-done')){
					redrawAll(t.data('no'));
					return false;
				}


				if(!multi){
					t.addClass('line-start');
				} else {
					t.addClass('line-start-m');
				}
				startGroup = t.attr('data-group');
				startLine = t.attr('data-no');
				sx = offsetValue(t.children('button').offset().left-o.offset().left)+4;
				backup = ctx.getImageData(0, 0, canvas.width, canvas.height);
				sy = offsetValue(t.children('button').offset().top-o.offset().top)+4;
				backupClear = ctx.getImageData(0, 0, canvas.width, canvas.height);
				drawing = true;
				o.addClass('drawing');
			} else {
				// 끝
				ex = offsetValue(e.pageX-o.offset().left);
				ey = offsetValue(e.pageY-o.offset().top);
				if(e.touches){
					ex = offsetValue(e.touches[0].pageX-o.offset().left);
					ey = offsetValue(e.touches[0].pageY-o.offset().top);
				}
				t = $(e.target).closest('.q-line-btn');

				btn.each(function(){
					var btnT = $(this);
					var btnTL = btnT.offset().left-o.offset().left;
					var btnTT = btnT.offset().top-o.offset().top;
					if(ex>offsetValue(btnTL)-20 && ex<offsetValue(btnTL)+20 && ey>offsetValue(btnTT)-20 && ey<offsetValue(btnTT)+20){
						t = btnT;
						return false;
					}
				});


				if(!t.is('[data-toggle=q-line]') || (!multi && (t.hasClass('line-done') || !o.find('.line-start').length))){
					ctx.putImageData(backupClear, 0, 0);
					drawing = false;
					o.find('.line-start').removeClass('line-start');
					o.removeClass('drawing no-touch');
					return;
				}

				var newAD = startLine+'-'+t.attr('data-no');

				if(isNaN(startLine)){
					newAD = t.attr('data-no')+'-'+startLine;
				}

				if(a.data('line').indexOf(newAD)>-1 || (startGroup && startGroup===t.attr('data-group'))){
					o.find('.line-start').removeClass('line-start');
					ctx.putImageData(backupClear, 0, 0);
				}  else {
					if(a.data('line')===''){
						a.data('line',newAD);
					} else {
						a.data('line',a.data('line')+','+newAD);
					}
					if(!multi){
						o.find('.line-start').addClass('line-done').removeClass('line-start');
						t.addClass('line-done');
					}
					ex = offsetValue(t.children('button').offset().left-o.offset().left)+4;
					ey = offsetValue(t.children('button').offset().top-o.offset().top)+4;
					ctx.putImageData(backup, 0, 0);
					drawLinePath(sx, sy, ex, ey);
					backupClear = ctx.getImageData(0, 0, canvas.width, canvas.height);
					// 사용자 입력 값
					userVal.push(newAD);
					o.children('input.q-userline').val(userVal);
					userAnswers[newAD] = [sx, sy, ex, ey];
				}
				drawing = false;
				o.removeClass('drawing no-touch');
			}
		});
	}

	// 사용자 입력 값
	function userLine(o){
		o = $('#'+o);
		if(!o.find('input.q-userline').val()){
			return false;
		}

		var canvas = document.getElementById(o.find('canvas').attr('id'));
		var ctx;
		canvas.width=o.width();
		canvas.height=o.height();
		ctx = canvas.getContext("2d");
		var aD = o.children('input.q-userline').val();
		$(o.attr('data-target')).data('line',aD);
		var aArray = aD.split(',');
		for(var i=0;i<aArray.length;i++){
			aD = aArray[i];
			var aO = o.find('[data-no='+aD.split('-')[0]+']').children('button');
			var aO2 = o.find('[data-no='+aD.split('-')[1]+']').children('button');
			var aX = offsetValue(aO.offset().left-o.offset().left)+4;
			var aY = offsetValue(aO.offset().top-o.offset().top)+4;
			var aX2 = offsetValue(aO2.offset().left-o.offset().left)+4;
			var aY2 = offsetValue(aO2.offset().top-o.offset().top)+4;
			ctx.beginPath();
			ctx.moveTo(aX,aY);
			ctx.lineTo(aX2,aY2);
			ctx.lineWidth = '2'
			ctx.strokeStyle = '#0042ff';
			ctx.stroke();
			ctx.closePath();

			userAnswers[aD] = [aX, aY, aX2, aY2];

			if(!o.attr('data-multiline')){
				aO.closest('.q-line-btn').addClass('line-done');
				aO2.closest('.q-line-btn').addClass('line-done');
			}
		}
	}

	// 실행
	var userAnswers = {};
	setTimeout(function(){
		$('.q-line').each(function(){
			qLineInner($(this).attr('id'));
		});
	},500);

	setTimeout(function(){
		$('.q-line').each(function(){
			userLine($(this).attr('id'));
		});
	},2000);
	// multi
	var multiLine = $('[data-toggle=answer-line-multi]');
	if(multiLine.length){
		var multiBtn = multiLine.attr('data-target'),
			multiTarget = multiLine.attr('data-target'),
			multiA = $(multiTarget).find('[data-answer]');
		multiA.filter(':last').addClass('no-answered');
		multiLine.click(function(){
			if($('.q-line-btn').length!==$('.line-done').length){
				return false;
			}
			multiA.find('[data-toggle=answer-line]').click();
			if($(multiTarget).find('.answer-x').length){
				multiA.removeClass('answer-o');
			}
		});
		$(multiBtn).addClass('answer-line-multi-wrp');
		$(multiBtn).children('button.refresh-line').click(function(){
			$(multiBtn).find('[data-answer] button.refresh-line').click();
			$($('[data-toggle=answer-line-multi]').attr('data-target')).removeClass('answered');
		});
		$(multiBtn).find('[data-answer]:last-child [data-toggle=q-line]').click(function(){
			var t = $(this);
			$('#qLine [data-no='+t.attr('data-no')+']').mousedown();
		});
	}
}
