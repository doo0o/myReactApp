$.namespace("account.serviceJoin.form");
account.serviceJoin.form = {
		
		init : function(){
			account.serviceJoin.form.bindEvent();
		},
		
		bindEvent : function(){
			$("#btn_ok").click(function(){
				if (account.serviceJoin.form.checkInputVlaue()) {
					account.serviceJoin.form.doServiceJoin();
				}
			});
			
			$("#btn_cancel").click(function(){
				//$(".contsArea").find(".agreeArea").find(".cont").find("input[type='checkbox']").prop('checked', false);
				//$(".contsArea").find(".agreeArea").find(".optArea").find("input[type='checkbox']").prop('checked', false);
				common.link.main();
			});
			
			$("#argAll").click(function(){
				if ($(this).is(":checked")) {
					$(".contsArea").find(".agreeArea").find(".cont").find("input[type='checkbox']").prop('checked', true);
				} else {
					$(".contsArea").find(".agreeArea").find(".cont").find("input[type='checkbox']").prop('checked', false);
				}
			});
			$(":checkbox[name='arg']").click(function(){ 
				if ( $(this).prop('checked') ) { 
					if($("input:checkbox[name='arg']:checked").length == $("input:checkbox[name='arg']").length) {	
						$('input:checkbox[id="argAll"]').prop("checked",true);
					}
				} else { 
					if($("input:checkbox[name='arg']:checked").length < $("input:checkbox[name='arg']").length) {
						$('input:checkbox[id="argAll"]').prop("checked",false);
					}
				} 
			});
			
			$("#optArgAll").click(function(){
				if ($(this).is(":checked")) {
					$(".contsArea").find(".agreeArea").find(".optArea").find("input[type='checkbox']").prop('checked', true);
				} else {
					$(".contsArea").find(".agreeArea").find(".optArea").find("input[type='checkbox']").prop('checked', false);
				}
			});
			$(":checkbox[name='optArg']").click(function(){ 
				if ( $(this).prop('checked') ) { 
					if($("input:checkbox[name='optArg']:checked").length == $("input:checkbox[name='optArg']").length) {	
						$('input:checkbox[id="optArgAll"]').prop("checked",true);
					}
				} else { 
					if($("input:checkbox[name='optArg']:checked").length < $("input:checkbox[name='optArg']").length) {
						$('input:checkbox[id="optArgAll"]').prop("checked",false);
					}
				} 
			});
			
			$("#goHome").click(function(){
				location.href = _baseUrl+"main/main.do";
			});
			
			$("#clk1").click(function(){
				var src = $(this).attr("src");
				if (!$(this).hasClass("on")) {
					if (!$("#clk1").find(".cont").html()) {
						$.ajax({
			                url : src,
			                success : function(result) {
			                	var refine = $("#clk1").find(".cont").html(result);
			                	$("#clk1").find(".cont").html(refine.find("#subCont").html());
			                }
			            });
					}
				}
			});
			
			$("#clk2").click(function(){
				var src = $(this).attr("src");
				if (!$(this).hasClass("on")) {
					if (!$("#clk2").find(".cont").html()) {
						$.ajax({
			                url : src,
			                success : function(result) {
			                	var refine = $("#clk2").find(".cont").html(result);
			                	$("#clk2").find(".cont").html(refine.find("#subCont").html());
			                }
			            });
					}
				}
			});
			
			$("#clk3").click(function(){
				var src = $(this).attr("src");
				if (!$(this).hasClass("on")) {
					if (!$("#clk3").find(".cont").html()) {
						$.ajax({
			                url : src,
			                success : function(result) {
			                	var refine = $("#clk3").find(".cont").html(result);
			                	$("#clk3").find(".cont").html(refine.find("#subCont").html());
			                }
			            });
					}
				}
			});
		},
		
		/** 서비스가입 **/
		doServiceJoin : function(){
			//var _smsOptIn="F", _callOptIn="F", _directMailOptIn="F", _weChatTextOptIn="F";
			var _smsOptIn="F", _callOptIn="F", _directMailOptIn="F";
			
			/*
			if (!$("#terms1").prop("checked") || !$("#terms2").prop("checked")) {
				common.layerAlert(_notConsent);
				return;
			}
			$("input:checkbox[name=arg]").each(function(){
				var isTermAgr = $(this).is(":checked");
				if(!isTermAgr){
					common.layerAlert(_notConsent);
					return;
				}
			});
			 * */
			
			if ($("#smsOptIn").prop("checked")) _smsOptIn = "T";
			if ($("#callOptIn").prop("checked")) _callOptIn = "T";
			if ($("#directMailOptIn").prop("checked")) _directMailOptIn = "T";
			//if ($("#weChatTextOptIn").prop("checked")) _weChatTextOptIn = "T";
			
			var params = {
				smsOptIn : _smsOptIn,
				callOptIn : _callOptIn,
				directMailOptIn : _directMailOptIn,
				//weChatTextOptIn : _weChatTextOptIn
			};
			
			var url = _baseUrl +"login/serviceJoinAjax.do";
		    common.Ajax.sendJSONRequest("POST", url, params, account.serviceJoin.form.doServiceJoinCallback);
		},
		doServiceJoinCallback : function(res){
			if(res.code == _mem_cd_0000) {
				location.href = _baseUrl+"login/serviceJoinComplete.do";
			} else {
				alert(res.message);
	    	}
		},
		checkInputVlaue : function(){
			var termsAgrChk = true;
			$("input:checkbox[name=arg]").each(function(){
				var isTermAgr = $(this).is(":checked");
				if(!isTermAgr){
					termsAgrChk = false;
					return false;
				}
			});
			if(!termsAgrChk){
				common.layerAlert(_notConsent);
				return false;
			}
			return true;
		},
		
};