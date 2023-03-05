'use strict';

let vrVersion = '2301031430';

let PagePhase = {
    NORMAL: 1 << 0,
    DOOR_OPEN: 1 << 1,
    DOOR_CLOSE: 1 << 2,
    INNER: 1 << 3,
    FULL_VIEW: 1 << 4,
    SLIDE_VIEW: 1 << 5,
    ZOOM_IN: 1 << 6,
    ZOOM_OUT: 1 << 7,
};

let OpenStatus = {
    OPEN: 0,
    CLOSE: 1,
    INNER: 2,
}

let CarImageQuality = {
    LOW: 0,
    HIGH: 1,
}

var MarkerDisplay = {
    NONE: 0,
    DISPLAY: 1,
}

jQuery.fn.horizontal_center = function () {
    this.css("position","absolute");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
    return this;
}


class vrCarView {

    initVariables()
    {
        this.container = null;
        this.options = null;
        this.initParams = null;

        this.openCloseStatus = OpenStatus.CLOSE;
        this.imageQuality = CarImageQuality.LOW;
        this.markerDisplay = MarkerDisplay.NONE;
        this.panzoomconfig = null;
        this.viewWidth = 0;
        this.viewHeight = 0;

        this.fullScreen = false;

        this.appPath = "";

        this.imageIndex = 0;
        this.imageRatio = 1;

        this.markVer = 3;
        this.loadJssCount = 0;
        this.xpointSmall = -1;
        this.startDist = 0;
        this.imageSet = {
            close : {
                lowQ : new Array(18),
                highQ : new Array(18),
            },
            open : {
                lowQ : new Array(18),
                highQ : new Array(18),

            }
        };

        this.imageIndexForRotation = 0;
        this.carRotationing = false;
        this.imageIndexLastDrawing = -1;
        this.preloadImageCount = 0;

        this.zScale = 1;
        this.zX = 0;
        this.zY = 0;

        this.zoomWithInnerView = false;

        this.fullScreen = false;

        this.imageNaturalWidth = 1600;
        this.imageNaturalHeight = 1076;


    }
    constructor(params) {

        this.initVariables();
        this.options = params.options;
        this.container = params.container;
        this.appPath = params.appPath;

        if(this.options == null ){
            this.options = {};
        }
        this.options.butClossFlag = this.options.butClossFlag == null ? false : this.options.butClossFlag;
        this.options.btnFullScreenFlag = this.options.btnFullScreenFlag == null ? false : this.options.btnFullScreenFlag;
        this.options.btnInOutSwitchFlag = this.options.btnInOutSwitchFlag == null ? false : this.options.btnInOutSwitchFlag;
        this.options.btnImgSlideFlag = this.options.btnImgSlideFlag == null ? false : this.options.btnImgSlideFlag;
        this.options.butZoomFlag = this.options.butZoomFlag == null ? false : this.options.butZoomFlag;

        const _this = this;

        let container = $(params.container);
        let parentContainerWidth = container.parent().width();
        container.css("width" ,parentContainerWidth+'px');

        this.imageRatio = 2 / 3;

        const imageHeight = container.width() * this.imageRatio;
        container.css(
            {
                height : imageHeight,
                "display": "block",
                "position" : "relative",
            });

        if(this.options.loadingImageFlag) {
            $('#show_loading').css(this.options.loadingImageStyle);
        }

        $.get(
            _this.appPath + "/data/viewLayout.html", {},
            function(data) {
                $(params.container).append(data);
                //css load //자체 css 를 사용 하기 때문에 css 파일은 별도로 작업 해야 할듯.
                _this.loadCSS("css/mobile.css?v="+vrVersion);


                let jsList = [
                    "js/panzoom.js?v="+vrVersion,
                    "js/panzoomConfig.js?v="+vrVersion
                ];
                //"js/marker.js?v="+vrVersion,

                _this.loadJS(jsList,
                    () => {
                        let vh = window.innerHeight * 0.01;
                        document.documentElement.style.setProperty('--vh', `${vh}px`);
                        //init classes Marker 쪽 소스를 빼달라는 요청이 있어서 js 뺏을때도 에러 없이 처리.
                        if(typeof Marker !== 'undefined') {
                            Marker.initVariable;
                            Marker.vrCarView = _this;
                        }
                        _this.OnConstructor();
                    });
            });
    }



