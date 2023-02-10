// [HI] ---------------    HI 공통 - 로딩바, 레이어팝업(full, modal, alert, toast), HEADER 고정, FOOTER, TOP버튼    ---------------------//
var HI = {
	/* s:로딩바 open */
	LOADING_open : function() {
		$("#HIloading").show();
	},
	/* e:로딩바 open */
	
	/* s:로딩바 close */
	LOADING_close : function() {
		$("#HIloading").hide();
	},
	/* e:로딩바 close */

	/* s:브랜드로딩 open */
	brandLoading_open : function() {
		$("#brandLoading").show();
	},
	/* e:브랜드로딩 open */
	
	/* s:브랜드로딩 close */
	brandLoading_close : function() {
		$("#brandLoading").hide();
	},
	/* e:브랜드로딩 close */

	POPUP_open : function(obj, alertMessage){// 팝업 (DIV ID - DIV CLASS - 메세지)
		if (obj == 'HIAlert_Wrap02' || obj == 'HIAlert_Wrap'){
			var objCont = $('#' + obj);
			var objTextBox = $('#' + obj + ' > .message');
			objTextBox.append( alertMessage );

		} else {
			var objData = obj.attr('data-popup');
			var objCont = $('#' + objData);
		}
		objCont.addClass("active");
		$("html").addClass('scroll_hidden');

		// dim
		if(objCont.hasClass('select')){//셀렉트박스 레이어 스크립트 full 레이어팝업 안에서 dim
			let dimd = '';
			dimd += '<div class="HI_selectdim"></div>';
			objCont.parent().append(dimd);
		} else {
			HI.DIM_open(objCont);
		}
		/* s:callback 처리 추가 */
		// ok callback
		var okCallbackArgs = Array.prototype.slice.call(arguments, 2, 4);
		objCont.find(".btn_alert01").off("click").on("click", function(e){
			e.stopPropagation();
				
			if(okCallbackArgs != undefined
				&& okCallbackArgs != null
				&& okCallbackArgs.length > 0
				&& typeof okCallbackArgs[0] === 'function'){
				
				if(okCallbackArgs.length > 1){
					okCallbackArgs[0].apply(this, okCallbackArgs);
				} else {
					okCallbackArgs[0]();
				}
			} else {
				HI.POPUP_close($(this));
			}
		});

		// cancel callback
		var cancelCallbackArgs = Array.prototype.slice.call(arguments, 4, 6);
		objCont.find(".btn_alert02").off("click").on("click", function(e){
			e.stopPropagation();
			
			if(cancelCallbackArgs != undefined
				&& cancelCallbackArgs != null
				&& cancelCallbackArgs.length > 0
				&& typeof cancelCallbackArgs[0] === 'function'){
				
				if(cancelCallbackArgs.length > 1){
					cancelCallbackArgs[0].apply(this, cancelCallbackArgs);
				} else {
					cancelCallbackArgs[0]();
				}
			} else {
				HI.POPUP_close($(this));
			}
		});
		/* e:callback 처리 추가 */

		// button text
		if (obj == 'HIAlert_Wrap02' || obj == 'HIAlert_Wrap'){
			$('#' + obj + ' > .btn_area > ul > li > .btn_alert02').text("취소");
			$('#' + obj + ' > .btn_area > ul > li > .btn_alert01').text("확인");
			
			var buttonTextArgs = Array.prototype.slice.call(arguments, 6, 8);
			if(buttonTextArgs != undefined
				&& buttonTextArgs != null
				&& buttonTextArgs.length > 0){
				if (buttonTextArgs[0] != null) {
					$('#' + obj + ' > .btn_area > ul > li > .btn_alert02').text(buttonTextArgs[0]);
				}
				if (buttonTextArgs[1] != null) {
					$('#' + obj + ' > .btn_area > ul > li > .btn_alert01').text(buttonTextArgs[1]);
				}	
			}
		}
	},

	POPUP_layer_open : function(obj, alertMessage){// 약관 full layer
		var objCont = $('#' + obj);
		
		if(objCont.length != 1) {
			return false;
		}
		
		var callbackArgs = Array.prototype.slice.call(arguments, 1);
//		if(callbackArgs != undefined
//			&& callbackArgs != null
//			&& callbackArgs.length < 2){
//			return false;
//		}
		
		// title
		if(callbackArgs[0] != undefined
				&& callbackArgs[0] != null
				&& typeof callbackArgs[0] === 'string'){
			objCont.find(".p_head .tit").html(callbackArgs[0]);
		}
		// html
		if(callbackArgs[1] != undefined
				&& callbackArgs[1] != null
				&& typeof callbackArgs[1] === 'string'){
			objCont.find(".p_wrap").html(callbackArgs[1]);
		}
		
		if(objCont.hasClass('HIpop_full')){
			
			if(callbackArgs != undefined
				&& callbackArgs != null
				&& callbackArgs.length > 6
				&& typeof callbackArgs[6] === 'boolean'
				&& callbackArgs[6]){
				
				var btnName="확인";
				if(callbackArgs[7] != undefined
					&& callbackArgs[7] != null
					&& typeof callbackArgs[7] === 'string'){
					btnName = callbackArgs[7];
				}
				
				var btnDiv = "<div class='btn_sticky'>"
					+ "<button type='button' class='btn_big01'>"+btnName+"</button>"
					+ "</div>";

				var btnName2="";
					if(callbackArgs[8] != undefined
					&& callbackArgs[8] != null
					&& typeof callbackArgs[8] === 'string'){
					btnName2 = callbackArgs[8];
					btnDiv = "<div class='btn_sticky'>"
					+ "<button type='button' class='btn_big03'>"+btnName+"</button>"
					+ "<button type='button' class='btn_big01'>수정하기</button>"
					+ "</div>";
					};
				$(objCont).children('.p_wrap').append(btnDiv);
			}
		}
		
		objCont.addClass("active");
		$("html").addClass('scroll_hidden');
		
		// dim
		HI.DIM_open(objCont);

		/* s:callback 처리 추가 */
		// close callback
		var cancelCallbackArgs = Array.prototype.slice.call(callbackArgs, 2, 4);
		objCont.children(".pop_close").off("click").on("click", function(e){
			e.stopPropagation();
			
			if(cancelCallbackArgs != undefined
				&& cancelCallbackArgs != null
				&& cancelCallbackArgs.length > 0
				&& typeof cancelCallbackArgs[0] === 'function'){
				
				if(cancelCallbackArgs.length > 1){
					cancelCallbackArgs[0].apply(this, cancelCallbackArgs);
				} else {
					cancelCallbackArgs[0]();
				}
			} else {
				HI.POPUP_close($(this));
			}
		});
		
		// ok callback
		var okCallbackArgs = Array.prototype.slice.call(callbackArgs, 4, 6);
		objCont.find(".btn_big01").off("click").on("click", function(e){
			e.stopPropagation();
				
			if(okCallbackArgs != undefined
				&& okCallbackArgs != null
				&& okCallbackArgs.length > 0
				&& typeof okCallbackArgs[0] === 'function'){
				
				if(okCallbackArgs.length > 1){
					okCallbackArgs[0].apply(this, okCallbackArgs);
				} else {
					okCallbackArgs[0]();
				}
			} else {
				HI.POPUP_close($(this));
			}
		});
		/* e:callback 처리 추가 */
	},

	POPUP_close : function(obj){//팝업 닫기
		obj.closest('[class^="HIpop_"]').removeClass('active');
		const pop_name = $('[class^="HIpop_"].active').length;
		const pop_notFull = $('[class^="HIpop_"]:not(.HIpop_full).active').length;
		if(pop_name < 1){
			$("html").removeClass('scroll_hidden');
			$('.HI_fullDimd').remove();
		}
		if(pop_notFull < 1){
			$('.HI_dimd').remove();
		}
		
		if(obj.closest('[class^="HIpop_"]').hasClass('select')){//셀렉트박스 레이어 스크립트 full 레이어팝업 안에서 dim
			$('.HI_selectdim').remove();
		}
		var objTextBox = $('.HIpop_alert > .message');
		objTextBox.empty();
	},

	POPUP_toast : function(obj, toastMessage){// 토스트 팝업 (DIV ID - DIV CLASS - 메세지)
		var objID = $('#' + obj);
		var objTextBox = $('#' + obj + ' > div');
		objTextBox.empty();
		objTextBox.append( toastMessage );
		if(!$('#HIactionbar').length == 0){
			objID.css({'bottom':'72px','opacity':'1',});
		} else if(!$('.btn_sticky').length == 0){
			objID.css({'bottom':'76px','opacity':'1',});
		} else {
			objID.css({'bottom':'20px','opacity':'1',});
		}
		
		/* s:callback 처리 추가 */
		var callbackArgs = Array.prototype.slice.call(arguments, 2, 4);
		setTimeout(() => {
			const objH = objID.outerHeight();
			objID.css({
				'bottom':((10 + objH) * -1) + 'px',
				'opacity':'0',
			});
			
			if(callbackArgs != undefined
				&& callbackArgs != null
				&& callbackArgs.length > 0
				&& typeof callbackArgs[0] === 'function'){
				
				if(callbackArgs.length > 1){
					callbackArgs[0].apply(this, callbackArgs);
				} else {
					callbackArgs[0]();
				}
			}
		}, 3000);
		/* e:callback 처리 추가 */
	},
	
	DIM_open : function(objCont){
		/* 딤드*/
		let dimd = '';
		dimd += '<div class="HI_dimd"></div>';
		let dimd02 = '';
		dimd02 += '<div class="HI_fullDimd"></div>';
		if($('.HI_dimd').length < 1 && !objCont.hasClass('HIpop_full')){
			$('body').append(dimd);
		} else {
			$('body').append(dimd02);
		}
		/* //딤드*/
	},
	tooltip : function(){
		/* 열기 */
		$(document).off("click",".HI_tooltip .open").on("click",".HI_tooltip .open", function(){
			var _objWindow = $(window).width();
			var _obj = $(this).parent();
			var _objLeft = $(this).offset().left;
			var _objCont = $(this).parent().children('.cont');
			var _objWidth = _objCont.outerWidth();
			if((_objLeft + _objWidth) > (_objWindow - 21)){
				var minusLeft2 =_objLeft + _objWidth - _objWindow + 21;
				_objCont.css({
					"margin-left": `-${minusLeft2}px`,
				});
			}
			if(_obj.hasClass('on')){
				_obj.removeClass('on')
			} else {
				_obj.addClass('on');
			}
		});
		/* //열기 */
		/* 닫기 */
		$(document).off("click",".HI_tooltip .close").on("click",".HI_tooltip .close", function(){
			var _obj = $(this).parent().parent();
			_obj.removeClass('on')
		});
		/* //닫기 */
	},
	tab : function(){
		$(document).off("click",".tab_list > li").on("click",".tab_list > li", function(){
			const tabRoot = $(this).closest('.tab');
			const tabBoxItem = $('.tab_cont > .tab_item');
			let tabIdx = $(this).index();

			$(this).addClass('on').siblings().removeClass('on');
			tabRoot.find(tabBoxItem).removeClass('on').eq(tabIdx).addClass('on');
		});
	},

	toggle : function(){
		$('.toggle').off();
		$('.toggle').on('click', '.tit_btn, .btn_more, .btnToggle' ,function(){
			var textAfter = $(this).attr('data-text');
			var toggleTarget = $(this).attr('data-target');
			var toggleParent = $(this).parent();
			var toggleChild = $(this).parent().parent();
			var toggleCont = (toggleTarget == 'child') ? toggleChild : toggleParent;
			// Cont on
			if(toggleCont.hasClass('on')) {
				toggleCont.removeClass('on');
			} else {
				toggleCont.addClass('on');
			}

			// Text Change
			if(textAfter != null){
				var textBefore = $(this).text();
				$(this).text(textAfter);
				$(this).attr("data-text", textBefore);
			}
		});
	},
	
	top : function(){ //type
		$('#HItop').addClass('ready');
		// $('#HItop').hide();
		// $('#HItop').addClass('type0'+type);
		let tst = $(window).scrollTop();
		if(tst > 0){
			$('#HItop').addClass('scroll');
		}
		$(window).scroll(function(){
			let tst = $(this).scrollTop();
			if(tst != 0){
				$('#HItop').addClass('scroll');
			} else {
				$('#HItop').removeClass('scroll');
			}
		});
		$('#HItop a[title=top]').click(function(){
			$('html, body').animate({
				scrollTop : 0
			}, 300);
			return false;
		});
	},
	
	HeadSticky : function(){// 페이지 header 상단 고정
		const header =$('#HIheader [class^="h_header"]:not(".h_header_search")');
		const headH = header.height();// header 높이
	
		if($('.jQ_sticky').length != 0){// 전시템플릿 상단 흰색 아이콘 
			const cornerH = $('.jQ_sticky').height();// 코너 높이
			let wst = $(window).scrollTop();
			$('#HIcontents').css('padding-top', 0);
	
			$(window).scroll(function(){
				const tst = $(this).scrollTop();
				if(tst + headH >= cornerH){
					header.addClass('fixed');
					//$('#HIheader [class^="h_"]').removeClass('visual');
				} else {
					//$('#HIheader [class^="h_"]').addClass('visual');
					header.removeClass('fixed');
				}
				if(tst > wst || tst == 0){
					header.show();
				} else {
					header.hide();
				}
				wst = tst;
			});
		} else {
			$(window).scroll(function(){
				const windowST = $(this).scrollTop();
				if(windowST >= 1){
					header.addClass('fixed');
				} else if(windowST == 0){
					header.removeClass('fixed');
				}
			});
		};
	},

	footer : function(){
		$(".foot_info button").click(function(){
			var scrollBottom = $(window).scrollTop() + $(window).height();
			
			$(this).toggleClass('on');
			$(this).next().slideToggle(100,function(){
				$('html, body').animate({scrollTop : scrollBottom + 'px'}, 200);
			});
		});
	},

	countDueDay : function(objId, untilDate){// 마이페이지 시간 count
		var timeDiv = $('#' + objId);
		//var Dday = new Date("Dec 16, 2021, 19:30:00").getTime(); //디데이
		var Dday = new Date(untilDate).getTime(); //디데이
		setInterval(function(){
			var now = new Date(); //현재 날짜 가져오기
			var distance = Dday - now;
			var d = Math.floor(distance / (1000 * 60 * 60 * 24));
			var h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			var s = Math.floor((distance % (1000 * 60)) / 1000);
			if(s < 10){
				s = '0'+s;
			}
			if(d > 0){
				$('#' + objId).html(d+'일 '+h+' : '+m+' : '+s)
			} else if (h > 0) {
				$('#' + objId).html(h+' : '+m+' : '+s)
			} else if (h == 0 && m > 0) {
				$('#' + objId).html(m+' : '+s)
			} else if (h == 0 && m == 0 && s > 0) {
				$('#' + objId).html(s)
			}
		}, 1);
	},

	imgResize : function(){ //swiper 이미지 resize 세로형일시 class hei 가로형 class wid
		$('.img_resize ul li img').each(function(i, d){
			if(!d.complete || $(this)[0].naturalWidth === 0){
				d.onload = function(){
					if($(this)[0].naturalHeight >= $(this)[0].naturalWidth){
						$(this).parent().addClass('hei');
					}else{
						$(this).parent().addClass('wid');
					}
				}
			}else{
				if($(this)[0].naturalHeight >= $(this)[0].naturalWidth){
					$(this).parent().addClass('hei');
				}else{
					$(this).parent().addClass('wid');
				}
			}
        })
	}
}


