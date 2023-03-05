/**
 ********************************************************
 * 최초작성 : 2006-10-20 ssbang
 *
 * validation check javascript
 * 오브젝트 또는 value 에 대해 형식 체크를 한다.
 * is메소드명 : 형식이 맞으면 true,  틀리면 false 를 리턴한다.
 * isNot메소드명 : 형식이 맞으면 false, 틀리면 true 를 리턴한다.
 *********************************************************
 */
/**js upload test*/

/**
 * Value( ele 가 Object 일 경우네는 Object 의 value) 가 whitespace, (""), null 인지 체크한다.<b>
 * @param ele ( text 또는 Form Object )
 */
function isBlank(ele) {
    var elevalue = getElementValueToString(ele);
	if(elevalue.replace(/^(\s+)|(\s+)$/g,"").length == 0) return true;
	else return false;
}

function isNotBlank(ele) {
    var elevalue = getElementValueToString(ele);
	if(elevalue.replace(/^(\s+)|(\s+)$/g,"").length == 0) return false;
	else return true;
}

/**
 * Value( ele 가 Object 일 경우네는 Object 의 value) 가  (""), null 인지 체크한다.
 * Blank 와 다른점은 whitespace는  empty에 포함되지 않는다는 것이다.
 * @param ele ( text 또는 Form Object )
 */
function isEmpty(ele, message) {
    var elevalue = getElementValue(ele);
	if(elevalue.length == 0) return true;
	else return false;
}

function isNotEmpty(ele) {
    var elevalue = getElementValue(ele);
	if(elevalue.length == 0) return false;
	else return true;
}

/**
 * Number 인지 체크 (Decimal 은 false 이다)
 * @param ele ( text 또는 Form Object )
 */
function isNumeric(ele){
    var elevalue = getElementValue(ele);
    if(elevalue.length == 0) return false;
    if(!isNaN(elevalue)) return true;
    return false;
}


/**
 * obj에 숫자만 입력 받도록 함.
 * @param event
 * @param obj
 */
function onlyNumeric(event, obj) {
	var _check = (event.which && (event.which  > 47 && event.which  < 58 || event.which == 8));
	if(!_check){
		event.preventDefault();
		var inputVal = obj.value;
		obj.value=inputVal.replace(/[^0-9]/gi,'');
	}
}

/**
 * Decimal 인지 체크 ( Number 는 true 이다 )
 * @param ele ( text 또는 Form Object )
 */
function isDecimal(ele){
    var elevalue = getElementValue(ele);
    elevalue = replaceStr(elevalue, "\\.","");
    return isNumeric(elevalue);
}

/**
 * 0 으로 시작했는지 여부
 *
 * @param ele ( text 또는 Form Object )
 */
function isStartZero(ele){
    var elevalue = getElementValue(ele);
    if(elevalue.length == 0) return false;
    if(elevalue.substring(0,1) == "0") return true;
    return false;
}

/**
 * 영문인지 체크
 * @param ele ( text 또는 Form Object )
 */
function isAlpha(ele){
    var elevalue = getElementValue(ele);
    var pattern=/^([a-zA-Z ]+)$/;
    return (pattern.test(elevalue)) ? true : false;
}

/**
 * 영문 또는 숫자인지 체크
 * @param ele ( text 또는 Form Object )
 */
function isAlphanumeric(ele){
    var elevalue = getElementValue(ele);
    var pattern=/^([a-zA-Z0-9 ]+)$/;
    return (pattern.test(elevalue)) ? true : false;
}

function isAlphanumericKeyCheck(ele){
	var keyCode = event.keyCode;
    if ((keyCode < 48 || keyCode > 57) && (keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 122)){
        event.returnValue=false;
    }
}

/**
 * 한글인지 체크
 * @param ele ( text 또는 Form Object )
 */
function isKorean(ele){
    var elevalue = getElementValue(ele);
    var pattern=/^([가-� ]+)$/;
    return (pattern.test(elevalue)) ? true : false;
}

/**
 *  E-Mail Check
 * @param ele 모든 object 또는 스트링
 * @return booelan ( 이메일 형식이 맞으면 false 아니면 true )
 */
function isEmail(ele)
{
    var elevalue = getElementValue(ele);
    var pattern=/^[_a-zA-Z0-9-\.]+@[\.a-zA-Z0-9-]+\.[a-zA-Z]+$/;
    return (pattern.test(elevalue));
}

