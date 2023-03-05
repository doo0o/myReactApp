
(function(w, d, $) {
"use strict";

w.getFunctionName = function(obj){
	var str = "";
	if(typeof(obj) == "function"){
		str = obj.toString();
		str = str.substring(9, str.indexOf("("));
	}
	return str;
};

w.getElementValue = function(obj){

    if(typeof obj === "string"){
    	return obj;

    }else if(typeof(obj) == "undefined"){
    	w.alert("form.js");
    	throw new Error('form.js');
    }else if(typeof(obj) == "function"){
    	var objid = w.getFunctionName(obj);
    	obj = d.getElementById(objid);
    }else if(typeof(obj) == "number"){
    	return obj;
    }

    var defaultVal = arguments.length > 1 ? arguments[1] : "";
    var tname = obj.tagName;
    var returnStr = "";
    var ntype;

    if(typeof(tname) == "undefined") {
        if(typeof(obj) == "undefined"){
            returnStr = defaultVal;

        }else if(typeof(obj) == "string"){
            returnStr = obj; // obj

        }else if(typeof(obj) == "number"){
            returnStr = obj; // obj

        }else if(typeof(obj) == "object"){
            if(typeof(obj.length) == "undefined"){
                returnStr = defaultVal;
            }else{
                ntype = typeof(obj[0]) != "undefined" ? obj[0].type : "" ;
                if(ntype == "checkbox" || ntype == "radio"){
                    returnStr = w.getRadiosValue(obj);
                }else {
                    window.alert("[ "+ obj[0].id + " ] ");
                    returnStr = defaultVal;
                }
            }
        }

    }else if(tname == "INPUT"){
        ntype = obj.type;
        if(ntype == "checkbox" || ntype == "radio"){
            returnStr = w.getRadiosValue(obj);
        }else {
            returnStr = obj.value;
        }

    }else if(tname == "TEXTAREA"){

        returnStr = obj.value;

    }else if(tname == "SELECT"){
        returnStr = obj.value;

    }else if(tname == "OBJECT"){
        if(typeof(obj.classid) == "undefined") return defaultVal;

        var clsid = obj.classid.toUpperCase();

        if(clsid == Clsid_MxMaskEdit || clsid == Clsid_MxTextArea){
            returnStr = obj.text;

        }else if(clsid == Clsid_MxRadio){
            returnStr = obj.CodeValue;

        }else if(clsid == Clsid_MxFileControl){
            returnStr = obj.value;

        }else if(clsid == Clsid_MxCombo){
            var colName = obj.CBDataColumns;
            colName = colName.substring(0, colName.indexOf(","));
            returnStr = obj.ValueOfIndex(colName, obj.Index);

        }else{
            window.alert("Value of [ "+obj + " ] is Object. ");
            returnStr = defaultVal;
        }
    }else{
        returnStr = defaultVal;
    }

    return returnStr;
};

w.getRadiosValue = function(obj) {
    if(typeof(obj.length) == "undefined"){
        if(obj.checked === true){
            return obj.value;
        }else{
        	if(typeof(obj.uncheckvalue) != "undefined"){
        		return obj.uncheckvalue;
        	}
        }
    }else{
    	for(var i = 0; i < obj.length; i++) {
    		if(obj[i].checked === true)
    			return obj[i].value;
    	}
    	return "";
    }
    return "";
};

w.getElementValueToString = function(obj){
    return w.getElementValue(obj).toString();
};

w.getElementValueToInteger = function(obj){
    var objValue = parseInt(w.getElementValue(obj));
    if(objValue.toString() == "NaN"){ objValue = 0;}
    return objValue;
};

w.getElementValueToFloat = function(obj){
    var objValue = parseFloat(w.getElementValue(obj));
    if(objValue.toString() == "NaN"){ objValue = 0.0;}
    return objValue;
};

w.isNotSelected = function(field, error_msg) {
	if(field.selectedIndex === 0) {
		w.alert(error_msg);
		field.focus() ;
		return true;
	} else {
		return false;
	}
};

w.uncheckRadio = function(field) {
	for(var i = 0; i < field.length; i++) {
		field[i].checked = false;
	}
};

w.getRadioVal = function(obj) {
	if(typeof(obj.length) == "undefined"){
        if(obj.checked === true){
            return obj.value;
        }
    }else{
    	for(var i = 0; i < obj.length; i++) {
    		if(obj[i].checked === true)
    			return obj[i].value;
    	}
    	return "";
    }
    return "";
};

w.doInit = function(frm) {
	for (var i = 0; i < frm.elements.length; i++) {
		frm.elements[i].value = "";
	}
};

w.setSelectVal = function( objFrm, val ) {
    var len = objFrm.options.length;

    if ( !len ) {
        return;
    }

    for ( var n = 0; n < len; n++ ) {

        if ( objFrm.options[n].value == val ) {
		    objFrm.options[n].selected = true;
		}
    }
};

w.setRadioVal = function(objFrm, val) {
	var len = objFrm.length;
	if (!len) {
		objFrm.checked = true;
	} else {
		for (var n = 0; n < len; n++) {
			if (objFrm[n].value == val)
				objFrm[n].checked = true;
		}
	}
};

w.isNotCheckedRadio = function(field, error_msg) {
	if ( field === null ) {
		w.alert(error_msg);
		return true;
	}

	if ( field.length === null ) {
		if ( field.checked === true ) {
			return false;
		} else {
			w.alert(error_msg);
			return true;
		}
	}

	for(var i = 0; i < field.length; i++) {
		if(field[i].checked === true) {
			return false;
		}
	}
	w.alert(error_msg);
	return true;
};

w.nextFocus = function(obj, limitLength, nextObj) {
	if(obj.value.length == limitLength) nextObj.focus();
};

w.isArray = function(obj){
	if(obj === null){
		return 0;
	}else {
		//alert(obj.type);
		if(obj.type == 'select-one'){
			return 1;
		}else if(obj.type == 'select-multiple'){
			return 1;
		}else{
			if(obj.length > 1){
				return obj.length;
			}else {
				return 1;
			}
		}
	}
};

w.genDomInput = function(elemName, elemValue){
	var input = document.createElement("input");
	input.setAttribute("type", "hidden");
	input.setAttribute("name", elemName);
	input.setAttribute("value", elemValue);
	return input;
};

w.clearObjectInChild = function(parentid){
	var parentObj = document.getElementById(parentid);
	var nodes = parentObj.childNodes;

	for(var i = 0; i < nodes.length; i++){
		w.clearObjectValue(nodes[i]);
	}
};

w.clearObjects = function(){
	var args = arguments;
	for(var i = 0; i < args.length; i++){
		w.clearObjectValue(args[i]);
	}
};

w.clearObjectValue = function(obj){
	if( typeof(obj) == "string"){
		obj = document.getElementById(obj);
	}

	var ntype;
    if(obj !== null && typeof obj === "object"){

	    var tname = obj.tagName;

	    if(typeof(tname) == "undefined") {
	        if(typeof(obj) == "object"){
	            if(typeof(obj.length) != "undefined"){
	                ntype = typeof(obj[0]) != "undefined" ? obj[0].type : "" ;
	                if(ntype == "checkbox" || ntype == "radio"){
	                    for(var j = 0; j < obj.length; j++){
	                    	obj[j].checked = false;
	                    }
	                }
	            }
	        }

	    }else if(tname == "INPUT"){
	        ntype = obj.type;
	        if(ntype == "checkbox" || ntype == "radio"){
	            obj.checked = false;
	        }else {
	            obj.value = "";
	        }

	    }else if(tname == "TEXTAREA"){
            obj.value = "";

	    }else if(tname == "SELECT"){
	        obj.selectedIndex = 0;

	    }else if(tname == "OBJECT"){

	        var clsid = obj.classid.toUpperCase();

	        if(clsid == Clsid_MxMaskEdit || clsid == Clsid_MxTextArea){
	            obj.text = "";

	        }else if(clsid == Clsid_MxRadio){
	            obj.reset();

	        }else if(clsid == Clsid_MxFileControl){
	            obj.value = "";

	        }else if(clsid == Clsid_MxCombo){
	            obj.index = 0;

	        }
	    }
	}
};

w.numberOnlyCl = function(obj_input){
    var elevalue = obj_input.value;
    var c;
    if(elevalue.length === 0) return;
    if(!/^[0-9]+$/.test(elevalue)){
    	for(var i = 0; i < elevalue.length; i++){
    		c = elevalue.charCodeAt(i);
	       	if( !(  48 <= c && c <= 57 ) ) {
	       		elevalue = elevalue.substring(0,i);
	       	}
    	}
    	obj_input.value = elevalue;
    }
};

w.fn_undo = function(){
    var nowUrl = w.location.href;
    var lastCharLength = nowUrl.length - 1;
    var lastChar = nowUrl.substring(lastCharLength)
    if(lastChar === "#") {
        nowUrl = nowUrl.substring(0, lastCharLength);
    }

    w.location.replace(nowUrl);
};

// validator="true"
// validator-type="cleanText" , text, cleanText, alpabat, number, float, alphaNum
// validator-length="200"
// validator-target="message panel."
// validator-format="yes" , y, use // 이외의 값은 숫자 format(천단위 콤마)을 하지 않음.
w.fn_bindFormValidator = function() {
	var eventId = ".formValidator"; // 이벤트 아이디(이벤트 on/off시에 key값으로 사용)

	String.prototype.equals = function(str) {
	    return (this === str);
	};
	String.prototype.isFinite = function() {
	    return isFinite(this);
	};
	String.prototype.startWith = function(str) {
	    if (this.equals(str))    return true;

	    if (str.length > 0)
	        return (str.equals(this.substr(0, str.length)));
	    else
	        return false;
	};
	String.prototype.endWith = function(str) {
	    if (this.equals(str))    return true;

	    if (String(str).length > 0)
	        return (str.equals(this.substr(this.length - str.length, str.length)));
	    else
	        return false;
	};
	String.prototype.bytes = function() {
	    var b = 0;
	    for (var i=0; i<this.length; i++) b += (this.charCodeAt(i) > 128) ? 2 : 1;
	    return b;
	};
	String.prototype.isKor = function() {
	    return (/^[가-힣]+$/).test(this.remove(arguments[0])) ? true : false;
	};
	String.prototype.isEmail = function() {
	    return (/\w+([-+.]\w+)*@\w+([-.]\w+)*\.[a-zA-Z]{2,4}$/).test(this.trim());
	};
	String.prototype.isUrl = function() {
	    return (/(file|ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/).test(this.trim());
	};
	String.prototype.isAlphaNum = function() {
	    return (this.search(/[^A-Za-z0-9_-]/) == -1);
	};
	String.prototype.isAlpha = function() {
	    return (this.search(/[^A-Za-z]/) == -1);
	};
	String.prototype.parseInt = function() {
		if (this === '' || this === undefined) return 0;
		if (isFinite(this)) {
			return parseInt(this, 0);
		}
		else {
			return this.trim().replace(/[^-_0-9]/g, "").parseInt();
		}
	};
	String.prototype.parseFloat = function() {
		if (this === '' || this === undefined) return 0.0;

		var result = this.trim().replace(/[^-_0-9.0-9]/g, "");
		if (result !== "") {
			return parseFloat(result);
		}
		else {
			return "";
		}
	};
	String.prototype.replaceXss = function(source, target) {
		source = source.replace(new RegExp("(\\W)", "g"), "\\$1");
		target = target.replace(new RegExp("\\$", "g"), "$$$$");
		return this.replace(new RegExp(source, "gm"), target);
	};

	if (!Number.toLocaleString) {
		Number.prototype.toLocaleString = function() {
			var s = String(this);
		    if (s.isFinite()) {
		        while((/(-?[0-9]+)([0-9]{3})/).test(s)) {
		            s = s.replace((/(-?[0-9]+)([0-9]{3})/), "$1,$2");
		        }
		    }
	        return s;
		};
	}

	String.prototype.toLocaleString = function() {
		var s = this;
	    if (s.isFinite()) {
	        while((/(-?[0-9]+)([0-9]{3})/).test(s)) {
	            s = s.replace((/(-?[0-9]+)([0-9]{3})/), "$1,$2");
	        }
	    }
        return s;
	};

	var makeMessage = function(str, arg0) {
		if(typeof str != "string" || str.indexOf(arg0) < 0)
			return str;
		return str.replace("{0}", arg0);
	};
	
	var messageCodes = {
		 "MSG0001" : x2coMessage.getMessage("adminCommon.alert.MSG0001"), // "특수문자 <{(%'\")}> 는 사용할 수 없습니다."
		 "MSG0002" : x2coMessage.getMessage("adminCommon.alert.MSG0002")  // "자 이상은 등록 할 수 없습니다."
	};
	var messagePrint = function(obj, msgID, msg) {
		if (obj instanceof $) {
			var oMsg = obj.html();
			var cMsg = obj.attr("handelMsgId");
			var nMsg = msgID;
			var hide = (obj.css("display") == "none");
			if (cMsg != nMsg) {
				if (hide) {
					obj.show();
				}
				obj.html("<span style='color:red;'>"+ makeMessage(messageCodes[nMsg], msg) +"</span>");
				obj.attr("handelMsgId", nMsg);
				window.setTimeout(function() {
					obj.attr("handelMsgId", "");
					obj.html(oMsg);
					if (hide) {
						obj.hide();
					}
				}, 3000);
			}
		}
	};
	var cleanXss = function(str){
		if(typeof str === "string" && str !== ""){
			if (!isNaN(str)) {
				return str;
			}
			var tmp = String(str);
			if (tmp === "") {
				return str;
			}
			tmp = tmp.replaceXss("<", "").replaceXss(">", "");
			tmp = tmp.replaceXss("(", "").replaceXss(")", "");
			tmp = tmp.replaceXss("{", "").replaceXss("}", "");
			tmp = tmp.replaceXss("%", "").replaceXss("&", "");
			tmp = tmp.replaceXss("'", "").replaceXss('"', "");
			tmp = tmp.replaceXss("//", "");
			return tmp;
		}
		return str;
	};

	// 등록값 점검.
	var keyupValidator = function(obj, vType) {
		if (obj instanceof $) {
			obj.off("keyup"+eventId).on("keyup"+eventId, function() {
				var o		= $(this);
				var vChar	= o.attr("validator-cleanChar");
				var vTraget	= o.attr("validator-target");
				var oTarget = $("#"+ vTraget);
				var oValue	= o.val();
				var oResult	= "";

				if (vType == "cleanText") {
//					oResult	= cleanXss(oValue);
//					if (vChar !== "" && vChar !== undefined) {
//						var chars = vChar.split(",");
//						for (var i = 0; i < chars.length; i++) {
//							oResult = oResult.replaceXss(chars[i], "");
//						}
//					}
//					if (oValue !== "" && oValue !== oResult) {
//						if (oTarget && oTarget.length > 0) {
//							messagePrint(oTarget, "MSG0001");
//						}
//						o.val(oResult);
//					}
				}
				else if (vType == "number") {
					if(oValue === "") {
						obj.val("");
						return true;
					}

					oResult = (oValue.match(/[0-9]/g) || []).join("");
					if (oValue != oResult) obj.val(oResult);
				}
				else if (vType == "numberType") {
				    if(oValue === "") {
                        obj.val("");
                        return true;
                    }

                    oResult = (oValue.match(/[0-9\-]/g) || []).join("");
                    if (oValue != oResult) obj.val(oResult);
				}
				else if (vType == "float") {
					if (!oValue.endWith('.')) {
						oResult = oValue.parseFloat();
						if (oValue != oResult) obj.val(oResult);
					}
			    }
				else if (vType == "alphaNum") {
					if(oValue === "") {
						obj.val("");
						return true;
					}

					oResult = (oValue.match(/[0-9a-zA-Z]/g) || []).join("");
					if (oValue != oResult) obj.val(oResult);
				}
			});
		}
	};
	// 특정값 등록 방지.
	var keydownValidator = function(obj, vType) {
		if (obj instanceof $) {
			// alphabat alpaNum number float
			obj.off("keydown"+eventId).on("keydown"+eventId, function(e) {
				var obj		= $(this);
				var isValid	= true;
				var oValue	= String(obj.val());
				e = (e ? e : event);
				var keyCd = e.keyCode;
				var numberKey = (
                        keyCd != 8 && keyCd != 9 && keyCd != 46 &&
                        (keyCd < 48 || keyCd > 57) &&
                        (keyCd < 96 || keyCd > 105) &&
                        (keyCd==17 && keyCd==8)&& //Ctrl + V 허용
                        (keyCd==13) //검색을 위한 Enter키 허용
                    )
				vType	= obj.attr("validator-type");
			    if (vType == "number" && numberKey){
			    	isValid = false;
			    }
			    else if (vType == "float" && (
			    		keyCd != 8 && keyCd != 9 && keyCd != 46 &&
			    		keyCd != 110 && keyCd != 190 &&
			    		(keyCd < 48 || keyCd > 57) &&
			    		(keyCd < 96 || keyCd > 105)
			    )){
			    	isValid = false;
			    }
			    else if (vType == "numberType" && numberKey &&  (keyCd != 189 && keyCd != 109) ){
			        isValid = false;
			    }
			    else if (vType === "alphaNum" && !oValue.match(/[0-9a-zA-Z]/g)) {
			    	isValid = false;
			    }

		    	if(!isValid) {
		    		e.returnValue=false;
		    		return false;
		    	}
			});
		}
	};
	var lengthValidator = function(obj, vLength) {
		if (obj instanceof $ && vLength > 0) {
			obj.blur(function() {
				var o		= $(this);
				var vTraget	= o.attr("validator-target");
				var oTarget = $("#"+ vTraget);
				var oValue	= o.val();
				if (oValue !== "" && oValue.length > vLength) {
					o.val(oValue.substring(0, vLength));
					if (oTarget && oTarget.length > 0) {
						messagePrint(oTarget, "MSG0002", vLength);
					}
				}
			});
		}
	};
	var numberFormatter = function(obj, vType, isFormat) {
		isFormat = isFormat || false;
		if (obj instanceof $) {
			obj.css("text-align", isFormat ? "right" : "left")
				.off("focus"+eventId + " blur"+eventId)
				.on("focus"+eventId, function() {
					var o = $(this),
						oValue = o.val();

					if (oValue !== "" && oValue.length > 0) {
						o.val(oValue.replaceAll(",", ""));
					}
				 })
				.on("blur"+eventId, function() {
					var o = $(this),
						oValue = String(o.val());

					if (oValue !== "" && oValue.length > 0) {
						if (vType === "number") {
							oValue = (oValue.match(/[0-9]/g) || []).join("");
						}
						else if (vType === "float") {
							oValue = oValue.parseFloat();
						}
						else if (vType === "numberType") {
						    oValue = (oValue.match(/[0-9\-]/g) || []).join("");
                        }

						if (!isFormat) {
							o.val(oValue);
						}
						else {
							o.val(oValue.toLocaleString());
						}
					}
				});
		}
	};

	var setValidator = function(obj) {
		if (obj instanceof $) {
			var vType	= String(obj.attr("validator-type")),
				vLength	= String(obj.attr("validator-length")),
				vFormat	= String(obj.attr("validator-format")).toLowerCase(),
				isFormat= (vFormat === "y" || vFormat === "yes" || vFormat === "use");

			if (vType !== "" && vType !== undefined) {
				switch (vType) {
					case "text" 	 :
						keyupValidator(obj, vType);
						break;
					case "cleanText" :
						keyupValidator(obj, vType);
						break;
					case "alpabat"	 :
						keydownValidator(obj, vType);
						break;
					case "alphaNum"	 :
						keyupValidator(obj, vType);
						break;
					case "numberType"  :
					    keyupValidator(obj, vType);
					    keydownValidator(obj, vType);
					    numberFormatter(obj, vType, isFormat);
                        break;
					case "number" 	 :
						keyupValidator(obj, vType);
						keydownValidator(obj, vType);
						numberFormatter(obj, vType, isFormat);
						break;
					case "float"	 :
						keyupValidator(obj, vType);
						keydownValidator(obj, vType);
						numberFormatter(obj, vType, isFormat);
						break;
				}
			}
			if (vLength !== "" && vLength !== undefined) {
				vLength = parseInt(vLength, 10);
				if (vLength > 0) {
					lengthValidator(obj, vLength);
				}
			}
		}
	};

	if (arguments.length > 0) {
		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (arg instanceof $ && arg.length > 0) {
				if (arg.length == 1) {
					setValidator(arg);
				}
				else {
					arg.each(function() {
						setValidator($(this));
					});
				}
			}
			else if (typeof arg == "object") {
				if (arg.obj instanceof $) {
					if (arg.type)
						arg.obj.attr("validator-type", arg.type);
					if (arg.length)
						arg.obj.attr("validator-length", arg.length);
					if (arg.target)
						arg.obj.attr("validator-target", arg.target);
					if (arg.clean)
						arg.obj.attr("validator-cleanChar", arg.clean);

					setValidator(arg.obj);
				}
				else {
					// TO-DO : JSON....
				}
			}
			else if (typeof arg == "string") {
				if ($("#"+arg).length > 0) {
					w.fn_bindFormValidator($("#"+arg));
				}
			}
		}
	}
	else {
		$("input[type='text'][validator='true']").each(function() {
			w.fn_bindFormValidator($(this));
		});
	}
};

$(d).ready(function() {
	fn_bindFormValidator();
});

})(window, document, jQuery);