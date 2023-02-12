$.namespace("testDrive.form");
testDrive.form = {
		//
		// 공통 테이터
		//
		stepStarted : {
			"step1": false,
			"step2": false,
			"step3": false,
			"step4": false,
		},
		stepCompleted : {
			"step1": false,
			"step2": false,
			"step3": false,
			"step4": false,
		},
		currentStep : 'step1',
		stepTitleClickEventCleared : false,

		// 초기화
		init : function(){
			// 이벤트 바인딩
			this.bindEvent();
			// 화면 초기화
			$(".contsArea .title > em").hide();
		},

		// 이벤트 바인딩
		bindEvent : function(){
			var that = this;

			//---------------------------------------
			// 공통 Event
			//---------------------------------------
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

			// 시승예약조회
			$("#btnBookingHistory").on("click", function(event) {
				common.link.moveMyTestDriveList();
			});
			
			// Unbind publish/common.js 클릭 이벤트
			//$('[class ^= list-dropdown]>.cont>ul>li>a').off('click');
			$(document).off('click','[class ^= list-dropdown] .cont>ul>li>.title');

			// Step title 클릭
			$(".list-dropdown-a > .cont > ul > li > .title").on("click", function() {
				that.stepTitleClick($(this));
			});

		},

		//---------------------------------------
		// 공통 Function
		//---------------------------------------
		// 현재 스텝 변경
		changeCurrentStep : function(step) {
			this.currentStep = step;
			console.log("currentStep: " + this.currentStep);
		},

		// Next 버튼 클릭
		btnNextClick : function() {
			if (!this.stepTitleClickEventCleared) {
				// Unbind publish/common.js 클릭 이벤트
				$(document).off('click','[class ^= list-dropdown] .cont>ul>li>.title');
				this.stepTitleClickEventCleared = true;
			}
			var $currentOn = $(".list-dropdown-a > .cont > ul > li.on");
			$currentOn.removeClass("on");
			$currentOn.next().addClass("on");
			// current step 설정
			this.changeCurrentStep($currentOn.next().attr("id"));
			testDrive.form.stepStarted[$currentOn.next().attr("id")] = true;
			
			// 타이틀 위치로 스크롤
			objScrollTop($currentOn.next().find(".title"));
		},

		// Step title 클릭
		stepTitleClick : function(element) {
			// 입력 미완료된 탭은 열 수 없다.
			if (!this.stepStarted[element.closest('li').attr("id")]) {
				return false;
			}
			if(element.closest('li').hasClass('on')){
				element.closest('li').removeClass('on');
			}else{
				element.closest('[class ^= list-dropdown]').find('>.cont>ul>li').removeClass('on');
				element.closest('li').addClass('on');
			}
			// current step 설정
			this.changeCurrentStep(element.closest('li').attr("id"));
			
			// 타이틀 위치로 스크롤
			objScrollTop(element);
		},

		toggleEmView : function(element, text) {
			if (text == '') {
				element.hide();
			}
			else {
				element.show();
			}
		}
};
