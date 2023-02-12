/*
 * Name: X2CO Back Office
 * PART: jquery & javascript UI
 * Version: 1.0
 * Author : [Luffy]
 */
	var favMenuIdx;
	var maxTabNum = 10;
	var curTabSum = 1;
	//우측부터 문자열추출
	function cutstr_right(str, n){
		if (n <= 0)
			return "";
		else if (n > String(str).length)
			return str;
		else {
			var iLen = String(str).length;
			return String(str).substring(iLen, iLen - n);
		}
	}
	//End 우측부터 문자열추출

	function leftMenuLoad(srchYn){
		if(!srchYn){
		    //tab action
	        var tabAddStr = "<a href='javascript:;' class='tab-close'><img src='"+_imgUrl+"layout/mdi_btn_close.gif' alt='"+x2coMessage.getMessage("adminCommon.label.tab.close")+"' \/><\/a>";
	        var remove = "<a href='javascript:;' class='tab-close'><img src='"+_imgUrl+"layout/mdi_btn_close.gif' alt='"+x2coMessage.getMessage("adminCommon.label.tab.close")+"' \/><\/a>";
	        //탭은 생성시키지 않고 SHOW & HIDE로 처리한다.

	        if($('#csYN').val() == 'Y'){
	            $("#section_tabs").html("<span class='tab activeTab' id='s-tab-01'><code>"+x2coMessage.getMessage("adminCommon.label.customer.list")+"<\/code>" + tabAddStr + "<\/span>");
	            $("#section_tabs").html($("#section_tabs").html() + "<span class='tab activeTab  tab-disable' id='s-tab-02'><code>"+x2coMessage.getMessage("adminCommon.label.counsel.list")+"<\/code>" + tabAddStr + "<\/span>");
	        } else{
	            $("#section_tabs").html("<span class='tab activeTab' id='s-tab-01'><code>"+x2coMessage.getMessage("adminCommon.label.main")+"<\/code>" + tabAddStr + "<\/span>");
	            $("#section_tabs").html($("#section_tabs").html() + "<span class='tab' id='s-tab-02'><code>"+x2coMessage.getMessage("adminCommon.label.tab.02")+"<\/code>" + tabAddStr + "<\/span>");
	        }

	        $("#section_tabs").html($("#section_tabs").html() + "<span class='tab' id='s-tab-03'><code>"+x2coMessage.getMessage("adminCommon.label.tab.03")+"<\/code>" + tabAddStr + "<\/span>");
	        $("#section_tabs").html($("#section_tabs").html() + "<span class='tab' id='s-tab-04'><code>"+x2coMessage.getMessage("adminCommon.label.tab.04")+"<\/code>" + tabAddStr + "<\/span>");
	        $("#section_tabs").html($("#section_tabs").html() + "<span class='tab' id='s-tab-05'><code>"+x2coMessage.getMessage("adminCommon.label.tab.05")+"<\/code>" + tabAddStr + "<\/span>");
	        $("#section_tabs").html($("#section_tabs").html() + "<span class='tab' id='s-tab-06'><code>"+x2coMessage.getMessage("adminCommon.label.tab.06")+"<\/code>" + tabAddStr + "<\/span>");
	        $("#section_tabs").html($("#section_tabs").html() + "<span class='tab' id='s-tab-07'><code>"+x2coMessage.getMessage("adminCommon.label.tab.07")+"<\/code>" + tabAddStr + "<\/span>");
	        $("#section_tabs").html($("#section_tabs").html() + "<span class='tab' id='s-tab-08'><code>"+x2coMessage.getMessage("adminCommon.label.tab.08")+"<\/code>" + tabAddStr + "<\/span>");
            $("#section_tabs").html($("#section_tabs").html() + "<span class='tab' id='s-tab-09'><code>"+x2coMessage.getMessage("adminCommon.label.tab.09")+"<\/code>" + tabAddStr + "<\/span>");
            $("#section_tabs").html($("#section_tabs").html() + "<span class='tab' id='s-tab-10'><code>"+x2coMessage.getMessage("adminCommon.label.tab.10")+"<\/code>" + tabAddStr + "<\/span>");
	        $("#section_tabs span:not(.activeTab)").hide();
		}
		
		$("#footer").html($("#footer").html() + '<div id="remove_all" class="btn_black remove_all" align="right">모두 닫기</div>');
		
		// Show menu when a list item is clicked
		$("#embeded-menu").contents().find('#tree li').contextMenu({ //iframe 에서 사용
			menu: 'popTreeMenu'
		}, function(action, el, pos) {
				var cHref = $(el).find('span > a').attr('data-href');
				var favscrid = $(el).find('span > a').attr('favscrid');
				var getTabId = $("#section_tabs span:hidden:eq(0)").attr("id");//숨은 탭중 첫번째 탭
				var usingNum = cutstr_right(getTabId,2);
				if(action == "bookmark"){
				    var scrId = favscrid;
                    favMenuIdx = "1";

                    var resultMap = 'Y';
                    $('#gnb_favorites_id span').each(function(index){
                        if( $(this).attr("favScrId") == scrId ){
                            alert(x2coMessage.getMessage("system.msg.bookmark.already.exist"));
                            resultMap = 'N';
                        }
                    });
                    if(resultMap == 'N') return;
                    
                    // 즐겨찾기 개수가 10개 이상인지 체크
                    var parameter2 = {};
                    parameter2.usrId     = _userId;
                    parameter2.sysRegrId = _userId;
                    commerce.admin.common.Ajax.sendJSONRequest(
                            "GET",
                            _baseUrl+"main/getChkBookMarkCnt.do",
                            parameter2,
                            function(res){
                                var obj = $.parseJSON(res);
                                if (obj.resultType == "Y") {
                                	alert(x2coMessage.getMessage("system.msg.bookmark.input.max10"));
                                    resultMap = 'N';
                                }
                            }
                            , false
                        );
                    if(resultMap == 'N') return;
                    

                    // useYn이 N인거 체크(데이터 자체가 존재하는...)
                    var parameter1 = {};
                    parameter1.usrId     = _userId;
                    parameter1.rtTgtSeq  = scrId
                    parameter1.sysRegrId = _userId;
                    parameter1.useYn = "N";

                    commerce.admin.common.Ajax.sendJSONRequest(
                            "GET",
                            _baseUrl+"main/getChkDupBookMark.do",
                            parameter1,
                            function(res){
                                var obj = $.parseJSON(res);
                                if (obj.resultType == "Y") {
                                	alert(x2coMessage.getMessage("system.msg.bookmark.already.exist"));
                                    resultMap = 'N';
                                }
                            }
                            , false
                        );

                    if(resultMap == 'N') return;

					var parameter = {};
					parameter.usrId     = _userId;
					parameter.rtTgtSeq  = scrId
					parameter.sortRnk   = favMenuIdx;
					parameter.sysRegrId = _userId;

					commerce.admin.common.Ajax.sendJSONRequest(
						"GET",
						_baseUrl+"main/addBookMark.do",
						parameter,
						function(res){
							favMenuLoad();
//							$("#header").css("overflow","hidden");
							$(".fav_menubox").hide();
						}
					);
				}else if(action == "new"){
					window.open(cHref , "" , "width=1080,height=768,resizable=yes,scrollbars=yes,left=10,top=10");
				}
		});
		//Left Menu Click 시 탭에 링크 걸기
		$("#embeded-menu").contents().find('#tree li a').click(function(){
	        var linkUrl = $(this).attr("data-href");
	        var favscrId = $(this).attr('favscrid');
	        var menuName = $(this).text();
	        openTabLink(linkUrl, favscrId, menuName)
		});
		//End $("#tree li a").click

		//메인페이지 TAB iframe
		$("#section_tabs .tab").click(function(){
			var tabidNo = $(this).attr('id').substring(6);
			var $tabSpan = $("#section_tabs span");
			$(".ifrm_set div:not(#wrap-con-" + tabidNo + ")").hide();
			$("#wrap-con-" + tabidNo).show();
			$(this).removeClass("tab-disable");
			$tabSpan.not(this).addClass("tab-disable");
			
			//안보이는 tab의 tuigrid resize.
			$("#embeded-content-"+tabidNo).contents().find(".tui-grid-rside-area").each(function() {
				if($(this).width() > 100)
					return true;
				if($(this).parent().width() < 1)
					return true;
				var toWidth = $(this).parent().width() - 52;
				if($(this).parent().find(".tui-grid-lside-area").width() < 1) {
					toWidth = $(this).parent().width();
				}
				$(this).width(toWidth+"px");
			});
			//iframe안에 전시컨텐츠관리 iframe이 존재할 경우
			$("#embeded-content-"+tabidNo).contents().find(".embeded-frame").contents().find(".tui-grid-rside-area").each(function() {
				if($(this).width() > 100)
					return true;
				if($(this).parent().width() < 1)
					return true;
				var toWidth = $(this).parent().width() - 52;
				if($(this).parent().find(".tui-grid-lside-area").width() < 1) {
					toWidth = $(this).parent().width();
				}
				$(this).width(toWidth+"px");
			});
		});

		//메인페이지 TAB iframe 탭닫기
		$("#section_tabs .tab-close").click(function(e){
			var sTabId = cutstr_right($(this).parent().attr('id'),2);
            var sameId= $("#wrap-con-"+ sTabId).attr('id');
			var sameClass= $("#wrap-con-"+ sTabId).attr('class');
			//console.log(sameId, sameClass)
			$("#"+sameId +"").removeClass(""+sameClass+"");
			var h;
			var ob;
			// s: 20120222 수정
			e.stopPropagation();
			// s: 20120222 수정
			// 적어도  탭 1개는 남긴다.
			if($("#section_tabs span.tab:visible").length == 1){
				return false;
			}
			//탭 삭제후 리셋
			ob = $(this).parent().detach();
			ob.appendTo("#section_tabs");
			$(this).parent().removeClass('tab-disable');
			$(this).parent().hide();
			//hide & 가장 마지막 화면 show
			$(".ifrm_set div#wrap-con-" + sTabId).hide();//아이프레임 감싸는 div Hide
			$("#embeded-content-" + sTabId).attr('src','');//아이프레임 src 삭제
			h = cutstr_right($("#section_tabs span:visible:last").attr('id'),2);
			$(".ifrm_set div#wrap-con-" + h).show();
			$("#section_tabs span:visible").addClass('tab-disable');
			$("#section_tabs span#s-tab-" + h).removeClass('tab-disable');
			curTabSum--;
		});
        //End 탭닫기
		
		//모든 탭닫기
		$("#footer #remove_all").click(function(e){
			
			//활성화된 페이지를 남길때 사용하는 인덱스
			var activeTab = $('span[class="tab"]').attr('id');
			
			const list = document.querySelectorAll('#section_tabs .tab');
			for (let index = 0; index < list.length; index++) {
			    var sTabId = cutstr_right($(list[index]).attr('id'),2);
	            var sameId= $("#wrap-con-"+ sTabId).attr('id');
				var sameClass= $("#wrap-con-"+ sTabId).attr('class');
				$("#"+sameId +"").removeClass(""+sameClass+"");
				var h;
				var ob;
				
				e.stopPropagation();
				//히스토리탭에서 탭1개를 남기는데 마지막페이지를 남길지, 활성화 페이지를 남길지 선택(택1,2)
				// 마지막에 있는 탭만 남기고 삭제한다.
				if($("#section_tabs span.tab:visible").length == 1){
					return false;
				}
				// 활성화탭만 남기고 삭제한다.
//				if($(list[index]).attr('id') == activeTab) {
//					continue;
//				}
				//탭 삭제후 리셋
				ob = $(list[index]).detach();
				ob.appendTo("#section_tabs");
				$(list[index]).removeClass('tab-disable');
				$(list[index]).hide();
				//hide & 가장 마지막 화면 show
				$(".ifrm_set div#wrap-con-" + sTabId).hide();//아이프레임 감싸는 div Hide
				$("#embeded-content-" + sTabId).attr('src','');//아이프레임 src 삭제
				h = cutstr_right($("#section_tabs span:visible:last").attr('id'),2);
				$(".ifrm_set div#wrap-con-" + h).show();
				$("#section_tabs span:visible").addClass('tab-disable');
				$("#section_tabs span#s-tab-" + h).removeClass('tab-disable');
				curTabSum--;
			}
		});
		//End 모든 탭닫기
	} // end function

	function favMenuSet(){
		// 상단 즐겨찾기 메뉴 이동
		$("#gnb_favorites_id div a").click(function(){
		    var linkUrl = $(this).attr("data-href");
	        var favscrId = $(this).parent().children('span').attr('favscrid');
	        var menuName = $(this).text();
	        openTabLink(linkUrl, favscrId, menuName)
		});

		// 상단 즐겨찾기 메뉴 추가,삭제
		var k = 0;
		$("#gnb_favorites_id div span").click(function(){
			var scrId = $(this).attr("favScrId");
			favMenuIdx = $(this).attr("favMenuIdx");

			if( $(this).attr("favFlag") == 'add'){
				$("#header").css("overflow","visible");
				$(".fav_menubox").show();
			}else if( $(this).attr("favFlag") == 'del'){
				var parameter = {};
                parameter.usrId     = _userId;
                parameter.rtTgtSeq  = scrId

				commerce.admin.common.Ajax.sendJSONRequest(
                    "GET",
                    _baseUrl+"main/delBookMark.do",
                    parameter,
                    function(res){
                        favMenuLoad();
					}
				);
			}
		});
	}

	function favMenuLoad(){
		// 즐겨찾기 메뉴 구성
		commerce.admin.common.Ajax.sendJSONRequest(
			"POST",
			_baseUrl+"main/getBookMarkList.do",
			"usrId=" + _userId,
			function(res){
				if($.trim(res) != '') {
					var menusTop = $.parseJSON(res);
					var menusTopHtml = $("<ul />");
					var menusObj;
					var menuHref;

					$.each(menusTop, function(index, menu){
						menusObj = menu;
						var menuInfo = menusObj.stRtTgtBase;

						menuHref = menuInfo.caloUrl  + '?scrId=' + menuInfo.rtTgtSeq;
						
						var caloUrl = menuInfo.caloUrl;
						if(caloUrl.indexOf("?") >= 0){
							menuHref = menuInfo.caloUrl  + '&scrId=' + menuInfo.rtTgtSeq;
						}
						
			            if(menuInfo.mrkNm > 10){
			            	mrkNmStr = menuInfo.mrkNm.substring(0,10) + "...";
			            }else{
			            	mrkNmStr = menuInfo.mrkNm;
			            }

			            var htmlLi = $('<li></li>');
			            if(index == 0) {
			            	htmlLi.addClass("first");
			            }
			            var	htmlA = $('<a></a>')
			            		.attr("data-href", menuHref)
			            		.text(mrkNmStr);

			            var htmlImg = $('<span class="del"></span>')
			            		.attr("favScrId", menusObj.rtTgtSeq)
			            		.attr("favFlag", "del")
			            		.attr("favMenuIdx", (index + 1));


			            var htmlDiv = $("<div class='fav_del'>")
			            	.append(htmlA)
			            	.append(htmlImg);

			            htmlLi.append(htmlDiv);
			            menusTopHtml.append(htmlLi);

					});

					$('#gnb_favorites_id').empty().append(menusTopHtml);
					favMenuSet();
				}

				// 알리미 카운터 수 추출
				receiveListCount();

                // BO내부직원(UsrSctCd:10)일때 내부공지 카운트 추출
				if ("Y" == _commonAdminYn) {
				    innerBoardCount();
				}
					/*
						// 알리미 링크 값 추출
						var jsonRequestMessage = '{user_id="'+_userId_cookie_+'",_sch_statement="StAdminNtcInfo.ReceiveListMaxLink",_sch_key="list"}';
						commerce.admin.common.Ajax.sendJSONRequest(
							"GET",
							"/common/Common-GetJSONData?_X2_IDENTIFIER_KEY_=_JSON_MESSAGE_&scrId=200949",
							jsonRequestMessage,
							function(res){
								var obj = getJSON(res.responseText);
								var objList = obj.list;

								$("#receiveCountLink").val(objList[0]);
							}
						);
					*/
			}
		);
	}

