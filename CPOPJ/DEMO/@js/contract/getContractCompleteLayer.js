$.namespace("contract");
contract = {}
$.namespace("contract.complete");
contract.complete = {}

$.namespace("contract.complete.layer");
contract.complete.layer = {
	
	init : function(){
		//트림계층컨텐츠 팝업 이벤트처리
		common.product.bindTrimHierarchyPop();
		//컬러컨텐츠 팝업 이벤트처리
		common.product.bindColorDetailPop();
		// 옵션/패키지 상세 팝업 이벤트 처리
		common.product.bindOptPkgDetailPop();
		
		contract.complete.layer.bindEvent();
	},
	
	bindEvent : function(){
		that = this;
	},
	
	/**
	 * 계약 완료 여부 체크
	 */
	getContractCompleteChkJson : function(){
		
		var url = _baseUrl+"contract/getContractCompleteChkJson.do";
		var param ={
			payNo : $("#payNo").val()
			, contractId : $("#contractId").val()
		};
		
		common.showLoadingBar(false, (1000*60*5));
		common.Ajax.sendJSONRequest("POST",url,param,function(response){
			if(common.isLoginAjax(response)){
				if(response.resultCode == "0000"){
					var redirectUri = response.data.redirectUri;
					var confYn = response.data.confYn;

					if(confYn == "Y"){
						contract.complete.layer.getContractCompleteAjax();
					} else {
						window.location.replace(redirectUri);
					}
				} else {
					common.hideLoadingBar(null);
					common.link.replaceContractConfirm();
				}
			}
		},true, 1, 1);
	},

	/**
	 * 계약 완료 화면 조회
	 * @returns
	 */
	getContractCompleteAjax : function(){
		var url = _baseUrl+"contract/getContractCompleteAjax.do";
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
	                
					pageAllScript();
//					$.getScript(_jsUrl+"common/publish/content.js"+_dummyStr).done(function(script, textStatus) {});
				}
			}
			common.hideLoadingBar(null);
		});
//		},true, 1, 1);
	},
};
