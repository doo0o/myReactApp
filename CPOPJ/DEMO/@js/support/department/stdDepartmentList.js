$.namespace("support.department.stdDepartmentList");
var map;
var divMap;
var defaultZoomSize = 16;
var currentPosition = {};
var departmentId = '';
var markersArray = [];
var infoWindowArray = [];
var divMapSeq;
support.department.stdDepartmentList = {
	init : function(){
		support.department.stdDepartmentList.bindEvent();
		support.department.stdDepartmentList.loadMap();
		support.department.stdDepartmentList.getCurrentPostion(true);	//현재위치 조회후 지점 목록 조회
	},
	
	bindEvent : function(){
		that = this;
		//디폴트 상하이
		currentPosition.latitude = 31.230714;
		currentPosition.longitude = 121.462745;
		
		//s: 20191105 수정 (swiper 메뉴로 변경 script 추가)
        var tab_retailerInfo = new Swiper('#tab-retailerInfo',{slidesPerView: 'auto',freeMode:true,observer: true,observeParents: true});
        //e: 20191105 수정 (swiper 메뉴로 변경 script 추가)

		// 검색
		$("#btn_search").on("click", function(event) {	
			support.department.stdDepartmentList.searchDepartmentList();
		});
		
		// layer popup tab
		$('.tab-a li').click(function() {
			$('li').removeClass('on');
			$(this).addClass('on');
		});
		
		Handlebars.registerHelper('seq', function(index) {
		  index++;
		  return index;
		});
		
		Handlebars.registerHelper('displayModelList', function(model) {
			var modelStr = '';
			
			if(common.isEmpty(model)) return modelStr;

			var modelList = model.split(':');
			for(var i=0; i<modelList.length; i++) {
				modelStr +='<span>'+modelList[i]+'</span>'
			}
			return modelStr;
		});
		
		Handlebars.registerHelper('getDetailHours', function(openTime,closeTime) {
			
			var detailHours = '';
			if(openTime != undefined && openTime !='') {
				detailHours = openTime[0].lpad(2,'0')+':'+openTime[1].lpad(2,'0')+' ~ '+closeTime[0].lpad(2,'0')+':'+closeTime[1].lpad(2,'0');
			}
			return detailHours;
		});
		
		Handlebars.registerHelper('formatNumber', function(num) {
			return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
		});

	},
	
	searchDepartmentList : function(){
		var url = _baseUrl +"support/department/getDepartmentListAjax.do";
		
	    var params = {
    		searchKeyword 	: $("#searchKeyword").val(),
    		latitude		: currentPosition.latitude,
    		longitude		: currentPosition.longitude,
 		};
	    common.Ajax.sendJSONRequest("POST", url, params, support.department.stdDepartmentList.searchDepartmentListJsonCallback);
	},
	
	searchDepartmentListJsonCallback : function(res){
		var htmlStr = '';
		var totalCountStr = '0';
		
		$("#btn_search").prop("disabled", true);
		support.department.stdDepartmentList.clearPoint();
		
		if(res.resultCode == '0000') {
			totalCountStr = res.data.length;
    		if(res.data.length ==0) {
    			$("#nonDepartmentList").show();
        		$("#departmentList").hide();
    		} else {
    			$("#nonDepartmentList").hide();
        		$("#departmentList").show();
        		
    			var source = $("#departmentList-template").html();
    			var template = Handlebars.compile(source);
    			htmlStr = template(res.data);
    			
    			$.each(res.data,function(index,item){
    				var modelList;
    				if(item.model != undefined) {
    					modelList = item.model.split(':');
    				}
    				
    				if(index ==0) {
    					support.department.stdDepartmentList.addMarker(item, modelList,index+1, " on");
    					markersArray[0].setIcon(support.department.stdDepartmentList.getMarkerImage(true));
						support.department.stdDepartmentList.movePosition(item.addrLctnLgtd,item.addrLctnLttd,false);
					} else {
						support.department.stdDepartmentList.addMarker(item, modelList,index+1, "");
					}
    			 });
    		}
    		
    		 $('input[name="OptVacantOrOccupied"]:checked').data('value');
    		 
    	} else {
    		$("#nonDepartmentList").show();
    		$("#departmentList").hide();
    	}
		$("#departmentList").html(htmlStr);
		$("#totalCount").html(totalCountStr);
    	$("#btn_search").prop("disabled", false);
    	
    	$('input[name="radioDept"]').change(function(){
			support.department.stdDepartmentList.movePosition($(this).data('longitude'),$(this).data('latitude'),false);

			support.department.stdDepartmentList.changeMarketImg($(this).data('seq'));
		});
	},
	
	changeMarketImg : function(seq){
		support.department.stdDepartmentList.closeInfowindow();
		markersArray.forEach(function(marker,i) {
			if(seq == (i+1)) {
				markersArray[i].setIcon(support.department.stdDepartmentList.getMarkerImage(true));
			} else {
				markersArray[i].setIcon(support.department.stdDepartmentList.getMarkerImage(false));
			}
		}); 
	},
	
	//Infowindow 닫기
	closeInfowindow : function(){
		if (infoWindowArray.length > 0) {
			infoWindowArray[0].close();
			infoWindowArray.length = 0;
		}
	},
	
	// 마커 이미지 생성
	getMarkerImage : function(selFlag){
		var imgUrl = '';
		if(selFlag) {
			imgUrl = _imgUrl+'common/pc/makerA.png';
		} else {
			imgUrl = _imgUrl+'common/pc/makerA-gray.png';
		}
		var image = {
		    url: imgUrl,
		    size: new google.maps.Size(30, 36),
		    origin: new google.maps.Point(0, 0),
		    anchor: new google.maps.Point(0, 32),
		    scaledSize: new google.maps.Size(30, 36)
		};
		return image;
	},
	
	addMarker : function(department, modelList, num, classType){
		var point = new google.maps.LatLng(department.addrLctnLttd, department.addrLctnLgtd); // 좌표값
		var image = support.department.stdDepartmentList.getMarkerImage(false);
		var marker = new google.maps.Marker({
	          position: point,
	          label: {
	              text: num.toString(),
	              color: "#fff",
	              fontSize: "16px",
	              fontWeight: "500",
	              fontFamily:'GenesisSans, wFontKrR, "Malgun Gothic", AppleGothicNeoSD, "Apple SD 산돌고딕 Neo", "Microsoft NeoGothic", "Droid sans", Dotum, 돋움, 굴림, Arial, Verdana, sans-serif' 
	            },
	          icon: image,
	          map: map
	        });
		marker.setMap(map);
		markersArray.push(marker);
		
		var sCont = '<div style="padding: 20px 40px 20px 20px;width: 500px;box-sizing: border-box;background: #fff;">'
  		  + '<strong style="font-size:1rem;font-weight: 400;color: #141414;";>'+$.trim(department.name)+'<em style="color: #141414;margin-left: 5px;font-weight: 300;">('+toCurrencyDecimal(department.distance,1)+'KM)</em></strong>'
  		  + '<p style="margin-top: 5px;color:#6f6f6f;font-size: 0.875rem;font-family:"GenesisSans";font-weight: 500;line-height: 1.3em;">'+$.trim(department.addr1)+' '+$.trim(department.addr2)+'</p>'
  		  + '<span style="display:block;margin-top: 5px;font-family:"GenesisSans";font-size: 0.875rem;font-weight: 400;color: #141414;">'+$.trim(department.telNo)+'</span>'
  		  + '<span class="tag-wrap-carInfo">';
		if(modelList != undefined && modelList.length > 0) {
			modelList.forEach(function(element) {
				sCont += '					<span>'+element+'</span>';
			});
		}
    	sCont +='</span>'
    		  + '<a href="javascript:support.department.stdDepartmentList.openPopup(\'layerPop-retailerInfo\',\''+department.departmentId+'\',\''+num+'\')" style="position: absolute;right: 20px;bottom: 30px;" class="btn-more">'+_btnMore+'</a>'
    		  + '<a href="javascript:support.department.stdDepartmentList.closeInfowindow();" class="btn-close" style="position: absolute;right: 16px;top: 20px;width: 22px;height: 22px;background: url('+_imgUrl+'/common/pc/ico_close2.png) no-repeat 0 0;">닫기</a>'
    		  + '</div>';
		
		var infoWindow = new google.maps.InfoWindow({ 
  			content: sCont, 
  			maxWidth: "520px",
  			disableAutoPan: true,
//  			zIndex: 10
//  			boxStyle: {
//  			    border: "none",
//  			    textAlign: "center",
//  			    fontSize: "12pt",
//  			    background: "white",
//  			    opacity: "0.7",
//  			    padding: "1px"
//  			  },
//  			  disableAutoPan: true,
//  			  pixelOffset: new google.maps.Size(0, -10),
//  			  closeBoxURL: "",
//  			  isHidden: false,
//  			  pane: "mapPane",
//  			  enableEventPropagation: true
  		});
		
		
		google.maps.event.addListener(marker, 'click', function() { // Add a Click Listener to our marker
			support.department.stdDepartmentList.closeInfowindow();	// 기존 Infowindow 창 닫기
  			infoWindow.open(map,marker); 
  			// 구글 기본 닫기 버튼 안보이게 설정
  			google.maps.event.addListener(infoWindow, 'domready', function() {
  				$('.gm-ui-hover-effect').css("display" ,"none");
  	        });
  			infoWindowArray.push(infoWindow);
  		});
		
		
	},
	
	loadMap : function(){
		var point = new google.maps.LatLng(31.23666814729844, 121.46924309856297); // 좌표값
		var mapOptions = { 
			zoom: defaultZoomSize, // // The initial zoom level when your map loads (0-20)
//			minZoom: 6, // Minimum zoom level allowed (0-20)
//			maxZoom: 17, // Maximum soom level allowed (0-20)
			center: point, // Centre the Map to our coordinates variable
			mapTypeId: google.maps.MapTypeId.ROADMAP,	// Set the type of Map
			disableDefaultUI: true,
			gestureHandling: 'greedy'  // touchscreen and mobile devices, to allow users to pan the map (up or down, left or right) when the user swipes (drags on) the screen
//			scrollwheel: true		//  Mouse Scroll zooming (Essential for responsive sites!)
//			zoomControl:true, // Set to true if using zoomControlOptions below, or false to remove all zoom controls.
//			zoomControlOptions: {
//  				style:google.maps.ZoomControlStyle.DEFAULT // Change to SMALL to force just the + and - buttons.
//			},
            /* center: myLatlng,
            mapTypeControl: false,	// Disable Map/Satellite switch
            draggable: false,
            scaleControl: false,	// Set to false to hide scale
//            panControl:false, // Set to false to disable
            scrollwheel: false,
            navigationControl: false, */
            /* streetViewControl: false, */	// Set to disable to hide street view
//			overviewMapControl:false, // Set to false to remove overview control
//			rotateControl:false // Set to false to disable rotate control
		} 
		map = new google.maps.Map(document.getElementById('allmap'), mapOptions); 
		
//		$('.gm-ui-hover-effect').css("display" ,"none");
	},
	
	getCurrentPostion : function(flag) {
		if (navigator.geolocation) { // GPS를 지원하면
			navigator.geolocation.getCurrentPosition(function(position) {
				var latitude = position.coords.latitude;
				var longitude = position.coords.longitude
				currentPosition.latitude = position.coords.latitude;
				currentPosition.longitude = position.coords.longitude;
				if(flag) {
					support.department.stdDepartmentList.searchDepartmentList();
				}
			}, function(error) {
				console.log("error : can't load location info.");
			}, {
				enableHighAccuracy: false,
				maximumAge: 0,
				timeout: Infinity
		    });
		} else {
			console.log("error : does not exists navigator.geolocation obj.");
			if(flag) {
				support.department.stdDepartmentList.searchDepartmentList();
			}
		}
	},
	
	goCurrentPoint : function() {
		support.department.stdDepartmentList.getCurrentPostion();

		support.department.stdDepartmentList.movePosition(currentPosition.longitude,currentPosition.latitude, true);
	},
	
	movePosition : function(longitude, latitude, flag){
		var point = new google.maps.LatLng(latitude,longitude);
		map.setZoom(defaultZoomSize);
		map.setCenter(point);
		
		//현재위치 표시
		if(flag) {
//			$('.makerA').removeClass('on');
			$('input[name="radioDept"]').prop('checked', false);
			
			// 기존 현재위치 표시를 지우고 다시 표시
			for (var i = 0; i < markersArray.length; i++ ) {
				if(markersArray[i].label == undefined) {
					markersArray[i].setMap(null);
					markersArray.pop(markersArray[i]);
		    	}
			}
			var image = {
			    url: _imgUrl+'common/pc/icon_currentPoint.png',
			    size: new google.maps.Size(28, 28),
			    origin: new google.maps.Point(0, 0),
			    anchor: new google.maps.Point(0, 32),
			    scaledSize: new google.maps.Size(28, 28)
			};
			var marker = new google.maps.Marker({
		          position: point,
		          icon: image,
		          map: map
		        });
			marker.setMap(map);
			markersArray.push(marker);
		}
	},
	
	zoomPlus : function(){
		map.setZoom(map.getZoom() + 1);
	},
	
	zoomMinus : function(){
		map.setZoom(map.getZoom() - 1);
	},
	
	clearPoint : function(){
		for (var i = 0; i < markersArray.length; i++ ) {
			markersArray[i].setMap(null);
		}
		markersArray.length = 0;
	},
	
	openPopup : function(id, departmentId, seq){
		//div tab 초기화
		$('.tab-a li').removeClass('on');
		$('.tab-a li').each(function(i){
			if(i ==0) {
				$(this).addClass('on');
			}
		});
		
		$('#'+id).removeClass('fix-center');
		divMapSeq = seq;
		layerPopOpen(id);
	    
	    this.departmentId = departmentId;
	    support.department.stdDepartmentList.getDepartmentInfo();
	},
	
	getDepartmentInfo : function(){
		var url = _baseUrl +"support/department/getDepartmentDetailAjax.do";
		
	    var params = {
	    	departmentId 	: this.departmentId,
	    	latitude		: currentPosition.latitude,
    		longitude		: currentPosition.longitude,
 		};
	    common.Ajax.sendJSONRequest("POST", url, params, support.department.stdDepartmentList.getDepartmentInfoJsonCallback,true);
	},
	
	getDepartmentInfoJsonCallback : function(res){
		var htmlStr = '';
		
		if(res.resultCode == '0000') {
			// 지점 기본정보
			var source = $("#departmentInfo-template").html();
			var template = Handlebars.compile(source);
			htmlStr = template(res.data);
			$("#departmentInfo").html(htmlStr);
			
			// 지점 부가정보
			source = $("#departmentInfoMap-template").html();
			template = Handlebars.compile(source);
			htmlStr = template(res.data);
			$("#divCont").html(htmlStr);
			
			//지도 로딩
			support.department.stdDepartmentList.loadDivMap(res.data.addrLctnLgtd,res.data.addrLctnLttd);
			 
    	} else {
    		// TODO 
    		console.log(res.resultMessage);
    	}
	},
	
	loadDivMap : function(longitude,latitude){
		var point =new google.maps.LatLng(latitude, longitude);
		var mapOptions = { 
			zoom: defaultZoomSize, 
			center: point, 
			mapTypeId: google.maps.MapTypeId.ROADMAP,	
			disableDefaultUI: true,
			gestureHandling: 'greedy'  
		} 
		divMap = new google.maps.Map(document.getElementById('divMap'), mapOptions); 
		
		
		var image = support.department.stdDepartmentList.getMarkerImage(true);
		var marker = new google.maps.Marker({
	          position: point,
	          label: {
	              text: divMapSeq.toString(),
	              color: "#fff",
	              fontSize: "16px",
	              fontWeight: "500",
	              fontFamily:'GenesisSans, wFontKrR, "Malgun Gothic", AppleGothicNeoSD, "Apple SD 산돌고딕 Neo", "Microsoft NeoGothic", "Droid sans", Dotum, 돋움, 굴림, Arial, Verdana, sans-serif' 
	            },
	          icon: image,
	          map: divMap
	        });
		marker.setMap(divMap);
	},
	
	divZoomPlus : function(){
		divMap.setZoom(divMap.getZoom() + 1);
	},
	
	divZoomMinus : function(){
		divMap.setZoom(divMap.getZoom() - 1);
	},
	
	getDisplayVhclDetail : function(){
		var url = _baseUrl +"support/department/getDisplayVhclDetailAjax.do";
		
		var params = {
	    	departmentId : this.departmentId,
 		};
	    common.Ajax.sendJSONRequest("POST", url, params, support.department.stdDepartmentList.getDisplayVhclDetailJsonCallback,true);
	},
	
	getDisplayVhclDetailJsonCallback : function(res){
		var htmlStr = '';
		$("#divCont").html('');
		if(res.resultCode == '0000') {
			if(res.data.length ==0) {
				var source = $("#noData-template").html();
				var template = Handlebars.compile(source);
				var data = { msg: _noDisplayCarMessage };
				htmlStr = template(data);
			} else {
				var source = $("#displayVhcl-template").html();
				var template = Handlebars.compile(source);
				htmlStr = template(res.data);
			}
    	} else {
    		var source = $("#noData-template").html();
			var template = Handlebars.compile(source);
			var data = { msg: res.resultMessage };
			htmlStr = template(data);
    	}
		$("#divCont").html(htmlStr);
		
	},
	
	getTestVhclDetail : function(){
		var url = _baseUrl +"support/department/getTestVhclDetailAjax.do";
		
	    var params = {
	    	departmentId 	: this.departmentId,
 		};
	    common.Ajax.sendJSONRequest("POST", url, params, support.department.stdDepartmentList.getTestVhclDetailJsonCallback,true);
	},
	
	getTestVhclDetailJsonCallback : function(res){
		var htmlStr = '';
		$("#divCont").html('');
		if(res.resultCode == '0000') {
			if(res.data.length ==0) {
				var source = $("#noData-template").html();
				var template = Handlebars.compile(source);
				var data = { msg: _noTestCarMessage };
				htmlStr = template(data);
    		} else {
    			var source = $("#testVhcl-template").html();
				var template = Handlebars.compile(source);
				htmlStr = template(res.data);
    		}
    	} else {
    		var source = $("#noData-template").html();
			var template = Handlebars.compile(source);
			var data = { msg: res.resultMessage };
			htmlStr = template(data);
    	}
		$("#divCont").html(htmlStr);
	},
	
	getButlerDetail : function(){
		var url = _baseUrl +"support/department/getButlerDetailAjax.do";
		
	    var params = {
	    	departmentId 	: this.departmentId,
 		};
	    common.Ajax.sendJSONRequest("POST", url, params, support.department.stdDepartmentList.getButlerDetailJsonCallback,true);
	},
	
	getButlerDetailJsonCallback : function(res){
		var htmlStr = '';
		$("#divCont").html('');
		if(res.resultCode == '0000') {
			if(res.data.length ==0) {
				var source = $("#noData-template").html();
				var template = Handlebars.compile(source);
				var data = { msg: _noButtlerMessage };
				htmlStr = template(data);
    		} else {
    			var source = $("#butler-template").html();
				var template = Handlebars.compile(source);
				htmlStr = template(res.data);
    		}
    	} else {
    		var source = $("#noData-template").html();
			var template = Handlebars.compile(source);
			var data = { msg: res.resultMessage };
			htmlStr = template(data);
    	}
		$("#divCont").html(htmlStr);
	},
};