function isNotValidEmail(ele)
{
    var elevalue = getElementValue(ele);
    var pattern=/^[_a-zA-Z0-9-\.]+@[\.a-zA-Z0-9-]+\.[a-zA-Z]+$/;
    return !(pattern.test(elevalue));
}

function isNotValidEmailAlert(ele)
{
	if(!isNotValidEmail(ele)){
		alert(x2coMessage.getMessage("adminCommon.validation.alert.email")); //이메일 주소가 정확하지 않습니다. 다시 입력해주세요!
		if(typeof(ele) == "object"){
		    ele.focus();
	    }
		return true;
	}else{
		return false;
	}

}

/**
 * 날짜형식 Check
 * 8자리면 yyyyMMdd 로 체크 10자리면 yyyy-MM-dd 로 체크
 * @param ele ( text 또는 Form Object )
 */
function isDate(ele)
{
    var elevalue = getElementValue(ele);
    var pattern;
    var year = 0 ;
    var month = 0;
	var day = 0 ;

    if(elevalue.length == 10){
    	pattern=/^[1-2]{1}[0-9]{3}-[0-1]{1}[0-9]{1}-[0-3]{1}[0-9]{1}$/;
		year = elevalue.substring(0,4);
		month = elevalue.substring(5,7);
		day = elevalue.substring(8,10);
    }else if(elevalue.length == 8){
    	pattern=/^[1-2]{1}[0-9]{3}[0-1]{1}[0-9]{1}[0-3]{1}[0-9]{1}$/;
    	year = elevalue.substring(0,4);
		month = elevalue.substring(4,6);
		day = elevalue.substring(6,8);
    }else{
    	return false;
    }

	if(pattern.test(elevalue) == false) return false;


	if (month < 1 || month > 12) { // check month range
		return false;
	}

	if (day < 1 || day > 31) {
		return false;
	}

	if ((month==4 || month==6 || month==9 || month==11) && day==31) {
		return false;
	}

	if (month == 2) { // check for february 29th
		var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
		if (day > 29 || (day==29 && !isleap)) {
			return false;
		}
	}

    return true;
}

/**
 * 날짜형식 Check
 * 8자리면 yyyyMMdd 로 체크 10자리면 yyyy-MM-dd 로 체크
 * @param ele ( text 또는 Form Object )
 */
function isDateTime(ele)
{
    var elevalue = getElementValue(ele);
    var pattern;
    var hour;
    if(elevalue.length == 16){
    	pattern=/^[1-2]{1}[0-9]{3}-[0-1]{1}[0-9]{1}-[0-3]{1}[0-9]{1} [0-2]{1}[0-9]{1}:[0-5]{1}[0-9]{1}$/;
    	hour = elevalue.substring(11,13);
    }else if(elevalue.length == 19){
    	pattern=/^[1-2]{1}[0-9]{3}-[0-1]{1}[0-9]{1}-[0-3]{1}[0-9]{1} [0-2]{1}[0-9]{1}:[0-5]{1}[0-9]{1}:[0-5]{1}[0-9]{1}$/;
    	hour = elevalue.substring(11,13);
    }else if(elevalue.length == 12){
    	pattern=/^[1-2]{1}[0-9]{3}[0-1]{1}[0-9]{1}[0-3]{1}[0-9]{1}[0-2]{1}[0-9]{1}[0-5]{1}[0-9]{1}$/;
    	hour = elevalue.substring(8,10);
    }else if(elevalue.length == 14){
    	pattern=/^[1-2]{1}[0-9]{3}[0-1]{1}[0-9]{1}[0-3]{1}[0-9]{1}[0-2]{1}[0-9]{1}[0-5]{1}[0-9]{1}[0-5]{1}[0-9]{1}$/;
    	hour = elevalue.substring(8,10);
    }else{
    	return false;
    }

    if(parseInt(hour,10) > 24){
    	return false;
    }


    return (pattern.test(elevalue));
}


