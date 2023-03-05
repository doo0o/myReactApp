$.namespace("contract");
contract = {}
$.namespace("contract.confirm");
contract.confirm = {}

$.namespace("contract.confirm.layer");
contract.confirm.layer = {
	
	init : function(){
		contract.confirm.layer.bindEvent();
	},
	
	bindEvent : function(){
		that = this;
	},
};
