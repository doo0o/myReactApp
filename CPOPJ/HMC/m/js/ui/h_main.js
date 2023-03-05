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
		this.header = document.querySelector('#CPOheader');
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
		window.addEventListener('wheel', (e)=>{
			if(this.animate === false && e.deltaY > 0) {
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
			} else if(this.animate === false && e.deltaY < 0) {
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
		})
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
			this.header.classList.add('hide');
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
			this.header.classList.remove('hide');
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

class Gate {
	constructor(arg) {
		this.arg = arg;
		this.touchRelX = 0;
		this.touchState = false;
		this.branchState = {dir: null, state : null};
		this.gateWrap = document.querySelector('[data-ref="gateWrap"]');
		this.movItem1 = document.querySelector('[data-ref="movItem1"]');
		this.movItem2 = document.querySelector('[data-ref="movItem2"]');
		window.addEventListener('touchstart', ()=>{
			this.touchRelX = event.changedTouches[0].clientX;
		});
		window.addEventListener('touchmove', ()=>{
			if(this.touchState === false) this.branchMov();
		});
		window.addEventListener('touchend', ()=>{
			if(this.touchState === false) this.branchAction();
		});
		document.querySelector('html').classList.add('scroll_hidden');
	}
	branchMov() {
		const num = this.touchRelX - event.changedTouches[0].clientX;

		this.movItem1.style.cssText = `transition: none; transform: translateX(${-num}px);`;
		this.movItem2.style.cssText = `transition: none; transform: translateX(${-num}px);`;

		if(num > 0) {
			this.branchState.dir = 'buy';
			this.gateWrap.classList.add('isBuyReady');
			this.gateWrap.classList.remove('isSellReady');
			if(num > 50) {
				this.branchState.state = true;
			} else {
				this.branchState.state = false;
			}
		} else {
			this.branchState.dir = 'sell';
			this.gateWrap.classList.remove('isBuyReady');
			this.gateWrap.classList.add('isSellReady');
			if(num < -50) {
				this.branchState.state = true;
			} else {
				this.branchState.state = false;
			}
		}
	}
	branchAction() {
		let styleReturn = 'transition: transform .3s; transform: translateX(0);';
		let styleBuy = 'transition: transform .3s; transform: translateX(-50%);';
		let styleSell = 'transition: transform .3s; transform: translateX(50%);';
		
		if(this.branchState !== null) {
			if(!this.branchState.state) {
				this.movItem1.style.cssText = styleReturn;
				this.movItem2.style.cssText = styleReturn;
				this.gateWrap.classList.remove('isSellReady');
				this.gateWrap.classList.remove('isBuyReady');
			} else {
				this.touchState = true;
				if(this.branchState.dir === 'buy') {
					this.movItem1.style.cssText = styleBuy;
					this.movItem2.style.cssText = styleBuy;
					this.gateWrap.classList.add('isBuyStart');
				} else if (this.branchState.dir === 'sell') {
					this.movItem1.style.cssText = styleSell;
					this.movItem2.style.cssText = styleSell;
					this.gateWrap.classList.add('isSellStart');
					setTimeout(()=>{
						this.arg.sellLoad();
					},1500);
				}
			}
		}
	}
}

class History {
	constructor(el) {
		this.wrap = el;
		this.state = false;
		this.stepNum = 0;
		this.timer = null;
		this.timer2 = null;
		this.touchRelY = 0;
		this.touchStart = () => {
			this.touchRelX = event.changedTouches[0].clientX;
			this.touchRelY = event.changedTouches[0].clientY;
		}
		this.touchEnd = () => {
			if(this.state === false && this.touchRelY > event.changedTouches[0].clientY + 50) {
				return "up";
			} else if(this.state === false && this.touchRelY < event.changedTouches[0].clientY + 50) {
				return "down";
			}
		}
		this.wrap.addEventListener('touchstart', ()=>{
			this.touchStart();
		});
		this.wrap.addEventListener('touchend', ()=>{
			this.touchFunc();
		});
		this.wrap.addEventListener('wheel', (e)=>{
			if(e.deltaY > 0) {
				switch(this.stepNum) {
					case 1 : {
						this.step2();
						break;
					}
					case 2 : {
						this.wrap.classList.add('isEnd');
						document.querySelector('html').classList.remove('scroll_hidden');
						this.state = false;
						break;
					}
				}
			} else {
				switch(this.stepNum) {
					case 2 : {
						this.backStep1();
						break;
					}
					case 1 : {
						this.backStep2();
						break;
					}
				}
			}
		})
	}
	touchFunc() {
		if(this.touchEnd() == "up") {
			switch(this.stepNum) {
				case 1 : {
					this.step2();
					break;
				}
				case 2 : {
					this.wrap.classList.add('isEnd');
					document.querySelector('html').classList.remove('scroll_hidden');
					this.state = false;
					break;
				}
			}
		} else if(this.touchEnd() == "down") {
			switch(this.stepNum) {
				case 2 : {
					this.backStep1();
					break;
				}
				case 1 : {
					this.backStep2();
					break;
				}
			}
		}
	}
	step1() {
		const leng = document.querySelector('[data-ref="carLeng"]');
		document.querySelector('html').classList.add('scroll_hidden');
		window.scrollTo(0, this.wrap.getBoundingClientRect().top + window.scrollY);
		this.wrap.classList.add('isStart');
		this.state = true;
		numFunc({
			start: 0,
			total: leng.dataset.num,
			time: 1,
			callBack: val => {
				leng.innerText = Math.floor(val);
			}
		})
		this.timer = setTimeout(()=>{
			window.scrollTo(0, this.wrap.getBoundingClientRect().top + window.scrollY);
			this.state = false;
			this.stepNum = 1;
		}, 2000);
	}
	step2() {
		this.wrap.classList.add('isStep2');
		this.stepNum = 2;
		this.state = true;

		this.timer2 = setTimeout(()=>{
			window.scrollTo(0, this.wrap.getBoundingClientRect().top + window.scrollY);
			this.wrap.classList.add('isEnd');
			document.querySelector('html').classList.remove('scroll_hidden');
			window.scrollTo(0, this.wrap.getBoundingClientRect().top + window.scrollY);
			this.state = false;
		}, 2000);
	}
	back() {
		this.wrap.classList.remove('isEnd');
		document.querySelector('html').classList.add('scroll_hidden');
		window.scrollTo(0, this.wrap.getBoundingClientRect().top + window.scrollY);
		this.stepNum = 2;
		this.state = true;
		setTimeout(()=>{
			this.state = false;
			window.scrollTo(0, this.wrap.getBoundingClientRect().top + window.scrollY);
		}, 2000);
	}
	backStep1() {
		this.wrap.classList.remove('isStep2');
		this.stepNum = 1;
		this.state = true;
		setTimeout(()=>{
			this.state = false;
		}, 2000);
	}
	backStep2() {
		this.wrap.classList.remove('isStart');
		this.stepNum = 0;
		this.state = true;
		document.querySelector('html').classList.remove('scroll_hidden');
		setTimeout(()=>{
			this.state = false;
		}, 2000);
	}
}

class Interaction {
	constructor() {
		function refSelector(str) {
			return document.querySelector(`[data-ref="${str}"]`)
		}
		this.greeting = refSelector("greeting");
		this.mainWrap = refSelector("mainWrap");
		this.bannerView = refSelector("bannerView");
		this.historyView = refSelector("historyView");
		// this.history = new History(this.historyView);
		this.labView = refSelector("labView");
		this.labBg = refSelector("labBg");
		this.labBtn = refSelector("labBtn");
		this.serviceView = refSelector("serviceView");
		this.serviceTitle = refSelector("serviceTitle")
		this.serviceLink = refSelector("serviceLink1");

		this.mainCarSlider = new Swiper(refSelector("mainCarSlider"), {
			pagination: {
				el: '.swiper-pagination'
			},
		});
		this.introTimer = null;
		this.introSetTime = () => {
			this.introTimer = setTimeout(()=>{
				document.querySelector('html').classList.remove('scroll_hidden');
			}, 4000);
		}
		this.active();
	}
	scrollFunc(param) {
		const rect = param.target.getBoundingClientRect();
		const start = (param.startPer) 
									? param.start + window.scrollY + (window.innerHeight * param.startPer / 100)
									: param.start + window.scrollY;
		const end = start + rect.height + (window.innerHeight * param.end / 100);
		const num = end - start;
		const rel = window.scrollY + window.innerHeight;

		let result = Math.floor(((rel - start) / num * 100));

		if(start <= rel && end >= rel) param.callBack(result);
	}
	observer(target, option, callBack) {
		const observ = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if(entry.isIntersecting) callBack(entry);
			});
		}, option);
		observ.observe(target);
	}
	active() {
		document.querySelector('html').classList.add('scroll_hidden');
		document.body.classList.add('isReady');
		window.scrollTo(0,0);
		this.introSetTime();
		window.addEventListener('scroll', ()=>{
			this.mainViewFunc();
			this.bannerFunc();
			this.historyFunc();
			this.hiLabFunc();
			this.serviceLinkFunc();
		});
	}
	mainViewFunc() {
		if(window.scrollY > 0) {
			if(!document.body.classList.contains('isStart')) document.body.classList.add('isStart');
		} else {
			document.body.classList.remove('isStart');
		}
	}
	bannerFunc() {
		const target = this.bannerView.querySelector('[data-ref="bannerViewTxt"]');
		this.scrollFunc({
			target : target,
			start : target.getBoundingClientRect().top,
			end : 100,
			callBack : (num) => {
				let val = 100 - (num * 2);
				target.style.transform = `translateX(${val}%)`;
			}
		})
	}
	historyFunc() {
		const rect = this.historyView.getBoundingClientRect();
		if(window.scrollY - window.innerHeight >= rect.top + window.scrollY) {
			if(!this.historyView.classList.contains('isStart')) {
				const leng = this.historyView.querySelector('[data-ref="carLeng"]');
				numFunc({
					start: 0,
					total: leng.dataset.num,
					time: 1,
					callBack: val => {
						leng.innerText = Math.floor(val);
					}
				});
				this.historyView.classList.add('isStart');
			}
		} else {
			this.historyView.classList.remove('isStart');
		}
		if(window.scrollY - (window.innerHeight + (window.innerHeight / 2)) >= rect.top + window.scrollY) {
			this.historyView.classList.add('isStep2');
		} else {
			this.historyView.classList.remove('isStep2');
		}

		// if(this.history.stepNum === 0 && window.scrollY >= rect.top + window.scrollY) {
		// 	this.history.step1();
		// } else if(this.history.stepNum === 2 && window.scrollY > rect.top + window.scrollY) {
		// 	this.history.stepNum = 3;
		// } else if(this.history.stepNum === 3 &&  window.scrollY <= rect.top + window.scrollY){
		// 	this.history.back();
		// }
		
	}
	hiLabFunc() {
		const view = this.labView.getBoundingClientRect();
		const btn = this.labBtn.getBoundingClientRect();
		const start = window.scrollY + view.top + (window.innerHeight / 2);
		if(!this.labView.classList.contains('isStart') && window.scrollY + window.innerHeight >= start) {
			this.labView.classList.add('isStart');
			// bodymovin.loadAnimation({
			// 	wrapper: this.labBg,
			// 	animType: 'svg',
			// 	loop: false,
			// 	autoplay: true,
			// 	path: '../../js/main_3.json',
			// });
		}
		this.scrollFunc({
			target : this.labBg,
			start : view.top + view.height,
			end : 200,
			callBack : (num) => {
				this.labBg.style.width = `${100 - num}%`;
				this.labBg.style.height = `${100 - num}%`;
			}
		});
		
		this.scrollFunc({
			target : this.labBtn,
			start : btn.top,
			startPer : 50,
			end : 20,
			callBack : (num) => {
				this.labBtn.style.opacity = `${(100 - num) * .01}`;
			}
		});
			
	}
	serviceLinkFunc() {
		const titRect = this.serviceTitle.getBoundingClientRect();
		const linkRect = this.serviceLink.getBoundingClientRect();
		if(titRect.top >= linkRect.top) {
			this.serviceView.classList.add('isChange');
		} else {
			this.serviceView.classList.remove('isChange');
		}
	}
}

