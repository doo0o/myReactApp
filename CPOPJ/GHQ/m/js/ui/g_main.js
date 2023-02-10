class MainCarVisual {
	constructor(el, changeActiveHandler) {
		this.changeActiveHandler = changeActiveHandler;
		this.wrap = document.querySelector(`[data-ref="${el}"]`);
		this.carVisual = this.wrap.querySelector('.car_visual');
		this.carItems = this.wrap.querySelectorAll('.car_item');
		this.itemLeng = this.carItems.length;
		this.currentIdx = 0;
		this.paging = [];
		this.currentPaging = null;
		this.deltaArry = [];
		this.numArry = [];
		this.startX = 0;
		this.endX = 0;

		this.createPaging();
		this.active();
		this.wrap.addEventListener('touchstart', ()=>{
			this.startX = event.changedTouches[0].pageX;
		});
		this.wrap.addEventListener('touchmove', ()=>{
			this.endX = this.startX - event.changedTouches[0].pageX;
		});
		this.wrap.addEventListener('touchend',()=>{
			let dir = null;
			if(this.endX > 100) {
				this.currentIdx++;
				if(this.currentIdx >= this.itemLeng) this.currentIdx = 0;
				dir = 'right';
			} else if(this.endX < -100) {
				this.currentIdx--;
				if(this.currentIdx < 0) this.currentIdx = this.itemLeng - 1;
				dir = 'left';
			}
			this.active(dir);
		});
	}
	createPaging() {
		const pagingWrap = document.createElement('div');
		pagingWrap.classList.add('swiper-pagination');
		this.carVisual.insertAdjacentElement('afterend', pagingWrap);
		for(let idx = 0; idx < this.itemLeng; idx++) {
			const pagingItem = document.createElement('div');
			pagingItem.classList.add('swiper-pagination-bullet');
			pagingWrap.insertAdjacentElement('beforeend', pagingItem);
			this.paging.push(pagingItem);
			this.deltaArry.push(idx + 1);
		}
		this.currentPaging = this.paging[this.currentIdx];
	}
	active(dir) {
		if(this.currentIdx < this.itemLeng) {
			this.currentPaging.classList.remove('swiper-pagination-bullet-active');
			this.paging[this.currentIdx].classList.add('swiper-pagination-bullet-active');
			this.currentPaging = this.paging[this.currentIdx];
			this.carItems[this.deltaArry.indexOf(1)].classList.remove('isNextShow');
			this.carItems[this.deltaArry.indexOf(1)].classList.remove('isPrevShow');
			this.carItems[this.deltaArry.indexOf(1)].classList.remove('isActive');
			for(let idx = 0; idx < this.itemLeng; idx++) {
				let replaceNum = idx + 1 + this.currentIdx;
				if(replaceNum > this.itemLeng) replaceNum -= this.itemLeng; 
				this.numArry.push(replaceNum);
				this.carItems[idx].classList.replace(`car_item${this.deltaArry[idx]}`, `car_item${replaceNum}`);
			}
			if(dir == 'left') {
				this.carItems[this.numArry.indexOf(1)].classList.add('isPrevShow');
			} else if(dir == 'right') {
				this.carItems[this.numArry.indexOf(1)].classList.add('isNextShow');
			}
			this.endX = 0;
			setTimeout(()=>{
				this.carItems[this.numArry.indexOf(1)].classList.add('isActive');
				this.deltaArry = this.numArry;
				this.numArry = [];
				this.changeActiveHandler();
			},10);
		}
	}
}

// GHQ 메인 수정
function recommendSwiper() {
	$('.recommend_slide').each(function(i, d){	
		//slide의 개수가 2개 이상일때만 pagination이 노출됨.
		var $pagination = $(d).find('.swiper-slide').length > 1 ? '.swiper-pagination' : false;
		var $prev = $(d).find('.swiper-slide').length > 1 ? '.swiper-button-prev' : false;
		var $next = $(d).find('.swiper-slide').length > 1 ? '.swiper-button-next' : false;
		//.swiperType01태그에 data-swiper-space 설정시 spaceBetween 설정됨. 
		var $spaceBetween = $(d)[0].dataset.swiperSpace !== undefined ? parseInt($(d)[0].dataset.swiperSpace) : 0;
		new Swiper(d, {
			slidesPerView:'auto',
			spaceBetween:$spaceBetween,
			freeMode:false,
			pagination:{
				el: $pagination
			},
			navigation: {
				nextEl: $next,
				prevEl: $prev
			}
		});
	});
}
