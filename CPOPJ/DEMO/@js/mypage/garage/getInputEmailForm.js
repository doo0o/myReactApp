$.namespace("mypage.garage.input.email");
mypage.garage.input.email = {
		
		// 초기화
		init : function(){
			
			//이벤트 바인딩
			this.bindEvent();

		},
		
		bindEvent : function(){
			that = this;
			
			//이메일 수신 동의 체크로 메일 수신 버튼 활성화/비활성화
			$("#chkAgree").click(function(e){
				if($("input[type=checkbox][id=chkAgree]").prop("checked")){
					$("#btnRcvNoti").attr("disabled", false);
				}else{
					$("#btnRcvNoti").attr("disabled", true);
				}
			});
			
		},
		
		//메일 정보 차고에 저장
		registEmailRecieve : function(){
			
			//이메일 유효성 검증
			if(mypage.garage.input.email.checkInputVlaue()){
				
				var cartSeq = $("#cartSeq").val()*1;
				var emailAddr = $("#email").val();
				
				var param = {
						cartSeq : cartSeq,
						emailAddr : emailAddr,
				}
				
				common.Ajax.sendRequest("POST"
						, _baseUrl+"mypage/garage/registEmailRecieveJson.do"
						, param
						, mypage.garage.input.email.registEmailRecieveJsonCallback
						, true
						, true
				);
			}
		},
		
		registEmailRecieveJsonCallback : function(res){
			if(res && res.resultCode == common._jsonSuccessCd){ //0000
				if(res.data && res.data.cartInfo){
					common.layerAlert(_sucsSaveEmail, function(){
						layerPopClose("layerPop-inputEmail");
						common.link.configModel();
					});
				}
			}else{ //9999
				common.layerAlert(res.resultMessage, function(){
					layerPopClose("layerPop-inputEmail");
				});
				return;
			}
		},
		
		
		// 필수 파라미터 체크
		checkInputVlaue : function(){
			
			// 이메일 체크
			if(!common.isEmail($("#email").val())){
				common.checkVaild("#inputFormEmail", function() {
					var emailRet = {
						result : false,
						resultMsg : _enterEmail
					};
					return emailRet;
				});
			}else{
				return true;
			}
		},
};
