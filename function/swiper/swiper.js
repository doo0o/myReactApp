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