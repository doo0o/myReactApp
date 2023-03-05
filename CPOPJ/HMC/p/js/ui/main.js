// 화면에 보일 때 인터렉션
const observer = new IntersectionObserver((entries) => {
	entries.forEach(entries => {
		if(entries.isIntersecting){
			entries.target.classList.add('active');

			// active lottie
			if(entries.target.classList.contains('hi_section')){
				lottieStart();
			}
		}
	});
});

const sectionItem = document.querySelectorAll('.script--no--parallax section');
const parallaxItem = document.querySelectorAll('.script--parallax section');
const bannerItem = document.querySelectorAll('.banner_wrap');

function oserveSetting(element){
	let options = {
		rootMargin: '0px',
		threshold: 0.5
	}
	observer.observe(element,options);
}
bannerItem.forEach(element => {
	oserveSetting(element)
});

parallaxItem.forEach(element => {
	oserveSetting(element)
});

sectionItem.forEach(element => {
	oserveSetting(element)
});


let lottieState = true;
// hi-lab 섹션 로티 이미지
const lottieStart = () => {
	if(lottieState){
		let hiSection = document.querySelector('.hi_section');
		let lottieArea = hiSection.querySelector('.hi_section .lottie_area');
		const lottieAni = [
			{
				wrapper: lottieArea,
				animType: 'svg',
				loop: true,
				autoplay: true,
				path: lottiePath,
			}
		]
		bodymovin.loadAnimation(lottieAni[0]);
	}
	lottieState = false;
}

// 
let createTextState = true;


// main visual swiper

const mainSwiper =  new Swiper('.main_swiper', getSwiperOption({
		target : '.main_swiper',
		slidesPerView : 1,
		pagination : true,
		pagination_cls : '01',
		navigation : true,
		navigation_cls: 'type03',   
		controler: {
			wrap : 'pagination',
		},
		loop: true,
		addOption : {
			autoplay : true,
			loopAdditionalSlides : 1,
			effect : 'fade',
			on: {
				slideChangeTransitionStart: function(){
					if(createTextState){
						prevTextCreate();
					}
					textIndexEnd(this);
					textIndexStart(this);
				},
				init : function(){
					swiperControler();
				},
			},
		},
	})
)

// const isMainBtn = document.querySelectorAll('.main_swiper [class^="swiper-button"]');
// const isMainNext = document.querySelector('.main_swiper .swiper-button-next');
// const isMainPrev = document.querySelector('.main_swiper .swiper-button-prev');


// 메인 비쥬얼 스와이퍼 화살표 옆 텍스트
function prevTextCreate(isSwiper){
	let mainSwiper = document.querySelector('.main_swiper')
	let carName = document.querySelectorAll('.swiper-slide .car_name');
	let prevTextWrap = document.createElement('div');
	let nextTextWrap = document.createElement('div');
	
	prevTextWrap.classList.add('prev_txt');
	nextTextWrap.classList.add('next_txt');

	carName.forEach(el => {
		let textSpan = document.createElement('span');
		let textCloneSpan = textSpan.cloneNode(true);
		textSpan.innerHTML = el.innerText;
		textCloneSpan.innerHTML = el.innerText;

		nextTextWrap.append(textSpan);
		prevTextWrap.append(textCloneSpan);
	});
	mainSwiper.append(prevTextWrap, nextTextWrap);
	createTextState = false;
}

function textIndexStart(isSwiper){
	let prevText =  document.querySelectorAll('.prev_txt span');
	let nextText =  document.querySelectorAll('.next_txt span');
	let index = isSwiper.activeIndex;

	for(let i = 0; i < isSwiper.slides.length; i++){
		prevText[i].classList.remove('view-interaction');
		nextText[i].classList.remove('view-interaction');
	}

	setTimeout(() => {
		prevText[index-1].classList.add('view-interaction');
		nextText[index+1].classList.add('view-interaction');
		prevText[index].classList.add('visible-interaction');
		nextText[index].classList.add('visible-interaction');
	},100)
}

function textIndexEnd(isSwiper){
	let prevText =  document.querySelectorAll('.prev_txt span');
	let nextText =  document.querySelectorAll('.next_txt span');

	for(let i = 0; i < isSwiper.slides.length; i++){
		prevText[i].classList.remove('visible-interaction');
		nextText[i].classList.remove('visible-interaction');
	}
}


