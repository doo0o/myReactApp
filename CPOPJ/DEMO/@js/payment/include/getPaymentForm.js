$.namespace("payment.paymentForm");
payment.paymentForm = {
		
	qrcode : null,
	isProcessing : null,
	maxFractionDigits : 2,
	
	
	init : function(){
		this.bindEvent();
		
		if($("[name='categoryRadio']:enabled").length == 1) {
			$("[name='categoryRadio']:enabled").prop("checked", true);
			$("[name='categoryRadio']:enabled").change();
		} else {
			this.checkNumberRange("#parPayAmt");
		}

		var qrcodeId = "qrcode";
		var $qrcode = $("#"+qrcodeId);
		this.qrcode = new QRCode(qrcodeId, {
//			text : reqUrl,
			width : parseFloat($qrcode.css("width")),
			height : parseFloat($qrcode.css("height")),
//			colorDark : "",
//			colorLight : ""
		});
	},
	
	bindEvent : function(){
		
		// 결제하기 버튼 바인드
		$(document).off("click","#btn_submit").on("click","#btn_submit", payment.paymentForm.clickPayBtn);
		
		//차량잔금/기타잔금 라디오버튼 바인드
		$(document).off("change","[name='categoryRadio']").on("change","[name='categoryRadio']", function(){
			payment.paymentForm.changePayAmt($(this).val());
		});
		/*
		// 전체/분할결제 라디오버튼 바인드
		$(document).off("click","[name='payChk']").on("click","[name='payChk']", function(){
			var ret = payment.paymentForm.validateCategory();
			if(ret.result) {
				payment.paymentForm.changePayChk($(this).attr("id"));
			} else {
				$("#fullPay").prop("checked", true);
				common.layerAlert(ret.resultMsg);
			}
		});
		*/
		// 결제상세 버튼 바인드
		$(document).off("click","#btn_paymentDetail").on("click", "#btn_paymentDetail", function(){
			payment.paymentForm.getPaymentDetailAjax();
		});
		
		
	},
	
	clickPayBtn : function(){
		// 인도지 설정 안했을 경우, 잔금 0처리 방지
		if(typeof(mypage.contract.form.chkDeliveryBalance) == "function"){
			if(!mypage.contract.form.chkDeliveryBalance()){
				common.layerAlert(_EMPTY_TRANSPORTATION_INFO);
				return false;
			}
		}
		
		var isPay = true;
		
		if(typeof(mypage.contract.form.checkInputVlaue) == "function"){
			isPay = mypage.contract.form.checkInputVlaue(true);
		}
		
		$(document).off("click","#btn_submit").on("click","#btn_submit", function(){
			common.layerAlert(msg_paymentAleadyProcessing);
		});
		payment.paymentForm.isProcessing = setTimeout(function(){
			$(document).off("click","#btn_submit").on("click","#btn_submit", payment.paymentForm.clickPayBtn);
			payment.paymentForm.isProcessing = null;
		}, 10000);
		
		if(isPay){
			payment.paymentForm.requestPaymentJson();
		}
	},
	
	setPayAmt : function(value, type) {
		var ret = payment.paymentForm.validateCategory();
		if(ret.result) {
			var orgPayAmt = String($("#parPayAmt").val()).toNumber();
			var fullPayAmt = String($("#fullPayAmt").val()).toNumber();
			value = String(value).toNumber();
			switch(type) {
			case "add" :
				orgPayAmt += value;
				break;
			case "%" :
				orgPayAmt = fullPayAmt * value/100;
				break;
			case "value" :
				orgPayAmt = value;
				break;
			default :
				return false;
			}
			$("#parPayAmt").val(orgPayAmt.toFixed(2)).trigger('textchange');;
		} else {
			common.layerAlert(ret.resultMsg);
		}
	},
	
	changePayAmt : function(category) {
		$("[name='category']").val(category);
		var payAmt = $("#payAmt_"+category).val();
		var currencySymbol = $("#fullPayAmt").data("currencySymbol");
		var strPayAmt = payAmt.numberFormat(currencySymbol, 2);
		$("#fullPayAmt").val(payAmt); 
		$("#parPayAmt").val("");
		$("#span_fullPayAmt").text(strPayAmt); 
		$("#span_balance").text(strPayAmt); 
		
		// 결제금액 체크
		payment.paymentForm.checkNumberRange("#parPayAmt", 0, Number(payAmt));
    	mypage.contract.form.chkSubmitBtn(false);
	},
	
	changePayChk : function(id) {
		$("[name='payAmt']").prop("disabled", true);
		$("#"+id+"Amt").prop("disabled", false);
    	mypage.contract.form.chkSubmitBtn(false);
	},
	
	validProcessing : function() {
		var ret = {
				result : true,
				resultMsg : ""
		};
		if(payment.paymentForm.isProcessing !== null) {
			ret.result = false;
			ret.resultMsg = msg_paymentAleadyProcessing;
			return ret;
		}
		return ret;
	},
    
    checkNumberRange : function(objNm, min, max) {
    	if(!objNm) {
    		return false;
    	}
    	$(document).off("focus focusin", objNm);
    	if(min == null
    			|| max == null
    			|| min == undefined
    			|| max == undefined
    			|| isNaN(min) 
    			|| isNaN(max) 
    			|| min >= max
    			) {
        	$(document).on("focus focusin", objNm, function(){
    			var ret = payment.paymentForm.validateCategory();
    			if(ret.result) {
    				payment.paymentForm.changePayAmt($("[name='categoryRadio']").val());
    			} else {
        			common.layerAlert(ret.resultMsg);
    			}
        	});
    		return false;
    	}
        //숫자 입력 범위내 체크
        $(document).off("propertychange change paste input textchange", objNm).on("propertychange change paste input textchange", objNm, function() {
        	var $input = $(this);
        	var value = $input.val();
    		
        	if(value != "") {
        		var maxFractionDigits = payment.paymentForm.maxFractionDigits;
        		var strValue = payment.paymentForm.getValidNumber(value, maxFractionDigits);
        		var numValue = Number(strValue);
        		var isLimit = false;
                var dotIndex = value.indexOf(".");
    			var pos = $input[0].selectionEnd;
        		
        		// 숫자 범위 비교
        		if(numValue < min) {
        			numValue = min;
        			isLimit = true;
        		} else if(numValue > max) {
        			common.layerAlert(msg_payAmtIsExceeded, function(){
        				$input.focus();
        			});
        			numValue = max;
        			isLimit = true;
        		}
        		if(isLimit) {
        			if(maxFractionDigits != undefined && maxFractionDigits != null){
        				strValue = numValue.toFixed(maxFractionDigits).toString();
        			} else {
        				strValue = numValue.toString();
        			}
        		}
        		// 셋째자리마다 콤마
                strValue = strValue.numberFormat();
                $input.val(strValue);
                
        		// 커서위치세팅
                if(isLimit) {
                    $input[0].setSelectionRange(0,strValue.length);
                } else if(dotIndex < 0) {
                    pos = strValue.length - (value.length - pos);
                    $input[0].setSelectionRange(pos,pos);
                } else {
                    var newDotIndex = strValue.indexOf(".");
                    pos = newDotIndex + (pos - dotIndex);
                    $input[0].setSelectionRange(pos,pos);
                    $input[0].setSelectionRange(pos,pos);
    			}
        	}
        	mypage.contract.form.chkSubmitBtn(false);
        });
    },
    
    getValidNumber : function(value, maxFractionDigits) {
    	var strValue = String(value).trim();
    	if(strValue != "") {
    		var dotIndex = strValue.indexOf(".");
    		
    		// 소수점이 없는 경우
    		if(dotIndex < 0) {
    			strValue = strValue.replace(/[^0-9]/g,"");
    			if(strValue.length > 0) {
    				strValue = String(Number(strValue));
    			}
			// 소수점이 있는 경우
    		} else {
    			var arr = ["",""];
    			arr[0] = strValue.substring(0, dotIndex).replace(/[^0-9]/g,"");
    			arr[0] = String(Number(arr[0]));
                arr[1] = strValue.substr(dotIndex+1, strValue.length).replace(/[^0-9]/g,"").substr(0, maxFractionDigits);
    			strValue = arr[0] + "." + arr[1];
    		}
    	}
    	return strValue;
    },
    
	validatePayAmt : function() {
		var selector_payAmt = "[name='payAmt']:enabled";
		var ret = {
			result : true,
			resultMsg : ""
		};
		// 결제금액이 없는 경우
		if($(selector_payAmt).val().isEmpty()) {
			ret.result = false;
			ret.resultMsg = msg_payAmtIsEmpty;
			return ret;
		}

		// 결제금액이 숫자가 아닌 경우
		if(!$(selector_payAmt).val().isNumber()) {
			ret.result = false;
			ret.resultMsg = msg_payAmtNumberOnly;
			return ret;
		}
		
		// 최소 결제 가능 금액
		if(Number($(selector_payAmt).val()) <= 0) {
			ret.result = false;
			ret.resultMsg = msg_payAmtIsEmpty;
			return ret;
		}
		
		// 최대 결제 가능 금액
		if(Number($(selector_payAmt).val()) > Number($("#fullPayAmt").val())) {
			ret.result = false;
			ret.resultMsg = msg_payAmtIsExceeded;
			return ret;
		}
		return ret;
	},
	
	validateCategory : function() {
		var ret = {
			result : true,
			resultMsg : ""
		};
		// 카테고리가 없는 경우
		if(!$("[name='categoryRadio']:checked").val()) {
			ret.result = false;
			ret.resultMsg = msg_categoryIsEmpty;
			return ret;
		}
		if(!$("[name='category']").val()) {
			ret.result = false;
			ret.resultMsg = msg_categoryIsEmpty;
			return ret;
		}
		return ret;
	},
	
	validatePayMeanCd : function(){
		var ret = {
			result : true,
			resultMsg : ""
		};
		// 결제수단이 없는 경우
		if(!$("#div_payMeanCd").find("a.isPay.active").data("payMeanCd")) {
			ret.result = false;
			ret.resultMsg = msg_payMeanCdIsEmpty;
			return ret;
		}
		return ret;
	},
	
	validatePaymentParam : function() {
		$("#qrcode").hide();
		$("#form").html('');
		
		var result = true;
		// 결제금액
		result = result && common.checkVaild("[name='payAmt']:enabled", payment.paymentForm.validatePayAmt);
		// 결제수단
		result = result && payment.paymentForm.validatePayMeanCd().result;
		return result;
	},
	
	// 결제요청
	requestPaymentJson : function() {
		$("#qrcode").hide();
		$("#form").html('');
		
		if(!payment.paymentForm.validatePaymentParam()){
			return false;
		}
		
		var contractId = $("[name='contractId']").val();
		var originContractId = $("[name='originContractId']").val();
		var payAmt = payment.paymentForm.getValidNumber($("[name='payAmt']:enabled").val(), payment.paymentForm.maxFractionDigits);
		var payMeanCd = $("#div_payMeanCd").find("a.isPay.active").data("payMeanCd");
		var category = $("[name='category']").val();
		var crcCd = $("[name='crcCd']").val();
		var chkDeliveryYn = "N";
		if(typeof(mypage.contract.form.chkDeliveryBalance) == "function"){
			chkDeliveryYn = "Y";
		}
		
		var url = _baseUrl + "payment/requestPaymentJson.do";
		var param = {
			contractId : contractId
			, originContractId : originContractId
			, payAmt : payAmt
			, payMeanCd : payMeanCd
			, category : category
			, crcCd : crcCd
			, chkDeliveryYn : chkDeliveryYn
			, isMobile : _userAgent.isMobile()
		};
		common.showLoadingBar(false, null, null);
		common.Ajax.sendJSONRequest("POST", url, param, payment.paymentForm._callback_requestPaymentJson, true, true);
	},
	
	_callback_requestPaymentJson : function(res, noLoadingBar) {
		if(noLoadingBar == undefined || noLoadingBar == null){
			noLoadingBar = false;
		}
		
		if(typeof res == "string") {
			res = $.parseJSON(res);
		}
		if(res.resultCode == resultCode_SUCCESS) {
			var data = res.data
			var paymentType = data.paymentType;
			var reqUrl = data.reqUrl;
			var paramMap = data.paramMap;
			
			if(paymentType == "form") {
				var $reqForm = $("<form />", {
					id : "regForm",
					method : "post",
					action : reqUrl
				});
				for(var param in paramMap) {
					var $param = $("<input />", {
						type : "hidden",
						name : param,
						value : paramMap[param]
					});
					$reqForm.append($param);
				}$
				("#form").html($reqForm);
				console.log($reqForm);
				$reqForm.submit();
				
			} else if(paymentType == "QR") {
				var layer_name = "";
				var crcSyml = CXP_CRC_SYML_MAP[data.crcCd];
				var payAmt = crcSyml + data.payAmt.toMoney();
				
				payment.paymentForm.qrcode.makeCode(reqUrl);
				
				switch(payMeanCd) {
				case PAY_MEAN_CD_WECHATPAY :
					layer_name = "layerPop_wechatPay";
					$("#payAmt_wechatPay").text(payAmt);
					break;
				}
				layerPopOpen(layer_name);
				common.hideLoadingBar(noLoadingBar);
			} else if(paymentType == "link") {
				location.href = reqUrl;
			}
		} else {
			common.hideLoadingBar(noLoadingBar);
			console.log(res.resultMessage);
			common.layerAlert(res.resultMessage);
		}
	},
	
	getPaymentDetailAjax : function() {
		msg_exception = undefined;
		var url = _baseUrl + "payment/getPaymentDetailAjax.do";
		var param = {
			contractId : $("#contractId").val()
		};

		common.Ajax.sendRequest("GET",url,param,function(data){
			if(data != undefined && data != null && data != ""){
				// 프레임웍 오류시
				if(data.resultMessage != undefined && data.resultMessage != null && data.resultMessage != "") {
					var callback = null;
					// 로그인상태가 아닌경우
            		if(data.resultCode == common._jsonLoginErrorCd){
						callback = common.link.moveLoginPage;
					}
					common.layerAlert(data.resultMessage, callback);
				} else {
					$("#paymentDetailCont").html(data);
					// 오류발생시
					if(!!msg_exception) {
						common.layerAlert(msg_exception);
					} else {
						$("#layerPop-paymentDetails").removeClass('fix-center');
						
						payment.paymentDetail.init();
						
						layerPopOpen("layerPop-paymentDetails");
					}
				}
			}
		},true, null, null);
	},
};
