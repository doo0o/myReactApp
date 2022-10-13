function newDrag(){
    const dragItems = document.querySelectorAll('.dragObj'); 
    const dragWrap = document.querySelector('.dragObjWrap'); 
    const dragParent = document.querySelector('.dragParent');
    let targetPadding = Number(window.getComputedStyle(dragParent).getPropertyValue('padding').replace('px',''));
    let _this = null, shiftX = null, eventObj = null, eventType = null, downType = null, moveType = null, endType = null;
    let typeArr = [];
    
    let _DR = {
        select : {
            target : null,
            clone : null,
            drop : null,
        },
        endSelect : {
            target : null,
            clone : null,
            drop : null,
            currentDroppable : null
        }
    };
    dragItems.forEach((el) => {
        el.addEventListener('mousedown', (e) => {
            window.mouseup_click_debug = true
            setTimeout(function() {
                window.mouseup_click_debug = false;
            }, 200);
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
    
    function evtType(e){
        if(e.type.indexOf('mouse') !== -1){
            eventObj = e;
        }else if(e.type.indexOf('touch') !== -1){
            eventObj = e.touches[0];
            e.touches[1].pageX
        }
    }

    function mouseDown(e){
        _this = e.target;
        typeArr = [downType];
        console.log(typeArr);
        
        // touch mouse event Type
        _DR.select.target = _this.closest('.dragObj'); 
        _DR.select.drop = _this.closest('.dropObj');

        evtType(e);
        _DR.select.clone = _DR.select.target.cloneNode(true);
        _DR.select.clone.classList.add('clone');
    
        shiftX = eventObj.clientX - _DR.select.target.getBoundingClientRect().left + targetPadding; // 이벤트 발생 좌표, 엘리먼트 좌표 계산
        _DR.select.target.before(_DR.select.clone);
        
        // target style
        _DR.select.target.style.position = "absolute";
        _DR.select.target.style.opacity = "0.5";
        _DR.select.target.style.top = '0';
        
        dragWrap.addEventListener('mousemove', mouseMove);
        dragWrap.addEventListener('touchmove', mouseMove,false);
        window.addEventListener('mouseup', mouseUp, false);
        window.addEventListener('touchend', mouseUp ,false);
    }

    function moveAt(pageX) {
        _DR.select.target.style.left = pageX - shiftX + 'px';
    }

    function mouseMove(e){
        moveType = e.type;
        typeArr = [downType,moveType];
        if(typeArr[1] == null){
            reset();
        }else{
            evtType(e);
            _DR.select.target.hidden = true;
            const element = document.elementFromPoint(eventObj.pageX, eventObj.pageY);
            _DR.select.target.hidden = false;
            
            let droppableBelow = element.closest('.dragObj');

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

    
    function mouseUp(e){ 
        endType = e.type
        typeArr = [downType,moveType,endType];
        console.log(typeArr)
        if(typeArr.length == 3){
            if(_DR.endSelect.currentDroppable !== null){
                currentParent = _DR.endSelect.currentDroppable.parentNode;
                _DR.endSelect.currentDroppable.style.border = '';
                changeEl(e);
            }
            reset()
            e.mouseUp = null;
        }else{
            console.log('return')
            return false
        }
    }

    function reset(){
        _DR.select.target.style.opacity = "1";
        _DR.select.target.style.position = "relative";
        _DR.select.target.style.left = "auto";

        _DR.select.clone.remove();
        
        _DR = {
            select : {
                target : null,
                clone : null,
                drop : null,
            },
            endSelect : {
                target : null,
                clone : null,
                drop : null,
                currentDroppable : null
            }
        }

        dragWrap.removeEventListener('mousemove', mouseMove);
        dragWrap.removeEventListener('touchmove', mouseMove,false);
        window.removeEventListener('mouseup', mouseUp, false);
        window.removeEventListener('touchend', mouseUp ,false);
    }
    
    function enterDroppable(elem) {
        elem.style.border = '4px solid #00AAD2';
    }
    function leaveDroppable(elem) {
        elem.style.border = '';
    }
    function changeEl(e){
        let dragIndex = _DR.select.target.getAttribute('data-drag-index');
        let dropIndex = _DR.endSelect.currentDroppable.getAttribute('data-drag-index');

        _DR.select.clone.remove();

        if(dragIndex !== dropIndex){
            _DR.select.target.after(_DR.endSelect.currentDroppable);
            currentParent.appendChild(_DR.select.target);
        }else{
            console.error("드래그 하려는 타겟이 드롭하려는 타겟과 같아 함수 종료")
        }
    }
}