    hideAddressBar(win)
    {
        let doc = win.document;
        if( !location.hash && win.addEventListener ){

            win.scrollTo( 0, 1 );
            let scrollTop = 1,
                getScrollTop = function(){
                    return win.pageYOffset || doc.compatMode === "CSS1Compat" && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
                },

                bodyCheck = setInterval(function(){
                    if( doc.body ){
                        clearInterval( bodyCheck );
                        scrollTop = getScrollTop();
                        win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
                    }
                }, 15 );
            win.addEventListener( "load", function(){
                setTimeout(function(){
                    if( getScrollTop() < 20 ){
                        win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
                    }
                }, 0);
            }, false );
        }
    }

    loadJS(jsList, completeFunc = null) {

        const _this = this;
        _this.loadJssCount = jsList.length;
        for (let i = 0; i < jsList.length; i++) {
            const jsPath = _this.appPath + "/" + jsList[i];
            let script = document.createElement("script");
            script.type = "text/javascript";
            script.src = jsPath;
            document.querySelector("vrCarView").appendChild(script);
            script.onload = function() {
                if (--_this.loadJssCount == 0 && completeFunc != null)
                    completeFunc();
            };
        }

    }

    loadCSS(path) {
        const _this = this;
        const cssPath = _this.appPath + "/" + path;
        $("vrCarView").append("<link rel='stylesheet' href='" + cssPath + "'>");
    }

    OnConstructor() {

        this.hideAddressBar(window);
        this.panzoomconfig = new PanzoomConfig(this);
        this.Init();
    }

