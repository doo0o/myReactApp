$.namespace("mypage.contract.form");
var map;
var marker;
var currentPosition = {};

mypage.contract.form = {
	chinaAddrJson : null,
	dlvRgnMgntListMapJson : null,
	divTag:null,
	
	init : function(){
		// 결제 버튼 초기화
		mypage.contract.form.chkSubmitBtn(false);
		// 바이두 맵 초기화
		mypage.contract.form.loadMap();
		// 파일 업로드 초기화
		mypage.contract.form.changeFileForm();
//		$("#Mobile .btn-close").click();//레이어 닫기
	},

    bindEvent : function(){
		that = this;
		
		// 숫자만 입력 처리
		common.vaildNumberOnly("input:text[numberOnly]");
		// 계약자 정보 - 식별구분
		$(document).off("change","#"+mypage.contract.form.divTag+" #idType").on("change","#"+mypage.contract.form.divTag+" #idType", function(){
			mypage.contract.form.changeFileForm();
		});
		// 계약자 정보 저장
		$(document).off("click","#"+mypage.contract.form.divTag+" #contractorSave").on("click","#"+mypage.contract.form.divTag+" #contractorSave", function(){
			mypage.contract.form.contractorSaveForm();
		});
		// 인도지 정보 저장
		$(document).off("click","#"+mypage.contract.form.divTag+" #methodSave").on("click","#"+mypage.contract.form.divTag+" #methodSave", function(){
			mypage.contract.form.saveTransportationJson();
		});
		// 인도지 정보(발렛) - 주소변경(성)
		$(document).off("change","#"+mypage.contract.form.divTag+" #chinaAddr1").on("click","#"+mypage.contract.form.divTag+" #chinaAddr1", function(){
			$("#"+mypage.contract.form.divTag+" #address").val('');
			mypage.contract.form.changeChinaAddr();
			mypage.contract.form.getSearchAddressInfo();
		});
		// 인도지 정보(발렛) - 주소변경(시)
		$(document).off("change","#"+mypage.contract.form.divTag+" #chinaAddr2").on("change","#"+mypage.contract.form.divTag+" #chinaAddr2", function(){
			$("#"+mypage.contract.form.divTag+" #address").val('');
			
			// 배송불가 지역 체크
			if(!mypage.contract.form.dlvRgnMgntListMap($(this).val())){
				common.layerAlert(_NOT_TRANS_LOCATION);
				return false;
			}
			
			mypage.contract.form.getSearchAddressInfo();
		});
		// 인도지 정보(발렛) - 상세 주소 변경
		$(document).off("focusout","#"+mypage.contract.form.divTag+" #address").on("focusout","#"+mypage.contract.form.divTag+" #address", function(){
			var address = $.trim($("#"+mypage.contract.form.divTag+" #address").val());
			var obj = {
				result : true,
				resultMsg : ""
			};
			if(common.isEmpty(address)){
				obj.result = false;
				obj.resultMsg = _EMPTY_TRANSPORTATION_ADDRESS;
			}
			common.checkVaild("#"+mypage.contract.form.divTag+" #addressDiv", function() {
 				return obj;
 			});
			if(obj.result){
				mypage.contract.form.getSearchAddressInfo();
				mypage.contract.form.getTransportChangeJson();
			}
		});
		// 인도지 정보(지점) 변경
		$(document).off("change","#"+mypage.contract.form.divTag+" #department").on("change","#"+mypage.contract.form.divTag+" #department", function(){
			mypage.contract.form.getTransportChangeJson();
		});
		// 계약 해지 신청
		$(document).off("click","#btn_contrCancel").on("click","#btn_contrCancel", function(){
			var contractId = $("#contractId").val();
			var contractMsg = _CONTRACT_CANCEL_MSG1;
			if(Number(_balanceSum) > 0){
				contractMsg = _CONTRACT_CANCEL_MSG2;
			}
			
			common.layerConfirm(contractMsg, function(){
				common.link.moveMyContractCancelReqForm(contractId);
			});
		});

		// 개별 약관 체크 이벤트
		$(document).off("click","input:checkbox[name=termAgrChk]").on("click","input:checkbox[name=termAgrChk]", function(){
			var allCnt = $("input:checkbox[name=termAgrChk]").length;
			var chkCnt = $("input:checkbox[name=termAgrChk]:checked").length;
			
			if($(this).is(":checked")){
				if(allCnt == chkCnt){
					$("input:checkbox[name=termAgrChkAll]").prop("checked",true);
				} else {
					$("input:checkbox[name=termAgrChkAll]").prop("checked",false);
				}
			} else {
				if(allCnt != chkCnt){
					$("input:checkbox[name=termAgrChkAll]").prop("checked",false);
				} else {
					$("input:checkbox[name=termAgrChkAll]").prop("checked",true);
				}
			}
			
			mypage.contract.form.chkSubmitBtn(false);
		});
		
		// 모든 약관 체크 이벤트
		$(document).off("click","input:checkbox[name=termAgrChkAll]").on("click","input:checkbox[name=termAgrChkAll]", function(){
			var chk = $(this).is(":checked");
			if(chk){
				$("input:checkbox[name=termAgrChk]").prop("checked",true);
			} else {
				$("input:checkbox[name=termAgrChk]").prop("checked",false);
			}
			
			mypage.contract.form.chkSubmitBtn(false);
		});
		
		// 생년월일 체크
		$(document).off("focusout","#"+mypage.contract.form.divTag+" #dateBirthMM").on("focusout","#"+mypage.contract.form.divTag+" #dateBirthMM", function(){
			mypage.contract.form.chkBirthDate();
		});
		$(document).off("focusout","#"+mypage.contract.form.divTag+" #dateBirthDD").on("focusout","#"+mypage.contract.form.divTag+" #dateBirthDD", function(){
			mypage.contract.form.chkBirthDate();
		});
		$(document).off("focusout","#"+mypage.contract.form.divTag+" #dateBirthYYYY").on("focusout","#"+mypage.contract.form.divTag+" #dateBirthYYYY", function(){
			mypage.contract.form.chkBirthDate();
		});
		
//		$(document).off("focusout","#"+mypage.contract.form.divTag+" #dateBirth").on("focusout","#"+mypage.contract.form.divTag+" #dateBirth", function(){
//			
//			var value = $("#"+mypage.contract.form.divTag+" #dateBirth").val().replace(/-/gi,"");
//			
//			var obj = {
//				result : true,
//				resultMsg : ""
//			};
//			if(common.isEmpty(value)){
//				obj.result = false;
//				obj.resultMsg = _birthMsg;
//			} else if(!common.isDateMMddyyyy(value)){
//				obj.result = false;
//				obj.resultMsg = _birthNotFormat;
//			}
//			common.checkVaild("#"+mypage.contract.form.divTag+" #dateBirthDiv", function() {
// 				return obj;
// 			});
//			
//			if(obj.result){
//				var month = value.substring(0, 2);
//				var day = value.substring(2, 4);
//				var year = value.substring(4, value.length);
//				var birthDate=month+"-"+day+"-"+year;
//				
//				$("#"+mypage.contract.form.divTag+" #dateBirth").val(birthDate);
//			}
//		});
		
		// ID TYPE 체크
		$(document).off("focusout","#"+mypage.contract.form.divTag+" #idNum").on("focusout","#"+mypage.contract.form.divTag+" #idNum", function(){
			
			var value = $("#"+mypage.contract.form.divTag+" #idNum").val();
			
			var obj = {
					result : true,
					resultMsg : ""
			};
			if(common.isEmpty(value)){
				obj.result = false;
				obj.resultMsg = _idNumberMsg;
			}
			common.checkVaild("#"+mypage.contract.form.divTag+" #idNumDiv", function() {
				return obj;
			});
		});
	},
	
	chkBirthDate : function(){
		var dateBirthMM = $("#"+mypage.contract.form.divTag+" #dateBirthMM").val();
		var dateBirthDD = $("#"+mypage.contract.form.divTag+" #dateBirthDD").val();
		var dateBirthYYYY = $("#"+mypage.contract.form.divTag+" #dateBirthYYYY").val();
		var dateBirth = dateBirthMM+dateBirthDD+dateBirthYYYY;
		
		var obj = {
			result : true,
			resultMsg : ""
		};
		if(common.isEmpty(dateBirthMM)
			|| common.isEmpty(dateBirthDD)
			|| common.isEmpty(dateBirthYYYY)){
			obj.result = false;
			obj.resultMsg = _birthMsg;
		} else if(!common.isEmpty(dateBirthMM)
			&& !common.isEmpty(dateBirthDD)
			&& !common.isEmpty(dateBirthYYYY)
			&& !common.isDateMMddyyyy(dateBirth)){
			obj.result = false;
			obj.resultMsg = _birthNotFormat;
		}
		common.checkVaild("#"+mypage.contract.form.divTag+" #dateBirthDDDiv", function() {
			return obj;
		});
		common.checkVaild("#"+mypage.contract.form.divTag+" #dateBirthMMDiv", function() {
			return obj;
		});
		common.checkVaild("#"+mypage.contract.form.divTag+" #dateBirthYYYYDiv", function() {
			return obj;
		});
	},
	
	// 결제 버튼 활성화 function
	chkSubmitBtn : function(isAlert){
		if(mypage.contract.form.checkInputVlaue(isAlert)){
			$("#btn_submit").attr("disabled", false);
		} else {
			$("#btn_submit").attr("disabled", true);
		}
	},
	
	// 결제 필수 파라미터 체크 function
	checkInputVlaue : function(isAlert){
		if(isAlert == undefined || isAlert == null){
			isAlert = true;
		}
		// 결제 처리중 체크
		var ret = payment.paymentForm.validProcessing();
		if(!ret.result){
			if(isAlert){
				common.layerAlert(ret.resultMsg);
			}
			return false;
		}
		
		// 결제 금액 체크
		var ret = payment.paymentForm.validatePayAmt();
		if(!ret.result){
			if(isAlert){
				common.layerAlert(ret.resultMsg);
			}
			return false;
		}
		
		// 결제 구분 체크
		ret = payment.paymentForm.validateCategory();
		if(!ret.result){
			if(isAlert){
				common.layerAlert(ret.resultMsg);
			}
			return false;
		}
		
		// 결제 수단 선택 체크
		ret = payment.paymentForm.validatePayMeanCd();
		if(!ret.result){
			if(isAlert){
				common.layerAlert(ret.resultMsg);
			}
			return false;
		}
		// 약관 동의 체크
		var termsAgrChk = true;
		$("input:checkbox[name=termAgrChk]").each(function(){
			var type = $(this).attr("data");
			if(type == "M"){
				var isTermAgr = $(this).is(":checked");
				if(!isTermAgr){
					termsAgrChk = false;
					return false;
				}
			}
		});
		if(!termsAgrChk){
			if(isAlert){
				common.layerAlert(_CONTRACT_MSG_EMPTY_TERM_AGREE);
			}
			return false;
		}
		// 지점 정보 체크
		var deliveryType  = $("#"+mypage.contract.form.divTag+" #deliveryType .active").attr("id");
		if(deliveryType == _CODE_CXP_VALET_TYPE_A){
			// 지점일 경우
			var departmentId = $("#department option:selected").val();
			if(departmentId == undefined
				|| departmentId == null
				|| departmentId == ""
				|| departmentId == "select"){
				if(isAlert){
					common.layerAlert(_CONTRACT_MSG_EMPTY_DEPARTMENT);
				}
				return false;
			}
		} else if(deliveryType == _CODE_CXP_VALET_TYPE_B){
			// 발렛일 경우
			
			var lat = $("#lat").val();
	    	var lng = $("#lng").val();
			var chinaAddr1 = $("#"+mypage.contract.form.divTag+" #chinaAddr1").val();
        	var chinaAddr2 = $("#"+mypage.contract.form.divTag+" #chinaAddr2").val();
        	var address = $("#"+mypage.contract.form.divTag+" #address").val();
        	
    		if(lat == undefined
				|| lat == null
				|| lat == ""
				|| lng == undefined
				|| lng == null
				|| lng == ""
				|| chinaAddr1 == undefined
				|| chinaAddr1 == null
				|| chinaAddr1 == ""
				|| chinaAddr1 == "select"
				|| chinaAddr2 == undefined
				|| chinaAddr2 == null
				|| chinaAddr2 == ""
				|| chinaAddr2 == "select"
				|| address == undefined
				|| address == null
				|| address == ""){
    			if(isAlert){
    				common.layerAlert(_EMPTY_TRANSPORTATION_INFO);
    			}
	    		return false;
    		}
		}
		// 인도지 설정 여부
//		if(isAlert){
//			var transYn = $("#transYn").val();
//			if(transYn != "Y"){
//				common.layerAlert(_EMPTY_TRANSPORTATION_INFO);
//				return false;
//			}
//		}
		// 잔금 체크
		var balance = Number($("[name='payAmt']").val());
		if(balance <= 0){
			if(isAlert){
				common.layerAlert(_CONTRACT_MSG_EMPTY_PAY_PRC);
			}
			return false;
		}
		
		return true;
	},

	/**
	 * 인도지 변경안했을 경우, 잔금 처리 불가 체크
	 */
	chkDeliveryBalance : function(){
		var transYn = $("#transYn").val();
		if(transYn != "Y"){
			var payAmt = Number(payment.paymentForm.getValidNumber($("[name='payAmt']:enabled").val(), payment.paymentForm.maxFractionDigits));
			var balance = Number(_fmOutstandingBalance);
			if((balance - payAmt) <= 0){
				return false;
			}
		}
		return true;
	},
	
	// 풀 레이어 닫기
	closeFullLayer : function(){
		common.link.moveMyPageMain();
	},

    /**
     * 배송불가 체크
     * @returns
     */
    dlvRgnMgntListMap : function(chinaAddr2){
        var dlvRgnMgnt = false;
        var dlvRgnMgntList = mypage.contract.form.dlvRgnMgntListMapJson[chinaAddr2];

        if(!common.isEmpty(dlvRgnMgntList)){
             dlvRgnMgnt = true;
        }
        return dlvRgnMgnt;
    },

    /**
     * 맵센터
     * @returns
     */
    mapCenter : function(){
    	if(map != undefined && map != null
			&&marker != undefined && marker != null){
    		
    		setTimeout(function() {
    			map.setCenter(marker.getPosition());
    		}, 200);
    	}
    },
    
    // 인도지 탭 변경 function
    changeDeliveryType : function(){
    	var deliveryType  = $("#"+mypage.contract.form.divTag+" #deliveryType .active").attr("id");
    	if(deliveryType == _CODE_CXP_VALET_TYPE_B){
    		var chinaAddr1 = $("#"+mypage.contract.form.divTag+" #chinaAddr1").val();
        	var chinaAddr2 = $("#"+mypage.contract.form.divTag+" #chinaAddr2").val();
        	
        	if(chinaAddr1 == undefined || chinaAddr1 == null || chinaAddr1 == "" || chinaAddr1 == "select"
        		|| chinaAddr2 == undefined || chinaAddr2 == null || chinaAddr2 == "" || chinaAddr2 == "select"){
        		return false;
        	}
        	
        	mypage.contract.form.mapCenter();

        	var address = $("#"+mypage.contract.form.divTag+" #address").val();
        	if(address == undefined || address == null || address == ""){
        		return false;
        	}
    	}
    	
    	var isSlideIcon = $("#"+mypage.contract.form.divTag+" #deliveryType").hasClass("slideIcon");
    	if(!_userAgent.isMobile() || (_userAgent.isMobile() && isSlideIcon)){
    		mypage.contract.form.getTransportChangeJson(false);
    	}
    },
    
    // 결제 종류 변경 function
    changePayType : function(){
    	mypage.contract.form.chkSubmitBtn(false);
    },

    /**
     * 계약 상세 화면 조회
     * @returns
     */
    getMyContractFormAjax : function(contractId, noLoadingBar, time, isLoadingBarHide, tabObjClassNm){

    	if(noLoadingBar == undefined || noLoadingBar == null){
    		noLoadingBar = null;
    	}
    	if(time == undefined || time == null){
    		time = (1000*60*5);
    	}

        var url = _baseUrl+"mypage/contract/getMyContractFormAjax.do";
        var param ={
            contractId : contractId
        };

        var scrollTop = $('.fullLayer.open').scrollTop();
        $('.fullLayer.open').scrollTop(0);

        common.Ajax.sendRequest("GET",url,param,function(data){
            if(data != undefined && data != null && data != ""){
            	if(data.resultCode){
            		if(data.resultCode == common._jsonLoginErrorCd){
            			common.hideLoadingBar(null);
            			common.layerAlert(_COMMON_MSG_MOVE_LOGIN, common.link.moveLoginPage);
            		} else {
            			common.link.replaceError();
            		}
				} else {
					$("#flCont").html(data);
	                
	                // 이미 취소된 계약 일 경우
	                var cancelYn = $("#cancelYn").val();
	                if(cancelYn != null && cancelYn =="Y"){
	                	common.hideLoadingBar(null);
	                	common.layerAlert(_CONTRACT_MSG_CANCEL_COMPLETE, function(originContractId){
	                		common.link.moveMyContractCancelReqComplete(originContractId);
	                	}, $("#originContractId").val());
	                	return false;
	                }
	                
	                // 완납 여부 체크
	                var payCompleteYn = $("#payCompleteYn").val();
	                if(payCompleteYn == "Y"){
	                	common.hideLoadingBar(null);
	                	common.layerAlert(_CONTRACT_MSG_PAY_COMPLETE, function(originContractId){
	                		common.link.movePaymentComplete(originContractId);
	                	}, $("#originContractId").val());
	                	
	                	return false;
	                }

	                pageAllScript();
	                
	                if(tabObjClassNm != undefined && tabObjClassNm != null && tabObjClassNm != ""){
	                	
	                	var tabClass = $.trim(tabObjClassNm.replace("objView",""));
	                	var $activeTab = $("#"+mypage.contract.form.divTag+" .boxAcc").find("."+tabClass);
	                	setTimeout(function() {
	                		$activeTab.click();
	                		$('.fullLayer.open').scrollTop(scrollTop);
	            		}, 50);
	                }
                	$(".boxPayType").find(".isPay[default]").click();
	                
	                if(isLoadingBarHide){
	                    common.hideLoadingBar(null);
	                }
				}
            }
        },true, noLoadingBar, time);
    },

    /**
     * 인도일자, 탁송비 정보 조회
     */
    getTransportChangeJson : function(areaChk){
    	if(areaChk == undefined || areaChk == null){
    		areaChk = true;
    	}

    	var deliveryType  = $("#"+mypage.contract.form.divTag+" #deliveryType .active").attr("id");
    	var contrOrgId  = $("#originContractId").val();
    	var department = $("#"+mypage.contract.form.divTag+" #department").val();
    	var lat = $("#lat").val();
    	var lng = $("#lng").val();
    	var chinaAddr1 = $("#"+mypage.contract.form.divTag+" #chinaAddr1").val();
		var chinaAddr2 = $("#"+mypage.contract.form.divTag+" #chinaAddr2").val();
		var address = $("#"+mypage.contract.form.divTag+" #address").val();

    	// 변수 체크
    	if(deliveryType == undefined || deliveryType == null || deliveryType == ""){
    		return false;
    	}
    	if(contrOrgId == undefined || contrOrgId == null || contrOrgId == ""){
    		return false;
    	}

    	// 값 체크
    	if(deliveryType == _CODE_CXP_VALET_TYPE_A){
    		// 지점
    		if(department == undefined
				|| department == null
				|| department == ""
	    		|| department == "select"){

	    		$("#"+mypage.contract.form.divTag+" .boxType04").children("strong").children("em").text("");
	    		$("#"+mypage.contract.form.divTag+" .boxType04").children("p").children("em").text("");

	    		return false;
    		}
    	} else if(deliveryType == _CODE_CXP_VALET_TYPE_B){
    		//배송불가 체크
            if(areaChk && !mypage.contract.form.dlvRgnMgntListMap($("#"+mypage.contract.form.divTag+" #chinaAddr2").val())){
            	common.layerAlert(_NOT_TRANS_LOCATION);
                return false;
            }
    		// 발렛
    		if(lat == undefined || lat == null || lat == ""
				|| lng == undefined || lng == null || lng == ""
				|| chinaAddr1 == undefined || chinaAddr1 == null || chinaAddr1 == "" || chinaAddr1 == "select"
				|| chinaAddr2 == undefined || chinaAddr2 == null || chinaAddr2 == "" || chinaAddr2 == "select"
				|| address == undefined || address == null || address == ""){

    			$("#"+mypage.contract.form.divTag+" .boxType04").children("strong").children("em").text("");
	    		$("#"+mypage.contract.form.divTag+" .boxType04").children("p").children("em").text("");

	    		return false;
    		}
    	} else {
    		return false;
    	}

    	var url = _baseUrl+"mypage/contract/getTransportChangeJson.do";
        var param ={
    		deliveryType : deliveryType
    		, contrOrgId : contrOrgId
    		, department : department
    		, lat : lat
    		, lng : lng
    		, chinaAddr1 : $("#"+mypage.contract.form.divTag+" #chinaAddr1").val()
        	, chinaAddr2 : $("#"+mypage.contract.form.divTag+" #chinaAddr2").val()
        };

        common.Ajax.sendJSONRequest("POST",url,param,function(response){
        	if(common.isLoginAjax(response)){
        		if(response.resultCode == "0000"){
    				var transPrc = response.data.transPrc;
    				var transPrcTax = response.data.transPrcTax;
    				var transTotalPrc = transPrc+transPrcTax;
    				var transDate = response.data.transDate;
    				var currencySymbol = response.data.currencySymbol;

    				if(transPrc != undefined && transPrc != null){
    					$("#transPrc").val(transPrc);
    					$("#"+mypage.contract.form.divTag+" .boxType04").children("strong").children("em").text(transPrc.toString().numberFormat(currencySymbol, 2));
//    					$("#"+mypage.contract.form.divTag+" .boxType04").children("p").children("em").text("");
    					mypage.contract.form.chkSubmitBtn(false);
    				}
    				if(transDate != undefined && transDate != null && transDate != ""){
    					$("#"+mypage.contract.form.divTag+" .boxType04").children("p").children("em").text(transDate);
    				}
    			} else {
    				common.hideLoadingBar(null);
    				common.layerAlert(response.resultMessage);
    			}
        	}
        },true, null, (1000*60*5));
    },

    /**
     * 계약자 정보 저장
     */
	contractorSaveForm : function(){

		var _userName 	=  $("#"+mypage.contract.form.divTag+" #userName").val();
		var _dateBirthMM = $("#"+mypage.contract.form.divTag+" #dateBirthMM").val();
		var _dateBirthDD = $("#"+mypage.contract.form.divTag+" #dateBirthDD").val();
		var _dateBirthYYYY = $("#"+mypage.contract.form.divTag+" #dateBirthYYYY").val();
		var _dateBirth = _dateBirthMM+_dateBirthDD+_dateBirthYYYY;
		var _idType		=  $("#"+mypage.contract.form.divTag+" #idType").val();
		var _idNum 		=  $("#"+mypage.contract.form.divTag+" #idNum").val();
	    var _cotrSsnFrontImg;
	    var _cotrSsnBackImg;
	    var _cotrImrtCersImg;
	    var _cotrPsptImg;
	    var _cotrDrvgLcnImg;

		//생년월일 체크
//		if(common.isEmpty(_dateBirth)){
//			common.layerAlert(_birthMsg);
//			$("#"+mypage.contract.form.divTag+" #dateBirth").focus();
//			return;
//		}
//        if(!common.isDateMMddyyyy(_dateBirth)){
//        	common.layerAlert(_birthNotFormat);
//        	$("#"+mypage.contract.form.divTag+" #dateBirth").focus();
//            return;
//        }
        var dateBirthObj = {
			result : true,
			resultMsg : ""
		};
		if(common.isEmpty(_dateBirthMM)
			|| common.isEmpty(_dateBirthDD)
			|| common.isEmpty(_dateBirthYYYY)){
			dateBirthObj.result = false;
			dateBirthObj.resultMsg = _birthMsg;
		} else if(!common.isDateMMddyyyy(_dateBirth)){
			dateBirthObj.result = false;
			dateBirthObj.resultMsg = _birthNotFormat;
		}
		common.checkVaild("#"+mypage.contract.form.divTag+" #dateBirthDDDiv", function() {
			return dateBirthObj;
		});
		common.checkVaild("#"+mypage.contract.form.divTag+" #dateBirthMMDiv", function() {
			return dateBirthObj;
		});
		common.checkVaild("#"+mypage.contract.form.divTag+" #dateBirthYYYYDiv", function() {
			return dateBirthObj;
		});
		if(!dateBirthObj.result){
			$("#"+mypage.contract.form.divTag+" #dateBirthDD").focus();
			return;
		}
		//ID 유형 체크
		if(common.isEmpty(_idType)){
			common.layerAlert(_idTypeMsg);
			return;
		}
		//ID 번호 체크
//		if(common.isEmpty(_idNum)){
//			common.layerAlert(_idNumberMsg);
//			$("#"+mypage.contract.form.divTag+" #idNum").focus();
//			return;
//			
//			var value = $("#"+mypage.contract.form.divTag+" #idNum").val();
//			
//			var obj = {
//					result : true,
//					resultMsg : ""
//			};
//			if(common.isEmpty(value)){
//				obj.result = false;
//				obj.resultMsg = _idNumberMsg;
//			}
//			common.checkVaild("#"+mypage.contract.form.divTag+" #idNumDiv", function() {
//				return obj;
//			});
//		}
		var idNumObj = {
			result : true,
			resultMsg : ""
		};
		if(common.isEmpty(_idNum)){
			idNumObj.result = false;
			idNumObj.resultMsg = _idNumberMsg;
		}
		common.checkVaild("#"+mypage.contract.form.divTag+" #idNumDiv", function() {
			return idNumObj;
		});
		if(!idNumObj.result){
			$("#"+mypage.contract.form.divTag+" #idNum").focus();
			return;
		}
		if(mypage.contract.form.divTag == "PC"){
			_cotrSsnFrontImg 	= $('#fileUpload-1-img img').prop('src');
			_cotrSsnBackImg 	= $('#fileUpload-2-img img').prop('src');
			_cotrImrtCersImg 	= $('#fileUpload-4-img img').prop('src');
			_cotrPsptImg 		= $('#fileUpload-3-img img').prop('src');
			_cotrDrvgLcnImg 	= $('#fileUpload-5-img img').prop('src');
		} else if(mypage.contract.form.divTag == "MC") {
			_cotrSsnFrontImg 	= $('#fileUpload-6-img img').prop('src');
			_cotrSsnBackImg 	= $('#fileUpload-7-img img').prop('src');
			_cotrImrtCersImg 	= $('#fileUpload-9-img img').prop('src');
			_cotrPsptImg 		= $('#fileUpload-8-img img').prop('src');
			_cotrDrvgLcnImg 	= $('#fileUpload-10-img img').prop('src');
		}
		//ID 유형별 파일체크
		if(_idType == '100' && (common.isEmpty(_cotrSsnFrontImg) || common.isEmpty(_cotrSsnBackImg)|| common.isEmpty(_cotrDrvgLcnImg))){//주민등록증
			common.layerAlert(_fileEmptyMsg);
			return;
		}
		if(_idType == '200' && (common.isEmpty(_cotrPsptImg) || common.isEmpty(_cotrDrvgLcnImg))){//여권
			common.layerAlert(_fileEmptyMsg);
			return;
		}
		if(_idType == '300' && (common.isEmpty(_cotrImrtCersImg) || common.isEmpty(_cotrDrvgLcnImg))){//출입국등록증
			common.layerAlert(_fileEmptyMsg);
			return;
		}
		common.layerConfirm(_confirmMsg, function(){
			// FormData 객체 생성
		    var formData = new FormData();
		    formData.append('contrOrgId', 	_contractOrgId);
		    formData.append('cotrNm', 		_userName);
		    formData.append('cotrBday', 	_dateBirth);
		    formData.append('cotrIdTpCd', 	_idType);
		    formData.append('cotrIdNo', 	_idNum);

		    if(_idType == '100'){//주민등록증
			    formData.append('cotrSsnFrontImg', 	_cotrSsnFrontImg);
			    formData.append('cotrSsnBackImg', 	_cotrSsnBackImg);
			}
			if(_idType == '200'){//여권
			    formData.append('cotrPsptImg', 		_cotrPsptImg);
			}
			if(_idType == '300'){//출입국등록증
			    formData.append('cotrImrtCersImg', 	_cotrImrtCersImg);
			}
		    formData.append('cotrDrvgLcnImg', 	_cotrDrvgLcnImg);

			common.Ajax.sendMultipartRequest(
				"POST"
				, _baseUrl+"mypage/contract/contractorSaveFormJson.do"
				, formData
				, mypage.contract.form.contractorSaveFormCallback
				, false);
		});
	},
	contractorSaveFormCallback : function(res){
		if(common.isLoginAjax(res)){
			// 정상처리
			if(res && res.resultCode == "0000"){ //0000
				common.layerAlert(_successSaveMsg);
	            var _idType = res.data.cotrIdTpCd;
	            //파일업로드 초기화
	            if(_idType == '100'){//주민등록증
	                mypage.contract.form.deleteImageFile('fileUpload-3-img', 'fileUpload-3');//여권이미지삭제
	                mypage.contract.form.deleteImageFile('fileUpload-8-img', 'fileUpload-8');//여권이미지삭제
	                mypage.contract.form.deleteImageFile('fileUpload-4-img', 'fileUpload-4');//출입국등록증이미지삭제
	                mypage.contract.form.deleteImageFile('fileUpload-9-img', 'fileUpload-9');//출입국등록증이미지삭제
	            }
	            if(_idType == '200'){//여권
	                mypage.contract.form.deleteImageFile('fileUpload-1-img', 'fileUpload-1');//주민등록증앞이미지삭제
	                mypage.contract.form.deleteImageFile('fileUpload-6-img', 'fileUpload-6');//주민등록증앞여권이미지삭제
	                mypage.contract.form.deleteImageFile('fileUpload-2-img', 'fileUpload-2');//주민등록증뒤이미지삭제
	                mypage.contract.form.deleteImageFile('fileUpload-7-img', 'fileUpload-7');//주민등록증뒤여권이미지삭제
	                mypage.contract.form.deleteImageFile('fileUpload-4-img', 'fileUpload-4');//출입국등록증이미지삭제
	                mypage.contract.form.deleteImageFile('fileUpload-9-img', 'fileUpload-9');//출입국등록증이미지삭제
	            }
	            if(_idType == '300'){//출입국등록증
	                mypage.contract.form.deleteImageFile('fileUpload-1-img', 'fileUpload-1');//주민등록증앞이미지삭제
	                mypage.contract.form.deleteImageFile('fileUpload-6-img', 'fileUpload-6');//주민등록증앞여권이미지삭제
	                mypage.contract.form.deleteImageFile('fileUpload-2-img', 'fileUpload-2');//주민등록증뒤이미지삭제
	                mypage.contract.form.deleteImageFile('fileUpload-7-img', 'fileUpload-7');//주민등록증뒤여권이미지삭제
	                mypage.contract.form.deleteImageFile('fileUpload-3-img', 'fileUpload-3');//여권이미지삭제
	                mypage.contract.form.deleteImageFile('fileUpload-8-img', 'fileUpload-8');//여권이미지삭제
	            }
			}else{ //9999
				common.layerAlert(res.resultMessage); //비정상적인 오류가 발생하였습니다.
				return;
			}
		}
	},

    deleteImageFile : function(id, fileId) {
        var holder = document.getElementById(id);
        if(holder.classList.contains('fileUp-on')){
            holder.classList.remove('fileUp-on');
            if(holder.getElementsByTagName('img')[0]){
                holder.removeChild(holder.getElementsByTagName('img')[0]);
            }
        }
        $('#'+fileId).val("");//파일폼 초기화
    },

    /**
     * 인도지 변경
     */
	saveTransportationJson : function(){

		var deliveryType  = $("#"+mypage.contract.form.divTag+" #deliveryType .active").attr("id");
		var contrId  = $("#contractId").val();
    	var contrOrgId  = $("#originContractId").val();
    	var department = $("#"+mypage.contract.form.divTag+" #department").val();
    	var lat = $("#lat").val();
    	var lng = $("#lng").val();
    	var chinaAddr1 = $("#"+mypage.contract.form.divTag+" #chinaAddr1").val();
		var chinaAddr2 = $("#"+mypage.contract.form.divTag+" #chinaAddr2").val();
		var address = $("#"+mypage.contract.form.divTag+" #address").val();
		var transPrc = $("#transPrc").val();

		if(contrId == undefined || contrId == null || contrId == ""){
			common.layerAlert(_EMPTY_TRANSPORTATION_INFO);
			return false;
		}
		if(contrOrgId == undefined || contrOrgId == null || contrOrgId == ""){
			common.layerAlert(_EMPTY_TRANSPORTATION_INFO);
			return false;
		}
		if(deliveryType == undefined || deliveryType == null || deliveryType == ""){
			common.layerAlert(_EMPTY_TRANSPORTATION_INFO);
			return false;
		}

		// 지점일 경우
		if(deliveryType == _CODE_CXP_VALET_TYPE_A){
			if(department == undefined || department == null || department == ""){
				common.layerAlert(_EMPTY_TRANSPORTATION_INFO);
				return false;
			}
		// 발렛일 경우
		} else if(deliveryType == _CODE_CXP_VALET_TYPE_B){
			//배송불가 체크
            if(!mypage.contract.form.dlvRgnMgntListMap($("#"+mypage.contract.form.divTag+" #chinaAddr2").val())){
            	common.layerAlert(_NOT_TRANS_LOCATION);
                return false;
            }
			if(lat == undefined || lat == null || lat == ""){
				common.layerAlert(_EMPTY_TRANSPORTATION_INFO);
				return false;
			}
			if(lng == undefined || lng == null || lng == ""){
				common.layerAlert(_EMPTY_TRANSPORTATION_INFO);
				return false;
			}
			if(chinaAddr1 == undefined || chinaAddr1 == null || chinaAddr1 == "" || chinaAddr1 == "select"){
				common.layerAlert(_EMPTY_TRANSPORTATION_INFO);
				return false;
			}
			if(chinaAddr2 == undefined || chinaAddr2 == null || chinaAddr2 == "" || chinaAddr2 == "select"){
				common.layerAlert(_EMPTY_TRANSPORTATION_INFO);
				return false;
			}
//			if(address == undefined || address == null || address == ""){
//				common.layerAlert(_EMPTY_TRANSPORTATION_ADDRESS);
//				return false;
//			}
			var addrObj = {
				result : true,
				resultMsg : ""
			};
			if(common.isEmpty(address)){
				addrObj.result = false;
				addrObj.resultMsg = _EMPTY_TRANSPORTATION_ADDRESS;
			}
			common.checkVaild("#"+mypage.contract.form.divTag+" #addressDiv", function() {
 				return addrObj;
 			});
			if(!addrObj.result){
				$("#"+mypage.contract.form.divTag+" #address").focus();
				return false;
			}
		}
		// 탁송비
		if(transPrc == undefined || transPrc == null || transPrc == ""){
			common.layerAlert(_EMPTY_TRANSPORTATION_INFO);
			return false;
		}

		common.layerConfirm(_confirmMsg, function(){
			var url = _baseUrl+"mypage/contract/saveTransportationJson.do";
	        var param ={
	    		deliveryType : deliveryType
	    		, contrOrgId : contrOrgId
	    		, contrId : contrId
	    		, department : department
	    		, lat : lat
	    		, lng : lng
	    		, chinaAddr1 : chinaAddr1
	    		, chinaAddr2 : chinaAddr2
	    		, address : address
	    		, transPrc : transPrc
	        };

	        common.showLoadingBar(false, (1000*60*5));
			common.Ajax.sendJSONRequest("POST",url,param,function(response){
				if(common.isLoginAjax(response)){
					if(response.resultCode == "0000"){
						var tabObjClassNm = $("#"+mypage.contract.form.divTag+" .boxAcc").children("li.active").children("a.objView").attr("class");
						
						common.hideLoadingBar(null);
						common.layerAlert(_successSaveMsg, function(){
							common.showLoadingBar(false, (1000*60*5));
							mypage.contract.form.getMyContractFormAjax(contrOrgId, 1, 1, true, tabObjClassNm);
						});
					} else {
						common.hideLoadingBar(null);
						common.layerAlert(response.resultMessage);
					}
				}
			},true, 1, 1);
		});
	},

	changeFileForm : function(){
		var idType = $("#"+mypage.contract.form.divTag+" #idType").val();
		if(idType == '100') { // 주민등록증
			 $("#"+mypage.contract.form.divTag+" .cert").show();
			 $("#"+mypage.contract.form.divTag+" .passport").hide();
			 $("#"+mypage.contract.form.divTag+" .entry").hide();
		} else if(idType == '200')  {// 여권
			 $("#"+mypage.contract.form.divTag+" .cert").hide();
			 $("#"+mypage.contract.form.divTag+" .passport").show();
			 $("#"+mypage.contract.form.divTag+" .entry").hide();
		} else if(idType == '300')  {// 출입국등록증
			 $("#"+mypage.contract.form.divTag+" .cert").hide();
			 $("#"+mypage.contract.form.divTag+" .passport").hide();
			 $("#"+mypage.contract.form.divTag+" .entry").show();
		}
	},
	addMarker : function(point){

		mypage.contract.form.deletePoint();
		var myIcon = new BMap.Icon(_markerImgPath, new BMap.Size(30, 36));
	    marker = new BMap.Marker(point,{icon: myIcon});

	    var html = "<div class=\"dotLocation\" style=\"top:30%;left:15%;\"><div class=\"inner\"><div class=\"toolTiptxt\">"+_dragAndChageloacation+"</div></div></div>";
		var myLabel = new BMap.Label(html,     //为lable填写内容
			    {offset:new BMap.Size(-80,-46)});
//		myLabel.setStyle({
//			 color : "red",
//			 fontSize : "12px",
//			 height : "20px",
//			 lineHeight : "20px",
//		 });
	    marker.setLabel(myLabel);
	    map.addOverlay(marker);
	    marker.enableDragging();
	    map.setCenter(marker);
	    map.centerAndZoom(point, 15);
	    marker.addEventListener('dragend', function() {
	    	var myGeo = new BMap.Geocoder();
			myGeo.getLocation(marker.getPosition(), function(r){
				mypage.contract.form.setChangeChinaAddrOtion('chinaAddr1', r.addressComponents.province);
				mypage.contract.form.changeChinaAddr();
				mypage.contract.form.setChangeChinaAddrOtion('chinaAddr2', r.addressComponents.city);
				$("#"+mypage.contract.form.divTag+" #address").val(r.addressComponents.district+r.addressComponents.street+r.addressComponents.streetNumber);
				$("#lng").val(r.point.lng);
				$("#lat").val(r.point.lat);
				
				var address = $.trim($("#"+mypage.contract.form.divTag+" #address").val());
				var obj = {
					result : true,
					resultMsg : ""
				};
				if(common.isEmpty(address)){
					obj.result = false;
					obj.resultMsg = _EMPTY_TRANSPORTATION_ADDRESS;
				}
				common.checkVaild("#"+mypage.contract.form.divTag+" #addressDiv", function() {
	 				return obj;
	 			});
				if(obj.result){
					mypage.contract.form.getTransportChangeJson();
				}
			});
		});
	},
	setChangeChinaAddrOtion : function(id, text){
		// value는 모르고 text만 알때
		$("#"+mypage.contract.form.divTag+" #"+id+" option").each(function() {
		    if(text.indexOf($(this).text()) >= 0)
		        $(this).prop('selected', true);
		});
	},

    getSearchAddressInfo : function(){
		if(common.isEmpty($("#"+mypage.contract.form.divTag+" #chinaAddr1").val())){
			common.layerAlert(_provinceChk);
			return;
		}
		if(common.isEmpty($("#"+mypage.contract.form.divTag+" #chinaAddr2").val())){
			common.layerAlert(_cityChk);
			return;
		}

		// 将地址解析结果显示在地图上,并调整地图视野 北京市复兴路乙15号
        var address = $("#"+mypage.contract.form.divTag+" #chinaAddr1 option:selected").text()+$("#"+mypage.contract.form.divTag+" #chinaAddr2 option:selected").text()+$("#"+mypage.contract.form.divTag+" #address").val();

		var myGeo = new BMap.Geocoder();
		myGeo.getPoint(address, function(point){
			if (point) {
				mypage.contract.form.moveCurrent(point.lng, point.lat);
				$("input[name=lat]").val(point.lat);
				$("input[name=lng]").val(point.lng);
			}else{
				common.layerAlert(address);
			}
        },$("#"+mypage.contract.form.divTag+" #chinaAddr1 option:selected").text());
	},
	
	/**
	 * 바이두 맵 초기화
	 */
	loadMap : function(){
		
		if(mypage.contract.form.divTag == "PC"){
			map = new BMap.Map("pcMap");
		} else {
			map = new BMap.Map("mcMap");
		}
		
		map.enableScrollWheelZoom();
	    map.centerAndZoom(new BMap.Point(_longitude,_latitude), 15);

	    //맵 로드시 인도지 정보저장시 전송할 기본값 세팅 위치 변경시 addMarker 에서 수시로 변경됨
		$("#lng").val(_longitude);
		$("#lat").val(_latitude);
		
		$("#"+mypage.contract.form.divTag+" #chinaAddr1 option").each(function() {
		    if(_destinationState.indexOf($(this).text()) >= 0)
		        $(this).prop('selected', true);
		});
		mypage.contract.form.changeChinaAddr();

		$("#"+mypage.contract.form.divTag+" #chinaAddr2 option").each(function() {
		    if(_destinationCity.indexOf($(this).text()) >= 0)
		        $(this).prop('selected', true);
		});
		
		$("#"+mypage.contract.form.divTag+" #address").val(_destinationStreet);
		mypage.contract.form.getSearchAddressInfo(true);
		
		if(_valet){
			$("#"+mypage.contract.form.divTag+" .tabsCents").hide();
			$("#"+mypage.contract.form.divTag+" .tabsCents").eq(1).show();
			$("#"+mypage.contract.form.divTag+" #A").removeClass('active');
			$("#"+mypage.contract.form.divTag+" #B").addClass('active');
		}else{
			$("#"+mypage.contract.form.divTag+" .tabsCents").hide();
			$("#"+mypage.contract.form.divTag+" .tabsCents").eq(0).show();
		}
	},
	getCurrentPostion : function() {
		if (navigator.geolocation) { // GPS를 지원하면
			navigator.geolocation.getCurrentPosition(function(position) {
				var latitude = position.coords.latitude;
				var longitude = position.coords.longitude;
				currentPosition.latitude = position.coords.latitude;
				currentPosition.longitude = position.coords.longitude;
			}, function(error) {
				console.log("error : can't load location info.");
			}, {
				enableHighAccuracy: false,
				maximumAge: 0,
				timeout: Infinity
		    });
		} else {
			console.log("error : does not exists navigator.geolocation obj.");
		}
		return currentPosition;
	},

	goCurrentPoint : function() {
		currentPosition = mypage.contract.form.getCurrentPostion();

		mypage.contract.form.moveCurrent(currentPosition.longitude,currentPosition.latitude);
	},

	moveCurrent : function(longitude, latitude){
		var point = new BMap.Point(longitude, latitude);
		mypage.contract.form.addMarker(point);
	    map.centerAndZoom(point, 15);

	},

	zoomPlus : function(){
		map.zoomTo(map.getZoom() + 1);
	},

	zoomMinus : function(){
		map.zoomTo(map.getZoom() - 1);
	},

	deletePoint : function(){
	    var allOverlay = map.getOverlays();
	    for (var i = 0; i < allOverlay.length; i++){
	    	map.removeOverlay(allOverlay[i]);
	    }
	},
	changeChinaAddr : function(){
		var cd = $("#"+mypage.contract.form.divTag+" #chinaAddr1").val();
		var chinaAddr2List = mypage.contract.form.chinaAddrJson[cd];

		if(chinaAddr2List != undefined && chinaAddr2List != null && chinaAddr2List.length > 0){
			$("#"+mypage.contract.form.divTag+" #chinaAddr2").html("");

			var optionStr = "";
			for(var i=0; i<chinaAddr2List.length; i++){
				var chinaAddr2 = chinaAddr2List[i];
				optionStr+="<option value='"+chinaAddr2.cd+"'>"+chinaAddr2.cdNm+"</option>"
			}

			$("#"+mypage.contract.form.divTag+" #chinaAddr2").html(optionStr);
		}
	},
};