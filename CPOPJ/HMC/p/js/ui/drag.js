
/**
 * * @param {Function} callBack
 * * @param {Object} objReturn
* 	objReturn = {
		target : this.dragItems,
		index :  this.dragItems.length,
		pin : this.pin,
		fixObjIndex : this.dragItems,
		fixObj : this.fixedItem,
		deviceType : this.TYPE_DEVICE
	}
 */
class carCompare {
	constructor(callBack){
		this.drag = document.getElementById("drag")
		this.wrap = document.querySelector(".dragObjWrap")
		this.parent = document.querySelector(".dragParent")
		this.dragItems = this.wrap.querySelectorAll(".dragObj")
		this.dragItemsCont = this.wrap.querySelectorAll('.dragObj .cont')
		this.touchItems = this.wrap.querySelectorAll('.dropObj')
		this.fixedItem = this.wrap.querySelector('.fixed')
		this.pin = this.wrap.querySelectorAll('.dragObj .pin')
		
		this.targetPadding = Number(
			window
			.getComputedStyle(this.parent)
			.getPropertyValue("padding")
			.replace("px", "")
		);

		this.eventState = {
			clickCompare : false, // mousedown : true / mouseup : false
			moveCompare : false, // move on: true / move out : false
			touchCompare : false, // touch on: true / touch out : false
			navCompare : false, // create nav view :true / none : false
			scrollCompare : false,
		}

		// default
		this.currentItem = null
		this.currentclone = null
		this.droppableBelow = null
		this.futureItem = null
		this.shiftX = null
		this.scrollX = window.scrollX;

		this.longTouch = 0
		this.result = 0
		this.touchNav = null

		// DviceCheck
		this.TYPE_DEVICE = /iPad|tablet/i.test(window.navigator.userAgent)


		// this.callBack = callBack;
		this.load()
		this.callBack(callBack)
	}

	
	load(){
		window.onload = () => {
			let scrollArea = this.dragItems[0].clientWidth * this.dragItems.length;
			this.wrap.style.width = scrollArea + 'px';
		}



		if(!this.TYPE_DEVICE){
			
		/*	*	*	*	*
		*	DEVICE TYPE	*
		*	> DESKTOP <	*
		*	*	*	*	*/

			//scroll Event Listener
			this.dragItemsCont.forEach(element => {
				element.addEventListener("scroll", (e) => {
					this.scrollSticky(e)
				})
			});

			// mouse Down Event Listener
			this.dragItemsCont.forEach(element => {
				element.addEventListener("mousedown", (e) => {
					if(!e.target.closest(".dragObj").classList.contains('fixed')){
						this.eventState.clickCompare = true;
						if(this.eventState.clickCompare) this.dragMouseDown(e);
					}
				})
			})

			// Mouse Move Event
			this.drag.addEventListener("mousemove", (e) => {
				this.eventState.moveCompare = true;
				if(this.eventState.clickCompare && this.eventState.moveCompare) this.dragMouseMove(e);
			})

			// PIN CLICK EVENT
			this.pin.forEach(element => {
				element.addEventListener("mousedown", (e) => {
					this.PINSwitch(e)
				})
			})
			
			// Mouse Up Event Listner
			window.addEventListener("mouseup", (e) => {
				if(e.target.closest('.dragObjWrap')){
					if(!e.target.closest(".dragObj").classList.contains('fixed')){
						if(this.eventState.clickCompare) this.dragMouseUp(e);
					}
				}
			})


		}else if(this.TYPE_DEVICE){

		/*	*	*	*	*
		*	DEVICE TYPE	*
		*	> TABLET <	*
		*	*	*	*	*/
		
			//scroll Event Listener
			this.dragItemsCont.forEach(element => {
				element.addEventListener("scroll", (e) => {
					this.scrollLoad(e);
					if(this.eventState.touchCompare) this.eventState.touchCompare = false;
				})
			})

			this.parent.addEventListener("scroll", (e) => {
				this.scrollLoad(e);
				if(this.eventState.touchCompare) this.eventState.touchCompare = false;
			})
			// mouse Down Event Listener
			this.dragItemsCont.forEach(element => {
				element.addEventListener("touchstart" , (e) => {
					this.touchStart(e);
				})
			});

			// PIN CLICK EVENT
			this.pin.forEach(element => {
				element.addEventListener("touchstart", (e) => {
					this.PINSwitch(e)
				})
			});

			window.addEventListener("touchend", (e) => {
				this.touchEnd(e);
			})
		}
	}
	scrollLoad(e){
		this.eventState.scrollCompare = true;
		this.eventState.touchCompare = false;

		if(e.target.classList.contains('cont')){
			this.scrollSticky(e)
		}
	}

