$.namespace("account.memberModifyForm");
account.memberModifyForm = {
	chinaAddrJson : null,
		
	init : function(){
		account.memberModifyForm.bindEvent();
		
		/*
		if (_billingState) {
			$("#state").val(_billingState);
		} else {
			$('#state option').each(function() {
			    if($(this).text() == _nowState)
			        $(this).prop('selected', true);
			});
		}
		if (_billingCity) {
			$("#city").val(_billingCity);
		} else {
			$('#city option').each(function() {
			    if($(this).text() == _nowCity)
			        $(this).prop('selected', true);
			});
		}
		if (_billingStreet) {
			$("#street").val(_billingStreet);
		} else {
			$("#street").val(_nowStreet);
		}
		if (_billingPostalCode) $("#zipcode").val(_billingPostalCode);
		*/
		
		if (_sms == "T") $("#smsOptIn").prop('checked', true);
		if (_call == "T") $("#callOptIn").prop('checked', true);
		if (_dm == "T") $("#directMailOptIn").prop('checked', true);
		//if (_weChat == "T") $("#weChatTextOptIn").prop('checked', true);
	},
	
	bindEvent : function(){
		
		$(".contsArea").find(".agreeArea").find(".optArea").find("a").click(function(){
			$(location).attr('href', _baseUrl + "login/gaCall.do?scope=url.find.email");
		});
		
		/*
		$("#state").change(function(){
			$("#street").val('');
			account.memberModifyForm.changeChinaAddr();
		});
		*/
		
		$("#optArgAll").click(function(){
			if ($(this).is(":checked")) {
				$(".contsArea").find(".agreeArea").find(".optArea").find("input[type='checkbox']").prop('checked', true);
			} else {
				$(".contsArea").find(".agreeArea").find(".optArea").find("input[type='checkbox']").prop('checked', false);
			}
		});
		
		$(":checkbox[name='optArg']").click(function(){ 
			if ( $(this).prop('checked') ) { 
				if($("input:checkbox[name='optArg']:checked").length == $("input:checkbox[name='optArg']").length) {	
					$('input:checkbox[id="optArgAll"]').prop("checked",true);
				}
			} else { 
				if($("input:checkbox[name='optArg']:checked").length < $("input:checkbox[name='optArg']").length) {
					$('input:checkbox[id="optArgAll"]').prop("checked",false);
				}
			} 
		});
		
		// 취소
		$(".contsArea").find(".btnArea").eq(0).find("a").eq(0).click(function(){
			common.layerConfirm(_cancel, common.link.main);
		});
		
		// 개인정보 수정
		$(".contsArea").find(".btnArea").eq(0).find("a").eq(1).click(function(){
			common.layerConfirm(_ok, function(){
				//var _smsOptIn="F", _callOptIn="F", _directMailOptIn="F", _weChatTextOptIn="F";
				var _smsOptIn="F", _callOptIn="F", _directMailOptIn="F";
				if ($("#smsOptIn").prop("checked")) _smsOptIn = "T";
				if ($("#callOptIn").prop("checked")) _callOptIn = "T";
				if ($("#directMailOptIn").prop("checked")) _directMailOptIn = "T";
				//if ($("#weChatTextOptIn").prop("checked")) _weChatTextOptIn = "T";
				var param = {
						smsOptIn : _smsOptIn,
						callOptIn : _callOptIn,
						directMailOptIn : _directMailOptIn,
						//weChatTextOptIn : _weChatTextOptIn,
						state : $("#state").val(),
						city : $("#city").val(),
						street : $("#street").val(),
						zipcode : $("#zipcode").val()
				};
				common.Ajax.sendRequest(
					"POST"
					, _baseUrl+"login/getMemberModifyAjax.do"
					, param
					, function(res) {
						if (res.code == _mem_cd_0000) {
							common.layerConfirm(res.message, common.link.main);
							$("#layerPop-confirm").find(".btnArea").find("a").eq(0).hide();
						} else {
							common.layerAlert(res.message);
						}
					}
					, true
					, false
				);
			});
		});
		
		//서비스탈퇴
		$(".contsArea").find(".btnArea").eq(1).find("a").click(function(){
			common.Ajax.sendJSONRequest("GET", _baseUrl+"login/getSignoutChkAjax.do", "", function(res) {
				if (res.code == _mem_cd_0000) {
					//서비스탈퇴(약관철회) 이동
					common.link.moveMemberSignoutForm();
				} else {
					common.layerConfirm(res.message.replace("\\n","\n"), common.link.moveMemberSignoutForm);
				}
			});
		});
		
	},
	
	/*
	changeChinaAddr : function(){
		var cd = $("#state").val();
		var cityList = account.memberModifyForm.chinaAddrJson[cd];
		
		if(cityList != undefined && cityList != null && cityList.length > 0){
			$("#city").html("");
			
			var optionStr = "";
			for(var i=0; i<cityList.length; i++){
				var city = cityList[i];
				optionStr+="<option value='"+city.cd+"'>"+city.cdNm+"</option>"
			}
			
			$("#city").html(optionStr);
		}
	},
	*/
};
