$.namespace("board.reviewDetail");
board.reviewDetail = {
	
	init : function(){
		board.reviewDetail.bindEvent();
	},
	
	bindEvent : function(){
		that = this;
	},
	
	goReviewDetail : function(ntcSeq){
		$("#reviewDetailForm").attr("action", _baseUrl+"board/getReviewDetail.do");
		$('#ntcSeq').val(ntcSeq);
		$('#reviewDetailForm').submit();
	},
};
