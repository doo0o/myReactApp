
/** 
 * 슬라이드 open close toggle 기능
 * @param {Element} el 엘리먼트
 * @param {Number} time 시간
 * @param {String} cls 슬라이드 후 적용 클래스
 * @param {Function} callBack 슬라이드 후 콜백 설정
 */
const slide = {
	open : (el, time, cls, callBack) => {
		let wrap = el;
		let wrapH = 0;
		wrap.style.position = 'absolute';
		wrap.style.display = 'block';
		wrap.style.opacity = '0';
		wrapH = wrap.clientHeight;
		wrap.style.opacity = null;
		wrap.style.position = null;
		wrap.style.overflow = 'hidden';
		wrap.style.height = '0';
		wrap.style.transition = `height ${time * 0.001}s`;
		setTimeout(() => {
			wrap.style.height = wrapH + 'px';
		},10);
		setTimeout(() => {
			wrap.style.display = null;
			wrap.style.overflow = null;
			wrap.style.height = null;
			wrap.style.transition = null;
			if(cls) wrap.classList.add(cls);
			if(callBack) callBack();
		},time);
	},
	close : (el, time, cls, callBack) => {
		let wrap = el;
		let wrapH = el.clientHeight;
		wrap.style.overflow = 'hidden';
		wrap.style.height = `${wrapH}px`;
		wrap.style.transition = `height ${time * 0.001}s`;
		setTimeout(() => {
			wrap.style.height = '0';
		},10);
		setTimeout(() => {
			wrap.style.overflow = null;
			wrap.style.height = null;
			wrap.style.transition = null;
			if(cls) wrap.classList.remove(cls);
			if(callBack) callBack();
		},time);
	},
	toggle : (el, time, cls, callBack) => {
		(el.classList.contains(cls)) ? slide.close(el, time, cls, callBack) : slide.open(el, time, cls, callBack);
	}
}

function toggle(){
	const toggleBtn = document.querySelectorAll('.js_toggle');
	toggleBtn.forEach((btn) => {
		btn.addEventListener('click', function(){
			slide.toggle(this.closest('.cont').querySelector('.group'), 500, 'on');
			if(this.closest('.cont').querySelector('.group').classList.contains('on')){
				this.closest('.cont').classList.remove('on')
			} else {
				this.closest('.cont').classList.add('on')
			}
		});
	});
}

// 천단위 콤마 (소수점포함)
function numberWithCommas(num) {
	var parts = num.toString().split(".");
	return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}

// 숫자 체크(숫자 이외 값 모두 제거)
function chkNumber(num){
	var tmpValue = num.replace(/[^0-9,]/g,'');
	tmpValue = tmpValue.replace(/[,]/g,'');
	return tmpValue;
}

// 사업자번호 입력 시 3,2,5 - 추가
function businessNumber(num){
	var tmpValue = num.replace(/[^0-9,]/g,'');
	tmpValue = tmpValue.replace(/^(\d{3})(\d{2})(\d{5})$/, `$1-$2-$3`);
	return tmpValue;
}

// 법인등록번호 입력 시 - 추가
function corporateNumber(num){ 
	var tmpValue = num.replace(/[^0-9,]/g,'');
	tmpValue = tmpValue.replace(/^(\d{6})(\d{7})$/, `$1-$2`);
	return tmpValue;
}

/**
 * 엘리먼트가 화면에 나타날때 콜백
 * @param {String} el 타겟 엘리먼트 
 * @param {Function} callback 실행될 기능 작성
 */
 const createObserver = (el, callback) => {
	const target = document.querySelectorAll(el);
	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				if(callback) callback()
			}
		});
	});
	target.forEach( _this => {
		observer.observe(_this);
	})
}

// DropDown
class DropDown {
	/**
	 * DropDown
	 * @param {Object} args el: 엘리먼트 or data-ref 속성 값, onChnage: 체인지 콜백 설정
	 * 
	 * const example = new DropDown({ 
	 * 	el: "example",
	 * 	onChange: (_this) => {
	 * 		console.log(_this)
	 * 	}
	 * });
	 * example.value 선택된 옵션 값
	 * example.active(3) 3번째 항목 체크
	 * example.reset() 옵션이 바뀔 경우 옵션 이벤트 재 설정
	 * example.listHide() 옵션 창 닫기
	 * 
	 * 체인지 콜백 설정
	 * example.onChange((_this) => { 
	 * 		console.log(_this)
	 * 	}
	 * })
	 */
	constructor(args) {
		(typeof args.el === 'string')
		? this.el = document.querySelector(`[data-ref="${args.el}"]`)
		: this.el = args.el;
		(args.onChange)
		? this.changeCallBack = args.onChange
		: this.changeCallBack = null;
		this.btn = this.el.querySelector('[data-ref="dropDownBtn"]');
		this.list = this.el.querySelector('[data-ref="dropDownList"]');
		this.items = this.list.querySelectorAll('input[type="radio"]');
		this.value = null;
		this.listHide = null;
		this.active = null;
		this.reset = null;
		this.init();
	}
	init() {
		const hideFunc = () => {

			slide.close(this.list, 300, 'isShow', ()=>{
				this.btn.setAttribute('aria-expanded', false);
			});
			window.removeEventListener('click', hide);
			window.removeEventListener('scroll', hide);
		}

		const hide = () => {
			if(event) {
				if(event.type === 'scroll') {
					hideFunc();
				} else if(event.type === 'click') {
					const chkBtn = event.target.closest('[data-ref="dropDownBtn"]');
					const chkList = event.target.closest('[data-ref="dropDownList"]');
					if(chkBtn != this.btn && chkList != this.list) {
						hideFunc();
					}
				} 
			}
		};
		
		this.btn.addEventListener('click', ()=>{
			this.listShow();
			this.btn.setAttribute('aria-expanded', true);
			window.addEventListener('click', hide);
			window.addEventListener('scroll', hide);
		});

		this.listHide = () => hideFunc();
		this.itemInit();
	}
	listShow() {
		let rect = this.el.getBoundingClientRect();
		this.list.style.width = `${rect.width}px`;
		this.list.style.top = `${rect.top}px`;
		this.list.style.left = `${rect.left}px`;
		this.list.style.zIndex = '10';

		slide.open(this.list, 300, 'isShow');
	}
	itemInit() {
		const chkFunc = idx => {
			let target = null;
			if(typeof idx === 'number') {
				target = this.items[idx];
				this.items[idx].checked = true;
			} else {
				target = event.target;
			}
			this.btn.innerText = target.parentNode.innerText;
			if(target.value) this.value = target.value;
			if(this.changeCallBack) this.changeCallBack(this);
			this.listHide();
		}
		this.items.forEach(item => item.addEventListener('click', chkFunc))

		const resetEvent = () => {
			this.items.forEach(item => item.removeEventListener('click', chkFunc));
			this.items.forEach(item => item.addEventListener('click', chkFunc))
		}
		this.active = idx => chkFunc(idx);
		this.reset = () => resetEvent();
	}
	onChange(callBack) {
		this.changeCallBack = callBack;
	}
}