var filesToUpload = [];
// [FRM] ---------------    폼태그  ---------------------//
var FRM = {
	InboxType01 : function(){// input 공통
		var resizeChk = new ResizeChk();
		var inBoxArry = [];
		var inBoxEventChk = function(obj) {
			var returnState = false;
			for(var idx = 0; idx <= inBoxArry.length; idx++) {
				if(inBoxArry[idx] === obj) {
					returnState = true;
					break;
				}
			}
			return returnState;
		}
		let createDel = function(obj) {
			const btn = document.createElement('button');
			btn.classList.add('btn_delete');
			btn.innerText = "삭제";
			obj.insertAdjacentElement('afterend', btn);
		}
		$(document).on(
			'click',
			'[class^="inbox_type"]:not(.focus, .address, .msg), [class^="inp_"]',
			function(e){
				var _this = $(this);
				var childInput = _this.children('.txt');
				var timeout;
				
				if(!inBoxEventChk(_this[0])) {

					if(_this.hasClass('identity')){
						childInput.each(function(){
							createDel($(this)[0]);
						})
					}
					inBoxArry.push(_this[0]);

					childInput.each(function(){
						var child = $(this);
						child.on('focusin', function(){ 
							clearTimeout(timeout);
							if(child.val().length > 0) {
								if(_this.hasClass('identity')) {
									child.addClass('delete_on');
								} else {
									_this.addClass('delete_on');
								}
							}
							setTimeout(()=>{
								resizeChk.func();
							},100)
						});
						child.on('focusout', function(){
							timeout = setTimeout(function(){
								_this.removeClass('focus');
								if(child.val().length > 0) {
									if(_this.hasClass('identity')) {
										childInput.removeClass('delete_on');
									} if(!_this.hasClass('inp_search')) {
										_this.removeClass('delete_on');
									}
								}
								if(_this.hasClass('inbox_type01')){
									if(child.val().length === 0){
										_this.removeClass('on');
									}
								}
							},200);
							resizeChk.func();
						})
						child.on('keyup', function(){
							if(child.val().length > 0 || !child.hasClass('unique')) {
								if(_this.hasClass('identity')) {
									child.addClass('delete_on');
								} else {
									_this.addClass('delete_on');
								}
								if(child.hasClass('type_number')) {
									chkNumber(child[0]);
								}
								if(child.hasClass('type_business')) {
									businessNumber(child[0]);
								}
								if(child.hasClass('type_corporate')) {
									corporateNumber(child[0]);
								}
							}
							if(child.val().length === 0) {
								_this.removeClass('delete_on');
							}
						})
					});
					
					var btnDel = _this.find('.btn_delete');
					if(btnDel.length > 0) {
						
						let delFunc = function(idx){
							$(childInput[idx]).val(null).focus();
							
							if(_this.hasClass('identity')) {
								$(childInput[idx]).removeClass('delete_on');
							} else {
								_this.removeClass('delete_on');
							}
						}
						btnDel.each(function(idx){
							var btn = $(this);
							var input = $(childInput[idx]);
							if(_this.hasClass('identity')) {
								let num = input.width() + input.position().left;
								btn[0].style.left = num+'px';
							}
							btn.on('click', function(){
								delFunc(idx);
							})
						})
						
					}

					if(_this.hasClass('email')) {
						var selValue = _this.find('.slt_box');
						var selClose = selValue.find('.pop_close');
						selValue.on('click', function() {
							event.stopPropagation();
							_this.removeClass('focus');
							_this.removeClass('delete_on');
							clearTimeout(timeout);
						});
						selClose.on('click', function(){
							HI.POPUP_close($(this));
						})
					}
				}

				if(childInput.length > 0) {
					if(!childInput.is(":disabled") && !childInput.attr("readonly")){
						_this.addClass('focus');
						if(_this.hasClass('inbox_type01')){
							_this.addClass('on');
						}
						childInput[0].focus();
					}
				}
			}
		);
	},

	ImgUpload01 : function(){// 내차팔기 필수 사진 업로드, 사진 리사이즈 ImgUploadResize 기능, div addClass on 기능
		if (window.File && window.FileList && window.FileReader) {
			$(".file_addphoto").on("change", function(e) {// 
				var _objData = $(this).attr('data-file');
				var _objParent = $(this).parent();
				var _objCont = $('#' + _objData);
				var files = e.target.files;
				if (files && files[0]) {//
					var fileReader = new FileReader();
					fileReader.onload = (function(e) {
						_objCont.html('<img src="'+ e.target.result +'" ><button class="btn_filedel">삭제버튼</button>');
						_objParent.addClass('on');
					});
					fileReader.readAsDataURL(files[0]);
				}//
			});
			$(document).off("click","[class^='addphoto_'] .btn_filedel").on("click","[class^='addphoto_'] .btn_filedel", function(){
				var _olId = $(this).closest("[class^='addphoto_']");
				var _objData = $(this).closest('span').attr('id');
				var _objCont = $('#' + _objData);
				_objCont.empty();
				_olId.removeClass('on');
				HI.POPUP_toast("HIToast_Wrap", "이미지가 삭제되었습니다.");
			});
			
		}
	},

	ImgUpload02 : function(){//내차팔기 추가 사진 업로드, 사진 리사이즈 ImgUploadResize 기능, div  class on 추가
		var count = 0; //등록 이미지 카운팅

		$(".file_morephoto").change(function (evt) {
			var _objData = $(this).attr('data-file');
			var _objDataItem = parseInt($(this).attr('data-item'));
			var _objCont = $('#' + _objData);
			var files = evt.target.files, 
			filesLength = files.length;
			var i = 0;

			for (var i = 0; i < evt.target.files.length; i++) {
				filesToUpload.push(evt.target.files[i]);
			};
			for (var i = 0, f; f = evt.target.files[i]; i++) {
				var f = files[i]
				var fileReader = new FileReader();
				var fileName = escape(f.name);
	
				fileReader.onload = (function(evt) {
					if(count < _objDataItem){// _objDataItem은 최대 업로드 가능 
						count++;
						_objCont.prepend(
							'<li class="item" data-text="'+ fileName +'"><img src="'+ evt.target.result +'"  ><button class="btn_filedel" data-fileid="'+ count +'" >삭제버튼</button></li>'
						);
						$('.addphoto_list dl').removeClass('on');
					} else if (filesLength > _objDataItem ){
						//alert('최대' + _objDataItem + '개까지 업로드 가능합니다.');
						HI.POPUP_toast("HIToast_Wrap", '최대' + _objDataItem + '개까지 업로드 가능합니다.');
					}
				});
				fileReader.readAsDataURL(f);
				fileReader.onloadend = function(){// 업로드 사진 개수 넣어주기
					var _objContItemL = $('#' + _objData + ' .item').length;
					var _objContItemNo = $('#' + _objData + 'no');
					_objContItemNo.text(_objContItemL);
				}
			};
		});
		
		$(document).off("click",".btn_filedel").on("click",".btn_filedel", function(){
			var _olId = $(this).closest('ol');
			var _objData = $(this).closest('ol').attr('id');
			var _objCont = $('#' + _objData + 'no');
			var _objContItemNo = _objCont.text();
			_objCont.text(Number(_objContItemNo)-1);// 총 수량 빼주기
			$(this).parent(".item").remove();
			count--;
			if(_objContItemNo == 1){
				$('.addphoto_list dl').addClass('on');
			}
			HI.POPUP_toast("HIToast_Wrap", "이미지가 삭제되었습니다.");
		});
	},

	ImgUpload03 : function(){//이전서류 등록
		let iptParents;
		$('.order_receipt .ipt_doc').on('change', function(e){
			iptParents = $(this).parents('.item_doc');
			let _fileName = $(this).val();
			let _labelTextA = iptParents.find('label').attr('data-text');
			let _labelTextB = iptParents.find('label').text();
			iptParents.find('label').text(_labelTextA);
			iptParents.find('label').attr("data-href", _labelTextB);

			iptParents.addClass('on');
			$(this).attr('disabled', true);
			
			var files = e.target.files, 
				filesLength = files.length;
			var i = 0;
			for (var i = 0; i < filesLength; i++) {
				var f = files[i]
				var fileReader = new FileReader();
				fileReader.onload = (function(e) {
					if (f.type.match('image/*')) {
						iptParents.find('.complete').prepend(
							'<span class="img"><img src="'+ e.target.result +'" ></span><span class="txt"> '+ _fileName + '</span><button type="button" class="btn_txt01">삭제</button>'
						);
					}else{
						iptParents.find('.complete').prepend(
							'<span class="img"><embed src="'+ e.target.result +'" class="HI_pdfobject" type="application/pdf" title="Embedded PDF"></span><span class="txt"> '+ _fileName + '</span><button type="button" class="btn_txt01">삭제</button>'
						);
					}
				});
				fileReader.readAsDataURL(f);
			}
		});

		$('.order_receipt .ipt_doc2').on('change', function(e){
			iptParents = $(this).parents('.item_doc');
			let _fileName = $(this).val();
			let _labelTextA = iptParents.find('label').attr('data-text');
			let _labelTextB = iptParents.find('label').text();
			iptParents.find('label').text(_labelTextA);
			iptParents.find('label').attr("data-href", _labelTextB);

			iptParents.addClass('on');
			
			var files = e.target.files, 
				filesLength = files.length;
			var i = 0;
			for (var i = 0; i < filesLength; i++) {
				var f = files[i]
				var fileReader = new FileReader();
				fileReader.onload = (function(e) {
					iptParents.find('.complete').prepend(
						'<li><span class="txt"> '+ _fileName + '</span><button type="button" class="btn_txt01">삭제</button></li>'
					);
				});
				fileReader.readAsDataURL(f);
			}
		});

		$(document).off("click",".order_receipt .complete .btn_txt01").on("click",".order_receipt .complete .btn_txt01", function(){
			iptParents = $(this).parents('.item_doc');
			iptParents.removeClass('on');
			iptParents.find('.ipt_doc').val('').attr('disabled', false);
			iptParents.find('.complete').empty();

			let _labelTextA = iptParents.find('label').attr('data-text');
			let _labelTextB = iptParents.find('label').text();
			iptParents.find('label').text(_labelTextA);
			iptParents.find('label').attr("data-href", _labelTextB);


		});
		$(document).off("click",".order_receipt .complete .txt").on("click",".order_receipt .complete .txt", function(){//
			let _thisTitle = $(this).parents('.item_doc').children('.upload').children('.tit').text();
			let _thisHtml = $(this).parent().children('.img').html();
			$('#UploadFileTitle').text(_thisTitle);
			$('#UploadFileView').append(_thisHtml);
			$('.lyr_full').show();
		})
		$(document).off("click",".lyr_full .lyr_close").on("click",".lyr_full .lyr_close", function(){
			$('.lyr_full').hide();
			$('#UploadFileTitle').empty();
			$('#UploadFileView').empty();
		});
	},

	ImgUpload04 : function(){//나의리뷰,1:1문의 추가 사진 업로드, 사진 리사이즈 ImgUploadResize 기능, div  class on 추가
		var count = 0; //등록 이미지 카운팅
	  
		$(".file_morephoto").change(function (evt) {
			var successCallback = function(args, body) {
				var _objData = $("#CarPhotoMore").attr('data-file');
				var _objDataItem = parseInt($("#CarPhotoMore").attr('data-item'));
				var _objCont = $('#' + _objData);
				var files = evt.target.files,
				filesLength = files.length;
				var i = 0;
		
				var reg = /(.*?)\.(jpg|jpeg|png|gif|bmp)$/;
				for (var i = 0; i < evt.target.files.length; i++) {
					if (evt.target.files[i].name.match(reg) && evt.target.files[i].size<=(12*1024*1024)) {
						filesToUpload.push(evt.target.files[i]);
					} else {
					HI.POPUP_toast("HIToast_Wrap", '12MB 미만의 이미지 파일을 등록해주세요.<br>(JPG, PNG 이외의 파일을 등록 불가)');
					}
				};
				for (var i = 0, f; f = evt.target.files[i]; i++) {
					if (evt.target.files[i].name.match(reg)) {
						var f = files[i]
						var fileReader = new FileReader();
						var fileName = escape(f.name);
				
						fileReader.onload = (function(evt) {	
							if(count < _objDataItem){// _objDataItem은 최대 업로드 가능
								count++;
								_objCont.prepend(
								/*'<li class="item" data-text="'+ fileName +'"><img src="'+ evt.target.result +'"  ><button class="btn_filedel" data-fileid="'+ count +'" >삭제버튼</button></li>'*/
								'<li class="item" data-text="'+ body +'"><img src="'+ evt.target.result +'"  ><button class="btn_filedel" data-fileid="'+ count +'" >삭제버튼</button></li>'
								);
								$('.addphoto_list dl').removeClass('on');
							} else if (filesLength > _objDataItem ){
								//alert('최대' + _objDataItem + '개까지 업로드 가능합니다.');
								HI.POPUP_toast("HIToast_Wrap", '최대' + _objDataItem + '개까지 업로드 가능합니다.');
							}
						});
						fileReader.readAsDataURL(f);
						fileReader.onloadend = function(){// 업로드 사진 개수 넣어주기
							var _objContItemL = $('#' + _objData + ' .item').length;
							var _objContItemNo = $('#' + _objData + 'no');
							_objContItemNo.text(_objContItemL);
						}
					}
				}
			};
			
			var successCallbackArgs = {
				$file : $(this),
				evt : evt
			}
			
			common.fileupload($(this), successCallback, successCallbackArgs);
		});
		
		$(document).off("click",".btn_filedel").on("click",".btn_filedel", function(){
		 var _olId = $(this).closest('ol');
		 var _objData = $(this).closest('ol').attr('id');
		 var _objCont = $('#' + _objData + 'no');
		 var _objContItemNo = _objCont.text();
		 _objCont.text(Number(_objContItemNo)-1);// 총 수량 빼주기
		 $(this).parent(".item").remove();
		 console.log(_objContItemNo);
		 count--;
		 if(_objContItemNo == 1){
		  $('.addphoto_list dl').addClass('on');
		 }
		 HI.POPUP_toast("HIToast_Wrap", "이미지가 삭제되었습니다.");
		});
	}
}


