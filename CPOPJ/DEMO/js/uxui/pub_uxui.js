$(function(){
	// 전체페이지 function으로 처리
	pageAllScript();
});

//----------------------------------------------          공통 UI/UX 스크립트          ----------------------------
function pageAllScript(){
	//GNB
	$('.search-toggle').click(function() {
		$('html').toggleClass('nav-open');
		$('#searchLayer').toggleClass('nav-open', 500);
	});
	// 헤터, GNB, title, action Bar : 스크롤시 컨트롤
	var headerTitleControl ={
		scrollHide:null,
		scrollPosition:null,
		init: function(){
			$(window).on('scroll',function(event){
				headerTitleControl.scrollAction();
			});
			headerTitleControl.scrollAction();
		},
		scrollAction: function(){
			//var scroll = window.scrollY;
			var scroll = $(window).scrollTop();
			var headerH = $("#header").length ? $('#header').height() : false;
			var stickyH = $("#stickyTit").length ? $('#stickyTit').height() : false;
			
			if(scroll >= 50) {
				console.log('스크롤top이 50보다 클때만');
				$('html').removeClass('headerHide');
				$("#stickyTit").addClass('sticky');
				if(scroll > headerTitleControl.scrollPosition) {// 스크롤 다운 시, h_navi 숨기기  /
					$('html').addClass('headerHide');
					if($("#header").length > 0 ){
						$("#stickyTit").removeClass('space50');
					}
				} else {// 스크롤 UP 시, h_navi 보여주기
					$('html').removeClass('headerHide');
					if($("#header").length > 0){
						$("#stickyTit").addClass('space50');
					}
				}
			} else {
				$("#stickyTit").removeClass('sticky');
			}
			headerTitleControl.scrollPosition = scroll;

		}//
	}// varheaderTitle 
	headerTitleControl.init();// varheaderTitle 
	
	
}//pageAllScript End

// ----------------------------------------------          상품상세 UI/UX 스크립트          ----------------------------