// 스크롤 임시
class MakeScroll {
	constructor(el) {
		this.wrap = (typeof el === 'string') ? document.querySelector(el) : el;
		this.padding = 0;
		this.scrollBar = null;
		this.scrollBarTrackY = null;
		this.scrollBarThumbY = null;
		this.scrollBarTrackX = null;
		this.scrollBarThumbX = null;
		this.restNumX = 0;
		this.restNumY = 0;
		this.target = (this.wrap == window) ? document.body : this.wrap;
		this.parent = (this.wrap.tagName == 'TEXTAREA') ? this.wrap.parentNode : null;
		this.init();
		this.mutationChk = new MutationObserver(() => {
			if(this.scrollBar) this.reset();
		})
		this.resizeChk = new ResizeObserver(() => {
			if(this.scrollBar) this.reset();
		})
		this.mutationChk.observe(this.target, {
			childList: true,
			subtree: true
		});
		for (const child of this.target.children) {
			this.resizeChk.observe(child);
		}
		if(this.wrap == window) window.addEventListener('resize',()=>this.reset());
	}
	thumbHeight() {
		let result = (this.wrap == window)
			? (window.innerHeight * ((window.innerHeight / document.body.scrollHeight) * 100) / 100) - this.padding
			: (this.wrap.clientHeight * ((this.wrap.clientHeight / this.wrap.scrollHeight) * 100) / 100) - this.padding;

		if(result < 20) {
			this.restNumY = 20 - result;
			result = 20;
		} else {
			this.restNumY = 0;
		}
		return result;
	}
	thumbWidth() {
		let result = (this.wrap == window)
			? (window.innerWidth * ((window.innerWidth / document.body.scrollWidth) * 100) / 100) - this.padding
			:	(this.wrap.clientWidth * ((this.wrap.clientWidth / this.wrap.scrollWidth) * 100) / 100) - this.padding;

		if(result < 20) {
			this.restNumX = 20 - result;
			result = 20;
		} else {
			this.restNumX = 0;
		}
		return result;
	}
	thumbTop() {
		return (this.wrap == window)
			? (window.innerHeight - this.restNumY) * ((window.scrollY / document.body.scrollHeight) * 100) / 100
			: (this.wrap.clientHeight - this.restNumY) * ((this.wrap.scrollTop / this.wrap.scrollHeight) * 100) / 100;
	}
	thumbLeft() {
		return (this.wrap == window)
			?	(window.innerWidth - this.restNumX) * ((window.scrollX / document.body.scrollWidth) * 100) / 100
			: (this.wrap.clientWidth - this.restNumX) * ((this.wrap.scrollLeft / this.wrap.scrollWidth) * 100) / 100;
	}
	scrollBarPos() {
		if(this.wrap == window) {
			this.scrollBar.style.cssText = `position:fixed;right:${this.padding / 2}px;bottom:${this.padding / 2}px;z-index:10;`
		} else {
			if(this.parent) {
				this.scrollBar.style.top = this.parent.clientHeight - (this.padding / 2) + 'px';
				this.scrollBar.style.left = this.parent.clientWidth - (this.padding / 2) + 'px';
			} else {
				this.scrollBar.style.top = (this.wrap.scrollTop + this.wrap.clientHeight) - (this.padding / 2) + 'px';
				this.scrollBar.style.left = (this.wrap.scrollLeft + this.wrap.clientWidth) - (this.padding / 2) + 'px';
			}
		}
	}
	scrollThumbPos() {
		this.scrollBarThumbY.style.height = `${this.thumbHeight()}px`;
		this.scrollBarThumbX.style.width = `${this.thumbWidth()}px`;
		this.scrollBarThumbY.style.top = `${this.thumbTop()}px`;
		this.scrollBarThumbX.style.left = `${this.thumbLeft()}px`;
	}
	scrollTrack() {
		this.scrollBarTrackY.style.height = `${this.target.clientHeight - this.padding}px`;
		this.scrollBarTrackX.style.width = `${this.target.clientWidth - this.padding}px`;
	}
	stateFunc() {
		if(this.wrap == window) {
			(document.body.scrollHeight > window.innerHeight)
				? this.scrollBarTrackY.style.display = null
				: this.scrollBarTrackY.style.display = 'none';
			(document.body.scrollWidth > window.innerWidth)
				? this.scrollBarTrackX.style.display = null
				: this.scrollBarTrackX.style.display = 'none';
		} else {
			(this.wrap.scrollHeight > this.wrap.clientHeight)
				? this.scrollBarTrackY.style.display = null
				: this.scrollBarTrackY.style.display = 'none';
			(this.wrap.scrollWidth > this.wrap.clientWidth)
				? this.scrollBarTrackX.style.display = null
				: this.scrollBarTrackX.style.display = 'none';
		}
	}
	createScroll() {
		this.scrollBar = document.createElement('span');
		this.scrollBar.classList.add('scrollBar');
		if(this.wrap == window) {
			this.target.append(this.scrollBar);
		} else {
			(this.parent) ? this.parent.append(this.scrollBar) : this.target.append(this.scrollBar);
		}

		this.scrollBarTrackY = document.createElement('span');
		this.scrollBarTrackY.classList.add('scrollBarTrackY');
		this.scrollBarThumbY = document.createElement('span');
		this.scrollBarThumbY.classList.add('scrollBarThumb');
		this.scrollBar.append(this.scrollBarTrackY);
		this.scrollBarTrackY.append(this.scrollBarThumbY);

		let deltaY = 0;
		let moveY = (this.wrap == window) ? window.scrollY : this.wrap.scrollTop;
		const moveFuncY = () => {
			const range = event.clientY - deltaY;
			if(this.wrap == window) {
				window.scrollTo({top: moveY + (range * (document.body.scrollHeight / window.innerHeight))});
			} else {
				this.wrap.scrollTop = moveY + (range * (this.wrap.scrollHeight / this.wrap.clientHeight));
			}
		}
		const upFuncY = () => {
			moveY = (this.wrap == window) ? window.scrollY : this.wrap.scrollTop;
			window.removeEventListener('mousemove', moveFuncY);
			window.removeEventListener('mouseup', upFuncY);
		}
		const downFuncY = () => {
			deltaY = event.clientY;
			moveY = (this.wrap == window) ? window.scrollY : this.wrap.scrollTop;
			window.addEventListener('mousemove', moveFuncY);
			window.addEventListener('mouseup', upFuncY);
			this.target.addEventListener('dragstart', event.preventDefault());
			this.target.addEventListener('selectstart', event.preventDefault());
		}
		this.scrollBarThumbY.addEventListener('mousedown', downFuncY);

		this.scrollBarTrackX = document.createElement('span');
		this.scrollBarTrackX.classList.add('scrollBarTrackX');
		this.scrollBarThumbX = document.createElement('span');
		this.scrollBarThumbX.classList.add('scrollBarThumb');
		this.scrollBar.append(this.scrollBarTrackX);
		this.scrollBarTrackX.append(this.scrollBarThumbX);

		let deltaX = 0;
		let moveX = (this.wrap == window) ? window.scrollX : this.wrap.scrollLeft;
		const moveFuncX = () => {
			const range = event.clientX - deltaX;
			if(this.wrap == window) {
				window.scrollTo({left: moveX + (range * (document.body.scrollWidth / window.innerWidth))});
			} else {
				this.wrap.scrollLeft = moveX + (range * (this.wrap.scrollWidth / this.wrap.clientWidth));
			}
		}
		const upFuncX = () => {
			moveX = (this.wrap == window) ? window.scrollX : this.wrap.scrollLeft;
			window.removeEventListener('mousemove', moveFuncX);
			window.removeEventListener('mouseup', upFuncX);
		}
		const downFuncX = () => {
			deltaX = event.clientX;
			moveX = (this.wrap == window) ? window.scrollX : this.wrap.scrollLeft;
			window.addEventListener('mousemove', moveFuncX);
			window.addEventListener('mouseup', upFuncX);
			this.target.addEventListener('dragstart', event.preventDefault());
			this.target.addEventListener('selectstart', event.preventDefault());
		}
		this.scrollBarThumbX.addEventListener('mousedown', downFuncX);

		this.scrollBarPos();
		this.scrollThumbPos();
		this.scrollTrack();
		this.stateFunc();
	}
	removeScroll() {
		this.scrollBar.remove();
		this.mutationChk.disconnect(this.target);
		this.resizeChk.disconnect(this.target);
		for (const child of this.target.children) {
			this.resizeChk.disconnect(child);
		}
	}
	reset() {
		this.scrollBar.style.display = 'none';
		this.scrollBarPos();
		this.scrollThumbPos();
		this.scrollTrack();
		this.stateFunc();
		this.scrollBar.style.display = null;
	}
	init() {
		this.createScroll();
		this.wrap.addEventListener('scroll', ()=>{
			this.scrollBarPos();
			this.scrollThumbPos();
			this.stateFunc();
		})
	}
}

