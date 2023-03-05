$.namespace("support.department.departmentList");
var map;
var divMap;
var defaultZoomSize = 16;
var infoWindowArray = [];
var currentPosition = {};
var departmentId = '';
var divMapSeq;
support.department.departmentList = {
	init : function(){
		support.department.departmentList.bindEvent();
		support.department.departmentList.loadMap();
		support.department.departmentList.getCurrentPostion(true);	//현재위치 조회후 지점 목록 조회
	},

	bindEvent : function(){
		that = this;
		
		//디폴트 상하이
		currentPosition.latitude = 31.23666814729844;
		currentPosition.longitude = 121.46924309856294;
		
		//s: 20191105 수정 (swiper 메뉴로 변경 script 추가)
        var tab_retailerInfo = new Swiper('#tab-retailerInfo',{slidesPerView: 'auto',freeMode:true,observer: true,observeParents: true});
        //e: 20191105 수정 (swiper 메뉴로 변경 script 추가)

		// 검색
		$("#btn_search").on("click", function(event) {
			support.department.departmentList.searchDepartmentList();
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
		
		
		$("#searchKeyword").on("keydown", function(key) {
			if ($(this).val()) {
				if (key.keyCode == 13) {
					support.department.departmentList.searchDepartmentList();
				}
			}
		});
		
	},

	searchDepartmentList : function(){
		var url = _baseUrl +"support/department/getDepartmentListAjax.do";

	    var params = {
    		searchKeyword 	: $("#searchKeyword").val(),
    		latitude		: currentPosition.latitude,
    		longitude		: currentPosition.longitude,
 		};
	    common.Ajax.sendJSONRequest("POST", url, params, support.department.departmentList.searchDepartmentListJsonCallback);
	},

	searchDepartmentListJsonCallback : function(res){
		var htmlStr = '';
		var totalCountStr = '0';

		$("#btn_search").prop("disabled", true);
		support.department.departmentList.clearPoint();

		if(res.resultCode == '0000') {
			totalCountStr = res.data.length;
    		if(res.data.length == 0) {
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
	    				support.department.departmentList.addMarker(item, modelList,index+1, " on");
						support.department.departmentList.movePosition(item.baiduLgtd,item.baiduLttd, false);
					} else {
						support.department.departmentList.addMarker(item, modelList,index+1, "");
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
			support.department.departmentList.movePosition($(this).data('longitude'),$(this).data('latitude'), false);
			$('.makerA').removeClass('on');
			$("#marker_"+$(this).data('seq')).addClass('on');
			support.department.departmentList.closeInfowindow();
		});
	},

	addMarker : function(department, modelList, num, classType){
		var point = new BMap.Point(department.baiduLgtd,department.baiduLttd);

		var myLabel = new BMap.Label("<span class='makerA"+classType+"' id='marker_"+num+"' style='top:calc(50% + -30px);left:calc(50% + -15px)'>"+num+"</span>",     //为lable填写内容
			    {offset:new BMap.Size(0,0),
				position:point});
		map.addOverlay(myLabel);

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
    		  + '<a href="javascript:support.department.departmentList.openPopup(\'layerPop-retailerInfo\',\''+department.departmentId+'\',\''+num+'\')" style="position: absolute;right: 20px;bottom: 30px;" class="btn-more">'+_btnMore+'</a>'
    		  + '<a href="javascript:support.department.departmentList.closeInfowindow();" class="btn-close" style="position: absolute;right: 16px;top: 20px;width: 22px;height: 22px;background: url('+_imgUrl+'/common/pc/ico_close2.png) no-repeat 0 0;">닫기</a>'
    		  + '</div>';

	    var opts = {
	    	      width: 520,
	    	      enableMessage: false,
	    	    };
	    
	   
	    var infoWindow = new BMap.InfoWindow(sCont, opts);
	    myLabel.addEventListener("click", function(){
	    	support.department.departmentList.closeInfowindow();
	    	 $(".BMap_pop>img").hide();
	    	map.openInfoWindow(infoWindow, point);
			infoWindowArray.push(infoWindow);
	    });
	},
	
	//Infowindow 닫기
	closeInfowindow : function(){
		if (infoWindowArray.length > 0) {
			infoWindowArray[0].close();
			infoWindowArray.length = 0;
		}
		$(".BMap_pop>img").show();
	},
	
	loadMap : function(){
	    map = new BMap.Map("allmap",{mapType:BMAP_NORMAL_MAP});
	    map.enableScrollWheelZoom();

	    // TODO
	    var point = new BMap.Point(0,0);
	    map.centerAndZoom(point, defaultZoomSize);
	},

	getCurrentPostion : function(flag) {
		var geolocation = new BMap.Geolocation();
		geolocation.getCurrentPosition(function(r){
			if(this.getStatus() == BMAP_STATUS_SUCCESS){
				currentPosition.latitude = r.point.lat;
				currentPosition.longitude =r.point.lng;
			}
			else {
				console.log('failed'+this.getStatus());
			}
			if(flag) {
				support.department.departmentList.searchDepartmentList();
			}
		},{enableHighAccuracy: true})
	},

	goCurrentPoint : function() {
		support.department.departmentList.getCurrentPostion();

		support.department.departmentList.movePosition(currentPosition.longitude,currentPosition.latitude, true);
	},

	movePosition : function(longitude, latitude, flag){
		var currentPoint = new BMap.Point(longitude, latitude);
		map.centerAndZoom(currentPoint, defaultZoomSize);
		//현재위치 표시
		if(flag) {
//			$('.makerA').removeClass('on');
			$('input[name="radioDept"]').prop('checked', false); 

			// 기존 현재위치 표시를 지우고 다시 표시
		    var allOverlay = map.getOverlays();
		    for (var i = 0; i < allOverlay.length; i++){
		    	if(allOverlay[i].content != undefined && allOverlay[i].content.indexOf('currentMarker') != -1) {
		    		map.removeOverlay(allOverlay[i]);
		    	}
		    }
			var currentLabel = new BMap.Label("<span class='makerA-currentPoint' id='currentMarker' style='top:calc(50% + -20px);left:calc(50% + -15px)'></span>",     //为lable填写内容
				    {offset:new BMap.Size(0,0),
					position:currentPoint});
			map.addOverlay(currentLabel);
		}
	},

	zoomPlus : function(){
		map.zoomTo(map.getZoom() + 1);
	},

	zoomMinus : function(){
		map.zoomTo(map.getZoom() - 1);
	},

	clearPoint : function(){
		map.clearOverlays();
//	    var allOverlay = map.getOverlays();
//	    for (var i = 0; i < allOverlay.length; i++){
//	    	map.removeOverlay(allOverlay[i]);
//	    }
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
	    support.department.departmentList.getDepartmentInfo();
	},

	getDepartmentInfo : function(){
		var url = _baseUrl +"support/department/getDepartmentDetailAjax.do";

	    var params = {
	    	departmentId 	: this.departmentId,
	    	latitude		: currentPosition.latitude,
    		longitude		: currentPosition.longitude,
 		};
	    common.Ajax.sendJSONRequest("POST", url, params, support.department.departmentList.getDepartmentInfoJsonCallback,true);
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
			support.department.departmentList.loadDivMap(res.data.baiduLgtd,res.data.baiduLttd);
    	} else {
    		// TODO
    		console.log(res.resultMessage);
    	}
	},

	loadDivMap : function(longitude,latitude){
	    divMap = new BMap.Map("divMap");
	    divMap.enableScrollWheelZoom();

	    var point = new BMap.Point(longitude,latitude);
	    divMap.centerAndZoom(point, 15);

	    var myLabel = new BMap.Label("<span class='makerA on' style='top:calc(50% + -30px);left:calc(50% + -15px)'>"+divMapSeq+"</span>",    
			    {offset:new BMap.Size(0,0),
				position:point});
	    divMap.addOverlay(myLabel);
	},

	divZoomPlus : function(){
		divMap.zoomTo(divMap.getZoom() + 1);
	},

	divZoomMinus : function(){
		divMap.zoomTo(divMap.getZoom() - 1);
	},

	getDisplayVhclDetail : function(){
		var url = _baseUrl +"support/department/getDisplayVhclDetailAjax.do";

		var params = {
	    	departmentId : this.departmentId,
 		};
	    common.Ajax.sendJSONRequest("POST", url, params, support.department.departmentList.getDisplayVhclDetailJsonCallback,true);
	},

	getDisplayVhclDetailJsonCallback : function(res){
		var htmlStr = '';
		$("#divCont").html('');
		if(res.resultCode == '0000') {
			if(res.data.length == 0) {
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
	    common.Ajax.sendJSONRequest("POST", url, params, support.department.departmentList.getTestVhclDetailJsonCallback,true);
	},

	getTestVhclDetailJsonCallback : function(res){
		var htmlStr = '';
		$("#divCont").html('');
		if(res.resultCode == '0000') {
			if(res.data.length == 0) {
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
	    common.Ajax.sendJSONRequest("POST", url, params, support.department.departmentList.getButlerDetailJsonCallback,true);
	},

	getButlerDetailJsonCallback : function(res){
		var htmlStr = '';
		$("#divCont").html('');
		if(res.resultCode == '0000') {
			if(res.data.length == 0) {
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
