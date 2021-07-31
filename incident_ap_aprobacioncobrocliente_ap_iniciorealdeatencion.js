
function change_apAprobacion(executionContext) {


    let formContext = executionContext.getFormContext();
    let ap_aprobacion = formContext.getAttribute("ap_aprobacioncobrocliente");
    let ap_iniciorealdeatencion = formContext.getAttribute("ap_iniciorealdeatencion");

    if (ap_aprobacion.getValue()) {
        ap_iniciorealdeatencion.setValue(new Date());
    } else {
        ap_iniciorealdeatencion.setValue(null);
    }


}