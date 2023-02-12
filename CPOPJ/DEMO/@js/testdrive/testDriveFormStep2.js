$.namespace("testDrive.form");
$.namespace("testDrive.form2");
$.namespace("testDrive.form3");
testDrive.form2 = {
		// 현위치
		initLatitude : 0.0,
		initLongitude : 0.0,

		// 주소 성/시
		chinaAddrJson : {},

		// 지점 검색결과
		departmentData : {departmentList : []},

		// 지도
		map1 : null,
		map2 : null,
		map3 : null,
		marker1 : null,
		marker2 : null,
		marker3 : null,

		map2Inited : false,
		map3Inited : false,

		// 입력된 주소와 최단거리 지점
		conciergeDepartment : null,
		
		//선택한 주소 정보 저장
		savedAddr : {
			addr1 : null,
			addr2 : null,
			addr3 : null
		},
		
		// 초기화
		init : function(initLatitude, initLongitude){
			var that = this;
			// 현위치
			this.initLatitude = initLatitude;
			this.initLongitude = initLongitude;

			// 팝업 Div 삽입
			this.initDepartmentPopup();

			// 이벤트 바인딩
			this.bindEvent();

			// 지도
			this.initMap();

			// Handlebars helper 추가: inc
			this.addHandlebarsHelper();

			// 지점목록 조회 - step1의 goToNextStep()에서 실행
			// this.searchDepartment(null, true);

			// 방문주소 현위치로 초기화(찾아가는시승 탭)
			this.setAddrByPoint(initLatitude, initLongitude);
			
			// 찾아가는 시승 탭 숨김처리
			if (!hasPreContract) {
				$(".tabsArea02 .tabs").hide();
			}

			$(".list-dropdown-a > .cont > ul > li#step2 > .title").on("click", function() {
				that.savedReset();
			});

		},

		//---------------------------------------
		// 이벤트 바인딩
		//---------------------------------------
		bindEvent : function(){
			var that = this;

			// Step2 Next 버튼 클릭
			$("#btnNextOfStep2-1,#btnNextOfStep2-2").on("click", function(event) {
				that.btnNextOfStep2Clicked();
				//완료 후 해당 스텝 다음 버튼 비활성, 재 오픈 후 다른 항목 다시 선택할 경우 활성화됨.
				$("#btnNextOfStep2-1").attr("disabled", true);
				$("#btnNextOfStep2-2").attr("disabled", true);

			});

			// 지도 현재위치 버튼 클릭
			$(".btn-mapCurrentPoint").on("click", function() {
				if ($(this).attr("id") === "btn-mapCurrentPoint1") {
					that.btnMapCurrentPointClicked(that.map1, that.marker1);
				}
				else {
					that.btnMapCurrentPointClicked(that.map2, that.marker2);
				}
			});

			// 지도 확대 버튼 클릭
			$(".btn-mapPlus").on("click", function() {
				var map;
				if ($(this).attr("id") === "btn-mapPlus1") {
					map = that.map1;
				}
				else if ($(this).attr("id") === "btn-mapPlus2") {
					map = that.map2;
				}
				else {
					map = that.map3;
				}
				that.btnMapPlusClicked(map);
			});

			// 지도 축소 버튼 클릭
			$(".btn-mapMinus").on("click", function() {
				var map;
				if ($(this).attr("id") === "btn-mapMinus1") {
					map = that.map1;
				}
				else if ($(this).attr("id") === "btn-mapMinus2") {
					map = that.map2;
				}
				else {
					map = that.map3;
				}
				that.btnMapMinusClicked(map);
			});

			// 검색 버튼 클릭
			$("#btnSearchDepartment").on("click", function() {
				that.searchDepartment($("input[name=searchKeyword]").val(), false);
				// 하위단계 reset
				testDrive.form3.reset();
			});

			// 지점 선택
			$("#departmentList").on("click", "ul>li", function() {
				that.selectDepartment($(this));
				// 하위단계 reset
				testDrive.form3.reset();
			});

			// 방문시승 탭 클릭
			$("#retailerTab").on("click", function() {
				// 시승유형 값 설정
				$("input[name=visitLocation]").val("Showroom");

				// 하위단계 reset
				testDrive.form3.reset();
			});

			// 찾아가는시승 탭 클릭
			$("#conciergeTab").on("click", function() {
				// map2 최초 화면 노출 시 초기화 처리
				//   - map hide() 상태에서 일부 초기화가 정상처리되지 않는다.
				if (!that.map2Inited) {
					that.initMap2();
				}

				// 시승유형 값 설정
				$("input[name=visitLocation]").val("Valet");

				// 하위단계 reset
				testDrive.form3.reset();

			});

			// 주소-성 select 변경 시 주소-시 select 갱신 후 주소로 마커 이동 후 시승가능여부 체크
			$("#chinaAddr1").change(function(){
				that.changeChinaAddr(); // 주소2(시) select 생성  
				setTimeout(function() {
								that.checkLocationByAddr();
								that.updateAddr1(); // addr1 입력값 갱신 == chinaAddr1 + chinaAddr2
							}, 100);

				// 하위단계 reset
				testDrive.form3.reset();
			});

			// 주소-시 변경이나 상세 입력 시 주소로 마커 이동 후 시승가능여부 체크
			$("select[name=chinaAddr2], input[name=addr2]").on("change", function() {
				that.checkLocationByAddr();
				that.updateAddr1();

				// 하위단계 reset
				testDrive.form3.reset();
			});

			// 지점상세보기 팝업 버튼 클릭
			$("#departmentList").on("click", ".btn-more", function() {
				that.viewDepartment($(this).attr("id"));
			});

			// 지점상세보기 팝업 닫기 클릭
		    $('.wrap').on('click','.layer-pop .btn-close',function(){
		        $(this).closest('.layer-pop').removeClass('open');
		        $('html').removeClass('layerPopOpen');
		    });


		},

		//---------------------------------------
		// Step2 Function: 시승유형선택
		//---------------------------------------
		// Step2 완료 여부 체크 및 완료 시 처리
		checkStep2Completed : function() {
			if ($("input[name='visitLocation']").val() === 'Showroom') { // 방문시승
				if ($("input[name='retailerDepartmentId']").val() != '') {
					$("#btnNextOfStep2-1").attr("disabled", false);
					return true;
				}
				else {
					$("#btnNextOfStep2-1").attr("disabled", true);
					return false;
				}
			}
			else if ($("input[name='visitLocation']").val() === 'Valet') { // 찾아가는 시승
				if ($("#chinaAddr1").val() != ''
						&& $("#chinaAddr2").val() != ''
						&& this.conciergeDepartment != null) {
					$("#btnNextOfStep2-2").attr("disabled", false);
					return true;
				}
				else {
					$("#btnNextOfStep2-2").attr("disabled", true);
					return false;
				}
			}
			else {
				// 발생할 수 없는 케이스임
				return false;
			}
		},

		// Step2 Next 버튼 클릭 - 스텝완료인 상태에서만 버튼 활성화되어 클릭될 수 있다.
		btnNextOfStep2Clicked: function() {
			if (!this.checkStep2Completed()) {
				return false;
			}

			if ($("input[name='visitLocation']").val() === 'Showroom') { // 방문시승
				if ($("input[name='retailerDepartmentId']").val() != '') {
					$("input[name='departmentId']").val($("input[name='retailerDepartmentId']").val());
					testDrive.form.stepCompleted.step2 = true;
				} else {
					testDrive.form.stepCompleted.step2 = false;
					return false;
				}

				// 타이틀 값 설정
				$("#step2Em").html(_retailer);
				testDrive.form.toggleEmView($("#step2Em"), _retailer); // 제목줄의 vertical bar(|) show/hide 제어

			} else if ($("input[name='visitLocation']").val() === 'Valet') { // 찾아가는 시승
				if ($("#chinaAddr1").val() != ''
						&& $("#chinaAddr2").val() != ''
						&& this.conciergeDepartment != null) {
					this.savedAddr.addr1 = $("#chinaAddr1 option:selected").val();
					this.savedAddr.addr2 = $("#chinaAddr2 option:selected").val();
					this.savedAddr.addr3 = $("input[name='addr2']").val();
					
					$("input[name='address']").val($("#chinaAddr1 option:selected").text() + $("#chinaAddr2 option:selected").text() + $("input[name='addr2']").val());
					$("input[name='conciergeDepartmentId']").val(this.conciergeDepartment.departmentId);
					$("input[name='departmentId']").val($("input[name='conciergeDepartmentId']").val());
					testDrive.form.stepCompleted.step2 = true;
				} else {
					testDrive.form.stepCompleted.step2 = false;
					return false;
				}
				
				// 타이틀 값 설정
				$("#step2Em").html(_concierge);
				testDrive.form.toggleEmView($("#step2Em"), _concierge); // 제목줄의 vertical bar(|) show/hide 제어
				
			} else {
				testDrive.form.stepCompleted.step2 = false;
				return false;
			}
			
			// 시승 테이터 조회
			var model = $("input[name='model']").val();
			var visitLocation = $("input[name='visitLocation']").val();
			var departmentId = $("input[name='departmentId']").val();
			var startYearMonth = moment().format('YYYYMM');
			var endYearMonth = moment().add(3,'months').format('YYYYMM'); // *** 4개월간(이번달 이후 3개월)의 일정 조회. 4개월 이후 예약 불가 처리됨. ***
			testDrive.form3.getTestDriveScheduleList(model, visitLocation, departmentId, startYearMonth, endYearMonth);
			testDrive.form3.getTestDriveCourseList(departmentId);

			testDrive.form.btnNextClick();
			
			// 하위단계 reset
			testDrive.form3.reset();

		},

		initMap : function() {
			// map1 생성 초기화
			this.createMap1();

			// map2 생성 초기화
			this.map2 = new BMap.Map("map-container2");
			//this.map2.enableScrollWheelZoom();

			// 현위치 중심 지정
			var ggPoint = new BMap.Point(this.initLongitude, this.initLatitude);
			this.map2.centerAndZoom(ggPoint, 16);

			// map3 생성 초기화
			this.map3 = new BMap.Map("map-container3");
			//this.map3.enableScrollWheelZoom();

			// 현위치 중심 지정
			var ggPoint = new BMap.Point(this.initLongitude, this.initLatitude);
			this.map3.centerAndZoom(ggPoint, 16);

		},

		createMap1 : function() {
			// map1 생성 초기화
			this.map1 = new BMap.Map("map-container1");
			//this.map1.enableScrollWheelZoom();

			// 현위치 중심 지정
			var ggPoint = new BMap.Point(this.initLongitude, this.initLatitude);
			this.map1.centerAndZoom(ggPoint, 16);

			// 현위치에 마커 생성
			this.marker1 = new BMap.Marker(ggPoint);
			this.map1.addOverlay(this.marker1);
		},

		// map2 화면 최초 노출 시 초기화 처리
		//   - map hide() 상태에서 일부 초기화가 정상처리되지 않는다.
		initMap2 : function() {
			var that  = this;
			that.map2Inited = true;
			setTimeout(function() {
				// 현위치 중심 지정
				var ggPoint = new BMap.Point(that.initLongitude, that.initLatitude);
				that.map2.centerAndZoom(ggPoint, 16);

				// 현위치에 마커 생성
				that.marker2 = new BMap.Marker(ggPoint);
				that.map2.addOverlay(that.marker2);
				that.marker2.enableDragging();
				// 현위치 마커에 안내문구 레이블 추가
				var label = new BMap.Label(_markerInfo,{offset:new BMap.Size(20,-10)});
				that.marker2.setLabel(label);

				// 마커 이동시 이동된 주소 획득/표시
				that.marker2.addEventListener("dragend",function() {
					var myGeo = new BMap.Geocoder();
					myGeo.getLocation(new BMap.Point(that.marker2.point.lng, that.marker2.point.lat), function(result){
						that.setAddrByGeoResult(result);
					});
				});

				// 시승가능지역 여부 체크
		        that.checkLocation();

			}, 100);
		},

		// map3 화면 최초 노출 시 초기화 처리
		//   - map hide() 상태에서 일부 초기화가 정상처리되지 않는다.
		initMap3 : function() {
			var that  = this;
			that.map3Inited = true;
			var timer = setInterval(function() {
				clearInterval(timer);
				// 지점 마커 표시
				for (var i = 0; i < testDrive.form2.departmentData.departmentList.length; i++) {
					var department = testDrive.form2.departmentData.departmentList[i];
					that.addMarker(testDrive.form2.map3, department, department.testDriveModelList,i+1, " on markerPopup", false);
				}

			}, 100);
		},


		// 지도 중심을 최초 중심으로 이동
		btnMapCurrentPointClicked : function(map, marker) {
			var ggPoint = new BMap.Point(this.initLongitude, this.initLatitude);
			map.setCenter(ggPoint);
	        marker.setPosition(ggPoint);
	        this.checkLocation();
		},

		btnMapPlusClicked : function(map) {
			map.zoomIn();
		},

		btnMapMinusClicked : function(map) {
			map.zoomOut();
		},

		// 지점 검색
		searchDepartment : function(searchKeyword, noLoadingBar) {
		    var parameter = {
		    		model : $("input[name='model']").val(),
		    		latitude : this.initLatitude,
		    		longitude : this.initLongitude,
		    		searchKeyword : searchKeyword,
		    		isTestDriveCenter : true,
		        };
		    common.Ajax.sendJSONRequest(
		    		"GET"
		    	   ,_baseUrl + "testdrive/searchDepartment.do"
		    	   ,parameter
		    	   ,this.searchDepartmentCallback
		    	   ,true
		    	   ,noLoadingBar
		    );
		},

		// 지점 검색 callback
		searchDepartmentCallback : function(res) {
			// 오류처리
			if (!(res.resultCode) && res.resultCode !== '0000') {
				console.log(res.resultMessage ? res.resultMessage : 'System error occured.');
				return;
			}

			// 지도 재생성
			testDrive.form2.createMap1();

			testDrive.form2.departmentData.departmentList = res.data;
			if (res.data) {
				var source = $("#departmemtList-template").html();
				var template = Handlebars.compile(source);
				var html = template(testDrive.form2.departmentData);
				$("#departmentList").html(html);
				$("#departmentListLength").html(testDrive.form2.departmentData.departmentList.length);

				for (var i = 0; i < testDrive.form2.departmentData.departmentList.length; i++) {
					var department = testDrive.form2.departmentData.departmentList[i];
					// 사용자정의 표시 추가
					if(i == 0) {
						testDrive.form2.addMarker(testDrive.form2.map1, department, department.testDriveModelList, i+1, " on", true);
					} else {
						testDrive.form2.addMarker(testDrive.form2.map1, department, department.testDriveModelList, i+1, "", true);
					}
				}
			}
			else {
				$("#departmentListLength").html("0");
			}

			// 현재 위치로 이동
			testDrive.form2.btnMapCurrentPointClicked(testDrive.form2.map1, testDrive.form2.marker1);

			// 지점 정보 초기화
			$("input[name=retailerDepartmentId]").val("");
		},

		// handlebar helper 등록
		addHandlebarsHelper : function() {
			Handlebars.registerHelper('inc', function(number) {
				return number +1;
			});
		},

		// 지점 선택
		selectDepartment : function(departmentLi) {
			// 라디오 checked 처리
			$("input[name=departmentIdRadio]").prop("checked", false);
			departmentLi.find("input[name=departmentIdRadio]").prop("checked", true);

			// departmemtId input 설정
			var departmentId = $("input[name=departmentIdRadio]:checked").val();
			$("input[name=retailerDepartmentId]").val(departmentId);

			// 맵 중앙을 선택된 부서 위치로 변경
			var department = null;
			for (var i = 0; i < this.departmentData.departmentList.length; i++) {
				var departmentTemp = this.departmentData.departmentList[i];
				if (departmentTemp.departmentId === departmentId) {
					department = departmentTemp;
					break;
				}
			}
			
			var ggPoint = new BMap.Point(department.baiduLgtd, department.baiduLttd);
			this.map1.setCenter(ggPoint);

			// 마커 선택 처리
			$(".makerA").removeClass("on");
			$(".markerPopup").addClass("on");
			$("#marker_" + (this.departmentData.departmentList.indexOf(department) +1)).addClass("on");

			// Step2 완료 여부 체크 및 완료 시 처리
			this.checkStep2Completed();
		},

		// 찾아가는 시승 거리 조회
		// 지점 검색
		checkLocation : function() {
			$("#checkMessage").html(""); // 확인중 메시지
			$("#checkMessage").show();
		    var parameter = {
		    		model : $("input[name='model']").val(),
		    		addr1Cd : $("#chinaAddr1").val(),
		    		addr2Cd : $("#chinaAddr2").val(),
		        };
		    common.Ajax.sendJSONRequest(
		    		"GET"
		    	   ,_baseUrl + "testdrive/getConciergeDepartment.do"
		    	   ,parameter
		    	   ,this.checkLocationCallback
		    	   ,true
		    	   ,true
		    );
		},

		// 찾아가는 시승 거리 조회 callback
		checkLocationCallback : function(res) {
			var okMessage = _checkLocationOk;
			var nokMessage = _checkLocationNok;

			// 오류처리
			if (!(res.resultCode) && res.resultCode !== '0000') {
				console.log(res.resultMessage ? res.resultMessage : 'System error occured.');
				testDrive.form2.conciergeDepartment = null;
				testDrive.form2.viewCheckMessage(nokMessage); // 오류 메시지. 기본 시승불가 처리
				// Step2 완료 여부 체크 및 완료 시 처리
				testDrive.form2.checkStep2Completed();
				return;
			}

			testDrive.form2.conciergeDepartment = res.data;
			if (res.data != null) {
				testDrive.form2.viewCheckMessage(okMessage); // 시승가능.
			}
			else {
				testDrive.form2.viewCheckMessage(nokMessage); // 지점 없는 경우 메시지. 시승불가.
			}

			// Step2 완료 여부 체크 및 완료 시 처리
			testDrive.form2.checkStep2Completed();
		},

		// 지점상세 layer 초기화
		initDepartmentPopup : function() {
			// 지점상세 layer 삽입
			var source = $("#departmemtPopup-template").html();
			var template = Handlebars.compile(source);
			var html = template({});
			$(".wrap").append(html);
		},

		// 지점상세 layer popup
		viewDepartment : function(departmentId) {
			var department = null;
			for (var i = 0; i < this.departmentData.departmentList.length; i++) {
				var departmentTemp = this.departmentData.departmentList[i];
				if (departmentTemp.departmentId === departmentId) {
					department = departmentTemp;
					break;
				}
			}
			var departmentInfo = '<strong>' + trim(department.name) + '<em>(' + department.distance + 'km)</em></strong>';
			departmentInfo += '<p>' + trim(department.addr1) + ' ' + trim(department.addr2) + '</p>';
			departmentInfo += '<strong class="tel">' + trim(department.telNo) + "</strong>";
			$("#layer-departmentInfo").html(departmentInfo);

			var departmentDirections = '<li>'+_directions+' : ' + trim(department.directions) + '</li>';
			$("#layer-departmentDirections").html(departmentDirections);

			layerPopOpen('layerPop-centerInfo');

			// 지도 위치 표시
			if (!this.map3Inited) {
				this.initMap3();
			}
			var ggPoint = new BMap.Point(department.baiduLgtd, department.baiduLttd);
			this.map3.setCenter(ggPoint);

		},

		addMarker : function(map, department, modelList, num, classType, hasInfoWindow){
			var point = new BMap.Point(department.baiduLgtd,department.baiduLttd);

			var myLabel = new BMap.Label("<span class='makerA"+classType+"' id='marker_"+num+"' style='top:calc(50% + -18px);left:calc(50% + -15px)'>"+num+"</span>",
				    {offset:new BMap.Size(0,0),
				    position:point});

			map.addOverlay(myLabel);

		    var sCont = '<div>'
		    		  + '<strong style="font-size:1rem;font-weight: 400;color: #141414;";>'+trim(department.name)+'<em style="color: #a3684f;margin-left: 5px;font-weight: 300;">'+department.distance+'km</em></strong>'
		    		  + '<p style="margin-top: 5px;color:#6f6f6f;font-size: 0.875rem;font-family:"GenesisSans";font-weight: 500;line-height: 1.3em;">'+trim(department.addr1)+' '+trim(department.addr2)+'</p>'
		    		  + '<span style="display:block;margin-top: 5px;font-family:"GenesisSans";font-size: 0.875rem;font-weight: 400;color: #141414;">'+trim(department.telNo)+'</span>'
		    		  + '<span class="tag-wrap-carInfo">';
		    if(modelList != undefined && modelList.length > 0) {
				modelList.forEach(function(element) {
					sCont += '					<span>'+element.model+'</span>';
				});
			}
		    	sCont +='</span>'
			    		  + '<span><a href="javascript:testDrive.form2.viewDepartment(\''+department.departmentId+'\')" style="position: absolute;right: 20px;bottom: 10px;" class="btn-more">'+_viewMore+'</a></span>'
		    		  + '</div>';

		    var opts = {
		    	      width: 420,
		    	      title: '',
		    	      enableMessage: false
		    	    };

		    // mpa1 마커는 클릭 시 정보창 띄우고, map3 마커는 정보창 띄지 않는다.
    		if (hasInfoWindow) {
			    var infoWindow = new BMap.InfoWindow(sCont, opts);

			    myLabel.addEventListener("click", function(){
			        map.openInfoWindow(infoWindow, point);
			    });
    		}
		},

		// 주소1(성) 변경 시 처리 - 주소2(시) select box 생성
		changeChinaAddr : function(){
			var cd = $("select[name=chinaAddr1]").val();
			var chinaAddr2List = this.chinaAddrJson[cd];

			if(chinaAddr2List != undefined && chinaAddr2List != null && chinaAddr2List.length > 0){
				$("select[name=chinaAddr2]").html("");

				var optionStr = "";
				optionStr+="<option value=''> "+_city+"</option>"
				for(var i=0; i<chinaAddr2List.length; i++){
					var chinaAddr2 = chinaAddr2List[i];
					optionStr+="<option value='"+chinaAddr2.cd+"'>"+chinaAddr2.cdNm+"</option>"
				}

				$("select[name=chinaAddr2]").html(optionStr);
			}

			// 상세주소 영역 초기화
			$("input[name=addr2]").val("");

		},

		// 위도/경도로 주소 select 값 설정
		setAddrByPoint : function(lat, lng) {
			var that = this;
			var myGeo = new BMap.Geocoder();
			myGeo.getLocation(new BMap.Point(lng, lat), function(result){
				that.setAddrByGeoResult(result)
			});
		},

		setAddrByGeoResult : function(result) {
			var that = this;
		    if (result){
		    	that.searchChinaAddr1ByText(result.addressComponents.province);
		    	setTimeout(function (){
		    		that.searchChinaAddr2ByText(result.addressComponents.city);
		    		$("input[name=addr2").val(result.addressComponents.district + result.addressComponents.town + result.addressComponents.street + result.addressComponents.streetNumber);
					that.updateAddr1();
			        that.checkLocation();
		    	}, 50);
		    }
		},

		// text로 chinaAddr1 선택
		searchChinaAddr1ByText : function(text) {
			var opts = $("select[name=chinaAddr1] option");

			var selectedIndex = 0;
			opts.each(function(index) {
				if (text.indexOf($(this).text()) >= 0) {
					selectedIndex = index;
				}
			});
			$("select[name=chinaAddr1] option").eq(selectedIndex).prop("selected", true);

			// chinaAddr1 변경시의 처리 호출
			this.changeChinaAddr();
		},

		// text로 chinaAddr2 선택
		searchChinaAddr2ByText : function(text) {
			var opts = $("select[name=chinaAddr2] option");

			var selectedIndex = 0;
			opts.each(function(index) {
				if (text.indexOf($(this).text()) >= 0) {
					selectedIndex = index;
				}
			});
			$("select[name=chinaAddr2] option").eq(selectedIndex).prop("selected", true);

		},

		// 주소입력값에 대해 시승가능여부 체크
		checkLocationByAddr : function(isSavedReset) {
			var that = this;
			var chinaAddr1 = $("#chinaAddr1").val() =='' ? '' : $("#chinaAddr1 option:selected").text();
			var chinaAddr2 = $("#chinaAddr2").val() =='' ? '' : $("#chinaAddr2 option:selected").text();
			var addr;
			if (chinaAddr2.indexOf(chinaAddr1) > -1) {
				addr = chinaAddr2 +$("input[name=addr2]").val(); // 주소 중복 제거 처리: 北京北京市 ==> 北京市, 上海上海市 ==> 上海市 처리. 
			}
			else {
				addr = chinaAddr1 + chinaAddr2 +$("input[name=addr2]").val();
			}
			console.log("change: " + addr);
			that.conciergeDepartment = null;
	    	//저장된 지역 
			if (isSavedReset != true) {
	    		that.checkLocation();
	    	}
			if (addr != '') {
				var myGeo = new BMap.Geocoder();
				myGeo.getPoint(addr, function(point){
				    if (point && that.marker2 != null) {
				    	that.map2.setCenter(point);
				    	that.marker2.setPosition(point);
				    }
				    else {
				    	that.checkStep2Completed();
				    }
				 });
			}
		},

		// addr1 갱신: chinaAddr1 + chinaAddr2
		updateAddr1 : function() {
			var chinaAddr1 = $("#chinaAddr1").val() =='' ? '' : $("#chinaAddr1 option:selected").text();
			var chinaAddr2 = $("#chinaAddr2").val() =='' ? '' : $("#chinaAddr2 option:selected").text();
			$("input[name=addr1]").val(chinaAddr1+chinaAddr2);
		},

		//snackbar
		viewCheckMessage : function(message) {
			$("#checkMessage").html(message); // 메시지.
			$("#checkMessage").show(); // 메시지 영역 표시
    		setTimeout(function(){ $("#checkMessage").hide(); }, 3000); // 메시지 영역 표시 3초 후 숨김.
		},

		reset : function() {
			testDrive.form.stepCompleted.step2 = false;
			// 타이틀 값 리셋
			$("#step2Em").html("");
			testDrive.form.toggleEmView($("#step2Em"), ''); // 제목줄의 vertical bar(|) show/hide 제어

			// 하위단계도 reset
			testDrive.form3.reset();
		},

		savedReset : function() {
			if ($("input[name='visitLocation']").val() === 'Showroom') { // 방문시승
				$("#retailerTab").click();
				
				if ($("input[name='retailerDepartmentId']").val() == '') {
					return;
				}
				
				$("input[name='departmentIdRadio'][value='" + $("input[name='departmentId']").val() + "']").click();
				$("#btnNextOfStep2-1").attr("disabled", true);
				
			} else if ($("input[name='visitLocation']").val() === 'Valet') { // 찾아가는 시승
				$("#conciergeTab").click();
				
				if ($("#chinaAddr1").val() == ''
					|| $("#chinaAddr2").val() == ''
					|| this.conciergeDepartment == null) {
					return;
				}
				
				//TODO
				$("#chinaAddr1").val(this.savedAddr.addr1);
				$("#chinaAddr2").val(this.savedAddr.addr2);
				$("input[name='addr2']").val(this.savedAddr.addr3);
				
				this.checkLocationByAddr(true);
				
				$("#btnNextOfStep2-2").attr("disabled", true);
				
			}
		}

};

