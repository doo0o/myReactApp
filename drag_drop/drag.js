function newDrag(){
    const dragItems = document.querySelectorAll('.dragObj');
    let _this = null
    let pick = {
        target : null
    }
    let drop = {
        target : null
    }
    function _return(){
        return false
    }

    function mouseDown(e){
        _this = e.target;
        pick.target = _this.closest('.dragObj');
        console.log(pick.target)
    }

    function atMove(e){
        console.log()
    }

    function mouseUp(e){
        _this = e.target;
        drop.target = _this.closest('.dragObj');
        console.log(drop.target)
    }
      
    dragItems.forEach(el => {
        el.addEventListener('mousedown', (e) => {mouseDown(e)});
        // el.addEventListener('mousemove', (e) => {
        //     e.target == _this ? atMove(e) : _return();
        // });
        el.addEventListener('mouseup',(e) => {mouseUp(e)});
    });
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
                return false
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