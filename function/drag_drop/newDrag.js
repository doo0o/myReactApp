class NewDrag {
    constructor(){
        this.items = document.querySelectorAll('.dragObj'); 
        this.wrap = document.querySelector('.dragObjWrap'); 
        this.dragParent = document.querySelector('.dragParent');
        // this.targetPadding = Number(window.getComputedStyle(dragParent).getPropertyValue('padding').replace('px',''));
        this.shiftX = null;
        this.deviceEvt = null;
        this.state = false;
        this.downTarget = null;
        this.clone = null;
        this.addEvent();
    }

    addEvent(){
     
        this.items.forEach( element => {
            element.
        })
    }

}