if (typeof VENTAS === "undefined") {
    VENTAS = {};
    VENTAS.JS = {};
}
if (typeof VENTAS.JS === "undefined") {
    VENTAS.JS = {};
}

const DV = {
    NOMBRE_LOGICO: "atm_descuentovolumenregladescuento",
    CAMPOS: {
        ATM_REGLADESCUENTOID: "atm_regladescuentoid",
        ATM_NAME: "atm_name",
        ATM_MONTO: "atm_monto",
        ATM_PORCENTAJE: "atm_porcentaje",
        ATM_CANTIDADINICIAL: "atm_cantidadinicial",
        ATM_CANTIDADFINAL: "atm_cantidadfinal",
    }
}


VENTAS.JS.DescuentoVolumen = {};


VENTAS.JS.DescuentoVolumen.OnLoad = async function (executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();

    var atm_regladescuentoid = formContext.getAttribute(DV.CAMPOS.ATM_REGLADESCUENTOID).getValue();
    let reglaDescuento = await VENTAS.JS.Comun.ConsultarRegistro(atm_regladescuentoid[0].entityType, atm_regladescuentoid[0].id, "?$select=atm_tipo")
    console.log(reglaDescuento.atm_tipo)
    if (reglaDescuento.atm_tipo) {
        formContext.getControl(DV.CAMPOS.ATM_MONTO).setVisible(true);
        formContext.getAttribute(DV.CAMPOS.ATM_MONTO).setRequiredLevel(REQUIRED_LEVEL.REQUIRED);
        formContext.getControl(DV.CAMPOS.ATM_PORCENTAJE).setVisible(false);
        formContext.getAttribute(DV.CAMPOS.ATM_PORCENTAJE).setRequiredLevel(REQUIRED_LEVEL.NONE);
    } else {
        formContext.getControl(DV.CAMPOS.ATM_MONTO).setVisible(false);
        formContext.getAttribute(DV.CAMPOS.ATM_MONTO).setRequiredLevel(REQUIRED_LEVEL.NONE);
        formContext.getControl(DV.CAMPOS.ATM_PORCENTAJE).setVisible(true);
        formContext.getAttribute(DV.CAMPOS.ATM_PORCENTAJE).setRequiredLevel(REQUIRED_LEVEL.REQUIRED);
    }
}

