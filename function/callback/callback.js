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




