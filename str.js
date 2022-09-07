var programmers = {
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


}
programmers.SolutionF();


