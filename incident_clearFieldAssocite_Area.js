function clearFieldAssociteArea(executionContext) {
    try {

        //let FORM_REQ_INT = "Caso Requerimiento Interno";
        let formContext = executionContext.getFormContext();
        let ap_areadeequipo = formContext.getAttribute("ap_areadeequipo");

        let ap_tipoderequerimientointerno = formContext.getAttribute("ap_tipoderequerimientointerno");
        let ap_equipoasignado = formContext.getAttribute("ap_equipoasignado");
        let ap_asignarcaso = formContext.getAttribute("ap_asignarcaso");
        let contractservicelevelcode = formContext.getAttribute("contractservicelevelcode");

        //let FORM_NAME = formContext.ui.formSelector.getCurrentItem().getLabel();



        if (!ap_areadeequipo.getValue()) {
            if (ap_tipoderequerimientointerno) ap_tipoderequerimientointerno.setValue(null);
            if (ap_equipoasignado) ap_equipoasignado.setValue(null);
            if (ap_asignarcaso) ap_asignarcaso.setValue(null);
            if (contractservicelevelcode) contractservicelevelcode.setValue(null);
        }
    } catch (error) {
        console.log(error);
        console.log("Error funcion clearFieldAssociteArea")
    }
}


///funcion que me permite borrar el ingeniero asignado si el equipo asignado es borrado
function clearApasignarcaso(executionContext) {
    try {

        //let FORM_REQ_INT = "Caso Requerimiento Interno";
        let formContext = executionContext.getFormContext();


        let ap_equipoasignado = formContext.getAttribute("ap_equipoasignado");
        let ap_asignarcaso = formContext.getAttribute("ap_asignarcaso");
        let contractservicelevelcode = formContext.getAttribute("contractservicelevelcode");

        //let FORM_NAME = formContext.ui.formSelector.getCurrentItem().getLabel();

        if (!ap_equipoasignado.getValue()) {
            if (ap_asignarcaso) ap_asignarcaso.setValue(null);
        }
    } catch (error) {
        console.log(error);
        console.log("Error funcion clearApasignarcaso");
    }
}


function asignarCoordinadorPorArea(executionContext) {

    try {
        let COORDINADOR_CAC = [{
            id: "3540aaa4-ef10-ec11-b6e6-00224837bd45",
            name: "COORDINADOR CAC",
            entityType: "team"
        }];

        let formContext = executionContext.getFormContext();
        let ap_areadeequipo = formContext.getAttribute("ap_areadeequipo");
        let ap_equipoasignado = formContext.getAttribute("ap_equipoasignado");


        if( ap_areadeequipo.getValue() ){
            
        }


    } catch (error) {
        console.log("error en la funcion asignarCoordinadorPorArea");
    }
}