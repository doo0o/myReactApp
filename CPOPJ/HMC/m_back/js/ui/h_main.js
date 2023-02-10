function main() {
	var scrollHide = null;
	var scrollPosition = null;
	var winH = $(window).height();
    var hashTag = {
        scrollAction: function() {
            var scroll = $(window).scrollTop();
			// var headerH = $("#header").length ? $('#header').height() : false;
			// var stickyH = $("#stickyTit").length ? $('#stickyTit').height() : false;

            if(scroll >= 50) {
				$('html').removeClass('headerHide');
				$("#stickyTit").addClass('sticky');
				if($('.hashtag').hasClass('sticky')) {//hashtag 상단에 붙으면 초기세팅 없애기
					$('.hashtag').removeClass('off');
				}
				if(scroll > scrollPosition) {// 스크롤 다운 시, h_navi 숨기기  /
					$('html').addClass('headerHide');
					if($("#CPOheader").length > 0){
						$("#stickyTit").removeClass('space50');
					}
				} else {// 스크롤 UP 시, h_navi 보여주기
					$('html').removeClass('headerHide');
					$('.greeting').css('margin-top', '-47px');

					if($("#CPOheader").length > 0){
						$("#stickyTit").addClass('space50');
					}
				}
			} else {
				$("#stickyTit").removeClass('sticky');
				$("#stickyTit").removeClass('space50');
			}
            scrollPosition = scroll;
        },

        init: function() {
            $(window).on('scroll',function(event){
				hashTag.scrollAction();
			});
        }
    };

	var greeting = {
		startAction: function() {
			setTimeout(function() {
				$('.greeting .cont_text').addClass('on');
				$('.greeting .cont_img').addClass('on');
			}, 1000);
		},
		scrollAction: function() {
			$(window).on('mousewheel DOMMouseScroll ontouchmove',function(e){
				if(e.originalEvent.wheelDelta < 50) {
					$('.greeting .cont_search').addClass('on');
					$('.greeting .cont_text').addClass('off').removeClass('on');
					$('.greeting .cont_img').css({'top': '33%'})
				}
			});
		},
		init: function() {
			$(document).ready(function() {
				greeting.startAction();
				greeting.scrollAction();
			});
			
        }
	};

	var coming = {
		scrollAction: function() {
			var scrollPosition = $('.coming').offset().top;
			var scroll = $(window).scrollTop();
			if(scroll >= scrollPosition/2){
				$('.coming').addClass('on');
				var parallaxPercent = Math.floor(scrollPosition - scroll) / $(window).height()*100;				
				$('.coming .tit').css( //계산된 값을 엘리먼트에 적용
					'right', (50 - parallaxPercent*2) + '%'
				);
			}
		},
		init: function() {
			$(window).scroll(function() { 
				coming.scrollAction()
			});
		}
	};

	var ranking  = {
		startAction: function() {
			var imgH = $('.ranking .img_area').height();
			$('.ranking .cont_img').css('height', imgH + 'px');
		},
		scrollAction: function() {
			var scrollPosition = $('.ranking').offset().top;
			var scroll = $(window).scrollTop();
			if(scroll >= scrollPosition - 360){
				$('.ranking .cont_text').addClass('on');
			} else {
				$('.ranking .cont_text').removeClass('on');
			}

			if(scroll >= scrollPosition - 47) {
				$('.ranking').css('height', winH);
				$('.ranking_wrap').addClass('on');
				$('.ranking_wrap').on('scroll touchmove mousewheel', function(e) {
					e.preventDefault();
					e.stopPropagation();
					
					if($('.ranking_wrap').hasClass('on')) {
						$('.ranking .img1').addClass('on');
						setTimeout(() => {
							$('.ranking .img1').addClass('off');
							$('.ranking .img2').addClass('on');
						},1000);
						setTimeout(() => {
							$('.ranking .img2').addClass('off');
							$('.ranking .img3').addClass('on');
						},3000);
						setTimeout(() => {
							$('.ranking .img3').addClass('off');
						},4000);
						setTimeout(() => {
							$('.ranking [class*=img]').removeClass('on').removeClass('off');
							$('.ranking_wrap').removeClass('on');
							ranking.endAction();
						},5000);
					} else {
						$('.ranking_wrap').removeClass('on');
						$('.ranking [class*=img]').removeClass('on').removeClass('off');
					}
				});
			} else {
				$('.ranking_wrap').removeClass('on');
				ranking.endAction();
				return false;
			}
		},
		endAction: function() {
			$('.ranking_wrap').off('scroll touchmove mousewheel');
		},
		init: function() {
			$(document).ready(function() {
				ranking.startAction();
			});
			$(window).scroll(function() { 
				ranking.scrollAction()
			});
		}
	};	

    hashTag.init();
    greeting.init();
	coming.init();
	ranking.init();
}
$(function() {
    // main();
	window.addEventListener('load', () =>{
		setTimeout(() => {
			scrollTo(0, 0);
			$('.hashtag').addClass('off');
		}, 100);
	});

	// const scrItem = $('.main_section');
	// scrItem.off().on('mousewheel DOMMouseScroll', function (e) {
	// 	if (!$('html, body').is(':animated')) {
	// 		if (e.originalEvent.wheelDelta < 0) {
	// 			dirDown();
	// 		} else {
	// 			dirUp();
	// 		}
	// 	} else {
	// 		e.stopPropagation();
	// 		return false;
	// 	}
	// });

	// scrItem.swipe({
	// 	swipe:function(event, direction) {
	// 		switch(direction) {
	// 			case 'up':
	// 				dirDown();
	// 				break;
	// 			case 'down':
	// 				dirUp();
	// 				break;
	// 			default:
	// 				return;
	// 		}
	// 	}
	// });

	function dirDown () { // up
		if (!$('.hmj-wrap').hasClass('active')) {
			$('.hmj-wrap').addClass('active');
			tScrIdx = $('.scr-item.active-idx').index();
			scrIdxCnt = $('.scr-idx-list a.active').parent().index();
			$('html, body').animate({'overflow':'visible'}, 1200, function () {
				$('.hmj-wrap').removeClass('active');
			});
			if (tScrIdx !== $(this.length)) {
				if (!$('.gall').hasClass('active-idx') || $(window).width() <= tbl) {
					scrItem.eq(tScrIdx + 1).addClass('active');
					scrItem.eq(tScrIdx + 1).addClass('active-idx').siblings().removeClass('active-idx');
					scrIdxLst.parent().eq(tScrIdx + 1).find('a').addClass('active').parent().siblings().find('a').removeClass('active');
				}
			}
			if (!(scrIdxCnt + 1) == 0) {
				mcHeader.parent().addClass('header-fixed');
				mcHeader.parent().css('top', -mcHeader.height());
				$('.btn-top-box').addClass('active');
			}
			if ((tScrIdx + 1) == scrItem.length) {
				ftrCnt.addClass('active');
				setTimeout(function () {
					ftrCnt.stop().animate({ scrollTop: '1' }, '0');
				}, secVal[3]);
			}
			if ($('.gall').hasClass('active-idx')) {
				if ($('.scr-item.gall-chk').hasClass('end')) {
					$('.scr-item.gall-chk').removeClass('gall');
					scrItem.eq(tScrIdx + 1).addClass('active');
					scrItem.eq(tScrIdx + 1).addClass('active-idx').siblings().removeClass('active-idx');
					scrIdxLst.parent().eq(tScrIdx + 1).find('a').addClass('active').parent().siblings().find('a').removeClass('active');
				}
			} else {
				$('.scr-item.gall-chk.active-idx').addClass('gall');
			}
			return false;
		}
	}
	function dirUp () { // down
		if (!$('.hmj-wrap').hasClass('active')) {
			$('.hmj-wrap').addClass('active');
			tScrIdx = $('.main_section.active-idx').index();
			$('html, body').animate({'overflow':'visible'}, 1200, function () {
				$('.hmj-wrap').removeClass('active');
			});
			if (tScrIdx !== 0) {				
				scrItem.eq(tScrIdx).removeClass('active');
				scrItem.eq(tScrIdx - 1).addClass('active-idx').siblings().removeClass('active-idx');				
			}
			return false;
		}
	}
})

