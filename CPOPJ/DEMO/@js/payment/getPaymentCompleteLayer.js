$.namespace("payment");
payment = {}
$.namespace("payment.complete");
payment.complete = {}

$.namespace("payment.complete.layer");
payment.complete.layer = {
	
	init : function(){
		payment.complete.layer.bindEvent();
	},
	
	bindEvent : function(){
		that = this;
	},
	
	/**
	 * 최종 결제 완료 여부 체크
	 */
	getPaymentCompleteChkJson : function(){
		
		var url = _baseUrl+"payment/getPaymentCompleteChkJson.do";
		var param ={
			payNo : $("#payNo").val()
			, contractId : $("#contractId").val()
		};
		
		common.showLoadingBar(false, (1000*60*5));
		common.Ajax.sendJSONRequest("POST",url,param,function(data){
			if(data.resultCode == "0000"){
				var redirectUri = data.data.redirectUri;
				var confYn = data.data.confYn;

				if(confYn == "Y"){
					payment.complete.layer.getPaymentCompleteAjax();
				} else {
					common.hideLoadingBar(null);
					common.layerAlert(data.data.message, function(){
						window.location.replace(redirectUri);
					})
				}
			} else {
				common.hideLoadingBar(null);
				common.link.replacePaymentConfirm();
			}
		},true, 1, 1);
	},

	/**
	 * 계약 완료 화면 조회
	 * @returns
	 */
	getPaymentCompleteAjax : function(){
		var url = _baseUrl+"payment/getPaymentCompleteAjax.do";
		var param ={
			payNo : $("#payNo").val()
			, contractId : $("#contractId").val()
		};
		
		common.Ajax.sendRequest("GET",url,param,function(data){
			if(data != undefined && data != null && data != ""){
				if(data.resultCode){
            		if(data.resultCode == common._jsonLoginErrorCd){
            			common.hideLoadingBar(null);
            			common.layerAlert(_COMMON_MSG_MOVE_LOGIN, common.link.moveLoginPage);
            		} else {
            			common.link.replaceError();
            		}
				} else {
					$("#flCont").html(data);
					
					// 이미 취소된 계약 일 경우
	                var cancelYn = $("#cancelYn").val();
	                if(cancelYn != null && cancelYn =="Y"){
	                	common.hideLoadingBar(null);
	                	common.layerAlert(_CONTRACT_MSG_CANCEL_COMPLETE, function(originContractId){
	                		common.link.moveMyContractCancelReqComplete(originContractId);
	                	}, $("#originContractId").val());
	                	return false;
	                }
	                
	                // 완납 여부 체크
//	                var payCompleteYn = $("#payCompleteYn").val();
//	                if(payCompleteYn !="Y"){
//	                	common.hideLoadingBar(null);
//	                	common.layerAlert(_CONTRACT_MSG_NOT_PAY_COMPLETE, common.link.moveMyPageMain);
//	                	return false;
//	                }
	                
					pageAllScript();
				}
			}
			common.hideLoadingBar(null);
		},true, 1, 1);
	},
};
