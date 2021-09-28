


function validarFechas(executionContext) {



    let formContext = executionContext.getFormContext();

    let ap_iniciorealdeatencion = formContext.getAttribute("ap_iniciorealdeatencion");
    let ap_finrealdeatencion = formContext.getAttribute("ap_finrealdeatencion");


    if (ap_iniciorealdeatencion.getValue() && ap_finrealdeatencion.getValue()) {

        console.log(ap_finrealdeatencion.getValue().getTime());
        console.log(ap_iniciorealdeatencion.getValue().getTime());

        if (ap_finrealdeatencion.getValue().getTime() < ap_iniciorealdeatencion.getValue().getTime()) {

            var alertStrings = { confirmButtonLabel: 'Yes', text: 'La fecha final de atencion no puede ser menor  a la fecha inicial de atencion' };
            var alertOptions = { height: 120, width: 260 };

            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                function success() {
                    // perform operations on alert dialog close
                    ap_finrealdeatencion.setValue(null);
                },
                function (error) {
                    console.log(error.message);
                    // handle error conditions
                }
            );

        }
    }
}