// function main() {
// 	var scrollHide = null;
// 	var scrollPosition = null;
// 	var winH = $(window).height();
//     var hashTag = {
//         scrollAction: function() {
//             var scroll = $(window).scrollTop();
// 			// var headerH = $("#header").length ? $('#header').height() : false;
// 			// var stickyH = $("#stickyTit").length ? $('#stickyTit').height() : false;

//             if(scroll >= 50) {
// 				$('html').removeClass('headerHide');
// 				$("#stickyTit").addClass('sticky');
// 				if($('.hashtag').hasClass('sticky')) {//hashtag 상단에 붙으면 초기세팅 없애기
// 					$('.hashtag').removeClass('off');
// 				}
// 				if(scroll > scrollPosition) {// 스크롤 다운 시, h_navi 숨기기  /
// 					$('html').addClass('headerHide');
// 					if($("#CPOheader").length > 0){
// 						$("#stickyTit").removeClass('space50');
// 					}
// 				} else {// 스크롤 UP 시, h_navi 보여주기
// 					$('html').removeClass('headerHide');
// 					$('.greeting').css('margin-top', '-47px');

// 					if($("#CPOheader").length > 0){
// 						$("#stickyTit").addClass('space50');
// 					}
// 				}
// 			} else {
// 				$("#stickyTit").removeClass('sticky');
// 				$("#stickyTit").removeClass('space50');
// 			}
//             scrollPosition = scroll;
//         },

