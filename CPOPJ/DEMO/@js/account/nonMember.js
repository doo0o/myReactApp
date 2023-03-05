$.namespace("account.nonMember");
account.nonMember = {
	certifTimer : null,
	certifiTime : 180,
		
	init : function(){
		account.nonMember.bindEvent();
		
		$('#nonMember').attr('disabled', true);
		$('#verifyOtpNumber').attr('disabled', true);
		
		$('.contsArea').find('li').eq(2).hide();
		$('.contsArea').find('li').eq(3).hide();
	},
	
	bindEvent : function(){
		// 이메일 검증
		$('#eMail').focusout(function() {
			common.checkVaild("#inputFormEmail", function() {
				var ret = {
					result : true,
					resultMsg : ""
				};
				if ($('#eMail').val()) {
					if (common.isEmail($('#eMail').val())) {
						console.log("true");
					} else {
						ret.result = false;
						ret.resultMsg = _notFormatEmail;
						return ret;
					}
				}
				return ret;
			});
		});
		
		$('#inputFormEmail').find("span").click(function(){
			$('#eMail').val("");
			$('#eMail').focusout();
		});
		
		// 인증번호 전송/재전송
		$('#btnSendOtpNum').click(function(){
			$('.contsArea').find('li').eq(1).show();
			
			var flag = true;
			common.checkVaild("#inputFormEmail", function() {
				var emailRet = {
					result : true,
					resultMsg : ""
				};
				if (!$('#eMail').val()) {
					flag = false;
					$("#eMail").attr("readonly", false);
					emailRet.result = false;
					emailRet.resultMsg = _enterEmail;
					return emailRet;
				}
				if (!common.isEmail($('#eMail').val())) {
					flag = false;
					emailRet.result = false;
					emailRet.resultMsg = _notFormatEmail;
					return emailRet;
				}
				return emailRet;
			});
			if (flag) {
				$('.contsArea').find('li').eq(1).find('a').attr('disabled', false);
				$('#verNum').attr('disabled', false);
				var param = {
						email : $('#eMail').val()
				};
				common.account.getCertifiNoAjax(param, function(res) {
					if (res.code == _mem_cd_0000) { //인증번호 발급 성공
						
						if ($('.contsArea').find('li').eq(0).find('a').text() == _sendOtpNo) {
							common.layerAlert(_verificationSend);
							
							$('.contsArea').find('li').eq(0).find('a').text(_resend);
						} else {
							common.layerAlert(_verificationResend);
							$("#nonMemberVerification").find(".message").remove();
						}
						
						console.log("인증번호 : " + res.certifiNo);
						
						$('#verNum').val(""); //사용자 인증번호 입력 id - 초기화
						$('.timeChk').text("");
						clearInterval(common.account.certifTimer);
						common.account.certifiTime = 180;
						common.account.doCertifiTimer();
						
						$('#verifyOtpNumber').attr('disabled', false);
					} else {
						common.layerAlert(res.message);
					}
				});
			}
		});
		
		// 인증번호 확인
		$('#verifyOtpNumber').click(function(){
			common.checkVaild("#inputFormVerifyOtpNumber", function() {
				var ret = {
					result : true,
					resultMsg : ""
				};
				if (!common.isOtp($('#verNum').val())) {
					ret.result = false;
					ret.resultMsg = _verificationNumLength;
					return ret;
				} else {
					var param = {
						verNum : $('#verNum').val()
					};
					common.account.getCertifiChkAjax(param, function(res) {
						common.checkVaild("#inputFormVerifyOtpNumber", function() {
							var subret = {
								result : true,
								resultMsg : ""
							};
							$('#verNum').val("");
							
							if (res.code == _mem_cd_0000) {
								clearInterval(common.account.certifTimer);
								$('.timeChk').text("");
								
								//인증이 완료 되었습니다.
								common.layerAlert(_verificationCompleted);
								
								$('.contsArea').find('li').eq(1).find('a').attr('disabled', true);
								$('#verNum').attr('disabled', true);
								$('#nonMember').attr('disabled', false);
								
								$("#eMail").attr("readonly",true).attr("disabled",true);
								
								$('.contsArea').find('li').eq(0).find("span").remove();
								$('.contsArea').find('li').eq(0).find("a").hide();
								$('.contsArea').find('li').eq(1).hide();
								
								$('.contsArea').find('li').eq(2).show();
								$('.contsArea').find('li').eq(3).show();
								
							} else if (res.code == _mem_cd_9012) {
								//인증번호가 일치하지 않습니다.
								subret.result = false;
								subret.resultMsg = _verificationFailure;
							} else if (res.code == _mem_cd_9011) {
								$('.timeChk').text("");
								clearInterval(common.account.certifTimer);
								
								subret.result = false;
								subret.resultMsg = _verificationExpired + "<br/>" + _verificationRetry;
								
								$('#verifyOtpNumber').attr('disabled', true);
							} else {
								common.layerAlert(res.message);
							}
							return subret;
						});
					});
				}
				return ret;
			});
		});

		$('#lastName').on('keyup focusout', function() {
			$("#viewName").text($('#lastName').val() + $('#firstName').val());
		});
		$('#inputFormLastName').find("span").click(function(){
			$('#lastName').val("");
			$('#lastName').focusout();
		});
		
		$('#firstName').on('keyup focusout', function() {
			$("#viewName").text($('#lastName').val() + $('#firstName').val());
		});
		$('#inputFormFirstName').find("span").click(function(){
			$('#firstName').val("");
			$('#firstName').focusout();
		});
		
		$("#mobile").on('keyup focusout ', function(event) {
			var _mobile = $('#mobile').val().replace(/-/gi, "");
			if (event.type == "keyup") {
				if (_mobile.length > 7) {
					$('#mobile').val(_mobile.replace(/(\d{3})(\d{4})/, '$1-$2-'));
				} else if (_mobile.length > 3) {
					$('#mobile').val(_mobile.replace(/(\d{3})/, '$1-'));
				}				
			} else {
				account.nonMember.mobileFocusout();
			}
		});
		$('#inputFormMobile').find("span").click(function(){
			$('#mobile').val("");
			account.nonMember.mobileFocusout();
		});
		
		// 비회원로그인
		$('#nonMember').click(function(){
			var lastNameRet = {
				result : true,
				resultMsg : ""
			};
			common.checkVaild("#inputFormLastName", function() {
				if (!$("#lastName").val()) {
					lastNameRet.result = false;
					lastNameRet.resultMsg = _notLastname;
					return lastNameRet;
				}
				return lastNameRet;
			});
			var mobileRet = {
					result : true,
					resultMsg : ""
				};
			common.checkVaild("#inputFormMobile", function() {
				if (!$("#mobile").val()) {
					mobileRet.result = false;
					mobileRet.resultMsg = _notMobile;
					return mobileRet;
				}
				if($('#mobile').is('[readonly]')) {
					return mobileRet;
				}
				if (common.isEmpty($('#mobile').val())) {
					return mobileRet;
				}
				
				_mobile = $('#mobile').val().replace(/-/gi, "");
				
				
				var mobileNo = $('#mobile').val().replace(/-/gi, "");
				if(mobileNo.substring(0,3) == '+86') {
					mobileNo = mobileNo.substring(3, mobileNo.length);
				}
			    if(!common.isMobile(mobileNo)) {
					if (mobileNo.length < 11) {
						mobileRet.result = false;
						mobileRet.resultMsg = _notFormatMobile;
					} else {
						if(!common.isMobile(mobileNo)) {
							mobileRet.result = false;
							mobileRet.resultMsg = _notAbleMobile;
					    }
					}
			    }
			    $('#mobile').val(mobileNo.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
				return mobileRet;
			});
			
			if (lastNameRet.result && mobileRet.result) {
				var _mobile = $("#mobile").val().replace(/-/gi, "");
				if(_mobile.substring(0,3) == '+86') {
					_mobile = _mobile.substring(3, _mobile.length);
				}
				var param = {
						email : $('#eMail').val(),
						lastName : $('#lastName').val(),
						firstName : $('#firstName').val(),
						mobile : _mobile
				};
				common.showLoadingBar();
				common.Ajax.sendRequest(
						"POST"
						, _baseUrl+"login/nonMemberLoginPrcAjax.do"
						, param
						, function(res) {
							if (res.code == _mem_cd_0000) {
								common.hideLoadingBar();
								
								if ($('#redirectUrl').val()) {
									if ($('#redirectUrl').val().indexOf("loginPage.do") > -1 || $('#redirectUrl').val().indexOf("nonMemberLogin.do") > -1) {
										common.link.main();
									} else {
										location.href = $('#redirectUrl').val()
									}
								} else {
									common.link.main();
								}
							} else {
								common.hideLoadingBar();
								common.layerAlert(res.message);
							}
						}
						, true);
			}
		});
		
	},
	
	mobileFocusout : function() {
		common.checkVaild("#inputFormMobile", function() {
			var ret = {
				result : true,
				resultMsg : ""
			};
			if($('#mobile').is('[readonly]')) {
				return ret;
			}
			if (common.isEmpty($('#mobile').val())) {
				return ret;
			}
			
			var mobileNo = $('#mobile').val().replace(/-/gi, "");
			if(mobileNo.substring(0,3) == '+86') {
				mobileNo = mobileNo.substring(3, mobileNo.length);
			}
			if (mobileNo) {
				if (mobileNo.length < 11) {
					ret.result = false;
					ret.resultMsg = _notFormatMobile;
				} else {
					if(!common.isMobile(mobileNo)) {
				    	ret.result = false;
						ret.resultMsg = _notAbleMobile;
				    }
				}
			}
			$('#mobile').val(mobileNo.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
		    return ret;
		});
	},
	
};
