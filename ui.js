const programmers = {
    // function solution(s) {
    //     return s.search(/\D/g) < 0 && (s.length === 4 ||  s.length === 6) ? true : false;
    // }

    // 문제 설명
    // 함수 solution은 정수 x와 자연수 n을 입력 받아, x부터 시작해 x씩 증가하는 숫자를 n개 지니는 리스트를 리턴해야 합니다. 다음 제한 조건을 보고, 조건을 만족하는 함수, solution을 완성해주세요.

    // 제한 조건
    // x는 -10000000 이상, 10000000 이하인 정수입니다.
    // n은 1000 이하인 자연수입니다.
    // 입출력 예
    // x	n	answer
    // 2	5	[2,4,6,8,10]
    // 4	3	[4,8,12]
    // -4	2	[-4, -8]
    SolutionA : (x, n) => {
        var answer = [];
        p = x;
        for(i = 0; i < n; i++){
            answer.push(x);
            x = x + p;
        }
        return answer;
    },
    // 이 문제에는 표준 입력으로 두 개의 정수 n과 m이 주어집니다.
    // 별(*) 문자를 이용해 가로의 길이가 n, 세로의 길이가 m인 직사각형 형태를 출력해보세요.

    // 제한 조건
    // n과 m은 각각 1000 이하인 자연수입니다.
    // 예시
    // 입력

    // 5 3
    // 출력

    // *****
    // *****
    // *****
    SolutionB : () => {
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', data => {
            const n = data.split(" ");
            const a = Number(n[0]), b = Number(n[1]);
        
            var str = ""
            for(j = 0; j < b; j++){
                for(i = 0; i < a; i++){
                    str += "*";
                }
                str += "\n"
            }
        
            console.log(str)
            console.log(a);
            console.log(b);
        });
        
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', data => {
            const n = data.split(" ");
            const a = Number(n[0]), b = Number(n[1]);
            const row = '*'.repeat(a) // repeat 메소드 : 문자열 반복 *을 a번 반복
            for(let i =0; i < b; i++){
                console.log(row)
            }
        });
    },




    // 문제 설명
    // 행렬의 덧셈은 행과 열의 크기가 같은 두 행렬의 같은 행, 같은 열의 값을 서로 더한 결과가 됩니다. 2개의 행렬 arr1과 arr2를 입력받아, 행렬 덧셈의 결과를 반환하는 함수, Solution을 완성해주세요.

    // 제한 조건
    // 행렬 arr1, arr2의 행과 열의 길이는 500을 넘지 않습니다.
    // 입출력 예
    // arr1	arr2	return
    // [[1,2],[2,3]]	[[3,4],[5,6]]	[[4,6],[7,9]]
    // [[1],[2]]	[[3],[4]]	[[4],[6]].


    SolutionC : (arr1,arr2) => {
        var answer = [[]];
        var sumArr = [];
        for(i = 0; i < arr1.length; i++){
            for(j = 0; j < arr1[i].length; j++){
                sumArr.map(arr1[i][j] + arr1[i][j]);
            }
        }
        answer = sumArr;
        console.log(answer)
        return answer;
    },

    // 평균구하기
    SolutionD : (arr) => {
        var average = arr.reduce((prev,curr) => prev + curr)/arr.length;
        console.log(average);
    },

    // 핸드폰 번호 가리기
    SolutionE : (phonenum) => {
        var answer = "",
            star = "*".repeat(phonenum.length-4);
        phonenum = phonenum.substr(phonenum.length-4, phonenum.length);
        answer = star + phonenum;
        return answer;
    },

    // 문제 설명
    // 양의 정수 x가 하샤드 수이려면 x의 자릿수의 합으로 x가 나누어져야 합니다. 예를 들어 18의 자릿수 합은 1+8=9이고, 18은 9로 나누어 떨어지므로 18은 하샤드 수입니다. 자연수 x를 입력받아 x가 하샤드 수인지 아닌지 검사하는 함수, solution을 완성해주세요.

    // 제한 조건
    // x는 1 이상, 10000 이하인 정수입니다.
    // 입출력 예
    // arr	return
    // 10	true
    // 12	true
    // 11	false
    // 13	false
    SolutionF  : (num) => {
        var numToString = `${num}`;
        arr = [];
        for(i = 0; i < numToString.length; i++){
            arr.push(Number(numToString.slice(i,i+1)));
        }
        arr = num / arr.reduce((prev,curr) => prev + curr);
        answer = (Math.floor(arr) < arr) ? false : true;
    },
    SolutionG : (num) => {
       var oddNum = 0;
       var evenNum = 0;
       
       (num/2 == 0) ? oddNum = num/2 : evenNum = (num*3)+1;
       console.log(oddNum)
    },


    // 문제 설명
    // 1937년 Collatz란 사람에 의해 제기된 이 추측은, 주어진 수가 1이 될 때까지 다음 작업을 반복하면, 모든 수를 1로 만들 수 있다는 추측입니다. 작업은 다음과 같습니다.
    
    // 1-1. 입력된 수가 짝수라면 2로 나눕니다. 
    // 1-2. 입력된 수가 홀수라면 3을 곱하고 1을 더합니다. 
    // 2. 결과로 나온 수에 같은 작업을 1이 될 때까지 반복합니다. 
    // 예를 들어, 주어진 수가 6이라면 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1 이 되어 총 8번 만에 1이 됩니다. 위 작업을 몇 번이나 반복해야 하는지 반환하는 함수, solution을 완성해 주세요. 단, 주어진 수가 1인 경우에는 0을, 작업을 500번 반복할 때까지 1이 되지 않는다면 –1을 반환해 주세요.
    
    // 제한 사항
    // 입력된 수, num은 1 이상 8,000,000 미만인 정수입니다.
    // 입출력 예
    // n	result
    // 6	8
    // 16	4
    // 626331	-1
    // 입출력 예 설명
    // 입출력 예 #1
    // 문제의 설명과 같습니다.
    
    // 입출력 예 #2
    // 16 → 8 → 4 → 2 → 1 이 되어 총 4번 만에 1이 됩니다.
    
    // 입출력 예 #3
    // 626331은 500번을 시도해도 1이 되지 못하므로 -1을 리턴해야 합니다.
    
    // ※ 공지 - 2022년 6월 10일 다음과 같이 지문이 일부 수정되었습니다.
    
    // 주어진 수가 1인 경우에 대한 조건 추가
    SolutionH : (number) => {
        var answer = 0;
        function returnfunc(n){
            console.log("last number:" + n);
            console.log("answer count:" + answer);
            if (answer === 499) return -1;
            else if(n === 1) return n;
            answer++;
            n%2 === 0 ? returnfunc(n/2) : returnfunc((n*3)+1);
        };
        returnfunc(number);
    },
    // 문제 설명
    // 자연수 n이 매개변수로 주어집니다. n을 x로 나눈 나머지가 1이 되도록 하는 가장 작은 자연수 x를 return 하도록 solution 함수를 완성해주세요. 답이 항상 존재함은 증명될 수 있습니다.

    // 제한사항
    // 3 ≤ n ≤ 1,000,000
    // 입출력 예
    // n	result
    // 10	3
    // 12	11

    // 입출력 예 설명
    // 입출력 예 #1
    // 10을 3으로 나눈 나머지가 1이고, 3보다 작은 자연수 중에서 문제의 조건을 만족하는 수가 없으므로, 3을 return 해야 합니다.
    // 입출력 예 #2
    // 12를 11로 나눈 나머지가 1이고, 11보다 작은 자연수 중에서 문제의 조건을 만족하는 수가 없으므로, 11을 return 해야 합니다.
    SolutionI : (n) => {
        for(i = 1; i < n; i++){q = n%i;if(q === 1) return i;}
    },
    SolutionJ : (n) => {
        var answer;
        var falseReturn = () => {answer = -1;}
        for(i = 0; i < n; i++){
            const x = i*i;
            if(n === x){
                answer = (i+1)*(i+1);
                break;
            }else{
                falseReturn();
            }
        }
        console.log(answer);
    },
    SolutionK : (s) => {
        const countP = [...s.matchAll(/p/gi)].length;
        const countY = [...s.matchAll(/y/gi)].length;
        console.log(countP === countY)
    },
    SolutionL : (n) => {
        var answer = [];
        n = `${n}`;
        for(i=0;i < n.length; i++){
            answer.unshift(parseInt(n.slice(i,i+1)));
        }
        console.log(answer)
    },
    SolutionO : (n) => {
        var answer = [];
        n = `${n}`;
        for(i=0;i<n.length;i++){
            answer.push(parseInt(n.slice(i,i+1)));
        }
        answer.sort(function(a, b){
            return b - a;
        })
        answer.toString().replace(/,/g,"");
    }
}


