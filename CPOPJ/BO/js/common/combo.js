function subOptionFiltering(selectTagId, subSelectTagId, filterDataName) {
	var dataName = $('#' + selectTagId + ' option:selected').attr(filterDataName);
	
	$('#' + subSelectTagId + ' option').hide();
	var defaultOption = $('#' + subSelectTagId + ' option[' + filterDataName + '=All]');
	var filteringOption = $('#' + subSelectTagId + ' option[' + filterDataName + '=' + dataName + ']');
	$('#' + subSelectTagId).val(defaultOption.eq(0).val());
	defaultOption.show();
	filteringOption.show();
}