// [SRCH] ---------------    검색 영역  ---------------------//
var SRCH = {
	PageLoad : function(){// - 1. 로딩 시
		//setTimeout(() => {
			$('#srchBest').children().clone().appendTo( '#srchBest2' );
			$('.srch_keyword').addClass('load');
			$('.srch_model').addClass('load');
			// $('.btn_sticky').addClass('load');
		//}, 1000);
	},
	Best10Rolling : function(){//- 2. 인기검색어 롤링
		timer = setTimeout(function(){
			$('#srchBest li:first').animate( {marginTop: '-63px'}, 800, function() {
				$(this).detach().appendTo('ol#srchBest').removeAttr('style');
			});
			SRCH.Best10Rolling();//- 2. 인기검색어 롤링
		}, 3000);
	},
	Best10Open : function(){// - 3. 인기검색어 펼치기
		$(document).off("click",".srch_keyword .btn_open").on("click",".srch_keyword .btn_open", function(){
			const keywordH = $('.srch_keyword').height();
			$("#srchHistory").attr('data-href', 'model');
			$(this).parents('.srch_keyword').toggleClass('on');
			if(!$('.HI_search').hasClass('fixed')){
				SRCH.HeadFixed();
			}
			if($('.srch_keyword').hasClass('on')){
				clearTimeout(timer);// 인기검색어 롤링 stop
				$('#srchBest').children().remove();
				$('#srchBest2').children().clone().appendTo( '#srchBest' );
				//$('.srch_head').addClass('fixed');
				//$('.srch_ifbox').addClass('fixed');
			} else {
				SRCH.Best10Rolling();//- 2. 인기검색어 롤링
			}
		});
	},
	HeadFixed : function(){// 상단 고정을 위한 fixed 추가
		$('.HI_search').addClass('fixed');
	},
	ModelFixed : function(){// 스크롤 시, 상단으로 up 모션 호출
		$('#searchLayer').scroll(function(){
			if(searchLayer.scrollTop > 0 && !searchLayer.classList.contains('fixed')) {
				if(!searchLayer.classList.contains('isAnimate')){
					searchLayer.classList.add('isAnimate');
					searchLayer.classList.add('fixed');
					searchLayer.scrollTop = 1;
					setTimeout(function(){
						searchLayer.classList.remove('isAnimate');
					},900)
				}
			} else if(!$('.srch_recent, .srch_auto').is(':visible') && searchLayer.classList.contains('fixed') && searchLayer.scrollTop <= 0) {
				if(!searchLayer.classList.contains('isAnimate')){
					searchLayer.classList.add('isAnimate');
					searchLayer.classList.remove('fixed');
					$('.srch_keyword').removeClass('on');
					setTimeout(function(){
						searchLayer.classList.remove('isAnimate');
					},900)
				}
			} 
		});
		// $('#searchLayer').scroll(function(){
		// 	let tst = $('#searchLayer').scrollTop();
		// 	if(tst > 10){
		// 		console.log('scroll up')
		// 		if(!$('.HI_search').hasClass('fixed')){
		// 			$('.HI_search').addClass('fixed');
		// 			//$('#searchLayer').scrollTop(2);
		// 			$('.srch_model').animate({scrollTop: '2'}, 1000);
		// 		}
		// 	}
		// });
		// $('.srch_model').scroll(function(){
		// 	if($('.HI_search').hasClass('fixed')){
		// 		let tsts = $('.srch_model').scrollTop();
		// 		if(tsts == 0){
		// 			console.log('scroll down')
		// 				$('.HI_search').removeClass('fixed');
		// 				$('.srch_keyword').removeClass('on');
		// 				$('#searchLayer').animate({scrollTop: '0'}, 1000);
		// 			}
		// 		} 
		// });
	},
	ModelShow : function(){// 검색입력 focusIn
		$("#srchHistory").attr('data-href', 'model');
		$('.srch_model').show();
		$('.srch_keyword').show();
		$('.srch_model .btn_sticky').show();
		$('.srch_recent').hide();
		$('.srch_auto').hide();
	},
	RecentShow : function(){// 검색입력 focusOut
		$("#srchHistory").attr('data-href', 'model');
		$('.srch_model').hide();
		$('.srch_keyword').hide();
		if(!$('.HI_search').hasClass('fixed')){
			setTimeout(() => { 
				SRCH.HeadFixed();
			}, 100);
		}
		$('.srch_model .btn_sticky').hide();
		$('.srch_recent').show();
		$('.srch_auto').hide();
	},
	AutoLayertShow : function(){//검색입력 자동완성 레이어
		//$('.srch_head').addClass('fixed');
		$("#srchHistory").attr('data-href', 'model');
		$('.srch_model').hide();
		$('.srch_keyword').hide();
		if(!$('.HI_search').hasClass('fixed')){
			setTimeout(() => { 
				SRCH.HeadFixed();
			}, 100);
		}
		$('.srch_model .btn_sticky').hide();
		$('.srch_recent').hide();
		$('.srch_auto').show();
		$('.ic_back').click(function(){
			SRCH.ModelShow();
		});
		
	},
	RecentSwipe : function(){// 최근검색어 swiper
		// $('.recent_swiper').each(function(i, d){	
		// 	//slide의 개수가 2개 이상일때만 pagination이 노출됨.
		// 	var $pagination = $(d).find('.swiper-slide').length > 1 ? '.swiper-pagination' : false;
		// 	new Swiper(d, {
		// 		slidesPerView:'auto',
		// 		autoHeight: true,
		// 		freeMode:false,
		// 		pagination:{
		// 			el: $pagination
		// 		}
		// 	});
		// });
	},
	// FilterLayerBack : function(){// 뒤로가기 버튼 1. MODEL - 이전페이지 / 2. 최근검색어 - MODEL / 3. 자동완성 - MODEL
	// 	$(document).off("click","#srchHistory")
	// 		.on("click","#srchHistory", function(){
	// 		var _thisRef = $(this).attr('data-href');
	// 		if(_thisRef == 'back'){
	// 			window.history.back();
	// 		} else if (_thisRef == 'model'){
	// 			SRCH.ModelShow();
	// 		}
	// 	});
	// },
	// FilterModelAll : function(thisObj){//모델 전체보기
	// 	var _idName = thisObj.attr('data-href');
	// 	var _idNameID = $('#' + _idName);

	// 	if( _idNameID.hasClass('on') ){
	// 		_idNameID.removeClass('on');
	// 	} else {
	// 		_idNameID.addClass('on');
	// 	}
	// },
	FilterOpenClose : function(thisObj){//검색 조건 열기, 닫기
		var _incont = thisObj.attr('data-href');
		var _incontID = $('#' + _incont);
		
		// if(_incontID.hasClass('on')){
		// 	_incontID.removeClass('on');
		// } else {
		// 	_incontID.addClass('show on');
		// }
		_incontID.addClass('show');
	},
	FilterSaveCheck : function(formName, divID){// 필터 내 > 카테고리, 브랜드, 색상, 옵션 적용하기 버튼
		var send_array = Array();
		var send_cnt = 0;
		var chkbox = $("input[name=" + formName + "]").parents('.srch_box').find('input');
		// var checkSelf = _thisObj.attr("checked", false);
		// if (_thisObj.is( ":checked")){
		// } else {
		// }
		for(i=0;i<chkbox.length;i++) {
			if (chkbox[i].checked == true){
				var chckName = chkbox[i].id;
				var chckLabel = $("label[for='"+chckName+"']").text();
				send_array[send_cnt] = chckLabel;
				send_cnt++;
				if(chkbox[i].closest('.depth2, .depth3')){
					divID = chkbox[i].closest('.carinfo').querySelector('input').getAttribute('name');
				}
			}
		}
		$("#" + divID).text(send_array);
	},
	FilterPriceRange : function(amt01, amt02, rangeBox, stepsNum, amtTxt, _callback){//필터 내 > 가격 Range 스크립트
		const numberWithCommas  = (x) => {// 숫자 천의자리 표현
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		var amt01ID = $("#" + amt01);
		var amt02ID = $("#" + amt02);
		var _rangeHIRange = $('#' + rangeBox + ' .HIRange');
		var _rangeHIChck = $('#' + rangeBox + '-Chk i');// 선택값 타이틀 옆에 text 붙여주기
		var minValue = amt01ID.data('min');
		var maxValue = amt02ID.data('max');
		var minPriceSearch = amt01ID.data('min');
		var maxPriceSearch = amt02ID.data('max');
		var startVaule = amt01ID.val();
		var endVaule = amt02ID.val();
	
		// 가격
		if(maxValue < 1) {
			maxValue = maxPriceSearch;
		}
		// D:가격슬라이더
		_rangeHIRange.slider({
			range: true,
			min: Number(minPriceSearch),
			max: Number(maxPriceSearch),
			step:stepsNum,
			values: [Number(minValue), Number(maxValue)],
			change_val:false,
			create:function(event, ui){// 생성
				_rangeHIRange.append('<span class="min_no"></span>');
				_rangeHIRange.append('<span class="max_no"></span>');
				
				if(rangeBox != 'rangeYear'){
					$('#' + rangeBox + ' .HIRange .min_no').text(numberWithCommas( minValue ));
					$('#' + rangeBox + ' .HIRange .max_no').text(numberWithCommas( maxValue ));
	
				} else{
					$('#' + rangeBox + ' .HIRange .min_no').text(minValue);
					$('#' + rangeBox + ' .HIRange .max_no').text(maxValue);
					if(rangeBox == 'rangePrice'){
						SRCH.FilterPriceChart();// 가격 상단 그래프
					}
				}
			},
			change: function( event, ui ) {
				var sminValue = _rangeHIRange.slider("values", 0);
				var smaxValue = _rangeHIRange.slider("values", 1);
				
				if(rangeBox != 'rangeYear'){
					$(_rangeHIChck[0]).text(numberWithCommas( sminValue ));
					$(_rangeHIChck[1]).text(numberWithCommas( smaxValue ));
	
				} else{
					$(_rangeHIChck[0]).text(sminValue);
					$(_rangeHIChck[1]).text(smaxValue);
				}
				amt01ID.val(sminValue);
				amt02ID.val(smaxValue);
				if (_callback) {
					_callback();
				}
			},
		});
		if(rangeBox != 'rangeYear'){
			$('#' + rangeBox + ' .HIRange .min_no').text(numberWithCommas( minValue  + amtTxt));
			$('#' + rangeBox + ' .HIRange .max_no').text(numberWithCommas( maxValue  + amtTxt));
			$(_rangeHIChck[0]).text(numberWithCommas( startVaule ));
			$(_rangeHIChck[1]).text(numberWithCommas( endVaule ));
	
		} else{
			$('#' + rangeBox + ' .HIRange .min_no').text(minValue + amtTxt);
			$('#' + rangeBox + ' .HIRange .max_no').text(maxValue + amtTxt);
			$(_rangeHIChck[0]).text(startVaule);
			$(_rangeHIChck[1]).text(endVaule);
		}
		_rangeHIRange.slider("values", 0, startVaule);// handler 시작
		_rangeHIRange.slider("values", 1, endVaule);// handler 끝
		_rangeHIRange.on('touchend', function(){
			if(rangeBox == 'rangePrice'){
				SRCH.FilterPriceChart();// 가격 상단 그래프
			}
		});
		
	},
	FilterPriceChart : function(){// 가격 상단 그래프
		// let rangeLeft = parseInt($('#schBox-06 .ui-slider-range').next().css('left'));
		// let rangeLeft02 = parseInt($('#schBox-06 .ui-slider-range').next().next().css('left'));
		let rangeLeft = parseFloat($('#rangePrice .ui-slider-range').next().css('left'));
		let rangeLeft02 = parseFloat($('#rangePrice .ui-slider-range').next().next().css('left'));
		$('.list_chart li').each(function(){
			const length = $('.list_chart li').length;
			const interval = ($('.list_chart').width() / length) / 3;
			const barLeft = $(this).offset().left - 21;
			const rangeLeft3 = rangeLeft - interval;
			const rangeLeft4 = rangeLeft02 + interval;
			if(barLeft > rangeLeft3 && barLeft < rangeLeft4){
				$(this).addClass('on');
			} else {
				$(this).removeClass('on');
			}
		});
	},
	searchKey : function(){
		$('#keySearch').on('keyup',function(){// 인풋박스 키보드 칠때, null 값 체크 타이틀 up down & 입력값 삭제 버튼 show hide
			if($(this).val() != ''){
				$(this).parent().find('.btn_delete').show();
				$(this).parent().parent().find('.util').hide();
			}else{
				$(this).parent().find('.btn_delete').hide();
			}
		});
		$(document).off("click","#keySearchDel").on("click","#keySearchDel", function(){// 인풋박스 입력값 삭제
			$(this).parent().removeClass('on');
			$('#keySearch').val('');
			$('.btn_delete').hide();
			$('.util').show();
		});
	},
	//검색기획전 배너
	promotionSlide : function() {
		$('.srch_promotion_swiper').each(function(i, d){
			let swpOpt = {};
			var $pagination = $(d).find('.swiper-slide').length > 1 ? '.swiper-pagination' : false;
			if($(d).find('.swiper-slide').length <= 3) {
				$(d).addClass('under');
				$(d).removeClass('more');
				//2개 이하일때
				swpOpt = {
					slidesPerView:'auto',
					spaceBetween: 15,
					freeMode:false,
					pagination:{
						el: $pagination
					},
				}
			} else {
				$(d).addClass('more');
				$(d).removeClass('under');
				swpOpt = {
					slidesPerView:'auto',
					spaceBetween: 10
				}
				$(d).find('.swiper-pagination').hide();
			}
			new Swiper(d, swpOpt);
		});
	}
}//SRCH 검색 관련 스크립트 종료

// [SLP] ---------------    내차팔기 페이지 모션  ---------------------//
var SLP = {
	FO_TI_MS0002 : function(){// - 차량정보 및 시세 확인
		var cont01 = $('.sale_step01 .head').innerHeight();
		var cont02 = $('.sale_step01 .list ol').innerHeight();
		var cont03 = (((($(window).width() - 270) / 2)*0.01) + 1.1);
		
		if($(document).scrollTop() > 0){
			setTimeout(function(){
				$(document).scrollTop(0);
			},50)
		}

		$(window).resize(function(){
			if($(document).scrollTop() === 0){
				$('.sale_step01 .head .imgs').css('width','');
			}
		});

		$('.sale_car_info').addClass('on');
		$(window).scroll(function(){
			var $scrollTop = Math.floor($(document).scrollTop());

			if($scrollTop > 0){
				$('.sale_step01 .head .txt').addClass('off');
				$('.sale_step01').addClass('on');
			}else{
				$('.sale_step01 .head .txt').removeClass('off');
				$('.sale_step01, .sale_step02, .btn_sale').removeClass('on');
			}

			if($(window).height() + $scrollTop > Math.floor($('.sale_step02').offset().top + ($('.sale_step02').innerHeight() / 2))){
				$('.sale_step02').addClass('on');
			}

			if($(window).height() + $scrollTop > Math.floor($('.sale_step03').offset().top + ($('.sale_step03').innerHeight() / 2))){
				$('.sale_step03').addClass('on');

				/*var sale_pd03 = (Math.floor($('.sale_step03').offset().top + ($('.sale_step03').innerHeight() / 2)) - ($(window).height() + $scrollTop)) + 120;

				$('.sale_step03').css({
					"paddingTop": sale_pd03 > 60 && sale_pd03 < 120 ? sale_pd03 : 60
				});*/
			}else{
				$('.sale_step03').removeClass('on');
			}
			
			if($(window).height() + $scrollTop > Math.floor($('.sale_step04').offset().top + ($('.sale_step04').innerHeight() / 2))){
				$('.sale_step04').addClass('on');
				
				/*var sale_pd04 = (Math.floor($('.sale_step04').offset().top + ($('.sale_step04').innerHeight() / 2)) - ($(window).height() + $scrollTop)) + 120;
				
				$('.sale_step04').css({
					"paddingTop": sale_pd04 > 60 && sale_pd04 < 120 ? sale_pd04 : 60
				});*/
			}else{
				$('.sale_step04').removeClass('on');
			}

			if($(window).height() + $scrollTop > Math.floor($('.sale_step02').offset().top + ($('.sale_step02').innerHeight() - 102))){
				$('.btn_sale').addClass('on');
			}

			if($scrollTop <= cont01){
				$('.sale_step01 .head').css({
					"height": cont01 - $scrollTop > 133 ? cont01 - $scrollTop : 133,
					"transition" : "unset"
				});
				$('.sale_step01 .head .imgs').css({
					"top": 180 - $scrollTop > 68 ? 180 - $scrollTop : 68,
					"right": $scrollTop < 21 ? $scrollTop : 21,
					"width": $(window).width() - ($scrollTop * cont03) > 94 ? $(window).width() - ($scrollTop * cont03) : 94,
					"transition": "unset"
				});
				$('.sale_step01 .head img').css({
					"width": 270 - $scrollTop > 94 ? 270 - $scrollTop : 94,
					"transition": "unset"
				});
			}
			
			if($scrollTop <= cont02){
				$('.sale_step01').css({
					"padding-top":230 - $scrollTop
				})
				/*$('.sale_step01 .list').css({
					"height" :cont02 - $scrollTop
				});*/
			}
		});
	},
}

/* target = 타겟, animate = 퍼센트 애니메이션(true, false), animateTxt = 텍스트 애니메이션(true, false), time = 애니메이션 시간 */
function HIDonutChart(target, animate, animateTxt, time){
	const options = {
		animate : animate,
		animateTxt : animateTxt,
	}
	target.each(function(){
		if(!$(this).hasClass('progressBar02')){
			$(this).find('circle').attr({
				'transform':'rotate(-90, 100, 100)',
				'cx':167,
				'cy':33,
				'r':31,
			});
		} else {
			$(this).find('circle').attr({
				'transform':'rotate(-90, 100, 100)',
				'cx':115,
				'cy':83,
				'r':80,
			});
		}
		const $count = $(this).find('.progressCount');
		const $line = $(this).find('.progressLine');
		const percentProgress = $(this).attr('data-progress');
		const percentRemaining = (100 - percentProgress);
		const percentTxt = $(this).attr('data-progress');

		const radius = $line.attr('r');
		const diameter = radius * 2;
		const circumference = Math.round(Math.PI * diameter);

		const percentage =  circumference * percentRemaining / 100;
		$line.css({
			'stroke-dasharray' : circumference,
			'stroke-dashoffset' : percentage
		});
		
		if(options.animate === true){
			$line.css({
				'stroke-dashoffset' : circumference
			}).animate({
				'stroke-dashoffset' : percentage
			}, time)
		}
		if(options.animateTxt == true){
			$({Counter:0}).animate(
				{Counter:percentTxt},
				{duration:time,
				step: function () {
					$count.html(Math.ceil(this.Counter) + '<em>%</em>');
				}
			});
		}else{
			$count.text(percentTxt + '%');
		}
	});
}

/* sorting 적용하기 버튼 안 누르고 닫기 버튼 클릭 시 */
// function HIPlpSortingClose(){
// 	var sortSelect = $( ".btn_sort" ).attr('name');
// 	$('#' + sortSelect).prop('checked', true);
// }

/* sorting 적용하기 버튼 안 누르고 닫기 버튼 클릭 시 */
// function HIPlpSortingSave(obj){
// 	var sortChecked = $('input[name=' + obj + ']:checked');
// 	var sortCheckedId = sortChecked.attr('id');
// 	var sortCheckedId2 = sortChecked.prop("labels");
// 	var sortText = $(sortCheckedId2).text();

// 	$( ".btn_sort" ).text(sortText);
// 	$( ".btn_sort" ).attr( "name", sortCheckedId);
// 	$('.sorting_layer').parent().removeClass('on');
// }

function HI_SelectLayer(obj){//jQ_Select - 레이어 열릴 때, 체크된 id check 해주기
	//jQ_Select 클릭 기능 / id='radio name 동일' / data-id='체크된 id 값 넣기' / data-popup='레이어팝업 ID' 
	var _radioName = obj.attr('id');
	var _radioChkId = obj.attr('data-id');
	if(_radioChkId == ''){
		$('input[name=' + _radioName + '_Name]').prop('checked', false);
	} else {
		$('#' + _radioChkId).prop('checked', true);
	}
}

function HI_SelectSave(obj){//jQ_Select_Save - 적용하기 클릭 시, 레이어 닫고, name 변경된 내용 확인하기
	//jQ_Select_Save 클릭 기능 / data-id='radio name 동일' / data-popup='레이어팝업 ID'// 닫기, selectQna 변경 내용 적용클릭 시 */
	var _radioName = obj.attr('data-id');
	var _radioChecked = $('input[name=' + _radioName + '_Name]:checked')
	var _radioCheckedId = _radioChecked.attr('id');// 체크 ID
	var _radioCheckedIdTxt = _radioChecked.prop("labels");// 체크 LABEL
	var _radioText = $(_radioCheckedIdTxt).text();// 체크LABEL 텍스트
	if(_radioChecked.next('label').find('.HI_tooltip').length != 0) { //툴팁이 있다면
		_radioText = $(_radioCheckedIdTxt).html().split('<')[0];
	}
	$('#' + _radioName).text(_radioText);
	$('#' + _radioName).attr( "data-id", _radioCheckedId);
}

function HI_selecteChk(arg) {
	var targetId = arg.id;
	var targetIdx = arg.idx;
	var targetStr = arg.str;
	var targetBtn = $('#'+targetId);
	var targetInput = $('input[name=' + targetId + '_Name]');
	var	targetLabel = $('input[name=' + targetId + '_Name] ~ label');

	var target = 0;
	if(targetIdx) target = targetIdx;
	if(targetStr) {
		targetLabel.each(function(idx){
			if(this.innerText == targetStr) {
				target = idx;
			}
		});
	}
	targetBtn.text(targetLabel[target].innerText);
	targetInput[target].checked = true;
}
/* 장바구니 checkBox All & Button */
function HICartCheck(){
	var chkNameChk = $('input[name=cartList]:checked').length;
	// var chkName = $('input[name=cartList]').length;
	// var chkNameDis = $('input[name=cartList]:disabled').length;
	// var chkName2 = chkName - chkNameDis;
	// console.log($('input[name=cartList]:checked').length);
	if (chkNameChk == 0) {
		$('.btn_sticky button:nth-child(1)').show();
		$('.btn_sticky button:nth-child(2)').hide();
		$('.btn_sticky button:nth-child(3)').hide();
		$('.btn_sticky button:nth-child(1)').attr('disabled', true);
	} else if(chkNameChk == 1) {
		$('.btn_sticky button:nth-child(1)').show();
		$('.btn_sticky button:nth-child(2)').hide();
		$('.btn_sticky button:nth-child(3)').hide();
		$('.btn_sticky button:nth-child(1)').attr('disabled', false);
	} else if (chkNameChk <= 5) {
		$('.btn_sticky button:nth-child(1)').hide();
		$('.btn_sticky button:nth-child(2)').show();
		$('.btn_sticky button:nth-child(3)').show();
		$('.btn_sticky button:nth-child(3)').attr('disabled', false);
	} else if (chkNameChk > 5) {
		$('.btn_sticky button:nth-child(1)').hide();
		$('.btn_sticky button:nth-child(2)').show();
		$('.btn_sticky button:nth-child(3)').show();
		$('.btn_sticky button:nth-child(3)').attr('disabled', true);
	}
	$( "#cartChkTotal" ).text(chkNameChk);
}

/* 비교차량 선택 checkBox & Button */
function HICompareCheck(obj){
	var chkNameChk = $('input[name=CompareCheck]:checked').length;
	// var chkName = $('input[name=CompareCheck]').length;
	// var chkNameDis = $('input[name=CompareCheck]:disabled').length;
	// var chkName2 = chkName - chkNameDis;
	var btn01 = $('.btn_sticky button:nth-child(1)');
	var btn02 = $('.btn_sticky button:nth-child(2)');

	if (chkNameChk == 0) {
		btn01.attr('disabled', true);
		btn02.attr('disabled', true);
	} else if(chkNameChk == 1) {
		btn01.attr('disabled', false);
		btn02.attr('disabled', true);
	} else if (chkNameChk <= 5) {
		btn01.attr('disabled', false);
		btn02.attr('disabled', false);
	} else if (chkNameChk > 5) {
		btn01.attr('disabled', true);
		btn02.attr('disabled', true);
	}
	$( "#chkTotal" ).text(chkNameChk);


}

/* 비교하기 레이어 고정하기 */
function HICompareTarget(){
	$(".layer_compare .btn_pin01").on("click",function(){
		if ($(this).parents().closest('.item').hasClass('target')) {
			return;
		}else {
			$('.item').removeClass('target');
			$(this).parents().closest('.item').addClass('target');
		}
		// $(this).parents().closest('.item').hasClass('target') ? $(this).parents().closest('.item').removeClass('target') : $(this).parents().closest('.item').addClass('target');
		// $(this).parent().closest('.slide').insertBefore($('.target'));
		// $('.layer_compare .slide').removeClass('target');
		// $(this).parent().closest('.slide').addClass('target');
		// $('.layer_compare .slide').stop().animate({scrollLeft: 0}, 400, "linear");
		// $( ".layer_compare .list" ).scrollLeft( 0);
		// $( "#compareBox" ).scrollTop( 0);
	});
}

/* 비교하기 레이어 상단 sticky */
function HICompareSticky(){
	const compareBoxH = $('.HI_compare').height();
	const _tagLiSlide = $('.layer_compare .compare_list > li');
	const _tagUnitTop = $('.layer_compare .unit_compare > .top_area');
	const _tagUnitCompare = $('.layer_compare .unit_compare');
	// const _tagUnitImgDev = $('.layer_compare .unit_compare > .top_area .img');
	// const _tagUnitImgDev2 = $('.layer_compare .unit_compare > .top_area .img img');

	//li 높이값 넣기
	var heightArr = [];
	_tagLiSlide.each(function(){
		heightArr.push($(this).height()); 			// li 높이 값 배열에 담기
	});
	heightArr.sort(function(a, b){return b-a;}); 	// 내림차순// heightArr.sort(function(a, b){return a-b;}); // 오름차순
	var liHeight =_tagLiSlide.height(heightArr[0]); // 내림차순일 경우 최대값, 오름차순일 경우 최소값
	_tagLiSlide.css({ "height":liHeight});			// li에 최대 높이값 height 넣어주기
	$('.HI_compare').scroll(function(){
		let $thisTop = $(this).scrollTop();
		let $topH = _tagUnitTop.height() ;
		
		_tagUnitCompare.css({
			"padding-top":$topH,
		});
		_tagUnitTop.css({
			"top":$thisTop,
			"height":'auto',
		});
		if($thisTop >= 1){
			_tagLiSlide.addClass('fixed');
		} else if ($thisTop == 0) {
			_tagLiSlide.removeClass('fixed');
			_tagUnitCompare.css({
				"padding-top":'',
			});			
			_tagBtnAdd.removeAttr( 'style' );
		}
		// if($thisTop <= 92){
		// 	_tagUnitImgDev.css({
		// 		"width" :152 - $thisTop,
		// 		"height" :152 - $thisTop,
		// 		"padding-bottom" :152 - $thisTop,
		// 	});
		// } 
	});
}

// 마이페이지 포인트내역 기간
function HIPointSort(){
	$('.tab_sort li').eq(0).addClass('on');
	$('.tab_sort li').click(function(){
		$('.tab_sort li').removeClass('on');
		$(this).addClass('on');
	});
}

// 차량등록 인풋 모션
function HICarRegister(){
	setTimeout(() => { //여기서 부터 모션
		$('.lyer_mycar .depth01').removeClass('on').find('.ipt_mycar').slideUp(700); //depth01 텍스트 비활성화, 영역사라짐
		$('.lyer_mycar .depth01 .txt i').hide(); // 를 알려주세요 사라짐
		$('.lyer_mycar .num').show(); // 수정 버튼 나옴
		$('.lyer_mycar .car_num').addClass('on'); // 인풋 value값 모션
		$('.lyer_mycar .depth02 input[type="text"]').val(''); // 인풋 value값 리셋
		$('.lyer_mycar .depth02').addClass('on').find('.ipt_mycar').slideDown(700); //depth02 텍스트 활성화, 영역나옴
		$('.lyer_mycar .depth02 input[type="text"]').focus(); //depth02 input에 포커스
	}, 1000);
}

// PDP FO-PD-MS0003 할부계산기 타이틀
function HIPDPMS0003Tit(){
	$('#FO-PD-MS0003 .p_wrap').on('scroll',function(){
		if($(this).scrollTop() > 0){
			$(this).parent().find('.pdp_pop').css('paddingTop',$('.pdp_cont_tot').innerHeight() + 'px');
			$(this).find('.pdp_cont_tot').addClass('fixed');
		}else{
			$(this).parent().find('.pdp_pop').css('paddingTop','');
			$(this).find('.pdp_cont_tot').removeClass('fixed');
		}
	});
}

// textarea Length체크
function HITextarea(){
	
	var resizeChk = new ResizeChk();
	$('.textarea textarea').focusin(function(){
		$(this).parent().addClass('focus');
		setTimeout(()=>{
			resizeChk.func();
		},200);
	});
	$('.textarea textarea').focusout(function(){
		$(this).parent().removeClass('focus');
		setTimeout(()=>{
			resizeChk.func();
		},200);
	});
	$('[class^="textarea"] textarea').on('propertychange change keyup input paste', function(){
		let txtVal = $(this).val().length;
		if($(this).parent().hasClass('textarea')){
			if(txtVal == 0){
				$(this).parent().removeClass('on');
			} else {
				$(this).parent().addClass('on');
			}
		}
		$(this).next().find('.first').text(txtVal);
	});
}

// FO-MY-MS0015 이미지 업로드
function HIImgUpload(){
	if (window.File && window.FileList && window.FileReader) {
		$("#upload_file").on("change", function(e) {
		var files = e.target.files,
			filesLength = files.length;
			for (var i = 0; i < filesLength; i++) {
				var f = files[i]
				var fileReader = new FileReader();
				fileReader.onload = (function(e) {
					if(filesLength < 8){
						$('.upload_img').prepend(
							'<li class="item"><img src="'+ e.target.result +'"><button class="btn_file_del">삭제버튼</button></li>'
							);
						$(".btn_file_del").click(function(){
							$(this).parent(".item").remove();
						});
					}
				});
				fileReader.readAsDataURL(f);
			}
		});
	}
	$(".btn_file_del").click(function(){
		$(this).parent(".item").remove();
	});
}

// FO-MY-MS0015 리뷰 별점 선택(버튼)
function HIStarRating(){
	$(document).off("click",".rating .star button")
		.on("click",".rating .star button", function(){
		$(this).addClass('on').prevAll().addClass('on');
		if($(this).hasClass('on')){
			$(this).nextAll().removeClass('on');
		}
	});
}

// 별점
function HIStarRating02(){
	$('.rating02 .star em').each(function(){
		const starTxt = $(this).text();
		$(this).css({"width":(starTxt * 20) + "%"});
	});
}

// HI 이미지 lazyload
function HILazyload(target){
	var lazyloadImg;    
	if ("IntersectionObserver" in window) {
		lazyloadImg = document.querySelectorAll(target);
		var imgObserver = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					var img = entry.target;
					if(img.classList.contains('HI_lazy_v')){ //세로
						if((window.pageYOffset + window.innerHeight) > img.offsetTop){ // image.offsetTop 뒤에 픽셀 값 마이너스
							img.src = img.dataset.src;
							img.classList.remove('HI_lazy_v');
							imgObserver.unobserve(img);
						}
					} else if(img.classList.contains('HI_lazy_h')){ //가로
						if((window.pageXOffset + window.innerWidth) > img.offsetLeft){ // image.offsetLeft 뒤에 픽셀 값 마이너스
							img.src = img.dataset.src;
							img.classList.remove('HI_lazy_h');
							imgObserver.unobserve(img);
						}
					}
				}
			});
		});
		lazyloadImg.forEach(function(img) {
			imgObserver.observe(img);
		});
	}
}

