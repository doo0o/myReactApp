$(function(){

	// 네비게이션박스 컨트롤
	$(document).off("click",".navi-box>.title").on("click",".navi-box>.title", function(){
		$('.navi-box').removeClass('on');
		$(this).closest('.navi-box').addClass('on');

	})
	$(document).off("click",".navi-box>.pop .btn-close").on("click",".navi-box>.pop .btn-close", function(){
		$(this).closest('.navi-box').removeClass('on');
	})

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
			var scroll = $(window).scrollTop();
			if(scroll > headerFooterControl.scrollPosition) {
				//console.log('scrollDown');
				$('html').addClass('headerHide');
			} else {
				//console.log('scrollUp');
				$('html').removeClass('headerHide');
			}
			headerFooterControl.scrollPosition = scroll;


			if(($(document).height() - $(window).height()) - $(window).scrollTop() > 30){
				$('html').addClass('footerContOver');
			}else{
				$('html').removeClass('footerContOver');
			}
		}
	}
	headerFooterControl.init();



	//레이어팝업 닫기버튼
	$('.layer-pop .box .btn-close').on('click',function(){
		$(this).closest('.layer-pop').removeClass('open');
		$('html').removeClass('layerPopOpen');
	});


	$(window).resize(function() {
		layerpopSetting();
	});

	layerpopSetting();
    if($('#sideMenu-scroll').length > 0){
        init_sideMenu();
    }
});

//오른쪽 사이드메뉴 초기설정
function init_sideMenu(){
    var fullDownMenu_scroll = new IScroll('#sideMenu-scroll', { mouseWheel: true,scrollbars:true,interactiveScrollbars:true });
    $(document).off("click",".fullDownMenu>ul>li>a").on("click",".fullDownMenu>ul>li>a", function(){
		var li = $(this).parent();
		if(li.hasClass('on')){
			li.removeClass('on');
		}else{
			$('.fullDownMenu>ul>li').removeClass('on');
			li.addClass('on');
		}
		fullDownMenu_scroll.refresh();
	})
	$(document).off("click",".fullDownMenu>ul>li>ul>li>a").on("click",".fullDownMenu>ul>li>ul>li>a", function(){
		var li = $(this).parent();
		$('.fullDownMenu>ul>li>ul>li').removeClass('on');
		li.addClass('on');
	});
    $(document).off("click","footer>.w-fix>.btn-sideMenu").on("click","footer>.w-fix>.btn-sideMenu", function(){
		if($('html').hasClass('sideMenuOpen')){
			$('html').removeClass('sideMenuOpen');
		}else{
			$('html').addClass('sideMenuOpen');
		}
	});
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

// 레이어팝업 열기
function layerPopOpen(id){
	$('html').addClass('layerPopOpen');
	$('#'+id).addClass('open');
}
// 레이어팝업 열기
function layerPopClose(id){
	$('html').removeClass('layerPopOpen');
	$('#'+id).removeClass('open');
}
