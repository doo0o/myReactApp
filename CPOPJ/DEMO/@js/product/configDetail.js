$.namespace("product.configDetail");
product.configDetail = {
	
	pSalesTrim : '',
	pCarLine : '',
	pSalesSpecGrpCd : '',
	pMc : '',
	pGrade : '',
	pFsc : '',
	pSalesTrim : '',
	pExtColor : '',
	pIntColor : '',
	pSalesSpecGrpCd : '',
	pOptPkgCdVal : '',
	hierachyTp : '',
	orgLvl1Seq : '1',
	lvl1Seq : '1',
	configOptPkgConstraint : {},
	configAvailOptPkgListTmp : {},
	layerpopId : '',
	hierchyTrimSingle : true,
	isConfigSet : false,
		
	init : function(pCarLine, pSalesSpecGrpCd, pMc, pGrade, pFsc, pSalesTrim, pExtColor, pIntColor, pOptPkgCdVal){
		
		this.pCarLine = pCarLine;
		this.pSalesSpecGrpCd = pSalesSpecGrpCd;
		this.pMc = pMc;
		this.pGrade = pGrade;
		this.pFsc = pFsc;
		this.pSalesTrim = pSalesTrim;
		this.pExtColor = pExtColor;
		this.pIntColor = pIntColor;
		this.pOptPkgCdVal = pOptPkgCdVal;
		
		// 초기 구성 데이타 가져오기
		this.configInfoAjax();
		//커스텀셀렉트
		customSelect.init('#carLineSelect',1,true);
		// 스낵바
		this.snackbar();
		// 공통핸들러바 이벤트
		common.handlebars.addHandlebarsHelper();
		// 이벤트
		this.bindEvent();
		//override 삭제 콜백 동기화 처리
		common.garage.deleteMyGarageCheckSync = function(cartSeq) {
			if (cartSeq == $('input[name = "cartSeq"]').val()) {
				$('input[name = "cartSeq"]').val("");
				
				$('#likeBtn').prop("checked", false);
			}
		};
		
		// 구성 계층 스크롤 세팅
		enquire.register("screen and (min-width: 768px)", {
			match : function() {
				optionSelectScroll_init();
			},
			unmatch : function() {
				optionSelectScroll_destroy();
				// console.log('destroy');
			}
		});
	},
	
	bindEvent : function(){
		that = this;
		// 차종변경(모바일)
		$('#carLineSelect').off('change');
		$('#carLineSelect').on('change', function(e){
			var selectOptionText = e.currentTarget.selectedOptions[0].text;
			$(this).parents('#customSelect-1').find('.custom-select-trigger').text(selectOptionText);
			
			common.link.configDetail(e.currentTarget.selectedOptions[0].value);
		});
		
		// 차종변경(PC)
		$('#customSelect-1 .custom-options span').off('click');
		$('#customSelect-1 .custom-options span').on('click', function(){
			$(this).parents(".custom-select-wrapper").find("select").val($(this).data("value"));
			$(this).parents(".custom-options").find(".custom-option").removeClass("selection");
			$(this).addClass("selection");
			$(this).parents(".custom-select").removeClass("opened");
			$(this).parents(".custom-select").find(".custom-select-trigger").text($(this).text());
			
			common.link.configDetail($(this).data("value"));
		});
		
		//edit 완료 상태에서 리스트 클릭시 선택모드로 변경, detailView(팝업여는거)가 있을경우 실행
		$('#optionSelectScroll .edit, .detailView').off('click');
		$('#optionSelectScroll .edit, .detailView').on('click',function(e){
			// 선택된 상태인 경우
			if($(this).closest('li').hasClass('selectComple')){
				var id = $(this).closest('li').attr('id');
				// 패키지 구성 제외인 경우
				if(id != 'optSelectTap-packages'){
					$(this).closest('li').removeClass('selectComple');
					var selIdx = $('#optionSelectScroll .edit').index(this);
					// 선택한 edit보다 밑에 있는 구성 닫기
					$('#optionSelectScroll ul li').each(function(idx){
						if(selIdx < idx){
							$(this).removeClass('on selectComple');
							$(this).find('.detailView').hide();
							// 체크 초기화
							$(this).find('.view input:radio').prop('checked',false);
							// 클릭이벤트 발생시켜 현제 구성 재설정
//							$('#optionSelectScroll .list-dropdown-b .view input:radio').index(selIdx).change();
						}
						if(selIdx == idx){
							$(this).find('.view input:radio').prop('checked',false);
						}
					});

					var selLi = $('#optionSelectScroll ul li').eq(selIdx-1);
					
					// 상위 구성으로 갱신
					$('input[name="extColorPrice"]').val('');
					$('input[name="intColorPrice"]').val('');
					$('input[name="optPkgCdArr"]').val('');
					product.configDetail.lvl1Seq = '1';
					product.configDetail.layerpopId = $(this).closest('li').data('layerpopId');
					
					// 다음 구성항목이 패키지인 경우 NEXT/CONSULT 버튼 비활성화
					$('#likeBtn').prop('checked', false);
					$('[name="cartSeq"]').val('');
					$('#likeBtn').attr('disabled',true);
					$('#shareBtn').addClass('disabled');
					$('#consultBtn').attr('disabled',true);
					$('#nextBtn').attr('disabled',true);

					if(selIdx == 0){
						// 상위 구성으로 갱신
						product.configDetail.configInfoAjax();
					}else{
						$(selLi).find('.view input[type="radio"]:checked').change();
					}
				}else{
					
					layerPopOpen('layerPop-SelectPackages');
				}
			}else{
				layerPopOpen($(this).closest('li').data('layerpopId'));
			}
		});
		
		// 차량구성 계층 선택시
		$('#optionSelectScroll .list-dropdown-b .view input:radio').off('change');
		$('#optionSelectScroll .list-dropdown-b .view input:radio').on('change',function(e){
			var hierachyTp = $(this).closest('li').data('hierachyTp');
			var orgSelLvl1Seq = $(this).closest('li').data('lvl1Seq');
			var selLvl1Seq = $(this).closest('li').next().data('lvl1Seq');
			
			product.configDetail.hierachyTp = hierachyTp; 
			product.configDetail.orgLvl1Seq = orgSelLvl1Seq; 
			product.configDetail.lvl1Seq = selLvl1Seq; 

			$(this).closest('li').find('.selectComple-view .txt').text($(this).data('lvlValDesc'));
			
			if($(this).closest('li').find('.selectComple-view img').length > 0){
				$(this).closest('li').find('.selectComple-view img').attr('src',$(this).next().find('img').attr('src'));
				$(this).closest('li').find('.selectComple-view img').attr('alt',$(this).next().find('img').attr('alt'));
			}
			$(this).closest('li').addClass('selectComple');
			$(this).closest('li').next().addClass('on');
			// 구성정보 조회
			product.configDetail.configInfoAjax();

		});
		
		//레이어팝업 닫기버튼
		$('.layer-pop .box .btn-close, #continueBtn').off('click');
		$('.layer-pop .box .btn-close, #continueBtn').on('click',function(){
			$(this).closest('.layer-pop').removeClass('open');
			$('html').removeClass('layerPopOpen');
			
			var lvl1Seq = $(this).closest('.layer-pop').find('.slide-a').data('lvl1Seq');
			var lId = $(this).closest('.layer-pop').attr('id');
			
			if(typeof lvl1Seq != 'undefined' && lvl1Seq != 'PO'){
				var lvlValCdArrVal = $('input[name="lvlValCdArr"]').val();
				var lvlValCdArr = lvlValCdArrVal.split(',');
				var lvlValCdArrL = lvlValCdArr.length;
				var ckLvl1 = (lvlValCdArrL == 1 && lvlValCdArrL == lvl1Seq) ? lvlValCdArr[0] : '';
				ckLvl1 = (lvlValCdArrL == 2 && lvlValCdArrL == lvl1Seq) ? lvlValCdArr[1] : ckLvl1;
				ckLvl1 = (lvlValCdArrL == 3 && lvlValCdArrL == lvl1Seq) ? lvlValCdArr[2] : ckLvl1;
				ckLvl1 = (lvlValCdArrL == 4 && lvlValCdArrL == lvl1Seq) ? lvlValCdArr[3] : ckLvl1;
				ckLvl1 = (lvlValCdArrL == 5 && lvlValCdArrL == lvl1Seq) ? lvlValCdArr[4] : ckLvl1;
				
				// 컨펌으로 선택값으로 되돌리기
				if(product.configDetail.lvl1Seq == lvl1Seq){
					$(this).closest('.layer-pop').find('.carOptionItem input:radio').each(function(){
						if($(this).val() == ckLvl1){
							$(this).prop('checked', true);
							$(this).change();
						}else{
							$(this).prop('checked', false);
							$(this).change();
						}
					});
				}
			}else if(lId == 'layerPop-SelectPackages'){
				var optPkgCdArrVal = $('input[name="optPkgCdArr"]').val();
				var optPkgCdArr = optPkgCdArrVal.split(',');
				
				// 패키지 선택값이 없을 경우 select 버튼 노출
				if(optPkgCdArrVal == ''){
					$('#optSelectTap-packages').removeClass('selectComple');
				}
				
				$('#layerPop-SelectPackages .packagesArea input:checkbox').each(function(){
					var that = this;
					if($(that).is(':checked')){
						var chk = false;
						optPkgCdArr.forEach(function(v,idx){
							if(v == $(that).val()){
								chk = true;
							}
						});
						if(!chk){
							$(that).prop('checked', false);
							$(that).change();
						}
					}else{
						var chk = false;
						optPkgCdArr.forEach(function(v,idx){
							if(v == $(that).val()){
								chk = true;
							}
						});
						if(chk){
							$(that).prop('checked', true);
							$(that).change();
						}
					}
				});
			}
		});
		
		// 패키지 레이어팝업  패키지/옵션 선택시
		$('#layerPop-Powertrain .carOptionItem input:radio, #layerPop-TractionSystem .carOptionItem input:radio, #layerPop-Wheels .carOptionItem input:radio, #layerPop-InteriorPACK .carOptionItem input:radio, #layerPop-Passengers .carOptionItem input:radio').off('change');
		$('#layerPop-Powertrain .carOptionItem input:radio, #layerPop-TractionSystem .carOptionItem input:radio, #layerPop-Wheels .carOptionItem input:radio, #layerPop-InteriorPACK .carOptionItem input:radio, #layerPop-Passengers .carOptionItem input:radio').on('change', function(){
			var chkVal = $(this).closest('.layer-pop').find('.carOptionItem input:radio:checked').val();
			
			if(typeof chkVal != 'undefined'){
				$(this).closest('.layer-pop').find('.inConfigBtn').attr('disabled',false);
			}else{
				$(this).closest('.layer-pop').find('.inConfigBtn').attr('disabled',true);
			}
		});
		
		// 레이어팝업 common confirm 버튼 클릭
		$('#layerPop-Powertrain .btnArea .btn, #layerPop-TractionSystem .btnArea .btn, #layerPop-Wheels .btnArea .btn, #layerPop-InteriorPACK .btnArea .btn, #layerPop-ExteriorColor .btnArea .btn, #layerPop-InteriorColor .btnArea .btn, #layerPop-Passengers .btnArea .btn').off('click');
		$('#layerPop-Powertrain .btnArea .btn, #layerPop-TractionSystem .btnArea .btn, #layerPop-Wheels .btnArea .btn, #layerPop-InteriorPACK .btnArea .btn, #layerPop-ExteriorColor .btnArea .btn, #layerPop-InteriorColor .btnArea .btn, #layerPop-Passengers .btnArea .btn').on('click', function(){
			var id = $(this).closest('.layer-pop').attr('id');
			var chkVal = '';
			var selLvl1Seq = '';	
				
			if(id == 'layerPop-InteriorColor' || id == 'layerPop-ExteriorColor'){
				chkVal = $(this).closest('.layer-pop').find('.swiper-slide-active .carOptionItem input:radio').val();
				selLvl1Seq = $(this).closest('.layer-pop').find('.swipeOptionChange').data('lvl1Seq');
			}else{
				chkVal = $(this).closest('.layer-pop').find('.carOptionItem input:radio:checked').val();
				selLvl1Seq = $(this).closest('.slide-a').data('lvl1Seq');
			}
			
			$('#optionSelectScroll .cont li').each(function(){
				if(selLvl1Seq == $(this).data('lvl1Seq')){
					$(this).find('.view label input:radio').each(function(){
						if(chkVal == $(this).val()){
							$(this).attr('checked',true);
							$(this).change();
							$('.layer-pop .box .btn-close').click();
							return true;
						}	
					})
					return true;
				}
			});
		});
		
		// 패키지 레이어팝업  패키지/옵션 선택시
		$('#layerPop-SelectPackages .packagesArea input:checkbox').off('change');
		$('#layerPop-SelectPackages .packagesArea input:checkbox').on('change',function(e){
			var selOptPktCd = $(this).val();
			var isChk = $(this).is(':checked');	
			// 현제 선택 패키지/옵션 > selectedArea 셋팅
			if(isChk){
				if(!$(this).closest('.packagesList').hasClass('chked')){
					$(this).closest('.packagesList').addClass('chked');
				}
				
				var liTag  = '<li>'+$(this).data('optPkgDesc');
				liTag += '	<a href="javascript:void(0)" class="btnObjDel" onclick="javascript:product.configDetail.pkgSelectedAreaDel(this);" data-opt-pkg-cd="'+selOptPktCd+'">삭제</a>';
				liTag += '</li>';
			
				$('#layerPop-SelectPackages .selectedArea .selectComple-view ul').append(liTag);
			}else{
				$(this).closest('.packagesList').removeClass('chked');
				
				$('#layerPop-SelectPackages .selectedArea .selectComple-view ul a').each(function(){
					if(selOptPktCd == $(this).data('optPkgCd')){
						$(this).closest('li').remove();
					}
				})
			}
			// 현제 선택한 패키지/옵션의 제약 combination, exclude 셋팅
			product.configDetail.configOptPkgConstraint.forEach(function(t){
				if(selOptPktCd == t.optPkgCd1){
					t.pkgOptList.forEach(function(t1){
						if(t.relationCd == 'EX'){
							$('#layerPop-SelectPackages .packagesArea input:checkbox').each(function(){
								if(t1.pkgOptCd == $(this).val()){
									if(isChk){
										$(this).attr('disabled',true);
										$(this).closest('.pakagesList').attr('disabled',true);
										
										if($(this).closest('.packagesList').hasClass('chked')){
											$(this).closest('.packagesList').removeClass('chked');
										}
									}else{
										// 다른 패키지/옵션 선택 중 exclude 조건에 해당하면 체크해제 하지 않음
										var pkgOpt1 = $(this).val();
										var step2Chk = true;
										$('#layerPop-SelectPackages .packagesArea input:checkbox').each(function(){
											var that = this;
											if($(that).is(':checked')){
												
												product.configDetail.configOptPkgConstraint.forEach(function(tt){
													if($(that).val() == tt.optPkgCd1){
														tt.pkgOptList.forEach(function(tt1){
															if(tt.relationCd == 'EX'){
																if(pkgOpt1 == tt1.pkgOptCd){
																	step2Chk = false;
																	return true;
																}
															}
														});
														return true;
													}
												});
											}
										});
										if(step2Chk){
											$(this).attr('disabled',false);
											$(this).closest('.pakagesList').attr('disabled',false);
											
											if($(this).closest('.packagesList').hasClass('chked')){
												$(this).closest('.packagesList').removeClass('chked');
											}
										}
									}
									return true;
								}
							});
						}else{
							$('#layerPop-SelectPackages .packagesArea input:checkbox').each(function(){
								if(t1.pkgOptCd == $(this).val()){
									if(isChk){
										$(this).attr('checked',true);
										
										if(!$(this).closest('.packagesList').hasClass('chked')){
											$(this).closest('.packagesList').addClass('chked');
										}
										
										var liTag  = '<li>'+$(this).data('optPkgDesc');
//										liTag += '	<a href="javascript:void(0)" class="btnObjDel" onclick="javascript:product.configDetail.pkgSelectedAreaDel(this);" data-opt-pkg-cd="'+selOptPktCd+'">삭제</a>';
										liTag += '</li>';
									
										$('#layerPop-SelectPackages .selectedArea .selectComple-view ul').append(liTag);
									}else{
										// 다른 패키지/옵션 선택 중 exclude 조건에 해당하면 체크해제 하지 않음
										var pkgOpt1 = $(this).val();
										var step2Chk = true;
										$('#layerPop-SelectPackages .packagesArea input:checkbox').each(function(){
											var that = this;
											if($(that).is(':checked')){
												
												product.configDetail.configOptPkgConstraint.forEach(function(tt){
													if($(that).val() == tt.optPkgCd1){
														tt.pkgOptList.forEach(function(tt1){
															if(tt.relationCd == 'CO'){
																if(pkgOpt1 == tt1.pkgOptCd){
																	step2Chk = false;
																	return true;
																}
															}
														});
														return true;
													}
												});
											}
										});
										
										if(step2Chk){
											$(this).attr('checked',false);
											
											if($(this).closest('.packagesList').hasClass('chked')){
												$(this).closest('.packagesList').removeClass('chked');
											}
											
											$('#layerPop-SelectPackages .selectedArea .selectComple-view ul a').each(function(){
												if(selOptPktCd == $(this).data('optPkgCd')){
													$(this).closest('li').remove();
												}
											});
										}
									}	
									return true;
								}
							});
						}
					});
				}
			});
			// 선택 갯수/총가격 셋팅
			var selRow = 0;
			var ttSalesPrice = 0; 
			$('#layerPop-SelectPackages .packagesArea input:checkbox').each(function(){
				if($(this).is(':checked')){
					++selRow;
					ttSalesPrice = ttSalesPrice + $(this).data('salesPrice');
				}
			});
			// 선택 갯수
			$('#pkgLayerSelectCount').text(selRow);
			$('#optSelectTap-packages .selectCount').text(selRow);
			// 옵션/패키지 총가격
			$('#lTtSalesPrice').data('l-tt-sales-price',ttSalesPrice);
			$('#lTtSalesPrice').text(ttSalesPrice.toString().numberFormat(_currencySymbol, 2));
		});
		
		// 패키지 레이어팝업 :DONE 버튼 클릭
		$('#pkgLayerDoneBtn').off('click');
		$('#pkgLayerDoneBtn').on('click', function(){
			// 최적 옵션/패키지 조회
			product.configDetail.mergeOptPkgCdListAjax();
		});

		// 패키지 레이어팝업 :DELETE ALL 버튼 클릭
		$('#pkgLayerAllDelBtn').off('click');
		$('#pkgLayerAllDelBtn').on('click', function(e, msg){
			if(typeof msg == 'undefined'){
				common.layerConfirm(allDelConfirm, function() {
					$('#layerPop-SelectPackages .packagesArea input:checkbox').each(function(){
						$(this).prop('checked',false);
						$(this).change();
					});
					common.layerAlert(deleteSuccess);
				});
			}else{
				$('#layerPop-SelectPackages .packagesArea input:checkbox').each(function(){
					$(this).prop('checked',false);
					$(this).change();
				});
			}
		});
		
		// 패키지 SELECT 버튼 클릭
		$('#pakageSelectBtn').off('click');
		$('#pakageSelectBtn').on('click', function(){
			$(this).closest('li').addClass('on selectComple');
			
			layerPopOpen('layerPop-SelectPackages');
		});

		// next 버튼 클릭 
		$('#nextBtn').off('click');
		$('#nextBtn').on('click', function(){
			var salesCoCd = $('[name = "salesCoCd"]').val();
			var carLine = $('[name = "carLine"]').val();
			var salesSpecGrpCd = $('[name = "salesSpecGrpCd"]').val();
			var modelYear = $('[name = "modelYear"]').val();
			var mc = $('[name = "mc"]').val();
			var grade = $('[name = "grade"]').val();
			var fsc = '';
			var salesTrim = $('[name = "salesTrim"]').val();
			var extColor = $('[name = "extColor"]').val();
			var intColor = $('[name = "intColor"]').val();
			var lvlValCdArr = $('[name = "lvlValCdArr"]').val();
			var pkgOptCdArr = '';
			// 옵션/패키지 선택값
			$('#layerPop-SelectPackages .packagesArea input:checkbox').each(function(){
				if($(this).is(':checked')){
					pkgOptCdArr += "," + $(this).val();
				}
			});
			pkgOptCdArr = pkgOptCdArr.replace(',','');
			// 스펙상세 이동
			common.link.moveProductDetail(carLine, salesSpecGrpCd, modelYear, mc, grade, fsc, salesTrim, extColor, intColor, pkgOptCdArr);
		});
		
		// ourRecommendation buy 버튼 클릭 
		$('#rcomLayerBuyBtn').off('click');
		$('#rcomLayerBuyBtn').on('click', function(){
			var carLine = $('[name = "recCarLine"]').val();
			var salesSpecGrpCd = $('[name = "recSalesSpecGrpCd"]').val();
			var modelYear = $('[name = "recModelYear"]').val();
			var mc = $('[name = "recMc"]').val();
			var grade = $('[name = "recGrade"]').val();
			var fsc = $('[name = "recFsc"]').val();;
			var salesTrim = $('[name = "recSalesTrim"]').val();
			var extColor = $('[name = "recExtColor"]').val();
			var intColor = $('[name = "recIntColor"]').val();
			var pkgOptCdArr = '';
			// 스펙상세 이동
			common.link.moveProductDetail(carLine, salesSpecGrpCd, modelYear, mc, grade, fsc, salesTrim, extColor, intColor, pkgOptCdArr);
		});
		
		// ourRecommendation 차량 선택
		$('#ourRecommendation input:radio').off('click');
		$('#ourRecommendation input:radio').on('click', function(e){
			var that = this;
			/////////// 구성중인 정보 세팅
			$('#recLayerModelNm').text($('[name = "modelNm"]').val());
			$('#recLayerSpecHp').html(common.getSpecTagStr($('[name = "specHp"]').val(), 'em'));
			$('#recLayerSpecTorque').html(common.getSpecTagStr($('[name = "specTorque"]').val(), 'em'));
			$('#recLayerSpecMpg').html(common.getSpecTagStr($('[name = "specMpg"]').val(), 'em'));
			
			$('#recLayerModelYear').text($('[name = "modelYear"]').val());
			$('#recLayerPowerTrain span:eq(1)').text(($('[name = "salesPrice"]').val()).toString().numberFormat(_currencySymbol, 2));
			
			// 옵션/패키지
			$('#recLayerPackage').html('');
			var optHtml  = '';
			$('#layerPop-SelectPackages .packagesArea input:checkbox').each(function(){
				if($(this).is(':checked')){
					var optOrPkg = $(this).data('optOrPkg');
					var optPkgCd = $(this).val();
					var optPkgDesc = $(this).data('optPkgDesc');
					var salesPrice = $(this).data('salesPrice');
					
					optHtml += '<div class="innerRow">'+optPkgDesc;
					optHtml += 	'<span class="cPrice">'+salesPrice.toString().numberFormat(_currencySymbol, 2)+'</span>';
					// 패키지인 경우
					if(optOrPkg == 'P'){
						optHtml += 	'<ul class="listLine">'
						
						product.configDetail.configAvailOptPkgListTmp.forEach(function(item, index){
							if(optPkgCd == item.optPkgCd){
								optHtml += 	'<li>'+item.optDesc+'</li>';
							}
						});
						optHtml += 	'</ul>';
					}
					optHtml += '</div>';
				}
			});
			// 옵션/패키지 append
			$('#recLayerPackage').html(optHtml);
			// 총가격
			$('#recLayerTtSalesPrice').text($('#ttSalesPrice').text());
			
			
			product.configDetail.recommProductDetailAjax(that);
		});
		
		
		// like 버튼 클릭
		$('#likeBtn').off('change');
		$('#likeBtn').on('change', function(e){
			
//			display.productList.likeThatIdx = idx;
			
			var optPkgCd = '';
			$('#layerPop-SelectPackages .packagesArea input:checkbox').each(function(){
				if($(this).is(':checked')){
					optPkgCd += ',' + $(this).val(); 
				}
			});
			optPkgCd = optPkgCd.replace(',','');
			
			var param = {
					 salesCoCd : $('[name = "salesCoCd"]').val()	
					,carLine  : $('[name = "carLine"]').val()
					,salesSpecGrpCd : $('[name = "salesSpecGrpCd"]').val()
					,mc : $('[name = "mc"]').val()
					,grade : $('[name = "grade"]').val()
					,salesTrim : $('[name = "salesTrim"]').val()
					,extColorCd : $('[name = "extColor"]').val()
					,intColorCd : $('[name = "intColor"]').val()
					,optPkgCd : optPkgCd
			}
			
			if($(this).is(":checked")){
				common.garage.saveMyGarageJson(param, product.configDetail.saveMyGarageJsonCallBack);
			}else{
				var cartSeq = $('input[name = "cartSeq"]').val();
				param = { 
						cartSeq : cartSeq
				};
				common.garage.deleteMyGarageJson(param, product.configDetail.deleteMyGarageJsonCallBack);
			}
		});
		
		// 공유 버튼클릭
		$('#shareBtn').off('click');
		$('#shareBtn').on('click', function(){
			if(!$(this).hasClass('disabled')){
				var salesCoCd = $('[name = "salesCoCd"]').val();
				var carLine = $('[name = "carLine"]').val();
				var salesSpecGrpCd = $('[name = "salesSpecGrpCd"]').val();
				var modelYear = $('[name = "modelYear"]').val();
				var mc = $('[name = "mc"]').val();
				var grade = $('[name = "grade"]').val();
				var fsc = '';
				var salesTrim = $('[name = "salesTrim"]').val();
				var extColor = $('[name = "extColor"]').val();
				var intColor = $('[name = "intColor"]').val();
				var lvlValCdArr = $('[name = "lvlValCdArr"]').val();
				var pkgOptCdArr = '';
				// 옵션/패키지 선택값
				$('#layerPop-SelectPackages .packagesArea input:checkbox').each(function(){
					if($(this).is(':checked')){
						pkgOptCdArr += "," + $(this).val();
					}
				});
				pkgOptCdArr = pkgOptCdArr.replace(',','');
				
				var url = _baseUrl + "product/detailInfoLayer.do?carLine=" + carLine + "&salesSpecGrpCd=" + salesSpecGrpCd + "&mc=" + mc + "&grade=" + grade + "&fsc=" + fsc + "&salesTrim=" + salesTrim + "&extColor=" + extColor + "&intColor=" + intColor + "&modelYear=" + modelYear + "&optPkgCdVal=" + pkgOptCdArr;
				
				common.sns.init('',url);
				common.sns.openSnsSharePopup();
			}
		});
		
		// change 버튼클릭 : 차량모델선택페이지 이동
		$('.btn-resetFilter').off('click');
		$('.btn-resetFilter').on('click', function(){
			common.layerConfirm(resetFilterConfirm, function() {
				common.link.configModel();
			});
		});

		// consult 버튼클릭
		$('#consultBtn').off('click');
		$('#consultBtn').on('click', function(){
			common.link.moveFleetForm();
		});
	},
	
	saveMyGarageJsonCallBack : function(res){

		if(res && (res.resultCode == 0000 || res.resultCode == 8913)){ //이미 저장된 중복 차량
			if(res && res.resultCode == common._jsonSuccessCd){ //SUCCESS
				var cartSeq = res.data.cartInfo.cartSeq;

				$('input[name = "cartSeq"]').val(cartSeq);
				
				$('#likeBtn').prop("checked", true);

				common.layerAlert(_sucsSaveCar, function() {
					common.garage.getCarListJson(function() {
						//사이드바 표시
						$('.sideLayer').removeClass('sideLayer-toggle');
						//3초뒤 닫기.
						setTimeout(function() {
							$(".sideLayer .btn-close").click();
						}, 5000);
					});
				});
				
				common.garage.myCartSeqList = null;
				
			}else if(res && res.resultCode == 8913){ //이미 저장된 중복 차량
				//체크된 css(♥) 그대로 유지
				common.layerAlert(res.resultMessage);
			}else{
				common.garage.saveMyGarageFailure(res);
			}			
			
			
		}else{
			var sessionCartInfo = JSON.parse(sessionStorage.getItem("cartInfo"));
			var sessionFscKey = sessionCartInfo.fsc+sessionCartInfo.intColorCd+sessionCartInfo.extColorCd; 
			var fscKey = sessionFscKey;
			
			//fsc가 없는 BTO 차량에 대해서는 고려하지 않음 (해당화면에서 따로 처리)
			if(fscKey.length>=20){
				for(var i=0; i<$(".rcmdCar").length; i++){
					if($(".rcmdCar").eq(i).data("fsc_key")==fscKey){
						//체크 된 css(♥) 원복(v)
						$(".rcmdCar").eq(i).attr("checked", false);
					}
				}
			}
			
			$('#likeBtn').prop("checked", false);
			
			common.layerAlert(res.resultMessage);
		}
	},
	
	deleteMyGarageJsonCallBack : function(res){
		common.garage.deleteMyGarageJsonCallback(res);
	},
	
	/*
		패키지 레이어팝업 : selectedArea 삭제 선택
	 */
	pkgSelectedAreaDel : function(e){
		common.layerConfirm(deleteConfirm, function() {
			var selOptPkgCd = $(e).data('optPkgCd');
			var chk = $(e).parents('#optSelectTap-packages').length;
			
			$(e).closest('li').remove();
			
			common.layerAlert(deleteSuccess);
			
			$('#layerPop-SelectPackages .packagesArea input:checkbox').each(function(){
				if(selOptPkgCd == $(this).val()){
					$(this).prop('checked',false);
					$(this).change();
					return true;
				}
			});
			
			if(chk > 0){
				$('#pkgLayerDoneBtn').click();
			}
		});
	},
	/*
		차량구성 정보 조회 AJAX
	 */
	configInfoAjax : function(){
		
		var url = _baseUrl+"product/configInfoAjax";
		var salesCoCd = $('[name = "salesCoCd"]').val();
		var carLine = $('[name = "carLine"]').val();
		var salesSpecGrpCd = $('[name = "salesSpecGrpCd"]').val();
		var mc = $('[name = "mc"]').val();
		var grade = $('[name = "grade"]').val();
		var salesTrim = $('[name = "salesTrim"]').val();
		var extColor = '';
		var intColor = '';
		
		// 차량구성 계층체크값
		var lvlValCdArr = '';
		$('#optionSelectScroll .list-dropdown-b li').each(function(){
			var selLvl1Seq = $(this).closest('li').data('lvl1Seq');
			var chkRadio = $(this).find('input[type="radio"]:checked');

			if(chkRadio.length > 0){
				// exterior 칼라
				if(selLvl1Seq == 'EC'){
					extColor = $(chkRadio).val();
					//////////// 추천 비교 레이어 세팅
					$('[name = "extColor"]').val(extColor);
					$('[name = "extColorPrice"]').val($(chkRadio).data('salesPrice'));
					$('#recLayerExtColor').text($(chkRadio).data('lvlValDesc'));
				// interior 칼라
				}else if(selLvl1Seq == 'IC'){
					intColor = $(chkRadio).val();
					//////////// 추천 비교 레이어 세팅
					$('[name = "intColor"]').val(intColor);
					$('[name = "intColorPrice"]').val($(chkRadio).data('salesPrice'));
					$('#recLayerIntColor').text($(chkRadio).data('lvlValDesc'));
				// 구성 계층
				}else{
					lvlValCdArr += ',' + $(chkRadio).val();
					
					//////////// 추천비교상세 레이어 세팅
					var hierachyTp = $(this).closest('li').data('hierachyTp');
					// powertrain
					if(hierachyTp == '001'){
						$('#recLayerPowerTrain span:eq(0), .recLayerPowerTrain').text($(chkRadio).data('lvlValDesc'));
					// Interior pack
					}else if(hierachyTp == '002'){
						$('#recLayerIntPack').text($(chkRadio).data('lvlValDesc'));
					// Wheel
					}else if(hierachyTp == '003'){
						$('#recLayerWheels').text($(chkRadio).data('lvlValDesc'));
					// Transmission	
					}else if(hierachyTp == '004'){
						$('#recLayerTraction').text($(chkRadio).data('lvlValDesc'));
					// Passenger	
					}else if(hierachyTp == '005'){
						$('#recLayerPassengers').text($(chkRadio).data('lvlValDesc'));
					}
				}
			}
		});
		lvlValCdArr = lvlValCdArr.replace(',','');
		$('[name = "lvlValCdArr"]').val(lvlValCdArr);

		$('[name = "optPkgCdArr"]').val('');
		
		var param ={
				  salesCoCd : salesCoCd
					, carLine : carLine
					, salesSpecGrpCd : salesSpecGrpCd
					, lvl1Seq : product.configDetail.lvl1Seq
					, extColor : extColor
					, intColor : intColor
					, lvlValCdArr : lvlValCdArr
					, mc : mc
					, grade : grade
					, salesTrim : salesTrim
		};
		
		// 구성설정파라미터가 있을 경우
		if(product.configDetail.pSalesTrim){
			param ={
					  salesCoCd : salesCoCd
					, carLine : product.configDetail.pCarLine
					, salesSpecGrpCd : product.configDetail.pSalesSpecGrpCd
					, lvl1Seq : product.configDetail.lvl1Seq
					, extColor : product.configDetail.pExtColor
					, intColor : product.configDetail.pIntColor
					, lvlValCdArr : product.configDetail.lvlValCdArr
					, pkgOptCdArr : product.configDetail.pOptPkgCdVal
					, mc : product.configDetail.pMc
					, grade : product.configDetail.pGrade
					, salesTrim : product.configDetail.pSalesTrim
					, configSelYn : 'Y'
			};
			product.configDetail.pCarLine = '';
			product.configDetail.pSalesSpecGrpCd = '';
			product.configDetail.pExtColor = '';
			product.configDetail.pIntColor = '';
			product.configDetail.lvlValCdArr = '';
			product.configDetail.pOptPkgCdVal = '';
			product.configDetail.pMc = '';
			product.configDetail.pGrade = '';
			product.configDetail.pSalesTrim = '';
		}
		
		common.Ajax.sendRequest("GET", url, param, this.configInfoAjaxCallBack);
	},

	/*
		차량구성 정보 조회 AJAX 콜백처리
	 */
	configInfoAjaxCallBack : function(rs){
//		console.log(JSON.stringify(rs));
		if(rs.resultCode && rs.resultCode != '0000'){
			common.layerAlert(rs.resultMessage, function() {
				return false;
			});
		}
		if(rs.data){
			// BTS 유사재고  추천 조회 AJAX
			product.configDetail.recommProductListAjax();
			// 구성설정 파라미터가 있는 경우
			if(rs.data.configSetMap){
				product.configDetail.isConfigSet = true;
			}
			// 구성한 트림 정보
			var mcTrimMasterInfo = '';
			if(rs.data.configVmMcTrimMasterList){
				mcTrimMasterInfo = rs.data.configVmMcTrimMasterList[0];
				
				var carLine = mcTrimMasterInfo.carLine;
				var salesSpecGrpCd = mcTrimMasterInfo.salesSpecGrpCd;
				var salesTrim = mcTrimMasterInfo.salesTrim;
				var extColor = $('[name = "extColor"]').val() != '' ? $('[name = "extColor"]').val() :  mcTrimMasterInfo.extColor;
				var intColor = $('[name = "intColor"]').val() != '' ? $('[name = "intColor"]').val() :  mcTrimMasterInfo.intColor;
				
				// 트림+내장칼라+외장칼라+view tp가 다른 경우 구성뷰 이미지 로드
				if(!product.configDetail.isConfigSet){
					if($('[name = "salesTrim"]').val() != mcTrimMasterInfo.salesTrim || extColor != $('#carConfigView').data('extColor')
							|| intColor != $('#carConfigView').data('intColor')) {
						// confige view set
						product.configDetail.configImgLoadView(carLine, salesSpecGrpCd, salesTrim, extColor, intColor);
					}else if(product.configDetail.hierachyTp == '002' ||  product.configDetail.hierachyTp == 'I'){
						product.configDetail.carViewIntExtGo('int');
					}
				}
				// 최저가 트림정보
				$('[name = "mc"]').val(mcTrimMasterInfo.mc);
				$('[name = "grade"]').val(mcTrimMasterInfo.grade);
				$('[name = "salesTrim"]').val(mcTrimMasterInfo.salesTrim);
				$('[name = "salesPrice"]').val(mcTrimMasterInfo.salesPrice);
				$('[name = "modelYear"]').val(mcTrimMasterInfo.modelYear);
				$('[name = "modelNm"]').val(mcTrimMasterInfo.modelNm);
				$('[name = "specHp"]').val(mcTrimMasterInfo.specHp);
				$('[name = "specTorque"]').val(mcTrimMasterInfo.specTorque);
				$('[name = "specMpg"]').val(mcTrimMasterInfo.specMpg);
				// 차량모델 선택
				$('#customSelect-1 .custom-options span').each(function(index){
					if(mcTrimMasterInfo.carLine == $(this).data('value')){
						$(this).parents(".custom-select-wrapper").find("select").val($(this).data("value"));
						$(this).parents(".custom-options").find(".custom-option").removeClass("selection");
						$(this).addClass("selection");
						$(this).parents(".custom-select").removeClass("opened");
						$(this).parents(".custom-select").find(".custom-select-trigger").text($(this).text());
						return true;
					}
				});
				// 
				if($('[name = "lvlValCdArr"]').val().split(',').length == 5 && rs.data.configVmMcTrimMasterList.length != 1){
					hierchyTrimSingle = false;
				}
			}
			// 차량구성 정보
			if(rs.data.configHierachyList){
				product.configDetail.setConfigHierchyData(rs.data.configHierachyList, mcTrimMasterInfo);
			}
			// 차량구성 정보(파람설정값인 경우)
			if(rs.data.configHierachyListList){
				rs.data.configHierachyListList.forEach(function(that,index){
					product.configDetail.lvl1Seq = index+1;
					product.configDetail.setConfigHierchyData(that, mcTrimMasterInfo);
				});
			}
			// 차량구성 exterior color 정보
			if(rs.data.configExtColorList){
				product.configDetail.lvl1Seq = 'EC';
				product.configDetail.setConfigHierchyData(rs.data.configExtColorList, mcTrimMasterInfo);
			}
			// 차량구성 interior color 정보
			if(rs.data.configIntColorList){
				product.configDetail.lvl1Seq = 'IC';
				product.configDetail.setConfigHierchyData(rs.data.configIntColorList, mcTrimMasterInfo);
			}
			// 차량구성 옵션/패키지 정보
			if(rs.data.configAvailOptPkgList){
				product.configDetail.lvl1Seq = 'PO';
				// 차량구성 옵션/패키지 템프
				product.configDetail.configAvailOptPkgListTmp = rs.data.configAvailOptPkgList;
				var tData = rs.data.configAvailOptPkgList.slice();
				
				// 차량구성 옵션/패키지 템프에서 패키지내 옵션은 제외
				var index = tData.length -1;
				while(index >= 0){
					if(tData[index].optOrPkg == 'P' && index != 0){
						if(tData[index].optPkgCd == tData[index-1].optPkgCd){
							tData.splice(index,1);
						}
					}
					index -= 1;
				}
				
				product.configDetail.setConfigHierchyData(tData, mcTrimMasterInfo);
			}
			
			// 옵션/패키지 제약 정보
			if(rs.data.configOptPkgConstraintList){
				product.configDetail.configOptPkgConstraint = rs.data.configOptPkgConstraintList; 
			}
			
			product.configDetail.bindEvent();
			
			// 레이어아이디값이 있을 경우 레이어오픈
			if(product.configDetail.layerpopId != ''){
				layerPopOpen(product.configDetail.layerpopId);
				product.configDetail.layerpopId = '';
			}
			
			// 파람 구성 설정값
			if(product.configDetail.isConfigSet){
				var configSet = rs.data.configSetMap;
				var configSetExtColor = configSet.extColor;
				var configSetIntColor = configSet.intColor;
				var configSetHierachyArr = configSet.lvlValCdArr;
				var configSetPkgOptCdArr = configSet.pkgOptCdArr;
				
				if(configSetExtColor != ''){
					$('#optSelectTap-exteriorColor .view input[type="radio"]').each(function(idx){
						if(configSetExtColor == $(this).val()){
							$(this).prop('checked',true);
							$('[name = "extColor"]').val(configSetExtColor);
							$('[name = "extColorPrice"]').val($(this).data('salesPrice'));
							if($(this).closest('li').find('.selectComple-view img').length > 0){
								$(this).closest('li').find('.selectComple-view img').attr('src',$(this).closest('li').find('.view img').eq(idx).attr('src'));
								$(this).closest('li').find('.selectComple-view img').attr('alt',$(this).closest('li').find('.view img').eq(idx).attr('alt'));
							}
							$(this).closest('li').find('.selectComple-view .txt').text($(this).data('lvlValDesc'));
							$(this).closest('li').addClass('selectComple');
							$(this).closest('li').addClass('on');
							return true;
						}
					});
				}
				
				if(configSetIntColor != ''){
					$('#optSelectTap-interiorColor .view input[type="radio"]').each(function(idx){
						if(configSetIntColor == $(this).val()){
							$(this).prop('checked',true);
							$('[name = "intColor"]').val(configSetIntColor);
							$('[name = "intColorPrice"]').val($(this).data('salesPrice'));
							if($(this).closest('li').find('.selectComple-view img').length > 0){
								$(this).closest('li').find('.selectComple-view img').attr('src',$(this).closest('li').find('.view img').eq(idx).attr('src'));
								$(this).closest('li').find('.selectComple-view img').attr('alt',$(this).closest('li').find('.view img').eq(idx).attr('alt'));
							}
							$(this).closest('li').find('.selectComple-view .txt').text($(this).data('lvlValDesc'));
							$(this).closest('li').addClass('selectComple');
							$(this).closest('li').addClass('on');
							return true;
						}
					});
				}

				configSetHierachyArr.forEach(function(val,index){
					$('#optionSelectScroll ul li').each(function(idx){
						if($(this).data('lvl1Seq') == index+1){
							$(this).find('input[type="radio"]').each(function(idx){
								if(val == $(this).val()){
									$(this).prop('checked',true);
									if($(this).closest('li').find('.selectComple-view img').length > 0){
										$(this).closest('li').find('.selectComple-view img').attr('src',$(this).closest('li').find('.view img').eq(idx).attr('src'));
										$(this).closest('li').find('.selectComple-view img').attr('alt',$(this).closest('li').find('.view img').eq(idx).attr('alt'));
									}
									$(this).closest('li').find('.selectComple-view .txt').text($(this).data('lvlValDesc'));
									$(this).closest('li').addClass('selectComple');
									$(this).closest('li').addClass('on');
									return true;
								}
							});
							return true;
						}
					});
				});
				
				if(configSetPkgOptCdArr.length > 0){
					configSetPkgOptCdArr.forEach(function(val,index){
						$('#layerPop-SelectPackages .packagesArea input:checkbox').each(function(){
							if(val == $(this).val()){
								$(this).prop('checked',true);
								$(this).change();
								return true;
							}
						});
					});
					$('#pkgLayerDoneBtn').click();
				}else{
					product.configDetail.isConfigSet = false;
					$('#optSelectTap-packages').addClass('on').removeClass('selectComple');
					$('#optSelectTap-packages .view').show();
					$('#optSelectTap-packages .selectComple-view').hide();
					// config view image load
					product.configDetail.configImgLoadView($('[name="carLine"]').val(), $('[name="salesSpecGrpCd"]').val(), $('[name="salesTrim"]').val(), $('[name="extColor"]').val(), $('[name="intColor"]').val());

					enquire.register("screen and (min-width: 768px)", {
						match : function() {
							optionSelectScroll_init();
						},
						unmatch : function() {
							optionSelectScroll_destroy();
							// console.log('destroy');
						}
					});
				}
				
			}
			var extColorPrice = $('[name="extColorPrice"]').val();
			var intColorPrice = $('[name="intColorPrice"]').val();
			$('#ttSalesPrice').data('tt-sales-price',mcTrimMasterInfo.salesPrice + Number(extColorPrice) + Number(intColorPrice));
			$('#ttSalesPrice').text(($('#ttSalesPrice').data('tt-sales-price')).toString().numberFormat(_currencySymbol, 2));
			
			// 구성단계가 패키지이고 트림이 단일일 경우 활성화
			if(product.configDetail.lvl1Seq == 'PO' && product.configDetail.hierchyTrimSingle){
				// 예상배송일자 조회
				product.configDetail.getDeliveryDateAjax();
				
				$('#optSelectTap-packages .view').show();
				$('#optSelectTap-packages .selectComple-view').html('');
				$('#pkgLayerAllCount').text($('#pkgLayerAllCount').text() + $('#layerPop-SelectPackages .packagesList').length);
				
				$('#likeBtn').attr('disabled',false);
				$('#shareBtn').removeClass('disabled');
				$('#consultBtn').attr('disabled',false);
				$('#nextBtn').attr('disabled',false);
			// 트림이 단일값이 아닌 경우 비활성화
			}else{
				product.configDetail.hierchyTrimSingle = true;
				$('#mDelivery').closest('.delivery').hide();
				$('#recLayerDelivery').closest('.delivery').hide();
				$('#likeBtn').attr('disabled',true);
				$('#shareBtn').addClass('disabled');
				$('#consultBtn').attr('disabled',true);
				$('#nextBtn').attr('disabled',true);
			}
			
			// 아코디언 스크롤
			if(optionSelectScroll){
				optionSelectScroll.refresh();
				var selLiIdx = '';
				$('#optionSelectScroll .list-dropdown-b li').each(function(index){
					if($(this).data('lvl1Seq') == product.configDetail.orgLvl1Seq){
						selLiIdx = index;
						return true;
					}
				});
				var li = $('#optionSelectScroll .list-dropdown-b li').eq(selLiIdx);
				var top = $(li).offset().top;
				optionSelectScroll.scrollToElement('#' + li.attr('id'),500);
			}
		}
	},
	/*
		차량구성 계층 데이타 세팅
	*/
	setConfigHierchyData : function(rData, mcTrimMasterInfo){
		var selIdx = 0;
		$('#optionSelectScroll ul li').each(function(idx){
			if($(this).data('lvl1Seq') == product.configDetail.lvl1Seq){
				selIdx = idx;
				var bId = $(this).attr('id');
				var tId = $(this).data('templateId');
				if(tId != 'none'){
					rData.forEach(function(that){
						that.name = bId+'-nm';
					});
					// 템플릿 세팅
					var source = $('#'+tId).html();
					var template = Handlebars.compile(source);
					var data = {
							dataList : rData
					}
					var html = template(data);
					$('#'+bId+' .cont').remove();
					$('#'+bId).append(html);
				}
				////////////// 레이어팝업 세팅
				var lbId = $(this).data('layerpopId');
				if(lbId != 'none'){
					// color or 패키지를 제외한 구성일 경우
					if(product.configDetail.lvl1Seq != 'EC' && product.configDetail.lvl1Seq != 'IC' && product.configDetail.lvl1Seq != 'PO'){
						var ltId = $('#'+lbId).data('templateId');
						var lsId = 'slide-'+lbId;
						
						// slick 초기화
						if($('#' + lsId + ' .slide-cont >div').length > 0){
							$('#' + lsId + ' .slide-cont').slick('unslick');
							$('#' + lsId + ' .slide-cont').remove();
						}
						
						rData.forEach(function(that){
							that.name = lbId+'-nm';
							that.lsId = lsId;
						});
						// 템플릿 세팅
						source = $('#'+ltId).html();
						template = Handlebars.compile(source);
						data = {
								dataList : rData
							   ,dataInfo : { lsId : lsId
								           	,lvl1Seq : $(this).data('lvl1Seq')
								           	,title : $(this).find('.title').data('title') 
							   }
						}
						var html = template(data);
						$('#'+lbId).html('');
						$('#'+lbId).append(html);
						
						setCarOptionSelectSlick.init(lsId);
					}else{
						var ltId = $('#'+lbId).data('templateId');
						var lsId = 'slide-'+lbId;
						
						rData.forEach(function(that){
							that.name = lbId+'-nm';
							that.lsId = lsId;
						});
						// 템플릿 세팅
						source = $('#'+ltId).html();
						template = Handlebars.compile(source);
						data = {
								dataList : rData
							   ,dataInfo : { lsId : lsId
								           	,lvl1Seq : $(this).data('lvl1Seq')
								           	,title : $(this).find('.title').data('title')
							   }
						}
						var html = template(data);
						$('#'+lbId).html('');
						$('#'+lbId).append(html);
						
						if(product.configDetail.lvl1Seq == 'PO'){
							swiper_packages.init();
						}else{
							swiperOptionChange.init(lsId);
						}
					}
				}
				// ! 아이콘 노출
				$(this).find('.detailView').show();
				
				return true;
			}
		});
	},
	/*
		config(car) view 내/외장 이동
	 */
	carViewIntExtGo : function(go, toggle){
		if(go == 'int'){
			if(typeof toggle == 'undefined'){
				$('#carConfigView .slide-cont').slick('slickGoTo', 4);
			}
			$('.viewInterior').hide();
			$('.viewExterior').show();
			return 4;
		}else{
			if(typeof toggle == 'undefined'){
				$('#carConfigView .slide-cont').slick('slickGoTo', 0);
			}
			$('.viewInterior').show();
			$('.viewExterior').hide();
			return 0;
		}
	},
	/*
		config(car) view img set
	 */
	configImgLoadView : function(carLine, salesSpecGrpCd, salesTrim, extColor, intColor){
		var myImages = new Array();
		
		for(var i = 0; i < 4; i++){
			if(i == 0){
				// 추천레이어 이미지
				$('#recLayerVmImg').attr('src', _productUploadUrl+prodUtil.getTrimImgPath(carLine, salesSpecGrpCd, salesTrim, extColor, 1 ));
			}
			myImages.push({imgUrl : _productUploadUrl+prodUtil.getConfExtImgPath(carLine, salesSpecGrpCd, salesTrim, extColor, i+1 ), optGrp : 'EX'});
		}
		for(var i = 0; i < 3; i++){
			myImages.push({imgUrl : _productUploadUrl+prodUtil.getConfIntImgPath(carLine, salesSpecGrpCd, salesTrim, intColor, i+1 ), optGrp : 'IN'});
		}
		
		var configViewInfo = {
				tp : 'CAR'
				,extColor : extColor
				,intColor : intColor
				,images : myImages
				,callbackFn : product.configDetail.setCarConfigView
		};
		
		configImgLoad.init(configViewInfo);
	},
	/*
		config(car/option) view img set
	 */
	optConfigImgLoadView : function(carLine, salesSpecGrpCd, salesTrim, extColor, intColor, exOptArr, inOptArr){
		var myImages = new Array();
		
		if( product.configDetail.isConfigSet){
			for(var i = 0; i < 4; i++){
				if(i == 0){
					$('#recLayerVmImg').attr('src', _productUploadUrl+prodUtil.getTrimImgPath(carLine, salesSpecGrpCd, salesTrim, extColor, 1 ));
				}
				myImages.push({imgUrl : _productUploadUrl+prodUtil.getConfExtImgPath(carLine, salesSpecGrpCd, salesTrim, extColor, i+1 ), optGrp : 'EX'});
			}
			for(var i = 0; i < 3; i++){
				myImages.push({imgUrl : _productUploadUrl+prodUtil.getConfIntImgPath(carLine, salesSpecGrpCd, salesTrim, intColor, i+1 ), optGrp : 'IN'});
			}
			
			enquire.register("screen and (min-width: 768px)", {
				match : function() {
					optionSelectScroll_init();
				},
				unmatch : function() {
					optionSelectScroll_destroy();
					// console.log('destroy');
				}
			});
		}
		
		exOptArr.forEach(function(v, idx){
			for(var i = 0; i < 4; i++){
				myImages.push({imgUrl : _productUploadUrl+prodUtil.getConfExtOptImgPath(carLine, salesSpecGrpCd, v, extColor, i+1 ), optGrp : 'EX'});
			}
		});
		inOptArr.forEach(function(v, idx){
			for(var i = 0; i < 3; i++){
				myImages.push({imgUrl : _productUploadUrl+prodUtil.getConfIntOptImgPath(carLine, salesSpecGrpCd, v, intColor, i+1 ), optGrp : 'IN'});
			}
		});
		
		if(myImages.length > 0){
			var configViewInfo = {
					tp : product.configDetail.isConfigSet ? 'CAROPT' : 'OPT'
					,images : myImages
					,callbackFn : product.configDetail.setCarConfigView
			};
			
			product.configDetail.isConfigSet = false;
			
			configImgLoad.init(configViewInfo);
		}
	},
	/*
		최적의 옵션/패키지 조회 AJAX : 옵션의 조합이 패키지1 + 패키지2 = 패키지3 일 경우 패키지3이 저렴한 경우 패키지3을 리턴 
	 */
	mergeOptPkgCdListAjax : function(){
		var url = _baseUrl+"product/mergeOptPkgCdListAjax";
		
		var salesCoCd = $('[name = "salesCoCd"]').val();
		var carLine = $('[name = "carLine"]').val();
		var salesSpecGrpCd = $('[name = "salesSpecGrpCd"]').val();
		var mc = $('[name = "mc"]').val();
		var grade = $('[name = "grade"]').val();
		var salesTrim = $('[name = "salesTrim"]').val();

		var optPkgCd = '';
		$('#layerPop-SelectPackages .packagesArea input:checkbox').each(function(){
			if($(this).is(':checked')){
				optPkgCd += ',' + $(this).val(); 
			}
		});
		optPkgCd = optPkgCd.replace(',','');
		
		var param ={
				  salesCoCd : salesCoCd
				, carLine : carLine
				, salesSpecGrpCd : salesSpecGrpCd
				, mc : mc
				, grade : grade
				, salesTrim : salesTrim
				, optPkgCd : optPkgCd
		};
		
		common.Ajax.sendRequest("POST", url, param, this.mergeOptPkgCdListAjaxCallBack);
	},
	/*
		최적의 옵션/패키지 조회 AJAX 콜백처리
	 */	
	mergeOptPkgCdListAjaxCallBack : function(rs){
//		console.log(JSON.stringify(rs));
		if(rs.resultCode && rs.resultCode != '0000'){
			common.layerAlert(rs.resultMessage);
			return false;
		}
		if(rs.data){
			if(rs.data.mergeOptPkgCdList && rs.data.mergeOptPkgCdList.length > 0){
				var chOptPkgStr = '';
				var exOptArr = new Array();// 패키지내 exterior type 옵션/ 개별 옵션 array
				var inOptArr = new Array();// 패키지내 interior type 옵션/ 개별 옵션 array
				// 변경된 옵션/패키지
				rs.data.mergeOptPkgCdList.forEach(function(v){
					$('#layerPop-SelectPackages .packagesArea input:checkbox').each(function(){
						if(v.pkg_opt_cd == $(this).val()){
							if(!$(this).is(':checked')){
								chOptPkgStr += $(this).data('optPkgDesc');
							}
						}
					});
					// 패키지내 옵션/ 개별 옵션 담기
					product.configDetail.configAvailOptPkgListTmp.forEach(function(item, index){
						if(v.pkg_opt_cd == item.optPkgCd && (item.optGrp == 'EX' || item.optGrp == 'IN') ){
							if(item.optGrp == 'EX'){
								exOptArr.push(item.optCd);
							}else if(item.optGrp == 'IN'){
								inOptArr.push(item.optCd);
							}
						}
					});
				});
				// 변경된 옵션/패키지가 있는 경우
				if(chOptPkgStr.length > 0){
					// 선택 초기화
					$('#pkgLayerAllDelBtn').trigger('click','N');
					// 최적 옵션/패키지로 세팅
					rs.data.mergeOptPkgCdList.forEach(function(v){
						$('#layerPop-SelectPackages .packagesArea input:checkbox').each(function(){
							if(v.pkg_opt_cd == $(this).val()){
								$(this).prop('checked',true);
								$(this).change();
								return true;
							}
						});
					});
					common.layerAlert(mergeOptPkgAlert.format(chOptPkgStr));
				}
				
				
				var optPkgCdStr = '';
				$('#layerPop-SelectPackages .packagesArea input:checkbox').each(function(){
					if($(this).is(':checked')){
						optPkgCdStr += ','+$(this).val();
					}
				});
				optPkgCdStr = optPkgCdStr.replace(',','');
				$('[name="optPkgCdArr"]').val(optPkgCdStr);
				
				// 패키지 선택값 > 구성계층 패키지영역에 셋팅
				$('#optSelectTap-packages .selectComple-view').html($('#layerPop-SelectPackages .selectedArea .selectComple-view').html());
				$('#optSelectTap-packages .selectCount').text($('#layerPop-SelectPackages .packagesArea input:checkbox:checked').length);
				
				if(rs.data.mergeOptPkgCdList.length > 0){
					$('#optSelectTap-packages').addClass('on selectComple');
					$('#optSelectTap-packages .view').hide();
					$('#optSelectTap-packages .selectComple-view').show();
				}else{
					$('#optSelectTap-packages').removeClass('selectComple');
					$('#optSelectTap-packages .view').show();
					$('#optSelectTap-packages .selectComple-view').hide();
				}
				// 구성 총가격
				$('#ttSalesPrice').text(($('#ttSalesPrice').data('ttSalesPrice')+$('#lTtSalesPrice').data('lTtSalesPrice')).toString().numberFormat(_currencySymbol, 2));
//				optionSelectScroll.refresh();
				// 다음 구성항목이 패키지인 경우 NEXT 버튼 활성화
				$('#consultBtn').attr('disabled',false);
				$('#nextBtn').attr('disabled',false);
				// 레이어 닫기
				$('#layerPop-SelectPackages').removeClass('open');
				$('html').removeClass('layerPopOpen');
				
				// config view image load
				product.configDetail.optConfigImgLoadView($('[name="carLine"]').val(), $('[name="salesSpecGrpCd"]').val(), $('[name="salesTrim"]').val(), $('[name="extColor"]').val(), $('[name="intColor"]').val(), exOptArr, inOptArr);
				
				setTimeout(function(){
					optionSelectScroll.refresh();
				},500);
				// 예상배송일자 조회
				product.configDetail.getDeliveryDateAjax();
			}else{
				console.log('mergeOptPkgCdList no data');
				
				$('input[name="optPkgCdArr"]').val('');
				
				var ttSalesPrice = $('#ttSalesPrice').data('ttSalesPrice');
				$('#ttSalesPrice').text(ttSalesPrice.toString().numberFormat(_currencySymbol, 2));
				
				$('#optSelectTap-packages .view').show();
				$('#optSelectTap-packages').removeClass('selectComple');
				// 레이어 닫기
				$('#layerPop-SelectPackages').removeClass('open');
				$('html').removeClass('layerPopOpen');
			}
		}
	},
	
	/*
		BTS 유사재고  추천 조회 AJAX
	 */
	recommProductListAjax : function(){
		var url = _baseUrl+"product/recommProductListAjax";
		
		var salesCoCd = $('[name = "salesCoCd"]').val();
		var carLine = $('[name = "carLine"]').val();
		var salesSpecGrpCd = $('[name = "salesSpecGrpCd"]').val();
		var extColor = '';
		var intColor = '';
		// 차량구성 계층체크값
		var lvlValCdArr = '';
		$('#optionSelectScroll .list-dropdown-b li').each(function(){
			var selLvl1Seq = $(this).closest('li').data('lvl1Seq');
			var chkRadio = $(this).find('input[type="radio"]:checked');

			if(chkRadio.length > 0){
				// exterior 칼라
				if(selLvl1Seq == 'EC'){
					extColor = $(chkRadio).val();
				// interior 칼라
				}else if(selLvl1Seq == 'IC'){
					intColor = $(chkRadio).val();
				// 트림 계층
				}else{
					lvlValCdArr += ',' + $(chkRadio).val();
				}
			}
		});
		lvlValCdArr = lvlValCdArr.replace(',','');
		
		var optPkgCd = '';
		$('#layerPop-SelectPackages .packagesArea input:checkbox').each(function(){
			if($(this).is(':checked')){
				optPkgCd += ',' + $(this).val(); 
			}
		});
		optPkgCd = optPkgCd.replace(',','');
	
		var param ={
				  salesCoCd : salesCoCd
				, carLine : carLine
				, salesSpecGrpCd : salesSpecGrpCd
				, lvl1Seq : product.configDetail.lvl1Seq
				, extColor : extColor
				, intColor : intColor
				, lvlValCdArr : lvlValCdArr
				, optPkgCd : optPkgCd
		};
		
		common.Ajax.sendRequest("POST", url, param, this.recommProductListAjaxCallBack);
	},
	/*
		BTS 유사재고 추천 조회 콜백
	*/
	recommProductListAjaxCallBack : function(rs){
//		console.log(JSON.stringify(rs));
		if(rs.resultCode && rs.resultCode != '0000'){
			common.layerAlert(rs.resultMessage, function() {
				return false;
			});
		}
		if(rs.data.recommProductList){
			// 템플릿 세팅
			// slick 초기화
			if($('#ourRecommendation .slide-cont >div').length > 0){
				$('#ourRecommendation .slide-cont').slick('unslick');
				$('#ourRecommendation .slide-cont').remove();
			}
			var source = $('#ourRecommendation-template').html();
			var template = Handlebars.compile(source);
			var data = {
					dataList : rs.data.recommProductList
			}
			var html = template(data);
			$('#ourRecommendation').html('');
			$('#ourRecommendation').html(html);
			// 슬라이드 이벤트
			product.configDetail.setOurRecommendationsSlide();
			
			product.configDetail.bindEvent();
		}
	},
	/*
		BTS 유사재고 차량 상세 조회 AJAX
	 */
	recommProductDetailAjax : function(obj){
		var url = _baseUrl+"product/recommProductDetailAjax";

		var salesCoCd = $(obj).data('salesCoCd');
		var carLine = $(obj).data('carLine');
		var modelYear = $(obj).data('modelYear');
		var salesSpecGrpCd = $(obj).data('salesSpecGrpCd');
		var fsc = $(obj).data('fsc');
		var salesTrim = $(obj).data('salesTrim');
		var extColor = $(obj).data('extColor');
		var intColor = $(obj).data('intColor');
		var optPkgCd = '';
		$('#layerPop-SelectPackages .packagesArea input:checkbox').each(function(){
			if($(this).is(':checked')){
				optPkgCd += ',' + $(this).val(); 
			}
		});
		optPkgCd = optPkgCd.replace(',','');
		
		var param ={
				  salesCoCd : salesCoCd
				, carLine : carLine
				, modelYear : modelYear
				, salesSpecGrpCd : salesSpecGrpCd
				, fsc : fsc
				, extColor : extColor
				, intColor : intColor
				, optPkgCd : optPkgCd
		};
		
		common.Ajax.sendRequest("POST", url, param, this.recommProductDetailAjaxCallBack);
	},
	/*
		BTS 유사재고 차량 상세 조회 AJAX 콜백처리
	 */
	recommProductDetailAjaxCallBack : function(rs){
//		console.log(JSON.stringify(rs));
		if(rs){
			$('#vehicleListR').html(rs);
			
			product.configDetail.bindEvent();
			layerPopOpen('layerPop-recommendation');
		}
	},	
	/*
		예상배송기간 조회 AJAX
	 */
	getDeliveryDateAjax : function(obj){
		var url = _baseUrl+"product/getDeliveryDateAjax";
		
		var salesCoCd = $('[name = "salesCoCd"]').val();
		var carLine = $('[name = "carLine"]').val();
		var salesSpecGrpCd = $('[name = "salesSpecGrpCd"]').val();
		var mc = $('[name = "mc"]').val();
		var grade = $('[name = "grade"]').val();
		var salesTrim = $('[name = "salesTrim"]').val();
		var extColor = $('[name = "extColor"]').val();
		var intColor = $('[name = "intColor"]').val();
		var modelYear = $('[name = "modelYear"]').val();
		var optPkgCd = '';
		$('#layerPop-SelectPackages .packagesArea input:checkbox').each(function(){
			if($(this).is(':checked')){
				optPkgCd += ',' + $(this).val(); 
			}
		});
		optPkgCd = optPkgCd.replace(',','');
		
		var param ={
				salesCoCd : salesCoCd
				, carLine : carLine
				, salesSpecGrpCd : salesSpecGrpCd
				, mc : mc
				, grade : grade
				, salesTrim : salesTrim
				, extColorCd : extColor
				, intColorCd : intColor
				, modelYear : modelYear
				, optPkgCd : optPkgCd
		};
		
		common.Ajax.sendRequest("POST", url, param, this.getDeliveryDateAjaxCallBack);
	},
	/*
		예상배송기간 조회 AJAX 콜백처리
	 */
	getDeliveryDateAjaxCallBack : function(rs){
//		console.log(JSON.stringify(rs));
		if(rs.resultCode && rs.resultCode != '0000'){
			common.layerAlert(rs.resultMessage);
			
			// 선택 초기화
			$('#pkgLayerAllDelBtn').trigger('click','N');
			
			$('input[name="optPkgCdArr"]').val('');
			
			var ttSalesPrice = $('#ttSalesPrice').data('ttSalesPrice');
			$('#ttSalesPrice').text(ttSalesPrice.toString().numberFormat(_currencySymbol, 2));
			
			$('#optSelectTap-packages').addClass('on').removeClass('selectComple');
			$('#optSelectTap-packages .view').show();
			$('#optSelectTap-packages .selectComple-view').html('');
			
			
			// NEXT/CONSULT 버튼 비활성화
//			$('#likeBtn').attr('disabled',true);
//			$('#shareBtn').addClass('disabled');
//			$('#consultBtn').attr('disabled',true);
//			$('#nextBtn').attr('disabled',true);
			return false;
		}
		if(rs.data){
			$('#mDelivery').closest('.delivery').show();
			$('#recLayerDelivery').closest('.delivery').show();
			
			$('#mDelivery').text(rs.data.deliveryDate);
			$('#recLayerDelivery').text(rs.data.deliveryDate);
		}
	},	
	/*
		car config view 세팅
	*/
	setCarConfigView : function(info){
		if(info.tp == 'CAR' || info.tp == 'CAROPT'){
			// 템플릿 세팅
			var source = $('#carConfigView-template').html();
			var template = Handlebars.compile(source);
			
			var dataList = new Array();
			
			info.images.forEach(function(v,index){
				if(info.tp == 'CAR' || (info.tp == 'CAROPT' && index <= 6)){	
					var node = {
							imgUrl : v.imgUrl
							,optGrp : v.optGrp
						    ,alt : "image_"+index	
					};
					dataList.push(node);
				}
			});
			var data = {
					dataList : dataList
			}
			var html = template(data);
			$('#carConfigView').data('tp',info.tp);
			$('#carConfigView').data('extColor',info.extColor);
			$('#carConfigView').data('intColor',info.intColor);
			$('#carConfigView').html('');
			$('#carConfigView').html(html);
			
			$('#carConfigView .slide-cont').slick({
				infinite: false,
				dots: true,
				initialSlide: (product.configDetail.hierachyTp == 'I' || product.configDetail.hierachyTp == '002') ? product.configDetail.carViewIntExtGo('int','t') : product.configDetail.carViewIntExtGo('ext','t'),
			});
			$('#carConfigView .slide-cont').off('afterChange');
			$('#carConfigView .slide-cont').on('afterChange', function(){
				var slickIndex = $('#carConfigView .slick-current').data('slick-index');
				if(slickIndex < 4){
					product.configDetail.carViewIntExtGo('ext','t');
				}else{
					product.configDetail.carViewIntExtGo('int','t');
				}
			});
			
			if(info.tp == 'CAR'){
				$('#carConfigView .slick-slide img').fadeIn(2000);
			}
		}
		
		if(info.tp == 'OPT' || info.tp == 'CAROPT'){
			$('#carConfigView .slick-slide').each(function(){
				$(this).find('.slideImage img').not(':first').remove();
			});
			info.images.forEach(function(v,index){
				if(info.tp == 'OPT' || (info.tp == 'CAROPT' && index > 6)){
					if(v.imgLoad){
						var mt = v.imgUrl.match(/([0-9]).png$/);
						if(mt){
							$('#carConfigView .slick-slide').each(function(){
								if($(this).find('.slideImage').data('optGrp') == v.optGrp){
									if(mt[1] == $(this).find('img').attr('src').match(/([0-9]).(png|jpg)$/)[1]){
										$(this).find('.slideImage').append('<img src="'+v.imgUrl+'" alt="image_opt_'+index+'"/>');
										return true;
									}
								}
							});
						}
					}
				}
			});
			if(info.tp == 'CAROPT'){
				$('#carConfigView .slick-slide img').fadeIn(2000);
			}
		}
	},
	/*
		추천 차량 세팅
	*/
	setOurRecommendationsSlide : function(){
		$('#slide-d-sample .slide-cont').slick({
			infinite: false,
			dots: true,
			slidesToShow: 3,
			slidesToScroll: 1,
			// dots: true,
			accessibility:true,
//			focusOnSelect:true,
			responsive: [
			{
			  breakpoint: 769,
			  settings: {
				slidesToShow: 2,
				slidesToScroll: 1
			  }
			}]
		})
	},
	/*
		옵션선택시 다음옵션선택 활성화
	*/
	carOptionSelect : function(e){
		
		$(e).find('input:radio').attr('checked', true);
		var selLvl1Seq = $(e).closest('li').data('lvl1Seq');
		if(typeof selLvl1Seq == 'number'){
			product.configDetail.lvl1Seq = selLvl1Seq + 1; 
		}else{
			product.configDetail.lvl1Seq = selLvl1Seq;
		}
		
		// 구성정보 조회
		product.configDetail.configInfoAjax();

		$(e).closest('li').addClass('selectComple');
		$(e).closest('li').next().addClass('on');

		if(product.configDetail.optionSelectScroll){
			product.configDetail.optionSelectScroll.refresh();
			var li = $(e).closest('li')
			var top = $(e).closest('li').offset().top;
			product.configDetail.optionSelectScroll.scrollToElement('#' + li.attr('id'),500);
		}
	},
	/*
		snackbar
	*/
	snackbar : function() {
    	var x = document.getElementById("snackbar")
    	x.className = "show";
    	setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
	},
	/*
		템플릿에서 사용 할 함수 등록
	*/
	addHandlebarsHelper : function() {
		Handlebars.registerHelper('math', function(v1, operator, v2) {
			v1 = parseFloat(v1);
			v1 = parseFloat(v1);
			return number +1;
		});
	},
	
};

