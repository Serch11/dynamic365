if (typeof VENTAS === "undefined") {
    VENTAS = {};
    VENTAS.JS = {};
}

if (typeof VENTAS.JS === "undefined") {
    VENTAS.JS = {};
}

VENTAS.JS.Producto = {}

VENTAS.JS.Producto.IdProducto = function (executionContext) {
    var formContext = executionContext.getFormContext();

    var atm_paisid = formContext.getAttribute("atm_paisid").getValue();
    var atm_codigoproducto = formContext.getAttribute("atm_codigoproducto").getValue();

    if (atm_paisid && atm_codigoproducto) {
        formContext.getAttribute("productnumber").setValue(atm_paisid[0].name + "-" + atm_codigoproducto);
    } else {
        formContext.getAttribute("productnumber").setValue(null);
    }
}

VENTAS.JS.Producto.MostrarImagenDelProducto = function (rowData, userLCID) {
    "use strict";
    try {
        let producto = JSON.parse(rowData);
        let imgName = producto?.entityimage_url_Value;
        var tooltip = producto.name_Value;

        let resultarray = [imgName, tooltip];
        return resultarray;

    } catch (error) {
        console.log(error);
    }
}