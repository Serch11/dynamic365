function getChangeStage(executionContext) {


    //declaracion de varibales
    let FORM_CAC = "Caso CAC";
    let FORM_CAS = "Caso CAS";
    let FORM_SINCO = "Caso SINCO";
    let FORM_REQUERIMIENTO = "Caso Requerimiento Interno";
    let formContext = executionContext.getFormContext();
    let FORM_NAME = formContext.ui.formSelector.getCurrentItem()._label;
    let BPF_ACTIVA = formContext.data.process.getActiveProcess();

    if (BPF_ACTIVA) var BPF_NAME = BPF_ACTIVA.getName(); var BPF_ID = BPF_ACTIVA.getId();

    if (BPF_NAME === 'Caso cinta de proceso') {


        console.log(BPF_ACTIVA.getName());
        console.log(FORM_NAME);
        console.log(BPF_ID);
        if (FORM_NAME === FORM_CAC) {

            console.log("entro CAC")
            formContext.getControl("header_process_ap_regional").setVisible(false);
            formContext.getControl("header_process_ap_requerimientointerno").setVisible(false);
        }
        if (FORM_NAME === FORM_SINCO) {
            console.log("entro SINCO")
            formContext.getControl("header_process_ap_requerimientointerno").setVisible(false);
        }
        if (FORM_NAME === FORM_CAS) {
            console.log("entro CAS")
            formContext.getControl("header_process_ap_requerimientointerno").setVisible(false);
        }

        if (FORM_NAME === FORM_REQUERIMIENTO) {
            console.log("entro INTERNO")
            formContext.getControl("header_process_ap_requerimientointerno").setVisible(true);
            formContext.getControl('header_process_ap_requerimientointerno').setDisabled(true);
            formContext.getControl("ap_requerimientointerno").getAttribute().setRequiredLevel("required");
        }

        formContext.data.process.addOnStageChange(cambioStage);
    }

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