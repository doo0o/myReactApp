function newDrag() {
    // 변수 선언
    const items = document.querySelectorAll(".dragObj");
    const wItem = document.querySelectorAll(".dropObj");
    const wrap = document.querySelector(".dragObjWrap");
    const parent = document.querySelector(".dragParent");
  
    // 전역변수 선언
    let _this = null, shiftX = null, eventObj = null, scrollX = null,
        _isTarget = { this: null, clone: null, drop: null, isDrop: null, };

    // wrap padding 값 계산
    let targetPadding = Number(
      window
        .getComputedStyle(parent)
        .getPropertyValue("padding")
        .replace("px", "")
    );
    

    // ****** EVENT START *****
    items.forEach((el) => {
        el.addEventListener("mousedown", (e) => {
            mouseDown(e);
            el.ondragstart = function () {
            return false;
            };
        });
        el.addEventListener("touchstart", (e) => { 
            mouseDown(e); 
            el.ondragstart = () => {return false}
        }, false);
    });


    // scroll
    parent.addEventListener("wheel", (e) => {
      parent.scrollLeft += e.deltaY / 5;
      scrollX = e.deltaY / 5;
      console.log()
    });

    if (items.length >= 5) {
        parent.classList.add("scrollX");
        wrap.style.width = wItem[0].offsetWidth * items.length + "px";
    }

   
  
    function mouseDown(e) {
        _this = e.target;
        _isTarget.this = _this.closest(".dragObj");
        // Down,Start Event :  device Event Type
        eventType(e);
        setting();

        // 조건 : mouseDown event 발생이므로 mouseDown 함수 내부 실행
        // move, end event start
        wrap.addEventListener("mousemove", mouseMove, false);
        wrap.addEventListener("touchmove", mouseMove, false);
        window.addEventListener("mouseup", mouseUp, false);
        window.addEventListener("touchend", mouseUp, false);
    }
  
    function mouseMove(e) {
        eventType(e);

        // pointer 위치 element
        _isTarget.this.hidden = true;
        const element = document.elementFromPoint(eventObj.pageX, eventObj.pageY);
        _isTarget.this.hidden = false;
  
        let droppableBelow = element.closest(".dragObj");
  
        if (_isTarget.isDrop != droppableBelow) {
          if (_isTarget.isDrop) { // 마우스 포인터 위치가 타겟에 겹쳐질때
            leaveDroppable(_isTarget.isDrop);
          }
          _isTarget.isDrop = droppableBelow;
          if (droppableBelow) { // 마우스 포인터 위치가 타겟에 겹쳐지지 않을 때
            enterDroppable(_isTarget.isDrop);
          }
        }
        moveAt(eventObj.pageX);
    }
  
    function mouseUp(e) {
        if (_isTarget.isDrop !== null) {
          currentParent = _isTarget.isDrop.parentNode;
          _isTarget.isDrop.style.border = "";
          changeElement(e);
        }
        reset();
        e.mouseUp = null;
    }
  
    
    function setting()  {
        // Create Clone
        _isTarget.clone = _isTarget.this.cloneNode(true);
        _isTarget.clone.classList.add("clone");
        _isTarget.this.before(_isTarget.clone);

        // pointer x,y 계산
        shiftX = eventObj.clientX - _isTarget.this.getBoundingClientRect().left - parent.scrollLeft + targetPadding; 

        // target style
        _isTarget.this.style.position = "absolute";
        _isTarget.this.style.opacity = "0.5";
        _isTarget.this.style.top = "0";
    }
    
    function moveAt(pageX) {
        _isTarget.this.style.left = pageX - shiftX - scrollX + "px";
    }

    function reset() {
        // remove style, clone
        _isTarget.this.setAttribute('style','');
        _isTarget.clone.remove();

        // 전역변수 reset
        _this = null, shiftX = null, eventObj = null, scrollX = null,
        _isTarget = { this: null, clone: null, drop: null, isDrop: null, };
        
        // remove event 
        wrap.removeEventListener("mousemove", mouseMove);
        wrap.removeEventListener("touchmove", mouseMove, false);
        window.removeEventListener("mouseup", mouseUp, false);
        window.removeEventListener("touchend", mouseUp, false);
    }
  
    function enterDroppable(elem) {
      elem.style.border = "4px solid #00AAD2";
    }
    function leaveDroppable(elem) {
      elem.style.border = "";
    }
    function changeElement(e) {
        let dragIndex = _isTarget.this.getAttribute("data-drag-index");
        let dropIndex = _isTarget.isDrop.getAttribute("data-drag-index");
    
        _isTarget.clone.remove();
    
        if (dragIndex !== dropIndex) {
            _isTarget.this.after(_isTarget.isDrop);
            currentParent.appendChild(_isTarget.this);
        }
    }

    function eventType(e) {
        if (e.type.indexOf("mouse") !== -1) {
            eventObj = e;
        } else if (e.type.indexOf("touch") !== -1) {
            eventObj = e.touches[0];
        }
    }
  }
  