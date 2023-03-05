$.namespace("mypage.testdrive");
mypage.testdrive = {

		//페이징 인덱스
		pageIdx : 0,
		// 기획서에 50 ==> 5로 변경
		rowsPerPage : 5,

		reservationData : {
			member : {},
			reservationList : [],
		},

		totalCount : 0,
		currentCount : 0,

		loading : false,
		cancellingReservationId : null,

		// 초기화
		init : function(){
			this.reservationData.member = member;

			//이벤트 바인딩
			this.bindEvent();

			// Handlebars helper 추가
			common.handlebars.addHandlebarsHelper();
			this.addHandlebarsHelper();

			// 시승신청 Count
			this.getReservationCount();

			// 시승신청 조회
			this.getReservationList();

		},

		bindEvent : function(){
			var that = this;

			// 추가 데이터 조회
		    $("#btnViewMore").on("click", function() {
	    		if (!that.loading && that.totalCount > that.currentCount) {
		    		console.log("next page");
		    		that.getReservationList();
	    		}
		    });
		    
		    
		    $("#contsArea").on("click", ".btnCancel", function() {
		    	var message = _cancelAlert;
		    	// confirm 후 cancel.
		    	common.layerConfirm(message, that.cancelReservation, $(this).attr("data-id"));
		    });

			// 시승목록의 .dropUp 버튼
			$("#contsArea").on("click", ".dropbtn", function() {
				$(this).next('.dropup-content').toggleClass('active');
			});

			// 시승안내 팝업
			$("#btnTestDriveInformation").on("click", function(event) {
				layerPopOpen('layerPop-testDriveInformation');
			});

			// 시승안내 팝업 닫기
			$("#btnInfoClose").on("click", function(event) {
				layerPopClose('layerPop-testDriveInformation');
			});

			// 시승안내팝업 탭 클릭
			$(".swiper-slide").on("click", function() {
				$(".swiper-slide").removeClass("on");
				$(this).addClass("on");
			});

			// 시승신청
			$("#btnTestDriveForm,#btnTestDriveForm2").on("click", function(event) {
				common.link.testDriveForm();
			});

			// 차량 구성
		    $("#contsArea").on("click", ".btnConfigModel", function() {
		    	//common.link.configModel();
		    	common.link.subMain();
		    });

			// 1:1문의
		    $("#contsArea").on("click", ".btnMoveConsultForm", function() {
		    	common.link.moveConsultForm();
		    });

		},

		// 시승신청 목록 Count
		getReservationCount : function() {
		    var parameter = {};
		    common.Ajax.sendJSONRequest(
		    		"GET"
		    	   ,_baseUrl + "/mypage/testdrive/getReservationCount.do"
		    	   ,parameter
		    	   ,this.getReservationCountCallback
		    	   ,true
		    	   ,true
		    );
		},

		// 시승신청 목록 Count callback
		getReservationCountCallback : function(res) {
			// 오류처리
			if (!(res.resultCode) && res.resultCode !== '0000') {
				console.log(res.resultMessage ? res.resultMessage : 'System error occured.');
				return;
			}
			
			mypage.testdrive.totalCount = res.data;
			$("#totalCount").html(mypage.testdrive.totalCount+'');
			// no data 영역 표시
			if (mypage.testdrive.totalCount === 0) {
				$("#contsArea").hide();
				$("#noData").show();
			}

		},

		// 시승신청 목록 페이징 조회
		getReservationList : function() {
			this.loading = true;
			this.pageIdx ++;
		    var parameter = {
		    		pageIdx : this.pageIdx,
		    		rowsPerPage : this.rowsPerPage,
		        };
		    common.Ajax.sendJSONRequest(
		    		"GET"
		    	   ,_baseUrl + "/mypage/testdrive/getReservationList.do"
		    	   ,parameter
		    	   ,this.getReservationListCallback
		    );
		},

		// 시승신청 목록 페이징 조회 callback
		getReservationListCallback : function(res) {
			// 오류처리
			if (!(res.resultCode) && res.resultCode !== '0000') {
				console.log(res.resultMessage ? res.resultMessage : 'System error occured.');
				mypage.testdrive.loading = false;
				return;
			}

			mypage.testdrive.reservationData.reservationList = res.data;
			if (res.data) {
				var source = $("#reservationList-template").html();
				var template = Handlebars.compile(source);
				var html = template(mypage.testdrive.reservationData);
				$("#afterListArea").before(html);
				mypage.testdrive.currentCount += mypage.testdrive.reservationData.reservationList.length;
			}
			else {

			}
			mypage.testdrive.loading = false;
			// 더보기 버튼 show/hide 제어
			if (mypage.testdrive.totalCount > mypage.testdrive.currentCount) {
				$("#btnViewMore").show();
			}
			else {
				$("#btnViewMore").hide();
			}
		},

		// handlebar helper 등록
		addHandlebarsHelper : function() {
			Handlebars.registerHelper('formatDate', function(date) {
				return moment(date).format('YYYY-MM-DD');
			});

			Handlebars.registerHelper('formatDtime', function(date) {
				return moment(date).format('YYYY-MM-DD HH:mm:ss');
			});

			Handlebars.registerHelper('formatMobile', function(mobile) {
				if (!mobile) {
					return '';
				}
				return mobile.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
			});

			Handlebars.registerHelper('getTestDriveType', function(visitLctn) {
				if (visitLctn === 'Showroom') {
					return _retailerTestDrive;
				}
				else {
					return _conciergeTestDrive;
				}
			});

			Handlebars.registerHelper('getTestDriveDtime', function(reservationRequestDtime, scheduledPickUpDtime) {
				var date = typeof scheduledPickUpDtime === 'undefined' || scheduledPickUpDtime === null ? reservationRequestDtime : scheduledPickUpDtime;
				return moment(date).format('YYYY-MM-DD');
			});

			Handlebars.registerHelper('showCancelBtn', function(gosStatus) {
				if (gosStatus === 'complete' || gosStatus === 'cancel') {
					return 'none';
				}
				else {
					return '';
				}
			});

			Handlebars.registerHelper('getGosStatusMl', function(gosStatus) {
				if (gosStatus === 'wait') {
					return _gosStatusWait;
				}
				else if (gosStatus === 'confirm') {
					return _gosStatusConfirm;
				}
				else if (gosStatus === 'complete') {
					return _gosStatusComplete;
				}
				else if (gosStatus === 'cancel') {
					return _gosStatusCancel;
				}
				else {
					return '';
				}
			});

			Handlebars.registerHelper('getGosStatusClass', function(gosStatus) {
				if (gosStatus === 'wait') {
					return 'pending';
				}
				else if (gosStatus === 'confirm') {
					return 'confirmed';
				}
				else if (gosStatus === 'complete') {
					return 'completed';
				}
				else if (gosStatus === 'cancel') {
					return 'cancelled';
				}
				else {
					return '';
				}
			});


		},

		// 시승신청 취소
		cancelReservation : function(reservationId) {
			console.log('cancelReservation: ' + reservationId);

			// TODO 상태체크
			mypage.testdrive.cancellingReservationId = reservationId; // callback에서 사용하기 위해 임시저장.
			var parameter = {
					reservationId : reservationId,
		        };
		    common.Ajax.sendJSONRequest(
		    		"POST"
		    	   ,_baseUrl + "/mypage/testdrive/cancelReservation.do"
		    	   ,parameter
		    	   ,mypage.testdrive.cancelReservationCallback
		    );
		},

		// 시승신청 취소 결과
		cancelReservationCallback : function(res) {
			// 오류처리
			if (!(res.resultCode) && res.resultCode !== '0000') {
				console.log(res.resultMessage ? res.resultMessage : 'System error occured.');
				mypage.testdrive.loading = false;
				return;
			}

			common.layerAlert(_cancelCompletedAlert);

			// 취소 후 처리. 상태값 취소로 변경. 취소버튼 숨김처리.
			$(".vehicleList a[data-id="+mypage.testdrive.cancellingReservationId+"]").closest(".vehicleList").find(".testState").text(_gosStatusCancel);
			$(".vehicleList a[data-id="+mypage.testdrive.cancellingReservationId+"]").hide();

		},

};
