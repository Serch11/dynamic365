if (typeof VENTAS === "undefined") {
    VENTAS = {};
    VENTAS.JS = {};
}

if (typeof VENTAS.JS === "undefined") {
    VENTAS.JS = {};
}

VENTAS.JS.LlamadaPlanAccion = {}

VENTAS.JS.LlamadaPlanAccion.CrearNombre = function (executionContext) {
    "use strict";
    try {

        let formContext = executionContext.getFormContext();
        let atm_llamadatelefonicaid = formContext.getAttribute("atm_llamadatelefonicaid");
        let atm_plandeaccionid = formContext.getAttribute("atm_plandeaccionid");
        let atm_name = formContext.getAttribute("atm_name");

        if (atm_llamadatelefonicaid.getValue() && atm_plandeaccionid.getValue()) {
            atm_name.setValue(`${atm_plandeaccionid.getValue()[0].name} - ${atm_llamadatelefonicaid.getValue()[0].name}`.toUpperCase());
        }

    } catch (error) {
        VENTAS.JS.Comun.MostrarNotificacionToast(2, error);
    }
}

VENTAS.JS.LlamadaPlanAccion.CrearFiltroLlamadas = function (executionContext) {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();
        let atm_llamadatelefonicaid = formContext.getControl("atm_llamadatelefonicaid");

        atm_llamadatelefonicaid.addPreSearch(filtroTipoLlamada);

        function filtroTipoLlamada() {
            let filter = '<filter type="or"> <condition attribute="atm_tipollamadacode" operator="eq" value="963540010" /> <condition attribute="atm_tipollamadacode" operator="eq" value="963540005" /></filter>';
            atm_llamadatelefonicaid.addCustomFilter(filter);
        }
    } catch (error) {
        VENTAS.JS.Comun.MostrarNotificacionToast(2, error)
    }
}

VENTAS.JS.LlamadaPlanAccion.AbrirFormRapidoLlamadaPlanAccion = function (executionContext) {
    "use strict";
    try {

        let entityFormOptions = {
            entityName: 'atm_llamadasplanaccion',
            useQuickCreateForm: true
        };
        let formParameters = {}

        formParameters["atm_llamadatelefonicaid"] = executionContext.data.entity.getId() // ID of the user.
        formParameters["atm_llamadatelefonicaidname"] = executionContext.getAttribute("subject").getValue() // Name of the user.
        formParameters["atm_llamadatelefonicaidype"] = executionContext.data.entity.getEntityName(); // Table name.

        Xrm.Navigation.openForm(entityFormOptions, formParameters).then(
            function (result) {
                // perform operations if record is saved in the quick create form

            },
            function (error) {

                // handle error conditions
            }
        );
    } catch (error) {

    }
}

VENTAS.JS.LlamadaPlanAccion.VisualizarCreacionLlamadaPlanAccion = function (executionContext) {
    "use strict";
    try {

        let exitoso = false;
        let tipollamadacode = executionContext.getAttribute("atm_tipollamadacode").getValue();

        if ((tipollamadacode === 963540010 || tipollamadacode === 963540005)) {
            exitoso = true;
        }
        return exitoso;
    } catch (error) {

    }
}