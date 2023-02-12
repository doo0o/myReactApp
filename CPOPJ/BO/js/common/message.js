(function(w, $, ns) {
"use strict";

	var msg = function(options) {
		var that = this;
		that.init();
		that.setOption(options);
	};

	$.extend(msg.prototype, {
		constructor: msg,

		init: function(options) {
			var that = this;
		},

		setOption: function(options) {
			var that = this;

			that._options = {
				useCache: true,
				storageNamespace: "commerceMessage"
			};
			that._options = $.extend(that._options, options);
		},

		getLangCd: function() {
			var that = this;

			return _currentLocaleLanguage;
		},

		getStorageKey: function(key) {
			var that = this,
				langCd = that.getLangCd();

			return that._options.storageNamespace+ "_" + langCd + "_" + key;
		},

		setStorage: function(key, value) {
			var that = this;

			key = that.getStorageKey(key);
			w.sessionStorage.setItem(key, value);
		},

		getStorage: function(key) {
			var that = this;

			key = that.getStorageKey(key);
			return w.sessionStorage.getItem(key) || "";
		},

		removeStorage: function(key) {
			var that = this;

			key = that.getStorageKey(key);
			w.sessionStorage.removeItem(key);
		},

		removeAllStorage: function() {
			var that = this,
				storagePrefix = that._options.storageNamespace;

			$.each(w.sessionStorage, function(key, value) {
				if( key.indexOf(storagePrefix) !== -1 ) {
					w.sessionStorage.removeItem(key);
				}
			});
		},

		getMessage: function( msgIds, callBack ) {
			var that = this,
				type = "array",
				langCd = that.getLangCd(),
				retMsg = "",
				useCache = that._options.useCache,
				reqIds = [],
				newMsgObj = {},
				cachedMsgObj = {};

			msgIds = $.isArray(msgIds) ? msgIds : typeof msgIds === "string" ? [msgIds] : typeof msgIds === "object" ? msgIds : ["vehicle.input.sup.prc.zero"];
			callBack = typeof callBack === "function" ? callBack : function() {};
			type = $.isArray(msgIds) ? "array" : "json";

			var getMessageIdToKey = function( id ) {
				var retKey = "";

				$.each(msgIds, function(key, msgid) {
					if( msgid === id ) {
						retKey = key;
						return retKey;
					}
				});

				return retKey;
			};

			$.each(msgIds, function(key, value) {
				var id = this;

				retMsg = "";
				if( useCache ) {
					retMsg = that.getStorage(value);
					if( retMsg ) {
						if(type === "array") {
							cachedMsgObj[value]= retMsg;
						} else {
							cachedMsgObj[key]= retMsg;
						}
						return retMsg;
					}
				}

				if( !useCache || !retMsg ) {
					reqIds.push(value);
				}
			});

			if( reqIds && reqIds.length > 0 ) {
				$.ajaxSettings.traditional = true;
				$.ajax({
					url: _baseUrl + "Admincommon/systemMessage.do",
					method: "POST",
					data: {
						messageID: reqIds,
						langCd: langCd
					},
					// 메시지 요청이 한개 일 경우 동기화하고 한개 초과 일 경우 비동기처리하여 여래개를 가져온다.
					async: false,
					cache: true,
					dataType: "json",
					crossDomain: true,
					beforeSend:commerce.admin.common.Ajax.before
				}).done(function(retData) {
					newMsgObj = {};

					$.each(retData.lists, function() {
						var msgObj = this;
						retMsg = msgObj.text;

						if(type === "array") {
							newMsgObj[msgObj.id] = msgObj.text;
						} else {
							var msgKey = getMessageIdToKey(msgObj.id);
							newMsgObj[msgKey] = retMsg;
						}
						if( useCache ) {
							that.setStorage(msgObj.id, msgObj.text);
						}
					});
					callBack($.extend(cachedMsgObj, newMsgObj));
				});
			}

			if( msgIds.length === 1 ) {
				return retMsg;
			} else {
				return $.extend(cachedMsgObj, newMsgObj);
			}
		}
	});

	$.namespace(ns);
	w[ns] = new msg();
})(window, jQuery, "x2coMessage");
