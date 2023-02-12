$.namespace("finance.calc");
finance.calc = {
	
	init : function(){
		finance.calc.bindEvent();
	},
	
	bindEvent : function(){
		that = this;

		//창닫기
		$("#btnClose").click(function(e){
			e.preventDefault();
			finance.calc.closeLayer();
			e.stopPropagation();
		});
		
		//한도조회
		$("[id*=btnQryLimit]").click(function(e){
			e.preventDefault();
			var param = ""; //TODO getCartInfo
			finance.calc.getFinanceLimit(param);
			e.stopPropagation();
		});
	},
	
	closeLayer : function(){
		layerPopClose("fncCalcLayer");
		$("#fncCalcLayer").hide();
		$("#cartContent").show();
	},
	
	getFinanceLimit : function(param){
		console.log("TODO : 한도조회");
	},
};
