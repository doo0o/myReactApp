$.namespace("support.faq.faqList");
support.faq.faqList = {
	
	init : function(){
		support.faq.faqList.bindEvent();
		support.faq.faqList.getFaqList();
	},
	
	bindEvent : function(){
		that = this;
		
		var tab_faq = new Swiper('#tab-faq',{slidesPerView: 'auto',freeMode:true,observer: true,observeParents: true});

		$("#contents").find(".paging").find('a').click(function(){
			var pageIdx = $(this).data('pageNo');
			
			if(typeof pageIdx == 'undefined' || pageIdx == '')
				return;
			
			that.goPage(pageIdx);
		});
		
		// 검색
		$("#btn_search").on("click", function(event) {	
			that.goPage(1);
		});
		
		//언어변경 1페이지 이동시 클래스 적용
		if (!$("a#idx").hasClass("on")) {
			$("a#idx").eq(0).addClass('on');
		}
	},
	
	goPage : function(pageIdx){
		$("#faqListForm").attr("action", _baseUrl+"support/faq/getFaqList.do");
		$('#pageIdx').val(pageIdx);
		$('#faqListForm').submit();
	},
	
	getFaqList : function(){
		var url = _baseUrl +"support/faq/getFaqListAjax.do";
		
	    var params = {
    		searchKeyword 	: $("#searchKeyword").val(),
    		faqClssCd		: $("#faqClssCd").val(),
    		rowsPerPage		: $("#rowsPerPage").val(),
    		pageIdx			: $("#pageIdx").val()
		};
	    
	    common.Ajax.sendJSONRequest("POST", url, params, support.faq.faqList.getFaqListJsonCallback);
	},
	
	getFaqListJsonCallback : function(res){
		var htmlStr = '';
    	if(res.resultCode == '0000') {
    		if(res.data.length == 0) {
    			$("#noDataMsg").html(_noPost);
				$("#noData").show();
				$("#faqList").hide();
    		} else {
    			var source = $("#faqList-template").html();
    			var template = Handlebars.compile(source);
    			htmlStr = template(res.data);
    		}
    	} else {
    		$("#noDataMsg").html(res.resultMessage);
			$("#noData").show();
			$("#faqList").hide();
    	}
    	$("#faqList").html(htmlStr);
    	$("#btn_search").prop("disabled", false);
    	
    	$(".cont>ul>li>.title").css("white-space", "normal");
	},
	
	goFaqList : function(faqClssCd){
		$("#faqListForm").attr("action", _baseUrl+"support/faq/getFaqList.do");
		$('#faqClssCd').val(faqClssCd);
		$('#pageIdx').val(1);
		$('#faqListForm').submit();
	},
};