function receiveListCount(){
	commerce.admin.common.Ajax.sendJSONRequest(
		"POST",
		_baseUrl+"main/getReceiveListCount.do",
		"adreId=" + _userId + "&rcvYn=N&finYn=N",
		function(res){
			 var obj = $.parseJSON(res)
			$("#receiveCount").html(x2coMessage.getMessage("adminCommon.label.alert.task")+' <span>' + obj + '</span>');
			$("#receiveCount").attr("receiveCount", obj);
		}
	);
}

function innerBoardCount(){
    commerce.admin.common.Ajax.sendJSONRequest(
        "GET",
        _baseUrl+"main/getInnerBoardCount.do",
        "",
        function(res){
             var obj = $.parseJSON(res)
             $("#innerCount").html(x2coMessage.getMessage("adminCommon.label.alert.notice")+' <span>' + obj + '</span>');
             $("#innerCount").attr("innerCount", obj);
        }
    );
}

//비밀번호 변경 일자가 180일이 지났는지 체크 후 팝업
/*function modifyPasswordPopup(){
    commerce.admin.common.Ajax.sendJSONRequest(
        "GET",
        _baseUrl+"main/modifyPasswordDateCheck.do",
        "",
        function(res){
             var obj = $.parseJSON(res)
             if(obj.popup == "Y") {
            		var pin = {};
            		var POP_DATA = {
            				url:"/main/modifyPasswordPopup.do"
            	            ,title:""
            	            ,_title:""
            	            ,width:800
            	            ,height:250
            	            ,scrollbars:true
            	            ,autoresize:true
            		}
            		popCommon(pin,POP_DATA);
             }
        }
    );
}*/