    Init() {
        //preload images
        const _this = this;
        //기본 이미지 설정
        //$("p#pZoomGuide img").attr("src", _this.appPath + "/images/iconPinch.png");

        let container = $(_this.container);
        let jqDivVrCarView = document.querySelector("vrCarView div#vrCarViewStructure").cloneNode(true);
        jqDivVrCarView.id = "vrCarViewSmall";
        container.append(jqDivVrCarView);
        container.css({
            height: (container.width * 2 / 3)
        });
        jqDivVrCarView = $(jqDivVrCarView);
        this.viewWidth = window.innerWidth;
        this.viewHeight = window.innerHeight;
        const imageHeight = container.width() * this.imageRatio;
        $("div#vrCarViewSmall div#divBody").css({
            height: imageHeight
        });

        jqDivVrCarView.css("display", "inline");
        const toolbarSmall = $("div#vrCarViewSmall div#bottomToolbarStructure");
        toolbarSmall.css("display", "none");
        //버튼을 옵셔널 하게 추가 할수 있도록 수정.
        if(this.options.butClossFlag) $("div#vrCarViewSmall").prepend("<div id='butClose' style='z-index: 31; display: none;'></div>");
        if(this.options.btnFullScreenFlag) $("div#vrCarViewSmall").prepend("<div id='btnFullScreen'></div>");
        if(this.options.btnInOutSwitchFlag) $("div#vrCarViewSmall").prepend("<div id='btnInOutSwitch' class='out'></div>");
        if(this.options.btnImgSlideFlag) $("div#vrCarViewSmall").prepend("<div id='btnImgSlide'></div>");
        if(this.options.butZoomFlag) $("div#vrCarViewSmall").prepend("<div id='butRight' class='butZoom'></div><div id='butLeft' class='butZoom'></div>");

        if(window.matchMedia('(orientation: portrait)').matches){
            //console.log('portrait');
        } else {
            //가로모드로 시작
            //console.log('land');
            this.OpenFullScreenMode();
            let canvas = $("#vrCarViewSmall canvas#canvasCar");
            canvas.css({
                "margin-left": ""
                ,"margin-top" : (imageHeight - container.height()) / 2 * -1 + "px"
            });
        }

        if(_this.options.markDetail.display == MarkerDisplay.DISPLAY){
            this.markerDisplay = MarkerDisplay.DISPLAY;
        }
        if(typeof Marker !== 'undefined') {
            Marker.baseUrl = this.options.markDetail.base;
            Marker.BuildMarkerOuter(_this.options);
        }

        const canvas = document.querySelector("div#vrCarViewSmall canvas");
        _this.imageIndex = _this.options.imgCount;
        _this.imageSet.close.lowQ[_this.options.imgCount] = new Image();
        _this.imageSet.close.lowQ[_this.options.imgCount].onload = function(){
            $("div#vrCarViewSmall div#carImage").css(
                {
                    "width" : container.width+'px',
                    "height" : container.width * _this.imageRatio + "px",
                }
            );
            _this.imageSet.close.lowQ[_this.options.imgCount].loaded = true;
            _this.DrawCar(canvas, _this.imageSet.close.lowQ[_this.options.imgCount]);
            _this.PreloadImageslowQ(() => {
                //pre로드 후에 loading 제거
                let show_loading = document.querySelector('#show_loading');
                show_loading.remove();
                console.log("Image Loading Complete.");

                _this.DrawCarIndex(canvas);
                _this.DrawCarRotation(canvas, _this.options.imgCount, 1, 50, -1, ()=>{

                    _this.SetImageEventHandler();
                    if(typeof Marker !== 'undefined') {
                        Marker.RedrawMarker(null, _this.openCloseStatus, _this.imageIndex, _this.markerDisplay, window.matchMedia('(orientation: portrait)').matches && _this.fullScreen);
                    }
                });

            });
        };
        _this.imageSet.close.lowQ[_this.options.imgCount].src =  _this.options.srcOutClose[_this.options.imgCount];

        window.addEventListener("resize",()=>{
            _this.OnWindowResize();
        }, true);
        window.addEventListener("orientationchange",()=>{
            _this.OnOrientationchange();
        }, true);
        _this.panzoomconfig.InitPanzoomSmall();
        //버튼 별도 추가. 현대에서 추가한 부분으로 수정 하지 않음
        const btnPrev = document.createElement('button');
        btnPrev.innerText = '이전';
        btnPrev.classList.add('btn_nav', 'btn_nav_prev');
        btnPrev.addEventListener('click',()=>{
            _this.imageIndex--;
            this.DrawCarIndex(canvas, _this.imageIndex);
        })
        const btnNext = document.createElement('button');
        btnNext.innerText = '다음';
        btnNext.classList.add('btn_nav', 'btn_nav_next')
        btnNext.addEventListener('click',()=>{
            _this.imageIndex++;
            this.DrawCarIndex(canvas, _this.imageIndex);
        })
        this.container[0].insertAdjacentElement('beforeend', btnPrev);
        this.container[0].insertAdjacentElement('beforeend', btnNext);

    }


    GetTouchDistance(touchList)
    {
        let x1 = touchList[0].clientX;
        let y1 = touchList[0].clientY;
        let x2 = touchList[1].clientX;
        let y2 = touchList[1].clientY;

        let dx = x1 - x2;
        let dy = y1 - y2;

        return Math.sqrt(dx * dx + dy * dy);
    }