document.addEventListener("DOMContentLoaded", function() {
	HILazyload('[class^="HI_lazy_"]');
});
// //HI 이미지 lazyload

//swiper 공통
function HISwiper(){
	$('.swiperType01').each(function(i, d){	
		//slide의 개수가 2개 이상일때만 pagination이 노출됨.
		var $pagination = $(d).find('.swiper-slide').length > 1 ? '.swiper-pagination' : false;
		var $prev = $(d).find('.swiper-slide').length > 1 ? '.swiper-button-prev' : false;
		var $next = $(d).find('.swiper-slide').length > 1 ? '.swiper-button-next' : false;
		//.swiperType01태그에 data-swiper-space 설정시 spaceBetween 설정됨. 
		var $spaceBetween = $(d)[0].dataset.swiperSpace !== undefined ? parseInt($(d)[0].dataset.swiperSpace) : 0;
		new Swiper(d, {
			slidesPerView:'auto',
			spaceBetween:$spaceBetween,
			freeMode:false,
			pagination:{
				el: $pagination
			},
			navigation: {
				nextEl: $next,
				prevEl: $prev
			}
		});
	});
	$('.swiperType02').each(function(i, d){	
		var $spaceBetween = $(d)[0].dataset.swiperSpace !== undefined ? parseInt($(d)[0].dataset.swiperSpace) : 0;
		new Swiper(d, {
			slidesPerView:'auto',
			spaceBetween:$spaceBetween,
			freeMode:true
		});
	});
}

