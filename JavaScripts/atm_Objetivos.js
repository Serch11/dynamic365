if (typeof VENTAS === "undefined") {
    VENTAS = {};
    VENTAS.JS = {};
}
if (typeof VENTAS.JS === "undefined") {
    VENTAS.JS = {};
}



VENTAS.JS.Objetivos = {};

VENTAS.JS.Objetivos.AbrirHtmlCargaObjetivos = function (executionContext, selecteControl) {
    "use strict";

    Xrm.Navigation.navigateTo(
        {
            pageType: "webresource",
            webresourceName: "atm_crearobjetivos",
            data: selecteControl
        },
        {
            target: 2,
            position: 1,
            width: { value: 50, unit: "%" },
        }
    ).then(
        function success() {
                // Run code on success
                selecteControl.refresh(); 
        },
        function error() {
                // Handle errors
        }
    );
}