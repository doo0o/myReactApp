var depth, code1, code2, murl, subMenuHtml='', title='', cate;

var menu01 = new Array(

//HOME
"0::00::00::Design::00-guide/html_00design.html",
"0::01::00::Form::00-guide/html_01form.html",
"0::02::00::Swiper::00-guide/html_02box.html",
"0::03::00::Tab::00-guide/html_03tab.html",
"0::04::00::Button::00-guide/html_04button.html",
"0::05::00::Layer::00-guide/html_05layer.html",
"0::06::00::ICON::00-guide/html_06icon.html",
"0::07::00::Table::00-guide/html_07table.html",
"0::08::00::Help::00-guide/html_08help.html",
"0::09::00::Unit::00-guide/html_09unit.html",
"0::10::00::BO 표준 가이드::00-guide/admin_10.html",
"0::11::00::BO UI HTML 가이드::00-guide/admin_11html.html"
);


//코드 분리
function div(sub1,sub2)
{
	switch (sub2) {
		case 1: sub2 = sub1.substring(0,sub1.indexOf("::")); break; // 구분자(::) 앞단 추출
		case 2: sub2 = sub1.substring(sub1.indexOf("::")+2); break; // 구분자(::) 뒷단 추출
	}
	return(sub2);
}



// 타이틀
function ttlbar(sub1,sub2) {

	sub1 = parseInt(sub1,10);
	sub2 = parseInt(sub2,10);

	for (i=0; i<menu01.length; i++) {
		code1 = parseInt(div(div(menu01[i],2),1),10);
		code2 = parseInt(div(div(div(menu01[i],2),2),1),10);
		mname = div(div(div(div(menu01[i],2),2),2),1);

		if (code1 == sub1 && code2 == sub2){
			title = mname;
			break;
		}
	}
	document.write( '<h2>' + mname +'</h2>');
}


// 서브메뉴
function navi(sub1,sub2)
{
	var ulst		= '<ul>';
	var ulnd		= '</ul>';
	var list		= '<li>';
	var lind		= '</li>';
	var list_s		= '<li class="current">';
	var menuNum      = 1;

	// html 코드 시작

	document.write('<ul class="util">');
	document.write('<li><a href="@progress_GHQ.html">PC LIST</a></li>');
	document.write('<li><a href="@progress_CPO.html">MC LIST</a></li>');
	document.write('<li><a href="@progress_bo.html">BO LIST</a></li>');
	document.write('<li><a href="index.html">퍼블리싱 개발 가이드</a></li>');
	document.write('<li class="on"><a href="html_00design.html">UI HTML 가이드</a></li>');
	document.write('<li><a href="standard_00.html">퍼블리싱 표준을 알자</a></li>');
	document.write('</ul>');
	

	document.write('<div id="nav">' + ulst);

	for (i=0; i < menu01.length; i++) {

		var depth    = div(menu01[i],1);
		var code1    = div(div(menu01[i],2),1);
		var code2    = div(div(div(menu01[i],2),2),1);
		var mname    = div(div(div(div(menu01[i],2),2),2),1);
		var murl     = div(div(div(div(menu01[i],2),2),2),2);
		var grph     = div(div(menu01[i],2),2);
		var nbsp_str = "";
		
		if (code1 == sub1) { // 해당 대분류만 표시함

			//대메뉴표시
			if (depth == 0) {

				if (code1 == sub1){
					document.write(list_s + '<a href="../'+ murl + '">' + mname + '</a>');	//선택된 대메뉴
				} else {
					document.write(list + '<a href="../'+ murl + '">2' + mname + '</a>');	//대메뉴
				}
			}

			//중메뉴표시
			if (depth == 1)
			{

				if (code2 == sub2) {
					document.write(list_s + '<a href="../'+ murl + '">3' + mname + '</a>' + lind); //선택된 중메뉴
				} else {
					document.write(list + '<a href="../'+ murl + '">4' + mname + '</a>' + lind); //중메뉴표시
				}

				menuNum++;

			}
		} else {

			//대메뉴표시
			if (depth == 0) {

				if (code1 == sub1){
					document.write(list_s + '<a href="../'+ murl + '">5' + mname + '</a>');	//선택된 대메뉴
				} else {
					document.write(list + '<a href="../'+ murl + '">' + mname + '</a>');	//대메뉴
				}
			}

			//중메뉴표시
			if (depth == 1)
			{
				document.write(list + '<a href="../'+ murl + '">7' + mname + '</a>' + lind); //중메뉴표시
				menuNum++;

			}
		}

		//레이아웃요소 표시
		if (depth == 9) {
			switch (grph) {
				case '1': document.write(ulst); break;
				case '2': document.write(ulnd); break;
			}
		}
	}
	document.write(ulnd + '</div>');

}

// 히스토리
function hbar(sub1,sub2)
{

	var menu_in         = '&nbsp;&gt;&nbsp;';
	var menuNum      = 1;

	// html 코드 시작
		document.write('<div class="history">');
		document.write('<a href="/i00-guide/" target="_top">HOME</a>');

	for (i=0; i < menu01.length; i++) {

		var depth    = div(menu01[i],1);
		var code1    = div(div(menu01[i],2),1);
		var code2    = div(div(div(menu01[i],2),2),1);
		var mname    = div(div(div(div(menu01[i],2),2),2),1);
		var murl     = div(div(div(div(menu01[i],2),2),2),2);
		var grph     = div(div(menu01[i],2),2);
		var nbsp_str = "";

		if (code1 == sub1) { // 해당 대분류만 표시함
			//대메뉴표시
			if (sub1 == 0) {
				document.write('');

				//서브메뉴표시
				if (depth == 1)
				{
					if (code2 == sub2) {
						if (sub2 == "2") {
							document.write(menu_in + '<a href="../'+ murl + '">' + mname + '</a>'); //중메뉴표시
						}
					}
					menuNum++;
				}
			}
			else{

				//대메뉴표시
				if (depth == 0) {
					document.write(menu_in + '<a href="../' + murl + '">' + mname + '</a>');
				}

				//서브메뉴표시
				if (depth == 1)
				{
					if (code2 == sub2) {
						document.write(menu_in + '<a href="../'+ murl + '">' + mname + '</a>'); //중메뉴표시
					}
					menuNum++;
				}
			}
		}
	}
	document.write('</div>');
}