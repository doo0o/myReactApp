// class SelectStep{
// 	constructor(callBack){
// 		window.onbeforeunload = () => window.scrollTo(0, 0)
// 		// Element
// 		this.wrap = document.getElementById('stepSelect')
// 		this.itemSibling = document.querySelectorAll(".question__item")
// 		this.nextButton = document.querySelectorAll(".nextButton")
// 		this.radioElement = document.querySelectorAll('input[type="radio"]')
// 		this.inputElement = document.querySelectorAll('[class^="inp_type"] input')


// 		this.answer = false
// 		this.target = null
// 		this.sibling = null
// 		this.idx = 0

// 		let radioIdCheck = (keyWord, _this) => { return _this.getAttribute("id").search(keyWord)}

// 		this.callBack = callBack

// 	}

// 	eventStart(){
// 		let nextBtnClick = (_this) => { this.nextStep(_this); }
// 		let clickOrTouch = (_this) => { this.nextStep(_this); }
// 		let keyDown = (_this,e) => { this.nextStep(_this,e); }
// 		function eventThis(e){
// 			let _this = this; // event target
// 			if(e.type == 'keydown' && e.target.classList.contains('type_nc')){
// 				_this.value = _this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'); // 숫자만
// 				if( _this.value.length > 0){
// 					_this.closest('.question__item').querySelector('button').removeAttribute('disabled');
// 					if(e.keyCode === 13){
// 						keyDown(_this ,e);
// 					}
// 				}else if( _this.value.length == 0){
// 					_this.closest('.question__item').querySelector('button').setAttribute('disabled', "");
// 				}
// 			}

// 			if(e.type == 'click' && e.target.getAttribute('type') == 'radio'){
// 				clickOrTouch(_this);
// 			}else if(e.type == 'click' && e.target.getAttribute('type') == 'button'){
// 				nextBtnClick(_this);
// 			}
			
// 		}


// 		this.wrap.addEventListener('wheel', this.preventScroll, {passive: false});
// 		this.radioElement.forEach(el => {el.addEventListener('click', eventThis);})
// 		this.nextButton.forEach(el => {el.addEventListener('click', eventThis);})
// 		this.inputElement.forEach(el => {el.addEventListener('keydown', eventThis);})	
// 	}

// 	preventScroll(e){
// 		e.preventDefault();
// 		e.stopPropagation(); 
// 		return false;
// 	}

	

// 	nextStep(_this,e){
// 		this.inputElement.forEach(el => {el.removeEventListener('keydown', this.eventStart.eventThis,false)})
// 		if(e.type === "keyDown"){
// 			if(e.keyCode === 13){
// 				_this.closest('.question__item').querySelector('button').setAttribute('disabled', "");
// 				_this.setAttribute('readonly', "");
// 			}
// 		}
		
// 		this.target = _this.closest('.question__item');
// 		this.sibling = this.itemSibling[this.idx];

// 		this.target.classList.remove('active');
// 		this.sibling.classList.add('active');
// 		this.focus();
// 		this.init();
// 	}

// 	focus(){
// 		++this.idx;
// 		this.itemSibling[this.idx].scrollIntoView({block: 'center',behavior: 'smooth'})
// 	}

// 	init(){
// 		this.radioElement.forEach(el => {el.removeEventListener('click', this.eventStart.eventThis,false)})
// 		this.nextButton.forEach(el => {el.removeEventListener('click', this.eventStart.eventThis,false)})
// 		this.inputElement.forEach(el => {el.removeEventListener('keydown', this.eventStart.eventThis,false)})

// 		return false
// 	}
// }


const selectStep = (callback) => {
	window.onbeforeunload = () => window.scrollTo(0, 0)
		// Element
	const wrap= document.getElementById('stepSelect')
	const itemSibling= wrap.querySelectorAll(".question__item");
	const nextButton= wrap.querySelectorAll(".nextButton");
	const radioElement= wrap.querySelectorAll('input[type="radio"]');
	const inputElement= wrap.querySelectorAll('[class^="inp_type"] input');
	const textareaElement = wrap.querySelectorAll('textarea');

	let viewArea = null;
	let _this = null;
	let _target= null;
	let _sibling= null;
	let idx= 0;

	let SwichObj = {
		enter : false,
	}


	wrap.addEventListener('wheel', preventScroll, {passive: false});

	function radioIdCheck(keyWord, _this){ return _this.getAttribute("id").search(keyWord)}
	

	radioElement.forEach(el => {el.addEventListener('click', clickOrTouch);})
	nextButton.forEach(el => {el.addEventListener('click', nextBtnClick);})
	inputElement.forEach(el => {el.addEventListener('keydown', keydown);})
	textareaElement.forEach(el => {el.addEventListener('keydown', keydown);})

	
	function clickOrTouch(e){
		if(radioIdCheck('yes', e.target) == 0){
			viewArea = e.target.closest('.question__item').querySelector('.viewForm');
			viewArea.setAttribute('data-view', 'true');
		}else if(radioIdCheck('no', e.target) == 0){
			nextStep();
		}
	}

	function nextBtnClick(e){
		if(e.type == 'click' && e.target.getAttribute('type') == 'button'){
			nextStep(e);
		}
	}

	function keydown(e){
		_this = e.target;
		const _button = _this.closest('.question__item').querySelector('button');
		if(e.keyCode !== 13){
			SwichObj.enter = true;
		}
		
		if(_this.getAttribute('data-num')){
			_this.value = _this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
		}

		if( _this.value.length > 0){
			_button.removeAttribute('disabled');

			if(e.keyCode === 13){
				_button.setAttribute('disabled', "");
				if(SwichObj.enter){
					if(SwichObj.enter) nextStep(e);
				}
			}
		}else if( _this.value.length == 0){
			_button.setAttribute('disabled', "");
		}
	}

	function  preventScroll(e){
		e.preventDefault();
		e.stopPropagation(); 
		return false;
	}

	function nextStep (e){
		++idx;
		_target = _this.closest('.question__item');
		_sibling = itemSibling[idx];

		_target.classList.remove('active');
		_sibling.classList.add('active');

		focus();
		init();
	}

	function focus (){
		// itemSibling[idx].scrollIntoView({block: 'center',behavior: 'smooth'})
	}

	function init (){
		SwichObj.enter = false;
		return false
	}
}