function names(age, name, callback){
    let person = {
        name : name,
        age : age,
    };
    callback(person);
}

function naming(data){
    console.log(data)
}

names(18,"홍길동", naming)




/**
 * 엘리먼트가 화면에 나타날때 콜백
 * @param {String} el 타겟 엘리먼트 
 * @param {Function} callback 실행될 기능 작성
 */
const createObserver = (el, callback) => {
	const target = document.querySelectorAll(el);
	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				if(callback) callback()
			}
		});
	});
	target.forEach( _this => {
		observer.observe(_this);
	})
}