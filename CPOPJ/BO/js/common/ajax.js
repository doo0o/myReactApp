$.ajaxSetup({
	statusCode:{
		404 : function(){
			alert('No Such Page Error: Check the request URL');
		},
		400 : function(xhr){
			alert('Bad Request: Invalid Input Data.');
			console.log(xhr);
		}
	},
   	beforeSend : function (xhr){
   		commerce.admin.common.Ajax.before(xhr);
//   		$("#ajax_indicator").show().fadeIn('fast');
   	},
   	complete : function (xhr){
   		commerce.admin.common.Ajax.after(xhr);
//   		$("#ajax_indicator").fadeOut();
	}
});

$.namespace("commerce.admin.common.Ajax");
commerce.admin.common.Ajax = {

	getAjaxObj : function(_method, _url, _data){
		return $.ajax({
	       	 type 	: _method
	       	,url 	: _url
	       	,data 	: _data
	    });
	},

	sendRequest : function(_method, _url, _data, _callback){
		var that = this;
		$.ajax({
       	 type 	: _method
       	,url 	: _url
       	,data 	: _data
       	,success: function(response){
			// ie에서 ajaxError.jsp로 가지못해 error.jsp에서 메세지 세팅
//			if(response.message === undefined){
//				var dataJson = response;
//				if(dataJson.indexOf("var ajaxMessageS") > 0 && dataJson.indexOf("var ajaxMessageE") > 0){
//					var ajaMessageJson = dataJson.substring(dataJson.indexOf("var ajaxMessageS")+17,dataJson.indexOf("var ajaxMessageE")-1);
//					response = JSON.parse(ajaMessageJson);
//				}
//			}
			//response object인 경우 로그아웃체크
			if(response.succeeded !== undefined && response.succeeded === false){
				if(response.authException !== undefined && response.authException === true){
					if(opener) {
						opener.top.location.replace(_baseUrl+"logout.do");
						closePop('N');
					} else {
						top.location.replace(_baseUrl+"logout.do");
					}
				} else {
					alert(response.message);
				}
				return;
			}
       		that.proceed(response, _callback);
       	 }
       	,error	: function (jqXHR,error, errorThrown){
       		that.error(jqXHR,error, errorThrown);
       	 }
       	,beforeSend : function (){
       		that.before();
    	    $("#ajax_indicator").show().fadeIn('fast');
       	 }
       	,complete : function (){
       		that.after();
    	    $("#ajax_indicator").fadeOut();
       	 }
       });
	},

	sendMultipartRequest : function(_method, _url, _data, _callback, noLoadingBar, time){
		var that = this;
		$.ajax({
			type 	: _method
			,enctype: 'multipart/form-data'
			,url 	: _url
			,data 	: _data
			,processData: false
	        ,contentType: false
	        ,cache: false
	        ,timeout: 600000
			,success: function(response){
				that.proceed(response, _callback);
			}
		,error	: function (jqXHR,error, errorThrown){
			that.error(jqXHR,error, errorThrown);
			$("#ajax_indicator").fadeOut();
		}
		,beforeSend : function (){
			that.before();
		}
		,complete : function (){
			that.after();
		}
		});
	},

	sendJSONRequest : function(_method, _url, _data, _callback, _async){
	    var that = this;
	    _async = _async && true;
//	    _data = encodeURI(_data);

		$.ajax({
	       	 type 	: _method
	       	,url 	: _url
	       	,data 	: _data
	       	,async  : _async
	       	,dataType : "json"
	       	,success: function(response){
				// ie에서 ajaxError.jsp로 가지못해 error.jsp에서 메세지 세팅
//				if(response.message === undefined){
//					var dataJson = response;
//					if(dataJson.indexOf("var ajaxMessageS") > 0 && dataJson.indexOf("var ajaxMessageE") > 0){
//						var ajaMessageJson = dataJson.substring(dataJson.indexOf("var ajaxMessageS")+17,dataJson.indexOf("var ajaxMessageE")-1);
//						response = JSON.parse(ajaMessageJson);
//					}
//				}
				//response object인 경우 로그아웃체크
				if(response.succeeded !== undefined && response.succeeded === false){
					if(response.authException !== undefined && response.authException === true){
						if(opener) {
							opener.top.location.replace(_baseUrl+"logout.do");
    						closePop('N');
						} else {
							top.location.replace(_baseUrl+"logout.do");
						}
					} else {
						alert(response.message);
						$("#ajax_indicator").fadeOut();
					}
					return;
				}
	       		that.proceed(response, _callback);
	       	 }
	       	,error	: function (jqXHR,error, errorThrown){
	       		that.error(jqXHR,error, errorThrown);
	       		$("#ajax_indicator").fadeOut();
	       	 }
	       	,beforeSend : function (){
	       		that.before();
	    	    $("#ajax_indicator").show().fadeIn('fast');
	       	 }
	       	,complete : function (){
	       		that.after();
	    	    $("#ajax_indicator").fadeOut();
	       	 }
	       });
	},

	/**
	 * 순차적으로 여러 개의 ajax 요청을 전송할 때 사용한다.
	 * ajax 객체를 생성하기 위해 commerce.admin.common.Ajax.getAjaxObj 메소드를 사용할 수도 있다.
	 * 사용 방법은 다음과 같다.
	 *
	 *  //1. 순차적으로 동작할 ajax 호출을 작성하고 배열에 입력한다.
	 *  var ajax1 = $.ajax(_baseUrl + "board/listJSON.do");
     *	var ajax2 = $.ajax(_baseUrl + "board/listJSON.do");
     *	var requests = [ajax1, ajax2];
     *
     *  //2. 구현된 callback 메소드를 각각 순서대로 배열에 입력한다.
     *	var callbacks = [commerce.front.BoardList._callback_getBoardList, commerce.front.BoardList._callback_getBoardList];
     *
     *  //3. commerce.admin.common.Ajax.sendMultipleRequest를 호출한다.
     *	commerce.admin.common.Ajax.sendMultipleRequest(requests, callbacks);
	 *
	 * @param _requests
	 * @param _callbacks
	 */
	sendMultipleRequest : function(_requests, _callbacks){
		var that = this;
		$.when.apply(undefined, _requests).done(function(){
			for(var i = 0 ; i < arguments.length ; i ++){
				that.proceed(arguments[i][0], _callbacks[i]);
			}
		});
	},

	/**
	 * JSONP 요청을 전송하는 메소드
	 *
	 * @param _method
	 * @param _url
	 * @param _data
	 * @param _callback
	 */
	sendJsonpRequest : function(_method, _url, _data, _callback){
		var that = this;
		$.ajax({
	       	 type 	: _method
	       	,url 	: _url
	       	,data 	: _data
	       	,dataType : "jsonp"
	       	,success: function(response){
				// ie에서 ajaxError.jsp로 가지못해 error.jsp에서 메세지 세팅
//				if(response.message === undefined){
//					var dataJson = response;
//					if(dataJson.indexOf("var ajaxMessageS") > 0 && dataJson.indexOf("var ajaxMessageE") > 0){
//						var ajaMessageJson = dataJson.substring(dataJson.indexOf("var ajaxMessageS")+17,dataJson.indexOf("var ajaxMessageE")-1);
//						response = JSON.parse(ajaMessageJson);
//					}
//				}
				//response object인 경우 로그아웃체크
				if(response.succeeded !== undefined && response.succeeded === false){
					if(response.authException !== undefined && response.authException === true){
						if(opener) {
    						opener.top.location.replace(_baseUrl+"logout.do");
    						closePop('N');
						} else {
							top.location.replace(_baseUrl+"logout.do");
						}
					} else {
						alert(response.message);
					}
					return;
				}
	       		that.proceed(response, _callback, true);}
	       	,error	: function (jqXHR,error, errorThrown){that.error(jqXHR,error, errorThrown);}
	       });
	},

	sendRequestJSON : function(_method, _url, _data, _callback, _async){
	    var that = this;
	    _async = _async && true;
//	    _data = encodeURI(_data);

		$.ajax({
	       	 type 	: _method
	       	,url 	: _url
	       	,data 	: JSON.stringify(_data)
	       	,async  : _async
	       	,contentType : "application/json; charset=utf-8"
	       	,dataType : "json"
	       	,success: function(response){
				// ie에서 ajaxError.jsp로 가지못해 error.jsp에서 메세지 세팅
//				if(response.message === undefined){
//					var dataJson = response;
//					if(dataJson.indexOf("var ajaxMessageS") > 0 && dataJson.indexOf("var ajaxMessageE") > 0){
//						var ajaMessageJson = dataJson.substring(dataJson.indexOf("var ajaxMessageS")+17,dataJson.indexOf("var ajaxMessageE")-1);
//						response = JSON.parse(ajaMessageJson);
//					}
//				}
				//response object인 경우 로그아웃체크
				if(response.succeeded !== undefined && response.succeeded === false){
					if(response.authException !== undefined && response.authException === true){
						if(opener) {
							opener.top.location.replace(_baseUrl+"logout.do");
    						closePop('N');
						} else {
							top.location.replace(_baseUrl+"logout.do");
						}
					} else {
						alert(response.message);
					}
					return;
				}
	       		that.proceed(response, _callback);
	       	 }
	       	,error	: function (jqXHR,error, errorThrown){
	       		that.error(jqXHR,error, errorThrown);
	       	 }
	       });
	},

	proceed : function(response, _callback, isJSONP){
		var that = this;

		if(response.message){
		    alert(that.decodeXss(response.message));
		}

		if(response.succeeded === false && response.authException === true){
		    if(typeof opener == "undefined" || opener == null){
//	            document.location.href="/admin/index.do";
	            top.location.replace(_baseUrl+"logout.do");
	        }else{
				opener.top.location.replace(_baseUrl+"logout.do");
				closePop('N');
	        }
        }

		if(response.succeeded === false){
		    return;
		}
//		ajax 통신시 전체 데이터에 대해 xss 처리는 side effect가 발생할 수 있으므로 원본 그대로 callback return 처리함.
//		xss 가 필요한 경우에는 해당 ajax callback 처리 시 구문내에서 xss 처리하도록 함.
		//_callback(that.decodeXss(JSON.stringify(response)));
		_callback(JSON.stringify(response));
	},

	error: function(xhr, status, error) {
		if(xhr && xhr.responseText){
			var errorAlert = true;
        	try{
				var dataJson = xhr.responseText;
				if(dataJson.message === undefined){
					// ie에서 ajaxError.jsp로 가지못해 error.jsp에서 메세지 세팅
					if(dataJson.indexOf("var ajaxMessageS") > 0 && dataJson.indexOf("var ajaxMessageE") > 0){
						var ajaMessageJson = dataJson.substring(dataJson.indexOf("var ajaxMessageS")+17,dataJson.indexOf("var ajaxMessageE")-1);
						dataJson = ajaMessageJson;
					}
				}
				dataJson = $.parseJSON(dataJson);
				response = dataJson;
				//response object인 경우 로그아웃체크
				if(response.succeeded !== undefined && response.succeeded === false){
					if(response.authException !== undefined && response.authException === true){
						if(opener) {
							try{
								opener.top.location.replace(_baseUrl+"logout.do");
							}catch(e){
							}finally{
								closePop('N');
							}
						} else {
							try{
								closePop('N');
							}catch(e){
							}finally{
								top.location.replace(_baseUrl+"logout.do");
							}
						}
					} else {
						alert(dataJson.message);
					}
					errorAlert = false;
					return;
				}
				alert(dataJson.message);
        	}catch(error){
        		if(errorAlert){
        			alert(xhr.statusText);
        		}
        	}
       }else{
//			alert("Unknown Error Occurred.");
			console.log("Unknown Error Occurred.");
       }
    },

	before : function(xhr){
		if(!!csrfHeaderName && !!csrfToke) {
			xhr.setRequestHeader(csrfHeaderName, csrfToke);
		}
	},

	after : function(){
	},

	getJSON : function(text){
		try{
			if(!text) {
				return false;
			}
			//var obj = eval(text);
			var obj = $.parseJSON(text);

			// 에러가 발생했다면 "error"라는 key 이름으로 object에 value가 입력되어 있다고 가정한다.
			if(obj.error) {
				alert(x2coMessage.getMessage("adminCommon.alert.error.protocol.async") + " ["+obj.error+"]");

				return;
			}

			if(typeof obj == "object") return obj;
		}
		catch(e){ return false; }
	},

	decodeXss : function (str){
		if(typeof str === 'string' && str != ""){
			if (!isNaN(str)) {
				return str;
			}
			if (str.length < 5) {
				return str;
			}
			var tmp = str;
			tmp = tmp.replaceAll("&#x27;", "'");
			tmp = tmp.replaceAll("&amp;", "&");
			tmp = tmp.replaceAll("&quot;", "\"");
			tmp = tmp.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
			tmp = tmp.replaceAll("&#40;", "(").replaceAll("&#41;", ")");
			tmp = tmp.replaceAll("&#x2F;", "/");
			return tmp;
		}
		else if (typeof str === "object" && str != null) {
			var obj = str;
			if (obj instanceof Array) {
				for (var i=0, len = obj.length; i < len; i++) {
					obj[i] = this.decodeXss(obj[i]);
				}
			} else if(obj instanceof Object) {
				for (var attr in obj) {
					if (obj.hasOwnProperty(attr)) {
						obj[attr] = this.decodeXss(obj[attr]);
					}
				}
			}
			return obj;
		}
		return str;
	}
};