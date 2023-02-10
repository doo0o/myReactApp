
var MSG = {
	//url 에서 parameter 추출
	getParam : function(sname){
		var params = location.search.substr(location.search.indexOf("?") + 1);
		var sval = "";
		params = params.split("&");
		for (var i = 0; i < params.length; i++) {
			temp = params[i].split("=");
			if ([temp[0]] == sname) { sval = temp[1]; }
		}
		return sval;
	},
	text : function(obj, GHQobj){
		var pageMode = MSG.getParam("site");
		var pageTaget = "_blank"
		if (pageMode == "GHQ"){
			document.write(GHQobj);
			console.log(GHQobj);
		} else {
			document.write(obj);
			console.log(obj);
		}
	},
}

$(document).ready(function() {
	var pageMode = MSG.getParam("site");
	var pageTaget = "_blank"
	if (pageMode == "GHQ"){
		$('link' ).each(function() {
			var cHref = $( this ).attr('href');
			cHrefv = cHref.split("../../css/h_")[1];
			var cssLink = "/GHQ/css/g_"+cHrefv;
			$( this ).attr('href', cssLink);
		});
	}
});