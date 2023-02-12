$.namespace("board.newsList");
board.newsList = {
	
	init : function(){
		board.newsList.bindEvent();
		board.newsList.getNewsList();
	},
	
	bindEvent : function(){
		that = this;

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
		
		// <a tag안에 <a tag가 있을 경우 화면이 깨져서 내용에 <a 태그 삭제
		Handlebars.registerHelper('removeATag', function(cont) {
			return cont.replace(/(<a[^>]+?>|<\/a>)/img, "").trim();
		});
		
		//언어변경 1페이지 이동시 클래스 적용
		if (!$("a#idx").hasClass("on")) {
			$("a#idx").eq(0).addClass('on');
		}
	},
	
	goPage : function(pageIdx){
		$("#newsListForm").attr("action", _baseUrl+"board/getNewsList.do");
		$('#pageIdx').val(pageIdx);
		$('#newsListForm').submit();
	},
	
	getNewsList : function(){
		var url = _baseUrl +"board/getNewsListAjax.do";
		
	    var params = {
    		searchKeyword 	: $("#searchKeyword").val(),
    		ntcCatCd		: $("#ntcCatCd").val(),
    		ntcClssCd		: $("#ntcClssCd").val(),
    		rowsPerPage		: $("#rowsPerPage").val(),
    		pageIdx			: $("#pageIdx").val()
		};
	    
	    common.Ajax.sendJSONRequest("POST", url, params, board.newsList.getNewsListJsonCallback);
	},
	
	getNewsListJsonCallback : function(res){
		var htmlStr = '';
		if(res.resultCode == '0000') {
			if(res.data.length == 0) {
				$("#noDataMsg").html(_noPost);
				$("#noData").show();
				$("#newsList").hide();
    		} else {
    			var source = $("#newsList-template").html();
    			var template = Handlebars.compile(source);
    			htmlStr = template(res.data);
    		}
    	} else {
    		$("#noDataMsg").html(res.resultMessage);
			$("#noData").show();
			$("#newsList").hide();
    	}
		$("#newsList").html(htmlStr);
    	$("#btn_search").prop("disabled", false);
    	
    	common.setLazyloadImg("news");
	},
	
	goNewsDetail : function(ntcSeq){
		$("#newsListForm").attr("action", _baseUrl+"board/getNewsDetail.do");
		$('#ntcSeq').val(ntcSeq);
		$('#newsListForm').submit();
	},
};
