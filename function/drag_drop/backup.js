function newDrag() {
  const dragItems = document.querySelectorAll(".dragObj");
  const dropItems = document.querySelectorAll(".dropObj");
  const dragWrap = document.querySelector(".dragObjWrap");
  const dragParent = document.querySelector(".dragParent");

  let targetPadding = Number(
    window
      .getComputedStyle(dragParent)
      .getPropertyValue("padding")
      .replace("px", "")
  );
  let _this = null,
    shiftX = null,
    eventObj = null,
    eventType = null,
    downType = null,
    moveType = null,
    endType = null;
  let typeArr = [];
  let scrollX = null;
  let _DR = {
    select: {
      target: null,
      clone: null,
      drop: null
    },
    endSelect: {
      target: null,
      clone: null,
      drop: null,
      currentDroppable: null
    }
  };
  if (dragItems.length >= 5) {
    dragParent.classList.add("scrollX");
    dragWrap.style.width = dropItems[0].offsetWidth * dragItems.length + "px";
  }
  dragItems.forEach((el) => {
    el.addEventListener("mousedown", (e) => {
      mouseDown(e);
      el.ondragstart = function () {
        return false;
      };
    });
    el.addEventListener(
      "touchstart",
      (e) => {
        mouseDown(e);
        el.ondragstart = function () {
          return false;
        };
      },
      false
    );
  });
  dragParent.addEventListener("wheel", (e) => {
    dragParent.scrollLeft += e.deltaY / 5;
    // scrollX = e.deltaY / 5;
    // console.log()
  });
  function evtType(e) {
    if (e.type.indexOf("mouse") !== -1) {
      eventObj = e;
    } else if (e.type.indexOf("touch") !== -1) {
      eventObj = e.touches[0];
      console.log(e.touches[0]);
      // console.log(e.touches[1])
      // e.touches[1].pageX;
    }
  }

  function mouseDown(e) {
    _this = e.target;
    typeArr = [downType];

    // touch mouse event Type
    _DR.select.target = _this.closest(".dragObj");
    _DR.select.drop = _this.closest(".dropObj");

    evtType(e);
    _DR.select.clone = _DR.select.target.cloneNode(true);
    _DR.select.clone.classList.add("clone");

    shiftX =
      eventObj.clientX -
      _DR.select.target.getBoundingClientRect().left -
      dragParent.scrollLeft +
      targetPadding; // 이벤트 발생 좌표, 엘리먼트 좌표 계산
    _DR.select.target.before(_DR.select.clone);

    // target style
    _DR.select.target.style.position = "absolute";
    _DR.select.target.style.opacity = "0.5";
    _DR.select.target.style.top = "0";

    dragWrap.addEventListener("mousemove", mouseMove);
    dragWrap.addEventListener("touchmove", mouseMove, false);
    window.addEventListener("mouseup", mouseUp, false);
    window.addEventListener("touchend", mouseUp, false);
  }

  function moveAt(pageX) {
    _DR.select.target.style.left = pageX - shiftX - scrollX + "px";
  }

  function mouseMove(e) {
    moveType = e.type;
    typeArr = [downType, moveType];
    if (typeArr[1] == null) {
      reset();
    } else {
      evtType(e);
      _DR.select.target.hidden = true;
      const element = document.elementFromPoint(eventObj.pageX, eventObj.pageY);
      _DR.select.target.hidden = false;

      let droppableBelow = element.closest(".dragObj");

      if (_DR.endSelect.currentDroppable != droppableBelow) {
        if (_DR.endSelect.currentDroppable) {
          leaveDroppable(_DR.endSelect.currentDroppable);
        }
        _DR.endSelect.currentDroppable = droppableBelow;
        if (droppableBelow) {
          enterDroppable(_DR.endSelect.currentDroppable);
        }
      }
      moveAt(eventObj.pageX);
    }
  }

  function mouseUp(e) {
    endType = e.type;
    typeArr = [downType, moveType, endType];
    if (typeArr.length == 3) {
      if (_DR.endSelect.currentDroppable !== null) {
        currentParent = _DR.endSelect.currentDroppable.parentNode;
        _DR.endSelect.currentDroppable.style.border = "";
        changeEl(e);
      }
      reset();
      e.mouseUp = null;
    } else {
      console.log("return");
      return false;
    }
  }

  function reset() {
    _DR.select.target.style.opacity = "1";
    _DR.select.target.style.position = "relative";
    _DR.select.target.style.left = "auto";

    _DR.select.clone.remove();

    _DR = {
      select: {
        target: null,
        clone: null,
        drop: null
      },
      endSelect: {
        target: null,
        clone: null,
        drop: null,
        currentDroppable: null
      }
    };

    dragWrap.removeEventListener("mousemove", mouseMove);
    dragWrap.removeEventListener("touchmove", mouseMove, false);
    window.removeEventListener("mouseup", mouseUp, false);
    window.removeEventListener("touchend", mouseUp, false);
  }

  function enterDroppable(elem) {
    elem.style.border = "4px solid #00AAD2";
  }
  function leaveDroppable(elem) {
    elem.style.border = "";
  }
  function changeEl(e) {
    let dragIndex = _DR.select.target.getAttribute("data-drag-index");
    let dropIndex = _DR.endSelect.currentDroppable.getAttribute(
      "data-drag-index"
    );

    _DR.select.clone.remove();

    if (dragIndex !== dropIndex) {
      _DR.select.target.after(_DR.endSelect.currentDroppable);
      currentParent.appendChild(_DR.select.target);
    } else {
      console.error("드래그 하려는 타겟이 드롭하려는 타겟과 같아 함수 종료");
    }
  }
}