const dropDown = (arg) => {
	const reset = (arg && arg.reset == false) ? false : true;
	const btn = event.target;
	const wrap = btn.closest('[data-ref="select"]');
	const wrapRect = wrap.getBoundingClientRect();
	const list = wrap.querySelector('[data-ref="dropDownList"]');
	const items = list.querySelectorAll('label, button');
	const scrollWrap = (btn.closest('.inner_view')) ? btn.closest('.inner_view') : null;

	const chkFunc = () => {
		const target = event.target;
		if(target.tagName !== 'INPUT' && event.type === 'click') {
			btn.innerText = target.innerText;
			hideSelf();
			for(let idx = 0 ; idx < items.length ; idx++) {
				if(reset == true && target.closest('label, button') === items[idx]) {
					(idx !== 0) ? wrap.classList.add('isSelected') : wrap.classList.remove('isSelected');
					break;
				}
			}
		} else if(event.type === 'keyup' && target.tagName === 'INPUT' && event.keyCode === 13) {
			btn.innerText = target.parentNode.innerText;
			hideSelf();
			for(let idx = 0 ; idx < items.length ; idx++) {
				if(reset == true && target.closest('label, button') === items[idx]) {
					(idx !== 0) ? wrap.classList.add('isSelected') : wrap.classList.remove('isSelected');
					break;
				}
			}
		}
	}
	const hideSelf = () => hideFunc(true);

	const hideFunc = (state) => { 
		const chkWrap = event.target.closest('[data-ref="select"]');
		if(state == true || chkWrap != wrap) {
			items.forEach(item => {
				item.removeEventListener('click', chkFunc);
				item.removeEventListener('keyup', chkFunc);
			});
			btn.setAttribute('aria-expanded', false);
			slide.close(list, 300, 'isShow');
			window.removeEventListener('click', hideFunc);
			btn.removeEventListener('click', hideSelf);
		}
	}

	if(btn.getAttribute('aria-expanded') == 'false') {
		let relNum = (scrollWrap) ? scrollWrap.scrollHeight : window.innerHeight;
		let wrapPos = (scrollWrap) ? wrapRect.top + wrapRect.height - scrollWrap.getBoundingClientRect().top + scrollWrap.scrollTop : wrapRect.top + wrapRect.height;
		list.style.display = 'block';
		wrapPos += list.offsetHeight;
		list.style.display = null;

		(relNum < wrapPos) ? list.classList.add('isBot') : list.classList.remove('isBot')
		
		items.forEach(item => {
			item.addEventListener('click', chkFunc);
			item.addEventListener('keyup', chkFunc);
		});
		btn.setAttribute('aria-expanded', true);
		slide.open(list, 300, 'isShow');
		
		window.addEventListener('click', hideFunc);
		btn.addEventListener('click', hideSelf);
	}
}

const inputFunc = () => {
	const wrap = event.target.closest('[class^="inbox_type"], .inbox_line');
	const txt = wrap.querySelectorAll('input.txt');
	const del = wrap.querySelectorAll('.btn_delete');

	const removeEvent = () => {
		txt.forEach(input => input.removeEventListener('keyup', keyUpFunc));
		del.forEach(btn => btn.removeEventListener('click', delValue));
		window.removeEventListener('click', outFunc);
		window.removeEventListener('keyup', chkFunc);
	}
	const keyUpFunc = () => {
		const _this = event.target;
		(_this.value.length > 0) 
		? _this.classList.add('delete_on')
		: _this.classList.remove('delete_on');
		if(_this.classList.contains('type_tel')) _this.value = chkNumber(_this.value);
		if(_this.classList.contains('type_business')) _this.value = businessNumber(_this.value);
		if(_this.classList.contains('type_corporate')) _this.value = corporateNumber(_this.value);
		if(_this.classList.contains('type_nc')) _this.value = numberWithCommas(chkNumber(_this.value));
	}
	const delValue = () => {
		const _this = event.target;

		del.forEach((btn, idx)=>{
			if(btn == _this) {
				txt[idx].value = null;
				txt[idx].classList.remove('delete_on');
				txt[idx].focus();
			}
		});
	}
	const initFunc = () => {
		wrap.classList.add('on');
		txt.forEach(input => input.addEventListener('keyup', keyUpFunc));
		del.forEach(btn => btn.addEventListener('click', delValue));
	}
	const outFunc = () => {
		const chkWrap = event.target.closest('[class^="inbox_type"], .inbox_line');
		let valLengChk = 0;
		if(wrap != chkWrap) {
			txt.forEach(input => {
				input.classList.remove('delete_on');
				valLengChk += input.value.length;
			});
			if(valLengChk == 0) wrap.classList.remove('on');
			wrap.classList.remove('focus');
			removeEvent();
		}
	}
	const chkFunc = () => {
		if(wrap != event.target.closest('[class^="inbox_type"], .inbox_line')) outFunc();
	}
	if(!wrap.classList.contains('focus') && txt[0].disabled === false && txt[0].readOnly === false) {
		initFunc();
		txt[0].focus();
		txt.forEach(input => {
			if(input.value.length > 0) input.classList.add('delete_on');
		});
		wrap.classList.add('focus');
		window.addEventListener('click', outFunc);
		window.addEventListener('keyup', chkFunc);
	}
}

const textareaFunc = () => {
	const wrap = event.target.closest('.textarea');
	const textarea = wrap.querySelector('textarea');
	const number = wrap.querySelector('.txt_check .first');
	const outFunc = () => {
		const chkWrap = event.target.closest('.textarea');
		if(wrap != chkWrap) {
			wrap.classList.remove('focus');
			textarea.removeEventListener('keyup', valueChk);
			window.removeEventListener('click', outFunc);
			window.removeEventListener('keyup', chkFunc);
		}
	}
	const chkFunc = () => {
		if(wrap != event.target.closest('.textarea')) outFunc();
	}
	const valueChk = () => {
		number.innerText = textarea.value.length;
	}

	if(!wrap.classList.contains('focus') && textarea.disabled === false && textarea.readOnly === false) {
		textarea.addEventListener('keyup', valueChk);
		textarea.focus();
		wrap.classList.add('focus');
		window.addEventListener('click', outFunc);
		window.addEventListener('keyup', chkFunc);
	}
}

const popupOpen = id => {
	const btnOpen = (event.target !== document) ? event.target : null;
	const popup = document.querySelector(`#${id}`);
	const btnClose = popup.querySelectorAll('.pop_close');
	document.querySelector('html').classList.add('scroll_hidden');
	popup.classList.add('active');
	if(!popup.dataset.initState) {
		popup.setAttribute('tabindex', 0);
		btnClose.forEach(btn => {
			btn.addEventListener('keydown', () => {
				if(!event.shiftKey && event.key === 'Tab') popup.focus();
			});
			btn.addEventListener('click', () => {
				popupClose(id);
				if(btnOpen) btnOpen.focus();
			});
		});
		popup.addEventListener('keydown', () => {
			if(event.target == popup && event.shiftKey && event.key === 'Tab') btnClose[btnClose.length - 1].focus();
		});
		popup.dataset.initState = true;
	}
	popup.focus();
}

const popupClose = id => {
	const popup = document.querySelector(`#${id}`);
	document.querySelector('html').classList.remove('scroll_hidden');
	popup.classList.remove('active');
}

const popupToast = (id, msg) => {
	const popup = document.querySelector(`#${id}`);
	const txt = popup.querySelector('.txt');
	txt.innerText = msg;
	popup.classList.add('active');
	setTimeout(()=>{
		popup.classList.remove('active');
	}, 1000);
}

