// Registrar todos los helpers de Handlebars.

UI.registerHelper('i18ndatetime', function(fecha) {
    return DateTimeHelpers.getI18nDateTime(fecha);
});

UI.registerHelper('i18ndate', function(fecha) {
    return DateTimeHelpers.getI18nDate(fecha);
});

UI.registerHelper('i18ntime', function(fecha) {
    return DateTimeHelpers.getI18nTime(fecha);
});

DateTimeHelpers = {
    getI18nDateTime : function(fecha){
		return fecha.toLocaleString();
	},
	getI18nDate : function(fecha){
		return fecha.toLocaleString().split(" ")[0];
	},
	getI18nTime : function(fecha){
		return fecha.toLocaleString().split(" ")[1].substring(0,5);
	}
}

UI.registerHelper('getI18nDateTime',DateTimeHelpers.getI18nDateTime);
UI.registerHelper('getI18nDate',DateTimeHelpers.getI18nDate);
UI.registerHelper('getI18nTime',DateTimeHelpers.getI18nTime);

UI.registerHelper('getId',function(elem){
    if(elem)
        return elem._id;
    return this._id;
});
