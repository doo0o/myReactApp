$.namespace("mypage.main.delivery");
mypage.main.delivery = {
	
	init : function(){
		
		this.checkResultCode();
		
		this.setDefaultInfo();
		
		this.bindEvent();
		
//		common.hideLoadingBar(null);
	},
	
	setDefaultInfo : function(){
		//배송상태 셋팅
		var currentOtdStatusCd = $("#currentOtdStatusCd").val();
		var isBackOrder = $("#isBackOrder").val();
		
		if(currentOtdStatusCd==_CODE_CCM_OTD_STATUS_PO_CREATION
				|| currentOtdStatusCd==_CODE_CCM_OTD_STATUS_PRODUCTION_COMPLETION){
			//생산중
			$(".step.s1").parent().addClass("active");
		}else if(currentOtdStatusCd==_CODE_CCM_OTD_STATUS_SHIPPING){
			//선적중
			$(".step.s2").parent().addClass("active");
			
			if(isBackOrder=="false"){
				//배송준비중
				$(".step.s4").parent().addClass("active");
			}
		}else if(currentOtdStatusCd==_CODE_CCM_OTD_STATUS_PORT_ARRIVAL ||
				currentOtdStatusCd==_CODE_CCM_OTD_STATUS_CUSTOMS_CLEARANCE){
			//통관중
			$(".step.s3").parent().addClass("active");
			
			if(isBackOrder=="false"){
				//배송준비중
				$(".step.s4").parent().addClass("active");
			}
		}else if(currentOtdStatusCd==_CODE_CCM_OTD_STATUS_COMPOUND_IN ||
				currentOtdStatusCd==_CODE_CCM_OTD_STATUS_DARK_STORE_IN){
			//배송준비중
			$(".step.s4").parent().addClass("active");
		}else if(currentOtdStatusCd==_CODE_CCM_OTD_STATUS_GATE_OUT){
			//배송중
			$(".step.s5").parent().addClass("active");
		}else if(currentOtdStatusCd==_CODE_CCM_OTD_STATUS_CUSTOMER_DELIVERY){
			//인도중
			$(".step.s6").parent().addClass("active");
		}else if(currentOtdStatusCd==_CODE_CCM_OTD_STATUS_DROP_OFF){
			//배송완료
			$(".step.s7").parent().addClass("active");
		}
		
	},
	
	bindEvent : function(){
		that = this;
		
		$("#btnClose").click(function(){
			layerPopClose("layerPop-deliInfo");
		});
		
	},
	
	checkResultCode : function(){
		var resultCode = $("#resultCode").val();
		
		if(resultCode==9999){
			common.layerAlert(_unexpectedError);
			layerPopClose("layerPop-deliInfo");
		}else if(resultCode==9998){
			common.layerAlert(_isNotLogged);
			layerPopClose("layerPop-deliInfo");
		}
	},
	
};