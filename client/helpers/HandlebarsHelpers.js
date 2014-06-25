// Registrar todos los helpers de Handlebars.

Handlebars.registerHelper('i18ndatetime', function(fecha) {
    return DateTimeHelpers.getI18nDateTime(fecha);
});

Handlebars.registerHelper('i18ndate', function(fecha) {
    return DateTimeHelpers.getI18nDate(fecha);
});

Handlebars.registerHelper('i18ntime', function(fecha) {
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