//swiper2 공통 (나의리뷰)
function HISwiper2(){
	$('.swiperType03').each(function(i, d){	
		var $pagination = $(d).find('.swiper-slide').length > 1 ? '.swiper-pagination' : false;
		var $spaceBetween = $(d)[0].dataset.swiperSpace !== undefined ? parseInt($(d)[0].dataset.swiperSpace) : 0;
		new Swiper(d, {
			slidesPerView:'auto',
			spaceBetween:$spaceBetween,
			freeMode:false,
			pagination:{
				el: $pagination
			}
		});

		if($(d).find('.swiper-slide').length < 2) {
			$(d).addClass('one');
		}
	});
}

//마이메인 보유차량 슬라이드
function myCarSwiper() {
	$('.my_car_swiper').each(function(i, d){	
		//slide의 개수가 2개 이상일때만 pagination이 노출됨.
		var $pagination = $(d).find('.swiper-slide').length > 1 ? '.my_car_swiper .swiper-pagination' : false;
		var $spaceBetween = $(d)[0].dataset.swiperSpace !== undefined ? parseInt($(d)[0].dataset.swiperSpace) : 0;

		new Swiper(d, {
			slidesPerView:'auto',
			spaceBetween:$spaceBetween,
			freeMode:false,
			pagination:{
				el: $pagination
			},
			autoHeight: true,
		});
	});
	$('.my_car_swiper .swiper-slide > .price').click(function() {
		$(this).parents('.swiper-slide-active, .swiper-wrapper').height('auto');
	});
};

