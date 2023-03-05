var AjaxPaging = (function($){
    var $selector
       ,Callback;
    
    var init = function(id, _callback){
        $selector = $('#' + id);
        Callback = _callback;
    };
    
    var drawPaging = function(pagingUtil){
        
        var paging     = pagingUtil || {}
           ,pagingHtml = '';
     
        if(typeof paging.totalCount == 'undefined' || paging.totalCount == 0){
            $selector.html(pagingHtml);
            return;
        } 
         
        if(paging.pageIdx > paging.blockCount){
            pagingHtml += '<a class="prev" href="javascript:void(0);" onclick="'+Callback+'('+paging.prevBlockNo+');">이전 페이지</a>';
        }
             
        var pageIdx     = paging.startBlockNo
           ,startNumber = paging.startBlockNo
           ,endNumber   = paging.endBlockNo;
         
        for(startNumber; startNumber <= endNumber; startNumber++){
            if(paging.pageIdx == pageIdx){
                pagingHtml += '<strong title="현재 페이지">'+pageIdx+'</strong>';
            }else{
                pagingHtml += '<a href="javascript:void(0);" onclick="'+Callback+'('+pageIdx+');">'+pageIdx+'</a>';
            }
            pageIdx++;
        }
         
        if(paging.pageIdx != paging.totalPageCount && paging.endBlockNo < paging.nextBlockNo){
            pagingHtml += '<a class="next" href="javascript:void(0);" onclick="'+Callback+'('+paging.nextBlockNo+');">다음 페이지</a>';
        }
         
        $selector.html(pagingHtml);
    };
    
    var clearPaging = function(){
        $selector.html('');
    };
    
    return {
        init  : init
       ,draw  : drawPaging
       ,clear : clearPaging
    };
})(jQuery);