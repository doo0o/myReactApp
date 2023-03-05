$(function(){
	// 전체페이지 function으로 처리
	pageAllScript();
});
var objScrollTopMoveIngTimer;

function pageAllScript(){
	//GNB
	$('.menu-toggle').click(function() {
	  $('html').toggleClass('nav-open');
	  $('.nav').toggleClass('nav-open', 500);
	  $('.myGarage').toggleClass('hide', 500);
	  $('.brand').toggleClass('hide', 500);
	  $(this).toggleClass('open');
	  $('.login').toggleClass('show', 500);
	  $('.myPage').toggleClass('show', 500);
	})

	// footer language Select
    $('.languageSel > a').on('click', function(){
    	$(this).toggleClass('on');
        $(this).next('.languageView').slideToggle();
    });
	$('.languageSel .languageView a').click(function() {
		var idx = $(this).index();
		if(idx == 0){
			$(this).parent().prev('a').children('span').text('Chinese');
		}else if(idx == 1){
			$(this).parent().prev('a').children('span').text('English (US)');
		}
		$(this).parent().prev('a').removeClass('on');
		$(this).parent('.languageView').slideUp();
    });


	// 달력
	if ($('.calendarForm .datepicker').length != 0) {
		$('.calendarForm .datepicker').datepicker({
			showOn: 'focus',
		    //buttonImage: '../img/common/pc/icon_calendar.png',
		    //buttonImageOnly: true,
			firstDay : 0, //주의 시작일을 일요일로 하려면 0, 월요일은 1
			showOtherMonths: true, //이전날 다음달의 날자 미리보기
			//showMonthAfterYear: true, //년도와 월의 순서를 변경
			dayNamesMin: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'], // 요일의 한글 형식.
			monthNames: ["Jan. ", "Feb. ", "Mar. ", "Apr. ", "May. ", "Jun. ", "Jul. ", "Aug. ", "Sep. ", "Oct. ", "Nov. ", "Dec. " ],
			dateFormat: "yy-mm-dd", //년, 월, 일 순서
			 dateInput: true,
		});
	}


	// Form inputbox
	if ($('.inputForm').length != 0) {
		$('.inputForm input').each(function(){
			$(this).next('span').on('click',function(){
				$(this).prev('input').val('');
				//$(this).prev('input').focus();
				$(this).parent().removeClass('clearOn');
				$(this).prev('input').css({'padding-right' : '0px'});
			});
			$(this).on('textchange keyup paste',function(e){
				//console.log($(this).parent());
				if(e.target.value.length > 0){
					$(this).parent().addClass('clearOn');
					$(this).css({'padding-right' : '42px'});
				}else{
					$(this).parent().removeClass('clearOn');
					$(this).css({'padding-right' : '0px'});
				}
			});
		});
	}



	// tabsBody
	$('.tabsArea01, .tabsArea02').each(function(){

		$(this).children('.tabsBody').children('.tabsCents:first').show();
    	var tab_type = $(this).children('.tabs').children('li');

    	tab_type.click(function(){
			var inx = $(this).index();

			$(this).siblings().removeClass('active');
			$(this).addClass('active');

			if(!$(this).parent().parent().hasClass('disNone')){
				$(this).parent().next('.tabsBody').children('.tabsCents').hide();
				$(this).parent().next('.tabsBody').children('.tabsCents:eq(' + inx + ')').show();
			}

			if(typeof(window["initDeliveryType"]) == "function"){
				initDeliveryType();
			}
    	});

    });


	// 스크롤 탑바/상단가기 버튼
	$(window).scroll(function(){
		if ($('.topbtn').length != 0) {
			$('.topbtn').fadeIn();
			var topBtnL = $('.topbtn').offset().top;
			var topBtnH = $('.topbtn').height();
			var footerL = $('#footer').offset().top;

			if(topBtnL < footerL - topBtnH){
				setInterval(function(){
					if(topBtnL == $('.topbtn').offset().top){
						$('.topbtn').fadeOut();
					}
				}, 2000);
			}else{
				setInterval(function(){
					if(topBtnL == $('.topbtn').offset().top){
						$('.topbtn').fadeOut();
					}
				}, 500);
			}
		}
	});

	// scroll body to 0px on click
	$('.topbtn').bind("click", function(e) {
		// Prevents the default action to be triggered.
		e.preventDefault();

		$('body,html').animate({
			scrollTop: 0
		}, 500);
	});

	//아코디언형태 드랍다운방식 리스트
	$(document).off("click","[class ^= list-dropdown] .cont>ul>li>.title").on("click","[class ^= list-dropdown] .cont>ul>li>.title", function(e){
		var clickAction = true;
		if($(this).closest('[class ^= list-dropdown]').hasClass('noClickAction')){
			clickAction = false;
		}
		if($(this).closest('[class ^= list-dropdown]').hasClass('gotoTop')){
			$('html').addClass('objScrollTopMoveIng');
			$('html').addClass('headerHide');
			clearTimeout(objScrollTopMoveIngTimer);
			objScrollTopMoveIngTimer = setTimeout(function(){
				$('html').removeClass('objScrollTopMoveIng');
				$('html').addClass('headerHide');
			},1000)
		}
		//noClickAction 클래스가 있는경우 클릭시 액션 없게 처리
		if(clickAction){
			if($(this).closest('li').hasClass('on')){
				$(this).closest('li').removeClass('on');
			}else{
				$(this).closest('[class ^= list-dropdown]').find('.cont>ul>li:not("selectComple")').removeClass('on');
				$(this).closest('li').addClass('on');
				if($(this).closest('[class ^= list-dropdown]').hasClass('gotoTop')){
					if($(e.target).hasClass('title')){//체크영역 클릭했을경우는 상단으로 안가게 처리
						objScrollTop($(this));
					}
				}
			}


		}
	});


	//타이틀에 아코디언 들어간거 컨트롤
	$(document).off("click",".mobile-accordion").on("click",".mobile-accordion", function(){
		if($(this).hasClass('open')){
			$(this).removeClass('open');
		}else{
			$(this).addClass('open');
		}

	});

	//레이어팝업 닫기버튼
	$('.layer-pop .box .btn-close').on('click',function(){
		$(this).closest('.layer-pop').removeClass('open');
		if($(this).parent().parent().parent().hasClass('alert')){
			$('html').removeClass('layerPopOpenAlert');
		}else{
			$('html').removeClass('layerPopOpen');
		}
	});
	//전체화면 레이어팝업 닫기버튼 (닫기기능 개발요청으로 제거)
// 	$('.fullLayer .flHead .btn-close').on('click',function(){
// 		$(this).closest('.fullLayer').removeClass('open');
// 		$('html').removeClass('layerPopOpen');
// 	});


	// 카드 할부결재용 From
	$('.cardDivPayment a').on('click',function(){
		$(this).siblings().removeClass('on');
		$(this).toggleClass('on');
	});

	// financial pROGRAM
	$('.carBoxType01 .carDetialView > li > a').on('click',function(){
		if($(this).parent('li').hasClass('on')){
			$(this).parent('li').removeClass('on');
			$(this).next('div').slideUp();
		}else {
			$(this).parent('li').addClass('on');
			$(this).next('div').slideDown();
		}
	});

	// 내 차고 체크박스
	$('.vehicleList .chk input:checkbox').change(function(){
		$(this).parent().parent().toggleClass('chked');
	});

	// 차량구성 패키지 선택 팝업 체크박스
	$('.packagesList .chk input:checkbox').change(function(){
		$(this).parent().parent().toggleClass('chked');
	});

	//내차고 .dropUp 버튼
	$(".dropbtn").click(function() {
		$(this).next('.dropup-content').toggleClass('active');
	});

	//내차고 레이어
	$(".myGarage, .infoArea .like input:checkbox").click(function() {
		$('.sideLayer').removeClass('sideLayer-toggle');
	});
	$(".sideLayer .btn-close").click(function() {
		$('.sideLayer').addClass('sideLayer-toggle');
	});

	// 차량 구성 packages
	$('.packagesList .chk input:checkbox').change(function(){
		$(this).parent().toggleClass('chked');
	});


	// Function 실행
	searchForm();
	tabsArea02Script();
	layerpopSetting();
	carMainVisualHt();
	myPageAcc();
	sideLayerScroll_init();
	carMainBanScript();

	// Window resizing
	$(window).resize(function() {
		searchForm();
		tabsArea02Script();
		layerpopSetting();
		carMainVisualHt();
		myPageAcc();
		carMainBanScript();
	});


	// car Main script
	if ($('.carPSIP').length != 0){
		$('.carPSIP').find('.conObj').removeClass('playView');
	}


	//마이페이지 오늘쪽 플로팅
	if ($('.boxType01 .floatingScript').length != 0){
        var lastScrollTop = 0; // 스크롤 마지막 값

		var winSize = $(window).width(); 	// window창 넓이
		if (winSize > 980){	// window창이 모바일이 아닐때
			var objTop = $('.boxType01').offset().top;
			var winHt = $(window).innerHeight();		// 브라우저 높이
			var leftHt = $('.boxType01 .boxInnerLeft').height();	// 왼쪽 긴 박스 높이
			var tipHt = $('.boxType01 .tipArea').height(); //tip설명 있을때

			$('.boxType01 .floatingScript').css({'top' : '40px'});
			$('.fullLayer.open').scroll(function(){

				var $this = $(this);
				var objHt = $('.boxType01').height();		// 전체 박스 높이
				var stickyHt = $('.boxType01 .floatingScript').height();	// 플로팅 박스 높이
				var st = $this.scrollTop();	// 현재 스크롤 값

				if(st >= objTop ){
					$('.boxType01 .floatingScript').css({'top' : st - objTop + 40});
					if(st >= objHt + objTop - stickyHt + 150 - 50 - 50 - 40){
						$('.boxType01 .floatingScript').css({'top' : objHt + objTop - stickyHt - 150 - 50 - 50});
					}
				}else{
					$('.boxType01 .floatingScript').css({'top' : '40px'});
				}
                lastScrollTop = st;
                stNowScript(lastScrollTop, objHt, stickyHt);
			});
		}
	}

	// 마이페이지 인도전후 - payment Infor
	$('.payInforTotle > div > div > a').on('click',function(){
		if($(this).parent().parent().hasClass('active')){
			$(this).parent().parent().removeClass('active');
			$(this).parent().next('.objCent').hide();
		}else{
			$(this).parent().parent().addClass('active');
			$(this).parent().next('.objCent').show();
		}
	});
	if($('.payInforTotle .radio').length != 0){
		$('.payInforTotle .radio input:radio').each(function(){
			if($(this).is(':disabled')){
				$(this).parent().parent().parent().addClass('disabled');
			}else{
				$(this).parent().parent().parent().removeClass('disabled');
			}
		});
	}


	//마이페이지 boxPayType
	$('.boxPayType > a').on('click',function(){
		var num = $(this).index();

		// active 클래시 하나도 없을시
		if($('.boxPayType > a.active').length != 0){
			$(this).siblings().css({ 'background-position' : '-100% 0', 'color' : '#6f6f6f'});
			$(this).css({ 'background-position' : '-100% 0', 'color' : '#6f6f6f'});
			$(this).parent().parent().parent().find('.wireTransfer').slideUp();
		}
		// a태그 클릭시
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$(this).css({'color' : '#6f6f6f'});
		}else {
			$(this).addClass('active');
			$(this).siblings().removeClass('active');
			$(this).css({ 'background-position' : '-100% 0', 'color' : '#141414'});
			$(this).siblings().css({ 'background-position' : '0% 0', 'color' : '#bbb'});
		}

		// a태그 클릭시 해당내용 보여주기
		if($(this).hasClass('active')){
			if (num == 3){
				$(this).parent().parent().parent().find('.wireTransfer').slideDown();
			}else{
				$(this).parent().parent().parent().find('.wireTransfer').slideUp();
			}
		}

		if(typeof(window["changePayType"]) == "function"){
			changePayType();
		}
	});

	//마이페이지 차량구성/견적 계약하기
	$('.etcBoxAccScript > .tit01').on('click',function(){
		$(this).toggleClass('active');
		$(this).next('.etcBoxAccCont').slideToggle();
	});


	//차량구성&견적  Accordion
	$('.accScript > li > .toggle').on('click',function(){
		$(this).parent('li').siblings().removeClass('active');
		$(this).parent('li').siblings().find('.accCont').slideUp();
		$(this).parent('li').toggleClass('active');
		$(this).next('.accCont').slideToggle();
	});

	//상단 네비게이션에 shopping tools 모바일에서만 터치했을때 작동하게
	subnavScript();
	try{
		enquire.register("screen and (min-width: 1188px)", {
			match : function() {
				//console.log('pc');
				subnavScript_destroy();
			},
			unmatch : function() {
				//console.log('mobile');
				subnavScript();
			}
		});
	}catch(e){
		console.log('enquire 라이브러리가 없습니다.');
	}

	// 헤더풋더 스크롤시 컨트롤
	var headerFooterControl = {
		scrollHide:null,
		scrollPosition:null,
		init: function(){
			$(window).on('scroll',function(event){
				headerFooterControl.scrollAction();
			});

			headerFooterControl.scrollAction();

		},
		scrollAction: function(){
			//var scroll = window.scrollY;
			var scroll = $(window).scrollTop();
			if(scroll > headerFooterControl.scrollPosition) {
				//console.log('scrollDown');
				$('html').addClass('headerHide');
			} else {
				//console.log('scrollUp');
				$('html').removeClass('headerHide');
			}
			headerFooterControl.scrollPosition = scroll;
		}
	}
	headerFooterControl.init();
}