/**
 * 시작날짜와 종료날짜를 비교해서 시작날짜가 종료날짜보다 크면 true 리턴
 * yyyyMMdd 또는 yyyy-MM-dd 형식 비교
 * @param date_start ( text 또는 Form Object )
 * @param end_date ( text 또는 Form Object )
 * @param flag_mandatory 필수 여부
 * @return booelan
function isNotCompareDate(date_start, date_end, flag_mandatory){
	if(flag_mandatory){
	}
	if(!isDate(date_start) || !isDate(date_end)){
		return true;
	}
	var start_elevalue = eval(replaceStr(getElementValue(date_start),"-",""));
	var end_elevalue_ = eval(replaceStr(getElementValue(date_end),"-",""));

	if(start_elevalue > end_elevalue_){
		return true;
	}
	return false;
}
 */

/**
 * 시작날짜와 종료날짜를 비교해서 시작날짜가 종료날짜보다 크면 alert를 띄우고 true 리턴
 * yyyyMMdd 또는 yyyy-MM-dd 형식 비교
 * @param date_start ( text 또는 Form Object )
 * @param end_date ( text 또는 Form Object )
 * @param flag_mandatory 필수 여부 (default true)
 * @return booelan
function isNotCompareDateAlert(date_start, date_end, flag_mandatory){

	var date_start_value = getElementValue(date_start);
	var date_end_value = getElementValue(date_end);

	// 필수항목이 아닐 경우 date_start 와 date_end 의 값이 없으면 다음으로 진행되어야 된다. 따라서 false를 리턴한다.
	if(flag_mandatory == false){
		if(date_start_value.length == 0 && date_end_value.length == 0){
			return false;
		}
	}
	if(!isDate(date_start) || !isDate(date_end)){
		alert(x2coMessage.getMessage("adminCommon.validation.alert.date")); //날짜형식이 잘못됐습니다.
		return true;
	}
	var start_elevalue = eval(replaceStr(date_start_value,"-",""));
	var end_elevalue_ = eval(replaceStr(date_end_value,"-",""));

	if(start_elevalue > end_elevalue_){
		alert(x2coMessage.getMessage("adminCommon.validation.alert.date.start.later")); //시작날짜가 종료날짜보다 클 수 없습니다.
		return true;
	}
	return false;
}
 */

/**
 * 시작날짜와 종료날짜를 비교해서 시작날짜가 종료날짜보다 크면 alert를 띄우고 true 리턴
 * amount  만큼 크기를 비교해서 체크
 * yyyyMMdd 또는 yyyy-MM-dd 형식 비교
 * @param date_start ( text 또는 Form Object )
 * @param end_date ( text 또는 Form Object )
 * @param amount ( 두 날짜 간의 최대 차이 )
 * @param flag_mandatory 필수 여부 (default true)
 * @return booelan
function isNotCompareDateDiffAlert(date_start, date_end, amount, flag_mandatory){

	var date_start_value = getElementValue(date_start);
	var date_end_value = getElementValue(date_end);

	// 필수항목이 아닐 경우 date_start 와 date_end 의 값이 없으면 다음으로 진행되어야 된다. 따라서 false를 리턴한다.
	if(flag_mandatory == false){
		if(date_start_value.length == 0 && date_end_value.length == 0){
			return false;
		}
	}
	if(!isDate(date_start) || !isDate(date_end)){
		alert(x2coMessage.getMessage("adminCommon.validation.alert.date")); //날짜형식이 잘못됐습니다.
		return true;
	}

	date_start_value = replaceStr(date_start_value,"-","")
	date_end_value = replaceStr(date_end_value,"-","");

	var start_elevalue = eval(date_start_value);
	var end_elevalue = eval(date_end_value);

	if(start_elevalue > end_elevalue){
		alert(x2coMessage.getMessage("adminCommon.validation.alert.date.start.later")); //시작날짜가 종료날짜보다 클 수 없습니다.
		return true;
	}


    var DateS = new Date(date_start_value.substring(0,4), date_start_value.substring(4,6), date_start_value.substring(6,8));
    var DateE = new Date(date_end_value.substring(0,4), date_end_value.substring(4,6), date_end_value.substring(6,8));

	var diff = (DateE - DateS)/(1000*60*60*24);
	if(diff > amount){
		alert(argMessage(x2coMessage.getMessage("adminCommon.validation.alert.date.period"), amount)); //일을 넘어 시작일과 종료일을 설정할 수 없습니다.
		return true;
	}

	return false;
}
 */

/**
 * 오늘날짜보다 크면 true
 */
function isTodayUpperDate(ele){
	var elevalue = document.getElementById(ele).value;
	elevalue =  parseInt(replaceStr(elevalue, "-",""));
	var today =  parseInt(getToday());

	if(elevalue > today){
		return true;
	}else{
		return false;
	}
}

