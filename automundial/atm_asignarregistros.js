var CUENTAS;

if (CUENTAS == undefined) {
    CUENTAS = {};
}

CUENTAS.abrirHtml = function (primaryControl, selecdControlSelectedItemId) {
    try {
        console.clear();
        console.log(primaryControl);
        console.log(selecdControlSelectedItemId);

        var pageInput = {
            pageType: "webresource",
            webresourceName: "sr_demo_html",
            data: selecdControlSelectedItemId
        };
        var navigationOptions = {
            target: 2,
            width: 500, // value specified in pixel
            height: 400, // value specified in pixel
            position: 1
        };

        Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(
            function success() {
                // Run code on success
            },
            function error() {
                // Handle errors
            }
        );
    } catch (error) {
        alert(error);
    }
};





