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
			console.log(_objWindow, _objLeft, _objWidth);
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
			// var _btnPDP = $(this).parent().parent().attr('id');
			//if(_btnPDP == 'PDP_TAB'){// 상품상세 tab 클릭시, scrollTop 'pdp04_tab' 위치로 가게 하기
			//	var _pdpTabS = $('.pdp_tab').offset().top;
			//	$(window).scrollTop(_pdpTabS);
			//}
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
					console.log('fixed');
				} else {
					$('#CPOheader [class^="h_"]').addClass('visual');
					$('#CPOheader [class^="h_"]').removeClass('fixed');
					console.log('visual');
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
				// console.log(windowST);
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
		console.log(untilDate, Dday)
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
			console.log(InitialVal)
		});
		
		$(document).off("click",".inbox_type03:not(.focus)")
			.on("click",".inbox_type03:not(.focus)", function(){// 인풋박스 초기값 있는 경우, 초기화 시키기
			var childInput = $(this).children('.txt');
			var childSel = $(this).children('.sel');
			console.log();
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
			console.log('dddd');
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
				console.log(_objData, _objCont);
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
		var btnFileW = $('.addphoto_list').width();
		var btnH = (btnFileW*0.22);
		console.log(btnFileW, btnH);
		var count = 0; //등록 이미지 카운팅
		// $('.addphoto_list dl dt').height(btnH);
		// $('.addphoto_list .list li').css({width: btnH, height: btnH });

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
			console.log(_objContItemNo);
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
	// 범위 스크립트
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
}


/* sorting 적용하기 버튼 안 누르고 닫기 버튼 클릭 시 */
function CPOPlpSortingClose(){
	var sortSelect = $( ".btn_sort" ).attr('name');
	$('#' + sortSelect).prop('checked', true);
}

/* sorting 적용하기 버튼 안 누르고 닫기 버튼 클릭 시 */
function CPOPlpSortingSave(obj){
	var sortChecked = $('input[name=' + obj + ']:checked');
	var sortCheckedId = sortChecked.attr('id');
	var sortCheckedId2 = sortChecked.prop("labels");
	var sortText = $(sortCheckedId2).text();

	$( ".btn_sort" ).text(sortText);
	$( ".btn_sort" ).attr( "name", sortCheckedId);
	$('.sorting_layer').parent().removeClass('on');
}

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

//swiper 공통
function CPOSwiper(){
	$('.swiperType01').each(function(i, d){	
		//slide의 개수가 2개 이상일때만 pagination이 노출됨.
		var $pagination = $(d).find('.swiper-slide').length > 1 ? '.swiper-pagination' : false;
		//.swiperType01태그에 data-swiper-space 설정시 spaceBetween 설정됨. 
		var $spaceBetween = $(d)[0].dataset.swiperSpace !== undefined ? parseInt($(d)[0].dataset.swiperSpace) : 0;
		new Swiper(d, {
			slidesPerView:'auto',
			spaceBetween:$spaceBetween,
			freeMode:false,
			pagination:{
				el: $pagination
			}
		});
	});
	$('.swiperType02').each(function(i, d){	
		new Swiper(d, {
			slidesPerView:'auto',
			spaceBetween:0,
			freeMode:true
		});
	});
}


// FO-MY-MS0017 나의 문의
function CPOQuestToggle(){
	$(document).off("click",".btn_faq")
		.on("click",".btn_faq", function(){
		if($(this).hasClass('on')){
			$(this).removeClass('on');
			$(this).next().slideUp(100);
		}else{
			$(this).addClass('on');
			$(this).next().slideDown(100); 
		}
	});
}

$(document).ready(function(){
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

	// 중개매매 상품목록
	$(".btn_sorting button").on("click",function(e){
		var objCont = $('.product_list');
		$(this).parents().addClass('on').siblings().removeClass('on');
		if($(this).hasClass('btn_list')) {
			objCont.addClass('list');
			objCont.removeClass('thumb');
		}else {
			objCont.addClass('thumb');
			objCont.removeClass('list');
		}
	});
});


// 중개매매 상품목록 아코디언
function productToggle(){
	$(document).off("click",".srch_list .tit").on("click",".srch_list .tit", function(){
		if($(this).hasClass('on')){
			$(this).removeClass('on');
			$(this).next().slideUp(100);
		}else{
			$(this).addClass('on');
			$(this).next().slideDown(100); 
		}
	});
}

// 상품 정렬 

