if (typeof VENTAS === "undefined") {
    VENTAS = {};
    VENTAS.JS = {};
}

if (typeof VENTAS.JS === "undefined") {
    VENTAS.JS = {};
}

VENTAS.JS.DocumentoSharePoint = {}

VENTAS.JS.DocumentoSharePoint.OcultarBoton = async function (executionContext) {
    "use strict";

    var formContext = executionContext;
    let retorno = true;
    formContext.ui.clearFormNotification("ERRORUSUARIO");

    if (formContext._entityName === "atm_documentocredito") {
        let atm_solicitudcreditoid = formContext.getAttribute("atm_solicitudcreditoid").getValue();
        let atm_procesosolicitudcredito = await Xrm.WebApi.retrieveMultipleRecords("atm_procesosolicitudcredito", "?$select=_bpf_atm_solicitudcreditoid_value,_activestageid_value&$filter=(_bpf_atm_solicitudcreditoid_value eq " + atm_solicitudcreditoid[0].id.replace("{", "").replace("}", "") + ")&$expand=activestageid");
        if (atm_procesosolicitudcredito.entities.length > 0) {
            switch (atm_procesosolicitudcredito.entities[0].activestageid.stagename) {
                case "Análisis":
                case "Definición De Cupo":
                case "Finalizar":
                    formContext.ui.setFormNotification("No puede agregar documentos si se encuentra en la etapa de " + atm_procesosolicitudcredito.entities[0].activestageid.stagename, "ERROR", "ERRORUSUARIO");
                    retorno = false;
                    break;
                default:
                    retorno = true;
                    break;
            }
        }
    }
    return retorno;
}