// 마이페이지 버튼 눌렀을때 플로팅 위치 고정
function stNowScript(lastScrollTop, objHt, stickyHt){
	$('.onClickBtn').off('click').on('click', function(){
		$('.boxType01 .floatingScript').css({'top' : lastScrollTop - 150 - 10 });

		if(lastScrollTop - 150 - 10 >= objHt - stickyHt - 50){
			$('.boxType01 .floatingScript').css({'top' : objHt - stickyHt - 50 });
		}
	});
}


// 차량 서브메인
function carMainBanScript(){

  	var winSzw = $(window).outerWidth();
	var carAsideObj = $('.carAside > div');

	if ($('.carAside').length != 0){
		if (winSzw <= 768){
			if(carAsideObj.find('.slick-slide').length > 3 && carAsideObj.hasClass('sliderArea') == true){
				carAsideObj.slick('unslick');
			}else if(carAsideObj.children('div').length <= 3 && carAsideObj.hasClass('sliderArea') == false){
				carAsideObj.attr('class','');
			}
		}else {
			if(carAsideObj.children('div').length == 1 && carAsideObj.hasClass('sliderArea') == false){
				carAsideObj.attr('class','col1');
			}else if(carAsideObj.children('div').length == 2 && carAsideObj.hasClass('sliderArea') == false){
				carAsideObj.attr('class','col2');
			}else if(carAsideObj.children('div').length == 3 && carAsideObj.hasClass('sliderArea') == false){
				carAsideObj.attr('class','col3');
			}else if(carAsideObj.children('div').length > 3){
				carAsideObj.attr('class','sliderArea');
				carAsideObj.slick({
			        dots: false,
			        infinite: false,
			        slidesToShow: 3,
			        slidesToScroll: 1,
			    });
			}
		}
	}

}



