$.namespace("account.pwdVerification");
account.pwdVerification = {
		
	init : function(){
		account.pwdVerification.bindEvent();
		
		$("#password").focus();
		
		$("#ok").attr("disabled", true);
	},
	
	bindEvent : function(){
		
		$("#cancel").click(function(){
			common.link.moveMyPageMain();
		});
		
		$("#password").on("change paste keyup", function(key) {
			if ($(this).val()) {
				$("#ok").attr("disabled", false);
				if (key.keyCode == 13) {
					account.pwdVerification.doPwdVerification();
				}
			} else {
				$("#ok").attr("disabled", true);
			}
		});
		
		$("#ok").click(function(){
			account.pwdVerification.doPwdVerification();
		});
		
		$("#inputFormPassword").find("span").click(function(){
			$("#password").val("");
			$("#ok").attr("disabled", true);
			account.pwdVerification.doPwdVerification();
		});
	},
	
	doPwdVerification : function(){
		common.checkVaild("#inputFormPassword", function() {
			var ret = {
				result : true,
				resultMsg : ""
			};
			if (!$("#password").val()) {
				ret.result = false;
				ret.resultMsg = _notPassword;
				return ret;
			}
			
			if (ret.result) {
				var param = {
					email : $("#email").val(),
					password : $("#password").val()
				};
				common.Ajax.sendRequest(
						"POST"
						, _baseUrl+"login/getPwdConfirmAjax.do"
						, param
						, function(res) {
							if (res.code == "0000") {
								common.link.moveMemberModifyForm();
							} else {
								common.checkVaild("#inputFormPassword", function() {
									var passRet = {
										result : true,
										resultMsg : ""
									};
									passRet.result = false;
									passRet.resultMsg = _notMsg;
									ret = passRet;
									return passRet;
								});
							}
						}
						, true
						, false);
			}
			return ret;
		});
	},
	
};
