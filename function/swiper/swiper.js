/**
 * getSwiperOption customOpt
 * @param {Number} _slidesPerView view 갯수
 * @param {Number} _spaceBetween 여백
 * @param {Boolean} _loop 반복
 * @param {Element} _pagination bullet
 * @param {Element} _slidesPerView next / prev button
 * @param {Object} addOption Add Swiper API
*/
function getSwiperOption(customOpt) {
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


const bannerSwiper = () => {
	let swiperWrap = document.querySelectorAll("[class^='swiperBanner']");
	let customOpt = {}
	let defaultObj = {
		slidesPerView : 1,
		spaceBetween : 0,
		pagination : {
			el : ".swiper-pagination01"
		},
		navigation : {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev"
		},
		loop : true,
	}

	swiperWrap.forEach(element => {
		let slideItem = element.querySelectorAll('.swiper-slide');

		customOpt = {
			slidesPerView : element.dataset.slidesPerView,
			spaceBetween : element.dataset.spaceBetween,
			loop : element.dataset.navigation,
			pagination : element.dataset.pagination,
			navigation : element.dataset.loop
		}

		if(slideItem.length > 1){
			customOpt.slidesPerView = customOpt.slidesPerView == null ? 1 : element.dataset.slidesPerView;

			customOpt.spaceBetween = customOpt.slidesPerView == null ? 1 : element.dataset.slidesPerView;
		}

		// console.log(slideItem.length);
		// console.log(element);
	});
}