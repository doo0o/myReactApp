$.namespace("contract");
contract = {}
$.namespace("contract.form");
contract.form = {}

$.namespace("contract.form.layer");
contract.form.layer = {
	departmentJson : null,
	isSaveContract : true,
	
	init : function(){
		// 계약하기 버튼 disabled
		contract.form.layer.chkOrderBtn(false);
		//트림계층컨텐츠 팝업 이벤트처리
		common.product.bindTrimHierarchyPop();
		//컬러컨텐츠 팝업 이벤트처리
		common.product.bindColorDetailPop();
		// 옵션/패키지 상세 팝업 이벤트 처리
		common.product.bindOptPkgDetailPop();
		
		contract.form.layer.bindEvent();
	},
	
	bindEvent : function(){
		that = this;

		// 계약하기 버튼 이벤트
		$(document).off("click","#orderBtn").on("click","#orderBtn", function(){
			if(contract.form.layer.checkInputVlaue()){
				
				common.showLoadingBar(false, (1000*60*5));
				
				var departmentObj = contract.form.layer.departmentJson[$("#department option:selected").val()];
				if(procAccountInfo(contract.form.layer.saveQuoteJson, 1, departmentObj)){
				} else {
					common.hideLoadingBar(null);
					common.layerAlert(_CONTRACT_MSG_COMMON_ERROR);
				}
			}
		});
		
		// 개별 약관 체크 이벤트
		$(document).off("click","input:checkbox[name=termAgrChk]").on("click","input:checkbox[name=termAgrChk]", function(){
			var allCnt = $("input:checkbox[name=termAgrChk]").length;
			var chkCnt = $("input:checkbox[name=termAgrChk]:checked").length;
			
			if($(this).is(":checked")){
				if(allCnt == chkCnt){
					$("input:checkbox[name=termAgrChkAll]").prop("checked",true);
				} else {
					$("input:checkbox[name=termAgrChkAll]").prop("checked",false);
				}
			} else {
				if(allCnt != chkCnt){
					$("input:checkbox[name=termAgrChkAll]").prop("checked",false);
				} else {
					$("input:checkbox[name=termAgrChkAll]").prop("checked",true);
				}
			}
			
			contract.form.layer.chkOrderBtn(false);
		});
		
		// 모든 약관 체크 이벤트
		$(document).off("click","input:checkbox[name=termAgrChkAll]").on("click","input:checkbox[name=termAgrChkAll]", function(){
			var chk = $(this).is(":checked");
			if(chk){
				$("input:checkbox[name=termAgrChk]").prop("checked",true);
			} else {
				$("input:checkbox[name=termAgrChk]").prop("checked",false);
			}
			
			contract.form.layer.chkOrderBtn(false);
		});
		
		// 지점 선택
		$(document).off("change","#department").on("change","#department", function(){
			contract.form.layer.getLocationJson();
			contract.form.layer.chkOrderBtn(false);
		});
		
		$(document).off("focusout","#lastName").on("focusout","#lastName", function(){
			contract.form.layer.chkOrderBtn(false);
		});
		
		$(document).off("focusout","#mobile").on("focusout","#mobile", function(){
			contract.form.layer.chkOrderBtn(false);
		});
	},
	
	// 버튼 활성화 이벤트
	chkOrderBtn : function(isAlert){
		if(contract.form.layer.checkInputVlaue(isAlert)){
			$("#orderBtn").attr("disabled", false);
		} else {
			$("#orderBtn").attr("disabled", true);
		}
	},
	
	// 필수 파라미터 체크
	checkInputVlaue : function(isAlert){
		if(isAlert == undefined || isAlert == null){
			isAlert = true;
		}
		
		// 이메일 체크
		if($.trim($('#email').val()) == '') {
			if(isAlert){
				common.checkVaild("#inputFormEmail", function() {
					var emailRet = {
						result : false,
						resultMsg : _enterEmail
					};
					return emailRet;
				});
				$('#email').focus();
//				common.layerAlert(_enterEmail);
			}
			return false;
		}
		// 이름 체크
		if($.trim($('#lastName').val()) == '') {
			if(isAlert){
				common.checkVaild("#inputFormLastName", function() {
					var lastNameRet = {
						result : false,
						resultMsg : _notLastname
					};
					return lastNameRet;
				});
				$('#lastName').focus();
//				common.layerAlert(_enterLastName);
			}
			return false;
		}
		// 휴대폰 번호 체크
		if($.trim($('#mobile').val()) == '') {
			if(isAlert){
				common.checkVaild("#inputFormMobileNum02", function() {
					var mobileRet = {
						result : false,
						resultMsg : _notMobile
					};
					return mobileRet;
				});
				$('#mobile').focus();
//				common.layerAlert(_enterMobile);
			}
			return false;
		}
		// 결제 수단 선택 체크
		if(!$(".boxPayType").find(".isPay").hasClass("active")){
			if(isAlert){
				common.layerAlert(_CONTRACT_MSG_EMPTY_PAY_TYPE);
			}
			return false;
		}
		// 약관 동의 체크
		var termsAgrChk = true;
		$("input:checkbox[name=termAgrChk]").each(function(){
			var type = $(this).attr("data");
			if(type == "M"){
				var isTermAgr = $(this).is(":checked");
				if(!isTermAgr){
					termsAgrChk = false;
					return false;
				}
			}
		});
		if(!termsAgrChk){
			if(isAlert){
				common.layerAlert(_CONTRACT_MSG_EMPTY_TERM_AGREE);
			}
			return false;
		}
		// 지점 정보 체크
		var departmentId = $("#department option:selected").val();
		if(departmentId == undefined
			|| departmentId == null
			|| departmentId == ""
			|| departmentId == "select"){
			if(isAlert){
				common.layerAlert(_CONTRACT_MSG_EMPTY_DEPARTMENT);
			}
			return false;
		}
		// 선급금 체크
		var depositPrc = Number($("#depositPrc").val());
		if(depositPrc <= 0){
			if(isAlert){
				common.layerAlert(_CONTRACT_MSG_EMPTY_PAY_PRC);
			}
			return false;
		}
		// 회원 로그인 또는 인증 체크
		var certYn = $.trim($('#certYn').val());
		var accountId = $.trim($('#accountId').val());
		if(!(certYn == 'Y' || (accountId != undefined && accountId != null && accountId != ""))) {
			if(isAlert){
				common.layerAlert(_CONTRACT_MSG_EMPTY_AUTH);
			}
			return false;
		}
		
		return true;
	},
	
	// 결제 종류 변경 function
    changePayType : function(){
    	contract.form.layer.chkOrderBtn(false);
    },
    
    // 레이어 화면 닫기 function
    closeFullLayer : function(){
    	common.layerConfirm(_CONTRACT_MSG_INIT_CART, common.link.configModel);
    },
	
	/**
	 * 계약하기 화면 체크(카트 조회)
	 */
	getContractFormChkJson : function(){
		
		var url = _baseUrl+"contract/getContractFormChkJson.do";
		var param ={
			cartSeq : $("#cartSeq").val(),
			sessionKey : $("#sessionKey").val()
		};
		
		common.showLoadingBar(false, (1000*60*5));
		common.Ajax.sendJSONRequest("POST",url,param,function(data){
			if(data.resultCode == "0000"){
				var redirectUri = data.data.redirectUri;
				
				if(redirectUri != undefined && redirectUri != null && redirectUri != ""){
					window.location.replace(redirectUri);
				} else {
					contract.form.layer.getContractFormAjax();
				}
			} else {
				common.hideLoadingBar(null);
				common.link.error();
			}
		},true, 1, 1);
	},
	
	
	/**
	 * 계약하기 화면 조회
	 * @returns
	 */
	getContractFormAjax : function(){
		var url = _baseUrl+"contract/getContractFormAjax.do";
		var param ={
			cartSeq : $("#cartSeq").val()
		};
		
		common.Ajax.sendRequest("GET",url,param,function(data){
			if(data != undefined && data != null && data != ""){
				if(data.resultCode){
					common.link.replaceError();
				} else {
					$("#flCont").html(data);
					
					// 스크립트 동적 로드
					pageAllScript();
					
					// 결제 수단 위쳇 페이 선택
					$(".boxPayType").find(".isPay.icoPay01").click();
				}
			}
			common.hideLoadingBar(null);
		},true, 1, 1);
	},
	
	/**
	 * 로케이션 변경
	 */
	getLocationJson : function(){
		var departmentId = $("#department option:selected").val();
		var cartSeq = $("#cartSeq").val();
		
		if(departmentId == undefined
			|| departmentId == null
			|| departmentId == ""
			|| departmentId =="select"){
			return false;
		}
		
		var url = _baseUrl+"contract/getLocationJson.do";
        var param ={
    		cartSeq : cartSeq,
    		departmentId : departmentId
        };
        
        common.Ajax.sendJSONRequest("POST",url,param,function(data){
        	if(data.resultCode == "0000"){
				var transDate = data.data.transDate;
				
				if(transDate != undefined && transDate != null && transDate != ""){
					$(".transDate").text(transDate);
				}
				
				contract.form.layer.chkOrderBtn(false);
			} else {
				common.hideLoadingBar(null);
				common.layerAlert(data.resultMessage);
			}
        },true, null, (1000*60*5));
	},

	/**
	 * 견적 저장
	 */
	saveQuoteJson : function(){
		
		if(!contract.form.layer.isSaveContract){
			return false;
		}
		contract.form.layer.isSaveContract = false;
		
		// 회원 연동 성공 및 로그인 완료
		var url = _baseUrl+"contract/saveQuoteJson.do";
		var param ={
			cartSeq : $("#cartSeq").val()
			, departmentId : $("#department option:selected").val()
			, totSalePrc : $("#totSalePrc").val()
			, totalPrc : $("#totalPrc").val()
			, depositPrc : $("#depositPrc").val()
//			, prepaidPrc : $("#prepaidPrc").val()
			, payMeanCd : $("#div_payMeanCd").find("a.isPay.active").data("payMeanCd")
			, crcCd : $("[name='crcCd']").val()
			, transDate : $(".transDate").text()
			, mobile : _userAgent.isMobile()
		};
		
        common.Ajax.sendJSONRequest("POST",url,param,function(response){
        	if(common.isLoginAjax(response, false)){
        		if(response.resultCode == "0000"){
        			contract.form.layer.isSaveContract = false;
        			payment.paymentForm._callback_requestPaymentJson(response, 1);
    			} else {
    				// 배송일자가 다를 경우 안내화면
    				if(response.resultCode == "8505"){
    					common.link.moveContractDeliveryDelayFrom($("#cartSeq").val());
    				} else {
    					common.layerAlert(response.resultMessage);
    				}
    				common.hideLoadingBar(null);
    			}
        	}
        	contract.form.layer.isSaveContract = true;
        }, true, 1, 1);
	},
};
