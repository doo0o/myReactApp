function selectStep (){
	const _body = document.querySelector('body');
	const siblingItem = document.querySelectorAll(".question__item");
	const radio = document.querySelectorAll('input[type="radio"]');
	const textInput = document.querySelectorAll('.form_area input');
	const question = document.querySelector('.question');
	const chk = document.querySelector('input[type="radio"]').checked;
	const itemLength = siblingItem.length;
	

	let item = null;
	let num = 0;


	_body.addEventListener('wheel', preventScroll, {passive: false});

	function preventScroll(e){
		e.preventDefault();
		e.stopPropagation();
	
		return false;
	}

	// _body.addEventListener('wheel',(e)=>{preventDefault(e);})
	radio.forEach(el => {
		el.addEventListener('click', radioChk);
	})
	
	question.addEventListener('scroll', (e) => {
		console.log(e.target.scrollTop)
	})

	textInput.forEach(el => {
		el.addEventListener('keyup', (e) => {
			if(e.keyCode === 13){
				nextStep(e, item);
			}
		});
	})

	function radioChk (e){
		item = this.closest('.question__item');
		const _input = item.querySelector('div[data-input]');

		if(_input == null){
			return nextStep(e, item)
		}
		if(this.getAttribute("id").search("yes") > -1 && this.checked == true){
			_input.setAttribute('data-input', "true");
			_input.closest('.form_area').classList.remove('focus');
		}else{
			_input.setAttribute('data-input', "false");
			_input.closest('.form_area').classList.remove('focus');
			nextStep(e, item);
		}
	}

	function nextStep(e, item){
		++num;
		item.classList.remove('active')
		siblingItem[num].classList.add('active');
		focus();
	}
	
	function focus(){
		siblingItem[num].scrollIntoView({block: 'center',behavior: 'smooth' })
	}
}