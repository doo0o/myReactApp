$.namespace("board.newsDetail");
board.newsDetail = {
	
	init : function(){
		board.newsDetail.bindEvent();
	},
	
	bindEvent : function(){
		that = this;
	},
	
	goNewsDetail : function(ntcSeq){
		$("#newsDetailForm").attr("action", _baseUrl+"board/getNewsDetail.do");
		
		$('#ntcSeq').val(ntcSeq);
		
		$('#newsDetailForm').submit();
	},
};