//         init: function() {
//             $(window).on('scroll',function(event){
// 				hashTag.scrollAction();
// 			});
//         }
//     };

// 	var greeting = {
// 		startAction: function() {
// 			setTimeout(function() {
// 				$('.greeting .cont_text').addClass('on');
// 				$('.greeting .cont_img').addClass('on');
// 			}, 1000);
// 		},
// 		scrollAction: function() {
// 			$(window).on('mousewheel DOMMouseScroll ontouchmove',function(e){
// 				if(e.originalEvent.wheelDelta < 50) {
// 					$('.greeting .cont_search').addClass('on');
// 					$('.greeting .cont_text').addClass('off').removeClass('on');
// 					$('.greeting .cont_img').css({'top': '33%'})
// 				}
// 			});
// 		},
// 		init: function() {
// 			$(document).ready(function() {
// 				greeting.startAction();
// 				greeting.scrollAction();
// 			});
			
//         }
// 	};

// 	var coming = {
// 		scrollAction: function() {
// 			var scrollPosition = $('.coming').offset().top;
// 			var scroll = $(window).scrollTop();
// 			if(scroll >= scrollPosition/2){
// 				$('.coming').addClass('on');
// 				var parallaxPercent = Math.floor(scrollPosition - scroll) / $(window).height()*100;				
// 				$('.coming .tit').css( //계산된 값을 엘리먼트에 적용
// 					'right', (50 - parallaxPercent*2) + '%'
// 				);
// 			}
// 		},
// 		init: function() {
// 			$(window).scroll(function() { 
// 				coming.scrollAction()
// 			});
// 		}
// 	};

// 	var ranking  = {
// 		startAction: function() {
// 			var imgH = $('.ranking .img_area').height();
// 			$('.ranking .cont_img').css('height', imgH + 'px');
// 		},
// 		scrollAction: function() {
// 			var scrollPosition = $('.ranking').offset().top;
// 			var scroll = $(window).scrollTop();
// 			if(scroll >= scrollPosition - 360){
// 				$('.ranking .cont_text').addClass('on');
// 			} else {
// 				$('.ranking .cont_text').removeClass('on');
// 			}

