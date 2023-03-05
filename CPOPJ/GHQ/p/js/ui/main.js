class MainCarVisual {
	constructor(el) {
		this.wrap = document.querySelector(`[data-ref="${el}"]`);
		this.carVisual = this.wrap.querySelector('.car_visual');
		this.carItems = this.wrap.querySelectorAll('.car_item');
		this.carVisualInner = this.wrap.querySelector('.car_visual_inner');
		this.allItems = null;
		this.itemLeng = this.carItems.length;
		this.navWrap = this.wrap.querySelector('.car_visual_nav');
		this.btnVisualPrev = this.wrap.querySelector('[data-ref="btnVisualPrev"]');
		this.btnVisualNext = this.wrap.querySelector('[data-ref="btnVisualNext"]');
		this.wrapWidth = this.carVisual.clientWidth;
		this.relNum = 680;
		this.relNum2 = 1060;
		this.relNum3 = 1452;
		this.movNum = 300;
		this.currentIdx = 1;
		this.duration = 500;
		this.deltaX = this.wrapWidth - this.movNum * 2;
		this.isAnimating = false;
		this.loopState = false;
		this.extend = false;
		this.extendAni = false;
		this.init();

		this.btnVisualPrev.addEventListener('click', ()=>{
			if(this.extend == false) {
				this.active('prev');
			} else {
				this.extendEndFun('prev');
			}
		});
		this.btnVisualNext.addEventListener('click', ()=>{
			if(this.extend == false) {
				this.active();
			} else {
				this.extendEndFun();
			}
		});
	}
	init() {
		let firstExtendState = false;
		this.carItems.forEach((item, idx)=>{
			item.setAttribute('data-idx', idx + 1);
			if(item.querySelectorAll('.item').length > 1) {
				item.dataset.car = item.querySelectorAll('.item').length;
				item.classList.add('extend_item',`car${item.dataset.car}`);
				firstExtendState = true;
			}
		});
		for(let prevIdx = this.itemLeng - 1 ; prevIdx >= 0 ; prevIdx--) {
			let prevClone = this.carItems[prevIdx].cloneNode(true);
			prevClone.classList.add('isClone');
			this.carVisualInner.insertAdjacentElement('afterbegin', prevClone);
		}
		for(let nextIdx = 0 ; nextIdx <= this.itemLeng - 1 ; nextIdx++) {
			let nextClone = this.carItems[nextIdx].cloneNode(true);
			nextClone.classList.add('isClone');
			this.carVisualInner.insertAdjacentElement('beforeend', nextClone);
		}
		this.allItems = this.wrap.querySelectorAll('.car_item');
		this.carVisualInner.style.cssText = `transform: translateX(-${this.deltaX}px)`;

		if(firstExtendState === true) {
			setTimeout(()=>{
				this.allItems.forEach(_this=>{
					if(_this.dataset.car && _this.dataset.idx == this.currentIdx && !_this.classList.contains('isClone')) {this.extendFun(_this);}
				});
			},100);
		}
		setTimeout(()=>{
			this.wrap.classList.add('isReady');
		},1);
	}
	activeAfterFun(dir) {
		let extend = false;
		setTimeout(()=>{
			if(dir === 'prev') {
				if(this.currentIdx == this.itemLeng) {
					this.deltaX += this.wrapWidth;
					this.loopState = true;
				}
			} else {
				if(this.currentIdx == 1) {
					this.deltaX -= this.wrapWidth;
					this.loopState = true;
				}
			}
			this.carVisualInner.style.cssText = `transform: translateX(-${this.deltaX}px)`;
			setTimeout(()=>{
				this.allItems.forEach(_this=>{
					if(_this.dataset.car && _this.dataset.idx == this.currentIdx && !_this.classList.contains('isClone')) {
						extend = true;
						this.extendFun(_this);
					}
				});
				if(extend == false) this.isAnimating = false;
			},100)
		}, this.duration);
	}
	extendFun(target) {
		this.isAnimating = true;
		let relNum = null;

		if(target.dataset.car == 3) {
			relNum = this.relNum3 - this.relNum;
			this.navWrap.style.width = this.relNum3 + 'px';
		}
		if(target.dataset.car == 2) {
			relNum = this.relNum2 - this.relNum;
			this.navWrap.style.width = this.relNum2 + 'px';
		}

		this.carVisual.style.width = this.wrapWidth + relNum + 'px';
		this.carVisualInner.style.cssText = `position: absolute; top: 50%; left: -${this.deltaX}px; transform: translateY(-50%);`
		let itemsLeft = [];
		this.allItems.forEach(_this=>{
			itemsLeft.push(_this.offsetLeft);
		});
		itemsLeft.forEach((num, idx) => {
			this.allItems[idx].style.cssText = `position: absolute; left: ${num}px;`
		});

		this.extend = true;
		this.isAnimating = true;
		target.classList.add('isExtend');

		let relIdx = null;
		this.allItems.forEach((_this, idx)=>{
			if(target === _this) relIdx = idx;
		});

		for(let idx = 1 ; idx <= 4 ; idx++) {
			this.allItems[relIdx - idx].style.transform = `translateX(-${relNum / 2}px)`;
			this.allItems[relIdx + idx].style.transform = `translateX(${relNum / 2}px)`;
		}
		
	}
	extendEndFun(dir) {
		this.allItems.forEach(_this=>{
			_this.style.cssText = null;
			if(_this.classList.contains('isExtend')) {
				_this.classList.remove('isExtend');
			}
		});
		this.carVisual.style.width = this.wrapWidth + 'px';
		this.navWrap.style.width = this.relNum + 'px';
		if(this.extendAni === true) {
			this.carVisualInner.style.cssText = `transform: translateX(-${this.deltaX}px); transition: transform ${this.duration * 0.001}s;`;
		} else {
			this.carVisualInner.style.cssText = `transform: translateX(-${this.deltaX}px);`;
		}
		this.extend = false;
		setTimeout(()=>{
			this.isAnimating = false;
			(dir === 'prev') ? this.active('prev') : this.active();
		},this.duration);
	}
	idxSetFun(dir) {
		if(dir === 'prev') {
			this.currentIdx--;
			if(this.currentIdx === 0) this.currentIdx = this.itemLeng;
		} else {
			this.currentIdx++;
			if(this.currentIdx === this.itemLeng + 1) this.currentIdx = 1;
		}
		this.allItems.forEach(_this=>{
			if(_this.dataset.idx == this.currentIdx) _this.classList.add('isActive');
		});
	}
	active(dir) {
		if(this.isAnimating == false) {
			this.isAnimating = true;

			let movNum = null;
			
			if(dir === 'prev') {
				movNum = this.deltaX - this.movNum;
				if(this.currentIdx == 1) movNum = this.deltaX - this.relNum;
			} else {
				movNum = this.deltaX + this.movNum;
				if(this.currentIdx == this.itemLeng) movNum = this.deltaX + this.relNum;
			}
			this.carVisualInner.style.cssText = `transform: translateX(-${movNum}px); transition: transform ${this.duration * 0.001}s;`;
			this.deltaX = movNum;
			this.allItems.forEach(_this=>{
				if(_this.dataset.idx == this.currentIdx) _this.classList.remove('isActive');
			});
			
			this.idxSetFun(dir);
			this.activeAfterFun(dir);
		}
 	}
}