	scrollSticky(e){
		this.eventState.scrollCompare = true;
		this.eventState.touchCompare = false;

		if(this.eventState.scrollCompare && !this.eventState.touchCompare){
			for (let i = 0; i < this.dragItemsCont.length; i++) {
				this.dragItemsCont[i].scrollTop = e.target.scrollTop;
			}
			if(e.target.scrollTop >= 1){
				this.wrap.classList.add('sticky');
			}else if(e.target.scrollTop == 0){
				this.wrap.classList.remove('sticky');
			}
		}
	}

	dragMouseDown(e){
		this.currentItem = e.target.closest(".dragObj");

		e.target.ondragstart = () => {return false};

		this.dragSetting(e);
	}

	dragMouseMove(e){
		this.currentItem.hidden = true;
		this.element = document.elementFromPoint(e.pageX - this.scrollX, e.pageY - window.pageYOffset);
		this.currentItem.hidden = false;

		this.droppableBelow = this.element.closest('.dragObj');

		if(this.droppableBelow && !this.droppableBelow.classList.contains('fixed')){

			if (this.futureItem != this.droppableBelow) {
				if (this.futureItem) leaveDroppable(this.futureItem);
				
				this.futureItem = this.droppableBelow;
				if (this.droppableBelow) enterDroppable(this.futureItem);
			}
	
			function enterDroppable(elem) {
				elem.style.border = "4px solid #00AAD2";
			}

			function leaveDroppable(elem) {
				elem.style.border = "";
			}
	
			this.MoveAt(e.pageX);
		}else{
			this.init();
		}

	
	}

	dragMouseUp(e){
		if (this.futureItem !== null) {
			this.futureItem.style.border = "";

			this.currentIdx = this.currentItem.dataset.dragIndex;
			this.futureIdx = this.futureItem.dataset.dragIndex;

			if (this.currentIdx !== this.futureIdx) {
				this.changeElement(this.currentItem, this.futureItem);
			}
		}
		e.mouseUp = null;
		this.init(e);
	}


	MoveAt(pageX){
		this.currentItem.style.left = pageX - this.shiftX - this.scrollX + "px";
	}

	

	dragSetting(e){
		// Create Clone
		this.currentclone = this.currentItem.cloneNode(true);
		this.currentclone.classList.add("clone");
		this.currentItem.before(this.currentclone);
		
		// // pointer x,y 계산
		this.shiftX = e.pageX - this.currentItem.getBoundingClientRect().left - this.parent.scrollLeft + this.targetPadding;

		// target style
		this.currentItem.style.position = "absolute";
		this.currentItem.style.top = "0";
		this.currentItem.style.zIndex = "9999";
		this.currentItem.style.opacity = "0.5";
	}

	// pin click
	PINSwitch(e){
		if(e.target.dataset.fix == 'false' || e.target.dataset.fix == ""){
			const currentItem = e.target.closest('.dragObj');
			const fixItem = document.querySelector('.fixed');
			
			e.target.dataset.fix = true;
			fixItem.querySelector('.pin').dataset.fix = false;

			currentItem.classList.add('fixed');
			fixItem.classList.remove('fixed');

			this.changeElement(currentItem, fixItem)
		}
	}

	// Tablet
	touchStart(e){
		this.init();
		this.eventState.scrollCompare = false;
		this.eventState.touchCompare = true;
	}

	touchEnd(e){
		if(this.eventState.touchCompare && !this.eventState.scrollCompare){
			this.eventState.navCompare = true;
			this.targetSelect(e);
		}else{
			this.init(e);
		}
	}
	
