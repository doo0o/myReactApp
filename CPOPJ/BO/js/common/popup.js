/**
 *  공통 팝업
 */
var _fullWidth = (screen.width - 20);  //팝업 사이즈 모니터 해상도 맞춤
var _fullHeight = (screen.height - 100);  //팝업 사이즈 모니터 해상도 맞춤
(function(window){

	//5.openwin
	/**
	 * pin:{
	 *		url:string,
	 *		winname:string,
	 *		title:string,
	 *		_title:string,	팝업브라우저의 타이틀 변경시
	 *		params:map,
	 *		autoresize:boolean
	 * }
	 *
	 * parameter를 배열 형식으로 넘기면 갯수에 맞게 처리됨 (ex) params:{..., name:[a:'name', b:'name', c:'name'], ...}  name=a&name=b&name=c
	 * type -> deprecated type을 사용하지 않습니다. width와 height는 직접 셋팅하셔야 합니다. s->small(350*400), m->middle(550*400), l->large(750*400) height는 변동가능
	 */
	popup = function(pin) {
		var defaultProps = {
			winname:"",
			title:"",
			_title:"",
			params:{},
			scrollbars:false,
			resizable:true,
			action:false
		};


		if (!pin.width) {
			switch (pin.type) {
				case "s":
					pin.width = "390px";
					break;
				case "sl":
					pin.width = "440px";
					break;
				case "m":
					pin.width = "590px";
					break;
				case "l":
					pin.width = "790px";
					break;
				case "xl":
					pin.width = "840px";
					break;
				case "xml":
					pin.width = "940px";
					break;
				case "xxl":
					pin.width = "100%";
					break;
			}
		}
		if ( !pin.height ) {
			pin.height = "400";
		}

		pin = $.extend(defaultProps, pin||{});

		//[2011.04.25 송효현] params에 type 속성 추가
		if (pin.params && pin.type) {
			pin.params.type = pin.type;
		}

		var form = $();
		var params = "";

		var openUrl = "";
		//post방식
		if( pin.action ){
			form = $('<form></form>').attr('id','popupAction').attr('method', 'post').css('display','none').attr('target', pin.winname).attr('action', pin.url);
			$.each(pin.params, function(name, value){
				var element = $('<input></input>').attr('name', name).attr('value', value);
				form.append(element);
			});
			var element = $('<input></input>').attr('name', '_title').attr('value', pin._title);
			form.append(element);
			$('body').append(form);
		} else {	//get방식
			$.each(pin.params, function(name, value){
				if ($.isArray(value)) {
					$.each(value, function(index, value){
						params += ("&" + name + "=" + encodeURI(value));
					});
				} else {
					params += ("&" + name + "=" + encodeURI(value));
				}
			});

			//최병언 추가
			// 택배사 추적 같은 경우 풀 url 주소로 넘어 오기 때문에 & 처리로 하기 위함.
			if (pin.dlvp_yn){
				openUrl = "http://"+ pin.url.replace("http://", "");
			}else{
				if(!(pin.action) && '' != pin.url){
					openUrl = pin.url;
					if (pin.url.indexOf('?') >= 0) {
						openUrl = openUrl + "&title=" + encodeURI(pin.title) + "&type=" + pin.type + ( pin.action ? '' : params );
					} else {
						openUrl = openUrl + "?title=" + encodeURI(pin.title) + "&type=" + pin.type + ( pin.action ? '' : params );
					}
				}
			}
		}

		var _left = (screen.width)/2 - (pin.width+"").replace(/px/, '')/2 ;
		var _top = (screen.height)/2 - (pin.height+"").replace(/px/, '')/2;

		if(!(pin.action) && '' != pin.url && '' != pin._title ){
			openUrl += "&_title=" + encodeURI(pin._title);
		}
		var winName = (typeof pin.winname == "string" ? pin.winname : "winPopup");
		winName = winName.replaceAll(" ", "");
		var win = window.open(
			openUrl,
			winName,
			"menubar=no, left="+_left+", top="+_top+", scrollbars=" + (pin.scrollbars ? "yes" : "no") + ", resizable=" + (pin.resizable ? "yes" : "no") + ", toolbar=0,location=0, directories=0, status=0, menubar=0, width=" + pin.width + ", height=" + pin.height
		);

		//post일때 submit
		if(pin.action){
			form.submit();
		}

		//포커스
		if(win != undefined && win != null ){
			win.focus();
		}
		return win;
	};

	/**
	 * 작성자 : 임삼규
	 * 개  요 : 팝업 샘플
	 * 사용예 : popSample({"faqId"			: "123456789"});
	 * @param faqId	  : faq 번호
	 */
	 popSample = function(pin) {
		popup({url:"/handler/sample/Sample-Popup"
		       , winname:"samplePopup"
		       , title:x2coMessage.getMessage("adminCommon.popup.label.sample") //샘플팝업
		       , _title:x2coMessage.getMessage("adminCommon.popup.label.sample") //샘플팝업
		       , width:"800"
			   , height:"600"
			   , params:pin
			   , scrollbars:true
			   , autoresize:true
		});
	};
	/**
	 * 작성자 : 임삼규
	 * 개  요 : 팝업 공통
	 * 사용예 : popCommon({"faqId"			: "123456789"},{url:"aa",title:"",......});
	 * @param faqId	  : faq 번호
	 */
	popCommon = function(pin,POP_DATA,popupCallBack) {
		if(POP_DATA.resizable==null){
			POP_DATA.resizable = true;
		}

		var win = popup({url:POP_DATA.url
		       , winname:POP_DATA.winname
		       , title:POP_DATA.title
		       , _title:POP_DATA._title
		       , width:POP_DATA.width
			   , height:POP_DATA.height
			   , params:pin
			   , scrollbars:POP_DATA.scrollbars
			   , autoresize:POP_DATA.autoresize
			   , resizable:POP_DATA.resizable
		});

		if(popupCallBack != null) {
			setTimeout(function() {
				win.popupCallBack = popupCallBack;
			}, 200);
		}

		return win;
	};

	/**
	 * 작성자 : 김동률
	 * 개  요 : 협력업체현황
	 * 사용예 : popVendorSearch(entr_no, entr_nm, cb);
	 * @param no	  : 협력업체번호
	 * @param nm	  : 협력업체명
	 */
	popVendorSearch = function(no, nm, cb, menuid) {
        var pin = {entr_no:no, entr_nm:nm, callback_fn:cb};
        var POP_DATA = {
                url:"/handler/popup/vendor/PopupVendor-VendorSearch?scrId=" + menuid
                ,winname:"VendorPopup"
                ,title:x2coMessage.getMessage("adminCommon.popup.label.search.company") //업체검색
                ,_title:x2coMessage.getMessage("adminCommon.popup.label.search.company") //업체검색
                ,width:"800"
         		,height:"600"
                ,scrollbars:false
                ,autoresize:false
        };
        popCommon(pin, POP_DATA);
	};

	/**
	 * 작성자 : 김동률
	 * 개  요 : 점포현황
	 * 사용예 : popStoreSearch(str_no, str_nm, cb);
	 * @param no	  : 점포번호
	 * @param nm	  : 점포명
	 */
	popStoreSearch = function(no, nm, cb, menuid) {
        var pin = {str_no:no, str_nm:nm, callback_fn:cb};
        var POP_DATA = {
                url:"/handler/popup/vendor/PopupVendor-StoreSearch?scrId=" + menuid
                    ,winname:"StorePopup"
                    ,title:x2coMessage.getMessage("adminCommon.popup.label.search.store") //점포검색
                    ,_title:x2coMessage.getMessage("adminCommon.popup.label.search.store") //점포검색
                    ,width:"800"
                    ,height:"600"
                    ,scrollbars:false
                    ,autoresize:false
        };
        popCommon(pin, POP_DATA);
	};

	/**
	 * 작성자 : 김동률
	 * 개  요 : 상품검색
	 * 사용예 : popGoodsSearch(goods_no, goods_nm, cb);
	 * @param no	  : 상품번호
	 * @param nm	  : 상품명
	 */
	popGoodsSearch = function(no, nm, cb, menuid) {
        var pin = {goods_no:no, goods_nm:nm, callback_fn:cb};
        var POP_DATA = {
                url:"/handler/popup/goods/PopupGoods-GetGoodListPop?scrId=" + menuid
                    ,winname:"GoodsPopup"
                    ,title:x2coMessage.getMessage("adminCommon.popup.label.search.goods") //상품검색
                    ,_title:x2coMessage.getMessage("adminCommon.popup.label.search.goods") //상품검색
                    ,width:"800"
                    ,height:"600"
                    ,scrollbars:true
                    ,autoresize:true
        };
        popCommon(pin, POP_DATA);
	};

	/**
	 * 작성자 : 김동률
	 * 개  요 : 회원정보
	 * 사용예 : popMemberSearch(goods_no, goods_nm, cb);
	 * @param no	  : 회원번호
	 * @param nm	  : 회원명
	 */
	popMemberSearch = function(no, nm, cb, menuid) {
        var pin = {goods_no:no, goods_nm:nm, callback_fn:cb};
        var POP_DATA = {
                url:"/handler/popup/customer/Popup-UserSearch?scrId=" + menuid
                    ,winname:"GoodsPopup"
                    ,title:x2coMessage.getMessage("adminCommon.popup.label.member.info") //회원정보
                    ,_title:x2coMessage.getMessage("adminCommon.popup.label.member.info") //회원정보
                    ,width:"800"
                    ,height:"600"
                    ,scrollbars:true
                    ,autoresize:true
        };
        popCommon(pin, POP_DATA);
	};

	/**
	 * 작성자 	: 이승용
	 * 개  요 	: 상품미리보기
	 * 사용예 	: popGoodsPreview(goods_no);
	 * @param no: 상품번호
	 */
	popGoodsPreview = function(no) {
		if (typeof _frontUrl == "string" && _frontUrl != "" && _frontUrl != " ") {
			if (typeof no == "string" && no != "") {
		        var pin		= {goodsNo:no, dispCatNo:""};
				var POP_DATA= {
						url: _frontUrl + "shopping/product/USHPFO0646M2.jsp"
						,winname:x2coMessage.getMessage("adminCommon.popup.label.goods.info") //상품정보
						,title:x2coMessage.getMessage("adminCommon.popup.label.goodspreview") //상품미리보기
						,width:1300
						,height:900
						,scrollbars:true
						,autoresize:true
				};
				popCommon(pin,POP_DATA);
			}
			else {
				showMessage(x2coMessage.getMessage("adminCommon.popup.alert.goods.no"));//상품 번호가 없습니다.
			}
		}
		else {
			showMessage(x2coMessage.getMessage("adminCommon.popup.alert.preview"));//미리보기를 사용할 수 없습니다.
		}
	};

	/**
	 * 작성자 	: 이승용
	 * 개  요 	: 이미지미리보기
	 * 사용예 	: popImagePreview(ㅔㅑㅜ);
	 * @param no: 상품번호
	 */
	popImagePreview = function(pin) {
		if (pin && pin.s && pin.s != '') {
			var s = pin.s,
				w = isFinite(pin.w) ? parseInt(pin.w, 10) : 640,
				h = isFinite(pin.h) ? parseInt(pin.h, 10) : 480,
				o = 'menubar=no,scrollbars=yes,resizable=yes,status=no';

				w = ((w > 1024) ? 1024 : w);
				h = ((h > 768) ? 768 : h);
			var imgWin = window.open('about:blank', 'imgPreView', o+',width:'+w+',height:'+h+'');
			window.setTimeout(function() {
				if (imgWin) {
					var html = new StringBuilder();
					html.append('<html>')
						.append('<head><title>Image Preview</title>')
						.append('</head>')
						.append('<body style="padding:0px;margin:0px;" onclick="self.close();">')
						.append('<img src="'+s+'" alt="Image Preview"/>')
						.append('</body></html>');
					imgWin.document.write(html.toString('\n'));
				}
			}, 10);

			return imgWin;
		}
		return null;
	};

	/**
	 * 작성자 : 정영섭
	 * 개   요 : GOS2019이미지미리보기
	 * 사용예 :  <a href="javascript:popDispImgPrev(this, 'displayImageUploadDir');"><img id="fileImg" src="http://.." /></a>
	 *        js에서:   popDispImgPrev(null, "fileUploadDir", imgPath, "salesModelTrimConfGrid.eventhandler.imgUploadCallback");
	 */
	popDispImgPrev = function(obj, fileDirectory, imgPath, cb) {
		var imgUrl = "";
		if(fileDirectory === "fileUploadDir") {
			imgUrl = _fileuploadUrl; //env.jsp에서 정의
		} else if(fileDirectory === "displayImageUploadDir") {
			imgUrl = _displayImageUploadUrl;
		} else if(fileDirectory === "productUploadDir") {
			imgUrl = _productUploadUrl;
		} else {
			console.log("not found fileDirectory");
			fileDirectory = "fileUploadDir";
			imgUrl = _fileuploadUrl;
		}

		if(imgPath === undefined || imgPath === null) {
			var fullImgUrl = $(obj).find("img").attr("src");
			if(obj !== undefined && obj !== null) {
				var pos = fullImgUrl.indexOf(imgUrl);
				if(pos > -1) {
					imgPath = fullImgUrl.substring(imgUrl.length, fullImgUrl.length+1);
				} else {
					imgPath = "";
				}
			} else {
				imgPath = "";
			}
		}

		var pin = {
			fileuploadUrl: imgUrl,
			fileDirectory: fileDirectory,
			imgFileName: imgPath,
			altMsgYn: 'N', //향후 필요할때 사용
			callback_fn: cb
		};
		var POP_DATA = {
			url: _baseUrl + "display/display.imgPrevPop.do",
            winname:"Image Preview",
            title : "Image Preview",
            _title : "Image Preview",
            width:600,
            height:600,
            scrollbars:true,
            autoresize:true
        };
        popCommon(pin,POP_DATA);
	}

	/**
	 * 주문관리 공통팝업
	 * 
	 */
	popContractList = function(popupCallBack) {

		var win = popup({
			url			: "contract/contract.ContractListPopup.do"
			, winname	: "주문관리"
			, title		: "주문관리"
			, _title	: "주문관리"
			, width		: 1280
			, height	: 720
//			, params	: pin
			, scrollbars:false
			, autoresize:true
			, resizable	:true
		});

		if(popupCallBack != null) {
			setTimeout(function() {
				win.popupCallBack = popupCallBack;
			}, 200);
		}

		return win;
	};
	
	/*
	 * CUD 팝업 공통 confirm
	 */
	closePop = function(confirmYn) {
		if(confirmYn === undefined || confirmYn === null || confirmYn !== 'N') {
		    var _closeMessage = x2coMessage.getMessage("adminCommon.popupClose");
		    if(!confirm(_closeMessage) ) { return false; }
		}
	    window.close();
	    //크롬에서 안닫히는 경우가 있어서 아래 코드 추가
	    self.opener = self;
	    window.close();
	    return true;
	};
})(window);