// 			if(scroll >= scrollPosition - 47) {
// 				$('.ranking').css('height', winH);
// 				$('.ranking_wrap').addClass('on');
// 				$('.ranking_wrap').on('scroll touchmove mousewheel', function(e) {
// 					e.preventDefault();
// 					e.stopPropagation();
					
// 					if($('.ranking_wrap').hasClass('on')) {
// 						$('.ranking .img1').addClass('on');
// 						setTimeout(() => {
// 							$('.ranking .img1').addClass('off');
// 							$('.ranking .img2').addClass('on');
// 						},1000);
// 						setTimeout(() => {
// 							$('.ranking .img2').addClass('off');
// 							$('.ranking .img3').addClass('on');
// 						},3000);
// 						setTimeout(() => {
// 							$('.ranking .img3').addClass('off');
// 						},4000);
// 						setTimeout(() => {
// 							$('.ranking [class*=img]').removeClass('on').removeClass('off');
// 							$('.ranking_wrap').removeClass('on');
// 							ranking.endAction();
// 						},5000);
// 					} else {
// 						$('.ranking_wrap').removeClass('on');
// 						$('.ranking [class*=img]').removeClass('on').removeClass('off');
// 					}
// 				});
// 			} else {
// 				$('.ranking_wrap').removeClass('on');
// 				ranking.endAction();
// 				return false;
// 			}
// 		},
// 		endAction: function() {
// 			$('.ranking_wrap').off('scroll touchmove mousewheel');
// 		},
// 		init: function() {
// 			$(document).ready(function() {
// 				ranking.startAction();
// 			});
// 			$(window).scroll(function() { 
// 				ranking.scrollAction()
// 			});
// 		}
// 	};	

//     hashTag.init();
//     greeting.init();
// 	coming.init();
// 	ranking.init();
// }
// $(function() {
//     // main();
// 	window.addEventListener('load', () =>{
// 		setTimeout(() => {
// 			scrollTo(0, 0);
// 			$('.hashtag').addClass('off');
// 		}, 100);
// 	});

// 	const scrItem = $('.main_section');
// 	scrItem.off().on('mousewheel DOMMouseScroll', function (e) {
// 		if (!$('html, body').is(':animated')) {
// 			if (e.originalEvent.wheelDelta < 0) {
// 				dirDown();
// 			} else {
// 				dirUp();
// 			}
// 		} else {
// 			e.stopPropagation();
// 			return false;
// 		}
// 	});

// 	scrItem.swipe({
// 		swipe:function(event, direction) {
// 			switch(direction) {
// 				case 'up':
// 					dirDown();
// 					break;
// 				case 'down':
// 					dirUp();
// 					break;
// 				default:
// 					return;
// 			}
// 		}
// 	});

