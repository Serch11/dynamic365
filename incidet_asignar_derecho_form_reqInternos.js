

function loadCargaRequeInternos(executionContext) {



    let formContext = executionContext.getFormContext();
    let ap_tieneoportunidadasociada = formContext.getAttribute("ap_tieneoportunidadasociada");
    let entitlementid = formContext.getAttribute("entitlementid");
    let ap_oportunidadasociada = formContext.getAttribute("ap_oportunidadasociada");
    let ap_area = formContext.getAttribute("ap_area");
    let customerid = formContext.getAttribute("customerid");

    try {
        let usuario = [
            {
                id: "a2af42ea-e434-eb11-a813-000d3a887093",
                entityType: "account",
                name: "REDSIS PRUEBAS"
            }
        ];
        customerid.setValue(usuario);
    } catch (error) {
        console.log(error);
    }


    ap_area.setRequiredLevel("required");

    if (ap_oportunidadasociada.getValue()) {
        formContext.getControl('entitlementid').setDisabled(true);
    }

}



function reqInternos(executeContext) {

    let formContext = executeContext.getFormContext();
    let ap_tieneoportunidadasociada = formContext.getAttribute("ap_tieneoportunidadasociada");
    let entitlementid = formContext.getAttribute("entitlementid");
    let ap_oportunidadasociada = formContext.getAttribute("ap_oportunidadasociada");
    let derecho = [{
        id: "2c22cfac-65f4-eb11-94ef-0022483702df",
        entityType: "entitlement",
        name: "DERECHO CON OP"
    }];
    if (ap_tieneoportunidadasociada.getValue()) {

        formContext.getAttribute('ap_oportunidadasociada').setRequiredLevel('required');
        entitlementid.setValue(derecho);
        formContext.getControl('entitlementid').setDisabled(true);
    } else {
        entitlementid.setValue(null);
        formContext.getControl('entitlementid').setDisabled(false);
        formContext.getAttribute('ap_oportunidadasociada').setRequiredLevel('none');
    }
}



function cambioApcuentaRequerimiento(executionContext) {




    try {

        let formContext = executionContext.getFormContext();
        let ap_cuentarequerimientointerno = formContext.getAttribute("ap_cuentarequerimientointerno");
        let primarycontactid = formContext.getAttribute("primarycontactid");

        
        if (!ap_cuentarequerimientointerno.getValue()) {
            primarycontactid.setValue(null);
        }

    } catch (error) {
        console.log(error);
    }
}