    SetImageEventHandler()
    {
        const _this = this;
        const canvas = document.querySelector("div#vrCarViewSmall canvas");

        const view = $("div#vrCarViewSmall div#divBodySub");

        view.on("touchstart", ()=>{
            let e = window.event;
            if(e.touches.length == 1){
                let point = e.touches[0];

                const t = window.matchMedia('(orientation: portrait)').matches && this.fullScreen;
                _this.xpointSmall = t?point.clientY : point.clientX;
                _this.OnTouchDragStart(_this);
            } else if(e.touches.length > 1)
            {
                _this.startDist = _this.GetTouchDistance(e.touches);
            }

        });
        view.on("touchmove", ()=>{
            let e = window.event;
            //if(!$("div.butZoom#butLeft").is(":visible")) {
            if(_this.zScale <= 1.05) {
                if (e.touches.length == 1) {
                    if (this.xpointSmall == -1) return;

                    let point = e.touches[0];
                    const t = window.matchMedia('(orientation: portrait)').matches && this.fullScreen;

                    let dx = t ? point.clientY - _this.xpointSmall: point.clientX - _this.xpointSmall;
                    _this.OnTouchDrag(dx, 0, _this, canvas, t);

                    e.preventDefault();
                } else if (e.touches.length > 1 && _this.startDist > 0) {
                    let endDist = _this.GetTouchDistance(e.touches);

                    e.preventDefault();
                }
            }
        });

        const touchEnd = function() {
            let e = window.event;
            _this.xpointSmall = -1;
            _this.OnTouchDragEnd(_this);
        };

        view.on("touchup",touchEnd);
        view.on("touchend",touchEnd);

        const butLeft = $("div.butZoom#butLeft");
        butLeft.click(()=>{
            _this.imageIndex--;
            this.DrawCarIndex(canvas, _this.imageIndex);
        });

        const butRight = $("div.butZoom#butRight");
        butRight.click(()=>{
            _this.imageIndex++;
            this.DrawCarIndex(canvas, _this.imageIndex);
        });

        const butClose = $("div#butClose");
        butClose.click(()=>{
            this.CloseFullScreenMode();
        });

        const btnFullScreen = $("div#btnFullScreen");
        btnFullScreen.click(()=>{
            this.OpenFullScreenMode();
            this.SetFullCanvasCar(true);
        });

        const btnInOutSwitch = $("div#btnInOutSwitch");
        btnInOutSwitch.click((e)=>{
            this.ChangeViewMode(e);
        });

        const btnImgSlide = $("div#btnImgSlide");
        btnImgSlide.click((e)=>{
            this.OpenImageSlide(e);
        });

    }

    ChangeViewMode(e){
        if(e.currentTarget.className === 'out') {
            e.currentTarget.className = 'in';
        }else {
            e.currentTarget.className = 'out';
        }
        alert("내부 외부 전환 이벤트 - line 475");
    }

    OpenImageSlide(e){
        alert("이미지 슬라이드 이벤트 - line 482");
    }

    OpenFullScreenMode() {
        let _this = this;
        _this.fullScreen = true;
        const canvas = $("div#carImage canvas");
        const container = _this.container;
        //외부에서 사용 (삭제하면 안됨)
        container.closest(".fullTarget").addClass("full");
        container.removeClass("full").addClass("full");
        if(this.options.butZoomFlag) $("div.butZoom#butLeft").removeClass("full").addClass("full");
        if(this.options.butZoomFlag) $("div.butZoom#butRight").removeClass("full").addClass("full");
        canvas.removeClass("full").addClass("full");
        if(this.options.butClossFlag) $("div#butClose").show();
        if(this.options.btnFullScreenFlag) $("div#btnFullScreen").hide();
        if(this.options.btnImgSlideFlag) $("div#btnImgSlide").hide();
        if(document.body.webkitRequestFullscreen) document.body.webkitRequestFullscreen();
    }

