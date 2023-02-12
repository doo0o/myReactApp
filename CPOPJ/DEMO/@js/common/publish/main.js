$(document).ready(function() {

  // typing animation
  (function($) {
    $.fn.writeText = function(content) {
        var contentArray = content.split(""),
            current = 0,
            elem = this;
        setInterval(function() {
            if(current < contentArray.length) {
                elem.text(elem.text() + contentArray[current++]);
            }
        }, 80);
    };

  })(jQuery);

  // input text for typing animation 
  //$("#holder").writeText("A refined, thoughtful statement in midsize luxury sedans, the G90 delivers an evolved, first-class experience through forward-thinking design and technology.");

  // initialize wow.js
  new WOW().init();
  
  // Push the body and the nav over by 285px over
  var main = function() {
      $('html').addClass('main');
	  $('.fa-bars').click(function() {
	      $('.nav-screen').animate({
	        right: "0px"
	      }, 200);

	      $('body').animate({
	        right: "285px"
	      }, 200);
	  });

	    // Then push them back */
	  $('.fa-times').click(function() {
		  $('.nav-screen').animate({
	        right: "-285px"
	      }, 200);

	      $('body').animate({
	        right: "0px"
	      }, 200);
	  });

	  $('.nav-links a').click(function() {
	      $('.nav-screen').animate({
	        right: "-285px"
	      }, 500);

	      $('body').animate({
	        right: "0px"
	      }, 500);
	  });
  };
  $(document).ready(main);
  // initiate full page scroll

  $('#mainTotal').fullpage({
    scrollBar: true,
    navigation: false,
    //navigationTooltips: ['mainVisualCar', 'mainVisualCarG70', 'mainVisualCarG80', 'mainVisualCarG80Sport', 'mainVisualCarG90'],
    //anchors: ['page01', 'page02', 'page03', 'page04', 'page05'],
    //menu: '#myMenu',
    fitToSection: false,
	scrollingSpeed: 500,
	scrollOverflowReset: true,
	sectionSelector: '.section',
	afterLoad: function (anchorLink, index){

    	var loadedSection = $(this);

		if($('#mainTotal .section').length != 0){
			imgAlign(index);
			$(window).resize(function() {
				imgAlign(index);
			});
		}
		
	
    }
  });
  
  // move section down one
  $(document).on('click', '.moveDown', function(){
    $.fn.fullpage.moveSectionDown();
    var idx = $(this).parent().parent().index() + 1;
	var num = $('#mainTotal .section').length;
	var ftL = $('#footer').offset();
	
	if(idx == num){
		$('html, body').animate({scrollTop : ftL.top}, 400);
	}
  });
  
  //내차고 레이어 클릭시
  $(document).on('click', '.myGarage', function(){
	  $.fn.fullpage.setAllowScrolling(false);
  });

  //내차고 레이어 닫기버튼 클릭시
  $(document).on('click', '.sideLayer .btn-close', function(){
	  $.fn.fullpage.setAllowScrolling(true);
  });
  
  
  imgAlignFirst();
  $(window).resize(function() {
	  imgAlignFirst();
	});
});

// img 첫 index 적용하기
function imgAlignFirst(){

  	var winSzw = $(window).outerWidth();
  	var winSzh = $(window).innerHeight();
  	
	//img일 경우
	var imgDivEp = $('#mainTotal .section .imgBox');
	var imgObj = $('#mainTotal .section .imgBox img');
  	var imgDiv = winSzh / winSzw;
  	var imgWHratio = imgObj.height() / imgObj.width();

	var imgWtActual = winSzh / imgWHratio;
	var imgWtToBe = winSzh / imgDiv;
	var marginLeft = -Math.round((imgWtActual - imgWtToBe) / 2);

	var imgWtActualMove = winSzh / (imgWHratio*0.9);
	var imgWtToBe = winSzh / imgDiv;
	var marginLeftMove = -Math.round((imgWtActualMove - imgWtToBe) / 2);

	//video일 경우
	var vidDivEp = $('#mainTotal .section video');
	var vidDiv = winSzh / winSzw;
	var vidWHratio = vidDivEp.height() / vidDivEp.width();

	var vidWtActual = winSzh / vidWHratio;
	var vidWtToBe = winSzh / vidDiv;
	var vidginLeft = -Math.round((vidWtActual - vidWtToBe) / 2);
	
	//alert(index)

	if($('#mainTotal .section:first-child').find('.imgBox').length != 0){
		
		//해당div 제외한 나머지 이미지 중앙정열
		if(imgDiv <= imgWHratio){
			$('#mainTotal .section').find('.imgBox').children('img').css({'width':'100%', 'height':'auto', 'transition':'all 0.1s ease', 'margin-left': '0px'});
		}else{
			$('#mainTotal .section').find('.imgBox').children('img').css({'width':'auto', 'height':'100%', 'transition':'all 0.1s ease', 'margin-left': + marginLeft + 'px'});
		}
		
		// 해당div 텍스트, 버튼
		$('#mainTotal .section:first-child').find('.inner').animate({
			opacity : 1
		}, 1000);
		//해당div 이미지 중앙정열
		if(imgDiv <= imgWHratio){
			$('#mainTotal .section:first-child').find('.imgBox').children('img').css({'width':'100%', 'height':'auto', 'transition':'all 2s ease', 'margin-left': '0px'});
			$('#mainTotal .section:first-child').find('.imgBox').children('img').css({'width':'110%', 'height':'auto', 'transition':'all 2s ease', 'margin-left': '-5%'});
		}else{
			$('#mainTotal .section:first-child').find('.imgBox').children('img').css({'width':'auto', 'height':'100%', 'transition':'all 2s ease', 'margin-left': + marginLeft + '0px'});
			$('#mainTotal .section:first-child').find('.imgBox').children('img').css({'width':'auto', 'height':'110%', 'transition':'all 2s ease', 'margin-left': + marginLeftMove + 'px'});
		}
	
	}
}


