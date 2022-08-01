 $(function () {
    var canvasList = $("canvas").filter("[data-role='drawing']");

    if(typeof parent.DETECTMOBILEBROWSER == "undefined") {
        detect();
    }
    parent.DETECT_IS_RT = parent.DETECT_IS_RT ? parent.DETECT_IS_RT : false;

    $.fn.extend({
        DRAWING_INIT: function() {
            var canvas = this;
            var elm = canvas.get(0);
            var ctx = elm.getContext("2d");
            var id = canvas.attr("id");

            elm.isDisable = false;

            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.lineWidth = canvas.attr("data-lineWidth");
            ctx.strokeStyle = canvas.attr("data-strokeStyle");

            bindDrawFigureEvent.call(canvas);

        },
        DRAWING: function() {
            startDraw.call(this);
        },
        DRAWING_ERASER: function() {
            eraserDraw.call(this);
        },
        DRAWING_DELETE: function() {
            deleteDraw.call(this);
        },
        DRAWING_STOP: function() {
            stopDraw.call(this);
        },
        DRAWING_HIDE: function() {
            hideDraw.call(this);
        },
        DRAWING_LINEWIDTH: function(lineWidth) {
            var canvas = this;
            var elm = canvas.get(0);
            var ctx = elm.getContext("2d");
            ctx.lineWidth = lineWidth;
        },
        DRAWING_LINECOLOR: function(color) {
            var canvas = this;
            var elm = canvas.get(0);
            var ctx = elm.getContext("2d");
            ctx.strokeStyle = color;
        },
        DRAWING_INFO: function() {
            var canvas = this;
            var elm = canvas.get(0);
            var ctx = elm.getContext("2d");
            return {
               strokeStyle : ctx.strokeStyle,
               lineWidth : ctx.lineWidth,
               isDisable : elm.isDisable
            }
        }
    });

    var bindDrawFigureEvent = function() {
        var canvas = this;
        if (parent.DETECTMOBILEBROWSER === "pc") {
            eventDraw.call(canvas);
        } else {
            eventDraw_drawing_mobile.call(canvas);
        }
    }

    var bindEraserFigureEvent = function() {
        var canvas = this;
        if (parent.DETECTMOBILEBROWSER === "pc") {
            eventEraser.call(canvas);
        } else {
            eventEraser_drawing_mobile.call(canvas);
        }
    }

    var eventDraw = function() {
        var canvas = this;
        console.log(canvas);
        canvas.off("mousedown mouseover mouseout mousemove");
        canvas.on("click", setupDrawPc);
    };
    var eventDraw_drawing_mobile = function() {
        var canvas = this;
        canvas.off("touchstart touchmove touchend touchcancel");
        canvas.on("click", drawing_click);
    };
    var eventEraser = function() {
        var canvas = this;
        console.log(canvas);
        canvas.off("click");
        canvas.on("mousedown mouseover mouseout mousemove", setupDrawPc);
    };
    var eventEraser_drawing_mobile = function() {
        var canvas = this;
        canvas.off("click");
        canvas.on("touchstart", drawing_touchstart);
        canvas.on("touchmove", drawing_touchmove);
        canvas.on("touchend", drawing_touchend);
        canvas.on("touchcancel", drawing_touchcancel);
    };



    var setupDrawPc = function(e) {
        var elm = this;
        if(elm.isDisable) return;

        var coordinates = {
            x: Math.round(e.offsetX),
            y: Math.round(e.offsetY)
        };

        var type = e.type;

        if(e.buttons != 1) {
            draw.isDrawing = false;
        }
        if(draw[e.type]) {
            draw[e.type](elm, coordinates);
        }
    };
    var draw = {
        click: function(elm, coordinates){
            elm.isDrawing = true;
            elm.isOut = false;
            var ctx = elm.getContext("2d");
            var size = elm.dataset.size;

            var base_image = new Image();
            base_image.src = elm.dataset.figure;
            base_image.onload = function(){
                ctx.drawImage(base_image, (coordinates.x - size/2), (coordinates.y - size/2), size, size);
            }
        },
        mousedown: function(elm, coordinates) {
            elm.isDrawing = true;
            elm.isOut = false;
            var ctx = elm.getContext("2d");

            ctx.beginPath();

            ctx.moveTo(
                Math.round(coordinates.x),
                Math.round(coordinates.y)
            );

            var mouseup = function() {
                $("body").css({
                    "-webkit-user-select": "auto",
                    "-moz-user-select": "auto",
                    "-ms-user-select": "auto",
                    "user-select": "auto"
                });
                draw["mouseup"](elm);
            }
            $("body").css({
                "-webkit-user-select": "none",
                "-moz-user-select": "none",
                "-ms-user-select": "none",
                "user-select": "none"
            });
            $("body").on("mouseup", mouseup);
        },
        mousemove: function(elm, coordinates) {
            if (elm.isDrawing && !elm.isOut) {
                var ctx = elm.getContext("2d");

                ctx.lineTo(
                    Math.round(coordinates.x),
                    Math.round(coordinates.y)
                );

                ctx.stroke();
            }
        },
        mouseup: function(elm, coordinates) {
            elm.isDrawing = false;
            var canvas = $(elm);
            var ctx = elm.getContext("2d");
            ctx.closePath();
            ctx.save();
        },
        mouseout: function(elm, coordinates) {
            if (elm.isDrawing) {
                draw["mousemove"](elm, coordinates);
                elm.isOut = true;
            }
            var canvas = $(elm);
            var ctx = elm.getContext("2d");
            ctx.closePath();
            ctx.save();
        },
        mouseover: function(elm, coordinates) {
            if (elm.isDrawing) {
                draw["mousedown"](elm, coordinates);
            }
        },
    };

    function drawing_click(event) {
        var elm = this;
        var ctx = elm.getContext("2d");
        var rect = elm.getBoundingClientRect();

        ctx.imageSmoothingEnabled = false;

        var coordinates = {
            x: Math.round(event.offsetX),
            y: Math.round(event.offsetY)
        };

        var size = elm.dataset.size;

        var base_image = new Image();
        base_image.src = elm.dataset.figure;
        base_image.onload = function(){
            ctx.drawImage(base_image, (coordinates.x - size/2), (coordinates.y - size/2), size, size);
        }
    }

    function drawing_touchstart(event) {
        var elm = this;
        if(elm.isDisable) return;
        var ctx = elm.getContext("2d");
        var touch = event.touches[0];
        var rect = elm.getBoundingClientRect();

        ctx.imageSmoothingEnabled = false;

        ctx.beginPath();

        var zoom = parent.ZOOMVALUE ? parent.ZOOMVALUE : 1;

        ctx.moveTo(
            Math.round((touch.clientX - rect.left)/zoom),
            Math.round((touch.clientY - rect.top)/zoom)
        );
        event.preventDefault();
        return false;
    }
    function drawing_touchmove(event) {
        var elm = this;
        if(elm.isDisable) return;
        var ctx = elm.getContext("2d");
        var touch = event.touches[0];

        var rect = elm.getBoundingClientRect();
        var zoom = parent.ZOOMVALUE ? parent.ZOOMVALUE : 1;

        ctx.lineTo(
            Math.round((touch.clientX - rect.left)/zoom),
            Math.round((touch.clientY - rect.top)/zoom)
        );

        ctx.stroke();
        event.preventDefault();
        return false;
    }
    function drawing_touchend(event) {
        var elm = this;
        if(elm.isDisable) return;
        var ctx = elm.getContext("2d");
        ctx.closePath();
        ctx.save();
    }
    function drawing_touchcancel(event) {
        var elm = this;
        if(elm.isDisable) return;
        var ctx = elm.getContext("2d");
        ctx.closePath();
        ctx.save();
    }

    function startDraw() {
        bindDrawFigureEvent.call(this);
        var canvas = this;
        var elm = canvas.get(0);
        var ctx = elm.getContext("2d");

        elm.isDisable = false;

        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.globalCompositeOperation = "source-over";
        ctx.save();
        ctx.restore();

        canvas.css('visibility', 'visible');
    };
    function eraserDraw(data) {
        bindEraserFigureEvent.call(this);
        var canvas = this;
        var elm = canvas.get(0);
        var ctx = elm.getContext("2d");
        ctx.globalCompositeOperation  = "destination-out";
    }
    function deleteDraw() {
        var canvas = this;
        var elm = canvas.get(0);
        var ctx = elm.getContext("2d");

        ctx.clearRect(0, 0, elm.width, elm.height);
        ctx.beginPath();

    }
    function stopDraw() {
        var canvas = this;
        var elm = canvas.get(0);
        elm.isDisable = true;
    }
    function hideDraw() {
        var canvas = this;
        var elm = canvas.get(0);
        var ctx = elm.getContext("2d");

        canvas.css('visibility', 'hidden');
    }

    for(var i=0; i < canvasList.length; i++) {
        canvasList.eq(i).DRAWING_INIT();
    }
});
function detect() {
    var ua = navigator.userAgent;

    if (/lgtelecom/i.test(ua) || /Android/i.test(ua) || /blackberry/i.test(ua) || /iPhone/i.test(ua) || /iPad/i.test(ua) || /samsung/i.test(ua) || /symbian/i.test(ua) || /sony/i.test(ua) || /SCH-/i.test(ua) || /SPH-/i.test(ua) || /nokia/i.test(ua) || /bada/i.test(ua) || /semc/i.test(ua) || /IEMobile/i.test(ua) || /Mobile/i.test(ua) || /PPC/i.test(ua) || /Windows CE/i.test(ua) || /Windows Phone/i.test(ua) || /webOS/i.test(ua) || /Opera Mini/i.test(ua) || /Opera Mobi/i.test(ua) || /POLARIS/i.test(ua) || /SonyEricsson/i.test(ua) || /symbos/i.test(ua)) {
        parent.DETECTMOBILEBROWSER = "mobile";
        var isMobile = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function() {
                return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
            }
        };
        if (isMobile.iOS()) {
            parent.DETECTMOBILEBROWSER = "iOS";
        } else if (isMobile.Android()) {
            parent.DETECTMOBILEBROWSER = "Android";
        }
    } else {
        parent.DETECTMOBILEBROWSER = "pc";
    }
}

	function startPenDraw() {
		//영역 펜 쓰기 재시작
		$("#optionDrawing").DRAWING();
		buttonOn();
	}
	function stopPenDraw() {
		//영역 펜 쓰기 정지
		$("#optionDrawing").DRAWING_STOP();
		buttonOn();
	}
	function deletePenDraw(t) {
		//영역 펜 쓰기 영역 삭제
		$(t).DRAWING_DELETE();
	}
	//function eraserPenDraw() {
		//영역 펜 쓰기 부분 삭제
	//	$("#optionDrawing").DRAWING_ERASER();
	//	buttonOn();
	//}
	function eraserPenDraw(t,a) {
		var element = a;
		element.classList.toggle('on');
		if( element.classList.contains('on') ){
			$(t).DRAWING_ERASER();
		} else {
			$(t).DRAWING();
		}
	}
	function hidePenDraw() {
		//영역 펜 쓰기 숨기기
		$("#optionDrawing").DRAWING_HIDE();
		buttonOn();
	}
	function changeLineWidthPenDraw(t, w) {
		//var text = $("#optionDrawingLineWidth").val();
		if(!isNaN(w)) {
			//영역 펜 쓰기 굵기 변경
			$(t).DRAWING_LINEWIDTH(parseInt(w));
			buttonOn();
		}
	}

	function getPenDraw() {
		//영역 펜 쓰기 정보 확인
		var info = $("#optionDrawing").DRAWING_INFO();

		var str = "색상: " + '<span style="color:'+ info.strokeStyle + '">' + info.strokeStyle + '</span>';
		str += " 굵기: " + info.lineWidth;
		$("#optionDrawingInfo").html(str);
	}
	function buttonOn() {
		var $selector = $(event.currentTarget);
		$selector.parent().children('.on').removeClass('on');
		$selector.addClass('on');
	}