//상단 네비게이션에 있는 shoppingtools 컨트롤
function subnavScript(){
	$(".subnav").click(function() {
		console.log('click')
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$(this).children('#subCont').slideUp();
		}else {
			$(this).addClass('active');
			$(this).children('#subCont').slideDown();
		}
	});
	$('.subnav').mouseover(function(){
       $(this).siblings().find('a').addClass('disabled');
	   $('.bg-sub').css('height','253px');
    });
    $('.subnav').mouseleave(function(){
       $(this).siblings().find('a').removeClass('disabled');
	   $('.bg-sub').css('height','0');
    });
}
//상단 네비게이션에 있는 shoppingtools 컨트롤 해제
function subnavScript_destroy(){
	$(".subnav").off('click');
}

// 마이페이지 아코디언 클래시 추가
function myPageAcc(){
	var $this = $('.boxType01 .boxInnerLeft .boxAcc');
	if ($this.length != 0 ){
		if ($(window).width() <= 768) {
			$this.removeClass('accScript');
			$('.boxAcc > li').find('.accCont').hide();
		}else{
			$this.addClass('accScript');
			if( $this.find('li').hasClass('active')){
				 $this.find('li.active').find('.accCont').slideDown();
			}
		}
	}
	myPageAccGo($this);

}

//마이페이지 아코디언
function myPageAccGo(e){

	e.children('li').find('a.objView').off('click').on('click',function(){
		if ($(window).width() <= 768) {
			$('.boxAcc > li').find('.accCont').hide();
		}else{
			$(this).parent('li').siblings().removeClass('active');
			$(this).parent('li').siblings().find('.accCont').slideUp();
			$(this).parent('li').toggleClass('active');
			$(this).next('.accCont').slideToggle();
		}
	});
}