/**
 * 오늘날짜보다 작으면 true
 */
function isTodayLowDate(ele){
	var elevalue = document.getElementById(ele).value;
	elevalue = parseInt(replaceStr(elevalue, "-",""));
	var today = parseInt(getToday());

	if(elevalue < today){
		return true;
	}else{
		return false;
	}
}

/**
 * 오늘날짜보다 작거나 같으면 true
 * @param ele
 * @returns
 */
function isTodayLowDateEquals(ele){
    var elevalue = document.getElementById(ele).value;
    elevalue = parseInt(replaceStr(elevalue, "-",""));
    var today = parseInt(getToday());

    if(elevalue <= today){
        return true;
    }else{
        return false;
    }
}

/**
 * 현재날짜 조회 (yyyymmdd)
 * @returns {String}
 */
function getToday()
{
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth()+1;
	if((month+"").length < 2){
		month = "0" + month;
	}
	date = now.getDate();
	if((date+"").length < 2){
		date = "0" + date;
	}
	return today = year + month + date;
}


/**
 * str 이 HTML OBJECT 인지 체크
 * @param str - object 또는 문자열
 */
function isObject(ele){
    return ele.tagName != null ? true : false;
}


/**
 * 비밀번호 Check
 * @param passField 패스워드 element - form.element
 * @param confirmField 패스워드 확인 element - form.element
 * @return boolean
 */
function isNotValidPassword(passField, confirmField) {
	
	if(isEmpty(passField,x2coMessage.getMessage("adminCommon.validation.text.passwd.input")))return true; //패스워드를 입력해주세요!
	if(passField.value === "" || confirmField.value === "") {
		alert(x2coMessage.getMessage("adminCommon.validation.text.passwd.input"));
		return true;
	}
	if(isEmpty(confirmField,x2coMessage.getMessage("adminCommon.validation.text.passwd.reinput"))) return true; //패스워드를 재입력해주세요!
	if(isOutOfRange(passField, 4, 10, x2coMessage.getMessage("adminCommon.validation.text.passwd.format"))) return true; //비밀번호는 4~10자 사이의 숫자 및 영문 대소문자로만 기입해 주세요!
	if(isOutOfRange(confirmField, 4, 10, x2coMessage.getMessage("adminCommon.validation.text.passwd.format"))) return true; //비밀번호는 4~10자 사이의 숫자 및 영문 대소문자로만 기입해 주세요!
	if(passField.value != confirmField.value) {
		alert(x2coMessage.getMessage("adminCommon.validation.alert.passwd.incorrect")); //비밀번호가 서로 일치하지 않습니다. 다시 입력해주세요!
		passField.value="";
		confirmField.value="";
		passField.focus();
		passField.select();
		return true;
	}
	return false;
}

/**
 * 비밀번호 값 Check
 * @param idObj 아이디 element - form.element
 * @param pwObj 패스워드 확인 element - form.element
 * @return boolean
 */
