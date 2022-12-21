const betaItem = document.querySelectorAll('.login__item');

betaItem.forEach(el => {
	el.addEventListener('mouseover', (e) => {
		e.target.closest('.login__item').classList.add('active')
	})
	el.addEventListener('mouseout', (e) => {
		e.target.closest('.login__item').classList.remove('active')
	})
});