// carMain visual height
function carMainVisualHt(){
	var winWh =  $(window).width();
	var winHt =  $(window).height();

	// 차량서브메인 첫번째 video
	if ($('.carPSIP').length != 0){
		var objHt =  $('.carPSIP').children('.conObj').height();
		var objHtMb = objHt*1.315 + 59 + 29;

		if(winWh <= 600){
			$('.carPSIP').css({ 'height' : objHtMb + 403});
		}else if(winWh > 601 && winWh <= 768){
			$('.carPSIP').css({ 'height' : objHtMb + 403 + 59});
		}else if(winWh > 769 && winWh <= 1250){
			$('.carPSIP').css({ 'height' : objHt + 403});
		}else if(winWh > 1251 && winWh <= 1820){
			$('.carPSIP').css({ 'height' : objHt + 530});
		}else{
			 $('.carPSIP').css({ 'height' : '1085px'});
		}

		// video있을 경우
		if($('.carPSIP video').length != 0){

			if(winWh <= 600){
				$('.carPSIP video').css({ 'height' : objHtMb + 403});
				var winVideo = $('.carPSIP video').width();

				$('.carPSIP video').css({'margin-left' : '-' + (winVideo - winWh)/2 + 'px'});
			}else if(winWh > 601 && winWh <= 768){
				$('.carPSIP video').css({ 'height' : objHtMb + 403 + 59});
				var winVideo = $('.carPSIP video').width();

				$('.carPSIP video').css({'margin-left' : '-' + (winVideo - winWh)/2 + 'px'});
				var winVideo = $('.carPSIP video').width();
			}else if(winWh > 769 && winWh <= 1250){
				$('.carPSIP video').css({ 'height' : objHt + 403});
				var winVideo = $('.carPSIP video').width();

				$('.carPSIP video').css({'margin-left' : '-' + (winVideo - winWh)/2 + 'px'});
			}else if(winWh > 1251 && winWh <= 1820){
				$('.carPSIP video').css({ 'height' : objHt + 530});
				var winVideo = $('.carPSIP video').width();

				$('.carPSIP video').css({'margin-left' : '0px'});
			}else{
				$('.carPSIP video').css({'margin-left' : '0px'});
			}
		}
	}
	// 차량서브메인 두번째 video
	if ($('.carVideo').length != 0){
		var imgHt = $('.carVideo img').height();
		var winVideo02 = $('.carVideo video').width();
		var videoHt = $('.carVideo video').height();

		// video/img 윈도우 창 크기만큼 보여주기
		$('.carVideo').css({'height' : winHt - 105 + 'px'});

		if($('.carVideo img').length != 0 && $('.carVideo video').length == 0){
			//이미지일 경우
			if(imgHt < winHt){
				$('.carVideo').css({'height' : 'auto'});
				if(winWh <= 500){
					$('.carVideo img').css({'width' : '225%'});

					// box 높이 설정
					imgHtVar = $('.carVideo img').height();
					$('.carVideo').css({'height' : imgHtVar + 'px'});

					// img 높이 설정
					var imgWh = $('.carVideo img').width();
					$('.carVideo img').css({'margin-left' : (- imgWh + winWh)/2 + 'px'});
				}else{
					$('.carVideo img').css({'width' : '100%'});
					$('.carVideo img').css({'margin-left' : '0px'});
				}
			}
		}else if($('.carVideo img').length == 0 && $('.carVideo video').length != 0){

			// 윈도우 창 크기만큼 보여주기
			if(videoHt < winHt){
				$('.carVideo').css({'height' : 'auto'});
			}

			//동영상일 경우
			if(winWh <= 769){
				$('.carVideo video').css({'margin-left' : (- winVideo02 + winWh)/2 + 'px'});
			}else{
				$('.carVideo video').css({'margin-left' : '0px'});
			}
		}


	}
}



