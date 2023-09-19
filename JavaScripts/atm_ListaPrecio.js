if (typeof VENTAS === "undefined") {
    VENTAS = {};
    VENTAS.JS = {};
}

if (typeof VENTAS.JS === "undefined") {
    VENTAS.JS = {};
}

VENTAS.JS.ListaPrecio = {}

VENTAS.JS.ListaPrecio.CrearNombre = async function (executionContext) {
    "use strict";
    let formContext = executionContext.getFormContext();
    let name = formContext.getAttribute("name");
    let atm_paisid = formContext.getAttribute("atm_paisid").getValue();
    let atm_segmentocode = formContext.getAttribute("atm_segmentocode").getText();
    let begindate = formContext.getAttribute("begindate").getValue();
    let enddate = formContext.getAttribute("enddate").getValue();

    if (atm_paisid && atm_segmentocode && begindate && enddate) {
        let _begindate = VENTAS.JS.Comun.FormatDate(new Date(begindate), 1);
        let _enddate = VENTAS.JS.Comun.FormatDate(new Date(enddate), 1);

        name.setValue(`${atm_paisid[0].name}-${atm_segmentocode.toString()}/${_begindate} a ${_enddate}`);
    } else {
        name.setValue(null);
    }
}

VENTAS.JS.ListaPrecio.AbrirHtml = async function (executionContext) {
    "use strict";
    var data = {
        id: executionContext.data.entity.getId().replace('{', '').replace('}', ''),
        pais: executionContext.getAttribute("atm_paisid").getValue()[0].name
    }

    Xrm.Navigation.navigateTo(
        {
            pageType: "webresource",
            webresourceName: "atm_cargarproductos",
            data: JSON.stringify(data)
        },
        {
            target: 2,
            position: 1,
            width: { value: 50, unit: "%" },
        }
    ).then(
        function success() {
        },
        function error() { }
    );
}