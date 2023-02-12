$.namespace("account.memberSignoutForm");
account.memberSignoutForm = {
		
	init : function(){
		
		account.memberSignoutForm.bindEvent();
		
		$("#email").attr("readonly",true).attr("disabled",false);
		$("#withdrawalDate").attr("readonly",true).attr("disabled",false);
		
		$("#reasonText").hide();
		
	},
	
	bindEvent : function(){
		
		$("#reasonCode").change(function(){
			if ($("#reasonCode").val() == "0") {
				$("#reasonText").show();
			} else {
				$("#reasonText").hide();
				$("#reasonText").val("");
			}
		});
		
		//취소
		$(".contsArea").find(".btnArea").eq(0).find("a").eq(0).click(function(){
			//개인정보수정
			common.link.moveMemberModifyForm();
		});
		
		//탈퇴하기
		$(".contsArea").find(".btnArea").eq(0).find("a").eq(1).click(function(){
			if ($("#agrChk").prop("checked")) {
				var param = {
						reasonCode : $("#reasonCode").val(),
						reasonText : $("#reasonText").val()
				};
				common.account.onlineSignoutAjax(param, function(res) {
					console.log(res.code); // 0000:성공
					if (res.code == "0000") { //성공
						common.layerAlert(_complete);
						common.link.main();
					} else { //오류
						common.layerAlert(_fail);
					}
				});
			} else {
				common.layerAlert(_chk);
			}
		});
		
		//GENESIS 통합회원 탈퇴
		$(".contsArea").find(".btnArea").eq(1).find("a").click(function(){
			//개인정보수정
			common.link.moveMemberSignoutUrlCall();
		});
		
	},
	
};
