
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
	popup.classList.remove('active');
	let prevPopup = false;
	document.querySelectorAll('[class*="popup_"]').forEach(_this=>{
		if(_this.classList.contains('active')) prevPopup = true;
	});
	if(prevPopup === false) document.querySelector('html').classList.remove('scroll_hidden');
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
	constructor(target) {
		this.current = null;
		this.wrap = (typeof target !== 'string') ? target : document.querySelector(`[data-ref="${target}"]`);
		this.menu = this.wrap.querySelector('[role="tablist"]');
		this.btn = this.menu.querySelectorAll('[role="tab"]');
		this.currentEl = null;
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
			const _this = e.currentTarget;
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
				this.currentEl = this.wrap.querySelector(`#${target}`); 
			}
		}
	}
}

class AccoContents {
	constructor(target) {
		this.wrap = (typeof target !== 'string') ? target : document.querySelector(`[data-ref="${target}"]`);
		this.btn = this.wrap.querySelectorAll('[data-ref="btn"]');
		this.current = null;
		this.activeFun = ()=>{this.active()};
		this.eventFun();
	}
	reset() {
		this.eventFun();
	}
	eventFun() {
		this.btn.forEach(btn=>{
			btn.removeEventListener('click', this.activeFun);
			btn.addEventListener('click', this.activeFun);
		});
	}
	active(idx) {
		let target = (event) ? event.target : this.btn[idx];

		if(this.current != null) {
			this.current.classList.remove('isOpen');
			let cont = this.current.parentNode.querySelector('[data-ref="cont"]');
			slide.close(cont, 300, 'isOpen');
		}
		if(this.current === target) {
			this.current.classList.remove('isOpen');
			let cont = target.parentNode.querySelector('[data-ref="cont"]');
			slide.close(cont, 300, 'isOpen');
			this.current = null;
		} else {
			this.current = target;
			target.classList.add('isOpen');
			let cont = target.parentNode.querySelector('[data-ref="cont"]')
			slide.open(cont, 300, 'isOpen');
		}
	}
}


//header
function CPOheader() {
	const header = document.querySelector('#CPOheader');
	let beforePosition = document.documentElement.scrollTop;

	window.addEventListener('scroll', function() {
		let afterPosition = document.documentElement.scrollTop;
	
		if (afterPosition > 70) {
			if(beforePosition < afterPosition ){
				header.classList.remove('fixed');
			} else {
				header.classList.add('fixed');
			}
		} else {
			header.classList.remove('fixed');
		}
		beforePosition = afterPosition;
	});
};

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
				if(callback) callback(entry)
			}
		});
	});
	target.forEach( _this => {
		observer.observe(_this);
	})
}

//floating
function CPOfloating() {
	if(document.body.dataset.pagetype == 'dark') {
		$('#CPOfloating').addClass('bg_dark');
	}
	setTimeout(()=> {
		$('#CPOfloating').addClass('ready');
	}, 300);
	let tst = $(window).scrollTop();
	if(tst > 0){
		$('#CPOfloating').addClass('scroll');
	}
	$(window).scroll(function(){
		let tst = $(this).scrollTop();
		if(tst != 0){
			$('#CPOfloating').addClass('scroll');
		} else {
			$('#CPOfloating').removeClass('scroll');
		}
	});
	$('#CPOfloating button[title=top]').click(function(){
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
			if(targetList.find('.item').length > 2) {
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


// [SRCH] ---------------    검색 영역  ---------------------//
const SRCH = {
	FilterPriceRange : (amt01, amt02, rangeBox, stepsNum, amtTxt, _callback) => {
		const numberWithCommas  = (x) => {// 숫자 천의자리 표현
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		var amt01ID = $("#" + amt01);
		var amt02ID = $("#" + amt02);
		var _rangeCpoRange = $('#' + rangeBox + ' .cpoRange');
		var _rangeCpoChck = $('#' + rangeBox + '-Chk i');// 선택값 타이틀 옆에 text 붙여주기
		var minValue = amt01ID.data('min');
		var maxValue = amt02ID.data('max');
		var minPriceSearch = amt01ID.data('min');
		var maxPriceSearch = amt02ID.data('max');
		var startVaule = amt01ID.val();
		var endVaule = amt02ID.val();
	
		const btnStart = $('#' + rangeBox + ' .cpoRange .btn_range_start');
		const btnEnd = $('#' + rangeBox + ' .cpoRange .btn_range_end');

		const txtTartget = $('#' + rangeBox + ' .cpoRange').parents('.item_toggle').find('.check');

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
					$('#' + rangeBox + ' .cpoRange .min_no').text(numberWithCommas( minValue ) + ' ' + amtTxt);
					$('#' + rangeBox + ' .cpoRange .max_no').text(numberWithCommas( maxValue ) + ' ' + amtTxt);
	
				} else{
					$('#' + rangeBox + ' .cpoRange .min_no').text(minValue);
					$('#' + rangeBox + ' .cpoRange .max_no').text(maxValue);
				}
			},
			slide: function() {
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
		$('.item_toggle').on('click', function(){
			$(this).find('.check .txt').hide();
			$(this).find('.num_area').show();
		});
		_rangeCpoRange.slider("values", 0, startVaule);// handler 시작
		_rangeCpoRange.slider("values", 1, endVaule);// handler 끝
	},
}//SRCH 검색 관련 스크립트 종료
