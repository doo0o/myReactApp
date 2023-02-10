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

        this.imageNaturalWidth = 1100;
        this.imageNaturalHeight = 733;


    }
    constructor(params) {

        this.initVariables();
        this.options = params.options;
        this.container = params.container;
        this.appPath = params.appPath;

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
                //css load
                _this.loadCSS("css/pc.css?v="+vrVersion);


                let jsList = [
                    "js/panzoom.js?v="+vrVersion,
                    "js/panzoomConfig.js?v="+vrVersion,
                ];

                _this.loadJS(jsList,
                    () => {
                        let vh = window.innerHeight * 0.01;
                        document.documentElement.style.setProperty('--vh', `${vh}px`);
                        //init classes
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

        // $("div#vrCarViewSmall").prepend("<div id='butClose' style='z-index: 31; display: none;'></div>");
        // $("div#vrCarViewSmall").prepend("<div id='btnFullScreen'></div>");
        // $("div#vrCarViewSmall").prepend("<div id='btnInOutSwitch' class='out'></div>");
        // $("div#vrCarViewSmall").prepend("<div id='btnImgSlide'></div>");
        //$("div#vrCarViewSmall").prepend("<div id='butRight' class='butZoom'></div><div id='butLeft' class='butZoom'></div>");

        // if(_this.options.markDetail.display == MarkerDisplay.DISPLAY){
        //     this.markerDisplay = MarkerDisplay.DISPLAY;
        // }
        // Marker.baseUrl = this.options.markDetail.base;
        // Marker.BuildMarkerOuter(_this.options);

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
                    //Marker.RedrawMarker(null, _this.openCloseStatus, _this.imageIndex, _this.markerDisplay);

                    _this.SetImageEventHandler();
                    //360도 이미지를 360도 회전 이후에 사라지도록 처리
                    // let targetWrap = document.querySelector('.pdp01_car');
                    // targetWrap.classList.add('ready');
                    // setTimeout(()=>{
                    //     targetWrap.classList.add('start');
                    // }, 300);


                });

            });
        };
        _this.imageSet.close.lowQ[_this.options.imgCount].src =  _this.options.srcOutClose[_this.options.imgCount];

        // window.addEventListener("resize",()=>{
        //     _this.OnWindowResize();
        // }, true);
        // window.addEventListener("orientationchange",()=>{
        //     _this.OnOrientationchange();
        // }, true);
        _this.panzoomconfig.InitPanzoomSmall();


    }

    SetImageEventHandler()
    {
        const _this = this;
        const canvas = document.querySelector("div#vrCarViewSmall canvas");

        const view = $("div#vrCarViewSmall div#divBodySub");

        /**
         * pc화면 드래그 이벤트
         * */
        view.on("mousedown", ()=>{
            //console.log('mousedown');
            let e = window.event;
            _this.xpointSmall = e.clientX;
            _this.OnTouchDragStart(_this);
        });
        view.on("mousemove", ()=>{
            let e = window.event;
            //if(!$("div.butZoom#butLeft").is(":visible"))
            if(_this.zScale <= 1.05) {
                if (this.xpointSmall == -1) return;
                //console.log('mousemove');
                let dx = e.clientX - _this.xpointSmall;
                _this.OnTouchDrag(dx, 0, _this, canvas);
                e.preventDefault();
            }
        });

        const touchEnd = function() {
            //console.log('mouseup');
            let e = window.event;
            _this.xpointSmall = -1;
            _this.OnTouchDragEnd(_this);
        };
        view.on("mouseup",touchEnd);

        const imagePrev = function() {
            _this.imageIndex--;
            _this.DrawCarIndex(canvas, _this.imageIndex);

        }
        const imageNext = function() {
            _this.imageIndex++;
            _this.DrawCarIndex(canvas, _this.imageIndex);
        }
        let _prevTimeout = 0;
        let _nextTimeout = 0;
        const butPrev = $("button.btn_nav_prev");
        butPrev.click(imagePrev);
        butPrev.mousedown(function() {
            _prevTimeout = setInterval(imagePrev, 100);
        });
        butPrev.mouseup(function() {
            clearTimeout(_prevTimeout);
            _this.OnTouchDragStart(_this);
        });
        butPrev.mouseleave(function() {
            clearTimeout(_prevTimeout);
            _this.OnTouchDragStart(_this);
        });
        const butNext = $("button.btn_nav_next");
        butNext.click(imageNext);
        butNext.mousedown(function() {
            _nextTimeout = setInterval(imageNext, 100);
        });
        butNext.mouseup(function() {
            clearTimeout(_nextTimeout);
            _this.OnTouchDragStart(_this);
        });
        butNext.mouseleave(function() {
            clearTimeout(_nextTimeout);
            _this.OnTouchDragStart(_this);
        });

        // const butClose = $("div#butClose");
        // butClose.click(()=>{
        //     this.CloseFullScreenMode();
        // });

        // const btnFullScreen = $("div#btnFullScreen");
        // btnFullScreen.click(()=>{
        //     this.OpenFullScreenMode();
        // });

        // const btnInOutSwitch = $("div#btnInOutSwitch");
        // btnInOutSwitch.click((e)=>{
        //     this.ChangeViewMode(e);
        // });

        // const btnImgSlide = $("div#btnImgSlide");
        // btnImgSlide.click((e)=>{
        //     this.OpenImageSlide(e);
        // });

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
        // const butLeft = $("div.butZoom#butLeft");
        // const butRight = $("div.butZoom#butRight");
        container.closest(".fullTarget").addClass("full");
        container.removeClass("full").addClass("full");
        // butLeft.removeClass("full").addClass("full");
        // butRight.removeClass("full").addClass("full");
        canvas.removeClass("full").addClass("full");
        // $("div#butClose").show();
        // $("div#btnFullScreen").hide();
        // $("div#btnImgSlide").hide();
        // $("div#btnInOutSwitch").hide();
        if (document.documentElement.requestFullscreen)
            document.documentElement.requestFullscreen();
        else if (document.documentElement.webkitRequestFullscreen) // Chrome, Safari (webkit)
            document.documentElement.webkitRequestFullscreen();
        else if (document.documentElement.mozRequestFullScreen) // Firefox
            document.documentElement.mozRequestFullScreen();
        else if (doc.msRequestFullscreen) // IE or Edge
            document.documentElement.msRequestFullscreen();
    }

    CloseFullScreenMode() {
        let _this = this;
        _this.fullScreen = false;
        let canvas = $("#vrCarViewSmall canvas#canvasCar");
        let container = _this.container;
        // const butLeft = $("#vrCarViewSmall div.butZoom#butLeft");
        // const butRight = $("#vrCarViewSmall div.butZoom#butRight");

        // butLeft.removeClass("full");
        // butRight.removeClass("full");
        canvas.removeClass("full");
        container.removeClass("full");
        container.closest(".fullTarget").removeClass("full");
        // $("div#butClose").hide();
        // $("div#btnFullScreen").show();
        // $("div#btnImgSlide").show();
        // $("div#btnInOutSwitch").show();

        _this.OnWindowResize();
        if (document.exitFullscreen)
            document.exitFullscreen();
        else if (document.webkitExitFullscreen) // Chrome, Safari (webkit)
            document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen) // Firefox
            document.mozCancelFullScreen();
        else if (document.msExitFullscreen) // IE or Edge
            document.msExitFullscreen();
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
        //console.log("imageIndex:"+imageIndex);

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

         //console.log(index);
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


        //Marker.RedrawMarker(null, _this.openCloseStatus, index, _this.markerDisplay);
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
        let _this = this;
        let container = $(_this.container);
        let parentContainerWidth = container.parent().width();
        //let parentContainerWidth = _this.imageNaturalWidth;
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

        //Marker.RedrawMarker(null, _this.openCloseStatus, _this.imageIndex, _this.markerDisplay);
    }

    OnOrientationchange(){
        let _this= this;

        if(!window.matchMedia('(orientation: portrait)').matches){
            //Portrait 모드일 때 실행할 스크립트
            if(_this.fullScreen){
            }else {

            }
        }else{
            // Landscape 모드일 때 실행할 스크립트
            if(!_this.fullScreen){
                this.OpenFullScreenMode();
            }
        }
    }

    OnMarkClickHandler(e = null) {
        alert("마커 클릭 이벤트");
    }

}