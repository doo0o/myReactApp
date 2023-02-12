$.namespace("mypage.main");
mypage.main = {
	
	//페이징 인덱스
	pageIdx : 1,
	rowsPerPage : 5,
	init : function(){
		
		//자동 스크롤 방지
		if ('scrollRestoration' in history) {
			  history.scrollRestoration = 'manual';
		}
		
		// 간편회원일 경우 개인정보 수정 진입 못함
		if (_memberCode == "0") {
			$("#contents > div > div.indivInfor > ul > li:nth-child(1) > a").hide();
		} else {
			$("#contents > div > div.indivInfor > ul > li:nth-child(1) > a").show();
		}
		
		// 회원연락처 표기룰 적용
		$(".indivBox").find("li").eq(1).find("span").text($(".indivBox").find("li").eq(1).find("span").text().replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
		
		//페이징 초기화
		PagingCaller.destroy();

		// Handlebars helper 추가
		common.handlebars.addHandlebarsHelper()
		
		mypage.main.bindEvent();
		
		// 계약 목록 조회
		this.getMyContractListJson();
	},
	
	bindEvent : function(){
		that = this;

		//내 시승이력
		$("#btn_testDriveForm").click(function(){
			common.link.moveMyTestDriveList();
		});
		
		//내 차고지
		$("#btn_myGarage").click(function(){
			common.link.moveMyGarage();
		});
		
		$("#btn_search").click(function(){
			mypage.main.getMyContractListJson(1);
		});
		
		$(".container").find(".contsArea").find(".indivInfor").find(".indivBox").find('a').click(function(){
			common.link.movePwdVerificationForm();
		});
		
//		$("#btn_quoteDtl").click(function(){
//			mypage.main.moveContractForm();
//		});
//		
//		$("#btn_cntrDtl").click(function(){
//			mypage.main.moveContractDetail();
//		});
		
	},
	
	// 계약 목록 조회
	getMyContractListJson : function(pageIdx) {
		if(pageIdx != undefined) {
			mypage.main.pageIdx = pageIdx;
			$(".orderBox").remove();
		}
/*		
		PagingCaller.init({
			callback : function(){
				var param = {
						pageIdx : mypage.main.pageIdx,
						rowsPerPage : mypage.main.rowsPerPage,
						searchType : $("#searchType").val(),
						startDate : $("#startDate").val(),
						endDate : $("#endDate").val()
				}
				common.Ajax.sendRequest(
						"POST"
						, _baseUrl+"mypage/getMyContractListJson.do"
						, param
						, mypage.main.getMyContractListJsonCallback
						, false
						, false
						,30000
					);
			}
		,startPageIdx : mypage.main.pageIdx
		,subBottomScroll : 250
		,initCall : mypage.main.pageIdx > 1 ? false : true
		});*/
		
		var param = {
				pageIdx : mypage.main.pageIdx,
				rowsPerPage : mypage.main.rowsPerPage,
				searchType : $("#searchType").val(),
				startDate : $("#startDate").val(),
				endDate : $("#endDate").val()
		}
		
		common.Ajax.sendRequest(
				"POST"
				, _baseUrl+"mypage/getMyContractListJson.do"
				, param
				, mypage.main.getMyContractListJsonCallback
				, false
				, false
				,30000
			);
	},


	// 계약 목록 조회 callback
	getMyContractListJsonCallback : function(res) {
		
		if(common.isLoginAjax(res)) {
			$("#viewMore").remove();
			
			if(mypage.main.pageIdx == 1) {
				if($("#noData").length >0) {
					$("#noData").remove();
				}
				if($("#recommendArea").length >0) {
					$("#recommendArea").remove();
				}
			}
			var resData = res.data;
			if(resData && (resData.length == 0) ){
				//페이징 끝
				console.log("===Paging End===");
//				PagingCaller.destroy();
			}else{
				
				if (resData && resData.contractList && resData.contractList.length>0) {
					var contractList = resData.contractList;
					var ordDeliList = resData.ordDeliList;
					var opOtdDtlList = resData.opOtdDtlList;
					var cancelContractBundleList = resData.cancelContractBundleList;
					
					var isMoreBtn = false;
					var contractCnt = resData.contractList.length;
					if(resData.contractList.length > mypage.main.rowsPerPage) {
						isMoreBtn = true;
						contractCnt = mypage.main.rowsPerPage;
					}
					
					for(var i=0 ; i<contractCnt ; i++) {
						
						if(contractList[i].originalContractId) {
							contractList[i].contractId = contractList[i].originalContractId;
						} else {
							contractList[i].contractId = contractList[i].id;
						}
						
						var contractTagId = "#contractId_" + contractList[i].contractId + " .contractList";
						
						if($(contractTagId) == 0  ) {
							continue;
						}
						
						if(contractList[i].status =='canceled' || contractList[i].recordType.name == 'Contract Cancel') {
							
							for(var j=0 ; j<cancelContractBundleList.length ; j++) {
								if(cancelContractBundleList[j].id = contractList[i].cancelContract.id) {
									contractList[i].cancelContract.cancelContractBundle = cancelContractBundleList[j];
									
									var description = cancelContractBundleList[j].description;
									var arrDescription = description.split(" ");
									if(arrDescription.length > 1) {
										contractList[i].model = arrDescription[0];
										contractList[i].power = arrDescription[1];
									}
								}
							}
							
							source = $("#contract-cancel-template").html();
							template = Handlebars.compile(source);
							html = template(contractList[i]);
							$("#alertArea").before(html);
							
						} else {
							
							
							var description = contractList[i].contractBundle.records[0].description;
							var arrDescription = description.split(" ");
							if(arrDescription.length > 1) {
								contractList[i].model = arrDescription[0];
								contractList[i].power = arrDescription[1];
								
							}
							
							var source = $("#contract-template").html();
							var template = Handlebars.compile(source);
							var html = template(contractList[i]);
							$("#alertArea").before(html);
							
							//잔금,잔금 전체금액 셋팅
							contractList[i].balanceTotal = contractList[i].fm_BalanceAmount + contractList[i].ru_OtherTotalAmount
							contractList[i].balance = contractList[i].fm_OutstandingBalance + contractList[i].fm_RemainedOtherBalanceAmount;
							
							
							//선수 미수금이 0원일 경우 계약 완료
							if(contractList[i].fm_OutstandingPrePaid == 0) {
								source = $("#contract-order-completed-template").html();
								template = Handlebars.compile(source);
								html = template(contractList[i]);
								$(contractTagId).append(html);
							} else {
								source = $("#contract-order-preparing-template").html();
								template = Handlebars.compile(source);
								html = template(contractList[i]);
								$(contractTagId).append(html);
							}
							
							//차량비용과 기타비용이 완료 되었을경우
							if(contractList[i].fm_PaymentCompleted == 'true' && contractList[i].fm_OtherPaymentCompleted=='true') {
								source = $("#contract-payment-completed-template").html();
								template = Handlebars.compile(source);
								html = template(contractList[i]);
								$(contractTagId).append(html);
							} else if(contractList[i].ru_BalanceSum == 0 && contractList[i].ru_OtherBalanceSum == 0) {
								source = $("#contract-payment-pending-template").html();
								template = Handlebars.compile(source);
								html = template(contractList[i]);
								$(contractTagId).append(html);
							} else {
								source = $("#contract-payment-paymenting-template").html();
								template = Handlebars.compile(source);
								html = template(contractList[i]);
								$(contractTagId).append(html);
							}
							

							var orders = contractList[i].orders;
							if(orders == undefined || orders.records == undefined || orders.records.length<1 || orders.records[0].status =='canceled') {
								//오더가 생성되지 않았을 경우 배송준비중
								otdStatus = _CODE_CCM_OTD_STATUS_READY;
								
								source = $("#contract-delivery-preparing-template").html();
								template = Handlebars.compile(source);
								html = template(contractList[i]);
								$(contractTagId).append(html);
								
							} else{
								
								var otdStatus = '';
								if(ordDeliList != undefined && ordDeliList.length>0)
								//배송중 상태 조회
								for(var j=0 ; j<ordDeliList.length ; j++) {
									
									if(contractList[i].id == ordDeliList[j].contractId ) {
										
										if(ordDeliList[j].delivery == undefined || ordDeliList[j].delivery.records == undefined) {
											otdStatus = _CODE_CCM_OTD_STATUS_READY;
											break;
										}
										var deliveryStatus = ordDeliList[j].delivery.records[0].deliveryStatus;
										
										if(deliveryStatus == 'Retail') {
											//배송완료
											otdStatus = _CODE_CCM_OTD_STATUS_DROP_OFF;
											contractList[i].customerDeliveryDate = ordDeliList[j].delivery.records[0].customerDeliveryDate;
											break;
										} else {
											//교부중
											otdStatus = _CODE_CCM_OTD_STATUS_CUSTOMER_DELIVERY;
											break;
										}
									}
									
								}
								
								if(opOtdDtlList != undefined && opOtdDtlList.length>0 && otdStatus != _CODE_CCM_OTD_STATUS_DROP_OFF ) {
									//CXP에서 교부 완료 및 교부중이 아닐 경우
									//OTD 상태 조회 상태 조회
									for(var j=0 ; j<opOtdDtlList.length ; j++) {
										if(opOtdDtlList[j].ivin == orders.records[0].internalVIN){
											
											//오더가 생성되고 배송준비중 - 배송 내역 조회 가능
											contractList[i].otdDtl = opOtdDtlList[j];
											
											if((opOtdDtlList[j].cdDt && opOtdDtlList[j].cdDt != '00000000')
												|| (opOtdDtlList[j].otdCd == _CODE_CCM_OTD_STATUS_DROP_OFF)
												){
												//OTD 일자가 우선
												if(opOtdDtlList[j].otdCd == _CODE_CCM_OTD_STATUS_DROP_OFF) {
													
													contractList[i].otdDtl.cdDt = opOtdDtlList[j].actDt;
												}
												
												//재고 데이터에서 배송완료 이거나 OTD Status 에서 배송 완료일 경우 배송 완료
												otdStatus = _CODE_CCM_OTD_STATUS_DROP_OFF;
												break;
											} else if (otdStatus == _CODE_CCM_OTD_STATUS_CUSTOMER_DELIVERY) {
												//CXP에서 교부중일 경우 교부중 처리
												break;
											} else {
												
												if ((opOtdDtlList[j].gateOutDt && opOtdDtlList[j].gateOutDt != '00000000')
														|| (opOtdDtlList[j].otdCd == _CODE_CCM_OTD_STATUS_GATE_OUT)	
												){
													//재고 데이터에서 Gate OUT이거나 OTD Status 에서 Gate OUT일 경우 배송 중
													otdStatus = _CODE_CCM_OTD_STATUS_GATE_OUT;
													break;
												} else {
													otdStatus = opOtdDtlList[j].otdCd;
													break;
												}
											}
										} 
									}
								}
							
								contractList[i].otdStatus = otdStatus;
								
								var source;
//								if(otdStatus == '') {
//									//배송 준비 중
//									source = $("#contract-delivery-preparing-template").html();
//								} else {
									if(otdStatus == _CODE_CCM_OTD_STATUS_DROP_OFF) {
										//배송완료
										source = $("#contract-delivery-finsh-template").html();
									} else if(otdStatus == _CODE_CCM_OTD_STATUS_GATE_OUT){
										//배송 중
										source = $("#contract-delivery-progress-template").html();
									} else if(otdStatus == _CODE_CCM_OTD_STATUS_CUSTOMER_DELIVERY){
										// 교부 중
										source = $("#contract-delivery-issue-template").html();
									} else {
										//배송 준비 중
										source = $("#contract-delivery-preparing-template").html();
									}
									
									var template = Handlebars.compile(source);
									var html = template(contractList[i]);
									$(contractTagId).append(html);
//								}
							}
						}
					}
					if(isMoreBtn) {
						
						var source = $("#contract-viewMore").html();
						var template = Handlebars.compile(source);
						var html = template();
						
						$("#alertArea").before(html);
//						$("#viewMore").on("click" , function(e) { mypage.main.getMyContractListJson(); });
						
						mypage.main.pageIdx++;
					
					}
					
					$("#alertArea").show();
					
				} else {
					if(mypage.main.pageIdx == 1) {
						var source = $("#contract-noData-template").html();
						var template = Handlebars.compile(source);
						var html = template(null);
						$("#alertArea").before(html);
						
						$("#alertArea").hide();
						
						product.rcmd.car.init();
					}
				}
			}
		}		
	},

	// 계약 목록 조회
	layerPopOpenDeliveryInfo : function(contractId) {
		var param = {
				contractId : contractId
		}
//        common.showLoadingBar(false, (1000*60*3));
		common.Ajax.sendRequest(
				"POST"
				, _baseUrl+"mypage/getMyContractDeliveryAjax.do"
				, param
				, mypage.main.getMyContractDeliveryAjaxCallback
				, true
				, false);
	},
	
	getMyContractDeliveryAjaxCallback : function(res){
		//기존 레이어 삭제
		$("#layerPop-deliInfo").remove();
		
		//새 레이어 생성
		$("#container").after(res);
		
		layerPopOpen("layerPop-deliInfo");
	},
	
};