// 메인 비쥬얼 스와이퍼 정지, 시작 버튼
function swiperControler(){
	let swiperControlerButton = document.querySelectorAll('[class^="swiper-controler"]')
	let swiperControlerPause = document.querySelector('.swiper-controler-pause');
	let swiperControlerPlay = document.querySelector('.swiper-controler-play');
	
	swiperControlerPause.addEventListener('click',function(e){
		swiperControlerButton.forEach(element => {
			element.classList.add('active');
		});
		mainSwiper.autoplay.stop();
		e.target.classList.remove('active');
	})
	swiperControlerPlay.addEventListener('click',function(e){
		swiperControlerButton.forEach(element => {
			element.classList.add('active');
		});
		mainSwiper.autoplay.start();
		e.target.classList.remove('active');
	})
}


// '모델로 검색하세요.' 스와이퍼
const selectSwiper = new Swiper('.model_swiper', getSwiperOption({
	target : '.model_swiper',
	slidesPerView : 5,
	spaceBetween: 8,
	navigation : true,
	navigation_cls: 'type04',
	addOption : {
		slidesPerGroup : 5,
		speed: 1000,
		on : {
			slideChangeTransitionStart: function(){
				swiperSizing(this);
			},
			sliderFirstMove : function(){
				swiperSizing(this);
			},
			init : function(){
				this.wrapperEl.closest('.model_swiper').style.paddingRight = '148px';
			}
		},
	}
}))

// '모델로 검색하세요.' 스와이퍼
// 좌우 버튼 간격 조정 함수
function swiperSizing(swiper){
	let wrap = swiper.wrapperEl.closest('.model_swiper');
	let prevBtn = wrap.querySelector('.swiper-button-prev');
	
	if(!prevBtn.classList.contains('swiper-button-disabled')){
		wrap.style.paddingLeft = '40px';
		wrap.style.paddingRight = '108px';
	}else{
		wrap.style.paddingLeft = '0';
		wrap.style.paddingRight = '148px';
	}
}

// '모델로 검색하세요.' 스와이퍼
// 13개 차량 클릭시 차종 선택 팝업 함수
function modelChkPop(){
	let modelList = document.querySelector('.model_list');
	let modelSelectItem = modelList.querySelectorAll('.model_select_item');
	let modelSelectName = modelList.querySelectorAll('.model_select_item .model_name');
	let modelChk = modelList.querySelectorAll('.sel_model_list > li');
	let selModelDelete = modelList.querySelector('.sel_model_delete');
	
	selModelDelete.addEventListener('click', function(e){
		e.target.closest('.sel_model').classList.remove('on');

		for(let i = 0; i < modelSelectItem.length; i++){
			modelSelectItem[i].classList.add('on');
			modelSelectName[i].classList.add('no_selected');
		}
	})
	
	modelSelectItem.forEach(el => {
		el.addEventListener('click',function(){
			let _this = event.target.closest('.model_select_item');

			for(let i = 0; i < modelSelectItem.length; i++){
				modelSelectItem[i].classList.remove('on');
				modelSelectName[i].classList.remove('no_selected');
			}

			_this.classList.add('on');

			modelChk.forEach(element => {
				element.classList.remove('on');
				
				if(_this.dataset.select == element.dataset.selectFor){
					element.classList.add('on');
					element.closest('.sel_model').classList.add('on');
				}
			});
		})
	});
}

modelChkPop();

// 인기차량 스와이퍼 썸네일
const halfThumSwiper = new Swiper('.half_thumb_swiper', getSwiperOption({
	target: '.half_thumb_swiper',
	spaceBetween: 20,
	slidesPerView: "auto",
	loop: true,
	addOption: {
		watchSlidesProgress: true,
		allowTouchMove : false,
		loopAdditionalSlides : 30,
	}
}))
// 인기차량 메인 스와이퍼
const halfSwiper = new Swiper('.half_swiper', getSwiperOption({
	target : '.half_swiper',
	slidesPerView : 1,
	navigation : true,
	navigation_cls: 'type05',
	navigationContainer : 'half_nav_container',
	loop : true,
	addOption:{
		effect: "fade",
		thumbs: {
          swiper: halfThumSwiper,
        },
	}
}))


// function halfSwiping(swiper){
// 	let thumUl = document.createElement('ul');
// 	let thumLi = document.createElement('li');
// 	let num = document.createElement('div');
// 	let slide = document.querySelectorAll('.half_swiper .swiper-slide .thum_img img');
	
