$.namespace("product.rcmd.car");
product.rcmd.car = {
		
		// 초기화
		init : function(){
			
			//include 되어있어 display 상태인 div 영역 표시
			$("#recommendArea").show();
			
			//이벤트 바인딩
//			this.bindEvent();

			// Handlebars helper 추가
			common.handlebars.addHandlebarsHelper();
			
			// 내차고 조회
			this.getRcmdCarListJson();

		},
		
		bindEvent : function(){
			that = this;
		},

		bindEventRcmdCar : function(div){
			//추천차량 저장, 삭제
			div.addClass("eventBinded");
			div.find(".rcmdCar").click(function(e){
				if($(this).is(":checked")){
					
					var fsc = $(this).data("fsc");
					var salesCoCd = $(this).data("sales_co_cd");
					var carLine = $(this).data("car_line");
					var salesSpecGrpCd = $(this).data("sales_spec_grp_cd");
					var mc = $(this).data("mc");
					var grade = $(this).data("grade");
					var salesTrim = $(this).data("sales_trim");
					var intColorCd = $(this).data("int_color_cd");
					var extColorCd = $(this).data("ext_color_cd");
					var optPkgCd = $(this).data("opt_pkg_cd");
					
					var param = {
							fsc : fsc,
							salesCoCd : salesCoCd,
							carLine : carLine,
							salesSpecGrpCd : salesSpecGrpCd,
							mc : mc,
							grade : grade,
							salesTrim : salesTrim,
							intColorCd: intColorCd,
							extColorCd: extColorCd,
							optPkgCd: optPkgCd
					}
					
					common.garage.saveMyGarageJson(param, product.rcmd.car.saveMyGarageJsonCallback);
					
				}else{
					e.preventDefault();
					
					var cartSeq = $(this).data("cart_seq");
					
					if(cartSeq!=""){
						var param = {
								cartSeq : cartSeq
						};
						
						common.layerConfirm(_delConfirm, function(){
							common.garage.deleteMyGarageJson(param, common.garage.deleteMyGarageJsonCallback)
						});
						
					}
				}
			});
			
		},
		
		saveMyGarageJsonCallback : function(res){
			if(res && res.resultCode == common._jsonSuccessCd){ //SUCCESS
				var cartSeq = res.data.cartInfo.cartSeq;

				var fscKey = res.data.cartInfo.fsc+res.data.cartInfo.intColorCd+res.data.cartInfo.extColorCd;
				//fsc가 없는 BTO 차량에 대해서는 고려하지 않음 (해당화면에서 따로 처리)
				if(fscKey.length>=20){
					for(var i=0; i<$(".rcmdCar").length; i++){
						if($(".rcmdCar").eq(i).data("fsc_key")==fscKey){
							$(".rcmdCar").eq(i).data("cart_seq", cartSeq);
						}
					}
				}

				common.layerAlert(_sucsSaveCar);

				//내차고 수량 갱신
				common.garage.getCartCntJson();
				//내차고 목록 갱신 준비
				common.garage.isInit=true;
				if(!$(".sideLayer").hasClass("sideLayer-toggle")){
					//사이드바 열려있다면 내차고 사이드바 갱신
					common.garage.getCarListJson();
				}else{
					//아니라면 열린 후 닫힘
					common.garage.getCarListJson(function() {
						//사이드바 표시
						$('.sideLayer').removeClass('sideLayer-toggle');
						//3초뒤 닫기.
						setTimeout(function() {
							$(".sideLayer .btn-close").click();
							}, 5000);
						}
					);
				}
				
				common.garage.myCartSeqList = null;
				
			}else if(res && res.resultCode == 8913){ //이미 저장된 중복 차량
				//체크된 css(♥) 그대로 유지
				common.layerAlert(res.resultMessage);
			}else{
				common.garage.saveMyGarageFailure(res);
			}
		},

		// 내차고 조회
		getRcmdCarListJson : function() {
			var param = {}
			common.Ajax.sendRequest(
					"GET"
					, _baseUrl+"/product/getRcmdCarListJson.do"
					, param
					, product.rcmd.car.getRcmdCarListJsonCallback
					, true
					, false);
		},

		// 내차고 조회 callback
		getRcmdCarListJsonCallback : function(res) {
			// 오류처리
			if(res && res.resultCode == common._jsonSuccessCd){ //0000
				if (res.data) {
					var source = $("#common-rcmd-car-template").html();
					var template = Handlebars.compile(source);
					var html = template(res.data);
					$("#recommendList").html(html);
				}
				
				product.rcmd.car.bindEventRcmdCar($("#recommendList").find("li:not(.eventBinded)"));
					
			}else{ //9999
				common.layerAlert(res.resultMessage); //비정상적인 오류가 발생하였습니다.
				return;
			}
			
		},

};

