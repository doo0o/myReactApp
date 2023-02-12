$.namespace("payment");
payment = {}
$.namespace("payment.confirm");
payment.confirm = {}

$.namespace("payment.confirm.layer");
payment.confirm.layer = {
	
	init : function(){
		payment.confirm.layer.bindEvent();
	},
	
	bindEvent : function(){
		that = this;
	},
};
