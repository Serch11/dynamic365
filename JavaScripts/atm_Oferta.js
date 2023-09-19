if (typeof VENTAS === "undefined") {
    VENTAS = {};
    VENTAS.JS = {};
}
if (typeof VENTAS.JS === "undefined") {
    VENTAS.JS = {};
}

const OFERTA = {
    ID: Xrm.Page.data.entity.getId(),
    NOMBRE: Xrm.Page.data.entity.getEntityName(),
    CAMPOS: {
        QUOTENUMBER: "quotenumber",
        REVISIONNUMBER: "revisionnumber",
        NAME: "name",
        CUSTOMERID: "customerid",
        TRANSACTIONCURRENCYID: "transactioncurrencyid",
        PRICELEVELID: "pricelevelid",
        DESCRIPTION: "description",
    },
    SECCION: {},
    OPCIONES: {},
    ROLES: guardarRoles()
}
VENTAS.JS.Oferta = {};

VENTAS.JS.Oferta.OnLoadForm = async function (executionContext) {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();

    } catch (error) {
    }
}

