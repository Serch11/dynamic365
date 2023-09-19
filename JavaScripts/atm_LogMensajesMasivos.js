if (typeof VENTAS === "undefined") {
    VENTAS = {}
    VENTAS.JS = {}
}

if (typeof VENTAS.JS == "undefined") {
    VENTAS.JS = {};
}
VENTAS.JS.MensajesMasivos = {};

VENTAS.JS.MensajesMasivos.OcultarEntidadesRelacionadas = function (executionContext) {
    "use strict"
    try {
        let formContext = executionContext.getFormContext();
        let atm_leadid = formContext.getControl("atm_leadid");
        let atm_cuentaid = formContext.getControl("atm_cuentaid");
        let atm_contactoid = formContext.getControl("atm_contactoid");

        if (atm_cuentaid.getAttribute().getValue()) {
            atm_leadid.setVisible(false);
            atm_contactoid.setVisible(false);
        }
        if (atm_leadid.getAttribute().getValue()) {
            atm_cuentaid.setVisible(false);
            atm_contactoid.setVisible(false);
        }
        if (atm_contactoid.getAttribute().getValue()) {
            atm_leadid.setVisible(false);
            atm_cuentaid.setVisible(false);
        }
    } catch (error) {
        Xrm.Navigation.openAlertDialog({ confirmButtonLabel: "Ok", text: error.message }, { height: 250, width: 550 });
    }
}