// hashtag 페이지용
function mainViewFunc() {
	window.addEventListener('scroll', ()=>{
		if(window.scrollY > 0) {
			if(!document.body.classList.contains('isStart')) document.body.classList.add('isStart');
		} else {
			document.body.classList.remove('isStart');
		}
	});
}

// On scroll(LNB 활성화 메뉴 스크롤)
function lnbScrollCenter() {
	if($('.hash-nav').length) {
		if($('.hash-nav__inner button').hasClass('current')){
			var scrollUl = $('.hash-nav__inner')
			var scrollLiOn = $('.hash-nav__inner button.current')
			// var scrollPos = scrollLiOn.offset().left + scrollLiOn.outerWidth(true) / 2 + scrollUl.scrollLeft() - scrollUl.width() / 2;	//좌측정렬
			var scrollPos = scrollLiOn.offset().left + scrollUl.scrollLeft() + scrollLiOn.width()/2 - scrollUl.width()/2; //중앙정렬
			//event 메뉴 구분 - switch_box는 개발페이지에서 이벤트 영역뿐만 아니라 기획전에서도 호출됨
			// var leftMargin = parseInt(scrollUl.css('margin-left'));
			// var scrollPos2 = scrollLiOn.offset().left;

			// if(!$('.switch_box').length){
			// 	scrollUl.animate({
			// 		scrollLeft : scrollPos
			// 	}, 300);
			// }else {
			// 	scrollUl.animate({
			// 		scrollLeft : scrollPos2 - leftMargin
			// 	}, 300);
			// }
			scrollUl.animate({
				scrollLeft : scrollPos
			}, 300);

		}
	}
}

// 해쉬태그 start
function hashtag() {
    $(".plp_type01").addClass("start");
};
