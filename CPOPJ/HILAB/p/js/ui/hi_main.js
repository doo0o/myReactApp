const HiLabMain = function() {
	const mainHtml = document.querySelector('html');
	const introArea = document.querySelector('.section_intro');
	const introTxt01 = introArea.querySelector('.intro_txt01');
	const introTxt02 = introArea.querySelector('.intro_txt02');
	const introTxt03 = introArea.querySelector('.intro_txt03');
	const introSkip = introArea.querySelector('.btn_skip');
	const introTxt01Tit = introArea.querySelector('.tit');
	const introTxt01Area = introArea.querySelector('.txt_area');
	const scrollArea01 = document.querySelector('.section_wrap.scroll01');
	const statsWrap = scrollArea01.querySelector('.stats_wrap');
	const trendArea = scrollArea01.querySelector('.section_trend');
	const scrollArea02 = document.querySelector('.section_wrap.scroll02');
	const quotWrap = document.querySelector('.quot_wrap');
	const priceArea = document.querySelector('.section_price');
	const scrollArea03 = document.querySelector('.section_wrap.scroll03');
	const inquiryArea = document.querySelector('.section_inquiry');
	const scrollArea04 = document.querySelector('.section_wrap.scroll04');

	let step;
	let animate = false;

	// swiper 세팅
	const tabMain = document.querySelector('.tab_main');
	const btnTabMain = tabMain.querySelector('[aria-controls="tabStatsModel02"]');
	btnTabMain.addEventListener('click', function(){
		const slidestatsModel02 = new Swiper(".slide_tab02", {
			loop:true,
			slidesPerView:1,
			effect:"fade",
			fadeEffect:{
				crossFade:true,
			},
			pagination:{
				el: ".slide_tab02 .swiper-pagination",
				clickable: true,
			},
		});
	});
	const slidestatsModel01 = new Swiper(".slide_tab01", {
		loop:true,
		slidesPerView:1,
		effect:"fade",
		fadeEffect:{
			crossFade:true,
		},
		pagination:{
			el: ".slide_tab01 .swiper-pagination",
			clickable: true,
		},
	});

	// 최하단 스와이퍼
	const slideBasicOpt = {
		loop:true,
		effect:"fade",
		fadeEffect:{
			crossFade:true,
		},
	};
	const slideBasic01 = new Swiper(".slide_basic.list01", slideBasicOpt);
	const slideBasic02 = new Swiper(".slide_basic.list02", slideBasicOpt);
	const slideBasic03 = new Swiper(".slide_basic.list03", slideBasicOpt);
	const slideBasicList = new Swiper(".slide_basic_list", {
		loop:true,
		effect:"fade",
		fadeEffect:{
			crossFade:true,
		},
		navigation: {
			prevEl: ".slide_basic_prev",
			nextEl: ".slide_basic_next",
		},
		on:{
			slideChange:function(e){
				slideBasic01.slideTo(e.realIndex);
				slideBasic02.slideTo(e.realIndex);
				slideBasic03.slideTo(e.realIndex);
			}
		}
	});
	// swiper 세팅

	// 컨텐츠 내부 모션
	const mainShowCont = document.querySelectorAll('.main_show');
	const mainSlideCar = document.querySelectorAll('.tab_main .swiper-container');
	const showCont = new IntersectionObserver((elem) => {
		elem.forEach((el) => {
			if(el.isIntersecting){
				el.target.style.cssText = 'opacity:1;transform:translateY(0);';
			} else {
				el.target.style.cssText = 'opacity:0;transform:translateY(100px);';
			}
		});
	});
	const showCar = new IntersectionObserver((elem) => {
		elem.forEach((el) => {
			if(el.isIntersecting){
				el.target.classList.add('on');
			} else {
				el.target.classList.remove('on');
			}
		});
	});
	mainShowCont.forEach((cont) => {
		showCont.observe(cont);
	});
	mainSlideCar.forEach((car) => {
		showCar.observe(car);
	});
	// //컨텐츠 내부 모션

	// lottie 파일 세팅
	const lottieWrap = document.querySelector('.lottie_wrap');
	const lottie01 = lottieWrap.querySelector('.intro_lottie01');
	const lottie02 = lottieWrap.querySelector('.intro_lottie02');
	const lottie03 = lottieWrap.querySelector('.intro_lottie03');
	const lottieSkip = lottieWrap.querySelector('.intro_lottie_skip');
	const lottieAni = [
		{
			wrapper: lottie01,
			animType: 'svg',
			loop: false,
			autoplay: true,
			path: '../../img/main/lottie/main_01.json',
		},
		{
			wrapper: lottie02,
			animType: 'svg',
			loop: false,
			autoplay: true,
			path: '../../img/main/lottie/main_02.json',
		},
		{
			wrapper: lottie03,
			animType: 'svg',
			loop: false,
			autoplay: true,
			path: '../../img/main/lottie/main_03.json',
		},
	];
	// //lottie 파일 세팅
	
	// let step;
	function start(){
		mainHtml.classList.add('scroll_hidden');
		introTxt01.classList.add('show');
		const introskipShow = setTimeout(function(){
			introSkip.classList.add('show');
		}, 600);
		const introAction01 = setTimeout(function(){
			const lottieItem01 = bodymovin.loadAnimation(lottieAni[0]);
		}, 1000);
		const introAction02 = setTimeout(function(){
			lottie01.classList.add('hide');
			setTimeout(() => {
				lottie01.classList.add('del');
			}, 1000);
		}, 4500);
		const introAction03 = setTimeout(function(){
			introTxt01Tit.classList.add('trans');
			introTxt01Area.classList.add('show');
			const lottieItem02 = bodymovin.loadAnimation(lottieAni[1]);
		}, 5500);
		const introAction04 = setTimeout(function(){
			introTxt01.classList.remove('show');
		}, 9000);
		const introAction05 = setTimeout(function(){
			lottie02.classList.add('hide');
			setTimeout(() => {
				lottie02.classList.add('del');
			}, 1000);
		}, 10000);
		const introAction06 = setTimeout(function(){
			introTxt02.classList.add('show');
		}, 10500);
		const introAction07 = setTimeout(function(){
			const lottieItem03 = bodymovin.loadAnimation(lottieAni[2]);
		}, 11000);
		const introAction08 = setTimeout(function(){
			introTxt02.classList.remove('show');
		}, 13000);
		const introAction09 = setTimeout(function(){
			introTxt03.classList.add('show');
			introSkip.classList.remove('show');
		}, 14000);
		const startStep = setTimeout(function(){
			step = 0;
		}, 15000);
		introSkip.addEventListener('click', function(){
			this.classList.remove('show');
			clearTimeout(introskipShow);
			clearTimeout(introAction01);
			clearTimeout(introAction02);
			clearTimeout(introAction03);
			clearTimeout(introAction04);
			clearTimeout(introAction05);
			clearTimeout(introAction06);
			clearTimeout(introAction07);
			clearTimeout(introAction08);
			clearTimeout(introAction09);
			clearTimeout(startStep);
			introTxt01.classList.remove('show');
			introTxt02.classList.remove('show');
			introTxt03.classList.add('show');
			lottie01.classList.add('hide');
			lottie02.classList.add('hide');
			lottie03.classList.add('hide');
			setTimeout(() => {
				lottie01.classList.add('del');
				lottie02.classList.add('del');
				lottie03.classList.add('del');
			}, 1000);
			lottieSkip.classList.add('show');
			step = 0;
		});
	}
	start();
	// 섹션별 스텝
	function pageStep01(state){
		if(state !=='up' ){
			step = 0;
			animate = true;
			scrollArea01.classList.add('start');
			setTimeout(() => {
				step = 1;
				animate = false;
			}, 1000);
		} else {
			scrollArea01.classList.remove('start');
			animate = true;
			setTimeout(() => {
				step = 0;
				animate = false;
			}, 1000);
		}
	}
	function pageStep02(state){
		if(state !== 'up'){
			step = 1;
			animate = true;
			trendArea.classList.add('height');
			setTimeout(() => {
				step = 2;
				animate = false;
				scrollArea01.classList.add('scroll');
				mainHtml.classList.remove('scroll_hidden');
			}, 1000);
		} else {
			if(scrollArea01.scrollTop <= 0){
				animate = true;
				trendArea.classList.remove('height');
				mainHtml.classList.add('scroll_hidden');
				setTimeout(() => {
					step = 1;
					animate = false;
					scrollArea01.classList.remove('scroll');
				}, 1000);
			}
		}
	}
	function pageStep03(state){
		const trendSecH = scrollArea01.querySelector('.section_trend.height').clientHeight;
		if(state !== 'up'){
			step = 2;
			if((scrollArea01.scrollTop + window.innerHeight) >= (statsWrap.clientHeight + trendSecH)){
				animate = true;
				scrollArea02.classList.add('start');
				mainHtml.classList.add('scroll_hidden');
				setTimeout(() => {
					step = 3;
					animate = false;
				}, 1000);
			}
		} else {
			if((window.scrollY + window.innerHeight) <=  scrollArea01.clientHeight){
				animate = true;
				scrollArea02.classList.remove('start');
				mainHtml.classList.add('scroll_hidden');
				setTimeout(() => {
					mainHtml.classList.remove('scroll_hidden');
					step = 2;
					animate = false;
				}, 1000);
			}
		}
	}
	function pageStep04(state){
		if(state !== 'up'){
			step = 3;
			animate = true;
			priceArea.classList.add('height');
			setTimeout(() => {
				step = 4;
				animate = false;
				scrollArea02.classList.add('scroll');
			}, 1000);
		} else {
			if(scrollArea02.scrollTop <= 0){
				animate = true;
				priceArea.classList.remove('height');
				mainHtml.classList.add('scroll_hidden');
				scrollArea02.classList.remove('scroll');
				setTimeout(() => {
					step = 3;
					animate = false;
				}, 1000);
			}
		}
	}
	function pageStep05(state){
		const priceSecH = scrollArea02.querySelector('.section_price.height').clientHeight;
		if(state !== 'up'){
			step = 4;
			if((scrollArea02.scrollTop + window.innerHeight) >= (quotWrap.clientHeight + priceSecH)){
				animate = true;
				scrollArea03.classList.add('start');
				setTimeout(() => {
					step = 5;
					animate = false;
				}, 1000);
			}
		} else {
			animate = true;
			scrollArea03.classList.remove('start');
			setTimeout(() => {
				step = 4;
				animate = false;
			}, 1000);
		}
	}
	function pageStep06(state){
		if(state !== 'up'){
			step = 5;
			animate = true;
			inquiryArea.classList.add('change');
			setTimeout(() => {
				step = 6;
				animate = false;
			}, 1000);
		} else {
			animate = true;
			inquiryArea.classList.remove('change');
			setTimeout(() => {
				step = 5;
				animate = false;
			}, 1000);
		}
	}
	function pageStep07(state){
		if(state !== 'up'){
			step = 6;
			animate = true;
			scrollArea04.classList.add('start');
			setTimeout(() => {
				step = 7;
				animate = false;
			}, 1000);
		} else {
			if(scrollArea04.scrollTop <= 0){
				animate = true;
				scrollArea04.classList.remove('start');
				setTimeout(() => {
					step = 6;
					animate = false;
				}, 1000);
			}
		}
	}
	// //섹션별 스텝

	// 스크롤 이벤트
	window.addEventListener('wheel', function(e){
		e.preventDefault();
		e.stopPropagation();
		if(animate === false && e.deltaY > 0){
			switch (step) {
				case 0:
					pageStep01();
				break;
				case 1:
					pageStep02();
				break;
				case 2:
					pageStep03();
				break;
				case 3:
					pageStep04();
				break;
				case 4:
					pageStep05();
				break;
				case 5:
					pageStep06();
				break;
				case 6:
					pageStep07();
				break;
			}
		} else if(animate === false && e.deltaY < 0){
			const state = 'up';
			switch (step) {
				case 7:
					pageStep07(state);
				break;
				case 6:
					pageStep06(state);
				break;
				case 5:
					pageStep05(state);
				break;
				case 4:
					pageStep04(state);
				break;
				case 3:
					pageStep03(state);
				break;
				case 2:
					pageStep02(state);
				break;
				case 1:
					pageStep01(state);
				break;
			}
		}
	});
	// //스크롤 이벤트

	// 태블릿용 터치 이벤트
	let touchstartY;
	let touchendY;
	window.addEventListener('touchstart', function(e){
		touchstartY = e.touches[0].clientY;
	});
	window.addEventListener('touchend', function(e){
		touchendY = e.changedTouches[0].clientY - touchstartY;
		if(animate === false && touchendY < 0){
			switch (step) {
				case 0:
					pageStep01();
				break;
				case 1:
					pageStep02();
				break;
				case 2:
					pageStep03();
				break;
				case 3:
					pageStep04();
				break;
				case 4:
					pageStep05();
				break;
				case 5:
					pageStep06();
				break;
				case 6:
					pageStep07();
				break;
			}
		} else if(animate === false && touchendY > 0) {
			const state = 'up';
			switch (step) {
				case 7:
					pageStep07(state);
				break;
				case 6:
					pageStep06(state);
				break;
				case 5:
					pageStep05(state);
				break;
				case 4:
					pageStep04(state);
				break;
				case 3:
					pageStep03(state);
				break;
				case 2:
					pageStep02(state);
				break;
				case 1:
					pageStep01(state);
				break;
			}
		}
	});
	// //태블릿용 터치 이벤트
}