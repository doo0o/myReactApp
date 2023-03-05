// [CPO] ---------------    CPO 공통 - 로딩바, 레이어팝업(full, modal, alert, toast), HEADER 고정, FOOTER, TOP버튼    ---------------------//
var CPO = {
	POPUP_open : function(obj, alertMessage){// 토스트 팝업 (DIV ID - DIV CLASS - 메세지)
		if (obj == 'CPOAlert_Wrap02' || obj == 'CPOAlert_Wrap'){
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
			dimd += '<div class="CPO_selectdim"></div>';
			objCont.parent().append(dimd);
		} else {
			CPO.DIM_open(objCont);
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
				CPO.POPUP_close($(this));
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
				CPO.POPUP_close($(this));
			}
		});
		/* e:callback 처리 추가 */
	},
	
	/* s:로딩바 open */
	LOADING_open : function() {
		$("#CPOloading").show();
	},
	/* e:로딩바 open */
	
	/* s:로딩바 close */
	LOADING_close : function() {
		$("#CPOloading").hide();
	},
	/* e:로딩바 close */
	
	POPUP_layer_open : function(obj, alertMessage){
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
		
		if(objCont.hasClass('CPOpop_full')){
			
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
					+ "<button type='button' class='btn_modal01'>"+btnName+"</button>"
					+ "</div>";

				var btnName2="";
					if(callbackArgs[8] != undefined
					&& callbackArgs[8] != null
					&& typeof callbackArgs[8] === 'string'){
					btnName2 = callbackArgs[8];
					btnDiv = "<div class='btn_sticky'>"
					+ "<ul><li><button type='button' class='btn_big03'>"+btnName+"</button></li>"
					+ "<li><button type='button' class='btn_big01'>수정하기</button></li></ul>"
					+ "</div>";
					};
				$(objCont).children('.p_wrap').append(btnDiv);
			}
		}
		
		objCont.addClass("active");
		$("html").addClass('scroll_hidden');
		
		// dim
		CPO.DIM_open(objCont);

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
				CPO.POPUP_close($(this));
			}
		});
		
		// ok callback
		var okCallbackArgs = Array.prototype.slice.call(callbackArgs, 4, 6);
		objCont.find(".btn_modal01").off("click").on("click", function(e){
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
				CPO.POPUP_close($(this));
			}
		});
		/* e:callback 처리 추가 */
	},
	
	DIM_open : function(objCont){
		/* 딤드*/
		let dimd = '';
		dimd += '<div class="CPO_dimd"></div>';
		let dimd02 = '';
		dimd02 += '<div class="CPO_fullDimd"></div>';
		if($('.CPO_dimd').length < 1 && !objCont.hasClass('CPOpop_full')){
			$('body').append(dimd);
		} else {
			$('body').append(dimd02);
		}
		/* //딤드*/
	},
		
	POPUP_close : function(obj){
		obj.closest('[class^="CPOpop_"]').removeClass('active');
		const pop_name = $('[class^="CPOpop_"].active').length;
		const pop_notFull = $('[class^="CPOpop_"]:not(.CPOpop_full).active').length;
		if(pop_name < 1){
			$("html").removeClass('scroll_hidden');
			$('.CPO_fullDimd').remove();
		}
		if(pop_notFull < 1){
			$('.CPO_dimd').remove();
		}
		
		if(obj.closest('[class^="CPOpop_"]').hasClass('select')){//셀렉트박스 레이어 스크립트 full 레이어팝업 안에서 dim
			$('.CPO_selectdim').remove();
		}
		var objTextBox = $('.CPOpop_alert > .message');
		objTextBox.empty();
	},
	POPUP_toast : function(obj, toastMessage){// 토스트 팝업 (DIV ID - DIV CLASS - 메세지)
		var objID = $('#' + obj);
		var objTextBox = $('#' + obj + ' > div');
		objTextBox.empty();
		objTextBox.append( toastMessage );
		if(!$('#CPOactionbar').length == 0){
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
	
	tooltip : function(){
		/* 열기 */
		$(document).off("click",".cpo_tooltip .open").on("click",".cpo_tooltip .open", function(){
			var _objWindow = $(window).width();
			var _obj = $(this).parent();
			var _objLeft = _obj.offset().left;
			var _objCont = $(this).parent().children('.cont');
			var _objWidth = _objCont.width();
			if(_objLeft > _objWidth){
				var minusLeft2 =  _objWidth - _objWindow;
				_objCont.css({
					"margin-left":minusLeft2,
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
		$(document).off("click",".cpo_tooltip .close").on("click",".cpo_tooltip .close", function(){
			var _obj = $(this).parent().parent();
			_obj.removeClass('on')
		});
		/* //닫기 */
	},
	tab : function(){
		$(document).off("click",".jQ_COM_tab > li").on("click",".jQ_COM_tab > li", function(){
			var objParent = $(this).children();
			var objData = $(this).children().attr('data-tab');
			var objCont = $('#' + objData);
			$('.jQ_COM_tab > li').children().removeClass('on');
			objParent.addClass('on');
			$('.jQ_COM_cont .cont_box').removeClass('on');
			objCont.addClass('on');
		});

		// 2차 JS 임시용 탭
		$(document).off("click",".tab_list > li").on("click",".tab_list > li", function(){
			const tabRoot = $(this).closest('.tab');
			const tabBoxItem = $('.tab_cont > .tab_item');
			let tabIdx = $(this).index();

			$(this).addClass('on').siblings().removeClass('on');
			tabRoot.find(tabBoxItem).removeClass('on').eq(tabIdx).addClass('on');
		});
	},

	// 2차 JS 임시용 더보기
	toggle : function(){
		$('.toggle').off();
		$('.toggle').on('click', '.tit_btn, .btn_more' ,function(){
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
	
	HeadSticky(){// 페이지 header 상단 고정
		const headH = $('#CPOheader [class^="h_"]').height();// header 높이
	
		if($('.jQ_sticky').length != 0){// 전시템플릿 상단 흰색 아이콘 
			const cornerH = $('.jQ_sticky').height();// 코너 높이
			let wst = $(window).scrollTop();
			$('#CPOcontents').css('padding-top', 0);
	
			$(window).scroll(function(){
				const tst = $(this).scrollTop();
				if(tst + headH >= cornerH){
					$('#CPOheader [class^="h_"]').addClass('fixed');
					$('#CPOheader [class^="h_"]').removeClass('visual');
				} else {
					$('#CPOheader [class^="h_"]').addClass('visual');
					$('#CPOheader [class^="h_"]').removeClass('fixed');
				}
				if(tst > wst || tst == 0){
					$('#CPOheader [class^="h_"]').show();
				} else {
					$('#CPOheader [class^="h_"]').hide();
				}
				wst = tst;
			});
		} else {
			$(window).scroll(function(){
				const windowST = $(this).scrollTop();
				if(windowST >= 1){
					$('#CPOheader [class^="h_"]').addClass('fixed');
				} else if(windowST == 0){
					$('#CPOheader [class^="h_"]').removeClass('fixed');
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
	top : function(type){
		$('#CPOtop').hide();
		$('#CPOtop').addClass('type0'+type);
		$(window).scroll(function(){
			let tst = $(this).scrollTop();
			if(tst != 0){
				$('#CPOtop').show();
			} else {
				$('#CPOtop').hide();
			}
		});
		$('#CPOtop a').click(function(){
			$('html, body').animate({
				scrollTop : 0
			}, 300);
			return false;
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
	InboxType01 : function(){// - 1. 상세보기
		$('.inbox_type01 .txt, .inbox_type02 .txt').focusin(function(){// 인풋박스 포커스인(원,P 입력 값)
			var ValZero = $(this).val();
			var thisTy = $(this).attr('type');
			$(this).parent().addClass('focus');// focus
			if(thisTy == 'number'){
				if (ValZero == 0){
					$(this).val('')
				}
			}// number 일때만
		});
		$('.inbox_type01 .txt, .inbox_type02 .txt').focusout(function(){// 인풋박스 포커스아웃(원,P 입력 값)
			var ValZero = $(this).val();
			var thisTy = $(this).attr('type');
			$(this).parent().removeClass('focus');// focus
			if(thisTy == 'number'){
				if (ValZero == ''){
					$(this).val('0')
				}
			}// number 일때만
		});
		$(document).off("click",".inbox_type02 .ico_clear")
					.on("click",".inbox_type02 .ico_clear", function(){// 인풋박스 초기값 있는 경우, 초기화 시키기
			var InitialVal = $(this).attr('data-href');
			var InboxVal = $(this).parent().children(".txt");
			InboxVal.val(InitialVal)
		});
		
		$(document).off("click",".inbox_type03:not(.focus)")
			.on("click",".inbox_type03:not(.focus)", function(){// 인풋박스 초기값 있는 경우, 초기화 시키기
			var childInput = $(this).children('.txt');
			var childSel = $(this).children('.sel');
			if(!childInput.is(":disabled")){
				$(this).addClass('focus');// focus
				$(this).addClass('on');
			}
			if (!$(childSel).length > 0) {
				childInput.focus();
			}
			//childInput.focus();
			if(childInput.val() != ''){
				$(this).children('.ico_delete').show();
			}else{
				$(this).children('.ico_delete').hide();
			}
		});
		$('.inbox_type03 .txt, .inbox_type05 .txt').focusout(function(){// 인풋박스 포커스아웃
			$(this).parent().removeClass('focus');// focus
			if($(this).val() == ''){
				$(this).parent().removeClass('on');
				$(this).parent().find('.ico_delete').hide();
			}
		});
		$('.inbox_type07 .inp .txt').focusin(function(){// 인풋박스 포커스인(원,P 입력 값)
			$(this).parent().parent().addClass('focus');// focus
		});
		$('.inbox_type07 .inp .txt').focusout(function(){// 인풋박스 포커스아웃(원,P 입력 값)
			$(this).parent().parent().removeClass('focus');// focus
		});

		$('.inbox_type03 .txt, .inbox_type04 .txt').focusin(function(){// 인풋박스 포커스인(타이틀 UP)
			$(this).parent().addClass('focus');// focus
			$(this).parent().addClass('on');
			if($(this).val() != ''){
				$(this).parent().find('.ico_delete').show();
			}else{
				$(this).parent().find('.ico_delete').hide();
			}
		});
		$('.inbox_type03 .txt, .inbox_type04 .txt').focusout(function(){// 인풋박스 포커스아웃
			var _thisP = $(this).parent();
			if(_thisP.hasClass('identity')){
				var _thisP1 = _thisP.children('.type_id01').val();
				var _thisP2 = _thisP.children('.type_id02').val();
				if(_thisP1 !='' || _thisP2 !=''){
					$(this).parent().removeClass('focus');// focus
					$(this).parent().addClass('on');
				}
			} else {
				$(this).parent().removeClass('focus');// focus
				if($(this).val() == ''){
					$(this).parent().removeClass('on');
					$(this).parent().find('.ico_delete').hide();
				}
			}
		});
		$('.inbox_type03 .txt, .inbox_type04 .txt').on('keyup',function(){// 인풋박스 키보드 칠때, null 값 체크 타이틀 up down & 입력값 삭제 버튼 show hide
			if($(this).val() != ''){
				$(this).parent().find('.ico_delete').show();
				//$(this).parent().addClass('on');
			}else{
				$(this).parent().find('.ico_delete').hide();
				//$(this).parent().removeClass('on');
			}
		});
		
		$(document).off("click",".inbox_type03 .ico_delete, .inbox_type04 .ico_delete")
						.on("click",".inbox_type03 .ico_delete, .inbox_type04 .ico_delete", function(){// 인풋박스 입력값 삭제
			$(this).parent().removeClass('on');
			$(this).parent().find('.txt').val('');
			$(this).parent().find('.ico_delete').hide();
		});



		/* 2차 js 임시용 */
		$('.inp_search').on('click', function (e) {
            var _this = $(this);
			var childInput = _this.children('.txt');
			var timeout;
			var inputVal = null;
			childInput.each(function(){
				var child = $(this);
				if(inputVal === null) inputVal = child.val();
				child.off('focusin').on('focusin', function(){
					if(inputVal.length > 0) {
						_this.addClass('delete_on');
					}
					clearTimeout(timeout);
				});
				child.off('focusout').on('focusout', function(){
					timeout = setTimeout(function(){
						_this.removeClass('focus');
						if(inputVal.length > 0 || !_this.hasClass('inp_search')) {
							_this.removeClass('delete_on');
						}

						if(_this.hasClass('inbox_type01')){ //inbox_type01 예외처리					
							if(_this.find('.txt').val() == ''){
								_this.removeClass('on');
							}
						}
					},200);
				})
			});

			if(!childInput.is(":disabled")){
				_this.addClass('focus');
				childInput[0].focus();
				if(inputVal.length > 0) {
					_this.addClass('delete_on');
				}
				if(_this.hasClass('inbox_type01')){
					_this.addClass('on');
				}
			}
        });

       // 삭제버튼 ON
		$('[class^="inbox_type"] .txt, [class^="inp_"] .txt').on('propertychange change keyup input paste', function () {
			if ($(this).val().length != 0) {
				$(this).parent().addClass('delete_on');
			} else if (!$(this).hasClass('unique')){
				$(this).parent().removeClass('delete_on');
			}
		});
		// 삭제하기
		$('.btn_delete').on('click', function (e) {
			var _thisP = $(this).parent();
			_thisP.find('.txt').focus();
			_thisP.find('.txt').val(null);
			_thisP.removeClass('delete_on');
		});


		

	},
	InboxTypeTel : function(){
		$('.type_tel').on('keyup',function(){// 휴대폰 입력 시 - 추가
			$(this).val( $(this).val().replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,"$1-$2-$3").replace("--", "-") );
		});

	},
	InboxTypeId : function(){
		$('.type_id').on('keyup',function(){// 
			//$(this).val( $(this).val().replace(/[^0-9]/g, "").replace(/(\d{6})(\d{1})/, '$1-$2*****') );
			$(this).val( $(this).val().replace(/[^0-9]/g, "").replace(/(\d{6})(\d{1})/, '$1-$2*****') )
		});
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
				CPO.POPUP_toast("CPOToast_Wrap", "이미지가 삭제되었습니다.");
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
						CPO.POPUP_toast("CPOToast_Wrap", '최대' + _objDataItem + '개까지 업로드 가능합니다.');
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
			CPO.POPUP_toast("CPOToast_Wrap", "이미지가 삭제되었습니다.");
		});
	},
	ImgUpload03 : function(){
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
							'<span class="img"><embed src="'+ e.target.result +'" class="cpo_pdfobject" type="application/pdf" title="Embedded PDF"></span><span class="txt"> '+ _fileName + '</span><button type="button" class="btn_txt01">삭제</button>'
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
					CPO.POPUP_toast("CPOToast_Wrap", '12MB 미만의 이미지 파일을 등록해주세요.<br>(JPG, PNG 이외의 파일을 등록 불가)');
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
								CPO.POPUP_toast("CPOToast_Wrap", '최대' + _objDataItem + '개까지 업로드 가능합니다.');
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
		 CPO.POPUP_toast("CPOToast_Wrap", "이미지가 삭제되었습니다.");
		});
	}
}


// [SRCH] ---------------    검색 영역  ---------------------//
var SRCH = {
	PageLoad : function(){// - 1. 로딩 시
		//setTimeout(() => {
			$('#srchBest').children().clone().appendTo( '#srchBest2' );
			$('.srch_keyword').addClass('load');
			$('.srch_ifbox').addClass('load');
			$('.btn_sticky').addClass('load');
		//}, 1000);
	},
	Best10Rolling : function(){//- 2. 인기검색어 롤링
		timer = setTimeout(function(){
			$('#srchBest li:first').animate( {marginTop: '-56px'}, 800, function() {
				$(this).detach().appendTo('ol#srchBest').removeAttr('style');
			});
			SRCH.Best10Rolling();//- 2. 인기검색어 롤링
		}, 3000);
	},
	Best10Open : function(){// - 3. 인기검색어 펼치기
		$(document).off("click",".srch_keyword .btn_open")
			.on("click",".srch_keyword .btn_open", function(){
			const keywordH = $('.srch_keyword').height();
			$(this).parents('.srch_keyword').toggleClass('on');
			if(!$('.cpo_search').hasClass('fixed')){
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
		$('.cpo_search').addClass('fixed');
	},
	ModelFixed : function(){// 스크롤 시, 상단으로 up 모션 호출
		// $('#searchLayer').scroll(function(){
		// 	if(searchLayer.scrollTop > 0 && !searchLayer.classList.contains('fixed')) {
		// 		if(!searchLayer.classList.contains('isAnimate')){
		// 			searchLayer.classList.add('isAnimate');
		// 			searchLayer.classList.add('fixed');
		// 			searchLayer.scrollTop = 0;
		// 			setTimeout(function(){
		// 				searchLayer.classList.remove('isAnimate');
		// 			},900)
		// 		}
		// 	} else if(searchLayer.classList.contains('fixed') && searchLayer.scrollTop <= 0) {
		// 		if(!searchLayer.classList.contains('isAnimate')){
		// 			searchLayer.classList.add('isAnimate');
		// 			searchLayer.classList.remove('fixed');
		// 			setTimeout(function(){
		// 				searchLayer.classList.remove('isAnimate');
		// 			},900)
		// 		}
		// 	} 
		// });
		$('#searchLayer').scroll(function(){
			let tst = $('#searchLayer').scrollTop();
			if(tst > 10){
				if(!$('.cpo_search').hasClass('fixed')){
					$('.cpo_search').addClass('fixed');
					//$('#searchLayer').scrollTop(2);
					$('.srch_model').animate({scrollTop: '2'}, 1000);
				}
			}
		});
		$('.srch_model').scroll(function(){
			if($('.cpo_search').hasClass('fixed')){
				let tsts = $('.srch_model').scrollTop();
				if(tsts <= 0){
						$('.cpo_search').removeClass('fixed');
						$('.srch_keyword').removeClass('on');
						$('#searchLayer').animate({scrollTop: '0'}, 1000);
					}
				} 
		});
	},
	ModelShow : function(){// 검색입력 focusIn
		$("#srchHistory").attr('data-href', 'model');
		$('.srch_model').show();
		$('.srch_model .btn_sticky').show();
		$('.srch_recent').hide();
		$('.srch_auto').hide();
	},
	RecentShow : function(){// 검색입력 focusOut
		$("#srchHistory").attr('data-href', 'model');
		if(!$('.cpo_search').hasClass('fixed')){
			setTimeout(() => { 
				SRCH.HeadFixed();
			}, 100);
		}
		$('.srch_model').hide();
		$('.srch_model .btn_sticky').hide();
		$('.srch_recent').show();
		$('.srch_auto').hide();

	},
	AutoLayertShow : function(){//검색입력 자동완성 레이어
		//$('.srch_head').addClass('fixed');
		$("#srchHistory").attr('data-href', 'model');
		$('.srch_model').hide();
		$('.srch_model .btn_sticky').hide();
		$('.srch_recent').hide();
		$('.srch_auto').show();
		$('.ic_model').click(function(){
			SRCH.ModelShow();
		});
		
	},
	RecentSwipe : function(){// 최근검색어 swiper
		$('.recent_swiper').each(function(i, d){	
			//slide의 개수가 2개 이상일때만 pagination이 노출됨.
			var $pagination = $(d).find('.swiper-slide').length > 1 ? '.swiper-pagination' : false;
			new Swiper(d, {
				autoHeight: true,
				pagination:{
					el: $pagination
				}
			});
		});
	},
	FilterLayerBack : function(){// 뒤로가기 버튼 1. MODEL - 이전페이지 / 2. 최근검색어 - MODEL / 3. 자동완성 - MODEL
		$(document).off("click","#srchHistory")
			.on("click","#srchHistory", function(){
			var _thisRef = $(this).attr('data-href');
			if(_thisRef == 'back'){
				window.history.back();
			} else if (_thisRef == 'model'){
				SRCH.ModelShow();
			}
		});
	},
	FilterModelAll : function(thisObj){//전체보기
		var _idName = thisObj.attr('data-href');
		var _idNameID = $('#' + _idName);

		if( _idNameID.hasClass('on') ){
			_idNameID.removeClass('on');
		} else {
			_idNameID.addClass('on');
		}
	},
	FilterOpenClose : function(thisObj){//검색 조건 열기, 닫기
		var _incont = thisObj.parent().attr('data-href');
		var _incontID = $('#' + _incont);
		
		if( _incontID.hasClass('on') ){
			_incontID.removeClass('on');
		} else {
			_incontID.addClass('show on');
		}
	},
	FilterSaveCheck : function(formName, divID, _thisObj){// 필터 내 > 카테고리, 브랜드, 색상, 옵션 적용하기 버튼
		var send_array = Array();
		var send_cnt = 0;
		var chkbox = $("input[name=" + formName + "]");
		var checkSelf = _thisObj.attr("checked", false);
		if (_thisObj.is( ":checked")){
		} else {
		}
		for(i=0;i<chkbox.length;i++) {
			if (chkbox[i].checked == true){
				var chckName = chkbox[i].id;
				var chckLabel = $("label[for='"+chckName+"']").text();
				send_array[send_cnt] = chckLabel;
				send_cnt++;
			}
		}
		$("#" + divID).text(send_array );
	},
	FilterPriceRange : function(amt01, amt02, rangeBox, stepsNum, amtTxt, _callback){//필터 내 > 가격 Range 스크립트
		const numberWithCommas  = (x) => {// 숫자 천의자리 표현
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		var amt01ID = $("#" + amt01);
		var amt02ID = $("#" + amt02);
		var _rangeCpoRange = $('#' + rangeBox + ' .cpoRange');
		var _rangeCpoChck = $('#' + rangeBox + '-Chk i');// 선택값 타이틀 옆에 text 붙여주기
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
		_rangeCpoRange.slider({
			range: true,
			min: Number(minPriceSearch),
			max: Number(maxPriceSearch),
			step:stepsNum,
			values: [Number(minValue), Number(maxValue)],
			change_val:false,
			create:function(event, ui){// 생성
				_rangeCpoRange.append('<span class="min_no"></span>');
				_rangeCpoRange.append('<span class="max_no"></span>');
				
				if(rangeBox != 'rangeYear'){
					$('#' + rangeBox + ' .cpoRange .min_no').text(numberWithCommas( minValue ));
					$('#' + rangeBox + ' .cpoRange .max_no').text(numberWithCommas( maxValue ));
	
				} else{
					$('#' + rangeBox + ' .cpoRange .min_no').text(minValue);
					$('#' + rangeBox + ' .cpoRange .max_no').text(maxValue);
					if(rangeBox == 'rangePrice'){
						SRCH.FilterPriceChart();// 가격 상단 그래프
					}
				}
			},
			change: function( event, ui ) {
				var sminValue = _rangeCpoRange.slider("values", 0);
				var smaxValue = _rangeCpoRange.slider("values", 1);
				
				if(rangeBox != 'rangeYear'){
					$(_rangeCpoChck[0]).text(numberWithCommas( sminValue ));
					$(_rangeCpoChck[1]).text(numberWithCommas( smaxValue ));
	
				} else{
					$(_rangeCpoChck[0]).text(sminValue);
					$(_rangeCpoChck[1]).text(smaxValue);
				}
				amt01ID.val(sminValue);
				amt02ID.val(smaxValue);
				if (_callback) {
					_callback();
				}
			},
		});
		if(rangeBox != 'rangeYear'){
			$('#' + rangeBox + ' .cpoRange .min_no').text(numberWithCommas( minValue  + amtTxt));
			$('#' + rangeBox + ' .cpoRange .max_no').text(numberWithCommas( maxValue  + amtTxt));
			$(_rangeCpoChck[0]).text(numberWithCommas( startVaule ));
			$(_rangeCpoChck[1]).text(numberWithCommas( endVaule ));
	
		} else{
			$('#' + rangeBox + ' .cpoRange .min_no').text(minValue + amtTxt);
			$('#' + rangeBox + ' .cpoRange .max_no').text(maxValue + amtTxt);
			$(_rangeCpoChck[0]).text(startVaule);
			$(_rangeCpoChck[1]).text(endVaule);
		}
		_rangeCpoRange.slider("values", 0, startVaule);// handler 시작
		_rangeCpoRange.slider("values", 1, endVaule);// handler 끝
		_rangeCpoRange.on('touchend', function(){
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
}//SRCH 검색 관련 스크립트 종료

// [ORD] ---------------    주문하기  ---------------------//
var ORD = {
	viewDetail : function(){// - 1. 상세보기
		
	},
}


// [SLP] ---------------    내차팔기 페이지 모션  ---------------------//
var SLP = {
	FO_TI_MS0004 : function(){// - 차량정보 및 시세 확인
		
	},
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
function CPODonutChart(target, animate, animateTxt, time){
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
// function CPOPlpSortingClose(){
// 	var sortSelect = $( ".btn_sort" ).attr('name');
// 	$('#' + sortSelect).prop('checked', true);
// }

/* sorting 적용하기 버튼 안 누르고 닫기 버튼 클릭 시 */
// function CPOPlpSortingSave(obj){
// 	var sortChecked = $('input[name=' + obj + ']:checked');
// 	var sortCheckedId = sortChecked.attr('id');
// 	var sortCheckedId2 = sortChecked.prop("labels");
// 	var sortText = $(sortCheckedId2).text();

// 	$( ".btn_sort" ).text(sortText);
// 	$( ".btn_sort" ).attr( "name", sortCheckedId);
// 	$('.sorting_layer').parent().removeClass('on');
// }

function CPO_SelectLayer(obj){//jQ_Select - 레이어 열릴 때, 체크된 id check 해주기
	//jQ_Select 클릭 기능 / id='radio name 동일' / data-id='체크된 id 값 넣기' / data-popup='레이어팝업 ID' 
	var _radioName = obj.attr('id');
	var _radioChkId = obj.attr('data-id');
	if(_radioChkId == ''){
		$('input[name=' + _radioName + '_Name]').prop('checked', false);
	} else {
		$('#' + _radioChkId).prop('checked', true);
	}
}
function CPO_SelectSave(obj){//jQ_Select_Save - 적용하기 클릭 시, 레이어 닫고, name 변경된 내용 확인하기
	//jQ_Select_Save 클릭 기능 / data-id='radio name 동일' / data-popup='레이어팝업 ID'// 닫기, selectQna 변경 내용 적용클릭 시 */
	var _radioName = obj.attr('data-id');
	var _radioChecked = $('input[name=' + _radioName + '_Name]:checked')
	var _radioCheckedId = _radioChecked.attr('id');// 체크 ID
	var _radioCheckedIdTxt = _radioChecked.prop("labels");// 체크 LABEL
	var _radioText = $(_radioCheckedIdTxt).text();// 체크LABEL 텍스트
	$('#' + _radioName).text(_radioText);
	$('#' + _radioName).attr( "data-id", _radioCheckedId);
}


/* 장바구니 checkBox All & Button */
function CPOCartCheck(){
	var chkName = $('input[name=cartList]').length;
	var chkNameChk = $('input[name=cartList]:checked').length;
	var chkNameDis = $('input[name=cartList]:disabled').length;
	var chkName2 = chkName - chkNameDis;

	if (chkNameChk == 0) {
		$('.btn_sticky ul li:nth-child(1)').show();
		$('.btn_sticky ul li:nth-child(2)').hide();
		$('.btn_sticky ul li:nth-child(3)').hide();
		$('.btn_sticky ul li:nth-child(1) button').attr('disabled', true);
	} else if(chkNameChk == 1) {
		$('.btn_sticky ul li:nth-child(1)').show();
		$('.btn_sticky ul li:nth-child(2)').hide();
		$('.btn_sticky ul li:nth-child(3)').hide();
		$('.btn_sticky ul li:nth-child(1) button').attr('disabled', false);
		$('.btn_sticky ul li.bar button').attr('disabled', false);
	} else if (chkNameChk <= 5) {
		$('.btn_sticky ul li:nth-child(1)').hide();
		$('.btn_sticky ul li:nth-child(2)').show();
		$('.btn_sticky ul li:nth-child(3)').show();
		$('.btn_sticky ul li.bar button').attr('disabled', false);
	} else if (chkNameChk > 5) {
		$('.btn_sticky ul li:nth-child(1)').hide();
		$('.btn_sticky ul li:nth-child(2)').show();
		$('.btn_sticky ul li:nth-child(3)').show();
		$('.btn_sticky ul li.bar button').attr('disabled', true);
	}
	$( "#cartChkTotal" ).text(chkNameChk);
}

/* 비교차량 선택 checkBox & Button */
function CPOCompareCheck(obj){
	var chkName = $('input[name=CompareCheck]').length;
	var chkNameChk = $('input[name=CompareCheck]:checked').length;
	var chkNameDis = $('input[name=CompareCheck]:disabled').length;
	var chkName2 = chkName - chkNameDis;

	if (chkNameChk == 0) {
		$('.btn_sticky ul li:nth-child(1) button').attr('disabled', true);
		$('.btn_sticky ul li:nth-child(2) button').attr('disabled', true);
	} else if(chkNameChk == 1) {
		$('.btn_sticky ul li:nth-child(1) button').attr('disabled', false);
		$('.btn_sticky ul li:nth-child(2) button').attr('disabled', true);
	} else if (chkNameChk <= 5) {
		$('.btn_sticky ul li:nth-child(1) button').attr('disabled', false);
		$('.btn_sticky ul li:nth-child(2) button').attr('disabled', false);
	} else if (chkNameChk > 5) {
		$('.btn_sticky ul li:nth-child(1) button').attr('disabled', true);
		$('.btn_sticky ul li:nth-child(2) button').attr('disabled', true);
	}
	$( "#chkTotal" ).text(chkNameChk);

}

/* 비교하기 레이어 고정하기 */
function CPOCompareTarget(){
	$(".lyer_compare .btn_pin01").on("click",function(){
		$(this).parent().closest('.slide').insertBefore($('.target'));
		$('.lyer_compare .slide').removeClass('target');
		$(this).parent().closest('.slide').addClass('target');
		$('.lyer_compare .slide').stop().animate({scrollLeft: 0}, 400, "linear");
		$( ".lyer_compare .list" ).scrollLeft( 0);
		$( "#compareBox" ).scrollTop( 0);
	});
}

/* 비교하기 레이어 상단 sticky */
function CPOCompareSticky(){
	const compareBoxH = $('#compareBox').height();
	const _tagLiSlide = $('.lyer_compare .list .slide');
	const _tagUnitTop = $('.lyer_compare .unit_compare > .top');
	const _tagUnitCompare = $('.lyer_compare .unit_compare');
	const _tagUnitImgDev = $('.lyer_compare .unit_compare > .top .img');
	const _tagUnitImgDev2 = $('.lyer_compare .unit_compare > .top .img img');

	//li 높이값 넣기
	var heightArr = [];
	_tagLiSlide.each(function(){
		heightArr.push($(this).height()); 			// li 높이 값 배열에 담기
	});
	heightArr.sort(function(a, b){return b-a;}); 	// 내림차순// heightArr.sort(function(a, b){return a-b;}); // 오름차순
	var liHeight =_tagLiSlide.height(heightArr[0]); // 내림차순일 경우 최대값, 오름차순일 경우 최소값
	_tagLiSlide.css({ "height":liHeight});			// li에 최대 높이값 height 넣어주기
	$('#compareBox').scroll(function(){
		let $thisTop = $(this).scrollTop();
		let $topH = _tagUnitTop.height() ;
		
		let _tagBtnAddH = $('.lyer_compare .target .unit_compare > .top .inner').height() - 2;
		let _tagBtnAdd = $('.lyer_compare .unit_compare > .top .btnAdd');
		_tagUnitCompare.css({
			"padding-top":$topH,
		});
		_tagUnitTop.css({
			"top":$thisTop,
			"height":'auto',
		});
		if($thisTop >= 1){
			_tagLiSlide.addClass('fixed');
			_tagBtnAdd.height(_tagBtnAddH);

		} else if ($thisTop == 0) {
			_tagLiSlide.removeClass('fixed');
			_tagUnitCompare.css({
				"padding-top":'',
			});
			
			_tagBtnAdd.removeAttr( 'style' );
		}
		if($thisTop <= 92){
			_tagUnitImgDev.css({
				"width" :152 - $thisTop,
				"height" :152 - $thisTop,
				"padding-bottom" :152 - $thisTop,
			});
		} 
	});
}

// 마이페이지 포인트내역 기간
function CPOPointSort(){
	$('.tab_sort li').eq(0).addClass('on');
	$('.tab_sort li').click(function(){
		$('.tab_sort li').removeClass('on');
		$(this).addClass('on');
	});
}

// 차량등록 인풋 모션
function CPOCarRegister(){
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

// 토글 TEXT 변경


// PDP 상품상세 토글
function CPOPDPToggle(){
	$(document).off("click",".pdp_tog")
		.on("click",".pdp_tog", function(){
		var _thisAfter = $(this).attr('data-href');
		if(_thisAfter != null){
			var _thisBefore = $(this).text();
			var _thisPa = $(this).parent();
			$(this).text(_thisAfter);
			$(this).attr("data-href", _thisBefore);
		}
		if($(this).hasClass('on')){
			$(this).removeClass('on');
			$(this).next().slideUp(500);
		}else{
			$(this).addClass('on');
			$(this).next().slideDown(500);
		}
	});
}

// PDP 모두 펼치기 & 닫기
function CPOPDPInfoBtn(){
	$(document).off("click",".btn_info_mor")
			.on("click",".btn_info_mor", function(){
		var _pdp_tog_list = $(this).parent().nextAll().find('.pdp_tog');
		var _thisAfter = $(this).attr('data-href');

		if(_thisAfter != null){
			var _thisBefore = $(this).text();
			var _thisPa = $(this).parent();
			$(this).text(_thisAfter);
			$(this).attr("data-href", _thisBefore);
		}

		if(!$(this).hasClass('off')){
			$(this).addClass('off');
			//$(this).text('모두 펼쳐보기');
			_pdp_tog_list.removeClass('on');
			_pdp_tog_list.next().slideUp(500);
			pdp_more = true;
		}else{
			$(this).removeClass('off');
			//$(this).text('모두 닫기');
			_pdp_tog_list.addClass('on');
			_pdp_tog_list.next().slideDown(500);
			pdp_more = false;
		}
	});
}

// PDP FO-PD-MS0003 할부계산기 타이틀
function CPOPDPMS0003Tit(){
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


// FO-MY-MS0050 인풋 텍스트
function CPOInputText(){
	$('.ipt_text').on('propertychange change keyup input paste', function(){
		if($(this).find('input[type="text"]').val().length != 0){
			$(this).addClass('on');
		} else {
			$(this).removeClass('on');
		}
	});
	//$('.ico_clear').click(function(){
	//	$(this).parents('.ipt_text').removeClass('on').find('input[type="text"]').val('');
	//});
}
// FO-MY-MS0015 textarea
function CPOTextarea(){
	$('.review_textarea textarea').focusin(function(){
		$(this).parent().addClass('focus');
	});
	$('.review_textarea textarea').focusout(function(){
		$(this).parent().removeClass('focus');
	});
	$('.review_textarea textarea').on('propertychange change keyup input paste', function(){
		let txtVal = $(this).val().length;
		if(txtVal == 0){
			$(this).parent().removeClass('on');
		} else {
			$(this).parent().addClass('on');
		}
		$('.txt_check .first').text(txtVal);
	});
}
// FO-MY-MS0015 이미지 업로드
function CPOImgUpload(){
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
function CPOStarRating(){
	$(document).off("click",".rating .star button")
		.on("click",".rating .star button", function(){
		$(this).addClass('on').prevAll().addClass('on');
		if($(this).hasClass('on')){
			$(this).nextAll().removeClass('on');
		}
	});
}
// 별점
function CPOStarRating02(){
	$('.rating02 .star em').each(function(){
		const starTxt = $(this).text();
		$(this).css({"width":(starTxt * 20) + "%"});
	});
}


// CPO 이미지 lazyload
function CPOLazyload(target){
	var lazyloadImg;    
	if ("IntersectionObserver" in window) {
		lazyloadImg = document.querySelectorAll(target);
		var imgObserver = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					var img = entry.target;
					if(img.classList.contains('cpo_lazy_v')){ //세로
						if((window.pageYOffset + window.innerHeight) > img.offsetTop){ // image.offsetTop 뒤에 픽셀 값 마이너스
							img.src = img.dataset.src;
							img.classList.remove('cpo_lazy_v');
							imgObserver.unobserve(img);
						}
					} else if(img.classList.contains('cpo_lazy_h')){ //가로
						if((window.pageXOffset + window.innerWidth) > img.offsetLeft){ // image.offsetLeft 뒤에 픽셀 값 마이너스
							img.src = img.dataset.src;
							img.classList.remove('cpo_lazy_h');
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
	CPOLazyload('[class^="cpo_lazy_"]');
});
// //CPO 이미지 lazyload



// FO-MY-MS0017 나의 문의
function CPOQuestToggle(){
	$(document).off("click",".q_tog")
		.on("click",".q_tog", function(){
		if($(this).hasClass('on')){
			$(this).removeClass('on');
			$(this).next().slideUp(100);
		}else{
			$(this).addClass('on');
			$(this).next().slideDown(100); 
		}
	});
}

//swiper 공통
function CPOSwiper(){
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

//swiper2 공통
function CPOSwiper2(){
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

//더보기
function moreView(){
	$('.more_view').off();
	$('.more_view').on('click', '.btn_more' ,function(){
		var textAfter = $(this).attr('data-text');
        var toggleHref = $(this).attr('data-href');
        var toggleParent = $(this).parent();
        var toggleCont = (toggleHref != null) ? ($('#' + toggleHref)) : toggleParent;

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
};

$(document).ready(function(){
	console.log('dd')
	CPO.footer();// 풋터 버튼 클릭 
	CPO.HeadSticky();// header 고정
	//CPO.top();// TOP 버튼

	//datepicker Default
	$.datepicker.setDefaults({
		dateFormat:'yy년 mm월 dd일',
		prevText:'이전 달',
		nextText:'다음 달',
		monthNames:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
		monthNamesShort:['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
		dayNames:['일', '월', '화', '수', '목', '금', '토'],
		dayNamesShort:['일', '월', '화', '수', '목', '금', '토'],
		dayNamesMin:['일', '월', '화', '수', '목', '금', '토'],
		yearSuffix:'.',
		closeText:"확인",
		showOn:'button',
		showMonthAfterYear:true,
		showButtonPanel:true,
		buttonImageOnly:false
	});

	// 레이어팝업 상단 닫기 버튼 클릭 
	$(document).on('click', '.pop_close', function(){
		CPO.POPUP_close($(this));
	});

	// plp_filter
	$(".plp_filter .btn_filter, .jQ_POP_open").on("click",function(){
		CPO.POPUP_open($(this))
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
		CPOPlpSortingSave('PlpSort')
	});

	//상단 내차사기/내차팔기 레이어 
	$(".ic_menu").on("click",function(){
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


	//CPOSwiperT01()//09. 유사 인기 차량으로 수정

	//마이페이지 인덱스 헤더 스타일 변경
	if($('.my_main').length > 0){
		$('.h_sub').addClass('my_head');
	}

	// 내차팔기 시세확인 
	if($('#FO_TI_MS0002').length > 0){
		SLP.FO_TI_MS0002();// 차량정보 및 시세 확인
	}
	//내차팔기 상단 흰색 로고
	if($('#SaleHeaderWhite').length > 0){
		$('body').addClass('sale_head');
	}
	// 내차팔기 입력정보
	if($('#FO_TI_MS0004').length > 0){
		SLP.FO_TI_MS0004();// 차량정보 및 시세 확인
	}
	
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
			CPO.POPUP_open($(this))
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
			
			CPO.POPUP_layer_open(
				"CPOpop_full"
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


	CPOPDPToggle(); //PDP 상품상세 토글 (변경될 텍스트는 data-href 에 담기)
	CPOPDPInfoBtn(); // PDP 모두 펼치기 & 닫기
	CPOPDPMS0003Tit(); // PDP FO-PD-MS0003 할부계산기 타이틀
	CPOInputText(); // FO-MY-MS0050 인풋 텍스트
	CPOTextarea(); // FO-MY-MS0015 textarea
	CPOImgUpload() // FO-MY-MS0015 이미지 업로드
	CPOStarRating(); // FO-MY-MS0015 리뷰 별점 선택
	CPOStarRating02(); // 별점
	CPOQuestToggle(); // FO-MY-MS0017 나의 문의
	CPO.imgResize(); // 세로형 가로형 이미지 분기처리
	CPO.tooltip();// 툴팁
	FRM.InboxType01(); // 인풋박스 스타일 정의
	FRM.InboxTypeTel();
	FRM.InboxTypeId();
	CPOSwiper(); // SWIPER 공통
	videoPlay(); //동영상 플레이 : 전시 기획전 상세
});