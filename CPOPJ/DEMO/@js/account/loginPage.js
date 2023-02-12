$.namespace("account.loginPage");
account.loginPage = {
	emailChk : "N",
		
	init : function(){
		account.loginPage.bindEvent();
		
		//비밀번호
		$("#contents > div > div.loginBox > article > div > ul > li:nth-child(2)").hide();
		//인증요청 요청버튼
		$("#contents > div > div.loginBox > article > div > ul > li:nth-child(1) > a").hide();
		//인증요청 입력
		$("#contents > div > div.loginBox > article > div > ul > li:nth-child(3)").hide();
		//인증번호 확인
		$("#contents > div > div.loginBox > article > div > ul > li:nth-child(3) > div > a").attr("disabled", true);
		//이름 영역
		$("#contents > div > div.loginBox > article > div > ul > li:nth-child(4)").hide();
		//연락처 영역
		$("#contents > div > div.loginBox > article > div > ul > li:nth-child(5)").hide();
	},
	
	bindEvent : function(){
		
		//이메일 초기화
		$("#inputFormEmail > span").click(function(key) {
			$("#email").attr("readonly",false).attr("disabled",false);
			
			$("#contents > div > div.loginBox > div > div > a").attr("disabled", true);
			$("#inputFormPassword").removeClass("error");
			$("#contents > div > div.loginBox > article > div > ul > li:nth-child(2) > div > em").text("");
			
			$("#contents > div > div.loginBox > article > div > ul > li:nth-child(2)").hide(); //비밀번호
			$("#contents > div > div.loginBox > article > div > ul > li:nth-child(1) > a").hide(); //인증요청 요청버튼
			$("#contents > div > div.loginBox > article > div > ul > li:nth-child(3)").hide(); //인증요청 입력
			$("#contents > div > div.loginBox > article > div > ul > li:nth-child(3) > div > a").attr("disabled", true); //인증번호 확인
            
			account.loginPage.emailChk = "N";
		});
		
		//이메일 이벤트
		$("#email").on("change focusout", function() {
			if (account.loginPage.emailChk == "Y") return;
			
			var ret = {
				result : true,
				resultMsg : ""
			};
			common.checkVaild("#inputFormEmail", function() {
				if ($.trim($('#email').val()) == '') {
					ret.result = false;
					ret.resultMsg = _enterEmail;
					return ret;
				}
				if(!common.isEmail($.trim($('#email').val()))) {
					ret.result = false;
					ret.resultMsg = _notFormatEmail;
					return ret;
			    }
				if (ret) {
					//통합회원 여부 체크
			    	var params = {
			    		email : $.trim($('#email').val()),
			   		};
			    	
			    	account.loginPage.emailChk = "Y";
			    	common.account.getGaMemberChk(params, function(res) {
			    	    if (res.code == "0000") { //성공
			    	        if (res.gsOptIn) {
			    	        	console.log("통합회원");
			    	        	$("#email").attr("readonly",true).attr("disabled",true);		// 이메일 비활성화
			    	        	$("#contents > div > div.loginBox > article > div > ul > li:nth-child(2)").show(); //비밀번호
			    	        	$("#contents > div > div.loginBox > article > div > ul > li:nth-child(1) > a").hide(); //인증번호 요청버튼
			    	        	
			    	        	$('#gaPassword').focus();
			    	        	$('#memberCode').val("1");
			    	        } else {
			    	            console.log("비회원");
			    	            $("#email").attr("readonly",true).attr("disabled",true);
			    	            $("#contents > div > div.loginBox > article > div > ul > li:nth-child(2)").hide(); //비밀번호
			    	            $("#contents > div > div.loginBox > article > div > ul > li:nth-child(1) > a").show(); //인증번호 요청버튼

			    	            $("#contents > div > div.loginBox > article > div > ul > li:nth-child(1) > a").focus();
			    	            $('#memberCode').val("0");
			    	        }
			    	        $("#email").val($.trim($("#email").val()));
			    	    } else {
			    			ret.result = false;
			    			ret.resultMsg = res.message;
			    			common.showVaildMsg("#inputFormEmail", ret);
			    			account.loginPage.emailChk = "N";
			    			
			    			$("#contents > div > div.loginBox > div > div > a").focus();
			    			$('#memberCode').val("");
			    	    }
			    	});
				}
				return ret;
			});
			
			//비밀번호 초기화
			$("#inputFormPassword > span").click(function(key) {
				$("#inputFormPassword").removeClass("error");
				$("#contents > div > div.loginBox > article > div > ul > li:nth-child(2) > div > em").text("");
				
				$("#contents > div > div.loginBox > div > div > a").attr("disabled", true);
			});
			
			//통합회원 패스워드 입력
			$(document).off("change paste keyup","#gaPassword").on("change paste keyup","#gaPassword", function(e){
				if ($(this).val()) {
					$("#contents > div > div.loginBox > div > div > a").attr("disabled", false);
					if (e.keyCode == 13) {
						$("#contents > div > div.loginBox > div > div > a").click();
					}
				} else {
					$("#contents > div > div.loginBox > div > div > a").attr("disabled", true);
				}
		    });
			
			//로그인 (통합회원 비밀번호 확인 / 비회원 로그인)
			$("#contents > div > div.loginBox > div > div > a").click(function() {
				if ($('#memberCode').val() == "1") {
					common.checkVaild("#inputFormPassword", function() {
						var ret = {
							result : true,
							resultMsg : ""
						};
						if (!$("#gaPassword").val()) {
							ret.result = false;
							ret.resultMsg = _notPassword;
							return ret;
						}
						if (ret.result) {
							var param ={
								email : $("#email").val(),
								password : $("#gaPassword").val()
							};
							common.account.getGsMemberLoginAjax(param, function(res) {
								if (res.code == "0000") { //성공
									$('#header').find('.navRight').find('.login').text(_msg_logout);
									_isLogin = true;
									
									if ($('#redirectUrl').val()) {
										if ($('#redirectUrl').val().indexOf("loginPage.do") > -1 || $('#redirectUrl').val().indexOf("nonMemberLogin.do") > -1 || $('#redirectUrl').val().indexOf("main.do") > -1) {
											common.link.moveMyPageMain();
										} else {
											location.href = $('#redirectUrl').val()
										}
									} else {
										common.link.moveMyPageMain();
									}
								} else if (res.code == "1125") {
									//common.layerConfirm(
									account.loginPage.layerConfirm(
											"통합회원으로 가입이 완료되지 않은 이메일입니다.<br>통합회원 사이트에서 인증을 완료하신 후 로그인하시거나<br>이메일 인증을 통해 비회원으로 서비스를 이용하시기 바랍니다.<br><br>통합회원 사이트에서 인증을 진행하시겠습니까?"
											, common.link.moveMemberLoginForm
											);
								} else if (res.code == "9003") {
									//서비스 가입  페이지 이동
									common.link.moveMemberSignForm();
								} else { //오류
									common.checkVaild("#inputFormPassword", function() {
										var passRet = {
											result : true,
											resultMsg : ""
										};
										passRet.result = false;
										passRet.resultMsg = res.message;
										ret = passRet;
										return passRet;
									});
								}
							});
						}
						return ret;
					});
				} else {
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
							var param = {
									email : $('#email').val(),
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
										if (res.code == "0000") {
											common.hideLoadingBar();
											
											if ($('#redirectUrl').val()) {
												if ($('#redirectUrl').val().indexOf("loginPage.do") > -1 || $('#redirectUrl').val().indexOf("nonMemberLogin.do") > -1 || $('#redirectUrl').val().indexOf("main.do") > -1) {
													common.link.moveMyPageMain();
												} else {
													location.href = $('#redirectUrl').val()
												}
											} else {
												common.link.moveMyPageMain();
											}
										} else {
											common.layerAlert(res.message);
										}
									}
									, true
									, false);
						}
				}
			});
		});

		//인증번호 발급요청
		$("#contents > div > div.loginBox > article > div > ul > li:nth-child(1) > a").click(function() {
			common.checkVaild("#inputFormEmail", function() {
				var ret = {
					result : true,
					resultMsg : ""
				};
				if (common.isEmpty($('#email').val())) {
					$("#email").attr("readonly", false);
					ret.result = false;
					ret.resultMsg = _enterEmail;
					return ret;
				}
				if (ret.result) {
					var param = {
						email : $('#email').val()
				    };
				    common.account.getCertifiNoAjax(param, function(res) {
				        if (res.code == "0000") { //인증번호 발급 성공
				        	$("#email").attr("readonly",true).attr("disabled",true); //이메일 비활성화
				        	$("#contents > div > div.loginBox > article > div > ul > li:nth-child(1) > a").text(_btnResend); //인증번호 발송 문구 변경(->재발송)
				        	$("#contents > div > div.loginBox > article > div > ul > li:nth-child(3)").show(); //인증요청 입력
				        	$("#contents > div > div.loginBox > article > div > ul > li:nth-child(3) > div > a").attr("disabled", false);
				        	
				        	$("#inputFormVerifyOtpNumber > em").text('');

				        	console.log("certifiNo : " + res.certifiNo);
				            $('#verNum').val(""); // 인증번호 입력 id - 초기화
				            $('.timeChk').text("");
				            
				        	if (sessionStorage.getItem("certifiSnd") == "Y") { //인증 발급 재전송구분
				                common.layerAlert(_verificationResend);
				            } else {
				            	common.layerAlert(_verificationSend);
				                sessionStorage.setItem("certifiSnd", "Y");
				            }
							
							clearInterval(common.account.certifTimer);
							common.account.certifiTime = 180;
							common.account.doCertifiTimer();
							
							$("#nonMemberVerification > div > em").text("");
							$("#verNum").focus();
				        } else {
				            common.layerAlert(res.message);
				        }
				    });
				}
				return ret;
			});
		});
		
		$("#verNum").on("keydown", function(key) {
			if ($(this).val()) {
				if (key.keyCode == 13) {
					$("#verifyOtpNumber").click();
				}
			}
		});
		
		//인증번호 확인
		$("#verifyOtpNumber").click(function() {
			common.checkVaild("#inputFormVerifyOtpNumber", function() {
				var ret = {
					result : true,
					resultMsg : ""
				};
				if (!common.isOtp($('#verNum').val())) {
					ret.result = false;
					ret.resultMsg = _verificationNumLength;
					return ret;
				}
				if (ret.result) {
					var param = {
						verNum : $.trim($('#verNum').val()),
						email : $('#email').val()
				    };
					$("#verNum").css("border","solid 1px #bbb");
					common.account.getCertifiChkAjax(param, function(res) {
						$('#verNum').val("");
						common.checkVaild("#inputFormVerifyOtpNumber", function() {
				        	var subret = {
								result : true,
								resultMsg : ""
							};
				        	if (res.code == "0000") {
				        		$('.timeChk').text("");
						        clearInterval(common.account.certifTimer);
						        common.account.certifTimer = null;

						        $("#email").attr("readonly",true).attr("disabled",true);
						        
						        $("#contents > div > div.loginBox > article > div > ul > li:nth-child(1) > a").hide(); //인증요청 요청버튼
						        $("#contents > div > div.loginBox > article > div > ul > li:nth-child(3)").hide(); //인증요청 입력
								$("#contents > div > div.loginBox > article > div > ul > li:nth-child(4)").show(); //이름 영역
								$("#contents > div > div.loginBox > article > div > ul > li:nth-child(5)").show(); //연락처 영역
						        
					    		//인증이 완료 되었습니다.
					    		common.layerAlert(_verificationCompleted);
							} else if (res.code == "9012") {
						        sessionStorage.removeItem("certifiSnd"); //인증 발급 재전송구분
						        
						        $("#verNum").css("border","solid 1px #ff6662")
						        subret.result = false;
						        //인증번호가 일치하지 않습니다.
						        subret.resultMsg = _verificationFailure;
							} else if (res.code == "9011") {
								$('.timeChk').text("");
								clearInterval(common.account.certifTimer);
								common.account.certifTimer = null;
								sessionStorage.removeItem("certifiSnd"); //인증 발급 재전송구분
								
								$('#verifyOtpNumber').attr('disabled', true);
								
								//인증번호가 만료되었습니다. 인증번호를 다시 전송해 주십시오.
								subret.result = false;
								subret.resultMsg = _verificationExpired + "\n" + _verificationRetry;
							} else {
								sessionStorage.removeItem("certifiSnd"); //인증 발급 재전송구분
								
								subret.result = false;
								subret.resultMsg = res.message;
							}
				        	return subret;
				        	ret = subret;
				        });
					});
				}
				return ret;
			});
		});
		
		$(document).off("keyup","#lastName").on("keyup","#lastName", function(e){
			var dInput = $("#lastName").val();
		    $('#viewName').html(dInput+$.trim($("#firstName").val()));
		    
		    if (dInput) {
		    	account.loginPage.loginCheckValue();
		    }
	    });
		$('#inputFormLastName').find("span").click(function(){
			$('#lastName').val("");
			$('#lastName').keyup();
		});

		$(document).off("keyup","#firstName").on("keyup","#firstName", function(e){
			var dInput = $("#firstName").val();
		    $('#viewName').html($.trim($("#lastName").val())+dInput);
	    });
		$('#inputFormFirstName').find("span").click(function(){
			$('#firstName').val("");
			$('#firstName').keyup();
		});
		
		common.vaildNumberOnly("#mobile");
		$("#mobile").on("change focusout keyup ", function(event) {
			var _mobile = $('#mobile').val().replace(/-/gi, "");
			if (event.type == "keyup") {
				if (_mobile.length > 7) {
					$('#mobile').val(_mobile.replace(/(\d{3})(\d{4})/, '$1-$2-'));
				} else if (_mobile.length > 3) {
					$('#mobile').val(_mobile.replace(/(\d{3})/, '$1-'));
				}
			} else {
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
					var mobileNo ='';
					if($('#mobile').val().substring(0,3) == '+86') {
						mobileNo = $('#mobile').val().replace(/-/gi, "").substring(3, $('#mobile').val().length);
					} else {
						mobileNo = $('#mobile').val().replace(/-/gi, "");
					}
				    if(!common.isMobile(mobileNo)) {
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
				    
				    if (ret.result) {
				    	account.loginPage.loginCheckValue();
				    }

				    return ret;
				});
			}
		});
		
		//통합회원가입
		$("#contents > div > div.btnArea > div > a:nth-child(1) > span").click(function(e){
			common.link.moveMemberJoinForm();
		});
		//통합회원아이디찾기
		$("#contents > div > div.btnArea > div > a:nth-child(2) > span").click(function(e){
			common.link.moveMemberFindForm();
		});
		
	},
	
	loginCheckValue : function() {
		if ($('#email').val() && $('#lastName').val() && $('#mobile').val()) {
			$("#contents > div > div.loginBox > div > div > a").attr("disabled", false);
		}
	},
	
	layerConfirm : function(msg, _callback){
    	common._layerConfirmRun = true;

        $('#layerPop-confirm-msg').html(msg);
        layerPopOpen('layerPop-confirm');

        var args = Array.prototype.slice.call(arguments);
        $("#layerPop-confirm-btn-ok").off("click").on("click", function(){
        	if(common._layerConfirmRun){
        		common._layerConfirmRun = false;
        		layerPopClose('layerPop-confirm');
        		$("#email").val("");
        		$("#contents > div > div.loginBox > div > div > a").attr("disabled", true);
        		_callback();
        	}
        });
        $("#layerPop-confirm-btn-cancel").off("click").on("click", function(){
        	$("#email").attr("readonly",true).attr("disabled",true);
            $("#contents > div > div.loginBox > article > div > ul > li:nth-child(2)").hide(); //비밀번호
            $("#contents > div > div.loginBox > article > div > ul > li:nth-child(1) > a").show(); //인증번호 요청버튼

            $("#contents > div > div.loginBox > article > div > ul > li:nth-child(1) > a").focus();
            $('#memberCode').val("0");
            $("#contents > div > div.loginBox > div > div > a").attr("disabled", true);
            $('#gaPassword').val("");
        	if(common._layerConfirmRun){
        		common._layerConfirmRun = false;
        	}
        });
    },
    
};
