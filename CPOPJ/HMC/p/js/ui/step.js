const selectStep = (callback) => {
	window.onbeforeunload = () => window.scrollTo(0, 0)
	
	// Element
	const wrap= document.getElementById('stepSelect');
	const itemSibling= wrap.querySelectorAll(".question_item");
	const nextButton= wrap.querySelectorAll(".nextButton");
	const radioElement= wrap.querySelectorAll('input[type="radio"]');
	const inputElement= wrap.querySelectorAll('[class^="inp_type"] input');
	const textareaElement = wrap.querySelectorAll('textarea');

	const scrollWrap = wrap.querySelector('.question');

	let viewArea = null;
	let _this = null;
	let _target = null;
	let _sibling = null;
	let _button = null;
	let idx = 0;
	let scrolly = 0;
	let x = 0;
	let SwichObj = {
		enter : false, 
	};

	wrap.addEventListener('wheel', preventScroll, {passive: false});

	function radioIdCheck(keyWord, _this){ return _this.getAttribute("id").search(keyWord)}
	

	radioElement.forEach(el => {el.addEventListener('click', clickOrTouch);})
	nextButton.forEach(el => {el.addEventListener('click', nextBtnClick);})
	inputElement.forEach(el => {el.addEventListener('keydown', keydown);})
	textareaElement.forEach(el => {el.addEventListener('keydown', keydown);})
	
	function  preventScroll(e){
		e.preventDefault();
		e.stopPropagation(); 
		return false;
	}

	function clickOrTouch(e){
		viewArea = e.target.closest('.question_item').querySelector('.viewForm');
		if(radioIdCheck('yes', e.target) == 0){
			evtHeight = e.target.closest('.question_item').scrollHeight;
			viewArea.setAttribute('data-view', 'true');
		}else if(radioIdCheck('no', e.target) == 0){
			viewArea.setAttribute('data-view', 'false');
			evtHeight = e.target.closest('.question_item').scrollHeight;
			if(viewArea.getAttribute('data-view') == 'false'){nextStep(e, evtHeight);}
		}
	}

	function nextBtnClick(e){
		evtHeight = e.target.closest('.question_item').scrollHeight
		if(e.type == 'click' && e.target.getAttribute('type') == 'button'){
			nextStep(e, evtHeight);
		}
	}

	function keydown(e){
		evtHeight = e.target.closest('.question_item').scrollHeight
		_this = e.target;
		_button = e.target.closest('.question_item').querySelector('button');

		if(e.keyCode !== 13){
			SwichObj.enter = true;
			if(_this.getAttribute('data-num')){
				_this.value = numberWithCommas(chkNumber(_this.value))
			}
		}
		
		if( _this.value.length > 0){
			_button.removeAttribute('disabled');
			if(e.keyCode === 13 && SwichObj.enter){
				if(_this.getAttribute('data-num')){
					_this.value = numberWithCommas(chkNumber(_this.value))
					nextStep(e, evtHeight);
				}else {
					nextStep(e, evtHeight);
				}
			}
		}else if( _this.value.length == 0){
			_button.setAttribute('disabled', "");
		}
	}
	function nextStep (e, evtHeight){
		++idx;
		if(idx < itemSibling.length){
			_this = e.target;
			_button = _this.closest('.question_item').querySelector('button');
			_button.setAttribute('disabled', "");
			_this.setAttribute('disabled', "");
			_target = _this.closest('.question_item');
			_sibling = itemSibling[idx];
	
			_target.classList.remove('active');
			_sibling.classList.add('active');
			focus(e, evtHeight);
		}else if(idx == itemSibling.length){
			console.log("end")
			init(callback);
		}

		SwichObj.enter = false;
	}

	function focus(e, evtHeight){
		scrolly = evtHeight + 180;
		x -= scrolly
		scrollWrap.style.top = x + 'px'
	}

	function init (callBack){
		if(callBack){
			callBack(this);
		}
		viewArea = null;
		_this = null;
		_target = null;
		_sibling = null;
		_button = null;
		idx = 0;

		return false
	}
}


class test{
	constructor(option){
		window.onbeforeunload = () => window.scrollTo(0, 0)
		this.option = option;
		this.viewArea = null
		this._this = null
		this._target = null
		this._sibling = null
		this._button = null
		this.idIndex = 0
		this.scrolly = 0
		this.x = 0
		this.enter = false
		this.setting()
	}

	setting(){
		if(this.option.callBack){
			this.option.callBack();
		}
		// start();
	}
}