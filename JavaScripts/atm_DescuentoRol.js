if (typeof VENTAS === "undefined") {
    VENTAS = {};
    VENTAS.JS = {};
}
if (typeof VENTAS.JS === "undefined") {
    VENTAS.JS = {};
}

const DESCUENTO_ROL = {
    NOMBRE_LOGICO: "atm_descuentorol",
    CAMPOS: {
        ATM_NOMBRE: "atm_nombre",
        ATM_REGLADESCUENTOID: "atm_regladescuentoid",
        ATM_ROLID: "atm_rolid",
        ATM_MONTO: "atm_monto",
        ATM_PORCENTAJE: "atm_porcentaje",
        ATM_CONSECUTIVO: "atm_consecutivo"
    },
    PESTANAS: {
        general: "general"
    },
    SECCIONES: {
    }
}

VENTAS.JS.DescuentoRol = {};

VENTAS.JS.DescuentoRol.OnLoad = async function (executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();
    let atm_regladescuentoid = formContext.getAttribute(DESCUENTO_ROL.CAMPOS.ATM_REGLADESCUENTOID).getValue()[0];
    let reglaDescuento = await VENTAS.JS.Comun.ConsultarRegistro(atm_regladescuentoid.entityType, atm_regladescuentoid.id, "?$select=atm_tipo")

    if (reglaDescuento.atm_tipo) {
        formContext.getAttribute(DESCUENTO_ROL.CAMPOS.ATM_MONTO).setRequiredLevel(REQUIRED_LEVEL.REQUIRED);
        formContext.getControl(DESCUENTO_ROL.CAMPOS.ATM_PORCENTAJE).setDisabled(true)
    } else {
        formContext.getAttribute(DESCUENTO_ROL.CAMPOS.ATM_PORCENTAJE).setRequiredLevel(REQUIRED_LEVEL.REQUIRED);
        formContext.getControl(DESCUENTO_ROL.CAMPOS.ATM_MONTO).setDisabled(true)
    }
}