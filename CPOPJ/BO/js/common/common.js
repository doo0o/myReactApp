var console = window.console || {
	log : function() {
	},
	info : function() {
	},
	warn : function() {
	},
	error : function() {
	}
};

$.namespace = function() {
	var a = arguments, o = null, i, j, d;
	for (i = 0; i < a.length; i = i + 1) {
		d = a[i].split(".");
		o = window;
		for (j = 0; j < d.length; j = j + 1) {
			o[d[j]] = o[d[j]] || {};
			o = o[d[j]];
		}
	}

	return o;
};

(function(window){
    $(document).ready(function(){

        /**
         * class가 only_number로 지정되어져 있는 컨트롤 들은 숫자만 입력 받도록 한다.
         */
        $(".only_number").keydown(function(event){
            inputNumber(event);
        });
    });
})(jQuery);

$.namespace("org.x2framework.common.Util");
org.x2framework.common.Util = {
	// Evaluate String Criteria
//	evaluate : function(criteria, value) {
//		return new Function('value', "return " + criteria)(value);
//	},

	// Get Window Namespace Object
	namespaceObj : function(objName) {
		//return new Function('objName', "return window." + objName)(objName);
		var j, o = window, d = objName.split(".");
		for(j = 0; j < d.length; j++) {
			o = o[d[j]];
		}
		return o;
	},

	getGridView : function(gridName) {
		return org.x2framework.common.Util.namespaceObj(gridName
				+ ".settings.grid");
	},

	getValues : function(obj) {
		var keysArr = Object.keys(obj);
		var valuesArr = [];

		for (var index in keysArr) {
			valuesArr.push(obj[keysArr[index]]);
		}

		return valuesArr;
	},

	getListItemsValues : function(obj) {
		var keysArr = Object.keys(obj);
		var valuesArr = [];

		for (var index in keysArr) {
			valuesArr.push({text : obj[keysArr[index]], value : keysArr[index]});
		}

		return valuesArr;
	},

	cloneGrid : function(gridId, source, overridedSettings, overridedEventHandler) {
		$.namespace(gridId + ".settings");
		$.namespace(gridId + ".eventhandler");

		window[gridId].settings = $.extend(true, {}, source.settings, overridedSettings);
		window[gridId].eventhandler = $.extend(true, {}, source.eventhandler, overridedEventHandler);

		window[gridId].settings.grid = undefined;
		window[gridId].eventhandler.grid = undefined;
	},

	/**
	 * formId에 해당하는 모든 text박스에 엔터키 입력시 조회가 실행되도록 설정한다.
	 * forId : form태그의 ID값
	 * searchButtonId : 엔터 입력으로 실행될 조회 버튼의 ID를 입력
	 */
	setupEnterSearch : function(formId, searchButtonId) {
	    $("form[name="+formId+"] input[type=text]").keydown(function(event){
            org.x2framework.common.Util.onEnterSearch(event, searchButtonId);
        });
	},

	/**
	 * 검색영역에서 input type='text'인 항목에서 enter key 입력시 검색버튼의 클릭이벤트를 호출한다.
	 * event : 윈도우 이벤트 객체
	 * searchButtonId : 엔터 입력으로 실행될 조회 버튼의 ID를 입력
	 */
	onEnterSearch : function(event, searchButtonId) {
	    try {
	        var event = event || window.event;
    	    if(event.keyCode !== 13) return false;
	        if(searchButtonId===undefined || searchButtonId === null || searchButtonId === "") {
	            return false;
	        }
	        $("#" + searchButtonId).click();
	    } catch(err){}
	},

    getCheckedItems : function(grid) {
    	var rows = [];
    	var indexArr = [];
    	if(!grid.modelManager.columnModel.get('selectType')) {
	    	var modifiedRows = grid.getModifiedRows();
	    	for(key in modifiedRows) {
	    		for(i in modifiedRows[key]) {
	    			rows.push(modifiedRows[key][i]);
	    		}
	    	}
    	} else {
    		rows = grid.getCheckedRows();
    	}

    	for(i in rows) {
    		indexArr.push(grid.getIndexOfRow(rows[i].rowKey));
    	}
    	return indexArr;
    },

    getRowState : function(grid, index) {
    	var modifiedRows = grid.getModifiedRows();
    	for(key in modifiedRows) {
    		for(i in modifiedRows[key]) {
    			if(grid.getRowAt(index).rowKey == modifiedRows[key][i].rowKey) {
    				switch(key) {
    				case "createdRows" : return "created";
    				case "updatedRows" : return "updated";
    				case "deletedRows" : return "deleted";
    				default : return "none";
    				}
    			}
    		}
    	}
    	return "none";
	},
	
	getRowStateByKey : function(grid, index) {
    	var modifiedRows = grid.getModifiedRows();
    	for(key in modifiedRows) {
    		for(i in modifiedRows[key]) {
    			if(grid.getRow(index).rowKey == modifiedRows[key][i].rowKey) {
    				switch(key) {
    				case "createdRows" : return "created";
    				case "updatedRows" : return "updated";
    				case "deletedRows" : return "deleted";
    				default : return "none";
    				}
    			}
    		}
    	}
    	return "none";
    },

    getRowStateCount : function(grid, state) {
    	var stateCount = 0;
    	if(state===undefined || state === null || state === "") {
    		state = "change";
    	}

    	if(state == "created" || state == "change") {
    		stateCount += grid.getModifiedRows()["createdRows"].length;
    	}
    	if(state == "updated" || state == "change") {
    		stateCount += grid.getModifiedRows()["updatedRows"].length;
    	}
    	if(state == "deleted" || state == "change") {
    		stateCount += grid.getModifiedRows()["deletedRows"].length;
    	}

    	return stateCount;
    },

    setColumnProperty : function(grid, columnName, columnValues){
    	var bColumns = grid.getColumns();
        for (var index = 0; index < bColumns.length; index++) {
            if (bColumns[index].name == columnName ) {
            	bColumns[index] = $.extend(true, bColumns[index], columnValues);
            	grid.setColumns(bColumns);
            	break;
            }
        }
    },

    //UTC -> Setting Timezone time
    getLocalDate : function(value){
    	var offset = Number(_timeZoneOffset); //Asia/Seoul : 9
		var date, utc;

		date = org.x2framework.common.Util.getDateObject(value, 'utc');
		utc = date.getTime() + (date.getTimezoneOffset() * 60000);

		//return new Date(date.toLocaleString("en-US", {timeZone: "Asia/Seoul"})); //explorer 미지원
		return new Date(utc + (3600000*offset));
    },

  //Setting Timezone time -> Browser Timezone time (UTC)
    getUtcDate : function(value){
    	var offset = Number(_timeZoneOffset); //Asia/Seoul : 9
		var date, utc;

		date = org.x2framework.common.Util.getDateObject(value, 'local');
		utc = date.getTime() - (3600000*offset);
		return new Date(utc - (date.getTimezoneOffset() * 60000));
    },

    //String (format: '2019-12-05 09:26:00') -> browser timezone Date Object (Thu Dec 5 2019 09:26:00 GMT+0900 (한국 표준시))
    //new Date(String)이 browser버젼 영향을 받기 때문에 안전한방식으로 처리하기 위함
    getDateObject : function(str, utcYn){
    	if(!str)
    		return new Date();
    	if(typeof(str) !== 'string' || str.length < 10)
    		return new Date(str);
    	var nYear, nMonth, nDay, nHour=0, nMinute=0, nSec=0;
    	nYear = Number(str.substr(0,4));
    	nMonth = Number(str.substr(5, 2)) - 1; //0~11
    	nDay = Number(str.substr(8, 2));
   		nHour = Number(str.substr(11, 2));
		if(str.length > 13) {
			nMinute = Number(str.substr(14, 2));
			if(str.length > 16) {
				nSec = Number(str.substr(17, 2));
			}
		}
		if(utcYn === 'utc')
			return new Date(Date.UTC(nYear, nMonth, nDay, nHour, nMinute, nSec, 0));
		else
			return new Date(nYear, nMonth, nDay, nHour, nMinute, nSec, 0);
    },

    getOssImgUrlFileFullPath : function(uploadPath, filePath) {
    	var replactStr = _fileuploadUrl;
    	uploadPath = uploadPath.replace(replactStr, '');

    	return uploadPath + filePath;
    },

    YMDFormatter : function(num) {

        if(!num) return "";
        var formatNum = '';
        // 공백제거
        num=num.replace(/\s/gi, "");
        try{
             if(num.length == 8) {
                  formatNum = num.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
             }
        } catch(e) {
             formatNum = num;
//             console.log(e);
        }
        return formatNum;
   },
   
   HPFormatter : function(num) {

       if(!num) return "";
       var formatNum = '';
       // 공백제거
       num=num.replace(/\s/gi, "");
       try{
            if(num.length == 11) {
                 formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            } else {
            	formatNum =num;
            }
       } catch(e) {
            formatNum = num;
//            console.log(e);
       }
       return formatNum;
  }


};
