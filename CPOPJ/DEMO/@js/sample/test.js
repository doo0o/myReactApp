$.namespace("sample.test");
sample.test = {
	
	bindPageEvent : function(){
		that = this;
		
		$("#contents").find(".paging").find('a').click(function(){
			var pageIdx = $(this).data('pageNo');
			
			if(typeof pageIdx == 'undefined' || pageIdx == '')
				return;
			
			that.goPage(pageIdx);
		});
	},

	goPage : function(pageIdx){
		var url = _baseUrl+"sample/getTestPagingAjax";
		var data ={
			pageIdx : pageIdx,
			rowsPerPage : 30
		};
		
		common.Ajax.sendRequest("GET",url,data,function(html){
			$("#contents").html("");
	        $("#contents").html(html);
		});
	},
	
	getAjax : function(){
		var url = _baseUrl+"sample/getTestAjax";
		var data ={
				pageIdx : 1,
				rowsPerPage : 30
		};
		
		common.Ajax.sendJSONRequest("GET",url,data,function(json){
			console.log(JSON.stringify(json));
		});
	},
};
