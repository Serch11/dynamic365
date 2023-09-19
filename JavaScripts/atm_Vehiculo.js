if (typeof VENTAS === "undefined") {
    VENTAS = {};
    VENTAS.JS = {};
}

if (typeof VENTAS.JS === "undefined") {
    VENTAS.JS = {};
}

VENTAS.JS.Vehiculo = {}

VENTAS.JS.Vehiculo.HeredarPotencial = function (executionContext) {
    "use strict";

    var formContext = executionContext.getFormContext();
    var atm_tipovehiculoid = formContext.getAttribute("atm_tipovehiculoid").getValue();
    var atm_cantidadvehiculos = formContext.getAttribute("atm_cantidadvehiculos").getValue();

    if (atm_tipovehiculoid && atm_cantidadvehiculos) {
        Xrm.WebApi.retrieveRecord("atm_tipovehiculo", atm_tipovehiculoid[0].id, "?$select=atm_potencial,atm_tipocalculocode").then(
            function success(result) {
                formContext.getAttribute("atm_tipocalculocode").setValue(result.atm_tipocalculocode);
                formContext.getAttribute("atm_potencial").setValue(result.atm_potencial * atm_cantidadvehiculos);
            },
            function (error) {
                Xrm.Navigation.openAlertDialog({ confirmButtonLabel: "Ok", text: error.message }, { height: 250, width: 550 });
            }
        );
    } else {
        formContext.getAttribute("atm_tipocalculocode").setValue(null);
        formContext.getAttribute("atm_potencial").setValue(null);
    }
}

VENTAS.JS.Vehiculo.CrearNombreVehiculo =  async function (executionContext){
    "use strict";

    try {
        let formContext = executionContext.getFormContext();

        let atm_nombre = formContext.getAttribute("atm_nombre");
        let atm_cuentaid = formContext.getAttribute("atm_cuentaid");
        let atm_tipovehiculoid = formContext.getAttribute("atm_tipovehiculoid");
        let atm_cantidadvehiculos = formContext.getAttribute("atm_cantidadvehiculos");

        if( atm_cuentaid.getValue() && atm_tipovehiculoid.getValue() && atm_cantidadvehiculos.getValue() ){

            let resCuenta = await Xrm.WebApi.retrieveRecord('account', atm_cuentaid.getValue()[0].id,"?$select=atm_idcuenta");
            let atm_idcuenta = resCuenta.atm_idcuenta;
            
            if(atm_idcuenta){
                atm_nombre.setValue(atm_idcuenta+"_"+atm_tipovehiculoid.getValue()[0].name+"_"+atm_cantidadvehiculos.getValue());
            }
        }else{
            atm_nombre.setValue(null);
        }

    } catch (error) {
        Xrm.Navigation.openAlertDialog({ confirmButtonLabel: "Ok", text: error.message }, { height: 250, width: 550 });
    }
}