$(function(){
	$(document).ready(function() {
		$('#snbToggle').click(function(){
		    $("#snb").toggle();
		    $("#contArea").toggleClass( "marL00" );
		}); // 좌측 메뉴 열렸다 펼치지
		//tree메뉴
		$("#tree").treeview({
			animated: "fast",
			collapsed: true
		});
		favMenuLoad();
		
		//180일 이후 비밀번호 변경팝업
		// modifyPasswordPopup();
		
		//main/menu.js 94라인에 중복으로 로드되어 제거
//		$("#embeded-menu").load(function() {
//			leftMenuLoad(false);
//		});

		// 직원연락처 팝업
		$('#employeePop').click(function(){
			var pin = {};
			var POP_DATA = {
					url:_baseUrl+"main/employeePop.do"
					,winname:"MenuTreePop"
					,title:""
					,_title:""
					,width:730
					,height:400
					,scrollbars:true
					,autoresize:true
			}
			popCommon(pin,POP_DATA);
		});

		// 알리미 팝업
		$('#receiveCount').click(function(){
			var count = $("#receiveCount").attr("receiveCount");

			if(count == 0){
				alert(x2coMessage.getMessage("system.msg.receiveAlert.empty"));
				return;
			}
			var pin = {adreId : _userId, rcvYn : 'N', finYn : 'N', callback_fn : 'receiveListCount'};
			var POP_DATA = {
					url:"main/ReceivePop.do"
					,winname:"MenuTreePop"
					,title:""
					,_title:""
					,width:582
					,height:515
					,scrollbars:true
					,autoresize:true
			}
			popCommon(pin,POP_DATA);
		});

	    // 내부게시판관리 이동
        $('#innerCount').click(function(){
            var count = $("#innerCount").attr("innerCount");
            var linkUrl = "system/receAlerts.innerBoardList.do";
            var favscrId = "200616";
            var menuName = x2coMessage.getMessage("receive.innerBoard.title");

            if(count == 0){
            	alert(x2coMessage.getMessage("system.msg.notice.empty"));
                return;
            }

            //내부게시판관리 화면 이동
            openTabLink(linkUrl, favscrId, menuName)
        });

        // 로그인 접속 이력 팝업 이동
        $('#loginTimeId').click(function(){
            var pin = {rcvYn : 'N', finYn : 'N'};
            var POP_DATA = {
                     url:"main/LoginHistPop.do"
                    ,winname:"LoginHistPop"
                    ,title:""
                    ,_title:""
                    ,width:582
                    ,height:515
                    ,scrollbars:true
                    ,autoresize:true
            }
            popCommon(pin,POP_DATA);
        });

     // 비밀번호 변경 팝업
		$('#passwordChange').click(function(){
			$(".user_layer").addClass('display_none');
			var pin = {};
			var POP_DATA = {
					url:"popup/system/changePasswordPopup.do"
	                ,winname:"changePasswordPopup"
	                ,title:""
	                ,_title:""
	                ,width:482
	                ,height:300
	                ,scrollbars:true
	                ,autoresize:true
			}
			popCommon(pin,POP_DATA);
		});
		
	}); // end ready
});