    CloseFullScreenMode() {

        let _this = this;
        _this.fullScreen = false;
        let canvas = $("#vrCarViewSmall canvas#canvasCar");
        let container = _this.container;

        if(this.options.butZoomFlag) $("#vrCarViewSmall div.butZoom#butLeft").removeClass("full");
        if(this.options.butZoomFlag) $("#vrCarViewSmall div.butZoom#butRight").removeClass("full");
        //외부에서 사용 (삭제하면 안됨)
        container.closest(".fullTarget").removeClass("full");
        canvas.removeClass("full");
        container.removeClass("full");
        if(this.options.butClossFlag) $("div#butClose").hide();
        if(this.options.btnFullScreenFlag) $("div#btnFullScreen").show();
        if(this.options.btnImgSlideFlag) $("div#btnImgSlide").show();

        _this.OnWindowResize();
        // const bodySub = $("#vrCarViewSmall div#divBodySub");
        // let transform = _this.panzoomconfig.pzcarMain.getTransform();
        // console.log(transform);
        //
        // bodySub.css({
        //     'transform' : 'matrix('+transform.scale+', 0, 0, '+transform.scale+', '+transform.y+', '+transform.x+')'
        // });
        canvas.css({
            "margin-left": ""
            ,"margin-top" : ""
        });

        if(document.fullscreenElement) document.exitFullscreen();
    }

    SetFullCanvasCar(t) {
        //console.log("portrait:"+t);
        //console.log("this.fullScreen:"+this.fullScreen);

        let _this = this;
        const container = _this.container;
        //let parentContainerWidth = container.parent().width();
        //container.css("width" ,parentContainerWidth+'px');
        let canvas = $("#vrCarViewSmall canvas#canvasCar");
        let marginL = "";
        let marginT = "";
        let imageHeight = 0;
        if(container.width() > container.height()) {
            imageHeight = ((container.width() * _this.imageRatio) - container.height()) / 2 * -1;
        } else {
            imageHeight = ((container.height() * _this.imageRatio) - container.width()) / 2 * -1;
        }

        if (t) {
            //세로
            marginL = imageHeight + "px";
        } else {
            //가로
            marginT = imageHeight + "px";
        }

        canvas.css({
            "margin-left": marginL
            ,"margin-top" : marginT
        });
        // console.log("canvasCss", {
        //     "margin-left": marginL
        //     ,"margin-top" : marginT
        // });
    }

    OnTouchDragStart(vrCarView = this)
    {
        vrCarView.imageIndexForRotation = vrCarView.imageIndex ;
    }

    OnTouchDragEnd(vrCarView = this)
    {
        vrCarView.imageIndex = vrCarView.imageIndexForRotation;
    }

    OnTouchDrag(dx, dy, vrCarView, canvas = null, portaitFull = false) {

        if(vrCarView.carRotationing) return;
        const totalAngles = vrCarView.options.imgCount+1;
        let step = (portaitFull ? vrCarView.viewHeight : vrCarView.viewWidth) / (totalAngles * 1);
        let dirNegative = dx < 0;
        if (dx < 0) dx *= -1;
        let idxOffset = Math.floor(dx / step);
        if (dirNegative) idxOffset *= -1;

        let newImageIdx = vrCarView.imageIndex + idxOffset;

        if(newImageIdx < 0) newImageIdx+= vrCarView.options.imgCount+1;
        if(newImageIdx >= vrCarView.options.imgCount+1) newImageIdx -=vrCarView.options.imgCount+1;
        // vrCarView.newImageIndex = newImageIdx;
        if(canvas == null) canvas = document.querySelector("div#vrCarImage canvas");
        vrCarView.DrawCarIndex(canvas, newImageIdx);
        vrCarView.imageIndexForRotation = newImageIdx;

    }