	targetSelect(e){
		let item = e.target.closest('.dropObj');
		if(this.eventState.navCompare && !item.querySelector('.dragObj').classList.contains('fixed')){
			item.classList.add('select');
			this.createNavi(e, item);
		}
	}

	touchMove(e){
		function itemChild(target){
			if(target == null){
				return null
			}else{
				let output = target.querySelector('.dragObj');
				return output
			}
		}

		let _this = e.target.closest('.dropObj');
		let _thisNext = _this.nextSibling.nextSibling;
		let _thisPrev = _this.previousSibling.previousSibling;
		let item = itemChild(_this);
		let nextItem = itemChild(_thisNext);
		let prevItem = itemChild(_thisPrev);

		let button = e.target;


		if(button.classList.contains('touch_prev') && _thisPrev !== null && !prevItem.classList.contains('fixed')){
			this.changeElement(item, prevItem)
		}else if(button.classList.contains('touch_next') && _thisNext !== null){
			this.changeElement(item, nextItem)
		}

		this.init();
	}
	
	createNavi(e, item){
		if(this.eventState.navCompare && e.target.closest('.dragObj')){
			this.touchNav = document.createElement('div');
			this.touchNav.classList.add('touchNav');
			
			let touchNavPrev = document.createElement('button');
			let touchNavNext = document.createElement('button');
			touchNavPrev.classList.add('touch_prev');
			touchNavNext.classList.add('touch_next');
	
			touchNavPrev.innerText = "prev"
			touchNavNext.innerText = "next"
			
			this.touchNav.append(touchNavPrev, touchNavNext)
			e.target.closest('.dropObj').append(this.touchNav);
		}

		// if(this.eventState.navCompare){
			let touchButton = this.touchNav.querySelectorAll('[class^=touch_]');
			touchButton.forEach(element => {
				element.addEventListener('touchstart', (e) => {this.touchMove(e)});
			});
		// }
	}

	changeElement(targetItem, changeItem) {
		
		let cgSaveBox = changeItem.closest('.dropObj');
		let tgSaveBox = targetItem.closest('.dropObj');

		cgSaveBox.append(targetItem);
		tgSaveBox.append(changeItem);
	}

	init(e){
		// let scrollSave = e.target.closest('.dragObj').querySelector('.cont')
		// console.log(scrollSave.scrollTop)
		// e.target.closest('.dragObj')
		// let cloneScroll = this.currentclone.querySelector('.cont').scrollTop;
		// let itemScroll = this.currentclone.querySelector('.cont').scrollTop;
		// cloneScroll = itemScroll;
		for (let i = 0; i < this.dragItemsCont.length; i++) {
			this.dragItemsCont[i].closest('.dragObj').setAttribute("style","");
		}
		if(this.eventState.clickCompare){

			this.currentclone.remove();
			// default
			this.currentItem = null
			this.currentclone = null
			this.droppableBelow = null
			this.futureItem = null
			this.shiftX = null

			this.eventState.clickCompare = false;
			this.eventState.moveCompare = false;
			
			this.dragItemsCont.forEach(element => {
				element.removeEventListener("mousedown", this.dragMouseDown)
			});
			
			window.removeEventListener("mouseup", this.dragMouseUp)
			this.wrap.removeEventListener("mousemove", this.dragMouseMove)
		}

		if(this.eventState.touchCompare){
			this.result = 0;
			this.longTouch = 0;
			this.eventState.touchCompare = false;
			this.eventState.navCompare = false;
			this.eventState.scrollCompare = false;
			this.touchNav.remove();
			this.dragItemsCont.forEach(element => {
				element.removeEventListener('touchstart', this.touchStart)
			})
			window.removeEventListener('touchend', this.touchEnd);

			for(let i = 0; i < this.touchItems.length; i++){
				this.touchItems[i].classList.remove('select');
			}

		}
		window.removeEventListener("scroll", this.scrollSticky);
	}

	get _return(){
		let obj = {
			target : this.dragItems,
			index :  this.dragItems.length,
			pin : this.pin,
			fixObjIndex : this.dragItems,
			fixObj : this.fixedItem,
			deviceType : this.TYPE_DEVICE ? 'iPad & tablet' : 'Desktop'
		}
		return obj
	}

	callBack(callBack){
		if(callBack){
			callBack();
		}
	}

}
