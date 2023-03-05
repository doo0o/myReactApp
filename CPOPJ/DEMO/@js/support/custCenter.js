$.namespace("support.custCenter");

support.custCenter = {
		
	init : function() {
		support.custCenter.bindEvent();
		
		$("#privacyDay").change();
	},
	
	bindEvent : function() {
        $("#privacyDay").on("change", function() {
        	$(".txtBoxArea").html($("#terms_" + $(this).find("option:selected").val()).html());
        });
	},
	
};