$.namespace("testDrive.form");
$.namespace("testDrive.form4");
testDrive.form4 = {
		// 초기화
		init : function(){
			// 이벤트 바인딩
			this.bindEvent();

			// 로그인된 경우 기본 입력값설정
			this.initFormValue();
		},

		// 이벤트 바인딩
		bindEvent : function(){
			var that = this;

			//---------------------------------------
			// Step4: 신청정보 입력
			//---------------------------------------
			// Step4 완료 여부 체크 및 완료 시 처리
			$("input[name=lastName],input[name=firstName],input[name=email],input[name=mobile]").on("change keyup paste input propertychange", function() {
				// 전체 이름 표시 영역 처리
				if ($(this).attr("name") === "lastName" ||$(this).attr("name") === "firstName") {
					$(".name-result").text($("input[name=lastName]").val() + " " + $("input[name=firstName]").val());
				}
				that.checkStep4Completed();
			});

			$(document).off("click",".inputForm > span").on("click",".inputForm > span", function(){
				// 전체 이름 표시 영역 처리
				$(".name-result").text($("input[name=lastName]").val() + " " + $("input[name=firstName]").val());
				that.checkStep4Completed();
			});

			// 체크박스 agree all --> agree1/2/3 처리
			$("input:checkbox[name=agreeAll]").on("change", function() {
				if ($(this).prop("checked")) {
					$("input:checkbox[name=agree]").prop("checked", true);
				}
				else {
					$("input:checkbox[name=agree]").prop("checked", false);
				}
				that.checkStep4Completed();
			});

			// 체크박스 agree1/2/3 -> agree all 처리
			$("input:checkbox[name=agree]").on("change", function() {
				var checkedAll = true;
				$("input:checkbox[name=agree]").each(function(index, item) {
					if (!$(item).prop("checked")) {
						checkedAll = false;
					}
				});
				if (checkedAll) {
					$("input:checkbox[name=agreeAll]").prop("checked", true);
				}
				else {
					$("input:checkbox[name=agreeAll]").prop("checked", false);
				}
				that.checkStep4Completed();
			});

			// Complete 버튼 클릭 - 스텝완료인 상태에서만 버튼 활성화되어 클릭될 수 있다.
			$(".btnComplete").on("click", function() {
				if (!$("input:checkbox[name=agreeAll]").prop("checked")) {
					common.layerAlert(_notConsent);
					return false;
				}
				
				if (!that.checkStep4Completed()) {
					return false;
				}
				
				// 로딩바 표시
				common.showLoadingBar();

				// 회원/비회원 계정 처리
				if (!common.account.getCheckValue()) {
					return false;
				}
				
				$("#btnComplete").attr("disabled", true);

				procAccountInfo(
						// 계정 처리 후 시승신청 form submit
						that.submitFormAjax);
			});

		},

		//---------------------------------------
		// Step4 Function: 정보입력
		//---------------------------------------
		// Step4 완료 여부 체크 및 완료 시 처리
		checkStep4Completed : function() {
			if ($("input[name='lastName']").val()
				&& $("input[name='email']").val()
				&& $("input[name='mobile']").val()
				//&& $("input:checkbox[name=agreeAll]").prop("checked")
				&& common.account.getCheckValue()) {
				testDrive.form.stepCompleted.step4 = true;
				$("#btnComplete").attr("disabled", false);
				return true;
			}
			$("#btnComplete").attr("disabled", true);
			testDrive.form.stepCompleted.step4 = false;
			return false;
		},

		// 입력정보를 로그인 회원정보로 초기화
		initFormValue : function() {
			// TODO
			// this.checkStep4Completed();
		},

		// 시승신청처리 by Ajax
		submitFormAjax : function() {
			var that = this;
		    var parameter = $("form[name=form1]").serialize();
		    common.Ajax.sendJSONRequest(
		    		"POST"
		    	   ,_baseUrl + "testdrive/makeReservation.do"
		    	   ,parameter
		    	   ,function(res) {
		    		   testDrive.form4.submitFormAjaxCallback(res, testDrive.form4);
		    	   }
		    	   ,true
		    	   ,true
		    );
		},

		// 시승신청처리 by Ajax callback
		submitFormAjaxCallback : function (res, that) {
			// 오류처리
			if (res.resultCode !== '0000') {
				var message;
				if (res.resultCode === "8001") {
					message = _reservationCountAlert;
				}
				else {
					message = res.resultMessage ? res.resultMessage : 'System error occured.';
				}
				console.log(message);
				common.layerAlert(message);
				common.hideLoadingBar();
				
				$("#btnComplete").attr("disabled", false);

				return false;
			}
			
			// 시승신청 성공. 결과페이지로 Replace.
			var reservationId = res.data; // 성공시 결과 데이터는 시승신청 ID
			var resultPage =  _baseUrl + "testdrive/viewTestDriveResult.do?reservationId=" + reservationId;
			location.replace(resultPage);
		},

		reset : function() {
			testDrive.form.stepCompleted.step4 = false;
		},

};

