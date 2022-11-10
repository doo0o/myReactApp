const betaItem = document.querySelectorAll('.login__item');

betaItem.forEach(el => {
	el.addEventListener('mouseover', (e) => {
		e.target.closest('.login__item').classList.add('active')
	})
	el.addEventListener('mouseout', (e) => {
		e.target.closest('.login__item').classList.remove('active')
	})
});


var data = 0;

function as(){
	data = 100;
}

as();

var test = {
	a : data == 1 ? 1 : 0,
	b : data > 1 && true ? 1 : 0,
}


console.log(test.a, test.b)

