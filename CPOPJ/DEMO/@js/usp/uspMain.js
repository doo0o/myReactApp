$.namespace("usp.main");

usp.main = {
		
	init : function() {

		usp.common.init();
        usp.main.bindEvent();
			
	},
	
	bindEvent : function() {
        $("section .detail-link").bind("click", function() {
//        	location.href = _baseUrl + "usp/getUspDetail.do?dispCatNo=" + $(this).data("dispcatno") + "&carLine=" + $("#selectedCarLine").val();
        	location.hash = $(this).data("dispcatno");
        });
	},
	
};