

function loadCargaRequeInternos(executionContext) {

    let formContext = executionContext.getformContext();
    let ap_tieneoportunidadasociada = formContext.getAttribute("ap_tieneoportunidadasociada");
    let entitlementid = formContext.getAttribute("entitlementid");
    let ap_oportunidadasociada = formContext.getAttribute("ap_oportunidadasociada");

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