function isNotValidPasswordValue(idObj, pwObj) {

    var idStr = idObj.value;
    var pwStr = pwObj.value;

    if(pwStr.length == 0){
        alert(x2coMessage.getMessage("adminCommon.validation.alert.passwd")); //패스워드를 입력해주세요.
        pwObj.focus();
        return true;
    }

    if(pwStr.length < 8) {
        alert(x2coMessage.getMessage("adminCommon.validation.alert.passwd.length")); //비밀번호는 8자리 이상으로 기입해 주세요.
        pwObj.focus();
        return true;
    }

    if(!pwStr.match(/([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~])|([!,@,#,$,%,^,&,*,?,_,~].*[a-zA-Z0-9])/)) {
        alert(x2coMessage.getMessage("adminCommon.validation.alert.passwd.complexity")); //비밀번호는 영문, 숫자, 특수문자의 조합으로 입력해주십시오.
        pwObj.focus();
        return true;
    }

    if(pwStr.indexOf(idStr) >= 0) {
        alert(x2coMessage.getMessage("adminCommon.validation.alert.passwd.id.include")) //ID는 패스워드에 포함되어서는 안됩니다.
        pwObj.focus();
        return true;
    }

    for(var i=0; i < pwStr.length-4; i++) {
        if(idStr.indexOf(pwStr.substring(i, i+4)) >= 0) {
            alert(x2coMessage.getMessage("adminCommon.validation.alert.passwd.id.similar")) //ID와 4자리 이상 유사한 비밀번호는 사용할 수 없습니다.
            pwObj.focus();
            return true;
        }

    }

    if(pwStr.search(/[0-9]/) < 0) {
        alert(x2coMessage.getMessage("adminCommon.validation.alert.passwd.numeric")) //패스워드에 숫자가 포함되어야 합니다.
        pwObj.focus();
        return true;
    }

    var SamePass_0 = 0;
    var SamePass_1 = 0;
    var SamePass_2 = 0;
    var chr_pass_0;
    var chr_pass_1;
    var chr_pass_2;

    for(var i=0; i < pwStr.length; i++) {
        chr_pass_0 = pwStr.charAt(i);
        chr_pass_1 = pwStr.charAt(i+1);

        //동일문자 카운트
        if(chr_pass_0 == chr_pass_1) {
            SamePass_0 = SamePass_0 + 1
        }

        chr_pass_2 = pwStr.charAt(i+2);

        //연속성(+) 카운드
        if(chr_pass_0.charCodeAt(0) - chr_pass_1.charCodeAt(0) == 1 && chr_pass_1.charCodeAt(0) - chr_pass_2.charCodeAt(0) == 1) {
            SamePass_1 = SamePass_1 + 1
        }

        //연속성(-) 카운드
        if(chr_pass_0.charCodeAt(0) - chr_pass_1.charCodeAt(0) == -1 && chr_pass_1.charCodeAt(0) - chr_pass_2.charCodeAt(0) == -1) {
            SamePass_2 = SamePass_2 + 1
        }
    }

    if(SamePass_0 > 2) {
        alert(x2coMessage.getMessage("adminCommon.validation.alert.passwd.repeat")); //동일문자를 4번 이상 사용할 수 없습니다.
        pwObj.focus();
        return true;
    }

    if(SamePass_1 > 1 || SamePass_2 > 1 ) {
        alert(x2coMessage.getMessage("adminCommon.validation.alert.passwd.sequence")); //연속된 문자열(123, 321, abc, cba 등)을 3자 이상 사용할 수 없습니다.
        pwObj.focus();
        return true;
    }

    return false;
}



/**
 * 주민등록번호 Check
 * @param pid1 주민번호 앞자리 - form.element
 * @param pid2 주민번호 뒤자리 - form.element
 * @return boolean
 */
function isNotValidPID(pid1, pid2) {

	if(isEmpty(pid1,x2coMessage.getMessage("adminCommon.validation.text.rrn.input"))) return true; //주민등록번호를 입력해주세요!
	if(isEmpty(pid2,x2coMessage.getMessage("adminCommon.validation.text.rrn.input"))) return true; //주민등록번호를 입력해주세요!
	if(!isNumber(pid1,x2coMessage.getMessage("adminCommon.validation.text.rrn.prefix.type"))) return true; //주민등록번호 앞자리는 숫자로만 기입해 주세요!
	if(!isNumber(pid2,x2coMessage.getMessage("adminCommon.validation.text.rrn.postfix.type"))) return true; //주민등록번호 뒷자리는 숫자로만 기입해 주세요!
	if(isNotExactLength(pid1, 6, x2coMessage.getMessage("adminCommon.validation.text.rrn.prefix.length"))) return true; //주민등록번호 앞자리는 6자리입니다!
	if(isNotExactLength(pid2, 7, x2coMessage.getMessage("adminCommon.validation.text.rrn.postfix.length"))) return true; //주민등록번호 뒷자리는 7자리입니다!
	strchr = form.pid1.value.concat(pid2.value);
	if (strchr.length == 13	) {
		nlength = strchr.length;

		num1 = strchr.charAt(0);
		num2 = strchr.charAt(1);
		num3 = strchr.charAt(2);
		num4 = strchr.charAt(3);
		num5= strchr.charAt(4);
		num6 = strchr.charAt(5);
		num7 = strchr.charAt(6);
		num8 = strchr.charAt(7);
		num9 = strchr.charAt(8);
		num10 = strchr.charAt(9);
		num11 = strchr.charAt(10);
		num12 = strchr.charAt(11);

		var total = (num1*2)+(num2*3)+(num3*4)+(num4*5)+(num5*6)+(num6*7)+(num7*8)+(num8*9)+(num9*2)+(num10*3)+(num11*4)+(num12*5);
		total = (11-(total%11)) % 10;
	//	if (total == 11) total = 1;
	//	if (total == 10) total = 0;

		if(total != strchr.charAt(12)) {
			alert(x2coMessage.getMessage("adminCommon.validation.alert.rrn")); //주민등록번호가 올바르지 않습니다. 다시 입력해주세요!
			pid1.value="";
			pid2.value="";
			pid1.focus();
			return true;
		}
		return false;
	}	else
		alert(x2coMessage.getMessage("adminCommon.validation.alert.rrn")); //주민등록번호가 올바르지 않습니다. 다시 입력해주세요!
		pid1.value="";
		pid2.value="";
		pid1.focus();
		return true;

}

/**
 * 사업자등록번호 Check
 * @param bid1 사업자등록번호 앞자리 - form.element
 * @param bid2 사업자등록번호 중간 자리 - form.element
 * @param bid3 사업자등록번호 중간 자리 - form.element
 * @return boolean
 */
function isNotValidBID(bid1, bid2, bid3) {

	if(isEmpty(bid1,x2coMessage.getMessage("adminCommon.validation.text.crn.input"))) return true; //사업자등록번호를 입력해 주세요!
	if(isEmpty(bid2,x2coMessage.getMessage("adminCommon.validation.text.crn.input"))) return true; //사업자등록번호를 입력해 주세요!
	if(isEmpty(bid3,x2coMessage.getMessage("adminCommon.validation.text.crn.input"))) return true; //사업자등록번호를 입력해 주세요!
	if(!isNumber(bid1,x2coMessage.getMessage("adminCommon.validation.text.crn.prefix.type"))) return true; //사업자등록번호 앞자리는 숫자로만 기입해 주세요!
	if(!isNumber(bid2,x2coMessage.getMessage("adminCommon.validation.text.crn.middle.type"))) return true; //사업자등록번호 가운데 자리는 숫자로만 기입해 주세요!
	if(!isNumber(bid3,x2coMessage.getMessage("adminCommon.validation.text.crn.postfix.type"))) return true; //사업자등록번호 뒷자리는 숫자로만 기입해 주세요!
	if(isNotExactLength(bid1, 3, x2coMessage.getMessage("adminCommon.validation.text.crn.prefix.length"))) return true; //사업자등록번호 앞자리는 3자리입니다!
	if(isNotExactLength(bid2, 2, x2coMessage.getMessage("adminCommon.validation.text.crn.middle.length"))) return true; //사업자등록번호 가운데 자리는 2자리입니다!
	if(isNotExactLength(bid3, 5, x2coMessage.getMessage("adminCommon.validation.text.crn.postfix.length"))) return true; //사업자등록번호 뒷자리는 5자리입니다!
	strchr = bid1.value.concat(bid2.value.concat(bid3.value));

	num1 = strchr.charAt(0);
	num2 = strchr.charAt(1);
	num3 = strchr.charAt(2);
	num4 = strchr.charAt(3);
	num5= strchr.charAt(4);
	num6 = strchr.charAt(5);
	num7 = strchr.charAt(6);
	num8 = strchr.charAt(7);
	num9 = strchr.charAt(8);
	num10 = strchr.charAt(9);

	var total = (num1*1)+(num2*3)+(num3*7)+(num4*1)+(num5*3)+(num6*7)+(num7*1)+(num8*3)+(num9*5);
	total = total + parseInt((num9 * 5) / 10);
	var tmp = total % 10;
	if(tmp == 0) {
		var num_chk = 0;
	} else {
		var num_chk = 10 - tmp;
	}

	if(num_chk != num10) {
		alert(x2coMessage.getMessage("adminCommon.validation.alert.crn")); //사업자등록번호가 올바르지 않습니다. 다시 입력해주세요!
		bid1.value="";
		bid2.value="";
		bid3.value="";
		bid1.focus();
		return true;
	}
	return false;
}


/**
 * TelNumber Check
 * @param field form.element
 * @return boolean
 */
function isNotValidTel(field) {

   var Count;
   var PermitChar =
         "0123456789-";

   for (var i = 0; i < field.value.length; i++) {
      Count = 0;
      for (var j = 0; j < PermitChar.length; j++) {
         if(field.value.charAt(i) == PermitChar.charAt(j)) {
            Count++;
            break;
         }
      }

      if (Count == 0) {
         alert(x2coMessage.getMessage("adminCommon.validation.alert.telNo")) //전화번호가 정확하지 않습니다. 다시 입력해 주세요!
		 field.focus();
		 field.select();
		 return true;
         break;
      }
   }
   return false;
}

/**
 * 택배사 코드  Check
 * @param deliv_code : 택배사 코드
 * @param invoice_no : 배송장번호
 * @return boolean
 * 대한통운 : korex(10000,10043), 아주택배 : ajutb(10022),    KT로지스 : ktlogistics(10035),  현대택배 : hyundai(10002),        CJGLS : cjgls(10003),
 * 한진택배 : hanjin(10004),      트라넷 : tranet(10024),    고려택배 : koryo(10051),         사가와익스프레스 : sagawa(10050),  SEDEX : sedex(10012,10044),
 * KGB택배 : kgbls(10005),       로젠택배 : kgb(10042),      옐로우캡 : yellow(10004),        삼성HTH : hth(10001),            훼미리택배 : family(10011),
 * 우체국택배 : epost(10006),     우편등기 : registpost(10007)
 */
function isNotValidDevid(deliv_code, invoice_no) {

 /*   var invoiceValue = parseFloat(invoice_no.substr(0,invoice_no.length-1));
	var firstNum     = parseFloat(invoice_no.substr(0,1));
	var lastNum      = parseFloat(invoice_no.substr(invoice_no.length-1,1));
	var invoiceLang  = parseFloat(invoice_no.length);
	var checkValue;

	if (deliv_code == '10006' || deliv_code == '10007'){
		if ( invoiceLang == 13){
			if ( deliv_code == '10006'){
				if (firstNum == 6 || firstNum == 7 || firstNum == 8){
					return true;
				}else
					return false;
			}else {
				if (firstNum == 1 || firstNum == 2 || firstNum == 3){
					return true;
				}else
					return false;
			}
		}
		return false
	}

	if (deliv_code == '10011'){
		if ( invoiceLang == 12){
			checkValue = invoiceValue % 7 ;

			if (lastNum == checkValue){
				return true;
			}else
				return false;
		}
		return false;
	}

	if (deliv_code == '10005' || deliv_code == '10042' || deliv_code == '10009' || deliv_code == '10001'){
		if ( invoiceLang == 11){
			if (deliv_code == '10005'){
				checkValue = invoiceValue % 7 ;
				if (lastNum == checkValue || firstNum == 9){
					return true;
				}else
					return false;
			}else if (deliv_code == '10042' || deliv_code == '10004'){
				checkValue = invoiceValue % 7 ;
				if (lastNum == checkValue){
					return true;
				}else
					return false;
			}else{
				var checkNum = invoice_no.substr(3,invoice_no.length-4);
				checkValue = parseFloat(checkNum) % 7 ;
				if (lastNum == checkValue){
					return true;
				}else
					return false;
			}
		}
		return false;
	}


	if (deliv_code == '10002' || deliv_code == '10003' || deliv_code == '10004' || deliv_code == '10024' || deliv_code == '10051' || deliv_code == '10050'){
		if (invoiceLang == 10){
			checkValue = invoiceValue % 7 ;
			if (lastNum == checkValue){
				return true;
			}else
				return false;
		}
		return false;
	}

	if (deliv_code == '10012'|| deliv_code == '10044'){
		if (invoiceLang == 10){
			checkValue = invoiceValue % 7 + 2;
			if (lastNum == checkValue){
				return true;
			}else
				return false;
		}
		return false;
	}

	if (deliv_code == '10000' || deliv_code == '10043' || deliv_code == '10022' || deliv_code == '10035'){
		if (invoiceLang == 10){
			return true;
		}
		return false;
	}*/
	return true;
}

$.fn.formValidate = function() {

	var _Input = $(this).find("input:text, select, textarea");
	var result = true;

	_Input.each(function(index, input){
		var $Input = $(input);
		var inputCheck = typeof $Input.attr("Required");

		if(inputCheck == 'string' && $.trim($Input.val()) == ''){
			alert(argMessage(_altBlankMsg, $Input.attr('title')));
			$Input.focus();
			result = false;
			return false;
		}
	});

	return result;
}
