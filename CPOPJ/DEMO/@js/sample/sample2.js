$.namespace("sample.sample2");
sample.sample2 = {
	
	pageIdx : 1, 	
	
	/*	
		초기화
	*/
	init : function(){
		
		this.bindEvent();
		
		this.addHandlebarsHelper();
	},
	
	/*
		이벤트 설정
	*/
	bindEvent : function(){
		that = this;
		
		// 페이징 호출 함수
		$("#contents").find(".paging").find('a').click(function(){
			var pageIdx = $(this).data('pageNo');
			
			if(typeof pageIdx == 'undefined' || pageIdx == '')
				return;
			
			sample.sample2.pageIdx = pageIdx;
			
			that.getPageAjax(pageIdx);
		});
	},
    
	/*
		테스트 리스트 가져오기 PAGE AJAX
	*/
	getPageAjax : function(pageIdx){
		var url = _baseUrl+"sample/getSample2PagingAjax";
		var param ={
			pageIdx : pageIdx,
			rowsPerPage : 30
		};
		
		common.Ajax.sendRequest("GET", url, param, this.getPageAjaxCallBack);
	},
	
	/*
		테스트 리스트 가져오기 PAGE AJAX 콜백처리
	*/
	getPageAjaxCallBack : function(data){
		$("#contents").html("");
	    $("#contents").html(data);
	},

	/*
		테스트 리스트 가져오기 TPLT AJAX
	 */
	getTpltAjax : function(){
		var url = _baseUrl+"sample/getSample2TpltAjax";
		var param ={
				pageIdx : sample.sample2.pageIdx,
				rowsPerPage : 30
		};
		
		common.Ajax.sendRequest("GET", url, param, this.getTpltAjaxCallBack);
	},
	
	/*
		테스트 리스트 가져오기 TPLT AJAX 콜백처리
	 */
	getTpltAjaxCallBack : function(rs){
		console.log(JSON.stringify(rs));
		if(rs.resultCode && rs.resultCode != '0000'){
			alert(rs.resultMessage);
			return false;
		}
		if(rs.data){
			var source = $("#pageList-template").html();
			var template = Handlebars.compile(source);
			var html = template(rs.data);
			$("#sampleList").append(html);
			// 더보기 노출
			if(rs.data.paging){
				if(rs.data.paging.totalCount > rs.data.paging.pageIdx * rs.data.paging.rowsPerPage){
					sample.sample2.pageIdx++;
					$("#more").show();
				}else{
					$("#more").hide();
				}
			}
		}
	},
	
	/*
		테스트 리스트 가져오기 AJAX
	 */
	getAjax : function(){
		var url = _baseUrl+"sample/getTestAjax";
		var param ={
				pageIdx : 1,
				rowsPerPage : 30
		};
		
		common.Ajax.sendJSONRequest("GET",url,param,function(rs){
			console.log(JSON.stringify(rs));
			$("#contents").html(JSON.stringify(rs));
		});
	},
	
	/*
		템플릿에서 사용 할 함수 등록
	*/
	addHandlebarsHelper : function() {
		Handlebars.registerHelper('inc', function(number) {
			return number +1;
		});
	},
};
