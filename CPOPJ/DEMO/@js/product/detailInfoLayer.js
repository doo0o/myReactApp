$.namespace("product.detailInfo");

product.detailInfo = {
	
	checkBuyClick : false,
		
	init : function() {

		product.detailInfo.bindEvent();
		//공유하기 팝업 초기화
		common.sns.init($("title").text(), location.href);
		//옵션/패키지 상세 팝업 이벤트 처리
		common.product.bindOptPkgDetailPop();
		//기본 제공 품목 처리
		common.product.bindBasicSuppliesPop();
		//트림계층컨텐츠 팝업 이벤트처리
		common.product.bindTrimHierarchyPop();
		//컬러컨텐츠 팝업 이벤트처리
		common.product.bindColorDetailPop();
		
		//override 삭제 콜백 동기화 처리
		common.garage.deleteMyGarageCheckSync = function(cartSeq) {
			$("#saveGarage").data("cartseq", null);
			$("#saveGarage").parent().find("input[type='checkbox']").prop("checked", false);
		};
	},
	
	bindEvent : function() {
		//SLIDE TYPE B - start
		$('#slide-b-sample .slide-cont').slick({
			infinite: false,
			dots: true
		})
		//SLIDE TYPE B - end

		$('#slide-b-sample .slide-cont').on("afterChange", function(event, slick, curSlide, nextSlide) {
			if (curSlide > 3) {
				$(".viewInterior").hide();
				$(".viewExterior").show();
			} else {
				$(".viewInterior").show();
				$(".viewExterior").hide();
			}
		});
		
		$(".viewInterior").on("click", function() {
			$('#slide-b-sample .slide-cont').slick("slickGoTo", 4);
		});

		$(".viewExterior").on("click", function() {
			$('#slide-b-sample .slide-cont').slick("slickGoTo", 0);
		});

		//snackbar
		function Snackbar() {
	    	var x = document.getElementById("snackbar")
	    	x.className = "show";
	    	setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
		}
//		Snackbar();
		
		$("#saveGarage").bind("click", function() {
			var cartSeq = $(this).data("cartseq");
			if (cartSeq != undefined && cartSeq != null && cartSeq != "") {
				param = { 
						cartSeq : cartSeq
				};
				common.garage.deleteMyGarageJson(param, product.detailInfo.deleteGarageCallBack);
			} else {
				var param = {
						salesCoCd : $("#salesCoCd").val(),
						carLine : $("#carLine").val(),
						salesSpecGrpCd : $("#salesSpecGrpCd").val(),
						mc : $("#mc").val(),
						grade : $("#grade").val(),
						fsc : $("#fsc").val(),
						salesTrim : $("#salesTrim").val(),
						intColorCd: $("#intColor").val(),
						extColorCd: $("#extColor").val(),
						optPkgCd: $("#optPkgCdVal").val()
				}

				common.garage.saveMyGarageJson(param, product.detailInfo.saveGarageCallback);				
			}
		});
	},
	
	saveGarageCallback : function(res) {
		common.garage.saveMyGarageJsonCallback(res);

		if(res && res.resultCode == common._jsonSuccessCd){ //SUCCESS
			
			var cartSeq = res.data.cartInfo.cartSeq;
			
			$("#saveGarage").data("cartseq", cartSeq);
			$("#saveGarage").parent().find("input[type='checkbox']").prop("checked", true);
			
			common.garage.getCarListJson(function() {
				//사이드바 표시
				$('.sideLayer').removeClass('sideLayer-toggle');
				//3초뒤 닫기.
				setTimeout(function() {
					$(".sideLayer .btn-close").click();
				}, 5000);
			});
		} else {
			$("#saveGarage").data("cartseq", null);
			$("#saveGarage").parent().find("input[type='checkbox']").prop("checked", false);
		}
	},
	
	deleteGarageCallBack : function(res) {
		common.garage.deleteMyGarageJsonCallback(res);

		if(res && res.resultCode == common._jsonSuccessCd){ //SUCCESS
		} else {
			$("#saveGarage").parent().find("input[type='checkbox']").prop("checked", true);
		}
	},
	
	directPurchase : function() {
		if (this.checkBuyClick) {
			return;
		}
		
		this.checkBuyClick = true;
		
		common.garage.directPurchase(
				$("#salesCoCd").val(), 
				$("#carLine").val(), 
				$("#salesSpecGrpCd").val(), 
				$("#mc").val(), 
				$("#salesTrim").val(),
				$("#grade").val(), 
				$("#fsc").val(), 
				$("#extColor").val(), 
				$("#intColor").val(),
				$("#optPkgCdVal").val()
		);
	}
	
};