class TabContents {
	constructor(ref) {
		this.current = null;
		this.wrap = document.querySelector(`[data-ref="${ref}"]`);
		this.menu = this.wrap.querySelector('[role="tablist"]');
		this.btn = this.menu.querySelectorAll('[role="tab"]');
		this.initFunc();
	}
	initFunc() {
		for(let idx = 0; idx < this.btn.length ; idx++) {
			if(this.btn[idx].getAttribute('aria-selected') == 'true') {
				this.current = this.btn[idx].getAttribute('aria-controls');
				if(this.wrap.querySelector(`#${this.current}`)) this.wrap.querySelector(`#${this.current}`).classList.add('active');
				break;
			}
		}
		this.addEvent();
	}
	addEvent() {
		const tabActive = e =>{
			const _this = e.target;
			const target = _this.getAttribute('aria-controls');
			this.active(target);
		}
		for(let idx = 0; idx < this.btn.length ; idx++) {
			this.btn[idx].addEventListener('click', tabActive);
		}
	}
	active(target) {
		for(let idx = 0; idx < this.btn.length ; idx++) {
			this.btn[idx].parentNode.classList.remove('on');
			this.btn[idx].ariaSelected = false;
			if(this.btn[idx].getAttribute('aria-controls') === target) {
				this.btn[idx].parentNode.classList.add('on');
				this.btn[idx].ariaSelected = true;
				if(this.wrap.querySelector(`#${this.current}`)) this.wrap.querySelector(`#${this.current}`).classList.remove('active');
				this.current = target;
				if(this.wrap.querySelector(`#${target}`)) this.wrap.querySelector(`#${target}`).classList.add('active');
			}
		}
	}
}
class UspGallery {
	constructor(target) {
		this.wrap = document.querySelector(`[data-ref='${target}']`);
		this.main = this.wrap.querySelector("[data-ref='uspGalleryMainImg']");
		this.itemList = this.wrap.querySelector("[data-ref='uspGalleryItemList']");
		this.items = this.itemList.querySelectorAll(".item");
		this.current = this.wrap.querySelector("[data-ref='uspGalleryCurrent']");
		this.btnNavPrev = this.wrap.querySelector("[data-ref='uspGalleryPrev']");
		this.btnNavNext = this.wrap.querySelector("[data-ref='uspGalleryNext']");
		this.currentNum = 0;
		this.total = this.items.length;
		this.wrap.querySelector("[data-ref='uspGalleryTotal']").innerText = this.total;
		this.addEvent();
		if(this.items.length >= 22) {
			this.itemList.classList.add('col3')
		}
	}
	show() {this.wrap.classList.add("isShow")}
	hide() {this.wrap.classList.remove("isShow")}
	active(idx) {
		const img = this.items[idx].querySelector('img');
		this.items.forEach(_this => {_this.classList.remove('isSelected')});
		this.current.innerText = idx + 1;
		this.currentNum = idx;
		this.items[idx].classList.add('isSelected');
		this.main.querySelector('img').src = img.src;
	}
	addEvent() {
		this.items[this.currentNum].classList.add('isSelected');
		this.items.forEach((item, idx) => {
			item.addEventListener('click', ()=> {
				this.active(idx);
			})
		})
		this.btnNavPrev.addEventListener('click', ()=>{
			(this.currentNum != 0) ? this.active(this.currentNum - 1) : this.active(this.total - 1);
		})
		this.btnNavNext.addEventListener('click', ()=>{
			(this.currentNum != this.total - 1) ? this.active(this.currentNum + 1) : this.active(0);
		})
	}
}

/**
 * 숫자 증감 기능
 * @param {Object} param { start: 초기 값, total: 최종 값, time: 실행 초, callBack: 콜백 } <- 모두 필수
 */
 const numFunc = (param) => {
	let num = param.start;
	let timeCount = 0;
	const calcNum = (val, time) => {
		const result = val / (time * 60);
		return result;
	}
	let unit = (param.total > param.start && num < param.total) ? calcNum(param.total, param.time) : calcNum(param.start - param.total, param.time);
	let reqFunc;
	(reqFunc = () => {
		if(timeCount < param.time * 60) {
			if(param.total > param.start && num < param.total - unit) {
				num = num + unit;
			} else if(param.total < param.start && num > param.total + unit) {
				num = num - unit;
			}
			param.callBack(num);
			window.requestAnimationFrame(reqFunc);
			timeCount++;
		} else {
			window.cancelAnimationFrame(reqFunc);
			param.callBack(param.total);
		}
	})();
}

/**
 * 토글 박스 컨텐츠 기능
 * @param {string} param 'all' 일 경우 전체 토글 기능
 */
 const toggleBox = (param) => {
	const _this = event.target;
	let wrap;
	let toggleBoxOpen;
	let toggleBoxClose;
	let items;
	if(param === 'all') {
		wrap = _this.closest('[data-ref="toggleBoxWrap"]');
		items = wrap.querySelectorAll('[data-ref="toggleBox"]');
		_this.classList.toggle('isShow');

		if(_this.classList.contains('isShow')) {
			items.forEach(ele => {
				if(!ele.classList.contains('isShow')) ele.classList.add('isShow');
			});
		} else {
			items.forEach(ele => {
				if(ele.classList.contains('isShow')) ele.classList.remove('isShow');
			});
		}
	} else if(param === 'allClose') {
		wrap = _this.closest('[data-ref="toggleBoxWrap"]');
		items = wrap.querySelectorAll('[data-ref="toggleBox"]');
		toggleBoxOpen = wrap.querySelector('[data-ref="toggleBoxOpen"]');
		toggleBoxOpen.classList.remove('on');
		_this.classList.add('on');
		items.forEach(ele => {
			if(ele.classList.contains('isShow')) ele.classList.remove('isShow');
		});
	} else if(param === 'allOpen') {
		wrap = _this.closest('[data-ref="toggleBoxWrap"]');
		items = wrap.querySelectorAll('[data-ref="toggleBox"]');
		toggleBoxClose = wrap.querySelector('[data-ref="toggleBoxClose"]');
		toggleBoxClose.classList.remove('on');
		_this.classList.add('on');
		items.forEach(ele => {
			if(!ele.classList.contains('isShow')) ele.classList.add('isShow');
		});
	} else {
		const box = _this.closest('[data-ref="toggleBox"]');
		box.classList.toggle('isShow');
	}

	if(_this.closest('[data-ref="toggleBoxWrap"]')) {
		wrap = _this.closest('[data-ref="toggleBoxWrap"]');
		toggleBoxOpen = wrap.querySelector('[data-ref="toggleBoxOpen"]');
		toggleBoxClose = wrap.querySelector('[data-ref="toggleBoxClose"]');
		items = wrap.querySelectorAll('[data-ref="toggleBox"]');
		
		for(let idx = 0; idx < items.length; idx++) {
			if(items[idx].classList.contains('isShow')) {
				toggleBoxClose.classList.add('on');
				toggleBoxOpen.classList.remove('on');
			} else {
				toggleBoxClose.classList.remove('on');
				toggleBoxOpen.classList.add('on');
				break;
			}
		}
	}
}

/**
 * 스크롤 앵커 이동
 * @param {*} id 목표 아이디
 */
const anchorScroll = (id) => {
	const target = document.querySelector(id);
	const targetTop = target.getBoundingClientRect().top + window.scrollY - 70;
	numFunc({
		start: window.scrollY,
		total: targetTop,
		time: .5,
		callBack: val => {
			window.scrollTo(0, val);
		}
	})
}

