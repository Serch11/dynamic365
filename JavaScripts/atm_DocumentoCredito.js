if (typeof VENTAS === "undefined") {
    VENTAS = {};
    VENTAS.JS = {};
}

if (typeof VENTAS.JS === "undefined") {
    VENTAS.JS = {};
}

VENTAS.JS.DocumentoCredito = {}

VENTAS.JS.DocumentoCredito.CrearId = async function (executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();
    let atm_solicitudcreditoid = formContext.getAttribute("atm_solicitudcreditoid").getValue();
    let atm_tipodocumentoid = formContext.getAttribute("atm_tipodocumentoid").getValue();

    if (atm_solicitudcreditoid && atm_tipodocumentoid) {
        let atm_tipodocumento = await Xrm.WebApi.retrieveRecord("atm_tipodocumento", atm_tipodocumentoid[0].id, "?$select=atm_codigo");
        formContext.getAttribute("atm_nombre").setValue(atm_solicitudcreditoid[0].name + "_" + atm_tipodocumento.atm_codigo);
    } else {
        formContext.getAttribute("atm_nombre").setValue("");
    }
}

VENTAS.JS.DocumentoCredito.AprobarSolicitud = async function (executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();
    let atm_solicitudcreditoid = formContext.getAttribute("atm_solicitudcreditoid").getValue();

    var userSettings = Xrm.Utility.getGlobalContext().userSettings;

    let atm_solicitudcredito = await Xrm.WebApi.retrieveRecord("atm_solicitudcredito", atm_solicitudcreditoid[0].id, "?$select=_atm_revisordocumentosid_value");

    formContext.ui.clearFormNotification("ERRORUSUARIO");

    let hasRole = false;
    userSettings.roles.forEach(x => {
        if (x.name === "System Administrator" || x.name === "Administrador del sistema") {
            hasRole = true;
        }
    });

    if (hasRole) {
        return;
    }
    else if (atm_solicitudcredito._atm_revisordocumentosid_value.toUpperCase() !== userSettings.userId.replace('{', '').replace('}', '').toUpperCase()) {
        formContext.getAttribute("atm_aprobado").setValue(false);
        formContext.ui.setFormNotification("Si no es el usuario aprobador no puede aprobar este documento de crédito", "ERROR", "ERRORUSUARIO");
    }
}

VENTAS.JS.DocumentoCredito.OcultarDocumentosDocumentoCredito = async function (executionContext) {
    'use strict';
    try {
        let formContext = executionContext.getFormContext();
        let atm_tipodocumentoid = formContext.getAttribute("atm_tipodocumentoid");

        if (formContext.ui.getFormType() === 2) {
            if (atm_tipodocumentoid.getValue()[0].name === "Autorización centrales de riesgo") {
                let res = await VENTAS.JS.Comun.ConsultarExistenciaRol(["Automundial - Director Administrativo", "Automundial - Gerente Administrativo", "Administrador del sistema"]);
                console.log(res);
                if (res) {
                    Xrm.Page.ui.tabs.get("tab_general").sections.get("_section_519").setVisible(true);
                } else {
                    Xrm.Page.ui.tabs.get("tab_general").sections.get("_section_519").setVisible(false);
                }
            }
        }
    } catch (error) {
        await VENTAS.JS.Comun.OpenAlerDialog("Ok", error);
    }
}