function isDrag(callBack){
    // 변수 선언
    // Element
    const items = document.querySelectorAll('.dragObj');
    // const target = document.querySelectorAll('.dropObj');
    const wrap = document.querySelector('.dragObjWrap');
    const wrapParent = document.querySelector('.dragParent');

    // padding 값 계산
    let targetPadding = Number(window.getComputedStyle(wrapParent).getPropertyValue('padding').replace('px',''));
    
    let _this = null,
        _thisClone = null,
        _thisEnd = null,
        shiftX = null,
        eventObj = null,
        scrollX = null,
        typeArr = [];
    

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
 
    function mouseDown(e){
        _this = e.target.closest('.dragObj');
        
        // Down,Start Event :  device Event Type
        eventType(e);

        // style setting & clone 생성
        setting(e);
        
        // mousedown 시에만 move,up event가 발생해야하기 때문에 down event 내 listner 작성
        wrap.addEventListener('mousemove', mouseMove);
        wrap.addEventListener('touchmove', mouseMove,false);
        window.addEventListener('mouseup', mouseUp, false);
        window.addEventListener('touchend', mouseUp ,false);
    }

  
    function mouseMove(e){
        // typeArr = [e.type];
        // Move : device Event Type
        eventType(e);

        // // elementFromPoint에서 element를 찾기위해 마우스 포인터에 _this를 실시간으로 hidden = true, false 반복
        _this.hidden = true; 
        const element = document.elementFromPoint(eventObj.pageX, eventObj.pageY);
        _this.hidden = false;
        
        let droppableBelow = element.closest('.dragObj');
        // target에 mouse pointer in out 구분
        if (_thisEnd != droppableBelow) {
            if (_thisEnd) { // 마우스 포인터 위치가 타겟에 겹쳐질때
                leaveDroppable(_thisEnd);
            }
            _thisEnd = droppableBelow;
            if (droppableBelow) { // 마우스 포인터 위치가 타겟에 겹쳐지지 않을 때
                enterDroppable(_thisEnd);
            }
        }
        moveAt(eventObj.pageX);
    }
    
    function mouseUp(e){
        console.log(typeArr.length)
        if(typeArr.length == 0){
            if(_thisEnd !== null){ // _this와 _thisEnd가 같을 경우 실행 X
                currentParent = _thisEnd.parentNode;
                changeElement(e);
            }
            reset();
        }
    }

    
    
    function moveAt(pageX) { // mousemove에서 실시간 _this의 left값 계산
        // scrollX : scroll이 있을 때 작용 없으면 null
        _this.style.left = pageX - shiftX - scrollX + 'px';
    }
       
    function eventType(e){
        if(e.type.indexOf('mouse') !== -1){  // PC : mousedown, mousemove, mouseup
            eventObj = e;
        }else if(e.type.indexOf('touch') !== -1){ // TABBLET : touchstart, touchmove, touchend
            eventObj = e.touches[0];
        }
    }

    function enterDroppable(target) { 
        target.style.border = '4px solid #00AAD2';
    }
    function leaveDroppable(target) { 
        target.style.border = '';
    }

    function changeElement(e){
        let dragIndex = _this.getAttribute('data-drag-index');
        // let dropIndex = _thisEnd.getAttribute('data-drag-index');

        _thisClone.remove();

        if(dragIndex !== dropIndex){
            _this.after(_thisEnd);
            currentParent.appendChild(_this);
        }
    }

    function setting(e){
        // 클론 생성
        _thisClone = _this.cloneNode(true);
        _thisClone.classList.add('clone');
        _this.before(_thisClone); 
a
        // 이벤트 발생 좌표, 엘리먼트 좌표 계산
        shiftX = eventObj.clientX - _this.getBoundingClientRect().left - wrap.scrollLeft + targetPadding; 

        // target style
        _this.style.position = "absolute";
        _this.style.opacity = "0.5";
        _this.style.top = '0';
    }

    function reset(){
        // console.log(_thisEnd)
        _this.setAttribute('style','');
        _thisEnd.style.border = '';
        _thisClone.remove();
        
        _this = null,
        _thisClone = null,
        _thisEnd = null,
        shiftX = null,
        eventObj = null,
        dropIndex = null,
        droppableBelow = null,
        scrollX = null;
        
        wrap.removeEventListener('mousemove', mouseMove);
        wrap.removeEventListener('touchmove', mouseMove,false);
        window.removeEventListener('mouseup', mouseUp, false);
        window.removeEventListener('touchend', mouseUp ,false);

        if(callBack) {
            callBack();
        }
    }
}

isDrag(callBack);


function callBack() {
    // CallBack
    console.log("callBack")
}