if (typeof VENTAS === "undefined") {
    VENTAS = {};
    VENTAS.JS = {};
}

if (typeof VENTAS.JS === "undefined") {
    VENTAS.JS = {};
}

VENTAS.JS.ProductoFactura = {}

VENTAS.JS.ProductoFactura.OnLoad = async function (executionContext) {
    var formContext = executionContext.getFormContext();

    let res = await VENTAS.JS.Comun.ConsultarExistenciaRol("Administrador del sistema,Automundial - Director Regional,Automundial - Director Administrativo,Automundial - Director de Mercadeo,Automundial - Gerente de país,Automundial - Gerente Comercial,Automundial - Gerente Administrativo");

    if (res === false) {
        formContext.getControl("grid_DetalleProductoFactura").setVisible(false);        
    }
}