    /*
        direction :  0 - cw, 1 - ccw, "-1"" - auto
    */
    DrawCarRotation(canvas, targetIndex, direction = -1, delay = 50, totalStep = -1, completeFunc = null)
    {
        const _this = this;
        let imageIndex = _this.imageIndex;

        _this.carRotationing = true;

        if(direction == -1)
        {
            let dist = Math.abs(imageIndex - targetIndex);
            if(dist > 9)
                direction = 0;
            else
                direction = 1;
        }

        if(direction == 1)
            imageIndex++;
        else
            imageIndex--;

        if(totalStep != -1) totalStep--;

        if(imageIndex < 0) imageIndex+= _this.options.imgCount+1;
        if(imageIndex >= _this.options.imgCount+1) imageIndex -=_this.options.imgCount+1;

        _this.imageIndex = imageIndex;

        _this.DrawCarIndex(canvas, imageIndex);

        if((targetIndex != imageIndex) && totalStep != 0)
        {
            setTimeout(function(){
                _this.DrawCarRotation(canvas, targetIndex, direction, delay, totalStep, completeFunc);
            }, delay);
        } else if ((totalStep == -1 && targetIndex == imageIndex) || totalStep == 0){

            _this.carRotationing = false;

            if(completeFunc != null)
            {
                if(_this.imageQuality == CarImageQuality.HIGH)
                {
                    _this.DrawCarIndex();
                }
                completeFunc();
            }
        }

    }



    DrawCarIndex(canvas = null, index = -999,fullYn='N')
    {
        const _this = this;
        if(canvas == null)
            canvas = document.querySelector("div#carImage canvas");

        if(index == -999) index = _this.imageIndexLastDrawing;

        while(index < 0) index+=_this.options.imgCount+1;
        while(index > _this.options.imgCount) index-=_this.options.imgCount+1;
        // console.log(index);
        let imageSet = _this.imageSet.close;

        if(_this.openCloseStatus == OpenStatus.OPEN)
            imageSet = _this.imageSet.open;

        let image = imageSet.lowQ[index];

        if(_this.carRotationing == false && _this.imageQuality == CarImageQuality.HIGH)
            image = imageSet.highQ[index];

        // console.log(index);
        if(image == undefined)
        {

            let imageHighQ;

            if(_this.openCloseStatus == OpenStatus.CLOSE)
            {
                imageHighQ = _this.options.srcZoomClose[index];
            } else if(_this.openCloseStatus == OpenStatus.OPEN)
            {
                imageHighQ = _this.options.srcZoomOpen[index];
            }

            let newImage = new Image();
            newImage.loaded = false;
            imageSet.highQ[index] = newImage;
            newImage.onload = function()
            {
                newImage.loaded = true;
                _this.imageIndexLastDrawing = index;
                _this.DrawCar(canvas,newImage, fullYn);
            }
            newImage.src = imageHighQ;
            //image = imageSet.lowQ[index];
        } else {
            _this.imageIndexLastDrawing = index;
            if (image.loaded == true) _this.DrawCar(canvas, image, fullYn);
        }

        if(typeof Marker !== 'undefined'){
            Marker.RedrawMarker(null, _this.openCloseStatus, index, _this.markerDisplay, window.matchMedia('(orientation: portrait)').matches && _this.fullScreen);
        }
    }