// search Form
function searchForm(){
	if($(this).width() < 768){
		// searchForm
		if($('.searchArea01 .fieldForm').hasClass('off')){
			$('.searchArea01 .fieldForm').hide();
		}
		$('.searchArea01 .btnSearArea').on("click", function() {
			$(this).slideUp();
			$(this).parent('.searchArea01').addClass('type01');
			$(this).prev('.fieldForm').removeClass('off');
			$(this).prev('.fieldForm').slideDown();
		});
		$('.searchArea01 .fieldForm .btnOpenView').on("click", function() {
			$(this).addClass('active');
			$(this).parent('.fieldForm').slideUp();
			$(this).parent('.fieldForm').addClass('off');
			$(this).parent().next('.btnSearArea').slideDown();
			$(this).parent().parent('.searchArea01').removeClass('type01');
		});

	}else{
		$('.searchArea01 .fieldForm').show();
	}
}

// tabsArea02Script
function tabsArea02Script(){
	var winSize = $(window).width();
	if(winSize <= 768){
		$('.tabsArea02').each(function(){
			var tab_moIcon = $(this).children('.tabs');
			tab_moIcon.click(function(){
				$(this).toggleClass('slideIcon');
			});
		});
	}else if(winSize > 768){
		$('.tabsArea02 .tabs').removeClass('slideIcon');
	}
}
var sideLayer_scroll
function sideLayerScroll_init(){
	if($('#sideLayer-scroll').length != 0) {
		sideLayer_scroll = new IScroll('#sideLayer-scroll',{mouseWheel: true,scrollbars:true,interactiveScrollbars:true,checkDOMChanges:true,preventDefault:true});
		$(window).on('resize',function(e){
			setTimeout(function(){
				sideLayer_scroll.refresh();
			},1000);
		});
	}

}

