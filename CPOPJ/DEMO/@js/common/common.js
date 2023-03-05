var console = window.console || {
    log : function() {
    },
    info : function() {
    },
    warn : function() {
    },
    error : function() {
    }
};

$.namespace = function() {
    var a = arguments, o = null, i, j, d;
    for (i = 0; i < a.length; i = i + 1) {
        d = a[i].split(".");
        o = window;
        for (j = 0; j < d.length; j = j + 1) {
            o[d[j]] = o[d[j]] || {};
            o = o[d[j]];
        }
    }
    return o;
};

jQuery.fn.serializeObject = function() {
    var obj = null;
    try{
        if ( this[0].tagName && this[0].tagName.toUpperCase() == "FORM" ) {
            var arr = this.serializeArray();
            if ( arr ) {
              obj = {};
              jQuery.each(arr, function() {
                obj[this.name] = this.value;
              });
            }
        }
    }
    catch(e) {}
    finally  {}

    return obj;
};

$.namespace("common");
common = {
	_jsonSuccessCd : '0000',
	_jsonLoginErrorCd : '8000',
	_jsonSystemErrorCd : '9998',
	_layerConfirmRun : false,
	_layerAlertRun : false,

	//미디어쿼리 최대 너비
	mediaMaxWidth : 768,
    scrollPos : 0,

    cannotAccess : function() {
        alert('접근할 수 없습니다. 권한이 부족합니다.');
    },
    validateFieldNotEmpty : function(id, message) {
        var loginId = $(id).val();
        if ($.trim(loginId) == '') {
            alert(message);
            return false;
        }

        return true;
    },
    convertSystemToJtmpl : function(str){
        if(str){
            str = str.replace(/\n/gi, "<br/>");
            str = str.replace(/ /gi, "&nbsp;");
            return str;
        }
    },
    splitToEnterKey : function(str){
        if(str){
            var patt= /\n/g;

            if(patt.test(str)){
                str = str.split(/\r|\n/)[0];
            }
            return str;
        }
    },

    sessionClear:function(){
        var url = _baseUrl +"login/sessionClear.do";
        common.Ajax.getAjaxObj("POST", url, "");
        console.log("sessionClear=======");
    },

    loginChk : function(){
        var url= _baseUrl + "login/loginCheckJson.do";
        var loginResult = false;

        $.ajax({
            type: "POST",
            url: url,
            data: null,
            dataType : 'json',
            async: false,
            cache: false,
            success: function(data) {

                if(!data.result && data.url!=null){
                    window.location.href = _secureUrl + data.url + "?redirectUrl=" + encodeURIComponent(location.href);
                }

                loginResult = data.result;
            },
            error : function(a, b, c) {
                console.log(a);
                console.log(b);
                console.log(c);
            }
        });

        return loginResult;
    },


    isLogin : function(){
        var url= _baseUrl + "login/loginCheckJson.do";
        var loginResult = false;

        $.ajax({
            type: "POST",
            url: url,
            data: null,
            dataType : 'json',
            async: false,
            cache: false,
            success: function(data) {
                loginResult = data.result;
            },
            error : function() {
                loginResult = false;
            }
        });

        return loginResult;
    },
/*
    fileChk : function(file){
        var maxSize = 500 * 1024 * 1024 ; // 500KB
        // var maxSize = 0 ;
        var fileFilter =/.(jpg|gif|png|jpeg)$/i;
        var fileType = "";
        var fileSize = 0;

        if(file != null && file != undefined){
            for(i = 0; i < file.size(); i++){
                if(file[i].value!=""){
                    fileType = file[i].files[0].name.slice(file[i].files[0].name.lastIndexOf("."));
                    fileSize = file[i].files[0].size;

                    
                     * console.log("파일["+i+"]>>"+file);
                     * console.log("파일Type["+i+"]>>"+fileType);
                     

                    if(!fileType.match(fileFilter)){
                        alert("등록할 수 없는 파일 형식입니다.");
                        return false;
                    }

                    if(fileSize > maxSize){
                        alert("이미지 파일은 500KB를 넘을 수 없습니다.");
                        return false;
                    }
                }else{
                    console.log("첨부된 파일이 없습니다.["+file[i].name+"]");
                    return false;
                }
            }
            return true;
        }
    },*/
    getNowScroll : function() {
        var de = document.documentElement;
        var b = document.body;
        var now = {};
        now.X = document.all ? (!de.scrollLeft ? b.scrollLeft : de.scrollLeft) : (window.pageXOffset ? window.pageXOffset : window.scrollX);
        now.Y = document.all ? (!de.scrollTop ? b.scrollTop : de.scrollTop) : (window.pageYOffset ? window.pageYOffset : window.scrollY);
        return now;
    },
    isEmpty : function(str) {
        if (str == undefined || str == null || str === "" || str == "undefined" || str == "null") {
            return true;
        } else {
            return false;
        }
    },

    isEmail : function(email){
    	var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if(!regex.test(email)) {
			return false;
		}else{
			return true;
		}
    },

    // CXP 중국향 로직 반영
    isMobile : function(mobile){
    	console.log(mobile);
    	if (mobile.indexOf("+86") > -1) {
    		return false;
    	}
    	/*
    	if(mobile.startsWith(mobile, '+86')) {
    		return false;
    	}
    	*/
    	var regex = /(^1[3-9]\d{9}$)|(^\+\d+$)/;
		if(!regex.test(mobile)) {
			return false;
		}else{
			return true;
		}
    },

    isOtp : function(otpNo){
    	var regex = /^\d{6}$/;
		if(!regex.test(otpNo)) {
			return false;
		}else{
			return true;
		}
    },
	/**
	 * 날짜형식 Check
	 * 8자리면 MMddyyyy 로 체크 10자리면 MM-dd-yyyy 로 체크
	 * @param ele ( text 또는 Form Object )
	 */
	isDateMMddyyyy : function (elevalue){
	    //var elevalue = getElementValue(ele);
	    var pattern;
	    var year = 0 ;
	    var month = 0;
	    var day = 0 ;

	    var today = new Date(); // 날짜 변수 선언
	    var yearNow = today.getFullYear(); // 올해 연도 가져옴


	    if(elevalue.length == 10){
	        pattern=/^[0-1]{1}[0-9]{1}-[0-3]{1}[0-9]{1}-[1-2]{1}[0-9]{3}$/;
	        month = elevalue.substring(0,2);
	        day = elevalue.substring(3,5);
	        year = elevalue.substring(6,10);
	    }else if(elevalue.length == 8){
	        pattern=/^[0-1]{1}[0-9]{1}[0-3]{1}[0-9]{1}[1-2]{1}[0-9]{3}$/;
	        month = elevalue.substring(0,2);
	        day = elevalue.substring(2,4);
	        year = elevalue.substring(4,8);
	    }else{
	        return false;
	    }

	    if(pattern.test(elevalue) == false) return false;

	    if (1900 > year || year > yearNow){
	    	return false;
	    }

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
	},

	/**
	 * 레이어 alert
	 */
    layerAlert : function(msg, _callback){
    	common._layerAlertRun = true;

    	$('#layer-pop-msg').html(msg);
		layerPopOpen('layerPop-alert');
		
		var args = Array.prototype.slice.call(arguments);
		$("#layerPop-alert-btn-ok").off("click").on("click", function(){
			if(common._layerAlertRun){
				common._layerAlertRun = false;

				layerPopClose('layerPop-alert');

				if(_callback != null && _callback != '' && _callback != undefined) {
					if (args.length === 3) {
						_callback(args[2]);
					}
					else if (args.length === 4) {
						_callback(args[2], args[3]);
					}
					else if (args.length === 5) {
						_callback(args[2], args[3], args[4]);
					}
					else if (args.length === 6) {
						_callback(args[2], args[3], args[4], args[5]);
					}
					else if (args.length === 7) {
						_callback(args[2], args[3], args[4], args[5], args[6]);
					}
					else if (args.length === 8) {
						_callback(args[2], args[3], args[4], args[5], args[6], args[7]);
					}
					else if (args.length === 9) {
						_callback(args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
					}
					else {
						_callback();
					}
				}
			}
			$(document).off("keydown");
		});

		$(document).on("keydown", function(e) { 
			if (e.keyCode == 13) {
				$("#layerPop-alert-btn-ok").click();
			}
			return false;
		});
		
    },

    /**
     * 레이어 confirm
     */
    layerConfirm : function(msg, _callback){
    	common._layerConfirmRun = true;

        $('#layerPop-confirm-msg').html(msg);
        layerPopOpen('layerPop-confirm');

        var args = Array.prototype.slice.call(arguments);
        $("#layerPop-confirm-btn-ok").off("click").on("click", function(){
        	if(common._layerConfirmRun){
        		common._layerConfirmRun = false;

        		 layerPopClose('layerPop-confirm');

                 if(_callback != null && _callback != '' && _callback != undefined) {
                 	if (args.length === 3) {
                         _callback(args[2]);
                 	}
                 	else if (args.length === 4) {
                         _callback(args[2], args[3]);
                 	}
                 	else if (args.length === 5) {
                         _callback(args[2], args[3], args[4]);
                 	}
                 	else if (args.length === 6) {
                         _callback(args[2], args[3], args[4], args[5]);
                 	}
                 	else if (args.length === 7) {
                         _callback(args[2], args[3], args[4], args[5], args[6]);
                 	}
                 	else if (args.length === 8) {
                         _callback(args[2], args[3], args[4], args[5], args[6], args[7]);
                 	}
                 	else if (args.length === 9) {
                         _callback(args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
                 	}
                 	else {
                         _callback();
                 	}
                 }
        	}
        });
    },

    sleep : function(millisecondsToWait){
		var now = new Date().getTime();
		while ( new Date().getTime() < now + millisecondsToWait ) {
			/* do nothing; this will exit once it reaches the time limit */
			/* if you want you could do something and exit */
		}
	},

    /**
     * Validation 처리를 위한 Object
     */
    Validator : {
        /**
         * common.Validator.isNumber()
         *
         * 해당 필드 값이 숫자인지 여부를 검사 함.
         *
         * 사용 예)
         * common.Validator.isNumber("#elId", "값을 확인 하세요.");
         * 일때 다음의 동작 실행
         * if($("#elId").val() != 숫자) {
         *      alert("값을 확인 하세요.");
         *      $("#elId").focus();
         *    }
         *
         *
         *
         * @param jqPath : Element의 Jquery Path
         * @param message : 입력값 오류일때 표시할 Message 값
         *
         * @return true(정상) or false(오류)
         *
         *
         */
        isNumber : function(jqPath, message) {
            var obj = $(jqPath);
            var value = obj.val();
            var isNumber = value.isNumber();
            if(!(isNumber)) {
                alert(message);
                obj.focus();
            }
            return isNumber;
        }
    },
    /**
     * timeStamp 데이타를 날짜 포맷으로 변환
     */
    formatDate  : function (timeStamp, format){
        var newDate = new Date();
        newDate.setTime(timeStamp);
        var formatDate = newDate.format(format);

        return formatDate;
    },


    preventAction : function(){
        $(document.body).attr("oncontextmenu", "return false");
        document.onkeydown = common.preventKeyAction;
        document.onmousedown = common.preventKeyAction;
    },

    preventKeyAction : function(){
        if (event.keyCode == 17){
            alert ("Ctrl 금지");
            return false;
        }

//        if (event.keyCode == 18){
//            alert ("Alt 금지");
//            return false;
//        }bfelevenlog.error(e.getMessage(), e);
//
        if (event.keyCode ==91){
            event.keyCode == 505;
            alert ("윈도우 Fuction Key 금지");
        }

        if (event.keyCode > 112 && event.keyCode < 123){
            event.keyCode = 505;
            alert("Function key 금지");
        }
        if (event.keyCode == 505) {
            return false;
        }
    },

    setLazyloadImg : function(type) {
    	if (type == undefined) {
    		type = "car";
    	}
    	var placeholder = _imgUrl + "common/noimg/" + type + "_no-image.png";
    	
    	$("img.lazyload").lazyload({
    		effect : "fadeIn", 
    		threshold : 500,
    		placeholder : placeholder
    	});
    	
    	var seqLazyload = new SeqLazyload();
    	seqLazyload.load({selector : "img.seq-lazyload", 
    		classNm : "seq-lazyload", 
    		placeholder : placeholder
    	});
    	
    	$("img.lazyload").removeClass("lazyload").addClass("completed-lazyload");
    	$(document).resize();
    },
    
    /**
     * 이미지 에러 공통 처리
     */
    errorImg : function(obj) {
    	var type = $(obj).data("type");
    	if (type == undefined  || type == null || type == "") {
    		type = "car";
    	}
    	
        obj.src = _imgUrl + "/common/noimg/" + $(obj).data("type") + "_no-image.png";
        obj.onerror = '';
    },

    /**
     * input box vaildation 공통 알림처리
     * @param objNm inputbox를 담고 있는 div 지시자
     * @param checkFunc vaildation 체크를 수행할 함수, 리턴으로 {result:[결과true/false], resultMsg:결과문구} json 리턴.
     */
    checkVaild : function(objNm, checkFunc) {
    	var checkResult = checkFunc();

    	this.showVaildMsg(objNm, checkResult);

    	return checkResult.result;
    },

    /**
     * input box validation 공통 메시지표시 처리
     */
    showVaildMsg : function(objNm, resultJson) {
    	$(objNm).parent().find("em").remove();
    	$(objNm).parent().removeClass("messageOn");
    	$(objNm).removeClass("error");

    	if (!resultJson.result) {
    		$(objNm).addClass("error");
    		$(objNm).parent().append("<em class='message'>" + resultJson.resultMsg + "</em>");
    		$(objNm).parent().addClass("messageOn");
    	}
    },

    vaildNumberOnly : function(objNm) {
        //숫자만 입력 처리
        $(objNm).on("keyup", function() {
            $(this).val($(this).val().replace(/[^0-9]/g,""));
        });
    },

    loadingBarTimer : null,

    showLoadingBar : function(noLoadingBar, time, loadingBarTxt) {
    	if(noLoadingBar != null && noLoadingBar) {
    		return;
    	}
    	if(time == undefined || time == null){
    		time = 60000;
    	}

    	var html = '';
    	html += '	<div class="loading-wrap" id="gosLoadingBar">';
    	
    	if (loadingBarTxt != undefined && loadingBarTxt != null && loadingBarTxt != "") {
        	html += '		<div class="loading-box">';
        	html += '			<div class="loader-wrapper">';
        	html += '			  <div class="loader"></div>';
        	html += '			</div>';
        	html += '			<div class="txt">';
        	if(!!loadingBarTxt){
        		html += '<em>'+loadingBarTxt+'</em><br>';
        	}
        	html += '				Please wait.';
        	html += '			</div>';
        	html += '		</div>';
    	} else {
        	html += '	<div class="loader"></div>                                                               ';
    	}
    	html += '	</div>                                                                                ';

    	if ($("#gosLoadingBar").length == 0) {
        	$("body").append(html);

        	$("#gosLoadingBar").show();

        	this.loadingBarTimer = setTimeout(function() {
        		common.hideLoadingBar(noLoadingBar);
        	}, time);
    	}
    },

    hideLoadingBar : function(noLoadingBar) {
    	if (noLoadingBar != null && noLoadingBar) {
    		return;
    	}
    	
    	clearTimeout(this.loadingBarTimer);
    	$("#gosLoadingBar").remove();
    	this.loadingBarTimer = null;
    },

	// 스펙 문자열 표시를 위해 문자부분에 태그 삽입 처리함.
	getSpecTagStr : function(specStr, tagName) {
		var result = '';

		if(typeof specStr == 'undefined'){
			return result;
		}
		var p = specStr.match(/[^0-9,.]+/);

		if(specStr != ''){
			if(p){
				result += specStr.substring(0, p.index);
				result += '<' + tagName + '>' + specStr.substring(p.index) + '</' + tagName + '>';
			}else{
				result = specStr;
			}
		}

		return result;
	},

	setLocale : function(langCd) {
//		setCookie("locale_setting", langCd, null, "/");
		var url = _baseUrl + "common/changeLocale.do";
		var param = {
			"langCd" : langCd	
		};
		
		common.Ajax.sendRequest("GET", url, param, function() {
			location.reload();
		}, true, true);
	},

	 /**
     * AuthAjax 콜백 처리 : login comfirm
     */
    isLoginAjax : function(response, isOtherResultCodeChk){
    	
    	if(isOtherResultCodeChk === undefined
			|| isOtherResultCodeChk === null
			|| isOtherResultCodeChk === ""){
    		isOtherResultCodeChk = true;
    	}
    	
    	if(response && response.resultCode == common._jsonSuccessCd){
    		return true;
    	} else if( response && response.code == common._jsonLoginErrorCd){
    		common.hideLoadingBar(null);
            common.layerConfirm(_COMMON_MSG_MOVE_LOGIN, common.link.moveLoginPage);
            return false;
    	} else if(!isOtherResultCodeChk){
    		return true;
    	} else {
    		common.hideLoadingBar(null);
        	common.layerAlert(response.resultMessage);
        	return false;
    	}
    },
    
    /**
     * 약관 상세 레이어 팝업
     */
    openTermDetailPop : function(linkUrl){
    	if(linkUrl == undefined || linkUrl == null || $.trim(linkUrl) == ""){
    		return false;
    	}
    	
    	var termUrl = _baseUrl+$.trim(linkUrl);
    	if(linkUrl.indexOf("/") == 0){
    		termUrl = _baseUrl+$.trim(linkUrl).substring(1, linkUrl.length);
    	}
    	
    	$.ajaxSetup({ statusCode:null });
    	$.ajax({
    		type : "post"
    		,url : termUrl
    		,data : null
    		,async : true
    		,success: function(response){
    			$("#layerPop-term").find(".box").html(response);
        		layerPopOpen("layerPop-term");
    		}
    		,error	: function (jqXHR,error, errorThrown){
    			common.layerAlert(_COMMON_MSG_ERROR);
    		}
    		,complete : function (){
    			common.Ajax.init();
    		}
    	});
    },
    
};

/**
 * header
 */
$.namespace("common.header");
common.header = {
	init : function() {
//		if ($('.subnav').length > 0) {
//		    $('.subnav').mouseover(function(){
//		       $(this).siblings().find('a').addClass('disabled');
//		    });
//		    $('.subnav').mouseleave(function(){
//		       $(this).siblings().find('a').removeClass('disabled');
//		    });
//
//			$(".subnav").click(function() {
//			    if($(this).hasClass('active')){
//			        $(this).removeClass('active');
//			        $(this).children('#subCont').slideUp();
//			    }else {
//			        $(this).addClass('active');
//			        $(this).children('#subCont').slideDown();
//			    }
//			});
//		}

//		if ($('.menu-toggle').length > 0) {
//			$('.menu-toggle').click(function() {
//			  $('.nav').toggleClass('nav-open', 500);
//			  $('.myGarage').toggleClass('hide', 500);
//			  $(this).toggleClass('open');
//			  $('.login').toggleClass('show', 500);
//			  $('.myPage').toggleClass('show', 500);
//			});
//		}

		if (_isLogin) {
			$('#header').find('.navRight').find('.login').text(_msg_logout);
		} else {
			$('#header').find('.navRight').find('.login').text(_msg_login);
		}
	}
};

/**
 * footer 공통
 */
$.namespace("common.footer");
common.footer = {
	init : function() {
		var showLangNm = $("#footer .languageSel .languageView a[data-langcd='" + _langCd + "']").text();
		$("#footer .languageSel a span").text(showLangNm);

		$("#footer .languageSel .languageView a").on("click", function() {
			common.setLocale($(this).data("langcd"));
		});
	}
};

/**
 * SNS 공유
 */
$.namespace("common.sns");
common.sns = {

    isInit : false,
    title : $("title").text(),
    shareUrl : location.href,

    init : function(title, shareUrl) {
        this.isInit = true;
        if (title != undefined && !title.isEmpty()) {
            common.sns.title = title;
        }
        if (shareUrl != undefined && !shareUrl.isEmpty()) {
            common.sns.shareUrl = shareUrl;
        }
    },

    openSnsSharePopup : function() {
        var param = {};
        var url = _baseUrl + "common/snsSharePop.do"

        if ($('#layerPop-snsShare').length < 1) {
            common.Ajax.sendRequest("GET", url, param, this.openSnsSharePopupCallback, true, true);
        } else {
            this.openSnsSharePopupCallback();
        }
    },

    /**
     * SNS 공유 팝업 열기 콜백
     */
    openSnsSharePopupCallback : function(res) {
        // 레이어팝업 열기
        if (res != undefined && res != null) {
            $("body").append(res);
        }

        $('html').addClass('layerPopOpen');
        $('#layerPop-snsShare').addClass('open');
    },

    /**
     * SNS 공유 팝업 닫기
     */
    closeSnsSharePopup : function() {
        $('html').removeClass('layerPopOpen');
        $('#layerPop-snsShare').removeClass('open');
    },

    /**
     * 공유하기
     */
    doShare : function(type) {
        if (!this.isInit) {
            console.log("does not init!");
        }
        if (type == "weibo") {
            common.sns.snsShareWeibo();
        } else if (type == "email") {
            common.sns.snsShareEmail();
        } else if (type == "url") {
            common.sns.snsShareUrl();
        }
    },

    getShortenUrl : function(shareTp, callbackFunc) {
    	var param = {
    			lnkUrlAddr : common.sns.shareUrl,
    			shareTp : shareTp
    	}
    	common.Ajax.sendRequest(
				"POST"
				, _baseUrl+"common/getShareSeqJson.do"
				, param
				, callbackFunc
				, true
				, true);
    },

    /**
     * 웨이보
     */
    snsShareWeibo : function() {
    	this.getShortenUrl("WEI", function(res) {
	    	var shareUrl = common.sns.shareUrl;

	    	if(res && res.resultCode == common._jsonSuccessCd){ //0000
    			shareUrl = _baseUrl + "/sh?" + res.data.shareSeq;
    		}

	    	var weiboUrl = "http://service.weibo.com/share/share.php?appkey=4133325842&language=zh_cn&url=" + encodeURIComponent(shareUrl) + "&title=" + encodeURIComponent(common.sns.title);
	        window.open(weiboUrl);

	        common.sns.closeSnsSharePopup();
    	});
    },

    /**
     * 이메일
     */
    snsShareEmail : function() {
    	this.getShortenUrl("EML", function(res) {
	    	var shareUrl = common.sns.shareUrl;

	    	if(res && res.resultCode == common._jsonSuccessCd){ //0000
    			shareUrl = _baseUrl + "/sh?" + res.data.shareSeq;
    		}

	        location.href="mailto:?subject=" + encodeURIComponent(common.sns.title) + "&body=" + encodeURIComponent(shareUrl);

	        common.sns.closeSnsSharePopup();
    	});
    },

    /**
     * Url
     */
    snsShareUrl : function() {
    	this.getShortenUrl("URL", function(res) {
	    	var shareUrl = common.sns.shareUrl;

	    	if(res && res.resultCode == common._jsonSuccessCd){ //0000
    			shareUrl = _baseUrl + "/sh?" + res.data.shareSeq;
    		}

	    	$("body").append("<input type='text' id='tmpShareUrl'/>");
	    	$("#tmpShareUrl").val(shareUrl);  // 현재 URL 을 세팅해 줍니다.
	    	$("#tmpShareUrl").select();
	    	document.execCommand("copy"); // 클립보드에 복사합니다.
	    	$("#tmpShareUrl").blur(); // 선택된 것을 다시 선택안된것으로 바꿈니다.
	    	$("#tmpShareUrl").remove();
	    	common.sns.closeSnsSharePopup();
	    	
	    	setTimeout(function() {
		    	common.layerAlert(copyUrlMsg);
	    	}, 1000);
    	});
    }
};

/**
 * header > login
 */
/*
$.namespace("common.login");
common.login = {

	isInit : true,

	init : function(){
		this.bindEvent();
	},

	bindEvent : function(){

		$(".loginArea").find(".loginBox").find("div").eq(0).hover(function() {
			$(this).css('cursor','pointer');
		});
		$(".loginArea").find(".loginBox").find("div").eq(1).hover(function() {
			$(this).css('cursor','pointer');
		});

		//통합회원 로그인
		$(".loginArea").find(".loginBox").find("div").eq(0).click(function(e){
			common.link.moveMemberLoginForm();
		});
		//비회원 로그인
		$(".loginArea").find(".loginBox").find("div").eq(1).click(function(e){
			common.link.moveNonMemberLoginForm();
		});
		//통합회원가입
		$(".loginArea").find(".btnArea").find("a").eq(0).click(function(e){
			common.link.moveMemberJoinForm();
		});
		//통합회원아이디찾기
		$(".loginArea").find(".btnArea").find("a").eq(1).click(function(e){
			common.link.moveMemberFindForm();
		});
	},
};
*/

/**
 * header > 내차고 sideBar
 */
$.namespace("common.garage");
common.garage = {

	isInit : true,

	init : function(){

		//이벤트 바인딩
		this.bindEvent();

		//헤더 내차고 수량 갱신
		this.getCartCntJson();

	},

	bindEvent : function(){
		// Handlebars helper 추가
		common.handlebars.addHandlebarsHelper();

		//마이페이지 조회
		if ($("#myPageMain").length > 0) {
			$("#myPageMain").click(function(e){
				if (_isLogin) {
					common.link.moveMyPageMain();
				} else {
					//layerPopOpen('layerPop-login');
					window.location.href = _baseUrl + "login/loginPage.do?redirectUrl=" + encodeURIComponent(location.href);
				}
			});
		}

		// 사이드바 내차고 목록 조회
		if ($("#myGarage").length > 0) {
			$("#myGarage").click(function(e){
				// 내차고 목록 조회
				common.garage.getCarListJson();
			});
		}

		//Get Your Genesis
		if ($("#garageSideBar #btnGoGenesis").length > 0) {
			$("#garageSideBar #btnGoGenesis").click(function(e){
                common.link.subMain();
			});
		}

		/*
		 * css 우선 적용되어 common.js 로딩 전에 사이드바가 열린 상태라면,
		 * common.js 로딩 후 init시 사이드바 로딩
		 */
		if(!$(".sideLayer").hasClass("sideLayer-toggle")){
			common.garage.isInit=true;
			common.garage.getCarListJson();
		}
	},

	//Ajax 통신 후 이벤트 바인딩
	bindJsonEvent : function(){

		//저장하기, 삭제하기
		$("#garageSideBar [id*=btnLike]").click(function(e){
			e.preventDefault();
			//하트(♥) 체크 후 삭제
			if(!$(this).is(":checked")){
				var cartSeq = $(this).data("cart_seq");

				if(cartSeq!=""){
					var param = {
							cartSeq : cartSeq
					};

					common.layerConfirm(_delConfirm , function(){
						common.garage.deleteMyGarageJson(param, common.garage.deleteMyGarageJsonCallback, true);
						$("#garageLoader").show();
						$("#goToMyGarage").hide();
						$(".sideLayer").find(".likeList").find("li").not("#garageLoader").hide();
					});
				}
			}else{
				//SideBar에서는 저장 기능을 지원하지 않음
			}
		});
	},

	//헤더 내차고 수량 조회
	getCartCntJson : function(){
		var param = {
		}
		common.Ajax.sendRequest(
				"GET"
				, _baseUrl+"mypage/garage/getMyGarageCntJson.do"
				, param
				, common.garage.getCartCntJsonCallback
				, true
				, true);

	},

	//헤더 내차고 수량 조회 callback
	getCartCntJsonCallback : function(res) {
		// 오류처리
		if(res && res.resultCode == common._jsonSuccessCd){ //0000
			$("#myGarageCnt").show();
			$("#myGarageCnt").text(res.data.cartListCnt);
			if(res.data.cartListCnt>10){
				$("#goToMyGarageTxt").text(_viewAll);
			}else{
				$("#goToMyGarageTxt").text(_goToMyGarage);
			}
			//내차고 화면일 경우 수량 갱신
			if(window.location.href.indexOf("/getMyGarage.do") > 0){
				$("#totalCnt").text(res.data.cartListCnt);
			}
		}else{ //9999
			common.layerAlert(res.resultMessage); //비정상적인 오류가 발생하였습니다.
			return;
		}
	},

	//내차고 저장
	saveMyGarageJson : function(param, callbackFn){
		//차량 정보 저장
		sessionStorage.setItem("cartInfo", JSON.stringify(param));

		//다중 Callback이므로 이전 Ajax 종료시 loadingbar hide 되는 문제 방지 위한 loadingBar 수동 호출
		common.showLoadingBar(false, (1000*60*3));

		//BTO 사양검증 요청 위한 공통 Callback
		var commonSaveMyGarageJsonCallback = function(res){

			if(res && res.resultCode == common._jsonSuccessCd){ //SUCCESS
				var cartSeq = res.data.cartInfo.cartSeq;

				if(res.data.btoSpecValidReq){
					common.hideLoadingBar(null);
					common.garage.getBtoSpecValidRslt(callbackFn, res.data.cartInfo.cartSeq, res.data.loadingBarTxt);
				}else{
					callbackFn(res);
					common.hideLoadingBar(null);
				}
			}else{
				//custom callback
				callbackFn(res);
				common.hideLoadingBar(null);
			}

		};

		common.Ajax.sendRequest(
				"POST"
				, _baseUrl+"mypage/garage/saveMyGarage.do"
				, param
				, commonSaveMyGarageJsonCallback
				, true, true);
	},

	//내차고 저장 Default Callback
	saveMyGarageJsonCallback : function(res){
		if(res && res.resultCode == common._jsonSuccessCd){ //SUCCESS
			var cartSeq = res.data.cartInfo.cartSeq;

			var fscKey = res.data.cartInfo.fsc+res.data.cartInfo.intColorCd+res.data.cartInfo.extColorCd;
			//fsc가 없는 BTO 차량에 대해서는 고려하지 않음 (해당화면에서 따로 처리)
			if(fscKey.length>=20){
				for(var i=0; i<$(".rcmdCar").length; i++){
					if($(".rcmdCar").eq(i).data("fsc_key")==fscKey){
						$(".rcmdCar").eq(i).data("cart_seq", cartSeq);
					}
				}
			}

			common.garage.saveMyGarageComplete();
			
			common.garage.myCartSeqList = null;
			
		}else if(res && res.resultCode == 8913){ //이미 저장된 중복 차량
			//체크된 css(♥) 그대로 유지
			common.layerAlert(res.resultMessage);
		}else{
			common.garage.saveMyGarageFailure(res);
		}
	},

	/*
	 * 사양 검증 결과 체크
	 */
	getBtoSpecValidRslt : function(callbackFn, cartSeq, loadingBarTxt){
		var url = _baseUrl+"mypage/garage/checkBtoSpecValidRsltJson.do";
		var param ={
			cartSeq : cartSeq
		};

        common.showLoadingBar(false, (1000*60*3));
        $(".loading-wrap").find(".txt").html(loadingBarTxt);

		//사양검증 결과에 대한 기본 Callback
		var commonBtoSpecValidCallback = function(res){
			common.hideLoadingBar(null);
			if(res && res.resultCode == 8915){
				//차량 스펙 검증 지연
				common.garage.getInputEmailFormAjax(cartSeq, loadingBarTxt, callbackFn, res);
			}else{
				callbackFn(res);
			}
		};

		common.Ajax.sendJSONRequest("POST"
				,url
				,param
				,commonBtoSpecValidCallback
				,true, true, null, loadingBarTxt);
	},

	getInputEmailFormAjax : function(cartSeq, loadingBarTxt, callbackFn, res){
		var param = {
				cartSeq : cartSeq
		}

		common.Ajax.sendRequest(
				"POST"
				, _baseUrl+"mypage/garage/getInputEmailForm.do"
				, param
				, function(resAjax){
					//기존 레이어 삭제
					$("#layerPop-inputEmail").remove();

					//새 레이어 생성
					$("#container").after(resAjax);

					//로딩바 삭제
					common.hideLoadingBar(null);

					//레이어 팝업
					layerPopOpen("layerPop-inputEmail");

					callbackFn(res);
				}
				, false, true, null, loadingBarTxt);
	},

	saveMyGarageComplete : function(){

		common.layerAlert(_sucsSaveCar);

		//내차고 수량 갱신
		common.garage.getCartCntJson();
		//내차고 목록 갱신 준비
		common.garage.isInit=true;
		if(!$(".sideLayer").hasClass("sideLayer-toggle")){
			common.garage.isInit=true;
			//사이드바 열려있다면 내차고 사이드바 갱신
			common.garage.getCarListJson();
		}
	},

	saveMyGarageFailure : function(res){

		var sessionCartInfo = JSON.parse(sessionStorage.getItem("cartInfo"));
		var sessionFscKey = sessionCartInfo.fsc+sessionCartInfo.intColorCd+sessionCartInfo.extColorCd;
		var fscKey = sessionFscKey;

		//fsc가 없는 BTO 차량에 대해서는 고려하지 않음 (해당화면에서 따로 처리)
		if(fscKey.length>=20){
			for(var i=0; i<$(".rcmdCar").length; i++){
				if($(".rcmdCar").eq(i).data("fsc_key")==fscKey){
					//체크 된 css(♥) 원복(v)
					$(".rcmdCar").eq(i).prop("checked", false);
				}
			}
		}

		common.layerAlert(res.resultMessage);
	},

	//내차고 삭제
	deleteMyGarageJson : function(param, callbackFn, noLoadingBar){
		//사이드바 로딩바 표시
		sideLayer_scroll.scrollTo(0,0);
		$("#garageLoader").show();
		$("#goToMyGarage").hide();
		$(".sideLayer").find(".likeList").find("li").not("#garageLoader").hide();
		sideLayer_scroll.refresh();
		
		//내차고 삭제
		common.Ajax.sendRequest("POST"
				, _baseUrl+"mypage/garage/deleteMyGarage.do"
				, param
				, callbackFn //common.garage.deleteMyGarageJsonCallback
				, true
				, noLoadingBar);
	},

	//내차고 삭제 Callback
	deleteMyGarageJsonCallback : function(res){
		if(res.resultCode == common._jsonSuccessCd){ // 0000
			common.layerAlert(_delSuccess);
			
			//화면에서 ♥ 제거
			var cartSeq = res.data.cartInfo.cartSeq;
			if(res.data && res.data.cartInfo && res.data.cartInfo.cartSeq){
				for(var i=0; i<$(".rcmdCar").length; i++){
					if($(".rcmdCar").eq(i).data("cart_seq")==cartSeq){
						//사이드바에서 삭제시 contents내 추천차량에서도 체크 해제
						$(".rcmdCar").eq(i).prop("checked", false);
					}
				}
			}

			var fscKey = res.data.cartInfo.fsc+res.data.cartInfo.intColorCd+res.data.cartInfo.extColorCd;
			//cart_seq로 판별할 수 없는 경우 fsc로 체크 해제. fsc가 없는 BTO 차량에 대해서는 고려하지 않음 (해당화면에서 따로 처리)
			if(fscKey.length>=20){
				for(var i=0; i<$(".rcmdCar").length; i++){
					if($(".rcmdCar").eq(i).data("fsc_key")==fscKey){
						//사이드바에서 삭제시 contents내 추천차량에서도 체크 해제
						$(".rcmdCar").eq(i).prop("checked", false);
					}
				}
			}

			//내차고 화면일 경우 화면 갱신
			if(window.location.href.indexOf("/getMyGarage.do") > 0){
				//단, 빈차고 화면이 아닐 경우만 화면 갱신 (추천차량 삭제시 refresh 방지)
				if(!mypage.garage.isEmptyGarage){
					$("#contsArea").find(".vehicleList").remove();
					mypage.garage.pageIdx=1;
					mypage.garage.getCarListJson();
				}else{
					$("#totalCnt").text(0);
				}
			}

			//목록/상세 화면 처리 결과 동기화 처리
			common.garage.deleteMyGarageCheckSync(res.data.cartInfo.cartSeq);
			
			//내차고 헤더 수량 갱신
			common.garage.getCartCntJson();
			//내차고 사이드바 목록 갱신
			common.garage.isInit=true;
			if(!$(".sideLayer").hasClass("sideLayer-toggle")){
				//사이드바 열려있다면 내차고 사이드바 갱신
				common.garage.isInit=true;
				common.garage.getCarListJson();
			}
			
			common.garage.myCartSeqList = null;

		}else{
			//사이드바 로딩바 해제, 체크 해제 된 css 원복 (♥)
			$("#garageLoader").hide();
			$(".sideLayer").find(".likeList").find("li").not("#garageLoader,#emptyGarage").show();
			$("#btnLike_"+res.data.cartInfo.cartSeq).prop("checked", true);

			var fscKey = res.data.cartInfo.fsc+res.data.cartInfo.intColorCd+res.data.cartInfo.extColorCd;
			//fsc가 없는 BTO 차량에 대해서는 고려하지 않음 (해당화면에서 따로 처리)
			if(fscKey.length>=20){
				for(var i=0; i<$(".rcmdCar").length; i++){
					if($(".rcmdCar").eq(i).data("fsc_key")==fscKey){
						//체크 해제 된 css 원복 (♥)
						$(".rcmdCar").eq(i).prop("checked", true);
					}
				}
			}

			common.layerAlert(_exceptionMsg);
		}
	},

	//사이드바에서 삭제할 경우 목록에 동기화하기 위한 처리함수 각 화면 별 override구현 필요 - 성공시에만 호출됨.
	deleteMyGarageCheckSync : function(cartSeq) {
		//override
	},
	
	cartListCallback : null,

	// 내차고 레이어 조회
	getCarListJson : function(_callback) {
		//첫 클릭일 시 조회
		if(common.garage.isInit){
			//사이드바 로딩바 표시
			sideLayer_scroll.scrollTo(0,0);
			$("#garageLoader").show();
			$("#goToMyGarage").hide();
			$(".sideLayer").find(".likeList").find("li").not("#garageLoader").hide();
			sideLayer_scroll.refresh();

			var param = {
					pageIdx : 1,
					rowsPerPage : 10,
			}
			common.Ajax.sendRequest(
					"GET"
					, _baseUrl+"mypage/garage/getMyGarageListJson.do"
					, param
					, common.garage.getCarListJsonCallback
					, true
					, true);
		}
		common.garage.isInit=false;
		common.garage.cartListCallback = _callback;
	},

	// 내차고 레이어 조회 callback
	getCarListJsonCallback : function(res) {
		// 오류처리
		if(res && res.resultCode == common._jsonSuccessCd){ //0000
//			common.garage.resData = res.data;
			$(".sideLayer").find(".likeList").find("li").not("#emptyGarage,#garageLoader").remove();
			if(res.data && res.data.cartListCnt == 0){
				//빈차고
				$("#emptyGarage").show();
				$("#goToMyGarage").show();
				$(".sideLayer").find(".likeList").find("li").not("#emptyGarage").hide();

			}else{
				//내차고
				var source = $("#myGarageLayer-template").html();
				var template = Handlebars.compile(source);
				var html = template(res.data);
				$("#emptyGarage").after(html);

				//JSON 데이터로 새로 그린 html에 eventBind
				common.garage.bindJsonEvent();

				$("#garageLoader").hide();
				$("#goToMyGarage").show();
				$("#emptyGarage").hide();

				//[publish] scroll event bind
				sideLayer_scroll.refresh();
				//이미지 로딩 완료 후 달라진 높이값에 대해서 scroll refresh + 느린 환경에 대한 방어코드
				setTimeout(function(){
					sideLayer_scroll.refresh();
				}, 1500);
				setTimeout(function(){
					sideLayer_scroll.refresh();
				}, 3000);
				setTimeout(function(){
					sideLayer_scroll.refresh();
				}, 5000);
			}

			if (common.garage.cartListCallback != undefined && common.garage.cartListCallback != null) {
				common.garage.cartListCallback();
				common.garage.cartListCallback = null;
			}
		}else{ //9999
			common.layerAlert(res.resultMessage); //비정상적인 오류가 발생하였습니다.
			return;
		}
		
		common.setLazyloadImg("car");
	},

	directPurchase : function(salesCoCd, carLine, salesSpecGrpCd, mc, salesTrim, grade, fsc, extColorCd, intColorCd, optPkgCd) {
		var param = {
				salesCoCd : salesCoCd,
				carLine : carLine,
				salesSpecGrpCd : salesSpecGrpCd,
				mc : mc,
				salesTrim : salesTrim,
				grade : grade,
				fsc : fsc,
				intColorCd: intColorCd,
				extColorCd: extColorCd,
				optPkgCd : optPkgCd,
				drtPurYn: "Y"
		}

		common.garage.saveMyGarageJson(param, common.garage.directPurchaseCallback);
	},

	directPurchaseCallback : function(res) {
		if(res && res.resultCode == 0000){ //SUCCESS
			var cartSeq = res.data.cartInfo.cartSeq;

			common.link.moveContractForm(cartSeq);
		}else{
			common.layerAlert(res.resultMessage);
		}
	},
	
	/**
	 * [cartseq, fsc, extColorCd, intColorCd]
	 */
	myCartSeqList : null,
	
	getMyCartSeqList : function(callback) {
		if (common.garage.myCartSeqList != null) {
			if (callback != undefined) {
				callback();
			}
		} else {
			var param = {
			}

			common.Ajax.sendRequest(
					"GET"
					, _baseUrl+"mypage/garage/getMyCartSeqListJson.do"
					, param
					, function(res) {
						if(res && res.resultCode == 0000){ 
							common.garage.myCartSeqList = res.data.cartSeqList;
							
							callback();
						}
					}
					, true
					, true);
		}
	}, 
};

/**
 * header > CXP Account Info
 */
$.namespace("common.account");
common.account = {
		certifTimer : null,
		certifiTime : 180,
		emailChk : "N",

		//CXP 고객조회
		getCheckValue : function() {
			var emailRet = {
				result : true,
				resultMsg : ""
			};
			common.checkVaild("#inputFormEmail", function() {
				if ($.trim($('#email').val()) == '') {
					emailRet.result = false;
					emailRet.resultMsg = _enterEmail;
				}
				return emailRet;
			});

			var lastNameRet = {
				result : true,
				resultMsg : ""
			};
			common.checkVaild("#inputFormLastName", function() {
				if (!$("#lastName").val()) {
					lastNameRet.result = false;
					lastNameRet.resultMsg = _notLastname;
				}
				return lastNameRet;
			});

			
			var mobileRet = {
				result : true,
				resultMsg : ""
			};
			common.checkVaild("#inputFormMobileNum02", function() {
				if (!$("#mobile").val()) {
					mobileRet.result = false;
					mobileRet.resultMsg = _notMobile;
				}
				var mobileNo ='';
				if($('#mobile').val().substring(0,3) == '+86') {
					mobileNo = $('#mobile').val().replace(/-/gi, "").substring(3, $('#mobile').val().length);
				} else {
					mobileNo = $('#mobile').val().replace(/-/gi, "");
				}
			    if(!common.isMobile(mobileNo)) {
					if (mobileNo.length < 11) {
						mobileRet.result = false;
						mobileRet.resultMsg = _notFormatMobile;
					} else {
						if(!common.isMobile(mobileNo)) {
							mobileRet.result = false;
							mobileRet.resultMsg = _notAbleMobile;
					    }
					}
			    }
				return mobileRet;
			});

			if (emailRet.result && lastNameRet.result && mobileRet.result) {
				return true;
			}
		},

		initCertifyInc : function() {
			if (_isLogin) {
				$("#emailZone").find("span").remove();
	    		$("#nameZone").find("span").remove();
	    		$("#mobileZone").find("span").remove();
	    		$("#email").attr("readonly",true).attr("disabled",true);
	    		$("#lastName").attr("readonly",true).attr("disabled",true);
	    		$("#firstName").attr("readonly",true).attr("disabled",true);
	    		$('#mobile').val($('#mobile').val().replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
	    		$("#mobile").attr("readonly",true).attr("disabled",true);

	    		if (_memberCode == "1") {
	    			//$("#firstName").hide();
	    			$("#nameZone").hide();
	    			$("#nameZoneSub").show();
	    			$('#viewNameSub').html($.trim($("#lastName").val()));
	    			
	    			$('#memberCode').val("1");
	    		} else {
	    			$('#memberCode').val("0");
	    		}
			}

			$("#email").on("change focusout", function() {
				
				if (common.account.emailChk == "Y") return;
				
				common.checkVaild("#inputFormEmail", function() {
					var ret = {
						result : true,
						resultMsg : ""
					};

					if($('#email').is('[readonly]')) {
						return ret;
					}

					if (common.isEmpty($('#email').val())) {
						return ret;
					}

					if(!common.isEmail($.trim($("#email").val()))) {
						ret.result = false;
						ret.resultMsg = _notFormatEmail;
				    } else {
				    	//통합회원 여부 체크
				    	var params = {
				    		email : $.trim($("#email").val()),
				   		};
				    	
				    	common.account.emailChk = "Y";
				    	common.account.getGaMemberChk(params, function(res) {
				    	    if (res.code == "0000") { //성공
				    	        if (res.gsOptIn) {
				    	        	console.log("통합회원");
				    	        	$("#email").attr("readonly",true).attr("disabled",true);		// 이메일 비활성화
				    	        	$('#memberVerification').show();
				    	            
				    	            $('#emailZone').find(".etcBox").hide();
				    	            $('#emailZone').find(".field-tip").hide();
				    	            
				    	            $('#gaPassword').focus();
				    	        } else {
				    	            console.log("비회원");
				    	            $('#emailZone').find(".etcBox").show();
				    	            $('#emailZone').find(".field-tip").show();
				    	            
				    	            $("#email").attr("readonly",true).attr("disabled",true);
				    	        	$('#memberVerification').hide();
				    	            
				    	            $('#btnSendOtpNumber').focus();
				    	        }
				    	        $("#email").val($.trim($("#email").val()));
				    	    } else {
				    			ret.result = false;
				    			ret.resultMsg = res.message;
				    			common.showVaildMsg("#inputFormEmail", ret);
				    			common.account.emailChk = "N";
				    			
				    			$("#email").attr("readonly",false).attr("disabled",false);
				    			$("#email").focus();
				    	    }
				    	});
				    }
			    	return ret;
				});
			});

			$("#lastName").on("change focusout", function() {
				var lastNameRet = {
					result : true,
					resultMsg : ""
				};
				common.checkVaild("#inputFormLastName", function() {
					if (!$("#lastName").val()) {
					}
					return lastNameRet;
				});
			});

			common.vaildNumberOnly("#mobile");
			$("#mobile").on("change focusout keyup ", function(event) {
				var _mobile = $('#mobile').val().replace(/-/gi, "");
				if (event.type == "keyup") {
					if (_mobile.length > 7) {
						$('#mobile').val(_mobile.replace(/(\d{3})(\d{4})/, '$1-$2-'));
					} else if (_mobile.length > 3) {
						$('#mobile').val(_mobile.replace(/(\d{3})/, '$1-'));
					}
				} else {
					common.checkVaild("#inputFormMobileNum02", function() {
						var ret = {
							result : true,
							resultMsg : ""
						};

						if($('#mobile').is('[readonly]')) {
							return ret;
						}

						if (common.isEmpty($('#mobile').val())) {
							return ret;
						}
						var mobileNo ='';
						if($('#mobile').val().substring(0,3) == '+86') {
							mobileNo = $('#mobile').val().replace(/-/gi, "").substring(3, $('#mobile').val().length);
						} else {
							mobileNo = $('#mobile').val().replace(/-/gi, "");
						}
					    if(!common.isMobile(mobileNo)) {
							if (mobileNo.length < 11) {
								ret.result = false;
								ret.resultMsg = _notFormatMobile;
							} else {
								if(!common.isMobile(mobileNo)) {
									ret.result = false;
									ret.resultMsg = _notAbleMobile;
							    }
							}
					    }
					    $('#mobile').val(mobileNo.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));

					    return ret;
					});
				}
			});

			$("#countryCode").on("change", function() {
				$("#mobile").focusout();
			});
			
			$(document).off("keyup","#lastName").on("keyup","#lastName", function(e){
				var dInput = $("#lastName").val();
			    $('#viewName').html(dInput+$.trim($("#firstName").val()));
		    });

			$("#inputFormMobileNum02 > span").click(function(){
				$("#inputFormMobileNum02").removeClass("error");
				$("#mobileZone > div > em").text("");
			});
			
			$('#inputFormLastName').find("span").click(function(){
				$('#lastName').val("");
				$('#lastName').keyup();
			});

			$(document).off("keyup","#firstName").on("keyup","#firstName", function(e){
				var dInput = $("#firstName").val();
			    $('#viewName').html($.trim($("#lastName").val())+dInput);
		    });

			$('#inputFormFirstName').find("span").click(function(){
				$('#firstName').val("");
				$('#firstName').keyup();
			});

			// 인증번호 발급요청
			$("#btnSendOtpNumber").click(function() {
				common.checkVaild("#inputFormEmail", function() {
					var ret = {
						result : true,
						resultMsg : ""
					};
					if (common.isEmpty($('#email').val())) {
						$("#email").attr("readonly", false);
						ret.result = false;
						ret.resultMsg = _enterEmail;

						return ret;
					} else {
						var param = {
							email : $('#email').val()
					    };
					    common.account.getCertifiNoAjax(param, function(res) {
					        if (res.code == "0000") { //인증번호 발급 성공
					        	$("#email").attr("readonly",true).attr("disabled",true);		// 이메일 비활성화
					        	$('#btnSendOtpNumber').text(_btnResend);// 인증번호 발송 문구 변경(->재발송)
					        	$('#nonMemberVerification').show();		// 인증번호 확인 영역 노출

					        	$('#verifyOtpNumber').attr('disabled', false);

					        	console.log("certifiNo : " + res.certifiNo);
					            $('#verNum').val(res.certifiNo); //사용자 인증번호 입력 id - 초기화
					        	if (sessionStorage.getItem("certifiSnd") == "Y") { //인증 발급 재전송구분
					                common.layerAlert(_verificationResend);
					                $("#nonMemberVerification").find(".message").remove();
					            } else {
					            	common.layerAlert(_verificationSend);
					                sessionStorage.setItem("certifiSnd", "Y");
					            }
					        } else {
					            common.layerAlert(res.message);
					        }
					    });
					}
					return ret;
				});
			});

			//인증번호 확인
			$("#verifyOtpNumber").click(function() {
				common.checkVaild("#inputFormVerifyOtpNumber", function() {
					var ret = {
						result : true,
						resultMsg : ""
					};
					if (!common.isOtp($('#verNum').val())) {
						ret.result = false;
						ret.resultMsg = _verificationNumLength;
						return ret;
					} else {
						var param = {
							verNum : $.trim($('#verNum').val()),
							email : $('#email').val()
					    };
						common.account.getCertifiChkAjax(param, function(res) {
							common.checkVaild("#inputFormVerifyOtpNumber", function() {
								var subret = {
									result : true,
									resultMsg : ""
								};
								$('#verNum').val("");
								if (res.code == "0000") {
							        $('.timeChk').text("");
							        clearInterval(common.account.certifTimer);
							        common.account.certifTimer = null;

							        $('#emailZone').find(".etcBox").hide();	// OTP 인증번호 발송 버튼 비노출
							        $('#emailZone').find(".field-tip").hide();
						    		$('#nonMemberVerification').hide();		// 인증번호 확인 영역 비노출
						    		$("#emailZone").find("span").remove();
						    		$("#email").attr("readonly",true).attr("disabled",true);

						    		$('#certYn').val("Y");
						    		//인증이 완료 되었습니다.
						    		common.layerAlert(_verificationCompleted);
							    } else if (res.code == "9012") {
							        sessionStorage.removeItem("certifiSnd"); //인증 발급 재전송구분
							        
							        // 인증번호가 일치하지 않습니다.
							        subret.result = false;
							        subret.resultMsg = _verificationFailure;
							    } else if (res.code == "9011") {
							        $('.timeChk').text("");
							        clearInterval(common.account.certifTimer);
							        common.account.certifTimer = null;
							        sessionStorage.removeItem("certifiSnd"); //인증 발급 재전송구분

							        //인증번호가 만료되었습니다. 인증번호를 다시 전송해 주십시오.
							        subret.result = false;
							        subret.resultMsg = _verificationExpired + "\n" + _verificationRetry;

							        $('#verifyOtpNumber').attr('disabled', true);
							    } else {
							        sessionStorage.removeItem("certifiSnd"); //인증 발급 재전송구분
							        
							        subret.result = false;
							        subret.resultMsg = res.message;
							    }
								return subret;
							});
						});
					}
					return ret;
				});
			});

			//통합회원 패스워드 입력
			$('#gaPassword').keydown(function(key) {
				if (key.keyCode == 13) {
					$("#verifyGaPassword").click();
				}
			});

			//통합회원 비밀번호 확인
			$("#verifyGaPassword").click(function() {
				common.checkVaild("#inputFormPassword", function() {
					var ret = {
						result : true,
						resultMsg : ""
					};
					if (!$("#gaPassword").val()) {
						ret.result = false;
						ret.resultMsg = _notPassword;
						return ret;
					}
					if (ret.result) {
						var param ={
							email : $("#email").val(),
							password : $("#gaPassword").val()
						};
						common.account.getGsMemberLoginAjax(param, function(res) {
							if (res.code == "0000") { //성공
					    		$('#memberVerification').hide();		// 인증번호 확인 영역 비노출

					    		$("#lastName").attr("readonly",true).attr("disabled",true);
					    		$("#firstName").attr("readonly",true).attr("disabled",true);

					        	$('input[name="lastName"]').val(res.lastName);
					        	$('input[name="firstName"]').val(res.firstName);

					        	if (res.mobile.indexOf("+82") > -1) {
					        		$("#countryCode").val("+82").attr("selected", "selected");
					        		$('input[name="mobile"]').val(res.mobile.replace("+82", "").replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
					        	} else if (res.mobile.indexOf("+86") > -1) {
					        		$("#countryCode").val("+86").attr("selected", "selected");
					        		$('input[name="mobile"]').val(res.mobile.replace("+86", "").replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
					        	} else {
					        		$("#countryCode").val("+86").attr("selected", "selected");
					        		$('input[name="mobile"]').val(res.mobile.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
					        	}

					        	$("#accountId").val(res.accountId);
					        	$("#accountNumber").val(res.accountNumber);
					        	$('#viewName').html(res.lastName+res.firstName);

								$('#header').find('.navRight').find('.login').text(_msg_logout);
								$("#memberCode").val("1");
								_isLogin = true;

								$("#emailZone").find("span").remove();
					    		$("#nameZone").find("span").remove();
					    		$("#mobileZone").find("span").remove();
					    		$("#email").attr("readonly",true).attr("disabled",true);
					    		$("#lastName").attr("readonly",true).attr("disabled",true);
					    		$("#firstName").attr("readonly",true).attr("disabled",true);
					    		$("#mobile").attr("readonly",true).attr("disabled",true);
					    		
					    		$("#nameZone").hide();
				    			$("#nameZoneSub").show();
				    			$('#viewNameSub').html($.trim($("#lastName").val()));
				    			
				    			if ($("#inputFormMobileNum02").hasClass("error")) {
				    				$("#inputFormMobileNum02").removeClass("error");
				    				$("#mobileZone > div > em").text("");
				    			}
							} else if (res.code == "9003") {

								$('#memberVerification').hide();

								$("#lastName").attr("readonly",true).attr("disabled",true);
					    		$("#firstName").attr("readonly",true).attr("disabled",true);

					    		//$('input[name="'+_accountNumberName+'"]').val(res.accountNumber);
					        	$('input[name="lastName"]').val(res.lastName);
					        	$('input[name="firstName"]').val(res.firstName);

					        	if (res.mobile.indexOf("+82") > -1) {
					        		$("#countryCode").val("+82").attr("selected", "selected");
					        		$('input[name="mobile"]').val(res.mobile.replace("+82", ""));
					        	} else if (res.mobile.indexOf("+86") > -1) {
					        		$("#countryCode").val("+86").attr("selected", "selected");
					        		$('input[name="mobile"]').val(res.mobile.replace("+86", ""));
					        	} else {
					        		$("#countryCode").val("+86").attr("selected", "selected");
					        		$('input[name="mobile"]').val(res.mobile);
					        	}

					        	$("#accountId").val(res.accountId);
					        	$("#accountNumber").val(res.accountNumber);
					        	$('#viewName').html(res.lastName+res.firstName);
					        	$("#email").attr("readonly",true).attr("disabled",true);
					    		$("#lastName").attr("readonly",true).attr("disabled",true);
					    		$("#firstName").attr("readonly",true).attr("disabled",true);
					    		$("#mobile").attr("readonly",true).attr("disabled",true);

					        	$("#memberCode").val("1");

								// 약관동의 요청
								// TODO
				            	console.log("통합회원이면서 GOS 회원이 아님");
								$("#memberCode").val("1");

								$("#emailZone").find("span").remove();
					    		$("#nameZone").find("span").remove();
					    		$("#mobileZone").find("span").remove();
					    		
					    		$("#nameZone").hide();
				    			$("#nameZoneSub").show();
				    			$('#viewNameSub').html($.trim($("#lastName").val()));
				    			
				    			if ($("#inputFormMobileNum02").hasClass("error")) {
				    				$("#inputFormMobileNum02").removeClass("error");
				    				$("#mobileZone > div > em").text("");
				    			}
							} else { //오류
								console.log("res.code : " + res.code);
								console.log("res.message : " + res.message);

								common.checkVaild("#inputFormPassword", function() {
									var passRet = {
										result : true,
										resultMsg : ""
									};
									passRet.result = false;
									passRet.resultMsg = res.message;
									ret = passRet;
									return passRet;
								});
							}
						});
					}
					return ret;
				});
			});

			//이메일 초기화
			$("#inputFormEmail").find("span").click(function(key) {
				$("#email").attr("readonly",false).attr("disabled",false);
				$('#memberVerification').hide();
				$('#emailZone').find(".etcBox").hide();
	            $('#emailZone').find(".field-tip").hide();
	            $('#firstName').show();
	            
	            common.account.emailChk = "N";
			});
		},

		//CXP 고객조회
		getAccountInfo : function(reqLastName, reqFirstName, reqMobile, reqEmail, callbackFunc) {
	        var data ={
	            lastName : reqLastName,
	            firstName : reqFirstName,
	            mobile : reqMobile,
	            email : reqEmail
	        };

			common.Ajax.sendRequest(
					"POST"
					, _baseUrl+"login/getCxpAccountAjax.do"
					, data
					, function(res) {
						common.account.accountCallback(res, callbackFunc);
					}
					, true);
		},
		accountCallback : function(res, callback) {
			var resCallback = new Object();
			resCallback.code = res.code;
			if (res.code == "0000") { //성공
				resCallback.accountId = res.data.accountId;
				resCallback.accountNumber = res.data.accountNumber;
				resCallback.billingCity = res.data.billingCity;
				resCallback.billingCountry = res.data.billingCountry;
				resCallback.billingPostalCode = res.data.billingPostalCode;
				resCallback.billingState = res.data.billingState;
				resCallback.billingStreet = res.data.billingStreet;
				resCallback.lastName = res.data.lastName;
				resCallback.firstName = res.data.firstName;
				resCallback.email = res.data.personEmail;
				resCallback.mobile = res.data.personMobilePhone;
	        } else {
	        	resCallback.message = res.message;
	        }
			callback(resCallback);
		},

		// 비회원인증
		getNonMemberLogin : function(param, callbackFunc) {
			common.Ajax.sendRequest(
					"POST"
					, _baseUrl+param.url
					, param
					, function(res) {
						common.account.nonMemberCallback(res, callbackFunc);
					}
					, true
					, true);
		},
		nonMemberCallback : function(res, callback) {
			var resCallback = new Object();
			resCallback.code = res.code;
			if (res.code == "0000") { //성공
				resCallback.loggedIn = res.member.loggedIn;
				resCallback.accountId = res.member.accountId;
				resCallback.accountNumber = res.member.accountNumber;
				resCallback.billingState = res.member.billingState;
				resCallback.billingCity = res.member.billingCity;
				resCallback.billingStreet = res.member.billingStreet;
				resCallback.billingPostalCode = res.member.billingPostalCode;
				resCallback.billingCountry = res.member.billingCountry;
				resCallback.name = res.member.name;
				resCallback.lastName = res.member.lastName;
				resCallback.firstName = res.member.firstName;
				resCallback.email = res.member.email;
				resCallback.mobile = res.member.mobile;
				resCallback.countryCode = res.member.countryCode;
				resCallback.memberCode = res.member.memberCode;
				resCallback.referenceDate = res.member.referenceDate;
			} else {
	        	resCallback.message = res.message;
	        }
			callback(resCallback);
		},

		// 인증번호 전송/재전송
		getCertifiNoAjax : function(param, callbackFunc) {
			common.Ajax.sendRequest(
					"POST"
					, _baseUrl+"login/getCertifiNoAjax.do"
					, param
					, function(res) {
						common.account.getCertifiNoCallback(res, callbackFunc);
					}
					, true);
		},
		getCertifiNoCallback : function(res, callback) {
			if (res.code == "0000") { //성공

				clearInterval(common.account.certifTimer);
				common.account.certifiTime = 180;
				common.account.doCertifiTimer();

				$("#inputFormEmail").find("span").remove();
			}
			callback(res);
		},
		// 인증키 타이머
		doCertifiTimer : function(){
			common.account.certifTimer = setInterval(function() {
				common.account.certifiTime--;

	        	if (common.account.certifiTime < 0) {
					clearInterval(common.account.certifTimer);

					if ($("#nonMemberVerification").find(".message").length == 0) {
						$("#nonMemberVerification").find(".field-flex").append("<em class='message'></em>");
						$("#nonMemberVerification").find(".field-flex").addClass("messageOn");
					}
					$("#nonMemberVerification").find(".message").css("fontSize", ".750rem");
					$("#nonMemberVerification").find(".message").html(_verificationTime + " " + _verificationRetry);
					$("#inputFormVerifyOtpNumber").removeClass("error");

					$('#verNum').val(""); //사용자 인증번호 입력 id - 초기화
					$('.timeChk').text("");

					$('#verifyOtpNumber').attr('disabled', true);
				} else {
					if ($('.timeChk').length == 0) {
						$("#inputFormVerifyOtpNumber").append("<em class='timeChk'></em>");
					}
					var _mm = Math.floor(common.account.certifiTime / 60);
					var _ss = String(common.account.certifiTime % 60);
					if (_ss.length == 1) {
						_ss = "0" + _ss;
					}
					m = _mm + ":" + _ss;
					$('.timeChk').text(m); //타이머 표기 class
				}
	        }, 1000);
		},

		// 인증번호 확인
		getCertifiChkAjax : function(param, callbackFunc) {
			common.Ajax.sendRequest(
					"POST"
					, _baseUrl+"login/getCertifiChkAjax.do"
					, param
					, function(res) {
						common.account.getCertifiChkCallback(res, callbackFunc);
					}
					, true);
		},
		getCertifiChkCallback : function(res, callback) {
			if (res.code == "0000") { //성공

			}
			callback(res);
		},

		// GOS 가입(등록)여부
		getNonMemberHaveAjax : function(param, callbackFunc) {
			common.Ajax.sendRequest(
					"POST"
					, _baseUrl+"login/getNonMemberHaveAjax.do"
					, param
					, function(res) {
						common.account.getNonMemberHaveCallback(res, callbackFunc);
					}
					, true
					, true);
		},
		getNonMemberHaveCallback : function(res, callback) {
			if (res.code == "0000") { //성공
			}
			callback(res);
		},

		// 통합회원여부
		getGaMemberChk : function(param, callbackFunc) {
			common.Ajax.sendRequest(
					"POST"
					, _baseUrl+"login/getGaMemberChk.do"
					, param
					, function(res) {
						common.account.gaMemberChkCallback(res, callbackFunc);
					}
					, true);
		},
		gaMemberChkCallback : function(res, callback) {
			callback(res);
		},

		// 통합회원인증
		getGsMemberLoginAjax : function(param, callbackFunc) {
			common.Ajax.sendRequest(
					"POST"
					, _baseUrl+"login/getGsMemberLoginPrcAjax.do"
					, param
					, function(res) {
						common.account.getGsMemberLoginPrcCallback(res, callbackFunc);
					}
					, true
					, false);
		},
		getGsMemberLoginPrcCallback : function(res, callback) {
			var resCallback = new Object();
			resCallback.code = res.code;

			if (res.code == "0000") { //성공
				resCallback.loggedIn = res.member.loggedIn;
				resCallback.accountId = res.member.accountId;
				resCallback.accountNumber = res.member.accountNumber;
				resCallback.billingState = res.member.billingState;
				resCallback.billingCity = res.member.billingCity;
				resCallback.billingStreet = res.member.billingStreet;
				resCallback.billingPostalCode = res.member.billingPostalCode;
				resCallback.billingCountry = res.member.billingCountry;
				resCallback.name = res.member.name;
				resCallback.lastName = res.member.lastName;
				resCallback.firstName = res.member.firstName;
				resCallback.email = res.member.email;
				resCallback.mobile = res.member.mobile;
				resCallback.countryCode = res.member.countryCode;
				resCallback.memberCode = res.member.memberCode;
				resCallback.referenceDate = res.member.referenceDate;
			} else if (res.code == "9003") {
				resCallback.loggedIn = res.member.loggedIn;
				resCallback.lastName = res.member.lastName;
				resCallback.firstName = res.member.firstName;
				resCallback.email = res.member.email;
				resCallback.mobile = res.member.mobile;
				resCallback.countryCode = res.member.countryCode;
				resCallback.userId = res.member.userId;
				resCallback.birthDate = res.member.birthDate;
				resCallback.accessToken = res.member.accessToken;
				resCallback.message = res.message;
			} else {
				resCallback.message = res.message;
			}
			callback(resCallback);
		},

		// 통합회원인증(GOS 비등록고객)
		getGsMemberLoginCrePrcAjax : function(param, callbackFunc) {
			common.Ajax.sendRequest(
					"POST"
					, _baseUrl+"login/getGsMemberLoginCrePrcAjax.do"
					, param
					, function(res) {
						common.account.getGsMemberLoginCrePrcCallback(res, callbackFunc);
					}
					, false);
		},
		getGsMemberLoginCrePrcCallback : function(res, callback) {
			var resCallback = new Object();
			resCallback.code = res.code;
			if (res.code == "0000") { //성공
				resCallback.loggedIn = res.member.loggedIn;
				resCallback.accountId = res.member.accountId;
				resCallback.accountNumber = res.member.accountNumber;
				resCallback.billingState = res.member.billingState;
				resCallback.billingCity = res.member.billingCity;
				resCallback.billingStreet = res.member.billingStreet;
				resCallback.billingPostalCode = res.member.billingPostalCode;
				resCallback.billingCountry = res.member.billingCountry;
				resCallback.name = res.member.name;
				resCallback.lastName = res.member.lastName;
				resCallback.firstName = res.member.firstName;
				resCallback.email = res.member.email;
				resCallback.mobile = res.member.mobile;
				resCallback.countryCode = res.member.countryCode;
				resCallback.memberCode = res.member.memberCode;
				resCallback.referenceDate = res.member.referenceDate;
			} else {
				resCallback.message = res.message;
			}
			callback(resCallback);
		},

		// 회원인증(통합,비회원)
		getMemberLoginCrePrcAjax : function(param, callbackFunc) {
			var noLoadingBar = param.noLoadingBar;
			if(noLoadingBar == undefined
				|| noLoadingBar == null
				|| noLoadingBar == ""){
				noLoadingBar = true;
			}


			if (param.memberCode == 1) { //통합
				common.Ajax.sendRequest(
						"POST"
						, _baseUrl+"login/getGsMemberLoginCrePrcAjax.do"
						, param
						, function(res) {
							common.account.getGsMemberLoginCrePrcCallback(res, callbackFunc);
						}
						, false
						, noLoadingBar);
			} else if (param.memberCode == 0) { //비회원
				common.Ajax.sendRequest(
						"POST"
						, _baseUrl+param.url
						, param
						, function(res) {
							common.account.nonMemberCallback(res, callbackFunc);
						}
						, false
						, noLoadingBar);
			}
		},

		// 온라인 회원 탈퇴
		onlineSignoutAjax : function(param, callbackFunc) {
			common.Ajax.sendRequest(
					"POST"
					, _baseUrl+"login/onlineSignoutAjax.do"
					, param
					, function(res) {
						common.account.onlineSignoutAjaxCallback(res, callbackFunc);
					}
					, true);
		},
		onlineSignoutAjaxCallback : function(res, callback) {
			if (res.code == "0000") { //성공

			}
			callback(res);
		},
};

$.namespace("common.product");
common.product = {

		bindOptPkgDetailPop : function() {
			$(document).off("click",".optPkgDetailPop").on("click",".optPkgDetailPop", function(){
				$("#layerPop-popularPackage").remove();

				var carLine = $(this).data("carline");
				var salesSpecGrpCd = $(this).data("salesspecgrpcd");
				var optCd = $(this).data("optcd");
				var pkgCd = $(this).data("pkgcd");
				var optTp = "P";
				if (pkgCd == undefined || pkgCd == null || pkgCd == "") {
					optTp = "O";
				}
				if (optCd == undefined || optCd == null || optCd == "") {
					if (optTp == "O") {
						console.log("error. optCd and pkgCd is empty.");
						return;
					}
				}

				var param = {
						carLine : carLine,
						salesSpecGrpCd : salesSpecGrpCd,
						optTp : optTp,
						optPkgCd : optTp == "O" ? optCd : pkgCd
				};
		        var url = _baseUrl + "product/optPkgDetailPop.do"

	            common.Ajax.sendRequest("GET", url, param, common.product.openOptPkgDetailPopCallback, true, true);
			});
		},

		openOptPkgDetailPopCallback : function(res) {
			$("body").append(res);
			layerPopOpen('layerPop-popularPackage');
			$(document).off("click","#layerPop-popularPackage .btn-close").on("click","#layerPop-popularPackage .btn-close", function(){
				$(this).closest('.layer-pop').removeClass('open');
				$('html').removeClass('layerPopOpen');
			});
		},

		bindTrimHierarchyPop : function() {
			$(document).off("click",".trimHierarchyPop").on("click",".trimHierarchyPop", function(){
				$("#layerPop-trimHierarchy").remove();

				var carLine = $(this).data("carline");
				var salesSpecGrpCd = $(this).data("salesspecgrpcd");
				var lvlCd = $(this).data("lvlcd");

				var param = {
						carLine : carLine,
						salesSpecGrpCd : salesSpecGrpCd,
						lvlCd : lvlCd
				};
		        var url = _baseUrl + "product/trimHierarchyDetailPop.do"

	            common.Ajax.sendRequest("GET", url, param, common.product.openTrimHierarchyPopCallback, true, true);
			});
		},

		openTrimHierarchyPopCallback : function(res) {
			$("body").append(res);
			layerPopOpen('layerPop-trimHierarchy');
			$(document).off("click","#layerPop-trimHierarchy .btn-close").on("click","#layerPop-trimHierarchy .btn-close", function(){
				$(this).closest('.layer-pop').removeClass('open');
				$('html').removeClass('layerPopOpen');
			});
		},

		bindColorDetailPop : function() {
			$(document).off("click",".colorDetailPop").on("click",".colorDetailPop", function(){
				$("#layerPop-colorDetail").remove();

				var carLine = $(this).data("carline");
				var colorCd = $(this).data("colorcd");
				var colorTpCd = $(this).data("colortpcd");
				var salesSpecGrpCd = $(this).data("salesspecgrpcd");

				var param = {
						carLine : carLine,
						salesSpecGrpCd : salesSpecGrpCd,
						colorCd : colorCd,
						colorTpCd : colorTpCd
				};
		        var url = _baseUrl + "product/colorDetailPop.do"

	            common.Ajax.sendRequest("GET", url, param, common.product.openColorDetailPopCallback, true, true);
			});
		},

		openColorDetailPopCallback : function(res) {
			$("body").append(res);
			layerPopOpen('layerPop-colorDetail');
			$(document).off("click","#layerPop-colorDetail .btn-close").on("click","#layerPop-colorDetail .btn-close", function(){
				$(this).closest('.layer-pop').removeClass('open');
				$('html').removeClass('layerPopOpen');
			});
		},

		bindBasicSuppliesPop : function() {
			$(".basicSuppliesPop").bind("click", function() {
				//한번만 불러옴. 있을 경우 팝업만 오픔.
				if ($("#layerPop-BasicSupplies").length > 0) {
					layerPopOpen('layerPop-BasicSupplies');
					return;
				}

				var carLine = $(this).data("carline");
				var salesSpecGrpCd = $(this).data("salesspecgrpcd");

				var param = {
						carLine : carLine,
						salesSpecGrpCd : salesSpecGrpCd
				};
		        var url = _baseUrl + "product/basicSuppliesPop.do"

	            common.Ajax.sendRequest("GET", url, param, common.product.openBasicSuppliesPopCallback, true, true);
			});
		},

		openBasicSuppliesPopCallback : function(res) {
			$("body").append(res);

			//swipe
			var slick_carOptionSelect_powerTrain = {
					init: function(){
						$('#slide-carOptionSelect-powerTrain .slide-cont').slick({
							infinite: false,
							slidesToShow: 1,
							slidesToScroll: 1,
							dots: true,
							accessibility:true
						});
						//모바일에서만 자동선택되게 하는거 start
						enquire.register("screen and (min-width: 768px)", {
							match : function() {
								carOptionSelect_AutoCheck_remove()
							},
							unmatch : function() {
								carOptionSelect_AutoCheck();
							},
							setup : function() {
								carOptionSelect_AutoCheck();
							},
						});
						function carOptionSelect_AutoCheck(){
							$('#slide-carOptionSelect-powerTrain .slide-cont').on('beforeChange', function(event, slick, currentSlide, nextSlide){
							  //console.log(nextSlide);
							  var carCheckItemArr = $('[name=carOptionSelect-powerTrain]');
							  $(carCheckItemArr[nextSlide]).prop('checked',true);

							});
						}
						function carOptionSelect_AutoCheck_remove(){
							$('#slide-carOptionSelect-powerTrain .slide-cont').off('beforeChange');
						}
					}
				}
				slick_carOptionSelect_powerTrain.init();

			layerPopOpen('layerPop-BasicSupplies');
			$("#layerPop-BasicSupplies .btn-close").bind("click", function() {
				$(this).closest('.layer-pop').removeClass('open');
				$('html').removeClass('layerPopOpen');
			});
		},

}

/**
 * Handlebars helper
 */
$.namespace("common.handlebars");
common.handlebars = {

		// handlebar helper 등록
		addHandlebarsHelper : function() {


			var CXP_CRC_SYML_MAP = {"KRW":"₩","RMB":"¥","EUR":"€","USD":"$"};

			//toCurreny Format
			Handlebars.registerHelper("numberFormat", function (value, options) {
			    // Helper parameters
			    var dl = options.hash["decimalLength"] || 2;
			    var ts = options.hash["thousandsSep"] || ',';
			    var ds = options.hash["decimalSep"] || '.';

			    // Parse to float
			    var value = parseFloat(value);

			    // The regex
			    var re = "\\d(?=(\\d{3})+" + (dl > 0 ? "\\D" : "$") + ")";

			    // Formats the number with the decimals
			    var num = value.toFixed(Math.max(0, ~~dl));

			    // Returns the formatted number
			    return (ds ? num.replace(".", ds) : num).replace(new RegExp(re, "g"), "$&" + ts);
			});

			//toCurreny Format
			Handlebars.registerHelper("currencySymbol", function (isoCode) {

			    // Returns the formatted number
			    return CXP_CRC_SYML_MAP[isoCode];
			});

			//toCurreny Format
			Handlebars.registerHelper("convertToDate", function (time, format) {
				if(time != undefined && time != null && time.length == 8){
					var timeStr = time.substring(0,4)+"-"+time.substring(4,6)+"-"+time.substring(6,8);
					time = timeStr;
				}
				
				var sysdate = new Date(time);
				return sysdate.format(format);
			});

			//toCurreny Add Day Format
			Handlebars.registerHelper("convertToDateAddDay", function (time, format, days) {
				var sysdate = new Date(time);
				sysdate.setDate(sysdate.getDate()+Number(days))
				return sysdate.format(format);
			});
			
			Handlebars.registerHelper('compare', function(lvalue, rvalue, options) {

			    if (arguments.length < 3)
			        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

			    var operator = options.hash.operator || "==";

			    var operators = {
			        '==':       function(l,r) { return l == r; },
			        '===':      function(l,r) { return l === r; },
			        '!=':       function(l,r) { return l != r; },
			        '<':        function(l,r) { return l < r; },
			        '>':        function(l,r) { return l > r; },
			        '<=':       function(l,r) { return l <= r; },
			        '>=':       function(l,r) { return l >= r; },
			        'typeof':   function(l,r) { return typeof l == r; }
			    }

			    if (!operators[operator])
			        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

			    var result = operators[operator](lvalue,rvalue);

			    if( result ) {
                    if (typeof options.fn === 'function')
                        return options.fn(this);
                    else
                          return true;
			    } else {
			    	if (typeof options.inverse === 'function')
			    		  return options.inverse(this);
		    		else
		    		  return null;
			    }

			});

			// 스펙 문자열 표시를 위해 문자부분에 태그 삽입 처리함.
			Handlebars.registerHelper('getSpecTagStr', function(specStr, tagName) {
				return new Handlebars.SafeString(common.getSpecTagStr(specStr, tagName));
			});

			Handlebars.registerHelper('breaklines', function(text) {
			    text = Handlebars.Utils.escapeExpression(text);
			    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
			    return new Handlebars.SafeString(text);
			});

			Handlebars.registerHelper('getTrimImgPath', function(carLine, salesSpecGrpCd, trim, extColor, seqNum) {
				return new Handlebars.SafeString(prodUtil.getTrimImgPath(carLine, salesSpecGrpCd, trim, extColor, seqNum));
			});

			Handlebars.registerHelper('getConfExtImgPath', function(carLine, salesSpecGrpCd, trim, extColor, seqNum) {
				return new Handlebars.SafeString(prodUtil.getConfExtImgPath(carLine, salesSpecGrpCd, trim, extColor, seqNum));
			});

			Handlebars.registerHelper('getConfExtOptImgPath', function(carLine, salesSpecGrpCd, optCd, extColor, seqNum) {
				return new Handlebars.SafeString(prodUtil.getConfExtOptImgPath(carLine, salesSpecGrpCd, optCd, extColor, seqNum));
			});

			Handlebars.registerHelper('getConfIntImgPath', function(carLine, salesSpecGrpCd, trim, intColor, seqNum) {
				return new Handlebars.SafeString(prodUtil.getConfIntImgPath(carLine, salesSpecGrpCd, trim, intColor, seqNum));
			});

			Handlebars.registerHelper('getConfIntOptImgPath', function(carLine, salesSpecGrpCd, optCd, intColor, seqNum) {
				return new Handlebars.SafeString(prodUtil.getConfIntOptImgPath(carLine, salesSpecGrpCd, optCd, intColor, seqNum));
			});

			Handlebars.registerHelper('getConfTrimLvlImgPath', function(carLine, salesSpecGrpCd, lvlCd, size) {
				return new Handlebars.SafeString(prodUtil.getConfTrimLvlImgPath(carLine, salesSpecGrpCd, lvlCd, size));
			});

			Handlebars.registerHelper('getConfExtColorImgPath', function(carLine, salesSpecGrpCd, colorCd, size) {
				return new Handlebars.SafeString(prodUtil.getConfExtColorImgPath(carLine, salesSpecGrpCd, colorCd, size));
			});

			Handlebars.registerHelper('getConfIntColorImgPath', function(carLine, salesSpecGrpCd, colorCd, size) {
				return new Handlebars.SafeString(prodUtil.getConfIntColorImgPath(carLine, salesSpecGrpCd, colorCd, size));
			});

			Handlebars.registerHelper('getConfPkgImgPath', function(carLine, salesSpecGrpCd, pkgCd) {
				return new Handlebars.SafeString(prodUtil.getConfPkgImgPath(carLine, salesSpecGrpCd, pkgCd));
			});

			Handlebars.registerHelper('getConfOptImgPath', function(arLine, salesSpecGrpCd, optCd) {
				return new Handlebars.SafeString(prodUtil.getConfOptImgPath(arLine, salesSpecGrpCd, optCd));
			});
	},
};


/*--------------------------------------------------------------------------------*\
* String Object Prototype
\*--------------------------------------------------------------------------------*/
String.prototype.isEmpty = function() {
    return (this == null || this == '' || this == 'undefined' || this == 'null');
};
// alert("isEmpty="+"".isEmpty());


/**
 *
 * 숫자여부 체크 함.
 * 사용 예)
 *
 * "100".isNumber()
 * "-100,000".isNumber(1)
 *
 * @param opt
 *            1 : (Default)모든 10진수
 *            2 : 부호 없음
 *            3 : 부호/자릿수구분(",") 없음
 *            4 : 부호/자릿수구분(",")/소숫점
 *
 * @return true(정상) or false(오류-숫자아님)
 *
 */
String.prototype.isNumber = function(opt) {
    // 좌우 trim(공백제거)을 해준다.
    value = String(this).replace(/^\s+|\s+$/g, "");

    if (typeof opt == "undefined" || opt == "1") {
        // 모든 10진수 (부호 선택, 자릿수구분기호 선택, 소수점 선택)
        var regex = /^[+\-]?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
    } else if (opt == "2") {
        var regex = /^(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
    } else if (opt == "3") {
        // 부호 미사용, 자릿수구분기호 미사용, 소수점 선택
        var regex = /^[0-9]+(\.[0-9]+)?$/g;
    } else {
        // only 숫자만(부호 미사용, 자릿수구분기호 미사용, 소수점 미사용)
        var regex = /^[0-9]$/g;
    }

    if (regex.test(value)) {
        value = value.replace(/,/g, "");
        return isNaN(value) ? false : true;
    } else {
        return false;
    }
};
//alert("isNumber="+("1-00".isNumber()));


String.prototype.nvl = function(s) {
    return this.isEmpty() ? (s ? s : '') : this+'';
};
String.prototype.startWith = function(str) {
    if (this === str)    return true;

    if (str.length > 0)
        return str === this.substr(0, str.length);
    else
        return false;
};
String.prototype.endWith = function(str) {
    if (this == str)    return true;

    if (String(str).length > 0)
        return str === this.substr(this.length - str.length, str.length);
    else
        return false;
};
String.prototype.bytes = function()
{    // 바이트 계산.
    var b = 0;
    for (var i=0; i<this.length; i++) b += (this.charCodeAt(i) > 128) ? 2 : 1;
    return b;
};
String.prototype.nl2br = function() {
    return this.replace(/\n/g, "<br />");
};
String.prototype.toMoney = function() {
    var s = (this.nvl('0')).trim();
    if (isFinite(s)) {
        while((/(-?[0-9]+)([0-9]{3})/).test(s)) {
            s = s.replace((/(-?[0-9]+)([0-9]{3})/), "$1,$2");
        }
        return s;
    }
    else {
        return this;
    }
};
String.prototype.toNegative = function() {
    return this == '0' ? this : "- " + this;
};


/**
 * val 문자열을 len 길이만큼 왼쪽에 char 문자를 붙여서 반환 한다.
 *
 * 사용 예) "A".lpad(5, "0") => "0000A"
 *
 * @param val
 *            문자열
 * @param len
 *            생성할 문자열 길이
 * @param char
 *            해당 길이만큼 왼쪽에 추가할 문자
 */
String.prototype.lpad = function(len, char) {
    var val = String(this);
    if (typeof(char)!="string" && typeof(len)!="number") {
        return val;
    }
    char = String(char);
    while(val.length + char.length<=len) {
        val = char + val;
    }

    return val;
};
// alert("A".lpad(5, "0"));

/**
 * val 문자열을 len 길이만큼 오른쪽에 char 문자를 붙여서 반환 한다.
 *
 * 사용 예) "A".rpad(5, "0") => "A0000"
 *
 * @param val
 *            문자열
 * @param len
 *            생성할 문자열 길이
 * @param char
 *            해당 길이만큼 오른쪽에 추가할 문자
 */
String.prototype.rpad = function(len, char) {
    var val = String(this);
    if (typeof(char)!="string" && typeof(len)!="number") {
        return val;
    }
    char = String(char);
    while(val.length + char.length<=len) {
        val = val + char;
    }

    return val;
};
//alert("A".rpad(5, "0"))

String.prototype.numberFormat = function(symbol, maxFractionDigits) {
    // return this
    // return $.number(this);
    var num = this.toString();
    if(maxFractionDigits != undefined && maxFractionDigits != null){
        num = Number(num).toFixed(maxFractionDigits).toString();
    }

    num = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if(symbol != undefined && symbol != null && symbol != ""){
        num = symbol+" "+num;
    }

    return num;
};


String.prototype.getBytesLength = function() {
    var s = this;
    for(b = i = 0;c = s.charCodeAt(i++);b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
    return b;
};

String.prototype.getTransSpace = function() {
    return this.split(" ").join("&nbsp;");
};

String.prototype.format = function() {
	var a = this;
	for(i in arguments){
		a = a.replace(new RegExp("\\{"+ (i) +"\\}", 'gm'), arguments[i]);
	}
	return a;
};

String.prototype.toNumber = function(maxFractionDigits, fn_math) {
    var num = this;
	if(num.indexOf(".") < 0) {
		num = num.replace(/[^0-9]/g,"");
	} else {
		var arr = num.split(".");
		num = arr[0].replace(/[^0-9]/g,"");
		var arr2 = "";
		if(arr.length > 1) {
			arr2 = arr[1].replace(/[^0-9]/g,"");
		}
		num += "."+arr2;
	}
	if(!!maxFractionDigits) {
		if(typeof(fn_math) === 'function'){
			var pow = Math.pow(10, maxFractionDigits);
			num = fn_math(Number(num)*pow)/pow;
		}
		num = Number(num).toFixed(maxFractionDigits);
	}
	return Number(num);
}

/*--------------------------------------------------------------------------------*\
* Number Object Prototype
\*--------------------------------------------------------------------------------*/
Number.prototype.toMoney = function() {
    return String(this).toMoney();
};


Number.prototype.numberFormat = function(symbol, maxFractionDigits) {
// return this
// return $.number(this);

	var num = this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	if(maxFractionDigits != undefined && maxFractionDigits != null){
		num = Number(num).toFixed(maxFractionDigits).toString();
	}
	if(symbol != undefined && symbol != null && symbol != ""){
		num = symbol+" "+num;
	}

    return num
};


/**
 * val 문자열을 len 길이만큼 왼쪽에 char 문자를 붙여서 반환 한다.
 *
 * 사용 예) (123).lpad(5,"0") => "00123"
 *
 * @param val
 *            문자열
 * @param len
 *            생성할 문자열 길이
 * @param char
 *            해당 길이만큼 왼쪽에 추가할 문자
 */
Number.prototype.lpad = function(len, char) {
    return String(this).lpad(len,char);
};
//alert((123).lpad(5,"0"));

/**
 * val 문자열을 len 길이만큼 오른쪽에 char 문자를 붙여서 반환 한다.
 *
 * 사용 예) (123).rpad(5,"0") => "12300"
 *
 * @param val
 *            문자열
 * @param len
 *            생성할 문자열 길이
 * @param char
 *            해당 길이만큼 오른쪽에 추가할 문자
 */
Number.prototype.rpad = function(len, char) {
    return String(this).rpad(len,char);
}
//alert((123).rpad(5,"0"));

/*--------------------------------------------------------------------------------*\
* Date Object Prototype
\*--------------------------------------------------------------------------------*/
/**
 *
 * 포멧에 맞는 날짜 문자열을 꺼낸다.
 *
 * 사용 예)
 * > new Date().format("yyyy-MM-dd hh:mm:ss E a/p")
 * > => 2016-11-24 11:00:31 목요일 오전
 *
 *
 *
 */
Date.prototype.format = function(format) {
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;

    if (!d.valueOf()) return " ";
    if(format == undefined) return " ";
    format = String(format);

    return format.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy":   return (d.getFullYear() % 1000).lpad(2, "0");
            case "MM":   return (d.getMonth() + 1).lpad(2, "0");
            case "dd":   return d.getDate().lpad(2, "0");
            case "E":    return weekName[d.getDay()];
            case "HH":   return d.getHours().lpad(2, "0");
            case "hh":   return ((h = d.getHours() % 12) ? h : 12).lpad(2, "0");
            case "mm":   return d.getMinutes().lpad(2, "0");
            case "ss":   return d.getSeconds().lpad(2, "0");
            case "a/p":  return d.getHours() < 12 ? "오전" : "오후";
            default:     return $1;
        }
    });
};
//alert(new Date().format("yyyy-MM-dd hh:mm:ss E a/p"));


/**
 * 일수를 계산한 날짜를 반환 한다.
 *
 * 사용 예)
 * new Date().addDate(1);  : 내일날짜 반환
 * new Date().addDate(0);  : 오늘날짜 반환
 * new Date().addDate(-1); : 어제날짜 반환
 *
 * @param dateCount
 *            더할 일수
 *
 * @return 계산되어 생성된 Date Object
 *
 */
Date.prototype.addDate = function(dateCount) {
    return new Date(this.valueOf() + (dateCount * (24*60*60*1000)) );
};
//alert(new Date().addDate(1).addDate(1));




/*--------------------------------------------------------------------------------*\
* Cookie object
\*--------------------------------------------------------------------------------*/
var Cookie = function(expiresDay) {
    var expdate = (typeof expiresDay == 'number') ? expiresDay : 1;
    return {
        get : function(cName) {
            cName = cName + '=';
            var cookieData = document.cookie;
            var start = cookieData.indexOf(cName);
            var cValue = '';
            if(start != -1){
                 start += cName.length;
                 var end = cookieData.indexOf(';', start);
                 if(end == -1)end = cookieData.length;
                 cValue = cookieData.substring(start, end);
            }
            return unescape(cValue);
        },
        set : function(cName, cValue, expireDays) {
            this.setOwner(cName, cValue, ((typeof expireDays == 'number' ? expireDays : expdate) * 24 * 60 * 60 * 1000))
            return this;
        },
        setOwner : function(cName, cValue, expire) {
            var expdate = new Date();
            expdate.setTime(expdate.getTime() + (typeof expire == 'number' ? expire : (expdate * 24 * 60 * 60 * 1000)));
            document.cookie = cName+"=" + cValue + "; path=/; domain="+document.domain+"; expires=" + expdate.toGMTString();
        },
        remove : function(name) {
            return this.set(name, '', -1);
        },
        getItem : function(name) {
            return this.get(name);
        },
        setItem : function(name, value) {
            this.set(name, value);
        },
        removeItem : function(name) {
            this.remove(name);
        },
        clear : function() {
            return;
        }
    };
};





/*--------------------------------------------------------------------------------*\
* Cache object
\*--------------------------------------------------------------------------------*/
var Cache = function(type, span/* integer */, format/* s, m, h, d, M, y, w */) {
    var _cacheType  = (typeof type != 'string' || type == '') ? 'cache' : type; // cache
                                                                                // ||
                                                                                // local
                                                                                // ||
                                                                                // session
    var _span       = (typeof span == 'number') ? span : 0;
    var _format     = (typeof format == 'string') ? format : '';
    var _storage    = null;
    var _expires    = getCacheExpires(_span, _format);
    var _default    = {
            set : function() { return;},
            get : function() { return '';},
            isStatus : function() { return false;},
            remove : function() { return; },
            clear : function() { return; }
        };


    if (_cacheType == 'session') {
        if (!window.sessionStorage) return _default;
        _storage= window.sessionStorage;
        _expires= (_span != 0) ? _expires : getCacheExpires(12, 'h'); // 12
                                                                        // hours
    }
    else if (_cacheType == 'cache') {
        if (!window.localStorage) return _default;
        _storage= window.sessionStorage;
        _expires= (_span != 0) ? _expires : getCacheExpires(5, 'm'); // 5
                                                                        // minutes
    }
    else if (_cacheType == 'local') {
        if (!window.localStorage) return _default;
        _storage = window.localStorage;
        _expires= (_span != 0) ? _expires : getCacheExpires(7, 'd'); // 7
                                                                        // days
    }
    else if (_cacheType == 'cookie') {
        _storage = com.lotte.smp.Cookie(1);
        _expires= (_span != 0) ? _expires : getCacheExpires(1, 'd'); // 1
                                                                        // days
    }
    else {
        return _default;
    }

    function getCacheExpires(s, f) {
        var exp = 0;
        switch(f) {
            case 's' : exp = 1;         break;
            case 'm' : exp = 60;        break;
            case 'h' : exp = 3600;      break;  // 60 * 60
            case 'd' : exp = 86400;     break;  // 60 * 60 * 24
            case 'w' : exp = 604800;    break;  // 60 * 60 * 24 * 7
            case 'M' : exp = 2592000;   break;  // 60 * 60 * 24 * 30
            case 'y' : exp = 31536000;  break;  // 60 * 60 * 24 * 365
        }
        return s * exp;
    }

    return {
        type    : _cacheType,
        storage : _storage,
        expires : _expires,
        set : function(name, value, expires) {
            if (typeof name != 'string' || name == '') return;
            if (value == 'undefined') return;
            if (expires=='undefined' || typeof expires != 'number') { expires = this.expires; }

            var date = new Date();
            var schedule= Math.round((date.setSeconds(date.getSeconds()+expires))/1000);

            this.storage.setItem(this.type +'@'+ name, value);
            this.storage.setItem(this.type +'@time_' + name, schedule);

            return this;
        },
        get : function(name) {
            if (this.isStatus(name)) {
                return this.storage.getItem(this.type +'@'+ name);
            }
            else {
                return '';
            }
        },
        isStatus : function(name) {
            if (this.storage.getItem(this.type +'@'+ name) == null || this.storage.getItem(this.type +'@'+ name) == '')
                return false;

            var date = new Date();
            var current = Math.round(+date/1000);

            // Get Schedule
            var stored_time = this.storage.getItem(this.type +'@time_' + name);
            if (stored_time=='undefined' || stored_time=='null') { stored_time = 0; }

            // Expired
            if (stored_time < current) {
                this.remove(name);
                return false;
            } else {
                return true;
            }
        },
        remove : function(name) {
            this.storage.removeItem(this.type +'@'+ name);
            this.storage.removeItem(this.type +'@time_' + name);
        },
        clear : function() {
            for (var item in this.storage) {
                if (String(item).startWith(this.type)) {
                    this.storage.removeItem(item);
                }
            }
            // this.storage.clear();
        }
    };
};

jQuery.fn.serializeObject = function() {
    var obj = null;
    try{
        if ( this[0].tagName && this[0].tagName.toUpperCase() == "FORM" ) {
            var arr = this.serializeArray();
            if ( arr ) {
              obj = {};
              jQuery.each(arr, function() {
                obj[this.name] = this.value;
              });
            }
        }
    }
    catch(e) {}
    finally  {}

    return obj;
};

function SeqLazyload() {
	this.dataAttribute = "original";
	this.selector = "";
	this.replaceClassNm = "";
	this.placeholder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII=";
	
	this.load = function(pin) {
		this.selector = pin.selector;
		this.replaceClassNm = pin.classNm;
		this.placeholder = common.isEmpty(pin.placeholder) ? this.placeholder : pin.placeholder;
		
		var imgList = $(this.selector);
		var imgCnt = imgList.length;
		
		this.loadRecursive(0, imgCnt, imgList);
	};
	
	this.loadRecursive = function(curImgIdx, imgCnt, list) {
		if (curImgIdx == undefined || curImgIdx == null) {
			curImgIdx = 0;
		}
		
		var targetImgCnt = imgCnt;
		
		if (targetImgCnt > curImgIdx) {
			var dstImg = list.eq(curImgIdx);
			var imgSrc = dstImg.attr("data-" + this.dataAttribute);
			
			if (dstImg.is("img")) {
				dstImg.attr("onerror", "this.src='" + this.placeholder + "';this.onerror='';");
				
				dstImg.attr("src", imgSrc);
			} else {
				dstImg.css("background-image", "url('" + imgStr + "')");
			}
			
			dstImg.removeClass(this.replaceClassNm).addClass("completed-" + this.replaceClassNm);
			var that = this;
			setTimeout(function() {
				that.loadRecursive(++curImgIdx, targetImgCnt, list);
			}, 50);
		}
	};
}