//지역선택
class AreaSelect {
	constructor(arg) {
		this.el = document.querySelector(arg);
		this.wrap = this.el.closest('[data-ref="select"]');
		this.listWrap = this.wrap.querySelector('.com_select_list_inner');
		this.lists = [];
		this.state = null;
		this.value = null;
		this.sub = null;
		this.chkEl = null;
		this.subChkEl = null;
	}
	targetEl(param) {
		if(document.querySelector(param)) {
			this.btn = document.querySelector(param);
		}
	}
	returnTemp(arg) {
		const btn = document.createElement('button');
		btn.classList.add('com_select_item');
		btn.insertAdjacentHTML('beforeend', `<span>${arg.addrCdNm2 == "" ? "전체" : arg.addrCdNm2}</span>`);
		btn.dataset.value = arg.posNo;
		btn.addEventListener('click', ()=>{
			btn.classList.add('isChecked');
			if(this.chkEl !== null) this.chkEl.classList.remove('isChecked');
			this.chkEl = btn;
		})
		return btn;
	}
	createSubTemplate() {
		let template = `<span class="com_select" data-ref="select">
				<button
					class="com_select_btn"
					data-ref="dropDownBtn"
					aria-expanded="false"
					aria-controls="${this.el.getAttribute("id")}Sub"
					onclick="dropDown();"
				>
					선택하세요.
				</button>

				<span
					class="com_select_list"
					data-ref="dropDownList"
					id="${this.el.getAttribute("id")}Sub"
				>
					<span class="com_select_list_inner">
					</span>
				</span>
			</span>`
		return template;
	}
	subCreate(arry) {
		if(this.sub !== null) this.sub.remove();
		const firBtn = document.createElement('button');
		firBtn.classList.add('com_select_item');
		firBtn.insertAdjacentHTML('beforeend', `<span>선택하세요.</span>`);
		firBtn.addEventListener('click',()=>{
			if(this.subChkEl !== null) this.subChkEl.classList.remove('isChecked');
			this.subChkEl = null;
		})
		this.wrap.insertAdjacentHTML('afterend', this.createSubTemplate());

		const sub = document.querySelector(`#${this.el.getAttribute("id")}Sub`);
		this.sub = sub.closest('[data-ref="select"]');

		const list = sub.querySelector('.com_select_list_inner');
		list.insertAdjacentElement('beforeend', firBtn);
		
		for(let idx = 0 ; idx < arry.length; idx++) {
			const item = this.returnTemp(arry[idx]);
			item.addEventListener('click', ()=>{
				this.value = item.dataset.value;
				if(this.subChkEl !== null) this.subChkEl.classList.remove('isChecked');
				this.subChkEl = item;
			});
			list.insertAdjacentElement('beforeend', item);
		}
	}
	addFunc(idx, callBack) {
		this.lists[idx + 1].addEventListener('click', ()=>{
			callBack(this);
		});
	}
	create(data) {
		const firBtn = document.createElement('button');
		firBtn.classList.add('com_select_item');
		firBtn.insertAdjacentHTML('beforeend', `<span>선택하세요.</span>`);
		firBtn.addEventListener('click',()=>{
			if(this.sub !== null) this.sub.remove();
			if(this.chkEl !== null) this.chkEl.classList.remove('isChecked');
			this.chkEl = null;
		});
		this.listWrap.insertAdjacentElement('beforeend', firBtn);
		this.lists.push(firBtn);
		for(let idx = 0 ; idx < data.length; idx++) {
			const item = this.returnTemp(data[idx]);
			this.listWrap.insertAdjacentElement('beforeend', item);
			this.lists.push(item);
		}
	}
}

/**
 * json 샘플
 * @param {String} url json url
 * @param {Function} callBack 콜백 함수
 */
const sampleJson = (url, callBack) => {
	fetch(url, {
		method: 'GET',
	})
	.then(response => response.json())
	.then(data => {callBack(data)});
}

const swiperOptions = (target, type, option) => {
	const wrap = (typeof target === 'string') ? document.querySelector(target) : target;
	const itemLeng = wrap.querySelectorAll('.swiper-slide').length;
	if(type == 'type2' && itemLeng > 1) {
		let next = document.createElement('div');
		let prev = document.createElement('div');
		next.classList.add('swiper-button-next');
		prev.classList.add('swiper-button-prev');
		wrap.append(next, prev);
	}
	let result = {
		observer: true,
		observeParents: true,
		slidesPerView: 1,
		loop: true,
	}
	const page = {
		pagination : {
			el : (itemLeng > 1) ? wrap.querySelector('[class*="swiper-pagination"]') : null,
			clickable : true,
		}
	}
	const navi = {
		navigation: {
			nextEl: wrap.querySelector('.swiper-button-next'),
			prevEl: wrap.querySelector('.swiper-button-prev'),
		}
	}

	if(itemLeng > 1) {
		switch (type) {
			case 'type1' :
				result = {...result, ...page}
			break;
			case 'type2' :
				result = {...result, ...page, ...navi}
			break;
		}
	}
	if(option) {
		result = {...result, ...option}
	}
	return result
}

/**
 * 
 * @param {Object} customOpt = {
 *		 target,
 *		slidesPerView,
 *		spaceBetween,
 *		loop,
 *		pagination,
 *		navigation,
 * }
 * @returns {Object} _settingObj = {
		slidesPerView: _slidesPerView,
		spaceBetween: _spaceBetween,
		loop: _loop,
		pagination: _pagination,
		navigation: _navigation,
	};
 */
	const getSwiperOption = (customOpt) => {
		const _container = document.querySelector(customOpt.target);
		let slidesLeng = _container.querySelectorAll('.swiper-slide').length;
		let _loop = customOpt.loop;
		let _slidesPerView = customOpt.slidesPerView > 1 ? customOpt.slidesPerView : 1;
		let _pagination, _navigation, _spaceBetween, _settingObj;
		let _pagination_cls = customOpt.pagination_cls;
		let perGroup = slidesLeng == customOpt.addOption.slidesPerGroup && customOpt.addOption.hasOwnProperty('slidesPerGroup') ? true : false // true
		let perView = slidesLeng > _slidesPerView ? true : false;
		let _navigation_cls = customOpt.hasOwnProperty('navigation_cls') ? customOpt.navigation_cls: "type01";

		_settingObj = {
			slidesPerView: _slidesPerView,
			spaceBetween: _spaceBetween,
			loop: _loop,
			pagination: _pagination,
			navigation: _navigation,
			observer: true,
			observeParents: true,
		};
	
		slidesLeng = perGroup ? 1 : _container.querySelectorAll('.swiper-slide').length;
		if (slidesLeng > 1) {
			if (customOpt.pagination && customOpt.hasOwnProperty('pagination') && perView){
				let pagination_cls = `swiper-pagination${_pagination_cls}`;
				let pagination_el = document.createElement('div');
				pagination_el.classList.add(`${pagination_cls}`);
				_container.parentElement.append(pagination_el);
				_settingObj.pagination = {
					el: '.' + pagination_cls,
					clickable: true,
				};
			} else {
				delete _settingObj.pagination;
			}
	
			if (customOpt.navigation && customOpt.hasOwnProperty('navigation') && perView) {
				let next = document.createElement('div');
				let prev = document.createElement('div');
				next.classList.add('swiper-button-next');
				prev.classList.add('swiper-button-prev');
				next.classList.add(`${_navigation_cls}`);
				prev.classList.add(`${_navigation_cls}`);
				_container.append(next, prev);
				_settingObj.navigation = {
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev"
				};
			} else{
				delete _settingObj.navigation;
			}
			
			if (customOpt.hasOwnProperty('spaceBetween')) {
				_settingObj.spaceBetween = customOpt.spaceBetween;
			} else {
				delete _settingObj.spaceBetween;
			}
	
			if (customOpt.hasOwnProperty('loop')) {
				_settingObj.loop = customOpt.loop;
			} else {
				delete _settingObj.loop;
			}
			
			if(customOpt.hasOwnProperty('slidesPerView')){
				_settingObj.slidesPerView = customOpt.slidesPerView;
			} else {
				_settingObj.slidesPerView = 1;
			}
		} else {
			delete _settingObj.navigation;
			delete _settingObj.pagination;
			delete _settingObj.spaceBetween;
			delete _settingObj.loop;
			// delete _settingObj.slidesPerView;
		}
		if(customOpt.hasOwnProperty('spaceBetween') && perGroup){
			_settingObj.spaceBetween = customOpt.spaceBetween;
		}
	
		
	
		if (customOpt.hasOwnProperty('addOption')) {
			for (let i = 0; i < Object.keys(customOpt.addOption).length; i++) {
				_settingObj[Object.keys(customOpt.addOption)[i]] = Object.values(customOpt.addOption)[i];
			}
		}
		return _settingObj;
	}