//레이어팝업 초기설정
function layerpopSetting(){
	$('.layer-pop').each(function(){
		if($(window).height() > $(this).find('.box').innerHeight()){
			$(this).addClass('fix-center');
		}else{
			$(this).removeClass('fix-center');
		}
	});
}
//obj 화면 상단으로스크롤이동
function objScrollTop(obj,gap){

	if (gap === undefined) {
		gap = 0;
	}
	setTimeout(function(){
		var top = obj[0].offsetTop;
		var pos = window.pageYOffset + obj[0].getBoundingClientRect().top/* - headerHeight */ - gap;
		$('html,body').animate({scrollTop:pos},500);
	},300)
}

// 레이어팝업 열기
function layerPopOpen(id){
	if($('#'+id).hasClass('alert')){
		$('html').addClass('layerPopOpenAlert');
	}else{
		$('html').addClass('layerPopOpen');
	}
	$('#'+id).addClass('open');
}
// 레이어팝업 닫기
function layerPopClose(id){
	if($('#'+id).hasClass('alert')){
		$('html').removeClass('layerPopOpenAlert');
	}else{
		$('html').removeClass('layerPopOpen');
	}
	$('#'+id).removeClass('open');
}
//커스텀 셀렉트박스
var customSelect = {
	init: function(id, selectId, drawing){
		var selectId = selectId;
		var tempSelect;
		$(id).each(function() {

			if(drawing){
				var classes = $(this).attr("class"),
				id      = $(this).attr("id"),
				name    = $(this).attr("name");
				var template =  '<div class="' + classes + '">';
				template += '<span class="custom-select-trigger">' + $(this).attr("placeholder") + '</span>';
				template += '<div class="custom-options">';
				$(this).find("option").each(function() {
					template += '<span class="custom-option ' + $(this).attr("class") + '" data-value="' + $(this).attr("value") + '">' + $(this).html() + '</span>';
				});
				template += '</div></div>';
				if($(this).parents('.custom-select-wrapper').length == 0){
					$(this).wrap('<div class="custom-select-wrapper" id="customSelect-'+selectId+'"></div>');
				}
				$(this).hide();

				$(this).next('.custom-select').remove();
				$(this).after(template);
			}

			$(this).on('change',function(e){
				var selectOptionText = e.currentTarget.selectedOptions[0].text;
				$(this).parent().find('.custom-select-trigger').text(selectOptionText);
			});
		});

		$(".custom-option:first-of-type").off('hover');
		$(".custom-option:first-of-type").hover(function() {
			$(this).parents(".custom-options").addClass("option-hover");
		}, function() {
			$(this).parents(".custom-options").removeClass("option-hover");
		});
		$(".custom-select-trigger").off("click");
		$(".custom-select-trigger").on("click", function() {
			var thisSelect = $(this).parents(".custom-select-wrapper");
			if(tempSelect && thisSelect.attr('id') != tempSelect.attr('id')){
				tempSelect.find('.custom-select').removeClass("opened");
			}
			$('html').one('click',function(){
				tempSelect.find('.custom-select').removeClass("opened");
			})
			$(this).parents(".custom-select").toggleClass("opened");
			tempSelect = $(this).parents(".custom-select-wrapper");
			event.stopPropagation();
		});
		$(".custom-option").off('click');
		$(".custom-option").on("click", function() {
			$(this).parents(".custom-select-wrapper").find("select").val($(this).data("value"));
			$(this).parents(".custom-options").find(".custom-option").removeClass("selection");
			$(this).addClass("selection");
			$(this).parents(".custom-select").removeClass("opened");
			$(this).parents(".custom-select").find(".custom-select-trigger").text($(this).text());
		});
	}
}
