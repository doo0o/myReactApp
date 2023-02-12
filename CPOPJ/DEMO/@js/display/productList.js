$.namespace("display.productList");
display.productList = {
	
	pDispCatNo : "",
	pageIdx : 1,
	rowsPerPage : 18,
	likeThat : null,
	filterTp : '',
	paramDummy : '',
	filterStickyTop : '',
		
	init : function(pDispCatNo){
		var that = this;
		this.pDispCatNo = pDispCatNo;
		this.filterStickyTop = $('.filterSticky').offset().top;
		
		window.onpageshow = function(event) {
			// 히스토리 백 진입
			if(event.persisted || (window.performance && window.performance.navigation.type == 2)) {
				if(sessionStorage.getItem('gugContents') != null){
					display.productList.paramDummy = JSON.parse(sessionStorage.getItem("paramDummy"));
					// 저장된 HTML로 복원
					that.setHistoryBack();
					// 이벤트
					that.bindEvent();
					// Handlebars helper 추가
					common.handlebars.addHandlebarsHelper();
					display.productList.initProductList(sessionStorage.getItem("pageIdx"));
				}else{
					// 커스텀 셀렉트 생성
					customSelect.init('#carSelect','0',true);
					customSelect.init('#yearSelect','1',true);
					customSelect.init('#sortbyrecomm','2',true);
					// 카종/년식 설정
					that.carSelectSet();
				}
			}else{
				// 커스텀 셀렉트 생성
				customSelect.init('#carSelect','0',true);
				customSelect.init('#yearSelect','1',true);
				customSelect.init('#sortbyrecomm','2',true);
				// 세션스토리지 삭제
				display.productList.delGugSessionStorage();
				// 카종/년식 설정
				that.carSelectSet();
			}
		};
		//기본 제공 품목 처리
		common.product.bindBasicSuppliesPop();
		// 스넥바
		this.snackbar();
		// 이벤트
		this.bindEvent();
		// Handlebars helper 추가
		common.handlebars.addHandlebarsHelper();
		//override 삭제 콜백 동기화 처리
		common.garage.deleteMyGarageCheckSync = function(cartSeq) {
			var cartSeqObj = $("input[name='cartSeq'][value='" + cartSeq + "']");
			cartSeqObj.closest("li").find(".like input[type='checkbox']").prop("checked", false);
			cartSeqObj.val("");
		};
	},
	
	bindEvent : function(){
		that = this;
		// 차종 변경(PC)
		$('#carSelect').off('change');
		$('#carSelect').on('change', function(e){
			var selectOptionText = e.currentTarget.selectedOptions[0].text;
			$(this).parents('#customSelect-0').find('.custom-select-trigger').text(selectOptionText);
			
			var carSelValArr = $(this).val().split('|');
			var cDispCatNo = carSelValArr[0];
			var cDispCatNoIdx = 0;
			
			// 차종 선택시 관련 년도 활성/비활성 후 최초 필터/차량목록 가져오기
			$('#yearSelect option').attr('selected', false);
			$('#yearSelect option').each(function(index){
				var yearSelValArr = $(this).val().split('|');
				if(cDispCatNo == yearSelValArr[0]){
					if(cDispCatNoIdx == 0){
						cDispCatNoIdx++;
						$(this).parents('#customSelect-1').find('.custom-select-trigger').text($(this).text());
						$(this).attr('selected', true);
					}
					$(this).show();
				}else{
					$(this).hide();
				}
			});
			
			display.productList.filterSet('rs');
			//페이징 초기화 및 1페이지 로딩
			display.productList.initProductList(1);
		});
		// 차종 변경(모바일)
		$('#customSelect-0 .custom-options span').off('click');
		$('#customSelect-0 .custom-options span').on('click', function(){
			$(this).parents(".custom-select-wrapper").find("select").val($(this).data("value"));
			$(this).parents(".custom-options").find(".custom-option").removeClass("selection");
			$(this).addClass("selection");
			$(this).parents(".custom-select").removeClass("opened");
			$(this).parents(".custom-select").find(".custom-select-trigger").text($(this).text());
			
			var carSelValArr = $(this).data('value').split('|');
			var cDispCatNo = carSelValArr[0];
			var cDispCatNoIdx = 0;
			// 차종 선택시 관련 년도 활성/비활성 후 최초 필터/차량목록 가져오기
			$('#customSelect-1 .custom-options span').each(function(index){
				var yearSelValArr = $(this).data('value').split('|');
				if(cDispCatNo == yearSelValArr[0]){
					if(cDispCatNoIdx == 0){
						cDispCatNoIdx++;
						$(this).click();
					}
					$(this).show();
				}else{
					$(this).hide();
				}
			});
			
			display.productList.filterSet('rs');
			//페이징 초기화 및 1페이지 로딩
			display.productList.initProductList(1);
		});
		// 년도 변경(모바일)
		$('#yearSelect').off('change');
		$('#yearSelect').on('change', function(e){
			var selectOptionText = e.currentTarget.selectedOptions[0].text;
			$(this).parents('#customSelect-1').find('.custom-select-trigger').text(selectOptionText);
			
			display.productList.filterSet('rs');
			//페이징 초기화 및 1페이지 로딩
			display.productList.initProductList(1);
		});
		// 년도 변경(PC)
		$('#customSelect-1 .custom-options span').off('click');
		$('#customSelect-1 .custom-options span').on('click', function(){
			$(this).parents(".custom-select-wrapper").find("select").val($(this).data("value"));
			$(this).parents(".custom-options").find(".custom-option").removeClass("selection");
			$(this).addClass("selection");
			$(this).parents(".custom-select").removeClass("opened");
			$(this).parents(".custom-select").find(".custom-select-trigger").text($(this).text());
			
			display.productList.filterSet('rs');
			//페이징 초기화 및 1페이지 로딩
			display.productList.initProductList(1);
		});
		// 필터레이어 confirm 버튼 활성화
		$('.slide-a .slick-list input:radio, .slide-a .slick-list input:checkbox').off('click');
		$('.slide-a .slick-list input:radio, .slide-a .slick-list input:checkbox').on('click', function(){
			$(this).closest('.slide-a').find('.btnArea .btn').attr('disabled',false);
		});
		// 필터레이어 confirm 버튼 클릭
		$('.slide-a .btnArea .btn').off('click');
		$('.slide-a .btnArea .btn').on('click', function(){
			$(this).closest('.slide-a').find('.btnArea .btn').attr('disabled',false);
			
			var selId = $(this).closest('.slide-a').attr('id');
			
			if(selId == 'slide-carOptionSelect-powerTrains'){
				display.productList.filterTp = 'PT';
			}else if(selId == 'slide-colorOptionSelect'){
				display.productList.filterTp = 'EC';
			}else if(selId == 'slide-carOptionSelect-wheel'){
				display.productList.filterTp = 'WH';
			}else if(selId == 'slide-carOptionSelect-interiorColor'){
				display.productList.filterTp = 'IC';
			}else if(selId == 'slide-carOptionSelect-packages'){
				display.productList.filterTp = 'PK';
			}
			display.productList.filterSet();
			//페이징 초기화 및 1페이지 로딩
			display.productList.initProductList(1);
		});
		// 필터 리셋
		$('.btn-resetFilter').off('click');
		$('.btn-resetFilter').on('click', function(){
			$('[name = "carOptionSelect-powerTrain"]').attr('checked', false);
			$('[name = "carOptionSelect-powerTrain"]').prop('checked', false);
			$('[name = "colorSelect"]:checked').attr('checked', false);
			$('[name = "colorSelect"]:checked').prop('checked', false);
			$('[name = "carOptionSelect-wheel"]:checked').attr('checked', false);
			$('[name = "carOptionSelect-wheel"]:checked').prop('checked', false);
			$('[name = "carOptionSelect-intColor"]:checked').attr('checked', false);
			$('[name = "carOptionSelect-intColor"]:checked').prop('checked', false);
			$('[name = "carOptionSelect-packages"]').attr('checked', false);
			$('[name = "carOptionSelect-packages"]').prop('checked', false);
			
			$(window).scrollTop(0);
			display.productList.pageIdx = 1;
			$('.menu-filterSelect-result .btnArea .btn')[0].click();
		});
		// 정렬 변경
		$('#sortbyrecomm').off('change');
		$('#sortbyrecomm').on('change', function(e){
			var selectOptionText = e.currentTarget.selectedOptions[0].text;
			$(this).parents('#customSelect-2').find('.custom-select-trigger').text(selectOptionText);
			//페이징 초기화 및 1페이지 로딩
			display.productList.initProductList(1);
		});
		// 정렬 변경
		$('#customSelect-2 .custom-options span').off('click');
		$('#customSelect-2 .custom-options span').on('click', function(){
			$(this).parents(".custom-select-wrapper").find("select").val($(this).data("value"));
			$(this).parents(".custom-options").find(".custom-option").removeClass("selection");
			$(this).addClass("selection");
			$(this).parents(".custom-select").removeClass("opened");
			$(this).parents(".custom-select").find(".custom-select-trigger").text($(this).text());
			
			//페이징 초기화 및 1페이지 로딩
			display.productList.initProductList(1);
		})
		// 차고 저장/삭제
		$('.recommendList .like input[type="checkbox"]').off('change');
		$('.recommendList .like input[type="checkbox"]').on('change',function(){
			var idx = $('.recommendList .like input[type="checkbox"]').index(this);
			display.productList.likeThatIdx = idx;
			var param = {
					 salesCoCd : $('[name = "salesCoCd"]')[idx].value	
					,carLine  : $('[name = "carLine"]')[idx].value
					,salesSpecGrpCd : $('[name = "salesSpecGrpCd"]')[idx].value
					,fsc : $('[name = "fsc"]')[idx].value
					,mc : $('[name = "mc"]')[idx].value
					,grade : $('[name = "grade"]')[idx].value
					,salesTrim : $('[name = "salesTrim"]')[idx].value
					,intColorCd : $('[name = "intColor"]')[idx].value
					,extColorCd : $('[name = "extColor"]')[idx].value
			}
			if($(this).is(":checked")){
				$(this).attr("checked", true);
				// 저장
				common.garage.saveMyGarageJson(param, display.productList.saveMyGarageJsonCallBack);
			}else{
				$(this).attr("checked", false);
				var cartSeq = $('input[name = "cartSeq"]').eq(display.productList.likeThatIdx).val();
				param = { 
						cartSeq : cartSeq
				};
				// 삭제
				common.garage.deleteMyGarageJson(param, display.productList.deleteMyGarageJsonCallBack);
			}
		});
		// viewSpec 버튼 클릭
		$('.viewSpecBtn').off('click');
		$('.viewSpecBtn').on('click', function(){
			var idx = $('.viewSpecBtn').index(this);
			
			var carLine = $('[name = "carLine"]').eq(idx).val();
			var salesSpecGrpCd = $('[name = "salesSpecGrpCd"]').eq(idx).val();
			var modelYear = $('[name = "modelYear"]').eq(idx).val();
			var mc = $('[name = "mc"]').eq(idx).val();
			var grade = $('[name = "grade"]').eq(idx).val();
			var fsc = $('[name = "fsc"]').eq(idx).val();
			var salesTrim = $('[name = "salesTrim"]').eq(idx).val();
			var extColor = $('[name = "extColor"]').eq(idx).val();
			var intColor = $('[name = "intColor"]').eq(idx).val();
			var optPkgCdVal = '';
			
			sessionStorage.setItem('gugContents', $('#contents').html());
			// 스펙상세 이동
			common.link.moveProductDetail(carLine, salesSpecGrpCd, modelYear, mc, grade, fsc, salesTrim, extColor, intColor, optPkgCdVal);
		});
		// 더보기
		$('#more').off('click');
		$('#more').on('click', function(){
			display.productList.pageIdx++;
			display.productList.initProductList();
		});
	},
	
	initProductList : function(firstPage) {
		if(typeof firstPage != 'undefined'){
			display.productList.pageIdx = firstPage;
		}
		
		if (display.productList.pageIdx > 1) {
			display.productList.productListAjax();
		} else {
			display.productList.productFilterListAjax();
		}
	}, 
	
	deleteMyGarageJsonCallBack : function(res) { 
		//TODO 권성균님 만들고나면 할것..
	},
	/*
		메인 필터 영역 선택값 세팅 및 초기화
	 */
	filterSet : function(rs){
		
		if($('[name = "carOptionSelect-powerTrain"]:checked').val() && typeof rs == 'undefined'){
			var selEngine = $('[name = "carOptionSelect-powerTrain"]:checked');
			$('.menu-filterSelect .powerTrain .thumb').html('<img src="'+selEngine.siblings().find('.thumb >img').attr('src').replace(/(\-)[a-z](.png)$/,'$1'+'s'+'$2')+'" alt="'+selEngine.siblings().find('.inner >strong').text()+'">');
			$('.menu-filterSelect .powerTrain .txt >em').text(selEngine.siblings().find('.inner >strong').text());
		}else{
			$('[name = "carOptionSelect-powerTrain"]').attr('checked', false);
			$('[name = "carOptionSelect-powerTrain"]').prop('checked', false);
			$('.menu-filterSelect .powerTrain .thumb').html('');
			$('.menu-filterSelect .powerTrain .txt >em').text('');
		}
		if($('[name = "colorSelect"]:checked').val() && typeof rs == 'undefined'){
			var selExtColor = $('[name = "colorSelect"]:checked');
			$('.menu-filterSelect .exteriorColor .thumb').html('<img src="'+selExtColor.siblings('.box').find('img').attr('src')+'" alt="'+selExtColor.siblings('.box').find('img').attr('alt')+'">');
			$('.menu-filterSelect .exteriorColor .txt >em').text(selExtColor.siblings('.box').find('img').attr('alt'));
		}else{
			$('[name = "colorSelect"]:checked').attr('checked', false);
			$('[name = "colorSelect"]:checked').prop('checked', false);
			$('.menu-filterSelect .exteriorColor .thumb').html('');
			$('.menu-filterSelect .exteriorColor .txt >em').text('');
		}
		if($('[name = "carOptionSelect-wheel"]:checked').val() && typeof rs == 'undefined'){
			var selWheel = $('[name = "carOptionSelect-wheel"]:checked');
			$('.menu-filterSelect .wheels .thumb').html('<img src="'+selWheel.siblings().find('.thumb >img').attr('src').replace(/(\-)[a-z](.png)$/,'$1'+'s'+'$2')+'" alt="'+selWheel.siblings().find('.inner >strong').text()+'">');
			$('.menu-filterSelect .wheels .txt >em').text(selWheel.siblings().find('.inner >strong').text());
		}else{
			$('[name = "carOptionSelect-wheel"]:checked').attr('checked', false);
			$('[name = "carOptionSelect-wheel"]:checked').prop('checked', false);
			$('.menu-filterSelect .wheels .thumb').html('');
			$('.menu-filterSelect .wheels .txt >em').text('');
		}
		if($('[name = "carOptionSelect-intColor"]:checked').val() && typeof rs == 'undefined'){
			var selIntColor = $('[name = "carOptionSelect-intColor"]:checked');
			$('.menu-filterSelect .interiorTrim .thumb').html('<img src="'+selIntColor.siblings().find('.thumb >img').attr('src').replace(/(\-)[a-z](.png)$/,'$1'+'s'+'$2')+'" alt="'+selIntColor.siblings().find('.inner >strong').text()+'">');
			$('.menu-filterSelect .interiorTrim .txt >em').text(selIntColor.siblings().find('.inner >strong').text());
		}else{
			$('[name = "carOptionSelect-intColor"]:checked').attr('checked', false);
			$('[name = "carOptionSelect-intColor"]:checked').prop('checked', false);
			$('.menu-filterSelect .interiorTrim .thumb').html('');
			$('.menu-filterSelect .interiorTrim .txt >em').text('');
		}
		if($('[name = "carOptionSelect-packages"]:checked').val() && typeof rs == 'undefined'){
			var selPackage = $('[name = "carOptionSelect-packages"]:checked');
			$('.menu-filterSelect .packages .thumb').html('<img src="'+selPackage.siblings().find('.thumb >img').attr('src').replace(/(\-)[a-z](.png)$/,'$1'+'s'+'$2')+'" alt="'+selPackage.siblings().find('.inner >strong').text()+'">');
			$('.menu-filterSelect .packages .txt >em').text(selPackage.siblings().find('.inner >strong').text());
		}else{
			$('[name = "carOptionSelect-packages"]').attr('checked', false);
			$('[name = "carOptionSelect-packages"]').prop('checked', false);
			$('.menu-filterSelect .packages .thumb').html('');
			$('.menu-filterSelect .packages .txt >em').text('');
		}
	},
	/*
		차고 저장 콜백처리
	 */
	saveMyGarageJsonCallBack : function(res){
		if(res && res.resultCode == 0000){ //SUCCESS
			var cartSeq = res.data.cartInfo.cartSeq;
			
			$('input[name = "cartSeq"]').eq(display.productList.likeThatIdx).val(cartSeq);
			//내차고 수량 갱신
			common.garage.getCartCntJson();
			//내차고 목록 갱신 준비
			common.garage.isInit=true;
			common.garage.getCarListJson(function() {
				//사이드바 표시
				$('.sideLayer').removeClass('sideLayer-toggle');
				//3초뒤 닫기.
				setTimeout(function() {
					$(".sideLayer .btn-close").click();
				}, 5000);
			});
			
		}else if(res && res.resultCode == 8913){ //이미 저장된 중복 차량
			//체크된 css(♥) 그대로 유지
			common.layerAlert(res.resultMessage);
		}else{
			
			var sessionCartInfo = JSON.parse(sessionStorage.getItem("cartInfo"));
			var sessionFscKey = sessionCartInfo.fsc+'|'+sessionCartInfo.extColorCd+'|'+sessionCartInfo.intColorCd; 
			var fscKey = sessionFscKey;
			
			for(var i=0; i<$(".like").length; i++){
				if($(".like").eq(i).data("chkkey")==fscKey){
					//체크 된 css(♥) 원복(v)
					$(".like").eq(i).find('input[type=checkbox]').attr("checked", false);
					$(".like").eq(i).find('input[type=checkbox]').prop("checked", false);
				}
			}
			common.layerAlert(res.resultMessage);
		}
	},
	/*
		차종 선택시 세팅
	 */
	carSelectSet : function(){
		// 레이어셀렉트(PC)
		$('#customSelect-0 .custom-options span').each(function(){
			var carSelValArr = $(this).data('value').split('|');
			var dispCatNo = carSelValArr[0];
			if(display.productList.pDispCatNo == dispCatNo){
				$(this).click();
				
				$('#customSelect-1 .custom-options span').each(function(){
					var yearSelValArr = $(this).data('value').split('|');
					var check = 0;
					if(dispCatNo == yearSelValArr[0]){
						if(check == 0){
							$(this).click();
						}
						check++;
						$(this).show();
					}else{
						$(this).hide();
					}
				});
			}
		});
		// 일반셀렉트(모바일)
		$('#carSelect option').each(function(){
			var carSelValArr = $(this).val().split('|');
			var dispCatNo = carSelValArr[0];
			if(display.productList.pDispCatNo == dispCatNo){
				$(this).attr('selected', true);
				
				$('#yearSelect option').each(function(){
					var yearSelValArr = $(this).val().split('|');
					var check = 0;
					if(dispCatNo == yearSelValArr[0]){
						if(check == 0){
							$(this).parents('#customSelect-1').find('.custom-select-trigger').text($(this).text());
							$(this).attr('selected', true);
						}
						check++;
						$(this).show();
					}else{
						$(this).hide();
					}
				});
			}
		});
		
		// 차량 필터 목록 조회
//		display.productList.productFilterListAjax();
		display.productList.initProductList(1);
	},
	/*
		차량 필터 목록 조회 AJAX
	 */
	productFilterListAjax : function(){
		var url = _baseUrl+"disp/productFilterListAjax";

		var yearSelValArr = $('#yearSelect').val().split('|');
		var carLine = yearSelValArr[1];
		var salesSpecGrpCd = yearSelValArr[2];
		var modelYear = yearSelValArr[3];
		var engineCd = !$('[name = "carOptionSelect-powerTrain"]:checked').val() ? '' : $('[name = "carOptionSelect-powerTrain"]:checked').val();
		var extColor = !$('[name = "colorSelect"]:checked').val() ? '' : $('[name = "colorSelect"]:checked').val();
		var wheelCd = !$('[name = "carOptionSelect-wheel"]:checked').val() ? '' : $('[name = "carOptionSelect-wheel"]:checked').val();
		var intColor = !$('[name = "carOptionSelect-intColor"]:checked').val() ? '' : $('[name = "carOptionSelect-intColor"]:checked').val();
		var sortBy = $('#sortbyrecomm').val();
		var pkgOptCdArr = "";
		$('[name = "carOptionSelect-packages"]').each(function(){
			if(this.checked){
				pkgOptCdArr += "," + this.value;
			}
		});
		pkgOptCdArr = pkgOptCdArr.replace(",","");
		
		$('.basicSuppliesPop').attr('data-carline',carLine);
		$('.basicSuppliesPop').attr('data-salesspecgrpcd',salesSpecGrpCd);
		
		sessionStorage.setItem("pageIdx", display.productList.pageIdx);
		
		var param ={
				carLine : carLine
				,salesSpecGrpCd : salesSpecGrpCd
				,modelYear : modelYear
				,engineCd : engineCd
				,extColor : extColor
				,wheelCd : wheelCd
				,intColor : intColor
				,pkgOptCdArr : pkgOptCdArr
				,sortBy : sortBy
				,pageIdx : display.productList.pageIdx
				,rowsPerPage : display.productList.rowsPerPage
				,filterTp : display.productList.filterTp
		};
		display.productList.paramDummy = param;
		sessionStorage.setItem("paramDummy", JSON.stringify(display.productList.paramDummy));
		
		common.Ajax.sendRequest("GET", url, param, this.productFilterListAjaxCallBack);
	},
	/*
		차량 목록 조회 AJAX
	 */
	productListAjax : function(){
		var url = _baseUrl+"disp/productListAjax";
		
		var yearSelValArr = $('#yearSelect').val().split('|');
		var carLine = yearSelValArr[1];
		var salesSpecGrpCd = yearSelValArr[2];
		var modelYear = yearSelValArr[3];
		var engineCd = !$('[name = "carOptionSelect-powerTrain"]:checked').val() ? '' : $('[name = "carOptionSelect-powerTrain"]:checked').val();
		var extColor = !$('[name = "colorSelect"]:checked').val() ? '' : $('[name = "colorSelect"]:checked').val();
		var wheelCd = !$('[name = "carOptionSelect-wheel"]:checked').val() ? '' : $('[name = "carOptionSelect-wheel"]:checked').val();
		var intColor = !$('[name = "carOptionSelect-intColor"]:checked').val() ? '' : $('[name = "carOptionSelect-intColor"]:checked').val();
		var sortBy = $('#sortbyrecomm').val();
		var pkgOptCdArr = "";
		$('[name = "carOptionSelect-packages"]').each(function(){
			if(this.checked){
				pkgOptCdArr += "," + this.value;
			}
		})
		pkgOptCdArr = pkgOptCdArr.replace(",","");
		
		sessionStorage.setItem("pageIdx",display.productList.pageIdx);
		
		var param ={
				carLine : carLine
				,salesSpecGrpCd : salesSpecGrpCd
				,modelYear : modelYear
				,engineCd : engineCd
				,extColor : extColor
				,wheelCd : wheelCd
				,intColor : intColor
				,pkgOptCdArr : pkgOptCdArr
				,sortBy : sortBy
				,pageIdx : display.productList.pageIdx
				,rowsPerPage : display.productList.rowsPerPage
		};
		
		common.Ajax.sendRequest("GET", url, param, this.productFilterListAjaxCallBack);
	},
	/*
		차량 필터 목록 조회 AJAX 콜백처리
	 */
	productFilterListAjaxCallBack : function(rs){
		//console.log(JSON.stringify(rs));
		if(rs.resultCode && rs.resultCode != '0000'){
			alert(rs.resultMessage);
			return false;
		}
		if(rs.data){
			// engine
			if(rs.data.filterTrimEnginList){
				if(rs.data.filterTrimEnginList.length <= 0){
					$('.menu-filterSelect .powerTrain').hide();
					$("#slide-carOptionSelect-powerTrains").html('');
				}else{
					$('.menu-filterSelect .powerTrain').show();
					// 이전 선택값 
					var selEngine;
					if($('[name = "carOptionSelect-powerTrain"]:checked').val()){
						selEngine = $('[name = "carOptionSelect-powerTrain"]:checked').val();
					}
					// slick 초기화
					$('#slide-carOptionSelect-powerTrains .slide-cont').slick('unslick');
					// 템플릿 세팅
					var source = $("#filter-powerTrain-template").html();
					var template = Handlebars.compile(source);
					var data = {
							engineList : rs.data.filterTrimEnginList
					}
					var html = template(data);
					$("#slide-carOptionSelect-powerTrains").html('');
					$("#slide-carOptionSelect-powerTrains").append(html);
					// 이전 선택값 세팅
					$('[name = "carOptionSelect-powerTrain"]').each(function(){
						if($(this).val() == selEngine){
							$(this).attr("checked", true);
							$("#slide-carOptionSelect-powerTrains .btnArea .btn").attr('disabled',false);
						}
					});
					sessionStorage.setItem('carOptionSelect-powerTrain', $("#slide-carOptionSelect-powerTrains").html());
				}
			}
			// exterior color		
			if(rs.data.filterExtColorList){
				if(rs.data.filterExtColorList.length <= 0){
					$('.menu-filterSelect .exteriorColor').hide();
					$("#slide-colorOptionSelect").html('');
				}else{
					$('.menu-filterSelect .exteriorColor').show();
					// 이전 선택값 
					var extColor;
					if($('[name = "colorSelect"]:checked').val()){
						extColor = $('[name = "colorSelect"]:checked').val();
					}

					// slick 초기화
					$('#slide-colorOptionSelect .slide-cont').remove();
					
					var extColorListTmp = new Array();
					var extColorListLength = rs.data.filterExtColorList.length;
					
					for(var i = 0; i < extColorListLength ; i++){
						extColorListTmp.push(rs.data.filterExtColorList[i]);
						
						if(i == 0){
							$("#slide-colorOptionSelect .slide-wrapper").append('<div class="slide-cont"></div>');
						}
						var stepNm = parseInt((i+1)/10)	;
						if((i != 0 && i+1 == stepNm*10) || extColorListLength == 1 || (i != 0 && i+1 == extColorListLength)){
							
							var source = $("#filter-extColor-template").html();
							var template = Handlebars.compile(source);
							var data = {
									extColorList : extColorListTmp
							}
							
							var html = template(data);
							$("#slide-colorOptionSelect .slide-cont").append(html);
							
							extColorListTmp = new Array();
						}
					}
					// 이전 선택값 세팅
					$('[name = "colorSelect"]').each(function(){
						if($(this).val() == extColor){
							$(this).attr("checked", true);
							$(this).prop("checked", true);
							$("#slide-colorOptionSelect .btnArea .btn").attr('disabled',false);
						}
					});
					sessionStorage.setItem('colorOptionSelect', $('#slide-colorOptionSelect').html());
				}
			}
			// wheel			
			if(rs.data.filterTrimWheelsList){
				if(rs.data.filterTrimWheelsList.length <= 0){
					$('.menu-filterSelect .wheels').hide();
					$("#slide-carOptionSelect-wheel").html('');
				}else{
					$('.menu-filterSelect .wheels').show();
					// 이전 선택값 
					var wheel;
					if($('[name = "carOptionSelect-wheel"]:checked').val()){
						wheel = $('[name = "carOptionSelect-wheel"]:checked').val();
					}
					// slick 초기화
					$('#slide-carOptionSelect-wheel .slide-cont').remove();
					// 템플릿 세팅
					var source = $("#filter-wheel-template").html();
					var template = Handlebars.compile(source);
					var data = {
							wheelList : rs.data.filterTrimWheelsList
					}
					var html = template(data);
					$("#slide-carOptionSelect-wheel").html('');
					$("#slide-carOptionSelect-wheel").append(html);
					// 이전 선택값 세팅
					$('[name = "carOptionSelect-wheel"]').each(function(){
						if($(this).val() == wheel){
							$(this).attr("checked", true);
							$("#slide-carOptionSelect-wheel .btnArea .btn").attr('disabled',false);
						}
					});
					sessionStorage.setItem('carOptionSelect-wheel', $("#slide-carOptionSelect-wheel").html());
				}
			}
			// interior color	
			if(rs.data.filterIntColorlsList){
				if(rs.data.filterIntColorlsList.length <= 0){
					$('.menu-filterSelect .interiorTrim').hide();
					$("#slide-carOptionSelect-interiorColor").html('');
				}else{
					$('.menu-filterSelect .interiorTrim').show();
					// 이전 선택값 
					var intColor;
					if($('[name = "carOptionSelect-intColor"]:checked').val()){
						intColor = $('[name = "carOptionSelect-intColor"]:checked').val();
					}
					// slick 초기화
					$('#slide-carOptionSelect-interiorColor .slide-cont').remove();
					
					var source = $("#filter-intColor-template").html();
					var template = Handlebars.compile(source);
					var data = {
							intColorList : rs.data.filterIntColorlsList
					}
					var html = template(data);
					$("#slide-carOptionSelect-interiorColor").html('');
					$("#slide-carOptionSelect-interiorColor").append(html);
					// 이전 선택값 세팅
					$('[name = "carOptionSelect-intColor"]').each(function(){
						if($(this).val() == intColor){
							$(this).attr("checked", true);
							$("#slide-carOptionSelect-interiorColor .btnArea .btn").attr('disabled',false);
						}
					});
					sessionStorage.setItem('carOptionSelect-intColor', $("#slide-carOptionSelect-interiorColor").html());
				}
			}
			// package
			if(rs.data.filterPackageList){
				if(rs.data.filterPackageList.length <= 0){
					$('.menu-filterSelect .packages').hide();
					$("#slide-carOptionSelect-packages").html('');
				}else{
					$('.menu-filterSelect .packages').show();
					
					var pkgOptCdArr = new Array();
					$('[name = "carOptionSelect-packages"]').each(function(){
						if(this.checked){
							pkgOptCdArr.push($(this).val());
						}
					});
					// slick 초기화
					$('#slide-carOptionSelect-packages .slide-cont').remove();
					// 템플릿 세팅
					var source = $("#filter-package-template").html();
					var template = Handlebars.compile(source);
					var data = {
							packageList : rs.data.filterPackageList
					}
					var html = template(data);
					$("#slide-carOptionSelect-packages").html('');
					$("#slide-carOptionSelect-packages").append(html);
					// 이전 선택값 세팅
					$('[name = "carOptionSelect-packages"]').each(function(){
						var that = this;
						var pkg = $(that).val();
						pkgOptCdArr.forEach(function(v){
							if(pkg == v){
								$(that).attr("checked", true);
								$("#slide-carOptionSelect-packages .btnArea .btn").attr('disabled',false);
							}					
						});
					});
					sessionStorage.setItem('carOptionSelect-packages', $("#slide-carOptionSelect-packages").html());
				}
			}
			// product list
			if(rs.data.productList){
				$('.recommendArea').show();
				var source = $("#productList-template").html();
				var template = Handlebars.compile(source);
				var data = {
						productList : rs.data.productList
				}
				var html = template(data);
				// more 동작 일 경우
				if(display.productList.pageIdx != 1){
					$(".recommendArea .recommendList").append(html);
				}else{
					$(".recommendArea .recommendList").html(html);
				}
			}else{
				$('.recommendArea').hide();
				$(".recommendArea .recommendList").html('');
			}
			// pasing
			if(!rs.data.paging){
				$('#more').hide();
			} 
			
			if(rs.data.paging.totalCount <= rs.data.paging.endRowNo){
				$('#more').hide();
			}else{
				$('#more').show();
			}
			
			if(rs.data.filterTrimEnginList || rs.data.filterExtColorList || rs.data.filterTrimWheelsList || rs.data.filterIntColorlsList || rs.data.filterPackageList){
				filterBar_setting.init();
				display.productList.filterTp = '';
			}
			display.productList.bindEvent();
			$('.filterBar .btn-close').click();
			
			common.setLazyloadImg("car");
			
//			$('.imgArea:eq(0) .thumb img:eq(0)').attr('src',$('.imgArea:eq(0) .thumb img:eq(0)').data('original'));
			//내차고 저장버튼 설정
			common.garage.getMyCartSeqList(function() {
				if (common.garage.myCartSeqList == null) {
					return;
				}
				
				for (i = 0; i < common.garage.myCartSeqList.length; i++) {
					var tmpChkKey = common.garage.myCartSeqList[i].fsc + "|" + common.garage.myCartSeqList[i].extColorCd + "|" + common.garage.myCartSeqList[i].intColorCd;
					var tmpObj = $(".recommendList").find(".like[data-chkkey='" + tmpChkKey + "']");
					tmpObj.find("input[type='checkbox']").prop("checked", true);
					tmpObj.closest("li").find("input[name='cartSeq']").val(common.garage.myCartSeqList[i].cartSeq);
				}
			});
		}
	},
	/*
		히스토리 백으로 온 경우 세션스토리지에서 
	 */
	setHistoryBack : function(){
		$('#contents').html(sessionStorage.getItem('gugContents'));
		
		$('#slide-carOptionSelect-powerTrains').html('');
		$('#slide-carOptionSelect-powerTrains').html(sessionStorage.getItem('carOptionSelect-powerTrain'));
		
		$('#slide-colorOptionSelect').html('');
		$('#slide-colorOptionSelect').html(sessionStorage.getItem('colorOptionSelect'));
		
		$('#slide-carOptionSelect-wheel').html('');
		$('#slide-carOptionSelect-wheel').html(sessionStorage.getItem('carOptionSelect-wheel'));
		
		$('#slide-carOptionSelect-interiorColor').html('');
		$('#slide-carOptionSelect-interiorColor').html(sessionStorage.getItem('carOptionSelect-intColor'));
		
		$('#slide-carOptionSelect-packages').html('');
		$('#slide-carOptionSelect-packages').html(sessionStorage.getItem('carOptionSelect-packages'));
		
		filterBar_setting.init();
		display.productList.setFilterLayerPopConfrimSel('slide-carOptionSelect-powerTrains');
		display.productList.setFilterLayerPopConfrimSel('slide-colorOptionSelect');
		display.productList.setFilterLayerPopConfrimSel('slide-carOptionSelect-wheel');
		display.productList.setFilterLayerPopConfrimSel('slide-carOptionSelect-interiorColor');
		display.productList.setFilterLayerPopConfrimSel('slide-carOptionSelect-packages');
		
		customSelect.init('#carSelect','0',false);
		customSelect.init('#yearSelect','1',false);
		customSelect.init('#sortbyrecomm','2',false);
	},
	/*
		세션스토리지 삭제 
	 */
	delGugSessionStorage : function(){
		sessionStorage.removeItem('gugContents');
		sessionStorage.removeItem('carOptionSelect-powerTrain');
		sessionStorage.removeItem('colorOptionSelect');
		sessionStorage.removeItem('carOptionSelect-wheel');
		sessionStorage.removeItem('carOptionSelect-intColor');
		sessionStorage.removeItem('carOptionSelect-packages');
		sessionStorage.removeItem("pageIdx");
		sessionStorage.removeItem("paramDummy");
	},
	/*
		필터 레이어팝업 컨펌한 선택값으로 재설정
	 */
	setFilterLayerPopConfrimSel : function(curId){
		// 더미 파라미터 json
		var paramDummy = display.productList.paramDummy;
		// 컨펌버튼 활성화여부
		var confirmBtnBl = false;
		
		if(paramDummy != ''){
			if(curId == 'slide-carOptionSelect-powerTrains'){
				$('[name = "carOptionSelect-powerTrain"]').each(function(){
					if($(this).val() == paramDummy.engineCd){
						$(this).attr('checked',true);
						$(this).prop('checked',true);
						confirmBtnBl = true;
					}else{
						$(this).attr('checked',false);
						$(this).prop('checked',false);
					}
				});
			}else if(curId == 'slide-colorOptionSelect'){
				$('[name = "colorSelect"]').each(function(){
					if($(this).val() == paramDummy.extColor){
						$(this).attr('checked',true);
						$(this).prop('checked',true);
						confirmBtnBl = true;
					}else{
						$(this).attr('checked',false);
						$(this).prop('checked',false);
					}
				});
			}else if(curId == 'slide-carOptionSelect-wheel'){
				$('[name = "carOptionSelect-wheel"]').each(function(){
					if($(this).val() == paramDummy.wheelCd){
						$(this).attr('checked',true);
						$(this).prop('checked',true);
						confirmBtnBl = true;
					}else{
						$(this).attr('checked',false);
						$(this).prop('checked',false);
					}
				});
			}else if(curId == 'slide-carOptionSelect-interiorColor'){
				$('[name = "carOptionSelect-intColor"]').each(function(){
					if($(this).val() == paramDummy.intColor){
						$(this).attr('checked',true);
						$(this).prop('checked',true);
						confirmBtnBl = true;
					}else{
						$(this).attr('checked',false);
						$(this).prop('checked',false);
					}
				});
			}else if(curId == 'slide-carOptionSelect-packages'){
				var pkgOptCdArrT = paramDummy.pkgOptCdArr.split(',');
				$('[name = "carOptionSelect-packages"]').each(function(){
					var that = this;
					var pkgVal = $(that).val();
					if(pkgOptCdArrT.length > 0){
						pkgOptCdArrT.forEach(function(v, index){
							if(pkgVal == v){
								$(that).attr('checked',true);
								$(that).prop('checked',true);
								confirmBtnBl = true;
							}else{
								$(that).attr('checked',false);
								$(that).prop('checked',false);
							}
						})
					}else{
						$(that).attr('checked',false);
						$(that).prop('checked',false);
					}
				});
			}
			if(confirmBtnBl){
				$('#'+curId+' .btnArea .btn').attr('disabled',false);
			}else{
				$('#'+curId+' .btnArea .btn').attr('disabled',true);
			}
		}
	},
	/*
		snackbar
	*/
	snackbar : function() {
		var x = document.getElementById("snackbar")
		if (x != undefined && x != null) {
			x.className = "show";
			setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
		}
	},
};
/*
	필터바 세팅
*/
var filterBar_setting = {
		init: function(){
			setTimeout(function(){
				filterBar_setting.resize();
			},300);
			$('.filterBar .btn-filters').off('click');
			$('.filterBar .btn-filters').on('click',function(){
				$('.filterBar').toggleClass('expansion');
				
				if($('html').hasClass('filterBar-open')){
					$('html').removeClass('filterBar-open');
					$('.filterBar').removeClass('expansion');
					$('.filterBar').removeClass('open');
                    
				}else{
					if($('.filterBar').hasClass('expansion')){
						objScrollTop($('.filterSticky'));
					}
					
					
				}
				filterBar_setting.resize();
			});
			$(window).on('resize',function(){
				filterBar_setting.resize();
			});
			
			if(display.productList.filterTp != 'PT'){
				filterBar_setting.slick_setting('slide-carOptionSelect-powerTrains');
			}
			if(display.productList.filterTp != 'WH'){
				filterBar_setting.slick_setting('slide-carOptionSelect-wheel');
			}
			if(display.productList.filterTp != 'IC'){
				filterBar_setting.slick_setting('slide-carOptionSelect-interiorColor');
			}
			if(display.productList.filterTp != 'PK'){
				filterBar_setting.slick_setting('slide-carOptionSelect-packages');
			}
			if(display.productList.filterTp != 'EC'){
				filterBar_setting.slick_setting_colorType('slide-colorOptionSelect');
			}

			var filterStickyTop = display.productList.filterStickyTop;
//			$('html').removeClass('filter-sticky');
			$(window).on('scroll',function(){
//				headerFooterControl.init();
				console.log(filterStickyTop)
				console.log(window.scrollY)
				if(filterStickyTop > window.scrollY){
					if($('html').hasClass('filter-sticky')){
						$('html').removeClass('filter-sticky');
					}
				}else{
					$('html').addClass('filter-sticky');
				}
			})
			
			$('[name = "filterSelect"]').on('change',function(e){
				var cId = $('.menu-filterSelect-result>.on').attr('id');
				// 필터 레이어팝업 컨펌한 선택값으로 재설정
				display.productList.setFilterLayerPopConfrimSel(cId);
				
				var active = $(e.target.parentElement).index() + 1;
				
				$('.filterBar').addClass('open');
                $('html').addClass('filterBar-open');
				$('.menu-filterSelect-result>*').removeClass('on');
				$('.menu-filterSelect-result>*:nth-child(' + active + ')').addClass('on');
				$('html').addClass('filterBar-open');
				//objScrollTop($('.filterSticky'));
			})
			$('.filterBar .cont>label>span').on('click',function(e){
				if($(this).parent().find('input').prop('checked')){
					$('.filterBar').removeClass('open');
					$('html').removeClass('filterBar-open');
					$('[name = "filterSelect"]:checked').prop('checked',false);
					e.preventDefault();
				}
			})

			$('[name = "filterSelect"]:checked').trigger('change');//디폴트로 체크된거 적용

			$('.filterBar .btn-close,.btn-resetFilter').on('click',function(){
				var cId = $('.menu-filterSelect-result>.on').attr('id');
				// 필터 레이어팝업 컨펌한 선택값으로 재설정
				display.productList.setFilterLayerPopConfrimSel(cId);
				
				$('.filterBar').removeClass('open');
				$('html').removeClass('filterBar-open');
				$('[name = "filterSelect"]:checked').prop('checked',false);
			})
		},
		resize: function(){
//			var top = $('.menu-filterSelect-ui').offset().top + $('.menu-filterSelect-ui').innerHeight();
//			$('.menu-filterSelect-result').css('top',top + 'px');
		},
		slick_setting: function(slick_id){
			/*if(!$('#' + slick_id + ' .slide-cont').slick('slickRemove')){
				$('#' + slick_id + ' .slide-cont').slick('slickRemove');
			}*/
			if($('#' + slick_id + ' .slide-cont').length > 0){
				$('#' + slick_id + ' .slide-cont').slick({
					infinite: false,
					slidesToShow: 3,
					slidesToScroll: 3,
					dots: true,
					accessibility:true,
					responsive: [
					{
					  breakpoint: 768,
					  settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
					  }
					}]
				});
				//모바일에서만 자동선택되게 하는거 start
				enquire.register("screen and (min-width: 768px)", {
					match : function() {
						carOptionSelect_AutoCheck_remove()
					},
					unmatch : function() {
						carOptionSelect_AutoCheck();
					},
					setup : function() {
						carOptionSelect_AutoCheck();
					},
				});
			}
			function carOptionSelect_AutoCheck(){
				$('#' + slick_id + ' .slide-cont').on('beforeChange', function(event, slick, currentSlide, nextSlide){
				  //console.log(nextSlide);

				  var carCheckItemArr = $('#' + slick_id).find('input[type="radio"]')
				  $(carCheckItemArr[nextSlide]).attr('checked',true);

				});
			}
			function carOptionSelect_AutoCheck_remove(){
				$('#' + slick_id + ' .slide-cont').off('beforeChange');
			}
		},
		slick_setting_colorType: function(slick_id){

			if($('#' + slick_id + ' .list label').length > 10){
				$('#' + slick_id + ' .slick-next').remove();
				$('#' + slick_id + ' .slick-prev').remove();
				$('#' + slick_id + ' .slide-cont').slick({
					infinite: false,
					slidesToScroll: 1,
					dots: true
				});
			}else{
				$('#' + slick_id + ' .colorSelectGroup .list').slick({
					infinite: false,
					slidesToShow: 5,
					slidesToScroll: 1,
					dots: true
				});
				$('#' + slick_id + ' .slick-next').insertAfter('#' + slick_id + ' .slide-cont')
				$('#' + slick_id + ' .slick-prev').insertAfter('#' + slick_id + ' .slide-cont')

			}
		}
	}
