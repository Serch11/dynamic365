function cambioFase(executionContext) {
    let formContext = executionContext.getFormContext();
    formContext.data.process.addOnStageChange(EsperandoAprobacion);
}

function EsperandoAprobacion(executioContext) {


    try {


        let formContext = executioContext.getFormContext();
        let statuscode = formContext.getAttribute("statuscode");
        let ap_espaprobacionclienteparasolucion = formContext.getControl("ap_espaprobacionclienteparasolucion");
        let codigo_esperando_respuesta_delcliente = 778210002;
        let codigo_diagnostico = 4;
        let codigo_esperando_atencion_portercero = 3;


        if (statuscode.getValue() != codigo_esperando_respuesta_delcliente) ap_espaprobacionclienteparasolucion.getAttribute().setValue(false);
        if (statuscode.getValue() === codigo_diagnostico) {
            ap_espaprobacionclienteparasolucion.setDisabled(false);
        } else {
            ap_espaprobacionclienteparasolucion.setDisabled(true);

        }
        ap_espaprobacionclienteparasolucion.getAttribute().addOnChange(cambioValorEsperandoAprobacion);
    } catch (error) {
        console.log("error javaScript incident_ap_esperandoaprobaciondelcliente.js");
        console.log(error);
        console.log("Error funcion EsperandoAprobacion");
    }


}



function cambioValorEsperandoAprobacion(executionContext) {

    try {
        let formContext = executionContext.getFormContext();
        let statuscode = formContext.getAttribute("statuscode");
        let ap_espaprobacionclienteparasolucion = formContext.getControl("ap_espaprobacionclienteparasolucion");
        let codigo_esperando_respuesta_delcliente = 778210002;
        let codigo_diagnostico = 4;
        let codigo_esperando_atencion_portercero = 3;

        console.log(ap_espaprobacionclienteparasolucion.getAttribute().getValue());


        if (ap_espaprobacionclienteparasolucion.getAttribute().getValue() === true) {
            statuscode.setValue(codigo_esperando_respuesta_delcliente);
        } else {
            statuscode.setValue(codigo_diagnostico);
        }
    } catch (error) {
        console.log(error);
    }
}