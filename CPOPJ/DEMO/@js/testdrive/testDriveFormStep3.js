$.namespace("testDrive.form");
$.namespace("testDrive.form3");
testDrive.form3 = {
		// 선택된 스케줄
		tmpSelectedSchedule : {},
		selectedSchedule : null,

		// 초기화
		init : function(){
			// 시승 스케쥴 달력 표시(dummy)
			//  - 시승 스케쥴 정보 조회 후 실제 스케쥴 달력 표시가 가능하며,
			//    시승 스케쥴 정보는 모델과 지점 선택 후 조회 가능하다.
			this.initDatepicker();

			// 이벤트 바인딩
			this.bindEvent();
		},

		// 이벤트 바인딩
		bindEvent : function(){
			var that = this;

			$("#timeSlot").on("click", "input:radio", function(event) {
				that.timeSlotSelected();
			});

			$("#course").on("change", function(event) {
				that.courseSelected($(this).val());
			});

			// Step3 Next 버튼 클릭
			$("#btnNextOfStep3").on("click", function(event) {
				// 타이틀 텍스트 표시 - 최초 화면표시인 경우(오늘날짜가 선택된 경우)는 표시하지 않는다.
				
//				if (that.tmpSelectedSchedule.yyyymmdd !== moment().format("YYYYMMDD")) {
//					that.setDateAndTimeTitle(that.tmpSelectedSchedule.yyyymmdd, '');
//				}

				// 타이틀 텍스트 표시
				that.setDateAndTimeTitle(that.tmpSelectedSchedule.yyyymmdd, $("input:radio[name=timeSlot]:checked").attr("ds-time"));

				// Step3 선택완료여부 체크
				that.checkStep3Completed();
				
				that.btnNextOfStep3Clicked();
				//완료 후 해당 스텝 다음 버튼 비활성, 재 오픈 후 다른 항목 다시 선택할 경우 활성화됨.
				$("#btnNextOfStep3").attr("disabled", true);
			});

			$(".list-dropdown-a > .cont > ul > li#step3 > .title").on("click", function() {
				that.savedReset();
			});

		},

		//---------------------------------------
		// Step3 Function
		//---------------------------------------
		// 시승 스케쥴 데이터.
		//  - Step2 완료 시 조회해 온다.(모델과 지점이 선택된 후에야 조회가능함)
		scheduleList: [],

		// 시승코스 목록
		//  - Step2 완료 시 조회해 온다.(지점이 선택된 후에야 조회가능함)
		courseList: [],

		// 시승 스케쥴 달력 초기화
		initDatepicker : function() {
			/* create an array of days which need to be disabled */
			$('#datepicker').datepicker({
				beforeShowDay: this.disableAllTheseDays,
				showMonthAfterYear: true,
				dayNamesMin: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'], // 요일의 한글 형식.
				monthNames: [". 01", ". 02", ". 03", ". 04", ". 05", ". 06", ". 07", ". 08", ". 09", ". 10", ". 11", ". 12" ],
				onSelect: this.dateSelected
			});
		},

		// 시승가능여부에 따라 달력 날짜 disable/enable 제어
		disableAllTheseDays : function(date) {
			var that = testDrive.form3;
			var scheduleOfDay = null;
			for (var i = 0; i < that.scheduleList.length; i++) {
				var schedule = that.scheduleList[i];
				if (schedule.yyyymmdd === moment(date).format("YYYYMMDD")) {
					scheduleOfDay = schedule;
					break;
				}
			}
			
			if (scheduleOfDay && scheduleOfDay.isSchedulable) {
				return [true];
			}
			else {
				return [false];
			}
		},

		// 달력에서 날짜선택 시 처리
		dateSelected : function(dateText, inst) {
			var that = testDrive.form3;
			//common.layerAlert("Date selected: " + dateText + ": " + inst);
			var schedule = null;
			for (var i = 0; i < that.scheduleList.length; i++) {
				var scheduleTemp = that.scheduleList[i];
				if (scheduleTemp.yyyymmdd === moment(dateText,"MM-DD-YYYY").format("YYYYMMDD")) {
					schedule = scheduleTemp;
					break;
				}
			}
			that.drawTimeSlotTable(schedule);
			
			that.tmpSelectedSchedule = $.extend(that.tmpSelectedSchedule, schedule);

			that.checkEnableNextBtn();

		},

		//타임슬롯 리스트를 화면에 표시
		drawTimeSlotTable: function(schedule) {
			var html = '';
			var timeSlotList = schedule.timeSlotList;
			var timeSlot;
			var disabledValue;
			for (var i = 0; i < timeSlotList.length; i++) {
				timeSlot = timeSlotList[i];
				disabledValue = (!schedule.isSchedulable || timeSlot.availableCount === 0) ? "disabled" : "";// <radio> disable 처리
				html += '<label class="radio"><input type="radio" name="timeSlot" id="ts-' + timeSlot.startHhmm + '" ds-time="' + timeSlot.startHhmm + '-' + timeSlot.endHhmm + '" value ="' + timeSlot.startHhmm + '" ' + disabledValue + '><span>' + timeSlot.startHhmm + '-' + timeSlot.endHhmm + '</span></label>';
			}

			$("#timeSlot").html(html);

		},

		// 스케줄 정보 목록 조회
		getTestDriveScheduleList : function(model, visitLocation, departmentId, startYearMonth, endYearMonth) {
		    var parameter = {
		    		model : model,
		    		visitLocation : visitLocation,
		    		departmentId : departmentId,
		    		startYearMonth : startYearMonth,
		    		endYearMonth : endYearMonth,
		        };
		    common.Ajax.sendJSONRequest(
		    		"GET"
		    	   ,_baseUrl + "testdrive/getTestDriveScheduleList.do"
		    	   ,parameter
		    	   ,this.getTestDriveScheduleListCallback
		    	   ,true
		    );
		},

		//스케줄 정보 목록 조회 callback
		getTestDriveScheduleListCallback : function (res) {
			var that = testDrive.form3;
			// 오류처리
			if (!(res.resultCode) && res.resultCode !== '0000') {
				console.log(res.resultMessage ? res.resultMessage : 'System error occured.');
				return;
			}

			that.scheduleList = res.data;
			var schedule;
			var dateSchedulable;
			for (var i = 0; i < that.scheduleList.length; i++) {
				schedule = that.scheduleList[i];
				schedule.isSchedulable = that.isDateSchedulable(schedule);
			}

			// 시승요청일자 달력 재표시
			// *** 시승 스케쥴 정보 목록 조회 후 달력을 표시해야 한다.
			// *** 화면초기화 시 dummy로 생성한 datepicker 삭제후 재생성한다.
			$('#datepicker').datepicker("destroy");
			$('#datepicker').removeClass("hasDatepicker");
			that.initDatepicker();

			// timeslot 영역 초기화
			that.dateSelected(moment().format("MM-DD-YYYY"));

		},

		//schedule 정보로 해당날짜가 스케쥴 가능한지 여부 판단한다.
		isDateSchedulable : function (schedule) {
			// 오늘 이전 날짜인지 체크: 오늘 이전 날짜는 예약할 수 없다.
			var todayYyyymmdd = moment().format('YYYYMMDD');
			if (todayYyyymmdd.localeCompare(schedule.yyyymmdd) >= 0) {
				return false;
			}
			// 휴일, 주말 체크:
			if (schedule.absent || !schedule.available) {
				return false;
			}
			// 예약가능한 시간대 체크: 예약안되고 남은 타임슬롯이 있는지 확인한다.
			var timeSlot;
			for(var i = 0; i < schedule.timeSlotList.length; i++) {
				timeSlot = schedule.timeSlotList[i];
				if (timeSlot.availableCount > 0) {
					return true;
				}
			}
			return false;
		},

		// 요청시간 선택 시 처리
		timeSlotSelected : function() {
			var that = testDrive.form3;

			var dateTime = that.tmpSelectedSchedule.yyyymmdd + $("input:radio[name=timeSlot]:checked").val() + "00";
			dateTime = dateTime.replace(":", "");
			$("input[name=reservationRequestDate]").val(dateTime);
			
			that.tmpSelectedSchedule.timeSlot = $("input:radio[name=timeSlot]:checked").val();
			
			that.checkEnableNextBtn();
		},

		// 시승코스 목록 조회
		getTestDriveCourseList : function(departmentId) {
		    var parameter = {
		    		departmentId : departmentId,
		        };
		    common.Ajax.sendJSONRequest(
		    		"GET"
		    	   ,_baseUrl + "testdrive/getTestDriveCourseList.do"
		    	   ,parameter
		    	   ,this.getTestDriveCourseListCallback
		    	   ,true
		    	   ,true
		    );
		},

		// 시승코스 목록 조회 callback
		getTestDriveCourseListCallback : function (res) {
			var that = testDrive.form3;

			// 오류처리
			if (!(res.resultCode) && res.resultCode !== '0000') {
				console.log(res.resultMessage ? res.resultMessage : 'System error occured.');
				return;
			}

			that.courseList = res.data;

			var course;
			var html = '';
			var checkedValue;
			for (var i = 0; i < that.courseList.length; i++) {
				course = that.courseList[i];
				html += '<option value="'+ course.testDriveCourseId +'">'+ course.name +'</option>';
			}
			$("#course").html(html);

			// 시승코스 정보 영역 초기화: 첫번째 시승코스를 시승코스 정보 영역에 표시함.
			that.courseSelected(that.courseList[0].testDriveCourseId);
		},

		// 시승코스 선택 시 처리
		courseSelected : function(id) {
			//alert("Date selected: " + dateText + ": " + inst);
			var course = null;
			for (var i = 0; i < this.courseList.length; i++) {
				var courseTemp = this.courseList[i];
				if (courseTemp.testDriveCourseId === id) {
					course = courseTemp;
					break;
				}
			}
			
			this.drawCourse(course);
			$("input[name=testDriveCourse]").val(course.testDriveCourseId);

			this.tmpSelectedSchedule.testDriveCourse = course.testDriveCourseId;

			this.checkEnableNextBtn();
		},

		// 시승코스 정보 표시
		drawCourse : function (course) {
			var courseInfo = course.name + "<br>"
			               + "Duration : " + course.time + " minutes";
			$("#courseInfo").html(courseInfo);

			var courseImage = course.course;
			$("#courseImage").html(courseImage);
		},

		// Step3 다음버튼 노출 처리
		checkEnableNextBtn : function() {
			if ($("input:radio[name='timeSlot']:checked").val()
				&& $("#course").val()) {
				$("#btnNextOfStep3").attr("disabled", false);
				return;
			}
			$("#btnNextOfStep3").attr("disabled", true);
			return;
		},

		// Step3 완료 여부 체크 및 완료 시 처리
		checkStep3Completed : function() {
			if ($("input:radio[name='timeSlot']:checked").val()
				&& $("#course").val()) {
				testDrive.form.stepCompleted.step3 = true;
				$("#btnNextOfStep3").attr("disabled", false);
				return true;
			}
			$("#btnNextOfStep3").attr("disabled", true);
			testDrive.form.stepCompleted.step3 = false;
			return false;
		},

		// Step3 Next 버튼 클릭 - 스텝완료인 상태에서만 버튼 활성화되어 클릭될 수 있다.
		btnNextOfStep3Clicked: function() {
			if (!this.checkStep3Completed()) {
				return false;
			}
			this.selectedSchedule = this.tmpSelectedSchedule;
			testDrive.form.btnNextClick();
		},

		// Step3 타이틀 문자열 설정
		setDateAndTimeTitle : function(date, hours) {
			var str = ''
			if (hours) {
				str += hours + ", "
			}
			str += moment(date,"YYYYMMDD").format("YYYY-MM-DD");

			$("#step3Em").html(str);
			testDrive.form.toggleEmView($("#step3Em"), str); // 제목줄의 vertical bar(|) show/hide 제어
		},

		reset : function() {
			testDrive.form.stepCompleted.step3 = false;
			// 타이틀 값 리셋
			$("#step3Em").html("");
			testDrive.form.toggleEmView($("#step3Em"), ''); // 제목줄의 vertical bar(|) show/hide 제어
			// 하위단계도 reset
			testDrive.form4.reset();
		},
		
		savedReset : function() {
			//달력복원
			$('#datepicker').datepicker('setDate', new Date(testDrive.form3.selectedSchedule.date[0] + "-" + testDrive.form3.selectedSchedule.date[1] + "-" + testDrive.form3.selectedSchedule.date[2]));
			$(".ui-state-default").removeClass("ui-state-active");
			$(".ui-state-default").each(function() {
				if ($(this).text() == testDrive.form3.selectedSchedule.date[2]) {
					$(this).addClass("ui-state-active");
				}
			});
			//시간복원
			$("input:radio[name=timeSlot][value='" + testDrive.form3.selectedSchedule.timeSlot + "']").prop("checked", true);
			//코스복원
			$("#course").val(testDrive.form3.selectedSchedule.testDriveCourse)
			
			$("#btnNextOfStep3").attr("disabled", true);
		}
};