// 	thumUl.classList.add('thum_ul');
// 	num.classList.add('num');
	
// 	slide.forEach((img,index) => {
// 		let liClone = thumLi.cloneNode(true);
// 		let numText = index+1;
// 		num.innerText = numText;
// 		liClone.append(img.cloneNode(true));
// 		liClone.append(num.cloneNode(true));
// 		thumUl.append(liClone);
// 	});
// 	swiper.el.append(thumUl);
// }

// 자주묻는 질문 스와이퍼
const QnASwiper = new Swiper('.qna_swiper', getSwiperOption({
	target: '.qna_swiper',
	spaceBetween: 20,
	slidesPerView: 4,
	pagination: true,
	loop: true,
	navigation : true,
	navigation_cls : 'type03',
	addOption : {
		slidesPerGroup : 4,
	}
}))



// 인기차량 이후 섹션 인터렉션
function parallexfn(){
	let parallex = document.querySelector('.script--parallax');
	let parallexItem = document.querySelectorAll('.script--parallax > *');
	let html = document.querySelector('html');
	let parallexPrev = document.querySelector('.script--no--parallax');
	let parallexEnd = document.querySelector('.parallex_end');
	// let parallexSection = document.querySelector('.parallex_end section');
	let floatingTop = document.getElementById('CPOfloating').querySelector('[title="top"]');
	let scrolllingState = true;
	let end = false;
	let maxIndex = parallexItem.length-1;

	floatingTop.addEventListener('click',(e)=>{
		scrollInit()
	})

	function scrollInit(){
		html.style = "";
		parallex.style = "";
		scrolllingState = true;
		scrollCount = 0;
	}

	parallexPrev.addEventListener('wheel', (e) => {
		let prevPosition = Math.floor(parallexPrev.getBoundingClientRect().top + parallexPrev.getBoundingClientRect().height);

		if(window.innerHeight >= prevPosition && e.deltaY > 0) nextInteraction(0);
	})

	parallexItem.forEach((el,index)=>{
		el.addEventListener('wheel', (e) =>{
			parallexPrev.removeEventListener('wheel',(e)=>{});
			let els = Math.floor(parallexPrev.getBoundingClientRect().top + parallexPrev.getBoundingClientRect().height);
			let wh = Math.floor(window.innerHeight);
			
			if( wh >= els){
				if(e.deltaY > 0){
					nextInteraction(index+1);
				}else if(e.deltaY < 0){
					prevInteraction(index-1,e);
				}
			}
		})
	})
	
	window.onload = () => {
		reponsive()
	}
	window.onresize = () =>{
		reponsive()
	}

	function reponsive(){
		if(window.innerWidth <= 1920){
			parallexEnd.style.height = '100vh';
			parallexEnd.style.overflowY = 'scroll';
		}
	}
	
	
	function focusAimation(count){
		if(!end){
			parallex.style.top = -((window.innerHeight * count)-1) + 'px';
		}else{
			parallex.style.top = -((window.innerHeight * count)-1) + -(parallexEnd.getBoundingClientRect().height)  + 'px';
			end = false;
		}
		scrolllingState = false;
		setTimeout(()=>{
			scrolllingState = true;
		}, 1000);
	}

	function nextInteraction(count){
		html.style.overflow = 'hidden';
		if(count <= maxIndex && scrolllingState){
			focusAimation(count);
			if(count == maxIndex){
				end = true;
				count = 2;
				let headerBoolean = document.getElementById('CPOheader').classList.contains('fixed');
				if(headerBoolean && window.innerWidth <= 1920){
					setTimeout(()=>{
						parallexEnd.style.paddingTop = '70px';
					}, 1000);
				}else{
					parallexEnd.style.paddingTop = '';
				}
				focusAimation(count);
			}
		}
	}

	function prevInteraction(count, event){
		if(count <= maxIndex && scrolllingState){
			let endHeight =  Math.floor(parallexEnd.getBoundingClientRect().top + parallexEnd.getBoundingClientRect().height)
			parallexEnd.style.paddingTop = '0';
			if(count == -1){
				parallex.style.top = window.innerHeight + 'px';
				html.style = '';
				scrolllingState = true;
			}else if(endHeight == window.innerHeight){
				// console.log(123)
			}else{
				focusAimation(count);
			}
		}
	}
}

parallexfn();
