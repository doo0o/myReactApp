$.namespace("mypage.garage");
mypage.garage = {
		
		//페이징 인덱스
		pageIdx : 1,
		//페이징 수
		rowsPerPage : 5,
		
		isEmptyGarage : false,
		
		loadedCartSeq : new Array(),
		
		// 초기화
		init : function(){
			//새로고침시 스크롤 자동이동 방지 (항상 최상단으로 이동)
			if ('scrollRestoration' in history) {
				  history.scrollRestoration = 'manual';
			}
			
			//이벤트 바인딩
			this.bindEvent();
			
			//페이징 초기화
//			PagingCaller.destroy();

			// Handlebars helper 추가
			common.handlebars.addHandlebarsHelper();
			this.addHandlebarsHelper();
			
			// 내차고 조회
			this.getCarListJson();
		},
		
		bindEvent : function(){
			that = this;
			
			//비교하기
			$("#btnCpr").click(function(e){
				e.preventDefault();
				
				if($("input[type=checkbox][name=cartSeq]:checked").length<2){
					return;
				}
				
				if($("input[type=checkbox][name=cartSeq]:checked").length>2){
					common.layerAlert(_errCmprCarMax);
					return;
				}
				
				var cartSeqArr = "";
				$("input[type=checkbox][name=cartSeq]:checked").each(function(){
					cartSeqArr += $(this).val() + ",";
				});
				
				if(cartSeqArr.length>0){
					cartSeqArr = cartSeqArr.substring(0, cartSeqArr.length-1);
				}
				
				var param = {
						cartSeqArr : cartSeqArr
				}
				mypage.garage.getMyGarageCompareAjax(param);
			});
			
			
			//Get Your Genesis
			$("#noData #btnGoGenesis").click(function(e){
				common.link.subMain();
			});
		},
		
		//비교하기 레이어 팝업 이벤트 바인딩
		bindEventCompare : function(div){
			//비교하기 창닫기
			div.find("#btnClose").click(function(e){
				e.preventDefault();
				layerPopClose("layerPop-cprVehicle");
			});
			
			//구매하기
			div.find("[id*=btnBuy]").click(function(e){
				e.preventDefault();
				var id = $(this).attr("id");
				var cartSeq = id.split("_")[1];
				
				common.link.moveContractForm(cartSeq);
			});
		},

		//---------------------------------------
		// 이벤트 바인딩
		//---------------------------------------
		bindEventCartList : function(div){
			//내차고 이벤트
			div.addClass("eventBinded");
			//단일구성 삭제하기
			div.find("[id*=btnDel]").click(function(e){
				e.preventDefault();
				
				var cartSeq = $(this).data("cart_seq");
				
				var param = {
						cartSeq : cartSeq
				};
				
				common.layerConfirm(_delConfirm, function(){
					common.garage.deleteMyGarageJson(param, common.garage.deleteMyGarageJsonCallback)
					});
			});
			
			//더보기-구매상담
			div.find("[id*=btnCnsl]").click(function(e){
				e.preventDefault();
				common.link.moveConsultForm();
			});
			//더보기-시승신청
			div.find("[id*=btnTstDrv]").click(function(e){
				e.preventDefault();
				var carLineNm = $(this).data("car_line_nm");
				common.link.testDriveForm(carLineNm);
			});
			//더보기-금융계산
			div.find("[id*=btnPayEst]").click(function(e){
				e.preventDefault();
				var id = $(this).attr("id");
				var cartSeq = id.split("_")[1];
				var param = {
						cartSeq : cartSeq
				};
				common.layerAlert("layerPopOpen(\"금융계산레이어 id\")\nparam: "+cartSeq);
//				mypage.garage.getFinanceCalcAjax(param);
			});
			
			//차량구성 다시하기
			div.find("[id*=btnRequote]").click(function(e){
				e.preventDefault();
				
				var carLine = $(this).data("carline"); 
				var salesSpecGrpCd = $(this).data("salesspecgrpcd"); 
				var modelYear = $(this).data("modelyear"); 
				var mc = $(this).data("mc"); 
				var grade = $(this).data("grade"); 
				var fsc = $(this).data("fsc"); 
				var salesTrim = $(this).data("salestrim"); 
				var extColor = $(this).data("extcolor"); 
				var intColor = $(this).data("intcolor"); 
				var optPkgCdVal = $(this).data("optpkgcdval"); 
				
				common.link.configDetailSet(carLine, salesSpecGrpCd, modelYear, mc, grade, fsc, salesTrim, extColor, intColor, optPkgCdVal);
			});
			
			//구매하기
			div.find("[id*=btnBuy]").click(function(e){
				e.preventDefault();
				var id = $(this).attr("id");
				var cartSeq = id.split("_")[1];
				
				common.link.moveContractForm(cartSeq);
			});
			
			//View Details 클릭시 상세정보 조회
			div.find("[id*=btnCartInfo]").click(function(e){
				if(!$(this).parent().hasClass("loaded")){
					var id = $(this).attr("id");
					var cartSeq = id.split("_")[1];
					var param = {
							cartSeq : cartSeq,
					};
					mypage.garage.getMyGarageDetailInfoJson(param);
				}
			});
			
			//체크박스 2개 이상시 비교하기 버튼 표시 
			div.find("input[type=checkbox][name=cartSeq]").change(function(){
				if($("input[type=checkbox][name=cartSeq]:checked").length>=2){
					$("#btnCpr").removeAttr("disabled");
				}else{
					$("#btnCpr").attr("disabled", "disabled");
				}
				
				// 체크시 갈색 테두리 생성
				$(this).parent().parent().toggleClass('chked');
			});
			
			//==Template 사용으로 인해 미적용된 퍼블 스크립트==//
			//내차고 .dropUp 버튼
			div.find("[id*=dropbtn]").click(function(e) {
				e.preventDefault();
				var id = $(this).attr("id");
				var cartSeq = id.split("_")[1];
				if($("#dropup-content_"+cartSeq).hasClass("active")){
					$("[id*=dropup-content]").removeClass("active");
				}else{
					$("[id*=dropup-content]").removeClass("active");
					$("#dropup-content_"+cartSeq).addClass("active");
				}
			});
		},

		// 내차고 조회
		getCarListJson : function() {
//			pageIdx = PagingCaller.curPageIdx;
//			PagingCaller.init({
//				callback : function(){
//					var param = {
//							pageIdx : PagingCaller.curPageIdx,
//							rowsPerPage : mypage.garage.rowsPerPage,
//					}
//					common.Ajax.sendRequest(
//							"GET"
//							, _baseUrl+"mypage/garage/getMyGarageListJson.do"
//							, param
//							, mypage.garage.getCarListJsonCallback
//							, false
//							, false);
//				}
//			,startPageIdx : pageIdx
//			,subBottomScroll : 250
//			,initCall : PagingCaller.curPageIdx > 1 ? false : true
//			});
//		}
			
			var param = {
				pageIdx : mypage.garage.pageIdx,
				rowsPerPage : mypage.garage.rowsPerPage,
			}
			
			common.Ajax.sendRequest(
					"GET"
					, _baseUrl+"mypage/garage/getMyGarageListJson.do"
					, param
					, mypage.garage.getCarListJsonCallback
					, false
					, false);
		},

		// 내차고 조회 callback
		getCarListJsonCallback : function(res) {
			// 오류처리
			if(res && res.resultCode == common._jsonSuccessCd){ //0000
				
				$("#viewMore").remove();
				
				if(res.data && res.data.cartListCnt == 0){
					//빈차고
//					PagingCaller.destroy();
					mypage.garage.isEmptyGarage=true;
					
					product.rcmd.car.init();
					
					$("#noData").show();
					$("#recommendArea").show();
					$("#contsArea").hide();
					
				}else{
					mypage.garage.isEmptyGarage=false;
					$("#totalCnt").text(res.data.cartListCnt);
					if( !res.data.cartList || res.data.cartList.length == 0 ){
						//페이징 끝
//						PagingCaller.destroy();
					}else{
						var isMoreBtn = true;
						
						 if(res.data.cartList < mypage.garage.rowsPerPage ||
								(res.data.cartListCnt / ( (mypage.garage.pageIdx-1) * mypage.garage.rowsPerPage + res.data.cartList.length)) == 1){
							//전체 / (pageIdx-1 * rowsPerPage + 결과값 수) = 1이면 최종페이지
//							PagingCaller.destroy();
							 $("#viewMore").remove();
							isMoreBtn = false;
						 }
						 
						//내차고
						$("#noData").hide();
						$("#recommendArea").hide();
						$("#contsArea").show();
						
						if (res.data) {
							var source = $("#cartList-template").html();
							var template = Handlebars.compile(source);
							//화면에 하나씩 그리기 위해서 반복은 handlebar가 아닌 script에서 처리
                            outer : for(var i=0; i<res.data.cartList.length ; i++){
                                
                                //동일한 cartSeq가 화면에 그려져 있을 경우 대비한 방어코드
                                inner : for(var j=0; j<$("input[type=checkbox][name=cartSeq]").length; j++){
                                    var cartSeq = $("input[type=checkbox][name=cartSeq]").eq(j).val();
                                    if(cartSeq == res.data.cartList[i].cartSeq){
                                        continue outer;
                                    }
                                }
							
								var html = template(res.data.cartList[i]);
								$("#alertArea").before(html);
							}
							mypage.garage.bindEventCartList($("#alertArea").parent().find(".vehicleList:not(.eventBinded)"));
						}
						
						 if(isMoreBtn) {
								
								var source = $("#garage-viewMore").html();
								var template = Handlebars.compile(source);
								var html = template();
								
								$("#alertArea").before(html);
								$("#viewMore").on("click" , function(e) { mypage.garage.getCarListJson(); });
								
								mypage.garage.pageIdx++;
						}
					}
				}
			}else{ //9999
				common.layerAlert(res.resultMessage); //비정상적인 오류가 발생하였습니다.
				return;
			}
			
			common.setLazyloadImg("car");
		},
		
		getMyGarageDetailInfoJson : function(param){
			//다중로딩 방지 위해 조회된 차량번호 배열로 확인
			if(mypage.garage.loadedCartSeq.indexOf(param.cartSeq)<0){
				mypage.garage.loadedCartSeq.push(param.cartSeq);
				common.Ajax.sendRequest("POST"
						, _baseUrl+"mypage/garage/getMyGarageDetailInfoJson.do"
						, param
						, mypage.garage.getMyGarageDetailInfoJsonCallback
						, true
						, true
				);
			}
		},
		
		getMyGarageDetailInfoJsonCallback : function(res){
			if(res && res.resultCode == common._jsonSuccessCd){ //0000
				if(res.data && res.data.cartInfo){
					//내차고
					
					if (res.data) {
						var source = $("#cartInfo-template").html();
						var template = Handlebars.compile(source);
						var html = template(res.data.cartInfo);
						$("#btnCartInfo_"+res.data.cartInfo.cartSeq).siblings(".cont").find(".table").append(html);
						//신규 생성된 부분에 대한 이벤트 바인드
						$("#btnCartInfo_"+res.data.cartInfo.cartSeq).parent().addClass("loaded");
						//ⓘ버튼트림계층컨텐츠 팝업 이벤트처리
						common.product.bindTrimHierarchyPop();
						//ⓘ버튼컬러컨텐츠 팝업 이벤트처리
						common.product.bindColorDetailPop();
						//ⓘ버튼 옵션/패키지 상세 팝업 이벤트 처리
						common.product.bindOptPkgDetailPop();
					}
				}
			}else{ //9999
				common.layerAlert(res.resultMessage); //비정상적인 오류가 발생하였습니다.
				return;
			}
		},
		
		//내차고 비교하기
		getMyGarageCompareAjax : function(param){
//			common.showLoadingBar(false, (1000*60*3));
			common.Ajax.sendRequest("POST"
					, _baseUrl+"mypage/garage/getMyGarageCompareAjax.do"
					, param
					, mypage.garage.getMyGarageCompareAjaxCallback
					, true
					, false
			);
		},

		//내차고 비교하기 Callback
		getMyGarageCompareAjaxCallback : function(res){
			
			var resHtml = $.parseHTML(res);
			if(res && resHtml && resHtml[2].value == 0000){
				//기존 레이어 삭제
				$("#layerPop-cprVehicle").remove();
				
				//새 레이어 생성
				$("#container").after(res);
				
				//레이어 팝업
				layerPopOpen("layerPop-cprVehicle");
//			common.hideLoadingBar(null);
				
				mypage.garage.bindEventCompare($("#layerPop-cprVehicle"));
			}else{
				common.layerAlert(_errCmprUnexpected);
			}
			
		},
		
		//금융계산
		getFinanceCalcAjax : function(param){
			common.Ajax.sendRequest("POST"
					, _baseUrl+"finance/getFinanceCalcAjax.do"
					, param
					, mypage.garage.getFinanceCalcAjaxCallback
			);
		},
		
		//금융계산 Callback
		getFinanceCalcAjaxCallback : function(res){
			layerPopOpen("fncCalcLayer");
			$("#fncCalcLayer").html(res);
			$("#fncCalcLayer").show();
			$("#contsArea").hide();
		},

		// handlebar helper 등록
		addHandlebarsHelper : function() {
			
			//패키지&옵션 처리
			Handlebars.registerHelper("itemInfo", function(itemInfoList, carLine, salesSpecGrpCd) {
				if(itemInfoList.length<=3){
					//Trim, Exterior Color, Interior Color 일 경우
					return;
				}else{
					var out = "";
					var isFirst = true;
					
					out+="<div class=\"row\">\n" +
					"<div class=\"cell\">"+_packages+"</div>\n" +
					"<div class=\"cell\">\n";
					
					for(var i=0; i<itemInfoList.length; i++){
						
						if(itemInfoList[i].itemTp=="004" || itemInfoList[i].itemTp=="005"){
							
							out+="<div class=\"innerRow\">"+itemInfoList[i].itemNm+"\n";
							
							//ⓘ상세 팝업 버튼 생성
							if(itemInfoList[i].itemContCd != null){
								out+="<a id=\"btnPopOptDtl_"+itemInfoList[i].itemContCd+"\" href=\"javascript:;\" class=\"detailView optPkgDetailPop\"" +
									"data-pkgcd=\""+itemInfoList[i].itemContCd+"\" data-carline=\""+carLine+"\" data-salesSpecGrpCd=\""+salesSpecGrpCd+"\">\n" +
									"</a>\n";
							}
							
							//가격 0원 이상일 시만 가격 표시
							if(itemInfoList[i].unitPrc>0){
								out+="<span class=\"cPrice\">"+_currencySymbol+toCurrencyDecimal(itemInfoList[i].unitPrc, 2)+"</span>\n" ;
							}
							
							//패키지 내 옵션 정보 존재시 표시 TODO
							if(itemInfoList[i].pkgOptList.length>0){
								out+="<!--  s: innerRow -->\n" +
								"<ul class=\"listLine\">\n";
								for(var j=0; j<itemInfoList[i].pkgOptList.length; j++){
									out+="<li>"+itemInfoList[i].pkgOptList[j].pkgOptNm+"\n";
									//ⓘ상세 팝업 버튼 생성
									if(itemInfoList[i].pkgOptList[j].pkgOptContCd != null){
										out+="<a id=\"btnPopOptDtl_"+itemInfoList[i].pkgOptList[j].pkgOptContCd+"\" href=\"javascript:;\" class=\"detailView optPkgDetailPop\"" +
											"data-optcd=\""+itemInfoList[i].pkgOptList[j].pkgOptContCd+"\" data-carline=\""+carLine+"\" data-salesSpecGrpCd=\""+salesSpecGrpCd+"\">\n" +
											"</a>\n";
									}
									out+="</li>\n";
								}
								out+="</ul>\n" +
								"<!--  e: innerRow -->\n";
							}
							out+="</div>\n";
						}
					}
					out+="</div>\n";
				}
				return out;
			});
			
		},

};