//옵션선택영역 iScroll
var optionSelectScroll;
function optionSelectScroll_init(){
	optionSelectScroll = new IScroll('#optionSelectScroll', {
		checkDOMChanges: true,
		scrollbars: true,
		mouseWheel: true,
		interactiveScrollbars: true,
		shrinkScrollbars: 'scale',
		fadeScrollbars: true,
		disableMouse: true,
		disablePointer: true,
		disableTouch: false
	});
}

function optionSelectScroll_destroy(){
	optionSelectScroll.destroy();
	optionSelectScroll = null;
	$('#optionSelectScroll>.scroller').attr('style','');
}

function goPage(){
	var refUrl = document.referrer;
	
	if(refUrl.indexOf('detailInfoLayer.do') > -1){
		common.link.configModel();
	}else{
		history.back();
	}
	
}
/*
	레이어팝업 슬라이드 이벤트
*/
var setCarOptionSelectSlick = {
	init: function(slick_id){
		$('#'+slick_id+' .slide-cont').slick({
			infinite: false,
			slidesToShow: 2,
			slidesToScroll: 2,
			dots: true,
			accessibility:true,
			responsive: [
			{
			  breakpoint: 769,
			  settings: {
				slidesToShow: 1,
				slidesToScroll: 1
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
		function carOptionSelect_AutoCheck(){
			$('#' + slick_id + ' .slide-cont').on('beforeChange', function(event, slick, currentSlide, nextSlide){
			  //console.log(nextSlide);
			  var carCheckItemArr = $('#' + slick_id).find('input[type="radio"]');
			  $(carCheckItemArr[nextSlide]).attr('checked',true);

			});
		}
		function carOptionSelect_AutoCheck_remove(){
			$('#' + slick_id + ' .slide-cont').off('beforeChange');
		}
	}
}
/*
	레이어팝업 swiper 이벤트
*/
var swiperOptionChange = {
	init: function(id){
		var swiperOptionChange_option = new Swiper('#'+id + ' .option',{
			slidesPerView: 3,
			centeredSlides: true,
			spaceBetween: 90,
			navigation: {
				nextEl: '#'+id + ' .swiper-button-next',
				prevEl: '#'+id + ' .swiper-button-prev',
			},
			on: {
				slideChange: function () {
					swiperOptionChange_option.update();
					$('#'+id + ' .currentSelect .swiper-slide-active input[type="radio"]').prop('checked',true);//현재 선택된요소 체크
					console.log($('#'+id + ' .currentSelect .swiper-slide-active input[type="radio"]:checked').val());
				},
			},
			responsive: [
			{
			  breakpoint: 768,
			  settings: {
				spaceBetween: 30,
			  }
			}]
		});
		if($('#'+id + ' .currentSelect').length > 0){
			var swiperOptionChange_current = new Swiper('#'+id + ' .currentSelect',{
				slidesPerView: 4,
				spaceBetween: 0,
				centeredSlides: true,
				effect: 'fade',
				allowTouchMove: false,
				observer: true,
				observeParents: true,
				pagination: {
					el: '#'+id + ' .swiper-pagination',
					type: 'fraction',
				}
			});
			$('#'+id + ' .currentSelect').on('touchstart', function(event){});
			swiperOptionChange_option.controller.control = swiperOptionChange_current;
		}
	}
}
/*
	레이어팝업 패키지 swiper 이벤트
*/
var swiper_packages = {
	init: function(){
		swiper_packages_setting();
		enquire.register("screen and (min-width: 768px)", {
			match : function() {
				swiper_packages_destroy();
			},
			unmatch : function() {
				swiper_packages_setting();
			}
		});

		var swiper_packages_a = '';
		function swiper_packages_setting(){
			swiper_packages_a = new Swiper('#swiper-packages',{
				spaceBetween:20,
				observer: true,
    			observeParents: true,
				pagination: {
					el: '#swiper-packages .swiper-pagination',
					type: 'fraction',
				},
			});
		}
		function swiper_packages_destroy(){
			if(swiper_packages_a){
				swiper_packages_a.destroy();
			}
		}
	}
}
/*
	이미지 로드
*/
var configImgLoad = {
	images : [],	
	imageCount : 0,
	loadedCount : 0, 
	errorCount : 0,
	info : null,

  	init : function(info) {
  		this.info = info;
  		this.images = this.info.images;
  		this.imageCount = this.images.length;
  		
	  	for (var i = 0; i < this.imageCount; i++) {
  			var img = new Image();
		
  			img.onload = this.onload; 
  			img.onerror = this.onerror;
  			img.src = this.images[i].imgUrl;
	  	}
  	},
  	onload : function() {
  		configImgLoad.loadedCount++;
  		var src = $(this).attr('src');
  		configImgLoad.info.images.forEach(function(v, idx){
			if(v.imgUrl == src){
				v.imgLoad = true;
				return true;
			}
		});
  		configImgLoad.checkAllLoaded();
	},
	onerror : function() {
		configImgLoad.errorCount++;
		var src = $(this).attr('src');
		configImgLoad.info.images.forEach(function(v, idx){
			if(v.imgUrl == src){
				v.imgLoad = false;
				return true;
			}
		});
		configImgLoad.checkAllLoaded();
  	},
  	checkAllLoaded : function() {
  		console.log('this.loadedCount:'+configImgLoad.loadedCount);
  		if (configImgLoad.loadedCount + configImgLoad.errorCount == configImgLoad.imageCount ) {
  			configImgLoad.loadedCount = 0;
  			configImgLoad.errorCount = 0;
  			
  			if(typeof configImgLoad.info.callbackFn != 'undefined'){
  				configImgLoad.info.callbackFn(configImgLoad.info);
  			}
		}
	}
}