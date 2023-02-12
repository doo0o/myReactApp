$.namespace("mypage.contract.cancel.form");
mypage.contract.cancel.form = {
		
	init : function(){
		mypage.contract.cancel.form.getTermDetail();
		mypage.contract.cancel.form.bindEvent();
	},

	bindEvent : function(){
		that = this;

		$(document).off("click","#btn_cntrTer").on("click","#btn_cntrTer", function(){
			mypage.contract.cancel.form.moveContractCancel();
		});
		$(document).off("keyup","#description").on("keyup","#description", function(){
			mypage.contract.cancel.form.lengthCheck();
		});
	},
	/**
	 * 약관 상세 load
	 */
	getTermDetail : function(){
		if(termsUrl == undefined || termsUrl == null || $.trim(termsUrl) == ""){
    		return false;
    	}
    	
    	var termUrl = _baseUrl+$.trim(termsUrl);
    	if(termsUrl.indexOf("/") == 0){
    		termUrl = _baseUrl+$.trim(termsUrl).substring(1, termsUrl.length);
    	}
    	
    	$.ajaxSetup({ statusCode:null });
    	$.ajax({
    		type : "post"
    		,url : termUrl
    		,data : null
    		,async : true
    		,success: function(response){
    			$("#cancelTerm").html(response);
    		}
    		,error	: function (jqXHR,error, errorThrown){
    			console.log(jqXHR);
    			console.log(error);
    			console.log(errorThrown);
    		}
    		,complete : function (){
    			common.Ajax.init();
    		}
    	});
	},
	validateContractCancelParam : function() {
		var $contractId = $("[name='contractId']");
		var $reason = $("[name='reason']");
		var $description = $("textarea[name='description']");//계약취소사유
		var $cntrCancelAgreeYn = $("[name='cntrCancelAgreeYn']");//계약취소약관체크유무

		//if($contractId.val().isEmpty()) {
		//	alert(_contractNumber);
		//	return false;
		//}

		if (common.isEmpty($('#reason').val())){
			common.layerAlert(_reason);
			$('#reason').focus();
			return false;
		}
		//if($cntrCancelRsn.val().isEmpty()) {
		//	alert(_cntrCancelRsn);
		//	$('#cntrCancelRsn').focus();
		//	return false;
		//}

        mypage.contract.cancel.form.lengthCheck();

		if(!$cntrCancelAgreeYn.is(":checked")) {
			common.layerAlert(_cntrCancelAgreeYn);
			$('#cntrCancelAgreeYn').focus();
			return false;
		}
		return true;
	},
	moveContractCancel : function(){
		if(!mypage.contract.cancel.form.validateContractCancelParam()){
			return false;
		}
		common.layerConfirm(popMsg, function(){
			var param = {
			}
			//전송전 연동로그 처리 저장시 생성된 LINK_NO를 받아와 retURL에 파라미터로 세팅
			//각 retURL에서 응답 결과 ST_LINK_LOG에 저장 처리
			common.Ajax.sendRequest(
				"GET"
				, _baseUrl+"api/dih/DIH_CODE_IF_CN_GOS_CXP_WEB_CASE_0002.do"
				, param
				, mypage.contract.cancel.form.contractCancelJsonCallback
				, false);
		});
	},
	contractCancelJsonCallback : function(res){
		// 정상처리
		if(res && res.resultCode == common._jsonSuccessCd){ //0000
			var url = $('#retURL').val()+'?contractId='+$('#contractId').val()+'&linkNo='+res.data.linkNo+'&prgsTime='+res.data.prgsTime;
			$('#retURL').val(url);
			$('#cntrCancelForm').submit();
		}else{ //9999
			common.layerAlert(res.resultMessage); //비정상적인 오류가 발생하였습니다.
			return;
		}
	},
	
	lengthCheck : function(){
        var maxLen = 1000;
        var str =$("#description").val();
        if(str.length > maxLen) {
            common.layerAlert(_descriptionMaxByte);
            $("#description").val(str.substring(0,maxLen));
        }
        
        $(".txtAside").text(mypage.contract.cancel.form.numberWithCommas($("#description").val().length)+"/1,000");
	},
	
//	byteCheck : function(){
//        var maxLen = 1000;
//        
//        var size = 0;
//        var str =$("#description").val();
//        if (str == null || str.length == 0) {
//            $(".txtAside").text(size+"/"+maxLen);
//            return;
//        }
//        var rIndex = str.length;
//
//        for (var i = 0; i < str.length; i++) {
//
//            var charCode = str.charCodeAt(i);
//
//            if (charCode <= 0x00007F) {
//            	size += 1;
//            } else if (charCode <= 0x0007FF) {
//            	size += 2;
//            } else if (charCode <= 0x00FFFF) {
//            	size += 3;
//            } else {
//            	size += 4;
//            }
//            
//            if( size > maxLen ) {
//                rIndex = i;
//            }
//        }
//        
//        if(size>maxLen) {
//            common.layerAlert(_descriptionMaxByte);
//            $("#description").val(str.substring(0,rIndex));
//        }
//        
//        $(".txtAside").text(mypage.contract.cancel.form.numberWithCommas($("#description").val().length)+"/1,000");
//	},
	numberWithCommas : function(x){
	    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
};