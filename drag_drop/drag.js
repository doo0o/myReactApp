class drag{
    constructor(x,y){
        this._target = document.querySelectorAll("#drag li")
        this._parent = document.getElementById('drag')
        this._dragParent = this._parent.querySelector('.x-ov')
        this._targetW = document.querySelector('#drag li').offsetWidth*this._target.length
        this.x = x
        this.y = y
        this.cloneObj = {}
    }
    
    cloneFactory(){
        console.log(this.cloneObj)
    }
}

let Drag = new drag;
Drag.cloneFactory()

// let _target = document.querySelectorAll("#drag li"),
//     _parent = document.getElementById('drag')
// drag_v2 = document.getElementById("drag_v2");
// let currentItemIndex = null;
// let currentItem = null;

// let k = _parent.querySelector('.x-ov');
// let h = document.querySelector('#drag li').offsetWidth*_target.length

// window.onload = function(){
//     k.style.width = h + 'px';
// }


// for(const [ i, target ] of _target.entries()){  
//     target.onmousedown = function(event){
//         target.style.position = 'absolute';
//         target.style.zIndex = 1000;
//         let _targetX = event.clientX;
//         // console.log(_targetX)
//         for(let i = 0; i < _target.length; i++){
//             console.log(_target[i].clientX);
//             _target[i].style.position = 'absolute';
//             _target[i].style.left = 'absolute';
//         }
        
//     }
// }





// target.addEventListener('dragstart', (e) => {
//     currentItem = e.target;
//     const listArr = [...currentItem.parentElement.children];
//     currentItemIndex = listArr.indexOf(currentItem);
//     console.log(e);
//     target.style.position = 'absolute'
    
// });

// target.addEventListener('dragover', (e) => {
//     e.preventDefault();
//     console.log(target);
// });

// target.addEventListener('drop', (e) => {
//     e.preventDefault();
    
//     const currentDropItem = e.target;
//     const listArr = [...currentItem.parentElement.children];
//     const dropItemIndex = listArr.indexOf(currentDropItem);
//     currentItem.style.position = 'relative'
//     if (currentItemIndex < dropItemIndex) {
//     currentDropItem.after(currentItem);
//     } else {
//     currentDropItem.before(currentItem);
//     }
// });