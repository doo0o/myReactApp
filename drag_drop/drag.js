function newDrag(){
    const dragItems = document.querySelectorAll('.dragObj');
    const dragWrap = document.querySelector('.dragObjWrap');
    const dragParent = document.querySelector('.dragParent');
    let _this = null;
    let shiftX = null;
    let targetPadding = Number(window.getComputedStyle(dragParent).getPropertyValue('padding').replace('px',''));
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
    }
    dragItems.forEach((el) => {
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
    
    
    function mouseDown(e){
        // 변수 선언
        _this = e.target;
        _DR.select.target = _this.closest('.dragObj'); // 드래그 타겟
        _DR.select.drop = _this.closest('.dropObj'); //  드래그 타겟 부모 드롭 타겟
        _DR.select.clone = _DR.select.target.cloneNode(true);
        _DR.select.clone.classList.add('clone');

        shiftX = e.clientX - _DR.select.target.getBoundingClientRect().left + targetPadding; // 이벤트 발생 좌표, 엘리먼트 좌표 계산
        _DR.select.target.before(_DR.select.clone);

        // 스타일 정의
        _DR.select.target.style.position = "absolute";
        _DR.select.target.style.opacity = "0.5";
        _DR.select.target.style.top = '0'

        // moveAt(e.pageX);
        
        // _DR.select.target.addEventListener('mouseup', mouseUp);
        _DR.select.target.addEventListener('touchend', mouseUp ,false);
        // dragWrap.addEventListener('mousemove', mouseMove);
        dragWrap.addEventListener('touchmove', mouseMove,false);
    }
    
    function moveAt(pageX) {
        _DR.select.target.style.left = pageX - shiftX + 'px';

    }

    function mouseMove(e){
        // const { pageX, pageY } = e;
        _DR.select.target.hidden = true;
        const element = document.elementFromPoint(e.pageX, e.pageY);
        _DR.select.target.hidden = false;

        let droppableBelow = element.closest('.dragObj');
        if (_DR.endSelect.currentDroppable != droppableBelow) {
          if (_DR.endSelect.currentDroppable) {
            leaveDroppable(_DR.endSelect.currentDroppable);
          }
          _DR.endSelect.currentDroppable = droppableBelow;
          if (_DR.endSelect.currentDroppable) {
            enterDroppable(_DR.endSelect.currentDroppable);
          }
        }
        moveAt(e.pageX)
    }

    
    function mouseUp(e){
            let currentParent = _DR.endSelect.currentDroppable.parentNode;
            _DR.select.target.style.opacity = "1";
            _DR.select.target.style.position = "relative";
            _DR.select.target.style.left = "auto";
            _DR.endSelect.currentDroppable.style.border = '';
            _DR.select.clone.remove();
            changeEl(e);
            dragWrap.removeEventListener('mousemove', mouseMove);
            dragWrap.removeEventListener('touchmove', mouseMove,false);
            e.mouseUp = null;
            return false
    }

    function enterDroppable(elem) {
        elem.style.border = '4px solid #00AAD2';
    }
    function leaveDroppable(elem) {
        elem.style.border = '';
    }
    function changeEl(e){
        if(_DR.endSelect.currentDroppable !== _DR.select.target){
            _DR.select.target.after(_DR.endSelect.currentDroppable);
            currentParent.appendChild(_DR.select.target)
        }else if(_DR.endSelect.currentDroppable == _DR.select.target){
            return false
        }
    }
}

function dragDrop(){
    const dragItems = document.querySelectorAll('.dragObj');
    let dragWrap = document.querySelector(".dragObjWrap");  
    let dragobj = null;
    let dragIndex = null;
    let dragclone = null;
    dragWrap.style.width = dragItems[0].offsetWidth * dragItems.length + "px"; // 리스트 감싸고있는 부모 width 세팅

    function dragStart(e){
        let _this = e.target;
        dragobj = _this.closest('.dragObj');
        dragIndex = [...e.target.parentNode.children].indexOf(dragobj);
        dragclone = dragobj.cloneNode(true);
        console.log(e.target.getBoundingClientRect())
    }
    
    function dragOver(e){
        e.preventDefault();
        // let shiftX = e.clientX - dragobj.getBoundingClientRect().left;
        // dragobj.style.position = 'absolute';
        // dragobj.style.left = e.pageX - shiftX + "px";
        // console.log(e.pageX - shiftX)
    }
    
    function drop(e){
        let _this = e.target;
        if(_this !== dragWrap){
            const dropobj = _this.closest('.dragObj');
            const dropIndex = [...dropobj.parentNode.children].indexOf(dropobj)
            const dropclone = dropobj.cloneNode(true);
            if(dropIndex > dragIndex){
                dragobj.after(dropclone);
                dropobj.before(dragclone);
                dropobj.remove();
                dragobj.remove(); 
            }else if(dropIndex == dragIndex){
                return fals
            }else{
                dragobj.before(dropclone);
                dropobj.after(dragclone);
                dropobj.remove();
                dragobj.remove();
            }
        }else{
            return false
        }
    }
    dragWrap.addEventListener("dragstart", (e) => {dragStart(e)});
    dragWrap.addEventListener("dragover", (e) => {dragOver(e)});
    dragWrap.addEventListener("drop", (e) => {drop(e)});
}

// let dragParent = document.querySelector('.dragParent');
//         // drag item을 감싸고 있는 부모 OBJ 너비
// let targetW = document.querySelector('#drag .dragObj').offsetWidth * this.dragObj.length;
// window.onload = function(){ 
//     dragParent.style.width = targetW + 'px';
// }
// class drag{
//     constructor(){
//         this.dragObj = document.querySelectorAll(".dragObj")
//         this.dropObj = document.querySelectorAll('.dropObj')
//         this.isMoving = false;
//     }
//     onReady(){
//         let dragParent = document.querySelector('.dragParent');
//         // drag item을 감싸고 있는 부모 OBJ 너비
//         let targetW = document.querySelector('#drag .dragObj').offsetWidth * this.dragObj.length;
//         window.onload = function(){ 
//             dragParent.style.width = targetW + 'px';
//         }
//         //
        
//         for(let index = 0; index < this.dragObj.length; index++){
//             this.start(index, this.dragObj, this.dropObj);
//             this.dragObj[index].ondragstart = function() {
//                 return false;
//             };
//         }
//     }

//     start(index, dragObj, dropObj, boolean){
//         let _clone = dragObj[index].cloneNode(true);// 드레그 스타트 타겟 클론

//         dragObj[index].addEventListener('mousedown',(e) => {
//             dropObj[index].classList.add("drag__status");
//             dropObj[index].appendChild(_clone);
//         });
       
//         dragObj[index].addEventListener('mouseup',(e) => {
//             let _clone = dragObj[index].cloneNode(true); // 마우스 업 타겟 클론
//             dropObj[index].classList.remove("drag__status");
//             dragObj[index].remove();
//         })
//     }

//     moveAt(index, dragObj, dropObj, _clone){
//         this.dragObj[index].addEventListener('mousemove', (event) => {
//             let shiftX = event.clientX - dragObj[index].getBoundingClientRect().left;
//             _clone.style.left = shiftX;
//             console.log(shiftX);
//             this.end(index, dragObj, dropObj, _clone);
//         });
//     }

//     end(index, dragObj, dropObj, _clone){
//         console.log(_clone)
//         dropObj[index].classList.remove("drag__status");
//         dragObj[index].remove();
//         this.dropObj[index].removeEventListener('mousemove',this.moveAt)
//     }
// }

// let Drag = new drag;
// Drag.onReady()