// const bannerSwiper = () => {
// 	let swiperWrap = document.querySelectorAll("[class^='swiperBanner']");
// 	let customOpt = {}
// 	let defaultObj = {
// 		slidesPerView : 1,
// 		spaceBetween : 0,
// 		pagination : {
// 			el : ".swiper-pagination01"
// 		},
// 		navigation : {
// 			nextEl: ".swiper-button-next",
// 			prevEl: ".swiper-button-prev"
// 		},
// 		loop : true,
// 	}

// 	swiperWrap.forEach(element => {
// 		let slideItem = element.querySelectorAll('.swiper-slide');

// 		customOpt = {
// 			slidesPerView : element.dataset.slidesPerView,
// 			spaceBetween : element.dataset.spaceBetween,
// 			loop : element.dataset.navigation,
// 			pagination : element.dataset.pagination,
// 			navigation : element.dataset.loop
// 		}

// 		if(slideItem.length > 1){
// 			customOpt.slidesPerView = customOpt.slidesPerView == null ? 1 : element.dataset.slidesPerView;

// 			customOpt.spaceBetween = customOpt.slidesPerView == null ? 1 : element.dataset.slidesPerView;
// 		}

// 		// console.log(slideItem.length);
// 		// console.log(element);
// 	});
// }

// [SRCH] ---------------    검색 영역  ---------------------//
const SRCH = {
	FilterPriceRange : (amt01, amt02, rangeBox, stepsNum, amtTxt, _callback) => {
		const numberWithCommas  = (x) => {// 숫자 천의자리 표현
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		const amt01ID = $("#" + amt01);
		const amt02ID = $("#" + amt02);
		const _rangeCpoRange = $('#' + rangeBox + ' .cpoRange');
		let _rangeCpoChck = $('#' + rangeBox + '-Chk i');// 선택값 타이틀 옆에 text 붙여주기
		const minValue = amt01ID.data('min');
		const maxValue = amt02ID.data('max');
		const minPriceSearch = amt01ID.data('min');
		const maxPriceSearch = amt02ID.data('max');
		const startVaule = amt01ID.val();
		const endVaule = amt02ID.val();

		const btnStart = $('#' + rangeBox + ' .cpoRange .btn_range_start');
		const btnEnd = $('#' + rangeBox + ' .cpoRange .btn_range_end');
	
		// 가격
		if(maxValue < 1) {
			maxValue = maxPriceSearch;
		}
		// D:가격슬라이더
		_rangeCpoRange.slider({
			range: true,
			min: Number(minPriceSearch),
			max: Number(maxPriceSearch),
			step:stepsNum,
			values: [Number(minValue), Number(maxValue)],
			change_val:false,
			create:function(event, ui){// 생성
				// _rangeCpoRange.append('<span class="min_no"></span>');
				// _rangeCpoRange.append('<span class="max_no"></span>');
				btnStart.append('<em></em>');
				btnEnd.append('<em></em>');
				
				if(rangeBox != 'rangeYear'){
					$('#' + rangeBox + ' .cpoRange .min_no').text(numberWithCommas( minValue ));
					$('#' + rangeBox + ' .cpoRange .max_no').text(numberWithCommas( maxValue ));
	
				} else{
					$('#' + rangeBox + ' .cpoRange .min_no').text(minValue);
					$('#' + rangeBox + ' .cpoRange .max_no').text(maxValue);
					if(rangeBox == 'rangePrice'){
						SRCH.FilterPriceChart();// 가격 상단 그래프
					}
				}

				// if(_rangeCpoRange.data('type') == 'in_value') {
				// 	// $('.ui-slider-handle').append('<em class="value"></em>');
				// 	// const handler = _rangeCpoRange.find('.ui-slider-handle');
				// 	// for(var i = 0; i < handler.length; i++) {
				// 	// 	_rangeCpoChck = handler.find('em')
				// 	// }
				// 	_rangeCpoChck[0] = $('.btn_range_start .value')
				// 	_rangeCpoChck[1] = $('.btn_range_end .value')
				// }
			},
			change: function( event, ui ) {
				var sminValue = _rangeCpoRange.slider("values", 0);
				var smaxValue = _rangeCpoRange.slider("values", 1);
				
				if(rangeBox != 'rangeYear'){
					$('#' + rangeBox + ' .cpoRange .btn_range_start em').text(numberWithCommas( sminValue ));
					$('#' + rangeBox + ' .cpoRange .btn_range_end em').text(numberWithCommas( smaxValue ));
	
				} else{
					$('#' + rangeBox + ' .cpoRange .btn_range_start em').text(sminValue + '년') ;
					$('#' + rangeBox + ' .cpoRange .btn_range_end em').text(smaxValue + '년');
				}
				amt01ID.val(sminValue);
				amt02ID.val(smaxValue);
				if (_callback) {
					_callback();
				}
			},
		});
		if(rangeBox != 'rangeYear'){
			$('#' + rangeBox + ' .cpoRange .min_no').text(numberWithCommas( minValue  + amtTxt));
			$('#' + rangeBox + ' .cpoRange .max_no').text(numberWithCommas( maxValue  + amtTxt));
			$('#' + rangeBox + ' .cpoRange .btn_range_start em').text(numberWithCommas( startVaule ));
			$('#' + rangeBox + ' .cpoRange .btn_range_end em').text(numberWithCommas( endVaule ));
	
		} else{
			$('#' + rangeBox + ' .cpoRange .min_no').text(minValue + amtTxt);
			$('#' + rangeBox + ' .cpoRange .max_no').text(maxValue + amtTxt);
			$('#' + rangeBox + ' .cpoRange .btn_range_start em').text(startVaule + '년');
			$('#' + rangeBox + ' .cpoRange .btn_range_end em').text(endVaule + '년');
		}
		_rangeCpoRange.slider("values", 0, startVaule);// handler 시작
		_rangeCpoRange.slider("values", 1, endVaule);// handler 끝
		_rangeCpoRange.on('touchend', function(){
			if(rangeBox == 'rangePrice'){
				SRCH.FilterPriceChart();// 가격 상단 그래프
			}
		});
	}
}//SRCH 검색 관련 스크립트 종료




// 차량 비교하기 Start
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
		this.container = document.querySelector(".container")
		this.dragItems = this.wrap.querySelectorAll(".dragObj")
		this.dragItemsTarget = this.wrap.querySelectorAll('.dragObj .top')
		this.scrollItemTarget = this.wrap.querySelectorAll('.dragObj .cont')
		this.touchItems = this.wrap.querySelectorAll('.dropObj')
		this.fixedItem = this.wrap.querySelector('.fixed')
		this.pin = this.wrap.querySelectorAll('.dragObj .pin')
		
		this.targetPadding = Number(
			window
			.getComputedStyle(this.container)
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
		this.saveScroll = 0
		this.scrollX = window.scrollX;

		// this.longTouch = 0
		this.result = 0
		this.touchNav = null

		// DviceCheck
		this.TYPE_DEVICE = /iPad|tablet/i.test(window.navigator.userAgent)

		this.load()
		this.callBack(callBack)
	}

	load(){
		window.onload = () => {
			let scrollArea = this.dragItems[0].clientWidth * this.dragItems.length;
			this.wrap.style.width = scrollArea + 'px';
		}
		
		// fixed view
		this.container.addEventListener('scroll',(e) => {
			this.scrollFixed(e.target,this.fixedItem);
		})

		if(!this.TYPE_DEVICE){
			/*	*	*	*	*
			*	DEVICE TYPE	*
			*	> DESKTOP <	*
			*	*	*	*	*/
			console.log("device type : DeskTop")

			//scroll Event Listener
			this.scrollItemTarget.forEach(element => {
				element.addEventListener("scroll", (e) => {
					this.scrollSticky(e);
				})
			});

			// mouse Down Event Listener
			this.dragItemsTarget.forEach(element => {
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
			console.log("device type : tablet")
		
			//scroll Event Listener
			this.scrollItemTarget.forEach(element => {
				element.addEventListener("scroll", (e) => {
					this.scrollLoad(e);
					if(this.eventState.touchCompare) this.eventState.touchCompare = false;
				})
			})

			this.container.addEventListener("scroll", (e) => {
				this.scrollLoad(e);
				if(this.eventState.touchCompare) this.eventState.touchCompare = false;
			})
			// mouse Down Event Listener
			this.dragItemsTarget.forEach(element => {
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
		this.saveScroll = e.target.scrollTop;
		
		this.eventState.scrollCompare = true;
		this.eventState.touchCompare = false;

		if(this.eventState.scrollCompare && !this.eventState.touchCompare){
			for (let i = 0; i < this.scrollItemTarget.length; i++) {
				this.scrollItemTarget[i].scrollTop = e.target.scrollTop;
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
		

		this.currentclone.querySelector('.cont').scrollTop = this.saveScroll

		// // pointer x,y 계산
		this.shiftX = e.pageX - this.currentItem.getBoundingClientRect().left - this.container.scrollLeft + this.targetPadding + this.container.getBoundingClientRect().left;
		console.log(this.container.scrollLeft);
		console.log(this.container.getBoundingClientRect().left);
		// target style
		this.currentItem.style.position = "absolute";
		this.currentItem.style.top = "0";
		this.currentItem.style.zIndex = "9999";
		this.currentItem.style.opacity = "0.5";
	}

	// pin click
	PINSwitch(e){
		const fixItem = document.querySelector('.fixed');
		if(e.target.dataset.fix == 'false' || e.target.dataset.fix == ""){
			const currentItem = e.target.closest('.dragObj');
			
			e.target.dataset.fix = true;
			fixItem.querySelector('.pin').dataset.fix = false;

			currentItem.classList.add('fixed');
			fixItem.classList.remove('fixed');

			this.changeElement(currentItem, fixItem)
		}
		this.init(e)
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

		targetItem.querySelector('.cont').scrollTop = this.saveScroll;
		changeItem.querySelector('.cont').scrollTop = this.saveScroll;
	}

	scrollFixed(wrap,target){
		target.style.left = wrap.scrollLeft + 'px';
	}

	init(e){
		// cloneScroll = itemScroll;
		this.fixedItem = this.wrap.querySelector('.fixed');
		if(this.eventState.clickCompare){
			for (let i = 0; i < this.dragItemsTarget.length; i++) {
				this.dragItemsTarget[i].closest('.dragObj').setAttribute("style","");
			}

			this.currentclone.remove();

			// default
			this.currentItem = null
			this.currentclone = null
			this.droppableBelow = null
			this.futureItem = null
			this.shiftX = null

			this.eventState.clickCompare = false;
			this.eventState.moveCompare = false;
			
			this.dragItemsTarget.forEach(element => {
				element.removeEventListener("mousedown", this.dragMouseDown)
			});
			
			window.removeEventListener("mouseup", this.dragMouseUp)
			this.wrap.removeEventListener("mousemove", this.dragMouseMove)
			this.scrollFixed(this.container,this.fixedItem);
		}

		if(this.eventState.touchCompare){
			this.result = 0;
			// this.longTouch = 0;
			this.eventState.touchCompare = false;
			this.eventState.navCompare = false;
			this.eventState.scrollCompare = false;
			this.touchNav.remove();
			this.dragItemsTarget.forEach(element => {
				element.removeEventListener('touchstart', this.touchStart)
			})
			window.removeEventListener('touchend', this.touchEnd);

			for(let i = 0; i < this.touchItems.length; i++){
				this.touchItems[i].classList.remove('select');
			}
			this.scrollFixed(this.container,this.fixedItem);
		}
		
		this.scrollFixed(this.container,this.fixedItem);
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
	
// LNB active fn
function lnb_active(){
	let lnb_link = document.querySelectorAll('.lnb_wrap .lnb li a');
	let cont_wrap_id = document.querySelector('.cont_wrap').dataset.id;

	lnb_link.forEach(element => {
		let lnb_id = element.getAttribute('id');
		if(lnb_id == cont_wrap_id) active_fn(cont_wrap_id);
	});
}
function active_fn (id){
	let target = document.getElementById(id).closest('li');
	target.classList.add('on');
}

function selectStep(callback){
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

//PLP 
/* target = 타겟, animate = 퍼센트 애니메이션(true, false), animateTxt = 텍스트 애니메이션(true, false), time = 애니메이션 시간 */
function CPODonutChart(target, animate, animateTxt, time){
	const options = {
		animate : animate,
		animateTxt : animateTxt,
	}
	target.each(function(){
		if(!$(this).hasClass('progressBar02')){
			$(this).find('circle').attr({
				'cx':34,
				'cy':34,
				'r':32,
			});
		} else {
			$(this).find('circle').attr({
				'transform':'rotate(-90, 100, 100)',
				'cx':115,
				'cy':83,
				'r':80,
			});
		}
		const $count = $(this).find('.progressCount');
		const $line = $(this).find('.progressLine');
		const percentProgress = $(this).attr('data-progress');
		const percentRemaining = (100 - percentProgress);
		const percentTxt = $(this).attr('data-progress');

		const radius = $line.attr('r');
		const diameter = radius * 2;
		const circumference = Math.round(Math.PI * diameter);

		const percentage =  circumference * percentRemaining / 100;
		$line.css({
			'stroke-dasharray' : circumference,
			'stroke-dashoffset' : percentage
		});
		
		if(options.animate === true){
			$line.css({
				'stroke-dashoffset' : circumference
			}).animate({
				'stroke-dashoffset' : percentage
			}, time)
		}
		if(options.animateTxt == true){
			$({Counter:0}).animate(
				{Counter:percentTxt},
				{duration:time,
				step: function () {
					$count.html(Math.ceil(this.Counter) + '<em>%</em>');
				}
			});
		}else{
			$count.text(percentTxt + '%');
		}
	});
}


function ImgUpload01(){// 내차팔기 필수 사진 업로드, 사진 리사이즈 ImgUploadResize 기능, div addClass on 기능
	if (window.File && window.FileList && window.FileReader) {
		$(".file_addphoto").on("change", function(e) {// 
			var _objData = $(this).attr('data-file');
			var _objParent = $(this).parent();
			var _objCont = $('#' + _objData);
			var files = e.target.files;
			if (files && files[0]) {//
				var fileReader = new FileReader();
				fileReader.onload = (function(e) {
					_objCont.html('<img src="'+ e.target.result +'" ><button class="btn_filedel">삭제버튼</button>');
					_objParent.addClass('on');
				});
				fileReader.readAsDataURL(files[0]);
			}//
		});
		$(document).off("click","[class^='addphoto_'] .btn_filedel").on("click","[class^='addphoto_'] .btn_filedel", function(){
			var _olId = $(this).closest("[class^='addphoto_']");
			var _objData = $(this).closest('span').attr('id');
			var _objCont = $('#' + _objData);
			_olId.find('input[type="file"]').val('').change();
			_objCont.empty();
			_olId.removeClass('on');
			CPO.POPUP_toast("CPOToast_Wrap", "이미지가 삭제되었습니다.");
		});
	}
}


function ImgUpload02(){//고객센터 이미지 업로드
	// ImgUploadResize 기능, div  class on 추가
	var filesToUpload = [];
	var count = 0; //등록 이미지 카운팅

	$(".file_morephoto").change(function (evt) {
		console.log(this)
		var _objData = $(this).attr('data-file');
		var _objDataItem = parseInt($(this).attr('data-item'));
		var _objCont = $('#' + _objData);
		var files = evt.target.files, 
		filesLength = files.length;
		var i = 0;

		for (var i = 0; i < evt.target.files.length; i++) {
			filesToUpload.push(evt.target.files[i]);
		};
		for (var i = 0, f; f = evt.target.files[i]; i++) {
			var f = files[i]
			var fileReader = new FileReader();
			var fileName = escape(f.name);

			fileReader.onload = (function(evt) {
				if(count < _objDataItem){// _objDataItem은 최대 업로드 가능 
					count++;
					_objCont.prepend(
						'<li class="item" data-text="'+ fileName +'"><img src="'+ evt.target.result +'"  ><button class="btn_filedel" data-fileid="'+ count +'" >삭제버튼</button></li>'
					);
					$('.addphoto_list dl').addClass('on');
				} 
				if (count > _objDataItem || count == _objDataItem){
					popupToast("toast_wrap", '최대' + _objDataItem + '개까지 업로드 가능합니다.');
					$('.addphoto_list dl').removeClass('on');
				}
			});
			fileReader.readAsDataURL(f);
			fileReader.onloadend = function(){// 업로드 사진 개수 넣어주기
				var _objContItemL = $('#' + _objData + ' .item').length;
				var _objContItemNo = $('#' + _objData + 'no');
				_objContItemNo.text(_objContItemL);
			}
		};
	});
	
	$(document).off("click",".btn_filedel").on("click",".btn_filedel", function(){
		var _olId = $(this).closest('ol');
		var _objData = $(this).closest('ol').attr('id');
		var _objCont = $('#' + _objData + 'no');
		var _objContItemNo = _objCont.text();
		_objCont.text(Number(_objContItemNo)-1);// 총 수량 빼주기
		$(this).parent(".item").remove();
		count--;
		$('.addphoto_list dl').addClass('on');
		if(_objContItemNo == 1){
			$('.addphoto_list dl').addClass('on');
		}
		popupToast("toast_wrap", "이미지가 삭제되었습니다.");
	});
};

function tooltip(){ // 툴팁
	$(document).off("click",".tooltip .open").on("click",".tooltip .open", function(){
		var _obj = $(this).parent();
		
		if(_obj.hasClass('on')){
			_obj.removeClass('on')
		} else {
			_obj.addClass('on');
		}
	});
	$(document).off("click",".tooltip .close").on("click",".tooltip .close", function(){
		var _obj = $(this).parent().parent();
		_obj.removeClass('on')
	});
};

//floating
function CAfloating() {
	setTimeout(()=> {
		$('#CAfloating').addClass('ready');
	}, 300);
	let tst = $(window).scrollTop();
	if(tst > 0){
		$('#CAfloating').addClass('scroll');
	}
	$(window).scroll(function(){
		let tst = $(this).scrollTop();
		if(tst != 0){
			$('#CAfloating').addClass('scroll');
		} else {
			$('#CAfloating').removeClass('scroll');
		}
	});
	$('#CAfloating button[title=top]').click(function(){
		$('html, body').animate({
			scrollTop : 0
		}, 300);
		return false;
	});
};

function plpFloating() {
	setTimeout(()=> {
		$('#myFloating').addClass('ready');
	}, 300);

	$('.my_plp').on('click', '.btn_list', function() {
		var selected = $(this).parent();
		var targetList = selected.find('.my_plp_list');
		selected.siblings().removeClass('on');
		if(!selected.hasClass('on')) {
			selected.addClass('on');
			//상품이 많아서 브라우져를 벗어날때
			if(targetList.find('.goods').length > 3) {
				targetList.css({
					"top":'unset',
					"bottom": '-160px',
					"transform": 'translateY(0%)'
				});
			}
		} else {
			selected.removeClass('on');
		}
	});
};

//비교하기 on/off
function compareToggle() {
	const toggleSwich = document.querySelectorAll('.js_compare input[type=checkbox]');
	const myFloating = document.querySelector('#myFloating');
	toggleSwich.forEach((swich) => {
		swich.addEventListener('change', function() {
			this.targetCont = this.closest('#layoutWrap').querySelector('.compare_wrap');
			if(this.checked == true) {
				this.targetCont.classList.add('on');
				myFloating.classList.remove('ready');
				document.querySelector('.compare_box').style.display = 'block';
				for(const checkbox of toggleSwich) {
					checkbox.checked = true;
				}
				
			} else {
				this.targetCont.classList.remove('on');
				myFloating.classList.add('ready');
				document.querySelector('.compare_box').style.display = 'none';
				for(const checkbox of toggleSwich) {
					checkbox.checked = false;
				}
			}
			//비교하기 작동시 토글값 모두 초기화
			for(const btn of this.targetCont.querySelectorAll('.btn_experience'))
				if(btn.classList.contains('on')) {
					btn.classList.remove('on');
					btn.parentElement.nextElementSibling.style.display = 'none'
				}
		});
	});

	//비교담기 스크롤 이벤트
	window.addEventListener('scroll', function() {
		let scrollPos = window.scrollY;
		const target = document.querySelector('.compare_box');
		if(scrollPos >= 438) {
			target.classList.add('fixed');
		} else if (scrollPos < 438) {
			target.classList.remove('fixed');
		}
	});
}

//coachmark
function coachMark() {
	$('html').addClass('scroll_hidden');
	$('#coachMark').css('display', 'block');
	$('[data-id=step1]').css('display', 'block');
	var ingStep = null;
	
	$('.step').on('click', '.next', function() {
		if($(this).closest('.step').is(':visible') == true) {
			ingStep = $(this).closest('.step');
			ingStep.hide();
			ingStep.next().show();
		}
	})
	
	$('.step').on('click', '.skip', function() {
		$('.step').css('display', 'none');
		$('#coachMark').css('display', 'none');
		$('html').removeClass('scroll_hidden');
	})
}

const calendar = () => {
	// Calendar 
	$.datepicker.setDefaults({
		dateFormat:'yy.mm.dd',
		prevText:'이전 달',
		nextText:'다음 달',
		monthNames:['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
		monthNamesShort:['1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.', '11.', '12.'],
		dayNames:['일', '월', '화', '수', '목', '금', '토'],
		dayNamesShort:['일', '월', '화', '수', '목', '금', '토'],
		dayNamesMin:['일', '월', '화', '수', '목', '금', '토'],
		yearSuffix:'.',

		showOn:'button',
		
		todayHighlight: true,
		showMonthAfterYear:true,
		showButtonPanel:false,
		buttonImageOnly:false,
	});

	//datepicker Option
	$('.date-picker').datepicker({
		beforeShow : function(){
			$(this).closest('.date-picker-wrap').append($('#ui-datepicker-div')); // 버튼 옆 위치
		},
		// onSelect:function() {
		// 	$(this).data('datepicker').inline = true; // 날짜 선택시 창 닫히지 않게 예외 처리
		// },
		onClose:function(selectedDate) { // 닫기
			var $data = $(this).data('datepicker');
			$data.inline = false;
			if(!$(this).hasClass('.type02') && $(this).parent().find('.txt').val() != ''){
				$(this).parent().addClass('on'); // 희망일 inbox_type03 on 추가~
			}
			$('#ui-datepicker-div').off('click','.ui-datepicker-del').on('click', '.ui-datepicker-del', function() {
				$($data.input).val($data.lastVal); // 취소시 이전 값 다시 넣어주기
			});
			$(this).trigger('dateupdated');
			setTimeout(function(){
				$('.date_dimm').remove(); // Dim Close
			},300)
		},
	});
}

function treeCheck() {
	$('.tree_list .chk_type01').on('change', function() {
		if($(this).is(':checked')) {
			$(this).parent().parent().addClass('on')
		} else {
			$(this).parent().parent().removeClass('on');
			$(this).parent().parent().find('.chk_type01').prop('checked', false);
			$(this).parent().parent().find('li').removeClass('on');
		}
	})
}