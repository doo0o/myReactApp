$.namespace("mypage.contract.list");
mypage.contract.list = {
	
	init : function(){
		mypage.contract.list.bindEvent();
	},
	
	bindEvent : function(){
		that = this;
		
		$("#btn_myContrDtl").click(function(){
			mypage.contract.list.moveMyContractDetail();
		});
		
		$("#btn_contrDtl").click(function(){
			mypage.contract.list.moveContractDetail();
		});
	},
	
	moveMyContractDetail : function(contractId){
		$(location).attr('href', _baseUrl + "mypage/contract/getContractDetail.do");
	},
	
	moveContractDetail : function(contractId){
		$(location).attr('href', _baseUrl + "contract/getContractDetail.do");
	},
	
};