class drag{
    constructor(){
        this.dragObj = document.querySelectorAll(".dragObj")
        this.dropObj = document.querySelectorAll('.dropObj')
        this.isMoving = false;
    }
    onReady(){
        let dragParent = document.querySelector('.dragParent');
        // drag item을 감싸고 있는 부모 OBJ 너비
        let targetW = document.querySelector('#drag .dragObj').offsetWidth * this.dragObj.length;
        window.onload = function(){ 
            dragParent.style.width = targetW + 'px';
        }
        //
        
        for(let index = 0; index < this.dragObj.length; index++){
            this.start(index, this.dragObj, this.dropObj);
            this.dragObj[index].ondragstart = function() {
                return false;
            };
        }
    }

    start(index, dragObj, dropObj, boolean){
        let _clone = dragObj[index].cloneNode(true);// 드레그 스타트 타겟 클론

        dragObj[index].addEventListener('mousedown',(e) => {
            dropObj[index].classList.add("drag__status");
            dropObj[index].appendChild(_clone);
        });
       
        dragObj[index].addEventListener('mouseup',(e) => {
            let _clone = dragObj[index].cloneNode(true); // 마우스 업 타겟 클론
            dropObj[index].classList.remove("drag__status");
            dragObj[index].remove();
        })
    }

    moveAt(index, dragObj, dropObj, _clone){
        this.dragObj[index].addEventListener('mousemove', (event) => {
            let shiftX = event.clientX - dragObj[index].getBoundingClientRect().left;
            _clone.style.left = shiftX;
            console.log(shiftX);
            this.end(index, dragObj, dropObj, _clone);
        });
    }

    end(index, dragObj, dropObj, _clone){
        console.log(_clone)
        dropObj[index].classList.remove("drag__status");
        dragObj[index].remove();
        this.dropObj[index].removeEventListener('mousemove',this.moveAt)
    }
}

let Drag = new drag;
Drag.onReady()