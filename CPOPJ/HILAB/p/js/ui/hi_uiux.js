
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
			slide.toggle(this.closest('.item').nextElementSibling, 500, 'on');
			if(this.closest('.item').nextElementSibling.classList.contains('on')){
				this.closest('.item').classList.remove('on');
			} else {
				this.closest('.item').classList.add('on');
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

const dropDown = () => {
	const btn = event.target;
	const wrap = btn.closest('[data-ref="select"]');
	const wrapRect = wrap.getBoundingClientRect();
	const list = wrap.querySelector('[data-ref="dropDownList"]');
	const items = list.querySelectorAll('label');
	const scrollWrap = (btn.closest('.inner_view')) ? btn.closest('.inner_view') : null;

	let scroll = null;

	const chkFunc = () => {
		const target = event.target;
		if(target.tagName !== 'INPUT' && event.type === 'click') {
			btn.innerText = target.innerText;
			hideSelf();
		} else if(event.type === 'keyup' && target.tagName === 'INPUT' && event.keyCode === 13) {
			btn.innerText = target.parentNode.innerText;
			hideSelf();
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
			// scroll.removeScroll();
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

		if(relNum < wrapPos) list.classList.add('isBot');
		
		items.forEach(item => {
			item.addEventListener('click', chkFunc);
			item.addEventListener('keyup', chkFunc);
		});
		btn.setAttribute('aria-expanded', true);
		slide.open(list, 300, 'isShow', ()=>{
			// scroll = new MakeScroll(list);
		});
		
		window.addEventListener('click', hideFunc);
		btn.addEventListener('click', hideSelf);
	}
}

const inputFunc = () => {
	const wrap = event.target.closest('[class^="inbox_type"]');
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
			}
		});
	}
	const initFunc = () => {
		wrap.classList.add('on');
		txt.forEach(input => input.addEventListener('keyup', keyUpFunc));
		del.forEach(btn => btn.addEventListener('click', delValue));
	}
	const outFunc = () => {
		const chkWrap = event.target.closest('[class^="inbox_type"]');
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
		if(wrap != event.target.closest('[class^="inbox_type"]')) outFunc();
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
	let scroll;
	const outFunc = () => {
		const chkWrap = event.target.closest('.textarea');
		if(wrap != chkWrap) {
			wrap.classList.remove('focus');
			textarea.removeEventListener('keyup', valueChk);
			window.removeEventListener('click', outFunc);
			window.removeEventListener('keyup', chkFunc);
			// scroll.removeScroll();
		}
	}
	const chkFunc = () => {
		if(wrap != event.target.closest('.textarea')) outFunc();
	}
	const valueChk = () => {
		number.innerText = textarea.value.length;
	}

	if(!wrap.classList.contains('focus')) {
		textarea.addEventListener('keyup', valueChk);
		textarea.focus();
		wrap.classList.add('focus');
		// scroll = new MakeScroll(textarea);
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
	const slideLeng = _container.querySelectorAll('.swiper-slide').length;
	let _loop = customOpt.loop;
	let _slidesPerView = customOpt.slidesPerView > 1 ? customOpt.slidesPerView : 1;
	let _pagination, _navigation, _spaceBetween, _settingObj;


	_settingObj = {
		slidesPerView: _slidesPerView,
		spaceBetween: _spaceBetween,
		loop: _loop,
		pagination: _pagination,
		navigation: _navigation,
	};

	if (slideLeng > 1) {
		if (customOpt.pagination && customOpt.hasOwnProperty('pagination')) {
			_settingObj.pagination = {
				el: "[class^=swiper-pagination0]",
			};
		} else {
			delete _settingObj.pagination;
		}

		if (customOpt.navigation && customOpt.hasOwnProperty('navigation')) {
			_settingObj.navigation = {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev"
			};
		} else {
			delete _settingObj.navigation;
		}

		if (customOpt.hasOwnProperty('spaceBetween')) {
			_settingObj.spaceBetween = customOpt.spaceBetween;
		} else {
			delete _settingObj.spaceBetween;
		}

		if (customOpt.hasOwnProperty('spaceBetween')) {
			_settingObj.spaceBetween = customOpt.spaceBetween;
		} else {
			delete _settingObj.spaceBetween;
		}

		if (customOpt.hasOwnProperty('loop')) {
			_settingObj.spaceBetween = customOpt.spaceBetween;
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

const swiperOptions = (target, type, option) => {
	const wrap = document.querySelector(target);
	const itemLeng = wrap.querySelectorAll('.swiper-slide').length;
	if(type == 'type2' && itemLeng > 1) {
		let next = document.createElement('div');
		let prev = document.createElement('div');
		next.classList.add('swiper-button-next');
		prev.classList.add('swiper-button-prev');
		wrap.append(next, prev);
	}
	const typeOptions = {
		'type1' : {
			slidesPerView: 1,
			loop: true,

		},
		'type2' : {
			slidesPerView: 2,
			spaceBetween: 20,
			loop: true,
		}
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
	
	let result = typeOptions[type];

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

// [SRCH] ---------------    검색 영역  ---------------------//
const SRCH = {
	FilterPriceRange : (amt01, amt02, rangeBox, stepsNum, amtTxt, _callback) => {
		const numberWithCommas  = (x) => {// 숫자 천의자리 표현
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		const amt01ID = $("#" + amt01);
		const amt02ID = $("#" + amt02);
		const _rangeCpoRange = $('#' + rangeBox + ' .cpoRange');
		const _rangeCpoChck = $('#' + rangeBox + '-Chk i');// 선택값 타이틀 옆에 text 붙여주기
		const minValue = amt01ID.data('min');
		const maxValue = amt02ID.data('max');
		const minPriceSearch = amt01ID.data('min');
		const maxPriceSearch = amt02ID.data('max');
		const startVaule = amt01ID.val();
		const endVaule = amt02ID.val();
	
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
				_rangeCpoRange.append('<span class="min_no"></span>');
				_rangeCpoRange.append('<span class="max_no"></span>');
				
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
			},
			change: function( event, ui ) {
				var sminValue = _rangeCpoRange.slider("values", 0);
				var smaxValue = _rangeCpoRange.slider("values", 1);
				
				if(rangeBox != 'rangeYear'){
					$(_rangeCpoChck[0]).text(numberWithCommas( sminValue ));
					$(_rangeCpoChck[1]).text(numberWithCommas( smaxValue ));
	
				} else{
					$(_rangeCpoChck[0]).text(sminValue);
					$(_rangeCpoChck[1]).text(smaxValue);
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
			$(_rangeCpoChck[0]).text(numberWithCommas( startVaule ));
			$(_rangeCpoChck[1]).text(numberWithCommas( endVaule ));
	
		} else{
			$('#' + rangeBox + ' .cpoRange .min_no').text(minValue + amtTxt);
			$('#' + rangeBox + ' .cpoRange .max_no').text(maxValue + amtTxt);
			$(_rangeCpoChck[0]).text(startVaule);
			$(_rangeCpoChck[1]).text(endVaule);
		}
		_rangeCpoRange.slider("values", 0, startVaule);// handler 시작
		_rangeCpoRange.slider("values", 1, endVaule);// handler 끝
		_rangeCpoRange.on('touchend', function(){
			if(rangeBox == 'rangePrice'){
				SRCH.FilterPriceChart();// 가격 상단 그래프
			}
		});
	}
}
const searchLayer = function(target) {
	const srchWrap = document.querySelector(target);
	const srchInput = document.querySelector('.inp_srch input');
	const srchRecent = document.querySelector('.srch_recent');
	const srchAuto = document.querySelector('.srch_auto');
	const srchDel = document.querySelector('.btn_delete');
	const srchClose = document.querySelector('.btn_close');
	srchWrap.style.display = 'block';
	function srchChange(){
		if(srchInput.value.length >= 1){
			srchAuto.style.display = 'block';
			srchRecent.style.display = 'none';
			srchDel.style.display = 'block';
		} else {
			srchAuto.style.display = 'none';
			srchRecent.style.display = 'block';
			srchDel.style.display = 'none';
		}
	}
	srchInput.onfocus = function(){
		srchRecent.style.display = 'block';
	}
	srchInput.oncut = srchInput.oncopy = srchInput.onpaste = srchInput.oninput = function(){
		srchChange();
	}
	srchDel.onclick = function(){
		srchInput.value = '';
		srchChange();
	}
	srchClose.onclick = function(){
		srchWrap.style.display = 'none';
		srchRecent.style.display = 'none';
	}
	srchInput.focus();
}
//SRCH 검색 관련 스크립트 종료

//header
function HIheader() {
	const header = document.querySelector('#HIheader');
	const hH = header.clientHeight;
	const contents = document.querySelector('#HIcontents');
	let beforePosition = document.documentElement.scrollTop;

	window.addEventListener('scroll', function() {
		let afterPosition = document.documentElement.scrollTop;
	
		if (afterPosition > 70) {
			if(beforePosition < afterPosition ){
				header.classList.remove('fixed');
				contents.style.cssText = 'margin-top:0;';
			} else {
				header.classList.add('fixed');
				contents.style.cssText = 'margin-top:' + hH + 'px';
			}
		} else {
			header.classList.remove('fixed');
			contents.style.cssText = 'margin-top:0;';
		}
		beforePosition = afterPosition;
	});
};

//floating
function HIfloating() {
	setTimeout(()=> {
		$('#HIfloating').addClass('ready');
	}, 300);
	let tst = $(window).scrollTop();
	if(tst > 0){
		$('#HIfloating').addClass('scroll');
	}
	$(window).scroll(function(){
		let tst = $(this).scrollTop();
		if(tst != 0){
			$('#HIfloating').addClass('scroll');
		} else {
			$('#HIfloating').removeClass('scroll');
		}
	});
	$('#HIfloating button[title=top]').click(function(){
		$('html, body').animate({
			scrollTop : 0
		}, 300);
		return false;
	});
};

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
			this.saveScroll = e.target.scrollTop;
			
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
			

			this.currentclone.querySelector('.cont').scrollTop = this.saveScroll

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

			targetItem.querySelector('.cont').scrollTop = this.saveScroll;
			changeItem.querySelector('.cont').scrollTop = this.saveScroll;
		}

		
	
		init(e){
			// cloneScroll = itemScroll;
			if(this.eventState.clickCompare){
				for (let i = 0; i < this.dragItemsCont.length; i++) {
					this.dragItemsCont[i].closest('.dragObj').setAttribute("style","");
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
				
				this.dragItemsCont.forEach(element => {
					element.removeEventListener("mousedown", this.dragMouseDown)
				});
				
				window.removeEventListener("mouseup", this.dragMouseUp)
				this.wrap.removeEventListener("mousemove", this.dragMouseMove)
			}
	
			if(this.eventState.touchCompare){
				this.result = 0;
				// this.longTouch = 0;
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
	