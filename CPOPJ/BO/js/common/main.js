$.namespace("commerce.admin.Common");
var _common = {
	cannotAccess : function() {
		alert(x2coMessage.getMessage("adminCommon.alert.error.access.auth"));
	}
};

$.namespace("commerce.admin.Main");
commerce.admin.Main = {
	logout : function() {
            //window.location.replace(_baseUrl + "saml/logout?local=true");
            window.location.replace(_baseUrl + "logout.do");
	},

	toLoginPage : function() {
		window.location.replace(_baseUrl + "loginForm.do");
	},
	changeLocale : function(locale) {
		window.location.replace(_baseUrl + "main/changeLocale.do?_locale="+ locale);
	},
	changeDbLocale : function(locale) {
		window.location.replace(_baseUrl + "main/changeLocale.do?_dblocale="+ locale);
	}
};
jQuery(document).ready(function(){
	//언어 선택에서 중국어, 영어 표기 고정   中文/english
	var sbLangHtml = $("#sbLanguage").html();
	sbLangHtml = sbLangHtml.replace("英语", "english");
	sbLangHtml = sbLangHtml.replace("English", "english");
	sbLangHtml = sbLangHtml.replace("chinese", "中文");
	sbLangHtml = sbLangHtml.replace("Chinese", "中文");
	$("#sbLanguage").html(sbLangHtml);
	
	var dbLangHtml = $("#dbLanguage").html();
	dbLangHtml = dbLangHtml.replace("英语", "english");
	dbLangHtml = dbLangHtml.replace("English", "english");
	dbLangHtml = dbLangHtml.replace("chinese", "中文");
	dbLangHtml = dbLangHtml.replace("Chinese", "中文");
	$("#dbLanguage").html(dbLangHtml);
	
	$("#sbLanguage option").each(function(){
		var _this = $(this);
		if(_this.val() == _currentLocaleLanguage){
			_this.attr("selected", "selected");
		}
	});

	$("#dbLanguage option").each(function(){
		var _this = $(this);
		if(_this.val() == _dbLocaleLanguage){
			_this.attr("selected", "selected");
		}
	});

	$("#sbLanguage").change(function(){
		var selectedCountry = this.value;
		if(selectedCountry != _currentLocaleLanguage){
			commerce.admin.Main.changeLocale(selectedCountry);
		}
	});

	$("#dbLanguage").change(function(){
		var selectedCountry = this.value;
		if(selectedCountry != _dbLocaleLanguage){
			commerce.admin.Main.changeDbLocale(selectedCountry);
		}
	});
	
//	$('#header').unload(function(){
//	    alert("unload");
//	    CTI_ICAgentLogout(); 
//	});
});
