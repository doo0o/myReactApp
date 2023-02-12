$.namespace("testDrive.form");
$.namespace("testDrive.form1");
$.namespace("testDrive.form2");
testDrive.form1 = {
		// 초기화
		init : function(modelSelected){
			// 이벤트 바인딩
			this.bindEvent();
			// 시승신청화면 진입 시 기본선택된 모델값이 있을 경우의 처리
			if (modelSelected != '') {
				this.selectInitModel(modelSelected);
			}
			
			testDrive.form.stepStarted.step1 = true;
		},

		// 이벤트 바인딩
		bindEvent : function(){
			var that = this;

			// 모델 이미지 클릭
			$(".modelSelect .thumb").on("click", function() {
				console.log("model selected: " + $(this).attr("data-model"));
				that.checkStep1Completed(this);
			});

			// Step1 Next 버튼 클릭
			$("#btnNextOfStep1").on("click", function(event) {
				that.selectModel($("input[type='radio'][name='r1']:checked").closest("label").find("span").data("model"));
				that.btnNextOfStep1Clicked();
				//완료 후 해당 스텝 다음 버튼 비활성, 재 오픈 후 다른 항목 다시 선택할 경우 활성화됨.
				$("#btnNextOfStep1").attr("disabled", true);
				
			});

			$(".list-dropdown-a > .cont > ul > li#step1 > .title").on("click", function() {
				that.savedReset();
			});
		},

		//---------------------------------------
		// Step1 Function
		//---------------------------------------
		// 모델선택 처리
		selectModel : function(model) {
			// 하위단계 reset 여부 판단 
			if ($("input[name='model']").val() !== model) {
				testDrive.form2.reset();
			}
			// 모델선택 처리
			$("input[name='model']").val(model);
			$("#step1Em").text(model);
			testDrive.form.toggleEmView($("#step1Em"), model); // 제목줄의 vertical bar(|) show/hide 제어
		},

		// 모델선택. 시승신청화면 진입 시 기본선택된 모델값이 있을 경우의 처리
		selectInitModel : function(model) {
			console.log("selectModel: " + model);
			$(".modelSelect .thumb").each(function() {
				if ($(this).attr("data-model") === model) {
					$(this).trigger("click");
				}
			});
		},

		// Step1 완료 여부 체크 및 완료 시 처리
		checkStep1Completed : function(obj) {
			if (obj == undefined || obj == null) {
				obj = $("input[type='radio'][name='r1']:checked");
			} else {
				obj = $(obj);
			}
			
			if (obj.length > 0) {
				testDrive.form.stepCompleted.step1 = true;
				$("#btnNextOfStep1").attr("disabled", false);
				return true;
			}
			testDrive.form.stepCompleted.step1 = false;
			$("#btnNextOfStep1").attr("disabled", true);
			return false;
		},

		// Step1 Next 버튼 클릭 - 스텝완료인 상태에서만 버튼 활성화되어 클릭될 수 있다.
		btnNextOfStep1Clicked: function() {
			if (!this.checkStep1Completed()) {
				return false;
			}
			common.layerAlert(_ageAlert, testDrive.form1.goToNextStep);
		},

		goToNextStep : function() {
			testDrive.form.btnNextClick();

			// 지점목록 조회
			testDrive.form2.searchDepartment(null, false);

			// 방문주소 현위치로 초기화(찾아가는시승 탭)
			testDrive.form2.setAddrByPoint(testDrive.form2.initLatitude, testDrive.form2.initLongitude);

			$("#retailerTab").trigger("click");

		},

		savedReset : function() {
			//선택된게 없을 경우 리턴
			if ($("input[name='model']").val() == "") {
				return;
			}
			
			$("span[data-model='" + $("input[name='model']").val() + "']").closest("label").find("input[type='radio']").prop("checked", true);
			$("#btnNextOfStep1").attr("disabled", true);
		}
};

