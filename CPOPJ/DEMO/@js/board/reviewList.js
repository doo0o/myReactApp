$.namespace("board.reviewList");
board.reviewList = {
	
	init : function(){
		board.reviewList.bindEvent();
		board.reviewList.getReviewList();
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
		$("#reviewListForm").attr("action", _baseUrl+"board/getReviewList.do");
		
		$('#pageIdx').val(pageIdx);
		
		$('#reviewListForm').submit();
	},
	
	getReviewList : function(){
		var url = _baseUrl +"board/getReviewListAjax.do";
		
	    var params = {
    		searchKeyword 	: $("#searchKeyword").val(),
    		ntcClssCd		: $("#ntcClssCd").val(),
    		rowsPerPage		: $("#rowsPerPage").val(),
    		pageIdx			: $("#pageIdx").val()
		};
	    
	    common.Ajax.sendJSONRequest("POST", url, params, board.reviewList.getReviewListJsonCallback);
	},
	
	getReviewListJsonCallback : function(res){
		var htmlStr = '';
    	if(res.resultCode == '0000') {
    		if(res.data.length == 0) {
    			$("#noDataMsg").html(_noPost);
				$("#noData").show();
				$("#newsList").hide();
    		} else {
    			var source = $("#reviewList-template").html();
    			var template = Handlebars.compile(source);
    			htmlStr = template(res.data);
    		}
    	} else {
    		$("#noDataMsg").html(res.resultMessage);
			$("#noData").show();
			$("#newsList").hide();
    	}
    	$("#reviewList").html(htmlStr);
    	$("#btn_search").prop("disabled", false);
    	
    	common.setLazyloadImg("news");
	},
	
	goReviewDetail : function(ntcSeq){
		$("#reviewListForm").attr("action", _baseUrl+"board/getReviewDetail.do");
		$('#ntcSeq').val(ntcSeq);
		$('#reviewListForm').submit();
	},
};