// 	function dirDown () { // up
// 		if (!$('.hmj-wrap').hasClass('active')) {
// 			$('.hmj-wrap').addClass('active');
// 			tScrIdx = $('.scr-item.active-idx').index();
// 			scrIdxCnt = $('.scr-idx-list a.active').parent().index();
// 			$('html, body').animate({'overflow':'visible'}, 1200, function () {
// 				$('.hmj-wrap').removeClass('active');
// 			});
// 			if (tScrIdx !== $(this.length)) {
// 				if (!$('.gall').hasClass('active-idx') || $(window).width() <= tbl) {
// 					scrItem.eq(tScrIdx + 1).addClass('active');
// 					scrItem.eq(tScrIdx + 1).addClass('active-idx').siblings().removeClass('active-idx');
// 					scrIdxLst.parent().eq(tScrIdx + 1).find('a').addClass('active').parent().siblings().find('a').removeClass('active');
// 				}
// 			}
// 			if (!(scrIdxCnt + 1) == 0) {
// 				mcHeader.parent().addClass('header-fixed');
// 				mcHeader.parent().css('top', -mcHeader.height());
// 				$('.btn-top-box').addClass('active');
// 			}
// 			if ((tScrIdx + 1) == scrItem.length) {
// 				ftrCnt.addClass('active');
// 				setTimeout(function () {
// 					ftrCnt.stop().animate({ scrollTop: '1' }, '0');
// 				}, secVal[3]);
// 			}
// 			if ($('.gall').hasClass('active-idx')) {
// 				if ($('.scr-item.gall-chk').hasClass('end')) {
// 					$('.scr-item.gall-chk').removeClass('gall');
// 					scrItem.eq(tScrIdx + 1).addClass('active');
// 					scrItem.eq(tScrIdx + 1).addClass('active-idx').siblings().removeClass('active-idx');
// 					scrIdxLst.parent().eq(tScrIdx + 1).find('a').addClass('active').parent().siblings().find('a').removeClass('active');
// 				}
// 			} else {
// 				$('.scr-item.gall-chk.active-idx').addClass('gall');
// 			}
// 			return false;
// 		}
// 	}
// 	function dirUp () { // down
// 		if (!$('.hmj-wrap').hasClass('active')) {
// 			$('.hmj-wrap').addClass('active');
// 			tScrIdx = $('.main_section.active-idx').index();
// 			$('html, body').animate({'overflow':'visible'}, 1200, function () {
// 				$('.hmj-wrap').removeClass('active');
// 			});
// 			if (tScrIdx !== 0) {				
// 				scrItem.eq(tScrIdx).removeClass('active');
// 				scrItem.eq(tScrIdx - 1).addClass('active-idx').siblings().removeClass('active-idx');				
// 			}
// 			return false;
// 		}
// 	}
// })

class DpConsole {
  constructor() {
    this.cos = document.createElement("div");
    this.cos.style.cssText =
      "user-select: none;-webkit-user-select:none;position: fixed; top: 0; left: 50%;z-index: 1000;padding: 10px;background:red;color:#fff;";
  }
  log(str) {
		document.body.insertAdjacentElement("beforeend", this.cos);
    this.cos.innerText = str;
  }
}

