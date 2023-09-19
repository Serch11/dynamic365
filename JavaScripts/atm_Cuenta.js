if (typeof VENTAS === "undefined") {
    VENTAS = {};
    VENTAS.JS = {};
}

if (typeof VENTAS.JS === "undefined") {
    VENTAS.JS = {};
}

VENTAS.JS.Cuenta = {}

VENTAS.JS.Cuenta.SemaforoVista = function (rowData) {
    "use strict";

    var str = JSON.parse(rowData);
    var imgName = "";
    var tooltip = "";

    if (str.atm_nivelriesgocode) {
        switch (str.atm_nivelriesgocode) {
            case "Sin riesgo":
                imgName = "atm_iconoverde";
                tooltip = str.atm_nivelriesgocode;
                break;
            case "Medio":
            case "Medio N1":
            case "Medio N2":
            case "Medio alto":
            case "Medio muy alto":
                imgName = "atm_iconoamarillo";
                tooltip = str.atm_nivelriesgocode;
                break;
            case "Alto":
                imgName = "atm_iconorojo";
                tooltip = str.atm_nivelriesgocode;
                break;
        }
    }

    var resultarray = [imgName, tooltip];
    return resultarray;
}

VENTAS.JS.Cuenta.MostrarIconoEstadoCliente = async function (primaryControl) {
    "use strict";
    var formContext = primaryControl.getFormContext();
    var atm_paisid = formContext.getAttribute("atm_paisid").getValue();
    var atm_semsicecode = formContext.getAttribute("atm_semsicecode").getText();

    if (atm_paisid && atm_semsicecode) {
        let parametro = await Xrm.WebApi.retrieveMultipleRecords("atm_parametro", `?$select=atm_valor&$filter=atm_nombre eq 'V-${atm_paisid[0].name}-${atm_semsicecode}'`);

        if (parametro.entities.length > 0) {
            let parametros = parametro.entities[0].atm_valor.split(',')
            var atm_diasdesdeultimafacturacion = formContext.getAttribute("atm_diasdesdeultimafacturacion").getValue();
            var secInformacionCuenta = formContext.ui.tabs.get("tab_summary").sections.get("sec_informacioncuenta");
            var estadoVerde = secInformacionCuenta.controls.getByName("WebResource_estadointegracionverde");
            var estadoAmarillo = secInformacionCuenta.controls.getByName("WebResource_estadointegracionamarillo");
            var estadoRojo = secInformacionCuenta.controls.getByName("WebResource_estadointegracionrojo");

            if (atm_diasdesdeultimafacturacion <= Number(parametros[0])) {
                estadoVerde.setVisible(true);
            } else if (atm_diasdesdeultimafacturacion <= Number(parametros[1])) {
                estadoAmarillo.setVisible(true);
            } else if (atm_diasdesdeultimafacturacion > Number(parametros[1])) {
                estadoRojo.setVisible(true);
            }
        }
    }
}

VENTAS.JS.Cuenta.MostrarDescripcionEstado = async function (executionContext) {
    "use strict";

    var formContext = executionContext.getFormContext();

    var statuscode = formContext.getAttribute("statuscode").getText();

    let parametro = await Xrm.WebApi.retrieveMultipleRecords("atm_parametro", `?$select=atm_valor&$filter=atm_nombre eq 'DESCRIPCIONESTADOS'`);

    if (parametro.entities.length > 0) {
        let parametros = parametro.entities[0].atm_valor.split(',')

        for (let par of parametros) {
            var split = par.split('-');
            if (split[0] === statuscode.substring(0, 1)) {
                formContext.ui.setFormNotification(split[1], "INFO", "DESCRIPCIONESTADO");
                break;
            }
        }
    }
}

VENTAS.JS.Cuenta.ModificarPropietarioSeleccionados = function (selected, unselected, selectedControl) {
    "use strict";

    let record = selected;

    if (selected.length <= 0)
        record = unselected

    Xrm.Navigation.navigateTo(
        {
            pageType: "webresource",
            webresourceName: "atm_asignacionmasiva",
            data: record
        },
        {
            target: 2,
            position: 1,
            width: { value: 50, unit: "%" },
        }
    ).then(function succes() {
        selectedControl.refresh();
    }, function error() { });
}

VENTAS.JS.Cuenta.ModificarFrecuenciaRecoleccion = function () {
    "use strict";

    parent.Xrm.Navigation.navigateTo(
        {
            pageType: "webresource",
            webresourceName: "atm_frecuenciarecoleccion",
            //recordId: 
            //data: record
        },
        {
            target: 2,
            position: 2,
            width: { value: 50, unit: "%" },
        }
    ).then(function succes() {
        //selectedControl.refresh();
    }, function error() { });
}