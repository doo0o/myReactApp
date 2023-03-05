$.namespace("support.fleetForm");
var currentPosition = {};

support.fleetForm = {
	init : function(){
		support.fleetForm.bindEvent();
		support.fleetForm.getCurrentPostion();
	},
	
	bindEvent : function(){
		that = this;
		
		//디폴트 상하이
		currentPosition.latitude = 31.23666814729844;
		currentPosition.longitude = 121.46924309856294;

		//전체동의 체크박스 클릭 
		$("#allCheck").click(function(){  
			if($("#allCheck").prop("checked")) {  
				$("input[name='consent']").prop("checked",true); 
			} else {  
				$("input[name='consent']").prop("checked",false); 
			} 
		});
		
		// 동의 클릭/해제시 전체동의 값 변경 처리
		$(":checkbox[name='consent']").click(function(){ 
			if ( $(this).prop('checked') ) {
				if($("input:checkbox[name='consent']:checked").length == $("input:checkbox[name='consent']").length) {
					$('input:checkbox[id="allCheck"]').prop("checked",true);
				}
			} else {
				if($("input:checkbox[name='consent']:checked").length < $("input:checkbox[name='consent']").length) {
					$('input:checkbox[id="allCheck"]').prop("checked",false);
				}
			} 
		});
		
		$("#cont").on("change focusout", function() {
			var descriptionRet = {
				result : true,
				resultMsg : ""
			};
			common.checkVaild("#inputDescriptionRet", function() {
				$('#cont').css("border","solid 1px #bbb");
				if ($.trim($('#cont').val()) == '') {
					descriptionRet.result = false;
					descriptionRet.resultMsg = _enterContent;
					$('#cont').css("border","solid 1px #ff6662")
				}
				return descriptionRet;
			});
		});
	},
	
	getCurrentPostion : function() {
		var geolocation = new BMap.Geolocation();
		geolocation.getCurrentPosition(function(r){
			if(this.getStatus() == BMAP_STATUS_SUCCESS){
				currentPosition.latitude = r.point.lat;
				currentPosition.longitude =r.point.lng;
			}
			else {
				console.log('failed'+this.getStatus());
			}
			support.fleetForm.searchDepartmentList();
		},{enableHighAccuracy: true})
	},
	
	searchDepartmentList : function(){
		var url = _baseUrl +"support/department/getDepartmentListAjax.do";

	    var params = {
    		searchKeyword 	: '',
    		latitude		: currentPosition.latitude,
    		longitude		: currentPosition.longitude,
 		};
	    common.Ajax.sendJSONRequest("POST", url, params, support.fleetForm.searchDepartmentListJsonCallback);
	},
	
	searchDepartmentListJsonCallback : function(res){
		$('#region').empty();
		if(res.resultCode = '0000') {
			$.each(res.data,function(index,item){
				var option = $("<option value='"+item.name+"'>"+item.name+"</option>");

				$('#region').append(option);
			 });
    	} 
	},
	
	// Fleet 상담 등록
	insertConsult : function(){
		// Input value Validation check
		if(common.account.getCheckValue() && support.fleetForm.checkInputVlaue()) {
			common.layerConfirm(_confirmConsult, function(){
				//CXP 고객정보 처리
				common.showLoadingBar();
				procAccountInfo(support.fleetForm.insertConsultWork);
			});
		}	
	},
	
	insertConsultWork : function(){
		$('input[name="name"]').val($("#lastName").val()+$("#firstName").val());
		$('input[name="phone"]').val($("#countryCode").val()+$("#mobile").val());
		$('input[name="'+_accountNumberName+'"]').val($("#accountNumber").val());
		
		var desc = _region + " : "+$("#region").val()+"\n" +_companyName + " : "+$("#company").val()+"\n"+ _department +" : "+$("#deptName").val()+"\n"
				+ _favoriteModel + " : "+$("#model").val()+"\n"+ _content + " : "+$("#cont").val();	
		
		$('input[name="description"]').val(desc);
		
		if($.trim($('input[name="'+_accountNumberName+'"]').val()) == '') {
			alert(_customerInfoError); //비정상적인 오류가 발생하였습니다.
			return;
		}
		
		var param = {
			consultType : "02"
		}
		common.Ajax.sendRequest(
			"GET"
			, _baseUrl+"api/dih/DIH_CODE_IF_CN_GOS_CXP_WEB_CASE_0001.do"
			, param
			, support.fleetForm.insertConsultJsonCallback
			, false);
	},

	insertConsultJsonCallback : function(res){
		// 정상처리
		if(res && res.resultCode == common._jsonSuccessCd){ //0000
			var $retURL = $("[name='retURL']");
			$retURL.val($retURL.val()+'?linkNo='+res.data.linkNo+'&prgsTime='+res.data.prgsTime+'&consultType=fleet&targetUrl=/support/consult/getFleetForm.do');
			$('#fleetForm').submit();
		}else{ //9999
			common.layerAlert(res.resultMessage); //비정상적인 오류가 발생하였습니다.
			return;
		}
	},
	
	// 입력값 유효성 체크
	checkInputVlaue : function(){
		if($("input:checkbox[name='consent']:checked").length != $("input:checkbox[name='consent']").length) {
			common.layerAlert(_enterConsent);
			return false;
		}
		
		var descriptionRet = {
			result : true,
			resultMsg : ""
		};
		common.checkVaild("#inputDescriptionRet", function() {
			$('#cont').css("border","solid 1px #bbb");
			if ($.trim($('#cont').val()) == '') {
				descriptionRet.result = false;
				descriptionRet.resultMsg = _enterContent;
				$('#cont').css("border","solid 1px #ff6662");
			}
			return descriptionRet;
		});
		
		if (descriptionRet.result) {
			return true;
		}
	},
};