class MainInteraction {
	constructor(arg) {
		this.arg = arg;
		this.wrap = document.querySelector('.main_wrap');
		this.introBg = this.wrap.querySelector('.main_intro__bg2');
		this.introBgCar = this.wrap.querySelector('.main_intro__bg--car');
		this.intro = this.wrap.querySelector('.main_intro');
		this.branchBuy = this.wrap.querySelector('.main_intro__branch--buy');
		this.branchSell = this.wrap.querySelector('.main_intro__branch--sell');
		this.greeting = this.wrap.querySelector('.main_greeting');
		this.banner = this.wrap.querySelector('.main_banner');
		this.history = this.wrap.querySelector('.main_history');
		this.gdl = this.wrap.querySelector('.main_gdl');
		this.estimate = this.wrap.querySelector('.main_estimate');
		this.service = this.wrap.querySelector('.main_service');
		this.actionBar = document.querySelector('#CPOactionbar');
		this.animate = false;
		this.stepNum = null;
		this.touchRelX = 0;
		this.touchRelY = 0;
		this.branchState = {dir: null, state : null};
		this.rankNum = 0;
		this.historyNum = 0;
		this.serviceNum = 0;
		this.dpconsole = new DpConsole();
		this.touchStart = (e) => {
			this.touchRelX = e.changedTouches[0].clientX;
			this.touchRelY = e.changedTouches[0].clientY;
		}
		this.touchEnd = (e) => {
			if(this.animate === false && this.touchRelY > e.changedTouches[0].clientY + 50) {
				console.log('down', this.stepNum);
				switch(this.stepNum) {
					case 0 :
						this.greetingShow()
					break;
					case 1 :
						this.bannerShow();
					break;
					case 2 :
						this.rankShow();
					break;
					case 3 :
						this.rankFunc();
					break;
					case 4 :
						this.historyFunc();
					break;
					case 5 :
						this.gdlFunc();
					break;
					case 6 :
						this.serviceShow();
					break;
					case 7 :
						this.serviceFunc();
					break;
				}
			} else if(this.animate === false && this.touchRelY < e.changedTouches[0].clientY - 50) {
				console.log('up', this.stepNum);
				const state = 'back';
				switch(this.stepNum) {
					case 8 : 
						this.faqFunc(state);
					break;
					case 7 :
						this.serviceFunc(state);
					break;
					case 6 :
						this.estimateShow(state);
					break;
					case 5 :
						this.gdlShow(state);
					break;
					case 4 :
						this.historyFunc(state);
					break;
					case 3 :
						this.rankFunc(state);
					break;
					case 2 :
						this.bannerShow(state);
					break;
					case 1 :
						this.greetingShow(state);
					break;
				}
			}
		}
		this.branchMov = (e) => {
			const limitNum = window.outerWidth / 2; 
			const num = this.touchRelX - e.changedTouches[0].clientX;
			const styleStr = `transition: none; transform: translateX(${-num}px);`;
			if(limitNum >= num) {
				this.introBg.style.cssText = styleStr;
			}
			if(num > 0) {
				this.branchSell.style.cssText = styleStr;
				this.introBgCar.style.cssText = styleStr;
				this.branchState.dir = 'left';
				if(num > 50) {
					this.branchState.state = true;
				} else {
					this.branchState.state = false;
				}
			} else {
				this.branchBuy.style.cssText = styleStr;
				this.introBgCar.style.cssText = styleStr;
				this.branchState.dir = 'right';
				if(num < -50) {
					this.branchState.state = true;
				} else {
					this.branchState.state = false;
				}
			}
		}
		this.branchAction = () => {
			let styleReturn = 'transition: transform .3s; transform: translateX(0);';
			let styleBuy = 'transition: transform .3s; transform: translateX(-50%);';
			let styleSell = 'transition: transform .3s; transform: translateX(50%);';
			if(this.branchState !== null) {
				if(!this.branchState.state) {
					this.introBg.style.cssText = styleReturn;
					this.branchBuy.style.cssText = styleReturn;
					this.branchSell.style.cssText = styleReturn;
					this.introBgCar.style.cssText = styleReturn;
				} else {
					if(this.branchState.dir === 'left') {
						this.introBg.style.cssText = styleBuy;
						this.branchSell.style.cssText = styleBuy;
						this.introBgCar.style.cssText = styleBuy;
						setTimeout(()=>{
							this.introBg.style.cssText = '';
							this.introStep3();
						},300);
					} else if (this.branchState.dir === 'right') {
						this.introBg.style.cssText = styleSell;
						this.branchBuy.style.cssText = 'transition: transform .3s; transform: translateX(100%);';
						this.introBgCar.style.cssText = 'transition: transform 3s; transform: translateX(200%);';
						this.wrap.classList.add('stateSell');
						if(this.arg.sellLoad) {
							setTimeout(()=>{
								this.arg.sellLoad();
							},2000);
						}
					}
					window.removeEventListener('touchmove', this.branchMov);
					window.removeEventListener('touchend', this.branchAction);
				}
			}
		}
		this.actionBar.classList.add('hide');
		window.addEventListener('touchstart', this.touchStart);
		window.addEventListener('touchend', this.touchEnd);
	}
	start() {
		document.querySelector('html').classList.add('isMainLock');
		setTimeout(()=> {
			this.intro.classList.add('ready');
			this.introStep2();
		}, 500);
	}
	introStep2() {
		setTimeout(()=> {
			this.intro.classList.add('step2');
			setTimeout(()=> {
				window.addEventListener('touchmove', this.branchMov);
				window.addEventListener('touchend', this.branchAction);
			}, 2000);
		}, 1000);
	}
	introStep3() {
		this.intro.classList.add('step3');
		setTimeout(()=> {
			this.stepNum = 0;
		}, 3000);
	}
	greetingShow(state) {
		if(state !== 'back') {
			this.intro.classList.add('end');
			this.greeting.classList.add('ready');
			this.stepNum = 1;
			this.animate = true;
			setTimeout(()=>{
				this.wrap.classList.add('introEnd');
				this.actionBar.classList.remove('hide');
			},1500);
			setTimeout(()=>{
				this.greeting.classList.add('step2');
			},3000);
			setTimeout(()=>{
				this.animate = false;
			},6500);
		} else {

		}
	}
	bannerShow(state) {
		let com = this.banner.querySelector('.main_banner__com');
		let rank = this.banner.querySelector('.main_banner__rank');
		if(state !== 'back') {
			this.stepNum = 2;
			rank.style.cssText = `top: ${com.clientHeight}px`;
			this.greeting.classList.add('end');
			this.banner.classList.add('ready');
			this.animate = true;
			setTimeout(()=>{
				this.animate = false;
			},800);
		} else {
			this.stepNum = 1;
			this.banner.classList.remove('modBack');
			this.greeting.classList.remove('end');
			this.banner.classList.remove('ready');
			this.greeting.classList.add('modBack');
		}
	}	
	rankShow(state) {
		let com = this.banner.querySelector('.main_banner__com');
		let rank = this.banner.querySelector('.main_banner__rank');
		if(state !== 'back') {
			this.stepNum = 3;
			this.banner.classList.add('rank');
			rank.style.cssText = `top: 0`;
			this.banner.classList.remove('modBack');
			this.animate = true;
			console.log(this.animate);
			setTimeout(()=>{
				this.animate = false;
			},500);
		} else {
			this.stepNum = 2;
			this.rankNum = 0;
			rank.style.cssText = `top: ${com.clientHeight}px`;
			this.banner.classList.add('modBack');
			this.banner.classList.remove('rank');
		}
	}
	rankFunc(state) {
		if(state !== 'back') {
			this.animate = true;
			switch(this.rankNum) {
				case 0 : 
					this.banner.classList.add('rankItem1');
					this.rankNum++;
					setTimeout(()=>{
						this.animate = false;
					},800)
					break;
				case 1 : 
					this.banner.classList.add('rankItem2');
					this.rankNum++;
					setTimeout(()=>{
						this.animate = false;
					},800)
					break;
				default : 
					this.banner.classList.add('rankEnd');
					this.historyShow();
					break;
			}
		} else {
			this.stepNum = 3;
			switch(this.rankNum) {
				case 3 :
					this.banner.classList.remove('rankEnd');
					this.rankNum--;
				break;
				case 2 :
					this.banner.classList.remove('rankItem2');
					this.rankNum--;
				break;
				case 1 :
					this.banner.classList.remove('rankItem1');
					this.rankNum--;
				break;
				default : 
					this.rankShow('back');
				break;
			}

		}
	}
	historyShow(state) {
		if(state !== 'back') {
			this.rankNum = 3;
			this.animate = true;
			this.stepNum = 4;
			this.history.classList.add('ready');
			setTimeout(()=>{
				this.animate = false;
			},2000);
		} else {
			this.history.classList.remove('ready');
			this.rankFunc('back');
			setTimeout(()=>{
				this.history.classList.remove('modBack');
			},1000);
		}
	}
	historyFunc(state) {
		this.history.classList.remove('modBack');
		if(state !== 'back') {
			this.animate = true;
			switch(this.historyNum) {
				case 0 : 
					this.history.classList.add('next');
					this.historyNum++;
					setTimeout(()=>{
						this.animate = false;
					},1000);
					break;
				default:
					this.history.classList.add('end');
					this.gdlShow();
					break;
			}
		} else {
			this.history.classList.add('modBack');
			switch(this.historyNum) {
				case 2 : 
					this.history.classList.remove('end');
					this.historyNum--;
					break;
				case 1 : 
					this.history.classList.remove('next');
					this.historyNum--;
					break;
				default:
					this.historyShow('back');
					break;
			}
		}
	}
	gdlShow(state) {
		if(state !== 'back') {
			this.animate = true;
			this.stepNum = 5;
			this.historyNum = 2;
			this.gdl.classList.add('show');
			this.gdl.classList.remove('modBack');
			setTimeout(()=>{
				this.animate = false;
			}, 3000);
		} else {
			this.gdl.classList.remove('show');
			this.historyFunc('back');
			this.stepNum = 4;
		}
	}
	gdlFunc() {
		this.gdl.classList.remove('modBack');
		this.gdl.classList.add('end');
		this.estimateShow();
	}
	estimateShow(state) {
		if(state !== 'back') {
			this.stepNum = 6;
			this.animate = true;
			this.estimate.classList.add('ready');
			setTimeout(()=>{
				this.animate = false;
			}, 2000);
		} else {
			this.estimate.classList.remove('ready');
			this.estimate.classList.remove('modBack');
			this.gdl.classList.remove('end');
			this.gdl.classList.add('modBack');
			this.stepNum = 5;
		}
	}
	serviceShow(state) {
		if(state !== 'back') {
			this.stepNum = 7;
			this.animate = true;
			this.estimate.classList.remove('modBack');
			this.estimate.classList.add('end');
			this.service.classList.add('show');
			setTimeout(()=>{
				this.animate = false;
			}, 2000);
		} else {
			this.estimate.classList.remove('end');
			this.service.classList.remove('show');
			this.estimate.classList.add('modBack');
			this.stepNum = 6;
		}
	}
	serviceFunc(state) {
		this.animate = true;
		if(state !== 'back') {
			switch(this.serviceNum) {
				case 0 : 
					this.service.classList.add('service1'); 
					setTimeout(()=>{
						this.animate = false;
					},300)
					this.serviceNum++;
					break;
				default : 
					setTimeout(()=>{
						this.service.classList.add('end');
						this.wrap.classList.add('end');
					},1000);
					setTimeout(()=> {
						document.querySelector('html').classList.remove('isMainLock');
						this.faqFunc();
						this.animate = false;
					}, 2000)
					break;
			}
		} else {
			document.querySelector('html').classList.add('isMainLock');
			this.stepNum = 7;
			this.animate = false;
			switch(this.serviceNum) {
				case 2 : 
					this.serviceNum--;
					this.service.classList.remove('end');
					this.wrap.classList.remove('end');
					break;
				case 1 : 
					this.serviceNum--;
					this.service.classList.remove('service1');
				break
				default : 
					this.serviceShow('back');
					break;
			}
		}
	}
	faqFunc(state) {
		this.stepNum = 8;
		this.serviceNum = 2;
		if(state === 'back') {
			if(window.innerHeight < document.querySelector('#CPOwrap').clientHeight) {
				const scrollFunc = () => {
					if(!document.querySelector('html').classList.contains('isMainLock') && window.scrollY <= 0) {
						document.querySelector('html').classList.add('isMainLock');
						this.serviceFunc('back');
					}
				}
				window.addEventListener('scroll', scrollFunc);
			} else {
				this.serviceFunc('back');
			}
		}
	}
}

window.addEventListener('DOMContentLoaded', ()=>{
	let keys = '';
	document.addEventListener('keyup',()=>{
		if(event.key !== 'Enter') {
			keys += event.key;
		} else {
			if(keys === 'qr') {
				let googleQr = "https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=" + location.href + "&choe=UTF-8";
				let qrImg = document.createElement("img");
				qrImg.src = googleQr;
				qrImg.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:150px;height:150px;z-index:10000;";
				document.body.insertAdjacentElement('beforeend',qrImg);
				setTimeout(()=>{
					qrImg.remove();
				},5000); 
			}
			keys = '';
		}
	})
})
