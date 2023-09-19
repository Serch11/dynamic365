function notificacioSinco(executionContext) {

    try {
        let formContext = executionContext.getFormContext();
        let pla_sinco = [{
            entityType: "ap_plataforma",
            id: "56659B5A-DF81-EB11-B1AB-000D3AC090BA",
            name: "SINCO",
        }];

        if (formContext.ui.getFormType() != 1) {


            let form_sinco = "Caso SINCO";
            let ap_plataforma = formContext.getAttribute("ap_plataforma");
            let form_actual = formContext.ui.formSelector.getCurrentItem().getLabel();


            if ((ap_plataforma.getValue()[0].id.slice(1, 37) === pla_sinco[0].id) && form_sinco != form_actual) {
                setTimeout(() => {
                    var alertStrings = { confirmButtonLabel: 'SI', text: 'ESTAS EN UN CASO DOCUMENTADO POR UN AGENTE DE SINCO, SE RECOMIENDA CAMBIAR AL FORMULARIO SINCO PARA CONTINUAR Y VER LA INFORMACION CORRECTA.' };
                    var alertOptions = { height: 120, width: 260 };
                    Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                        function success() {
                            // perform operations on alert dialog close
                            formContext.ui.setFormNotification('ESTAS EN UN CASO DOCUMENTADO POR UN AGENTE DE SINCO, SE RECOMIENDA CAMBIAR AL FORMULARIO SINCO PARA CONTINUAR Y VER LA INFORMACION CORRECTA.', 'ERROR', 'SINCO_NOTIFICACION');
                        },
                        function (error) {
                            console.log(error.message);

                            // handle error conditions
                        }
                    );
                }, 5000);
            }
        }
    } catch (error) {
        console.log(error);
        console.log("Error script funcion notificacionSinco - incident_notificacion_registro_sinco");
    }
}



function notificacioReInterno(executionContext) {

    try {
        let formContext = executionContext.getFormContext();


        if (formContext.ui.getFormType() != 1) {


            let form = "Caso Requerimiento Interno";
            let form_actual = formContext.ui.formSelector.getCurrentItem().getLabel();
            let ap_requerimientointerno = formContext.getAttribute("ap_requerimientointerno");

            if (ap_requerimientointerno) {
                if ((ap_requerimientointerno.getValue() === true) && (form != form_actual)) {
                    setTimeout(() => {
                        var alertStrings = { confirmButtonLabel: 'SI', text: 'ESTAS EN UN CASO DE REQ INTERNO, SE RECOMIENDA CAMBIAR AL FORMULARIO REQ INTERNO PARA CONTINUAR Y VER LA INFORMACION CORRECTA.' };
                        var alertOptions = { height: 120, width: 260 };
                        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                            function success() {
                                // perform operations on alert dialog close
                                formContext.ui.setFormNotification('ESTAS EN UN CASO DE REQ INTERNO, SE RECOMIENDA CAMBIAR AL FORMULARIO REQ INTERNO PARA CONTINUAR Y VER LA INFORMACION CORRECTA.', 'ERROR', 'REQINTERNO_NOTIFICACION');
                            },
                            function (error) {
                                console.log(error.message);

                                // handle error conditions
                            }
                        );
                    }, 5000);
<<<<<<< HEAD
=======

                    


>>>>>>> 5de8aba30d5bb03e7e577f09f1b44f5cd0ca416a
                }
            }
        }
    } catch (error) {
        console.log(error);
        console.log("Error script funcion notificacionReqInterno - incident_notificacion_registro_sinco");
    }
}