function openTabLink(linkUrl, favscrId, menuName) {
    var iframeUrl = linkUrl;
    var favscrid = favscrId;
    var spanText = menuName;

    var getTabId = $("#section_tabs span:hidden:eq(0)").attr("id");//숨은 탭중 첫번째 탭
    var usingNum = cutstr_right(getTabId,2);
    console.log(usingNum);
    // 탭이 꽉 찼다면
    if(typeof(getTabId) == "undefined"){
        var tmp_usingNum = (curTabSum + 1) % maxTabNum;
        if(tmp_usingNum == 0) tmp_usingNum = 10;
        tmp_usingNum = tmp_usingNum - 1;
        usingNum = cutstr_right($("#section_tabs span:eq(" + tmp_usingNum + ")").attr('id'),2);
        alert(x2coMessage.getMessage("system.msg.window.max"));
    } else {
    //if 텍스트가 같으면 ....
        if( $(".ifrm_set").children('div.menu-'+ favscrid).length > 0 ){
            var answer = confirm(x2coMessage.getMessage("system.msg.window.exist"))
            if(answer){
                var sameId= $(".menu-"+ favscrid).attr('id');
                var tabidNo = sameId.substring(9);
                $(".ifrm_set div:not(#wrap-con-" + tabidNo + ")").hide();
                $("#wrap-con-" + tabidNo).show();
                $("#section_tabs span:visible:not(#s-tab-" + tabidNo + ")").addClass('tab-disable');
                $("#section_tabs span#s-tab-" + tabidNo).show().removeClass('tab-disable');
            }else{
                //left 메뉴 클릭 시, 새탭으로 열기
                    //iframe을 가진 div show & hide
                    $(".ifrm_set div:not(#wrap-con-" + usingNum + ")").hide();
                    $(".ifrm_set div#wrap-con-" + usingNum + "").show();
                    $("#section_tabs span:visible:not(#s-tab-" + usingNum + ")").addClass('tab-disable');
                    $("#section_tabs span#s-tab-" + usingNum).show().removeClass('tab-disable');
                    $("#embeded-content-" + usingNum).attr('src',iframeUrl);
                    $("#wrap-con-" + usingNum).attr('class', "menu-" + favscrid);
                    $("#section_tabs span#s-tab-" + usingNum + " code").text(spanText);
            }
        } else {
            //iframe을 가진 div show & hide
            $(".ifrm_set div:not(#wrap-con-" + usingNum + ")").hide();
            $(".ifrm_set div#wrap-con-" + usingNum + "").show();
            $("#section_tabs span:visible:not(#s-tab-" + usingNum + ")").addClass('tab-disable');
            $("#section_tabs span#s-tab-" + usingNum).show().removeClass('tab-disable');
            $("#embeded-content-" + usingNum).attr('src',iframeUrl);
            $("#wrap-con-" + usingNum).attr('class', "menu-" + favscrid);
            $("#section_tabs span#s-tab-" + usingNum + " code").text(spanText);
        }
        //End if 텍스트가 같으면
        curTabSum++;
    }// End 탭이 꽉 찼다면
}

function changeTabName(parTabNme,spanText, favscrid){
    var usingNum = cutstr_right(parTabNme,2);
    $("#section_tabs span#s-tab-" + usingNum + " code").text(spanText);
    $("#wrap-con-" + usingNum).attr('class', "menu-" + favscrid);
    //$("#wrap-con-" + usingNum).attr('class', "menu-" + favscrid);
}