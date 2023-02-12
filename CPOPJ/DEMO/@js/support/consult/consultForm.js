$.namespace("support.consultForm");

support.consultForm = {
	init : function(){
		sessionStorage.removeItem("certifiSnd");
		support.consultForm.bindEvent();
		
		$("#contents > div > div > div > div > div > a.btn.type01.bgBlack").css("border","solid 1px #bbb");
		$("#contents > div > div > div > div > div > a.btn.type01.bgBlack").css("background-color","#bbb");
		$("#contents > div > div > div > div > div > a.btn.type01.bgBlack").css('cursor','default');
	},
	
	bindEvent : function(){
		that = this;

		//전체동의 체크박스 클릭 
		$("#allCheck").click(function(){  
			if($("#allCheck").prop("checked")) {  
				$("input[name='consent']").prop("checked",true); 
			} else {  
				$("input[name='consent']").prop("checked",false); 
			} 
		});
		
		// 동의 클릭/해제시 전체동의 값 변경 처리
		$(":checkbox[name='consent']").click(function(){ 
			if ( $(this).prop('checked') ) { 
				if($("input:checkbox[name='consent']:checked").length == $("input:checkbox[name='consent']").length) {	
					$('input:checkbox[id="allCheck"]').prop("checked",true);
				}
			} else { 
				if($("input:checkbox[name='consent']:checked").length < $("input:checkbox[name='consent']").length) {
					$('input:checkbox[id="allCheck"]').prop("checked",false);
				}
			}
		});
		
		$("#subject").on("change focusout", function() {
			var subjectRet = {
					result : true,
					resultMsg : ""
			};
			common.checkVaild("#inputFormSubject", function() {
				if ($.trim($('#subject').val()) == '') {
					subjectRet.result = false;
					subjectRet.resultMsg = _enterSubject;
				}
				return subjectRet;
			});
		});
		
		$("#description").on("change focusout", function() {
			var descriptionRet = {
				result : true,
				resultMsg : ""
			};
			common.checkVaild("#inputDescriptionRet", function() {
				$('#description').css("border","solid 1px #bbb");
				if ($.trim($('#description').val()) == '') {
					descriptionRet.result = false;
					descriptionRet.resultMsg = _enterContent;
					$('#description').css("border","solid 1px #ff6662")
				}
				return descriptionRet;
			});
		});
		
		$(".chk").click(function(){ 
			if($("input:checkbox[name='consent']:checked").length == $("input:checkbox[name='consent']").length) {
				$("#contents > div > div > div > div > div > a.btn.type01.bgBlack").css("border","solid 1px #141414");
				$("#contents > div > div > div > div > div > a.btn.type01.bgBlack").css("background-color","#141414");
				$("#contents > div > div > div > div > div > a.btn.type01.bgBlack").css('cursor','pointer');
			} else {
				$("#contents > div > div > div > div > div > a.btn.type01.bgBlack").css("border","solid 1px #bbb");
				$("#contents > div > div > div > div > div > a.btn.type01.bgBlack").css("background-color","#bbb");
				$("#contents > div > div > div > div > div > a.btn.type01.bgBlack").css('cursor','default');
			}
		});
	},
	
	// 1:1 문의 등록
	insertConsult : function(){
		// Input value Validation check
		if(common.account.getCheckValue() && support.consultForm.checkInputVlaue()) {
		    common.layerConfirm(_confirmConsult, function(){
				//CXP 고객정보 처리
		    	common.showLoadingBar();
				procAccountInfo(support.consultForm.insertConsultWork);
			});
		}
	},
	
	insertConsultWork : function() {
		$('input[name="name"]').val($("#lastName").val()+$("#firstName").val());
		$('input[name="phone"]').val($("#mobile").val());
		$('input[name="'+_accountNumberName+'"]').val($("#accountNumber").val());
		
		console.log('000:'+_accountNumberName);
		console.log('111:'+$('input[name="'+_accountNumberName+'"]').val());
		if($.trim($('input[name="'+_accountNumberName+'"]').val()) == '') {
			alert(_customerInfoError); //비정상적인 오류가 발생하였습니다.
			return;
		}
		
		var param = {
			consultType : "01"
		}
		common.Ajax.sendRequest(
			"GET"
			, _baseUrl+"api/dih/DIH_CODE_IF_CN_GOS_CXP_WEB_CASE_0001.do"
			, param
			, support.consultForm.insertConsultJsonCallback
			, true
			, true);
	},

	insertConsultJsonCallback : function(res){
		// 정상처리
		common.hideLoadingBar();
		if(res && res.resultCode == common._jsonSuccessCd){ //0000
			var $retURL = $("[name='retURL']");
			$retURL.val($retURL.val()+'?linkNo='+res.data.linkNo+'&prgsTime='+res.data.prgsTime+'&consultType=email&targetUrl=/support/consult/getConsultForm.do');
			$('#consultForm').submit();
		}else{ //9999
			common.layerAlert(res.resultMessage); //비정상적인 오류가 발생하였습니다.
			return;
		}
	},

	// 입력값 유효성 체크
	checkInputVlaue : function(){
		if($("input:checkbox[name='consent']:checked").length != $("input:checkbox[name='consent']").length) {
			common.layerAlert(_enterConsent);
			return false;
		}
		
		var subjectRet = {
			result : true,
			resultMsg : ""
		};
		common.checkVaild("#inputFormSubject", function() {
			if ($.trim($('#subject').val()) == '') {
				subjectRet.result = false;
				subjectRet.resultMsg = _enterSubject;
			}
			return subjectRet;
		});
		
		var descriptionRet = {
			result : true,
			resultMsg : ""
		};
		common.checkVaild("#inputDescriptionRet", function() {
			$('#description').css("border","solid 1px #bbb");
			if ($.trim($('#description').val()) == '') {
				descriptionRet.result = false;
				descriptionRet.resultMsg = _enterContent;
				$('#description').css("border","solid 1px #ff6662")
			}
			return descriptionRet;
		});
		
		
		if (subjectRet.result && descriptionRet.result) {
			return true;
		}
	},
	
	// 입력값 초기화
	resetConsult : function(){
	    common.layerConfirm(_cancelConsult, function(){
	    	history.go(-1);
		});
		
//		document.getElementById("consultForm").reset();
//		$('#lastName').keyup();
//		
//		$('#memberVerification').hide();
//		$('#nonMemberVerification').hide();
//		
//		if(!_isLogin) {
//			$("#email").attr("readonly",false);
//			$("#lastName").attr("readonly",false);
//			$("#firstName").attr("readonly",false);
//		}
//		
//		//OTP Timer Clear
//		$('.timeChk').text(_otpValidTime);
//        clearInterval(common.account.certifTimer);
//        common.account.certifTimer = null;
//        sessionStorage.setItem("certifiChk", "chk");
//        sessionStorage.removeItem("certifiSnd"); //인증 발급 재전송구분
//        
//        //OTP 전송버튼 초기화
//        $('#sendOtpNumber').hide();
//        $('#btnSendOtpNumber').text(_btnSendOtpNo);

	},
};