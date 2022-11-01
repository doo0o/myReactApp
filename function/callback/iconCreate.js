/**
    Create Element Fuction
*/
let createDate = [
    {
        thisName : ".icon_01",
        childClass : "icon_01_",
        length : 36,
    },
    {
        thisName : ".icon_02",
        childClass : "icon_02_",
        length : 24,
    }
];

(() => {
    let _div = document.createElement('div');
    let _setElement = document.querySelector('.icon_01')
    for(let i = 0; i < createDate[0].length; i++){
        console.log(i)
        _setElement.appendChild(_div);
    }
})()

// function roopCreate(){
//     let _element = document.querySelector(createDate[0].thisName);
//     for(let i = 0; i < createDate[0].length; i++){
//         let _item = "<li class='" + createDate[0].childClass + '_' + i + "'></li>"
//         _element.innerHTML += _item;
//     }
//     console.log(_element);

//     _element
// }

// roopCreate();