let data = {
    sectionData : [
        "HOME",
        "ABOUT",
        "STORE",
        "SERVICE",
        "ADVICE",
        "COMPANY"
    ]
}

var cli = "", wrapper = "";

let nav = document.getElementById("nav").children[0],
secWrapper = document.getElementById("wrap__inner");
let _targetNav = document.querySelectorAll(".nav li");


var ui = {
    settingFunc : () => {
        for(i = 0; i < data.sectionData.length; i++){
            cli += '<li data-scroll="'+ i + '"><a href="javascript:void(0);">'+ data.sectionData[i] + '</a></li>';
            wrapper += '<section class="section__wrap"><p class="section__title"><span>' + data.sectionData[i] + '</span></p><div class="section__inner"></div></section>';
        }
        secWrapper.innerHTML = wrapper;
        nav.innerHTML = cli;
        ui.navEvent();
        ui.scrollMove();
    },
    animationOn : () =>{

    },
    scrollMove : (index) => {
        let scroll_target = document.querySelectorAll(".section__wrap");
        for(i = 0; i < scroll_target.length; i++){
            (function(){
                scroll_target
                console.log(scroll_target[i].scrollTop);

            })()
            
        }
    },
    navEvent : () => {
        function resetClass(){
            for(i = 0;i < _targetNav.length; i++){
                _targetNav[i].classList.remove('active');
            }
        }
        _targetNav.forEach((el) => {
            el.addEventListener("mouseover", function(){
                this.classList.contains('active') == false ? resetClass() : void(0);
                this.classList.add("active");
            })
        });
    }
}
ui.settingFunc();