    DrawCar(canvas, image, fullYn = 'N') {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);

    }


    PreloadImageslowQ(completeFunc = null) {
        const _this = this;
        _this.preloadImageCount = _this.options.imgCount+1;

        //closeSmall
        let imageList = _this.options.srcOutClose;

        let cFunc = function(image, imageArray)
        {
            image.loaded = true;
            imageArray[image.ariaIndex] = image;
            if (--_this.preloadImageCount == 0 && completeFunc != null)
                completeFunc();
        }

        for (let i = 0; i < imageList.length; i++) {
            if (_this.imageSet.close.lowQ[i] != undefined) {
                if (--_this.preloadImageCount == 0 && completeFunc != null)
                    completeFunc();
                continue;
            }

            let imgSrc = imageList[i];
            let img = new Image();
            img.ariaIndex = i;
            img.onload = function() {
                cFunc(this, _this.imageSet.close.lowQ);
            }
            img.src = imgSrc;
        }

        //openSmall
        // imageList = _this.options.srcOutOpen;
        // for (let i = 0; i < imageList.length; i++) {
        //     if (_this.imageSet.open.lowQ[i] != undefined) {
        //         if (--_this.preloadImageCount == 0 && completeFunc != null)
        //             completeFunc();
        //         continue;
        //     }
        //
        //     let imgSrc = imageList[i];
        //     let img = new Image();
        //     img.ariaIndex = i;
        //     img.onload = function() {
        //         cFunc(this, _this.imageSet.open.lowQ);
        //     }
        //     img.src = imgSrc;
        // }
    }





    ZoomHandler(e, canvas) {
        const _this = this;

        if(_this.zoomWithInnerView) return;
        _this.zScale = e.getTransform().scale;

        _this.zX = e.getTransform().x;
        _this.zY = e.getTransform().y;

        let dpi2 = $("#divVrCarViewPopupInner2");
        let dpi2Display = dpi2.css("display");

        //zommin
        if (_this.zScale > 1.05 && dpi2Display != "none") {
            _this.car_rotationing = true;
            if(_this.fullScreen) _this.container.addClass('isZoom');
            $("div.butZoom").fadeIn();

            dpi2.fadeOut(200, function() {
                dpi2.css({
                    display: "none"
                });
            });

            if(_this.zScale != _this.zScaleOld)
            {
                _this.imageQuality = CarImageQuality.LOW;
                _this.DrawCarIndex(canvas);
            }

        }

        if ((_this.zScale <= 1.05 && (_this.zX != 0 || _this.zY != 0)) || (_this.zScaleOld > 1.2 && _this.zScale <= 1.2 && dpi2Display != "inline")) {
            _this.zScale = 1;
            _this.car_rotationing = false;
            if(_this.fullScreen) _this.container.removeClass('isZoom');

            this.panzoomconfig.pzcarMain.setTransform(0, 0, 1);
            $(canvas).parent().css({
                "transform": "matrix(1, 0, 0, 1, 0, 0)",
            });

            if (dpi2Display != "inline") {
                $("#bottomToolbar").fadeIn(200);
                dpi2.fadeIn(200, function() {
                    dpi2.css({
                        display: "inline"
                    });
                    _this.pagePhaseCurrent = PagePhase.FULL_VIEW;
                });

                $("div.butZoom").fadeOut();

            }

            if(_this.zScale != _this.zScaleOld)
            {
                _this.imageQuality = CarImageQuality.LOW;
                _this.DrawCarIndex(canvas);
            }

        }

        let imageIndex = _this.imageIndexForRotation;
        while(imageIndex < 0) imageIndex+=_this.options.imgCount+1;
        while(imageIndex > _this.options.imgCount) imageIndex-=_this.options.imgCount+1;

        _this.zScaleOld = _this.zScale;
        _this.zXOld = _this.zX;
        _this.zYOld = _this.zY;
    }

    OnWindowResize()
    {
        return false;
        let _this = this;
        let container = $(_this.container);
        let parentContainerWidth = container.parent().width();
        container.css("width" ,parentContainerWidth+'px');

        const imageHeight = container.width() * _this.imageRatio;
        container.css(
            {
                height : imageHeight,
                "display": "block",
                "position" : "relative",
            });
        $("div#vrCarViewSmall div#divBody").css({
            height: imageHeight
        });
        if(typeof Marker !== 'undefined'){
            Marker.RedrawMarker(null, _this.openCloseStatus, _this.imageIndex, _this.markerDisplay, window.matchMedia('(orientation: portrait)').matches && _this.fullScreen);
        }
    }

    OnOrientationchange(){
        let _this= this;
        const container = _this.container;
        const t = window.matchMedia('(orientation: portrait)').matches;

        if(!t){
            //Portrait 모드일 때 실행할 스크립트
            if(_this.fullScreen){
            }else {

            }
        }else{
            // Landscape 모드일 때 실행할 스크립트
            if(!_this.fullScreen){
                this.OpenFullScreenMode();
            } else {
            }
        }
        this.SetFullCanvasCar(!t);
    }

    OnMarkClickHandler(e = null) {
        alert("마커 클릭 이벤트");
    }

}