$.namespace("payment.refundForm");
payment.refundForm = {
		
	qrcode : null,
	
	init : function(){
		that = this;
		
		that.bindEvent();
	},
	
	bindEvent : function(){
		$("[name='payMeanCd']").on("change", function(){
		});
		
		// 취소하기 버튼 바인드
		$("#btn_submit").on("click", function(){
			that.validateRefundParam();
			that.requestRefundJson();
		});
		
	},
	
	inputError : function($input, msg) {
		var $inputDiv = $("#"+$input.attr("name")+"Div.inputForm");
//		var $input = $("#"+id);
		$inputDiv.addClass("error");
		$inputDiv.find("em").remove();
		$inputDiv.append("<em>"+msg+"</em>");
		$input.focus();
		$input.on("change", function(){
			$inputDiv.removeClass("error");
			$inputDiv.find("em").remove();
		});
	},
	
	validateRefundParam : function() {
		var $payAmt = $("[name='payAmt']");
		var $payMeanCd = $("[name='payMeanCd']");
		
		if($payAmt.val().isEmpty()) {
			payment.refundForm.inputError($payAmt, "환불금액을 입력하세요.");
			return false;
		}
		
		if(!$payAmt.val().isNumber()) {
			payment.refundForm.inputError($payAmt, "환불금액은 숫자만 입력하세요.");
			return false;
		}
		
		if(!$payMeanCd.is(":checked")) {
			payment.refundForm.inputError($payMeanCd, "결제수단을 선택하세요.");
			return false;
		}
		return true;
	},
	
	// 환불요청
	requestRefundJson : function(cartSeq, quoteId, contractId) {
		
		if(!payment.refundForm.validateRefundParam()){
			return false;
		}
		
		var payNo = $("[name='payNo']").val();
		var contractId = $("[name='contractId']").val();
		var paymentId = $("[name='paymentId']").val();
		var payAmt = $("[name='payAmt']").val();
		var payMeanCd = $("[name='payMeanCd']:checked").val();
		var cnclSctCd = $("[name='cnclSctCd']:checked").val();
		var crcCd = $("[name='crcCd']").val();
		var mobile = $("[name='mobile']:checked").val();
		
		var url = _baseUrl + "payment/requestRefundJson.do";
		var param = {
			contractId : contractId
			, paymentId : paymentId
			, payAmt : payAmt
			, payMeanCd : payMeanCd
			, cnclSctCd : cnclSctCd
			, crcCd : crcCd
			, mobile : mobile
		};
		common.Ajax.sendJSONRequest("POST", url, param, payment.refundForm._callback_requestRefundJson);
	},
	
	_callback_requestRefundJson : function(res) {
		if(typeof res == "string") {
			res = $.parseJSON(res);
		}
		console.log(res.resultMessage);
		alert(res.resultMessage);
		/*
		if(res.resultCode == resultCode_SUCCESS) {
		} else {
		}
		*/
	},
};