// 이미지 중앙정열
function imgAlign(index){

  	var winSzw = $(window).outerWidth();
  	var winSzh = $(window).innerHeight();
  	
	//img일 경우
	var imgDivEp = $('#mainTotal .section .imgBox');
	var imgObj = $('#mainTotal .section .imgBox img');
  	var imgDiv = winSzh / winSzw;
  	var imgWHratio = imgObj.height() / imgObj.width();

	var imgWtActual = winSzh / imgWHratio;
	var imgWtToBe = winSzh / imgDiv;
	var marginLeft = -Math.round((imgWtActual - imgWtToBe) / 2);

	var imgWtActualMove = winSzh / (imgWHratio*0.9);
	var imgWtToBe = winSzh / imgDiv;
	var marginLeftMove = -Math.round((imgWtActualMove - imgWtToBe) / 2);

	//video일 경우
	var vidDivEp = $('#mainTotal .section video');
	var vidDiv = winSzh / winSzw;
	var vidWHratio = vidDivEp.height() / vidDivEp.width();

	var vidWtActual = winSzh / vidWHratio;
	var vidWtToBe = winSzh / vidDiv;
	var vidginLeft = -Math.round((vidWtActual - vidWtToBe) / 2);
	
	//alert(index)
	
	if(index){
		//alert($('#mainTotal .section:eq(' + (index - 1) + ')').find('.imgBox').length)
		if($('#mainTotal .section:eq(' + (index - 1) + ')').find('.imgBox').length != 0){
			
			//alert('index img')
			// 해당div 제외한 텍스트, 버튼
			$('#mainTotal .section').find('.inner').css({
				opacity : 0
			});
			//해당div 제외한 나머지 이미지 중앙정열
			if(imgDiv <= imgWHratio){
				$('#mainTotal .section').find('.imgBox').children('img').css({'width':'100%', 'height':'auto', 'transition':'all 0.1s ease', 'margin-left': '0px'});
			}else{
				$('#mainTotal .section').find('.imgBox').children('img').css({'width':'auto', 'height':'100%', 'transition':'all 0.1s ease', 'margin-left': + marginLeft + 'px'});
			}
			

			// 해당div 텍스트, 버튼
			$('#mainTotal .section:eq(' + (index - 1) + ')').find('.inner').animate({
				opacity : 1
			}, 1000);
			//해당div 이미지 중앙정열
			if(imgDiv <= imgWHratio){
				$('#mainTotal .section:eq(' + (index - 1) + ')').find('.imgBox').children('img').css({'width':'100%', 'height':'auto', 'transition':'all 2s ease', 'margin-left': '0px'});
				$('#mainTotal .section:eq(' + (index - 1) + ')').find('.imgBox').children('img').css({'width':'110%', 'height':'auto', 'transition':'all 2s ease', 'margin-left': '-5%'});
			}else{
				$('#mainTotal .section:eq(' + (index - 1) + ')').find('.imgBox').children('img').css({'width':'auto', 'height':'100%', 'transition':'all 2s ease', 'margin-left': + marginLeft + '0px'});
				$('#mainTotal .section:eq(' + (index - 1) + ')').find('.imgBox').children('img').css({'width':'auto', 'height':'110%', 'transition':'all 2s ease', 'margin-left': + marginLeftMove + 'px'});
			}
		
		}else if($('#mainTotal .section:eq(' + (index - 1) + ')').find('video').length != 0){

			//alert('index video')

			// 해당div 텍스트, 버튼
			$('#mainTotal .section:eq(' + (index - 1) + ')').find('.inner').animate({
				opacity : 1
			}, 1000);
			//video일 경우
			if(vidDiv <= vidWHratio){
				vidDivEp.css({'width':'100%', 'height':'auto', 'transition':'all 0.3s ease', 'margin-left': '0px'});
			}else{
				vidDivEp.css({'width':'auto', 'height':'100%', 'transition':'all 0.3s ease', 'margin-left': + vidginLeft + 'px'});

			}

			// 해당div 제외한 텍스트, 버튼
			$('#mainTotal .section').find('.inner').css({
				opacity : 0
			}, 1000);
			//해당div 제외한 나머지 이미지 중앙정열
			if(imgDiv <= imgWHratio){
				$('#mainTotal .section').find('.imgBox').children('img').css({'width':'100%', 'height':'auto', 'transition':'all 0.1s ease', 'margin-left': '0px'});
			}else{
				$('#mainTotal .section').find('.imgBox').children('img').css({'width':'auto', 'height':'100%', 'transition':'all 0.1s ease', 'margin-left': + marginLeft + 'px'});
			}
		}
		
		
	}
	
	
}
