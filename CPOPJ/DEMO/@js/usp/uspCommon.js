$.namespace("usp.common");
usp.common = {
	
	init : function(){
		usp.common.showCarLinePlaceHolder();
		//메뉴 호출은 비동기로 처리함.
		setTimeout(function() {
			usp.common.initCtgListAjax();
		}, 300);
		
		usp.common.bindEvent();
		$(window).trigger("hashchange");
	},
	
	bindEvent : function() {
		$(window).on("hashchange", function() {
			var hash = location.hash;
			
			if (hash != "") { 
				//# 제거
				hash = hash.substring(1);
			}
			
			if (hash != "") {
				//상세페이지 정보가 있을 경우
				usp.common.getDetailInfo(hash);
			} else {
				//없을 경우 usp 메인으로 간주함.
				$("section#uspMainSect").fadeIn("slow");
				$("section#uspDetailSect").hide();
				$("section#uspDetailSect").html("");

				usp.common.showPrevNextBtn();
			}
			
			//공유하기 팝업 초기화
			common.sns.init($("title").text(), location.href);
		});
	},
	
	/**
	 * 상단 차량 선택 콤보박스 초기화 처리 및 이벤트 바인딩
	 */
	showCarLinePlaceHolder : function() {
		var carLine = $("#selectedCarLine").val();
		var carLineNm = $("#sources option[data-carline='" + carLine + "']").eq(0).text();
		$("#sources").attr("placeHolder", carLineNm);
		$(".custom-select .custom-select-trigger").text(carLineNm);
	},
	
	/**
	 * 카테고리 목록 로딩 초기화
	 */
	initCtgListAjax : function() {
		var url = _baseUrl + "usp/getUspCatListAjax.do";
		var param ={
				carLine : $("#selectedCarLine").val(),
				curDispCatNo : $("#curDispCatNo").length < 1 ? "" : $("#curDispCatNo").val() 
		};
		
		common.Ajax.sendRequest("GET", url, param, this.initCtgListAjaxCallBack, true, true);
	},
	
	/**
	 * 카테고리 목록 로딩 초기화 콜백
	 */
	initCtgListAjaxCallBack : function(res) {
		$("footer").html(res);
		
		$(".fullDownMenu > ul > li").each(function() {
//			console.log($(this).find("ul li").length);
			var tmpObj = $(this).find("ul li");
			if (tmpObj.length == 1) {
				$(this).find("ul li").hide();
				$(this).children("a").eq(0).attr("data-dispcatno", tmpObj.children("a").eq(0).data("dispcatno"));
				$(this).children("a").eq(0).addClass("detail-link");
				$(this).children("a").eq(0).addClass("no-arrow");
//				console.log(tmpObj.children("a").eq(0).data("dispcatno") + "---" + $(this).children("a").eq(0).data("dispcatno") + "---" + $(this).children("a").eq(0).text());
			}
		});
		
		usp.common.bindCtgListEvent();
		
		//상세인 경우 해당 카테고리 선택 시킴.
		if ($("#uprDispCatNo").length > 0 && $("#curDispCatNo").length > 0) {
			$(".fullDownMenu > ul > li > a[data-dispcatno='" + $("#uprDispCatNo").val() + "']").click();
			$(".fullDownMenu > ul > li > ul > li > a[data-dispcatno='" + $("#curDispCatNo").val() + "']").parent().addClass("on");
		} else {
			//선택된 상세카테고리가 없을 경우 - 첫번째 카테고리 오픈시킴..
			$(".fullDownMenu > ul > li > a").eq(0).click();
		}
	},
	
	bindCtgListEvent : function() {
		
		init_sideMenu();

		$(".custom-options .custom-option").each(function() {
			var carLine = $("#sources").find("option[data-carnm='" + $(this).text() + "']").data("carline");
			
			$(this).bind("click", function() {
				common.link.uspMain(carLine, $("#carLineCatNo").val());
			});
		});

        $("footer .detail-link").bind("click", function() {
//        	location.href = _baseUrl + "usp/getUspDetail.do?dispCatNo=" + $(this).data("dispcatno") + "&carLine=" + $("#selectedCarLine").val() + "&carLineCatNo=" + $("#carLineCatNo").val();
        	location.hash = $(this).data("dispcatno");
        });

        $("span.ui-prevNext .detail-link").bind("click", function() {
//        	location.href = _baseUrl + "usp/getUspDetail.do?dispCatNo=" + $(this).data("dispcatno") + "&carLine=" + $("#selectedCarLine").val() + "&carLineCatNo=" + $("#carLineCatNo").val();
        	location.hash = $(this).data("dispcatno");
        });

        
        //검색버튼 처리
        $(".searchBox .btn-search").bind("click", function() {
        	var searchStr = $(".searchBox > input[type='text']").val();
        	
        	if (searchStr == "") {
        		alert(_msgSearchVaildation);
        	}
        	
        	var uspListObj = $(".fullDownMenu > ul > li > ul > li");
        	var matchObjArr = new Array();
        	
        	var pattern = new RegExp(searchStr.replace(/\[/gi, "\\[").replace(/\(/gi, "\\("), "gi"); 
        	
        	for (i = 0; i < uspListObj.length; i++) {
        		var tmpMatchArr = pattern.test(uspListObj.eq(i).text());
        		
        		if (tmpMatchArr) {
        			var matchStr = uspListObj.eq(i).text().match(pattern)[0];
        			matchStr = uspListObj.eq(i).text().replace(pattern, "<strong>" + matchStr + "</strong>");
        			matchStr = "<a href=\"javascript:;\" class=\"detail-link\" data-dispcatno=\"" + uspListObj.eq(i).find("a").data("dispcatno") + "\">" + matchStr + "</a>"; 
//        			matchObjArr.push(uspListObj.eq(i).html().replace(pattern, "<strong>" + matchStr + "</strong>"));
        			matchObjArr.push(matchStr);
        		}
    		}
        	
    		$("#sideMenu-scroll").hide();
    		$(".sideMenu .searchResult").show();

    		if (matchObjArr.length < 1) {
        		$(".sideMenu .searchResult .noData").show();
        		$(".sideMenu .searchResult .list").hide();
        	} else {
        		$(".sideMenu .searchResult .noData").hide();
        		$(".sideMenu .searchResult .list").html(matchObjArr.join().replace(/,/gi, ""));
        		$(".sideMenu .searchResult .list").show();
        		
        		$(".sideMenu .searchResult .list .detail-link").bind("click", function() {
//                	location.href = _baseUrl + "usp/getUspDetail.do?dispCatNo=" + $(this).data("dispcatno") + "&carLine=" + $("#selectedCarLine").val() + "&carLineCatNo=" + $("#carLineCatNo").val();
                	location.hash = $(this).data("dispcatno");
                });
        	}
        	
        });
        
        $(".sideMenu .searchResult .bottom .btn-close").bind("click", function() {
        	$(".sideMenu .searchResult").hide();
        	$(".sideMenu .searchResult .noData").hide();
        	$(".sideMenu .searchResult .show").hide();
        	$("#sideMenu-scroll").show();
        	$(".searchBox > input[type='text']").val("");
        });
	},
	
	getDetailInfo : function(dispCatNo) {
		var url = _baseUrl + "usp/getUspDetailAjax.do";
		var param = {
				"dispCatNo" : dispCatNo
		};
		
		common.Ajax.sendRequest("GET", url, param, this.getDetailInfoCallback, true, false);
	},
	
	getDetailInfoCallback : function(res) {
		$("section#uspDetailSect").html(res);
		$("section#uspDetailSect").fadeIn("slow");
		$("section#uspMainSect").hide();
		$("html").removeClass("sideMenuOpen");

		usp.common.showPrevNextBtn();

	},
	
	showPrevNextBtn : function() {
		var dispCatNo = location.hash;
		
		if (dispCatNo != "") { 
			//# 제거
			dispCatNo = dispCatNo.substring(1);
		}

		$(".ui-prevNext .btn-prev").hide();
		$(".ui-prevNext .btn-next").hide();
		
		if (dispCatNo == "") {
			return;
		}

		var prev = null;
		var next = null;
		var curIdx = 0;
		$("#sideMenu-scroll ul li ul li a").each(function(idx) {
			if ($(this).data("dispcatno") == dispCatNo) {
				curIdx = idx;
			}
		});
		
		if (curIdx > 0) {
			prev = $("#sideMenu-scroll ul li ul li a").eq(curIdx - 1).data("dispcatno");
			$(".ui-prevNext .btn-prev.detail-link").data("dispcatno", prev).show();
		} else {
			$(".ui-prevNext .btn-prev.disabled").show();
		}
		
		if (curIdx < ($("#sideMenu-scroll ul li ul li a").length - 1)) {
			next = $("#sideMenu-scroll ul li ul li a").eq(curIdx + 1).data("dispcatno");
			$(".ui-prevNext .btn-next.detail-link").data("dispcatno", next).show();
		} else {
			$(".ui-prevNext .btn-next.disabled").show();
		}
		
	}
	
	
}