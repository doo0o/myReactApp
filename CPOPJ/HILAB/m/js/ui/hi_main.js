class HilabMainInteraction {
	constructor() {

		this.body = document.querySelector('body');
		this.mainHeader = this.body.querySelector('.h_header_main');
		this.skipBtn = this.body.querySelector('.skip_btn');
		this.actionBar = this.body.querySelector('#HIactionbar');
		this.scrollWrap01 = this.body.querySelector('.scroll_con01');
		this.scrollWrap02 = this.body.querySelector('.scroll_con02');

		this.video1 = this.body.querySelector('.main_video1');
		this.video2 = this.body.querySelector('.main_video2');
		this.video3 = this.body.querySelector('.main_video3');

		this.intro = this.body.querySelector('.main_intro');
		this.introVideo = this.intro.querySelector('.main_intro_video');
		this.introTxt1 = this.intro.querySelector('.main_intro_txt1');
		this.introTxt2 = this.intro.querySelector('.main_intro_txt2');
		this.introTxt3 = this.intro.querySelector('.main_intro_txt3');
		this.introTxt4 = this.intro.querySelector('.main_intro_txt4');
		this.introbg1 = this.intro.querySelector('.intro_bg1');
		this.introbg2 = this.intro.querySelector('.intro_bg2');
		this.introbrige = this.intro.querySelector('.main_intro_brige');

		this.mainContents = this.body.querySelector('.main_contents');
		this.con1 = this.mainContents.querySelector('.main_con1');
		this.con2 = this.mainContents.querySelector('.main_con2');
		this.con3 = this.mainContents.querySelector('.main_con3');
		this.con4 = this.mainContents.querySelector('.main_con4');
		this.fixCon = this.mainContents.querySelector('.main_con4_top');
		this.con4_1 = this.mainContents.querySelector('.main_con4_1');
		this.con5 = this.mainContents.querySelector('.main_con5');
		this.con6 = this.mainContents.querySelector('.main_con6');

		this.motionBox = this.mainContents.querySelector('.fix_motion_wrap1');
		this.motionFixCon = this.mainContents.querySelector('.last_fix_wrap');

		// this.carSwiper = null;

		this.intro1 = null;
		this.intro2 = null;
		this.intro3 = null;
		this.intro4 = null;
		this.intro5 = null;
		this.intro_end = null;

		this.winH = window.innerHeight;
		// this.dpconsole = new DpConsole();

		// 인기 자동차 첫번째탭 - 모션 이벤트 추가 슬라이더
		// this.carSlider = document.querySelector('.slider1');
		// this.carSliderOpt = {
		// 	pagination: {
		// 		el: '.slider1 .swiper-pagination',
		// 	},
		// 	effect: 'fade',
		// 	on: {
		// 		init() {
		// 		this.disable();
		// 		setTimeout(() => {
		// 			$('.main_con3').addClass('motion_complete');
		// 			this.enable();
		// 			HI.tab(); // 모션 끝나면 탭 활성화
		// 			console.log('탭, 슬라이드 활성화');
		// 		}, 3000);
		// 		},
		// 	},
		// };
		this.test = new Swiper('.slider1', {
			pagination: {
				el: '.slider1 .swiper-pagination',
			},
			effect: 'fade',
			on: {
				init() {
					// setTimeout(() => {
					// 	$('.main_con3').addClass('motion_complete');
					// 	this.enable();
					// }, 3000);
					HI.tab(); // 모션 끝나면 탭 활성화
				},
			},
		});
		// 인기 자동차 두번째 탭 슬라이더
		this.carSliderTab = new Swiper('.slider2', {
			pagination: {
				el: '.slider2 .swiper-pagination',
			},
			effect: 'fade',
		});
		// 마지막 컨텐츠 슬라이더
		this.thumbSwiper = new Swiper('.slider3', {
			pagination: {
				el: '.slider3 .swiper-pagination',
			},
			spaceBetween: 23,
			slidesPerView: 'auto',
		});
		// 인트로 로티 애니메이션 JSON 배열
		this.lottieAni = [
			{
				wrapper: this.video1,
				animType: 'svg',
				loop: false,
				autoplay: true,
				path: '../../img/main/lottie/main_1.json',
			},
			{
				wrapper: this.video2,
				animType: 'svg',
				loop: false,
				autoplay: true,
				path: '../../img/main/lottie/main_2.json',
			},
			{
				wrapper: this.video3,
				animType: 'svg',
				loop: false,
				autoplay: true,
				path: '../../img/main/lottie/main_3.json',
			},
		];

		window.addEventListener('scroll', this.scrollEvt.bind(this));

		// Pin 모션 추가 - Gsap ScrollMagic
		this.scrollController = new ScrollMagic.Controller();

		// 브랜드 - 모델명, 시세그래프 :: 자동차 모션 타임라인
		const timeLine = gsap
			.timeline()
			// .to('.main_con4_top .bg_howmuch', {
			// 	y: -250,
			// 	opacity: 1,
			// 	duration: .3,
			// })
			.to('.main_con4_top .con_tit', { opacity: 1, duration: .3 })
			.to('.main_con4_top .movecar', { x: '10%', duration: 1 })
			.to('.main_con4_top .con_tit', {
				y: -10,
				opacity: 0,
				duration: .3,
			})
			// .to('.main_con4_top .bg_howmuch', 1, {
			// 	y: -50,
			// 	opacity: 0,
			// 	duration: .5,
			// 	ease: 'elastic',
			// }, '-=0.5')
			.to('.main_con4_top .movecar', 1.2, {
				y: 15,
				scale: 0.7,
				x: '-50%',
				duration: 1,        
			}, '-=1')
			// .to('.main_con4_top .car_info.top, .main_con4_top .bg_rightop', {
			// 	y: 0,
			// 	opacity: 1,
			// 	duration: .5,
			// }, '-=.5');
			.to('.main_con4_top .car_info.top', {
				y: 0,
				opacity: 1,
				duration: .5,
			}, '-=.5');

			// 브랜드 - 모델명, 시세그래프 :: 자동차 모션 타임라인 트리거
			const scene1 = new ScrollMagic.Scene({
				triggerElement: '.fix_motion_wrap1',
				duration: 500,
				triggerHook: 0.4,
			})
			.setTween(timeLine)
			// .addIndicators()
			.addTo(this.scrollController);

		// 브랜드 - 모델명, 시세그래프 :: 자동차 모션 Pin 고정
			new ScrollMagic.Scene({
				triggerElement: '.main_con4',
				duration: 400,
				triggerHook: 0,
			})
			.setPin('.main_con4')
			// .addIndicators()
			.addTo(this.scrollController);

		// 매매용/ 개인용 차량 안내 타임라인 scene
		const anistep = gsap
		.timeline()
		.to('.main_con5 .tit_registration', { y: -10, opacity: 1 })
		.to('.main_con5 .circle_mask', { scale: 1, opacity: 1 })
		.to('.main_con5 .car', { x: 30, opacity: 1, duration: .7, delay: .5 })
		.to('.main_con5 .bg_circle', { opacity: 1, duration: 0.5 }, '-=0.5')
		.to(
			'.main_con5 .car',
			{ x: -250, opacity: 0, duration: 1, delay: 0.8 }
		)
		.to('.main_con5 .tit_registration, .main_con5 .text_registration', {
			y: -10,
			opacity: 0,
		})
		.to('.circle_mask', .5, { backgroundColor: '#35798F', duration: .5 }, '-=.5')
		.to('.intro_bg3', .7, { backgroundColor: '#001F42', duration: .5 }, '-=.5')
		.to('.main_con5 .tit_cert', { y: -10, opacity: 1, duration: .5 }, '-=.5')
		.to('.main_con5 .text_cert', { y: -10, opacity: 1, duration: .5 }, '-=.5')
		.fromTo(
			'.main_con5 .person',  
			{ y: 50, opacity: 0 },
			{ y: 0, opacity: 1, duration: 1.5, delay: .5 }, '-=1'
		);

		// 매매용/ 개인용 차량 안내 트리거
		const scene3 = new ScrollMagic.Scene({
			triggerElement: '.last_fix_wrap',
			duration: 900,
			triggerHook: 0,
		})
		.setTween(anistep)
		// .addIndicators()
		.addTo(this.scrollController);

		// 매매용/ 개인용 차량 안내 Pin 고정
		new ScrollMagic.Scene({
			triggerElement: '.main_con5',
			duration: 800,
			triggerHook: 0,
		})
		.setPin('.main_con5')
		// .addIndicators()
		.addTo(this.scrollController);

		// 컨텐츠 요소 하나씩 보이기 :: 스크롤 감지
		const spyEls = document.querySelectorAll('.scroll-spy');
		spyEls.forEach(function (spyEl) {
			new ScrollMagic.Scene({
				triggerElement: spyEl,
				triggerHook: 0.7,
			})
			.setClassToggle(spyEl, 'show')
			.addTo(new ScrollMagic.Controller());
		});

		// 인트로 브릿지 텍스트 노출 조금 더 빨리 :: 스크롤 감지
		new ScrollMagic.Scene({
			triggerElement: '.scroll-spy-1',
			triggerHook: 1,
		})
		.setClassToggle('.scroll-spy-1', 'show')
		.addTo(new ScrollMagic.Controller());      
	}

	scrollEvt() {
		let winScrollTop = window.pageYOffset;
		let introBrige = document.querySelector('.main_intro_brige');
		let con4Top = this.con3.offsetTop + this.con3.clientHeight;
		let con5Top = con4Top + this.con4.clientHeight;

		// main_con1 헤더 활성화
		if(winScrollTop >= this.con1.offsetTop) {
			this.mainHeader.classList.add('reverse');
		} else {
			this.mainHeader.classList.remove('reverse');
		}

		// 메인 브릿지 페이지 배경 및 main_con1 배경컬러 제어 추가 - 기획 요청(20221220)
		if(winScrollTop >= this.con1.offsetTop - 200) {
			introBrige.classList.add('bg-change');
			this.con1.classList.add('bg-change');
		} else {
			introBrige.classList.remove('bg-change');
			this.con1.classList.remove('bg-change');
		}

		// main_con4 핀 되는 요소 헤더 활성화
		if(winScrollTop > this.con3.offsetTop + this.con3.clientHeight - 50) {
			this.mainHeader.classList.remove('reverse');
		} else if(winScrollTop >= this.con3.offsetTop && winScrollTop <= this.con3.offsetTop + this.con3.clientHeight - 50) {
			this.mainHeader.classList.add('reverse');
		}
		// main_con5 핀 되는 요소 헤더 활성화
		if (winScrollTop >= con5Top + 400) {
			this.mainHeader.classList.add('reverse')
		} else if(winScrollTop < con5Top + 400 && winScrollTop > con5Top) {
			this.mainHeader.classList.remove('reverse')
		}
		// main_con6 마지막 컨텐츠 헤더 활성화
		if(winScrollTop >= this.con6.offsetTop - 100) {
			if (!this.mainHeader.classList.contains('reverse')) {
				return;
			}
			this.mainHeader.classList.remove('reverse');
		} 

		// 스크롤 위치에 따른 swiper init (자동차 게이지 애니메이션때문에 별도로 호출)
		if (winScrollTop > this.con3.offsetTop - 400) {
			const tabCon = document.querySelector('.tab_cont');
			if (tabCon.classList.contains('action')) {
				return;
			}
			tabCon.classList.add('action');
			// this.carSwiper = new Swiper(this.carSlider, this.carSliderOpt);
		}
		// 인트로 화면 가리기 및 액션바 노출
		if (winScrollTop >= this.con1.offsetTop) {
			this.intro.classList.add('hidden');
			this.actionBar.classList.remove('hidden');
		} else {
			this.actionBar.classList.add('hidden');
			if (winScrollTop !== 0) {
				this.intro.classList.remove('hidden');
			}
		}
	}

  	// 최초로 실행 (초기 인트로 비디오 재생)
	start() {
		const animItem1 = bodymovin.loadAnimation(this.lottieAni[0]);
		this.mainHeader.classList.remove('reverse');
		this.body.classList.add('no_scroll');
		this.actionBar.classList.add('hidden');
		this.skipBtn.addEventListener('click', this.skipAction.bind(this));

		setTimeout(() => {
		this.skipBtn.classList.add('show');
		}, 800);

		this.intro1 = setTimeout(() => {
		this.intro.classList.add('action');
		this.introTxt1.classList.add('action');
		}, 100);
		this.intro2 = setTimeout(() => {
		this.video1.classList.add('hidden');
		this.introTxt1.classList.add('scale');
		const animItem2 = bodymovin.loadAnimation(this.lottieAni[1]);
		}, 2500);
		this.intro3 = setTimeout(() => {
		this.introTxt2.classList.add('action');
		}, 3000);
		this.intro4 = setTimeout(() => {
		this.video2.classList.add('hidden');
		this.introTxt1.classList.add('hidden');
		this.introTxt2.classList.add('hidden');
		this.introTxt3.classList.add('action');
		const animItem3 = bodymovin.loadAnimation(this.lottieAni[2]);
		}, 5800);
		this.intro5 = setTimeout(() => {
		this.skipBtn.classList.add('hidden');
		this.introTxt3.classList.add('hidden');
		this.introTxt4.classList.add('action');
		}, 8400);
		this.intro_end = setTimeout(() => {
		this.intro.classList.add('main_intro_end');
		this.mainContents.classList.add('ready');
		this.body.classList.remove('no_scroll');
		}, 9500);
	}

	skipAction() {
		clearTimeout(this.intro1);
		clearTimeout(this.intro2);
		clearTimeout(this.intro3);
		clearTimeout(this.intro4);
		clearTimeout(this.intro5);
		clearTimeout(this.intro_end);
		this.introVideo.style.display = 'none';
		this.intro.classList.add('main_intro_end');
		this.intro.classList.add('skip_page');
		this.mainContents.classList.add('ready');
		this.introTxt1.classList.add('hidden');
		this.introTxt2.classList.add('hidden');
		this.introTxt3.classList.add('hidden');
		this.introTxt4.classList.add('action');
		this.body.classList.remove('no_scroll');
		this.skipBtn.classList.add('hidden');
	}
}
