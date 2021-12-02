function validarFechas(executionContext) {
    let formContext = executionContext.getFormContext();

    let ap_iniciorealdeatencion = formContext.getAttribute(
        "ap_iniciorealdeatencion"
    );
    let ap_finrealdeatencion = formContext.getAttribute("ap_finrealdeatencion");
    let todayDate = new Date();
    const mensajeI =
        "La fecha inicial de atencion no puede ser menor a la fecha actual";
    const mensajeF =
        "La fecha final de atencion no puede ser menor  a la fecha inicial de atencion. se le colocara la fecha actual";

    if (ap_iniciorealdeatencion.getValue() && !ap_finrealdeatencion.getValue()) {
        if (ap_iniciorealdeatencion.getValue().getTime() > todayDate.getTime())
            mensajeAlerta(executionContext, mensajeI, "ap_iniciorealdeatencion");
    }

    if (ap_iniciorealdeatencion.getValue() && ap_finrealdeatencion.getValue()) {
        if (
            ap_finrealdeatencion.getValue().getTime() <
            ap_iniciorealdeatencion.getValue().getTime()
        ) {
            mensajeAlerta(executionContext, mensajeF, "ap_finrealdeatencion");
        }
    }
}

function mensajeAlerta(executionContext, mensaje, campo) {
    let formContext = executionContext.getFormContext();
    var alertStrings = {
        confirmButtonLabel: "Yes",
        text: mensaje,
    };
    var alertOptions = { height: 120, width: 260 };

    Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
        function success() {
            // perform operations on alert dialog close
            formContext.getAttribute(campo).setValue(null);
            formContext.getAttribute(campo).setValue(new Date());
        },
        function(error) {
            console.log(error.message);
            // handle error conditions
        }
    );
}