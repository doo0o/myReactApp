$.namespace("commerce.admin.Menu");

commerce.admin.Menu = {
	leftMenuTree : function(srch){
	    var srchYn = srch == '' ? false : true;
		var parameter = "";
		

	bindButtonEvent : function(){
		$('#search_btn').click(function(){
			var srch = $('#srch').val();
			commerce.admin.Menu.leftMenuTree(srch);
		});
		$("#srch").on('keyup', function (e) {
		    if (e.keyCode == 13) {
	            var srch = $('#srch').val();
	            commerce.admin.Menu.leftMenuTree(srch);
		    }
		});
	}
};

jQuery(document).ready(function(){
	//로딩된 후 메뉴 초기화 수행
	commerce.admin.Menu.leftMenuTree('');
	commerce.admin.Menu.bindButtonEvent();
});