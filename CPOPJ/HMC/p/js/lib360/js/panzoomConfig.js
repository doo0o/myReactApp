'use strict';

class PanzoomConfig {


    constructor(vrCarView)
    {
        this.pzcarMain = null;
        this.vrCarView = null;

        this.zooming = false;
        this.panzoomEvent = {
            start : false,
            x : 0,
            y : 0,
        };
    

        this.vrCarView = vrCarView;
        this.onSingleTouchMove = vrCarView.OnTouchDrag;
        this.onSingleTouchEnd = vrCarView.OnTouchDragEnd;
    }

    OnDoubleTouchHandler(canvas)
    {
        const _this = this;
        var scale = this.pzcarMain.getTransform().scale;
        var e = window.event;
        var ex = e.clientX;
        var ey = e.clientY;
        if(e.changedTouches !== undefined && e.changedTouches.length > 0)
        {
            ex = e.changedTouches[0].clientX;
            ey = e.changedTouches[0].clientY;
        }

        _this.pzcarMain.pause();
        var y = _this.pzcarMain.getTransform().y;
        var x = _this.pzcarMain.getTransform().x;

        _this.zooming = true;
        this.SmoothZoomAbs(0, -y, 1, 500,
            function(){
                _this.zooming = false;
                _this.PanZoomHandler(_this.pzcarMain, _this,canvas);
                _this.vrCarView.DrawCarIndex(canvas);
                _this.pzcarMain.resume();
            });
        return true; // tel
    }


    SmoothZoomAbs(x, y, zoomlevel, duration = 400, functionComplete = null)
    {
        const _this = this;
        _this.pzcarMain.smoothZoomAbs(x, y, zoomlevel, duration, ()=>{
            if(functionComplete != null) functionComplete();
        });
    }

    CheckSingleTouch(e)
    {
        if(e.touches != undefined && e.touches.length == 1) e = e.touches[0];
        var point = this.pzcarMain.getOffsetXY(e);

        if(point.x != NaN && point.y != NaN && this.pzcarMain.getTransform().scale == 1)
        {
            return point;
        }

        return false;
    }


    PanZoomSingleTouchMove(e, canvas)
    {
        var point = this.CheckSingleTouch(e);
        if(point == false) return;

        if(this.panzoomEvent.start == false)
        {
            this.panzoomEvent.start = true;
            this.panzoomEvent.x = point.x;
            this.panzoomEvent.y = point.y;
        }

        if(this.panzoomEvent.start == true)
        {
            const dx = point.x - this.panzoomEvent.x;
            const dy = point.y - this.panzoomEvent.y;
            if(this.onSingleTouchMove != null)
            {
                this.onSingleTouchMove(dx, dy, this.vrCarView,canvas);
            }
        }
    }

    PanZoomSingleTouchEnd(e)
    {
        var point = this.CheckSingleTouch(e);
        if(point == false)
        {
            return;
        }
        this.panzoomEvent.start = false;
        if(this.onSingleTouchEnd != null)
        {
            this.onSingleTouchEnd(this.vrCarView);
        }
    }

    PanZoomHandler(e, panzoomconfig, canvas)
    {
        if(!this.zooming) panzoomconfig.vrCarView.ZoomHandler(e,canvas);
    }

    InitPanzoomSmall()
    {
        const zoomTarget = document.querySelector("div#vrCarViewSmall div#divBodySub");
        const canvas = document.querySelector("div#carImage canvas");
        const _this = this;
        _this.zooming = false;

        var pzcarMain = panzoom(zoomTarget, {
            maxZoom: 10,
            minZoom: 1,
            bounds : true,
            boundsPadding :1,
            for3dView : true,
            onDoubleClick: ()=>
            {
                _this.OnDoubleTouchHandler(canvas);
            },
            OnTouchMove : (e) =>{
                e = window.event;
                //_this.PanZoomSingleTouchMove(e,canvas)
            }

        });



        this.pzcarMain = pzcarMain;
        const panzoomconfig = this;
        pzcarMain.on('transform', function(e) {
            var scale = e.getTransform().scale;
            if(scale > 1)
                panzoomconfig.vrCarView.carImageQuality = CarImageQuality.HIGH;
            else
                panzoomconfig.vrCarView.carImageQuality = CarImageQuality.LOW;

            panzoomconfig.vrCarView.DrawCarIndex(canvas);
        });

        pzcarMain.on('zoom', (e)=>{
            this.PanZoomHandler(e, panzoomconfig, canvas);

        });
        pzcarMain.on('pan', (e)=>{
            this.PanZoomHandler(e, panzoomconfig, canvas)
        });

        pzcarMain.on("mouseup", () =>{
            var e = window.event;
            this.PanZoomSingleTouchEnd(e);
        });

        pzcarMain.on('touchup', ()=>{
            var e = window.event;
            this.PanZoomSingleTouchEnd(e);
        });

        pzcarMain.on('vdoubleclick', (e)=>{
            _this.OnDoubleTouchHandler(canvas);
        });

    }

}