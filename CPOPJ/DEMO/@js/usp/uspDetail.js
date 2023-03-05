$.namespace("usp.detail.wide");
usp.detail.wide = {
		
	init : function() {

        usp.detail.wide.bindEvent();
        
	},
	
	bindEvent : function() {
	},
};

$.namespace("usp.detail.division");
usp.detail.division = {
		
	init : function() {

		usp.detail.division.bindEvent();
			
	},
	
	bindEvent : function() {
	},
};

$.namespace("usp.detail.interaction");
usp.detail.interaction = {
		
	init : function() {

		usp.detail.interaction.bindEvent();
			
        $("#tab-features div a:eq(0)").click();
	},
	
	bindEvent : function() {
        $("#tab-features .swiper-slide").bind("click", function() {
        	$(".txtSet .desc").hide();
        	$(".txtSet .set_" + $(this).data("setno")).show();
        	$("#tab-features .swiper-slide").removeClass("on");
        	$(this).addClass("on");
        });
        
        var swiper = new Swiper('#tab-features', {
            slidesPerView: 'auto',
            paginationClickable: true,
            freeMode: true,
        });
        var swiper_interaction = new Swiper('#swiper-interaction', {
            // Enable lazy loading
            lazy: {
                loadOnTransitionStart:true
            },
            effect : 'fade',
            simulateTouch:false,
            fadeEffect: {
                crossFade: true
            },
            speed:1000
        });
        var temp_video;
        $('#tab-features').on('click',function(e){
            var idx = $(e.target).index();
            $('#tab-features a').removeClass('on');
            $(e.target).addClass('on');
            swiper_interaction.slideTo(idx)
            if(temp_video){
                temp_video.pause();
            }
            var video = $('#swiper-interaction .swiper-slide:eq('+idx+')').find('video')[0];
            if(video){
                video.play();
            }

            temp_video = video;
        });
        
	},
};

var colorChange_carViewer;

$.namespace("usp.detail.color");
usp.detail.color = {
		
	init : function() {

		usp.detail.color.bindEvent();
		
		$(".colorSelectGroup div label:eq(0)").click();
	},
	
	bindEvent : function() {
        $(".colorSelectGroup label").bind("click", function() {
        	$(".txtSet .desc").hide();
        	$(".txtSet .set_" + $(this).data("setno")).show();
        	$(".colorSelectGroup label input[type='radio']").removeAttr("checked");
        	$(this).find("input[type='radio']").attr("checked", true);
        });
        
        colorChange_carViewer = new Swiper('#colorChange-carViewer', {
            // Enable lazy loading
			preloadImages: false,
			lazyLoading: false,
			lazy: {
				loadOnTransitionStart:true,
				loadPrevNext: true,
			},
            effect : 'fade',
            fadeEffect: {
                crossFade: true
            },
            simulateTouch:false,
            setWrapperSize:true,
            speed:3000
        });
        $(".colorSelectGroup div label").on('click',function(e){
            var idx = $(e.target).parent().index();
            colorChange_carViewer.slideTo(idx)
        })
	},
};

$.namespace("usp.detail.dimension");
usp.detail.dimension = {
		
	init : function() {
		usp.detail.dimension.bindEvent();
			
		$("#tab-spec div a:eq(0)").click();
	},
	
	bindEvent : function() {
        var swiper = new Swiper('#tab-spec', {
            slidesPerView: 'auto',
            paginationClickable: true,
            freeMode: true
        });
        var swiper_spec = new Swiper('#swiper-spec', {
            // Enable lazy loading
            lazy: {
                loadOnTransitionStart:true
            },
            effect : 'fade',
            simulateTouch:false,
            fadeEffect: {
                crossFade: true
            },
            speed:1000
        });
        
        var curWidth = $(window).width();
        
        var swiper_specDataTable;
        
        if (curWidth <= common.mediaMaxWidth) {
        	$("#swiper-specDataTable").hide();
        	$("#swiper-specDataTable_Mobile").show();

            swiper_specDataTable = new Swiper('#swiper-specDataTable_Mobile', {
                // Enable lazy loading
                lazy: {
                    loadOnTransitionStart:true
                },
                effect : 'fade',
                simulateTouch:false,
                fadeEffect: {
                    crossFade: true
                },
                speed:1000
            });
        } else {
            swiper_specDataTable = new Swiper('#swiper-specDataTable', {
                // Enable lazy loading
                lazy: {
                    loadOnTransitionStart:true
                },
                effect : 'fade',
                simulateTouch:false,
                fadeEffect: {
                    crossFade: true
                },
                speed:1000
            });
        }
        
        $('#tab-spec').on('click',function(e){
            var idx = $(e.target).index();
            $('#tab-spec a').removeClass('on');
            swiper_spec.slideTo(idx);
            swiper_specDataTable.slideTo(idx);
            $(e.target).addClass('on');
        });
	},
};
