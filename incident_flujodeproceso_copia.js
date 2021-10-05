async function getChangeStage(executionContext) {


    //declaracion de varibales
    let FORM_CAC = "Caso CAC";
    let FORM_CAS = "Caso CAS";
    let FORM_SINCO = "Caso SINCO";
    let FORM_REQUERIMIENTO = "Caso Requerimiento Interno";
    let formContext = executionContext.getFormContext();
    let FORM_NAME = formContext.ui.formSelector.getCurrentItem()._label;
    var BPF_ACTIVA = formContext.data.process.getActiveProcess();

    let ID_PROCES_CASO = "627e1aca-0b86-40d7-9755-1a3060ca56c9";
    let ID_PROCES_CASO_REQUERIMIENTO = "0d7e7b55-5654-49fd-bf66-78fb5d17e4ab";


    //formContext.data.process.setActiveProcess(ID_PROCES_CASO);


    //if (BPF_ACTIVA) { var BPF_NAME = BPF_ACTIVA.getName(); var BPF_ID = BPF_ACTIVA.getId(); console.log(BPF_NAME); }


    //if (BPF_NAME === 'Caso cinta de proceso') {


    //console.log(BPF_ACTIVA.getName());
    console.log(FORM_NAME);
    //console.log(BPF_ID);

    //FORMULARIO CAC
    if (FORM_NAME === FORM_CAC) {

        console.log("entro CAC")

        formContext.data.process.setActiveProcess(ID_PROCES_CASO, CALLBACK_CAC);

        function CALLBACK_CAC(result) {
            console.log(result);
            if (result === "success") {
                formContext.getControl("header_process_ap_regional").setVisible(false);
                formContext.getControl("header_process_ap_requerimientointerno").setVisible(false);
                formContext.getControl("header_process_ap_tiendaintervenida").setVisible(false);
            }

        }
        ///
    }
    //FORMULARIO SINCO 
    if (FORM_NAME === FORM_SINCO) {
        console.log("entro SINCO")

        try {
            formContext.data.process.setActiveProcess(ID_PROCES_CASO, CALLBACK_SINCO);

            function CALLBACK_SINCO(result) {
                console.log(result);
                if (result === "success") {
                    formContext.getControl("header_process_ap_requerimientointerno").setVisible(false);
                    formContext.getControl("ap_tiendaintervenida").getAttribute().setRequiredLevel('required');
                    formContext.getControl("header_process_ap_regional").setVisible(false);
                }
            }
        } catch (error) {
            console.log(error);
            console.log("Error script incidet_flujo_de_proceso_js SINCO");
        }
    }
    //FORMULARIO CAS 
    if (FORM_NAME === FORM_CAS) {
        console.log("entro CAS")

        formContext.data.process.setActiveProcess(ID_PROCES_CASO, CALLBACK_CAS);
        function CALLBACK_CAS(result) {
            console.log(result);
            if (result === "success") {
                formContext.getControl("header_process_ap_requerimientointerno").setVisible(false);
                formContext.getControl("header_process_ap_tiendaintervenida").setVisible(false);
                formContext.getControl("ap_regional").getAttribute().setRequiredLevel('required');
            }

        }
    }

    //FORMULARIO REQUERIMIENTOS INTERNOS
    if (FORM_NAME === FORM_REQUERIMIENTO) {
        console.log("entro INTERNO")


        formContext.data.process.setActiveProcess(ID_PROCES_CASO_REQUERIMIENTO, CALLBACK_REQINTERNOS);
        function CALLBACK_REQINTERNOS(result) {
            if (result === "success") {

                let ActiveProcess = formContext.data.process.getActiveProcess();
                let NameActiveProcess = ActiveProcess.getName();


                if (NameActiveProcess === NAME_BPF_REQ) {
                    console.log(ActiveProcess);
                    console.log(NameActiveProcess);

                    formContext.getControl("header_process_ap_requerimientointerno").setVisible(true);
                    formContext.getControl('header_process_ap_requerimientointerno').setDisabled(true);
                    formContext.getControl("ap_requerimientointerno").getAttribute().setRequiredLevel("required");
                }
            }
        }

    }

    formContext.data.process.addOnStageChange(cambioStage);
    //}
}


function preventAutoSave(executionContext) {
    var eventArgs = executionContext.getEventArgs();
    if (eventArgs.getSaveMode() == 70 || eventArgs.getSaveMode() == 2) {
        eventArgs.preventDefault();
    }
}

//se ejecuta cuando escucha un cambio en la fase de la cinta de proceso
function cambioStage(executionContext) {

    // Registrado = 778.210.001
    // endiagnostico = 4
    // Esperando atencion por tercero = 3
    // Esperando respuesta del cliente 778.210.002
    // Esperando respuesta ejecutivo 778.210.000
    // Revisión trabajo 778.210.005
    // Listo para entregar 778.210.004
    // Cumplido 2
    // Asignado 1
    try {
        console.clear();
        let formContext = executionContext.getFormContext();
        let faseActiva = formContext.data.process.getActiveStage();
        let razon_para_el_estado = formContext.getAttribute("statuscode");
        let statecode = formContext.getAttribute("statecode");
        let fase = faseActiva.getName();

        console.log(faseActiva)
        console.log(fase);
        console.log(razon_para_el_estado.getValue());


        if (fase === "Validar  Atencion") {
            razon_para_el_estado.setValue(778210001);
            Xrm.Page.data.entity.save();
        }
        if (fase === "Esperando Aprobacion Ejecutivo") {
            razon_para_el_estado.setValue(778210000);
            Xrm.Page.data.entity.save();


        }
        if (fase === "Esperando Aprobacion Del Cliente") {
            razon_para_el_estado.setValue(778210002);
            Xrm.Page.data.entity.save();
        }
        if (fase === "Asignacion") {
            razon_para_el_estado.setValue(1);
            Xrm.Page.data.entity.save();
        }
        if (fase === "Diagnostico") {
            razon_para_el_estado.setValue(4);
            Xrm.Page.data.entity.save();
        }
        if (fase === "Esperando Atencion De Terceros") {
            razon_para_el_estado.setValue(3);
            Xrm.Page.data.entity.save();
        }

        if (fase === "Revision Trabajo") {
            razon_para_el_estado.setValue(778210005);
            Xrm.Page.data.entity.save();
        }

        if (fase === "Listo Para Entregar") {
            razon_para_el_estado.setValue(778210004);
            Xrm.Page.data.entity.save();
        }

        if (fase === "Cumplido") {
            razon_para_el_estado.setValue(2);
            Xrm.Page.data.entity.save();
        }

    } catch (error) {


        var alertStrings = { confirmButtonLabel: "Yes", text: error, title: "Sample title" };
        var alertOptions = { height: 120, width: 260 };
        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(function (success) {
            console.log("alerta cerrada");
        }, function (error) {
            console.log(error);

        })
    }

}