function isDrag(callBack){
    // 변수 선언
    // Element
    const items = document.querySelectorAll('.dragObj');
    const target = document.querySelectorAll('.dropObj');
    const wrap = document.querySelector('.dragObjWrap');
    const wrapParent = document.querySelector('.dragParent');

    // padding 값 계산
    let targetPadding = Number(window.getComputedStyle(wrapParent).getPropertyValue('padding').replace('px',''));
    
    let _this = null,
        _thisClone = null,
        _thisEnd = null,
        shiftX = null,
        eventObj = null,
        dragIndex = null,
        dropIndex = null;

    let typeArr = [];
    let scrollX = null;
    

    // ****** EVENT START *****
    items.forEach((el) => {
        el.addEventListener('mousedown', (e) => {
            mouseDown(e)
            el.ondragstart = function() {
                return false;
            };
        });
        
        el.addEventListener('touchstart', (e) => {
            mouseDown(e)
            el.ondragstart = function() {
                return false;
            };
        }, false);
    });


    // 스크롤 대응
    // wrap.addEventListener('wheel', (e) => {
    //     wrap.scrollLeft += e.deltaY / 5;
    // })
    // wrap.addEventListener('mouseover',(e) => {
    //     const body = document.querySelector('body');
    //     body.style.overflow = "hidden";
    // })
    // wrap.addEventListener('mouseout',(e) => {
    //     const body = document.querySelector('body');
    //     body.setAttribute('style', "");
    // })
    // if(items.length >= 5){
    //     wrap.classList.add('scrollX');
    //     wrap.style.width = target[0].offsetWidth*items.length + 'px';
    // }
    
    function eventType(e){
        if(e.type.indexOf('mouse') !== -1){  // PC : mousedown, mousemove, mouseup
            eventObj = e;
        }else if(e.type.indexOf('touch') !== -1){ // TABBLET : touchstart, touchmove, touchend
            eventObj = e.touches[0];
        }
    }

    function mouseDown(e){
        _this = e.target.closest('.dragObj');
        _this.drop = e.target.closest('.dropObj');

        // Down,Start Event :  device Event Type
        eventType(e);

        // style setting & clone 생성
        setting();
        
        // mousedown 시에만 move,up event가 발생해야하기 때문에 down event 내 listner 작성
        wrap.addEventListener('mousemove', mouseMove);
        wrap.addEventListener('touchmove', mouseMove,false);
        window.addEventListener('mouseup', mouseUp, false);
        window.addEventListener('touchend', mouseUp ,false);
    }

  
    function mouseMove(e){
        // Move : device Event Type
        eventType(e);

        // // elementFromPoint에서 element를 찾기위해 마우스 포인터에 _this를 실시간으로 hidden = true, false 반복
        _this.hidden = true; 
        const element = document.elementFromPoint(eventObj.pageX, eventObj.pageY);
        _this.hidden = false;
        
        moveAt(eventObj.pageX);

        let droppableBelow = element.closest('.dragObj');
        // target에 mouse pointer in out 구분
        if (_thisEnd != droppableBelow) {
            if (_thisEnd) {
                leaveDroppable(_thisEnd);
            }
            _thisEnd = droppableBelow;
            if (droppableBelow) {
                enterDroppable(_thisEnd);
            }
        }
    }
    
    function mouseUp(e){ 
        // dragIndex = _this.getAttribute('data-drag-index');
        // dropIndex = _thisEnd.getAttribute('data-drag-index');
        if(){ // _this와 _thisEnd가 같을 경우 실행 X
            currentParent = _thisEnd.parentNode;
            _thisEnd.style.border = '';
            changeElement(e);
            reset();
        }
    }

    function reset(){
        _this.setAttribute('style','');

        _thisClone.remove();
        
        _this = null,
        _thisClone = null,
        _thisEnd = null,
        shiftX = null,
        eventObj = null,
        downType = null,
        moveType = null,
        endType = null;

        
        wrap.removeEventListener('mousemove', mouseMove);
        wrap.removeEventListener('touchmove', mouseMove,false);
        window.removeEventListener('mouseup', mouseUp, false);
        window.removeEventListener('touchend', mouseUp ,false);

        if(callBack) {
            callBack();
        }
    }
    
    function moveAt(pageX) { // mousemove에서 실시간 _this의 left값 계산
        // scrollX : scroll이 있을 때 작용 없으면 null
        _this.style.left = pageX - shiftX - scrollX + 'px';
    }
    function enterDroppable(target) { // 마우스 포인터 위치가 타겟에 겹쳐질때
        target.style.border = '4px solid #00AAD2';
    }
    function leaveDroppable(target) { // 마우스 포인터 위치가 타겟에 겹쳐지지 않을 때
        target.style.border = '';
    }

    function changeElement(e){
        

        _thisClone.remove();

        if(dragIndex !== dropIndex){
            _this.after(_thisEnd);
            currentParent.appendChild(_this);
        }
    }

    function setting(){
        // 클론 생성
        _thisClone = _this.cloneNode(true);
        _thisClone.classList.add('clone');
        _this.before(_thisClone); 

        // 이벤트 발생 좌표, 엘리먼트 좌표 계산
        shiftX = eventObj.clientX - _this.getBoundingClientRect().left - wrap.scrollLeft + targetPadding; 

        // target style
        _this.style.position = "absolute";
        _this.style.opacity = "0.5";
        _this.style.top = '0';
    }
}
isDrag(callBack);


function callBack() {
    // CallBack
    console.log("callBack")
}