//동영상 플레이 : 전시 기획전 상세
function videoPlay() {
	$('.bo_video').on('click', '.ic-play', function() {		
		$(this).parent().hide();
		if($(this).parents('.youtube')) {
			var iframe = $(this).parents('.youtube').find('iframe');
			var src= iframe.attr('src');
			iframe.attr('src', src + '?autoplay=1&mute=1')
		}
	})
};

// 천단위 콤마 (소수점포함)
function numberWithCommas(num) {
	var parts = num.toString().split(".");
	return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}

// 숫자 체크(숫자 이외 값 모두 제거)
function chkNumber(obj){
	var tmpValue = $(obj).val().replace(/[^0-9,]/g,'');
	tmpValue = tmpValue.replace(/[,]/g,'');
	// 천단위 콤마 처리 후 값 강제변경
	obj.value = tmpValue;
}

// 사업자번호 입력 시 3,2,5 - 추가
function businessNumber(obj){
	var tmpValue = $(obj).val().replace(/[^0-9,]/g,'');
	tmpValue = tmpValue.replace(/^(\d{3})(\d{2})(\d{5})$/, `$1-$2-$3`);
	obj.value = tmpValue;
}

// 법인등록번호 입력 시 - 추가
function corporateNumber(obj){ 
	var tmpValue = $(obj).val().replace(/[^0-9,]/g,'');
	tmpValue = tmpValue.replace(/^(\d{6})(\d{7})$/, `$1-$2`);
	obj.value = tmpValue;
}

