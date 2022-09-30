

(()=> {
    const QS = (select) => document.querySelectorAll(select);
    const dragItem = QS('.dragItem');
    const dropItem = QS('.dropObj');
    const dragParent = QS('dragParent');
    let dragItemW = dragItem[0].offsetWidth * dragItem.length;

    window.onload = function(){
        dragParent.style.width = targetW + 'px';
    }

    dragItem.forEach(el => {
        el.addEventListener('dragstart', () => {
            el.classList.add('drag__status')
        })
    })

})();


class drag{
    onReady(){
        let dragParent = document.querySelector('.dragParent');
        let targetW = document.querySelector('#drag .dragItem').offsetWidth * this._target.length;
        window.onload = function(){
            dragParent.style.width = targetW + 'px';
        }
        // this._parent.ondragstart = function() {
        //     return false;
        // };
        for(let index = 0; index < this._target.length; index++){
            this.start(index, this._target, this._parent);
        }
    }

    start(index, _target, _parent){
        _target[index].addEventListener('dargstart',(e) => {
            console.log(e);
            let _clone = _target[index].cloneNode(true);  // 드레그 스타트 타겟 클론
            _parent[index].classList.add("drag__status");
            _parent[index].appendChild(_clone);
            this.moveAt(index, _target, _parent ,true);
        });

        _target[index].addEventListener('drag',() => { 
            let _clone = _target[index].cloneNode(true); // 마우스 업 타겟 클론
            _target[index].remove();
            this.end(index, _target, _parent, _clone);
            this.moveAt(index, _target, _parent ,false);
        })
    }

    moveAt(index, _target,_parent ,boolean){
        this._parent[index].addEventListener('mousemove', (event) => {
            let shiftX = event.clientX - _target[index].getBoundingClientRect().left;
            console.log(shiftX);
            if(boolean === false){
                console.log(_parent)
                this.end(index, _target, _parent, boolean);
                console.log("end");
            }
        });
    }

    end(index, _target, _parent, _clone, boolean){
        console.log(_clone)
        _parent[index].classList.remove("drag__status");
        _target[index].remove();
        this._parent[index].removeEventListener('mousemove',this.moveAt)
    }
}

let Drag = new drag;
Drag.onReady()