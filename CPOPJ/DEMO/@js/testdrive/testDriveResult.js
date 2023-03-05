$.namespace("testDrive.result");
testDrive.result = {
		department : null,

		mapInited : false,
		map : null,

		// 초기화
		init : function(departmentId, reservationId){
			// 지점상세 팝업 레이어 초기화
			this.initDepartmentPopup();

			// 이벤트 바인딩
			this.bindEvent();

			// 지점정보 조회
			this.initDepartment(departmentId);

			// 지도
			this.initMap();
			
			//공유하기 팝업 초기화
			var url = _baseUrl + "testdrive/viewTestDriveResult.do?reservationId=" + reservationId;
			common.sns.init(_testDriveResultTitle, url);  //공유문구, 공유URL
			
			//연락처 표기룰 적용
			var _mobile = $("#contents > div > article > div.list > div.listQuoteInfo.testRideCompleted > ul > li:nth-child(3) > span");
			_mobile.text(_mobile.text().replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));

		},

		// 이벤트 바인딩
		bindEvent : function(){
			var that = this;

			// 지점상세보기 팝업 버튼 클릭
			$("#btnDepartmentDetail").on("click", function(event) {
				that.viewDepartment();
			});

			// 지점상세보기 팝업 닫기 클릭
		    $('.wrap').on('click','.layer-pop .btn-close',function(){
		        $(this).closest('.layer-pop').removeClass('open');
		        $('html').removeClass('layerPopOpen');
		    });

			$("#btnPrint").on("click", function(event) {
				window.print();
			});

			$("#btnShare").on("click", function(event) {
				common.sns.openSnsSharePopup();
			});

			$("#btnBuildAndPrice").on("click", function(event) {
				//common.link.configModel();
				common.link.subMain();
			});

			$("#btnOneToOne").on("click", function(event) {
				common.link.moveConsultForm();
			});

			$("#btnBookingHistory").on("click", function(event) {
				common.link.moveMyTestDriveList();
			});

			// 지도 확대 버튼 클릭
			$(".btn-mapPlus").on("click", function() {
				that.btnMapPlusClicked(that.map);
			});

			// 지도 축소 버튼 클릭
			$(".btn-mapMinus").on("click", function() {
				that.btnMapMinusClicked(that.map);
			});

		},

		// 지점상세 layer 초기화
		initDepartmentPopup : function() {
			// 지점상세 layer 삽입
			var source = $("#departmemtPopup-template").html();
			var template = Handlebars.compile(source);
			var html = template({});
			$(".wrap").append(html);
		},

		// 지점 조회
		initDepartment : function(departmentId) {
		    var parameter = {
		    		departmentId : departmentId,
		        };
		    common.Ajax.sendJSONRequest(
		    		"GET"
		    	   ,_baseUrl + "testdrive/getDepartment.do"
		    	   ,parameter
		    	   ,this.initDepartmentCallback
		    );
		},

		// 지점 조회 callback
		initDepartmentCallback : function(res) {
			// 오류처리
			if (!(res.resultCode) && res.resultCode !== '0000') {
				console.log(res.resultMessage ? res.resultMessage : 'System error occured.');
				return;
			}

			testDrive.result.department = res.data;
		},

		// 지점상세 layer popup
		viewDepartment : function() {
			var department = this.department;
			if (department == null ) {
				return ; // initDepartment 오류발생. 지점상세 팝업 처리 불가.
			}
			var departmentInfo = '<strong>' + trim(department.name) + '</strong>';
			departmentInfo += '<p>' + trim(department.addr1) + ' ' + trim(department.addr2) + '</p>';
			departmentInfo += '<strong class="tel">' + trim(department.telNo) + "</strong>";
			$("#layer-departmentInfo").html(departmentInfo);

			var departmentDirections = '<li>'+_directions+' : ' + trim(department.directions) + '</li>';
			$("#layer-departmentDirections").html(departmentDirections);

			layerPopOpen('layerPop-centerInfo');

			// 지도 위치 표시
			if (!this.mapInited) {
				this.init3Map();
			}
			var ggPoint = new BMap.Point(department.baiduLgtd, department.baiduLttd);
			this.map.setCenter(ggPoint);

		},

		initMap : function() {
			// map 생성 초기화
			this.map = new BMap.Map("map-container3");
			this.map.enableScrollWheelZoom();

			// 현위치 중심 지정
			var ggPoint = new BMap.Point(0, 0);
			this.map.centerAndZoom(ggPoint, 16);

		},

		// map 화면 최초 노출 시 초기화 처리
		//   - map hide() 상태에서 일부 초기화가 정상처리되지 않는다.
		init3Map : function() {
			var that  = this;
			that.mapInited = true;
			var timer = setInterval(function() {
				clearInterval(timer);
				// 지점 마커 표시
				var department = that.department;
				that.addMarker(department);
			}, 100);
		},

		addMarker : function(department){
			var point = new BMap.Point(department.baiduLgtd,department.baiduLttd);

			var myLabel = new BMap.Label("<span class='makerA on' id='marker_' style='top:calc(50% + -18px);left:calc(50% + -15px)'>1</span>",
				    {offset:new BMap.Size(0,0),
				    position:point});

			this.map.addOverlay(myLabel);
		},

		btnMapPlusClicked : function(map) {
			map.zoomIn();
		},

		btnMapMinusClicked : function(map) {
			map.zoomOut();
		},

};