$(document).ready(function(){

	//btn_sticky 버튼이 있는 페이지 컨텐츠영역 최하단 여백 
	if($('#HIcontents').find('.btn_sticky')) {
		$('#HIcontents .btn_sticky').prev('div').css('padding-bottom', '60px');
	}
	
	HI.footer();// 풋터 버튼 클릭 
	HI.HeadSticky();// header 고정
	//HI.top();// TOP 버튼

	//datepicker Default
	$.datepicker.setDefaults({
		dateFormat:'yy년 mm월 dd일',
		prevText:'이전 달',
		nextText:'다음 달',
		monthNames:['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
		monthNamesShort:['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
		dayNames:['일', '월', '화', '수', '목', '금', '토'],
		dayNamesShort:['일', '월', '화', '수', '목', '금', '토'],
		dayNamesMin:['일', '월', '화', '수', '목', '금', '토'],
		yearSuffix:'.',

		closeText:"확인",
		showOn:'button',
		todayHighlight: true,
		showMonthAfterYear:true,
		showButtonPanel:true,
		buttonImageOnly:false
	});
	//datepicker Option
    $('.date-picker').datepicker({
        beforeShow:function(){ // Dim Open
            $('body').append('<div class="date_dimm"></div>');
        },
        onSelect:function() {
            $(this).data('datepicker').inline = true; // 날짜 선택시 창 닫히지 않게 예외 처리
        },
        onClose:function() { // 닫기
			var $data = $(this).data('datepicker');
            $data.inline = false;
			if(!$(this).hasClass('.type02') && $(this).parent().find('.txt').val() != ''){
				$(this).parent().addClass('on'); // 희망일 inbox_type03 on 추가~
			}
			$('#ui-datepicker-div').off('click','.ui-datepicker-del').on('click', '.ui-datepicker-del', function() {
				$($data.input).val($data.lastVal); // 취소시 이전 값 다시 넣어주기
			});
			$(this).trigger('dateupdated');
            setTimeout(function(){
                $('.date_dimm').remove(); // Dim Close
            },300)
        }
    });
	// Type2 : 판매목록 예외처리
	$('.date-picker.type02').datepicker('option', 'dateFormat', 'yy.mm.dd');
	$('.date-picker.type02' ).datepicker('option', 'showOn', 'focus');

	// 레이어팝업 상단 닫기 버튼 클릭 
	$(document).on('click', '.pop_close', function(){
		HI.POPUP_close($(this));
	});
 
	// plp_filter
	$(".box_sort .btn_filter, .jQ_POP_open").on("click",function(){
		HI.POPUP_open($(this))
	});
	
	//sorting 인기순 등 레이어
	$(".plp_sorting .btn_sort").on("click",function(){
		if($(this).parent().hasClass('on')){
			$(this).parent().removeClass('on');
		} else {
			$(this).parent().addClass('on');
		}
	});
	// sorting 인기순 등 체크 시
	$('.sorting_layer input[name=PlpSort]').click(function(){
		HIPlpSortingSave('PlpSort')
	});

	//상단 내차사기/내차팔기 레이어 
	$("[class^=h_header] .menu").on("click",function(){
		var objData = $(this).attr('data-ref');
		var objCont = $('#' + objData);
		if($(this).hasClass('on')){
			$(this).removeClass('on');
			objCont.removeClass('on');
		} else {
			$(this).addClass('on');
			objCont.addClass('on');
		}
	});
	//전시카테고리 - 상품이미지 타입 (썸네일형, 딜형)
	$("#plpViewType").on("click",function(){
		var objData = $(this).attr('data-ref');
		var objCont = $('#' + objData);
		if($(this).hasClass('btn_thumb')){
			$(this).attr('class', 'btn_deal');
			objCont.attr('class', 'deal');
		} else {
			$(this).attr('class', 'btn_thumb');
			objCont.attr('class', 'thumb');
		}
	});

	//마이페이지 인덱스 헤더 스타일 변경
	if($('.my_main').length > 0){
		$('.h_sub').addClass('my_head');
	}

	// 내차팔기 시세확인 
	// if($('#FO_TI_MS0002').length > 0){
	// 	SLP.FO_TI_MS0002();// 차량정보 및 시세 확인
	// }

	//내차팔기 상단 흰색 로고
	// if($('#SaleHeaderWhite').length > 0){
	// 	$('body').addClass('sale_head');
	// }

	// // 내차팔기 입력정보
	// if($('#FO_TI_MS0004').length > 0){
	// 	SLP.FO_TI_MS0004();// 차량정보 및 시세 확인
	// }
	
	// FO-ME-MS0003 - 이용약관 및 개인정보처리방침 (동의하기 Simple)
	//$('.join_list .accordion').prev().find('.btn_arrow').addClass('ac');
	$('.join_list .btn_arrow').on('click',function(){
		const chk_list_this = $(this).parent();
		if(!chk_list_this.next().hasClass('accordion')) return;
		if(!$(this).hasClass('on')){
			$(this).addClass('on');
			chk_list_this.next().slideDown(100);
		}else{
			$(this).removeClass('on');
			chk_list_this.next().slideUp(100);
		}
	});

	$(".join_list .item button").on("click",function(){
		if($(this).data().popup){
			HI.POPUP_open($(this))
		}
		
		/* s:약관 full layer 추가 */
		var agrmTit = $(this).parent().children(".agrmTit");
		var agrmCont = $(this).parent().children(".agrmCont");
		if(agrmTit.length > 0 && agrmCont.length > 0){
			
			var btnYn = $(this).parent().children(".btnYn").html();
			var btnTitle = $(this).parent().children(".btnTitle").html();
			
			var isBtn = false;
			if(btnYn === "Y"){
				isBtn = true;
			}
			
			if(btnTitle == undefined || btnTitle == null || btnTitle == ""){
				btnTitle = "";
			}
			
			HI.POPUP_layer_open(
				"HIpop_full"
				, agrmTit.html()
				, agrmCont.html()
				, null
				, null
				, function(obj, data){
					if(data == undefined || data == null){
						return false;
					}
					
					var $obj = $(data);
					if($obj.length > 0){
						var $checkbox = $obj.parent().children("input[type=checkbox]");
						if($checkbox != undefined && $checkbox != null && $checkbox.length > 0){
							$checkbox.prop("checked", true);
						}
					}
				}
				, $(this)
				, isBtn
				, btnTitle
			);
		}
		/* e:약관 full layer 추가 */
	});// FO-ME-MS0003 - 이용약관 및 개인정보처리방침 (동의하기 Simple)

	HIPDPMS0003Tit(); // PDP FO-PD-MS0003 할부계산기 타이틀
	HITextarea(); // FO-MY-MS0015 textarea
	HIImgUpload() // FO-MY-MS0015 이미지 업로드
	HIStarRating(); // FO-MY-MS0015 리뷰 별점 선택
	HIStarRating02(); // 별점
	HI.imgResize(); // 세로형 가로형 이미지 분기처리
	HI.tooltip();// 툴팁
	FRM.InboxType01(); // 인풋박스 스타일 정의
	HISwiper(); // SWIPER 공통
	videoPlay(); //동영상 플레이 : 전시 기획전 상세
	HICompareTarget(); // 장바구니 : 비교하기 슬라이드 고정
});


//이중 셀렉트 레이어
class AreaSelect {
	constructor(arg) {
		this.wrap = document.querySelector(arg);
		this.listWrap = this.wrap.querySelector('.select_list');
		this.lists = [];
		this.btn = document.querySelector(`[data-popup=${arg.split('#')[1]}]`);
		this.confirm = this.wrap.querySelector('.area_confirm');
		this.openEl = null;
		this.parentCurrent = null;
		this.childeCurrent = null;
		this.currentStr = null;
		this.state = null;
		this.value = null;
	}
	returnTemp(arg) {
		const li = document.createElement('li');
		const btn = document.createElement('button');
		btn.innerText = arg;
		li.insertAdjacentElement('beforeend', btn);
		return li;
	}
	parentFunc(idx) {
		if(this.lists[idx].classList.contains('open')) {
			this.lists[idx].classList.remove('open');
		} else {
			if(this.openEl !== null) {
				this.openEl.classList.remove('open');
			}
			this.lists[idx].classList.add('open');
			this.openEl = this.lists[idx];
		}
	}
	childeFunc(idx, el) {
		const thisParent = this.lists[idx];
		const parentStr = thisParent.querySelector('button').innerText;
		const thisStr = el.innerText;
		if(this.childeCurrent !== null && this.childeCurrent !== el) {
			this.parentCurrent.classList.remove('current');
			this.childeCurrent.classList.remove('current');
		}
		this.childeCurrent = el;
		this.parentCurrent = thisParent;
		thisParent.classList.add('current');
		el.classList.add('current');
		this.currentStr = parentStr + ' ' + thisStr;
	}
	subCreate(itemIdx, arry) {
		const div = document.createElement('div');
		const ul = document.createElement('ul');
		div.classList.add('sub');
		for(let idx = 0 ; idx < arry.length; idx++) {
			const item = this.returnTemp(arry[idx], 'sub');
			const btn = item.querySelector('button');
			btn.addEventListener('click', ()=>{this.childeFunc(itemIdx, item)});
			ul.insertAdjacentElement('beforeend', item);
		}
		div.insertAdjacentElement('beforeend', ul);
		if(this.lists[itemIdx].querySelectorAll('.sub').length === 0) {
			this.lists[itemIdx].insertAdjacentElement('beforeend', div);
		}
	}
	addFunc(idx, callBack) {
		this.lists[idx].querySelector('button').addEventListener('click', callBack);
	}
	create(arry) {
		this.listWrap.innerHTML = '';
		this.lists = [];
		if(this.state === null) {
			this.state = 'mount';
			this.confirm.addEventListener('click',()=>{
				if(this.currentStr) {
					this.btn.innerText = this.currentStr;
					HI.POPUP_close($(this.wrap));
					this.value = this.currentStr;
				}
			});
		}
		for(let idx = 0 ; idx < arry.length; idx++) {
			const item = this.returnTemp(arry[idx]);
			item.querySelector('button').addEventListener('click', ()=>{this.parentFunc(idx)});
			this.listWrap.insertAdjacentElement('beforeend', item);
			this.lists.push(item);
		}
	}
}

class Device {
  constructor() {
    this.agent = navigator.userAgent.toLocaleLowerCase();
    this.os = null;
    this.ver = null;
  }
  set() {
    if (this.agent.indexOf("iphone") > -1 || this.agent.indexOf("ipad") > -1) {
      let str = this.agent.substring(this.agent.indexOf("os") + 3);
      let ver = str.substring(0, str.indexOf(" like"));
      this.os = "ios";
      this.ver = this.os + ver;
    }
    if (this.agent.indexOf("android") > -1) {
      let str = this.agent.substring(this.agent.indexOf("android") + 8);
      let strSub = str.substring(0, str.indexOf(";"));
      let ver = strSub.replace(/[.]/gi, "_");
      this.os = "android";
      this.ver = this.os + ver;
    }
    this.addClass();
  }
  addClass() {
    if (this.ver !== null) {
      let html = document.querySelector("html");
      let trash = "";
      if (this.agent.indexOf("samsung") > -1) trash += " samsung";
      if (this.agent.indexOf("naver") > -1) trash += " naver";
      html.classList.add(this.ver + trash);
    }
  }
}



//내차팔기 진행
const saleProgress = (idx) => {
	const progress = document.querySelector('.sale_progress');
	const bar = progress.querySelector('span');
	const barW = (idx / 16) * 100;
	bar.style.width = barW + '%';
}

//VOD커머스 방송예정 목록
class ModeChange {
	constructor(arg) {
		this.wrap = document.querySelector(arg.target);
		this.items = this.wrap.querySelectorAll(arg.item);
		this.relIdx = arg.idx;
		this.className = arg.className;
		this.change();
	}
	change() {
		if(this.items.length >= this.relIdx) this.wrap.classList.add(this.className);
	}
}

//window resize 체크
class ResizeChk {
	constructor() {
		this.height = window.innerHeight;
	}
	func() {
		let resizeHeight = window.innerHeight;
		if(this.height - resizeHeight > 200) {
			document.body.classList.add('isStickyOff');
		} else {
			document.body.classList.remove('isStickyOff');
		}
	}
}

class DpConsole {
  constructor() {
    this.cos = document.createElement("div");
    this.cos.style.cssText =
      "user-select: none;-webkit-user-select:none;position: fixed; top: 0; left: 50%;z-index: 1000;padding: 10px;background:red;color:#fff;";
  }
  log(str) {
		document.body.insertAdjacentElement("beforeend", this.cos);
    this.cos.innerText = str;
  }
}

window.addEventListener('DOMContentLoaded', ()=>{
	new Device().set();
	const resizeChk = new ResizeChk();
	window.addEventListener('resize', ()=>{
		resizeChk.func();
	})
	//qr 체크.
	let keys = '';
	document.addEventListener('keyup',()=>{
		if(event.key !== 'Enter') {
			keys += event.key;
		} else {
			if(keys === 'qr') {
				let googleQr = "https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=" + location.href + "&choe=UTF-8";
				let qrImg = document.createElement("img");
				qrImg.src = googleQr;
				qrImg.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:150px;height:150px;z-index:10000;";
				document.body.insertAdjacentElement('beforeend',qrImg);
				setTimeout(()=>{
					qrImg.remove();
				},5000); 
			}
			keys = '';
		}
	})
})