$.namespace("payment.paymentDetail");
payment.paymentDetail = {
		
	qrcode : null,
	
	init : function(){
		that = this;
		
		that.bindEvent();
		
		that.enableCancelBtn();
	},
	
	bindEvent : function(){
		
		// 취소할 결제 라디오버튼 바인드
		$(document).off("change","[name='r1']").on("change","[name='r1']", function(){
			payment.paymentDetail.enableCancelBtn();
		});
		
		// 취소사유 셀렉트박스 바인드
		$(document).off("change","#sel_cancelReason").on("change","#sel_cancelReason", function(){
			payment.paymentDetail.enableCancelBtn();
		});

		// 취소하기 버튼 바인드
		$(document).off("click","#btn_cancel").on("click","#btn_cancel", function(){
			payment.paymentDetail.requestRefundJson();
		});
		
	},
	

	enableCancelBtn : function() {
		$("#btn_cancel").attr("disabled", !payment.paymentDetail.isPossibleCancel());
	},
	
	isPossibleCancel : function() {
		return $("[name='r1']:checked").length > 0
		&& !!$("#sel_cancelReason").val();
	},
	
	validateCancelParam : function() {
		var selector_cancelReason = "#sel_cancelReason";
		
		var result = true;
		
		// 취소사유
		result = result && common.checkVaild(selector_cancelReason, function(){
			var ret = {
				result : true,
				resultMsg : ""
			};
			// 취소사유가 없는 경우
			if($(selector_cancelReason).val().isEmpty()) {
				ret.result = false;
				ret.resultMsg = msg_cancelReasonIsEmpty;
			}
			return ret;
		});
		return result;
	},

	// 환불요청
	requestRefundJson : function() {
		
		if(!payment.paymentDetail.validateCancelParam()){
			return false;
		}
		
		common.layerConfirm(msg_cancelConfirm, function(){
			var contractId = $("[name='contractId']").val();
			var paymentId = $("[name='r1']:checked").data("paymentId");
			var payCnclReason = $("#sel_cancelReason").val();
			
			var url = _baseUrl + "payment/requestRefundJson.do";
			var param = {
					contractId : contractId
					, paymentId : paymentId
					, payCnclReason : payCnclReason
					, isMobile : _userAgent.isMobile()
			};
			common.showLoadingBar(false, null, null);
			common.Ajax.sendJSONRequest("POST", url, param, payment.paymentDetail._callback_requestRefundJson, true, true);
		})
	},
	
	_callback_requestRefundJson : function(res) {
		if(typeof res == "string") {
			res = $.parseJSON(res);
		}
		if(res.resultCode == resultCode_SUCCESS) {
			common.hideLoadingBar(null);
			common.layerAlert(msg_cancelComplete, function(){
				layerPopClose("layerPop-paymentDetails");
				var contrOrgId  = $("#originContractId").val();
				mypage.contract.form.getMyContractFormAjax(contrOrgId, false, null, true);
			});
		} else {
			common.hideLoadingBar(null);
			common.layerAlert(res.resultMessage, function(){
				layerPopClose("layerPop-paymentDetails");
			});
		}
	},
};
