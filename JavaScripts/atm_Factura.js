if (typeof VENTAS === "undefined") {
    VENTAS = {};
    VENTAS.JS = {};
}

if (typeof VENTAS.JS === "undefined") {
    VENTAS.JS = {};
}

VENTAS.JS.Factura = {}

VENTAS.JS.Factura.OnLoad = function (executionContext) {
    var formContext = executionContext.getFormContext();

    var created = formContext.getAttribute("createdon").getValue();

    if (!created) {
        formContext.getAttribute("transactioncurrencyid").setValue(null);
    }
}