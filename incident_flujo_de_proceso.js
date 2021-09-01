async function getChangeStage(executionContext) {


    //declaracion de varibales
    let FORM_CAC = "Caso CAC";
    let FORM_CAS = "Caso CAS";
    let FORM_SINCO = "Caso SINCO";
    let FORM_SINCO_BRASIL = "Caso SINCO BRASIL";
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

        console.log("entro CAC");

        if (formContext.ui.getFormType() != 1) Xrm.Page.getControl("header_process_ap_requerimientointerno").setDisabled(true)
        formContext.getControl("header_process_ap_requerimientointerno_1").setVisible(false);
        formContext.getControl("header_process_ap_requerimientointerno_2").setVisible(false);
        formContext.getControl("header_process_ap_regional").setVisible(false);
        formContext.getControl("header_process_ap_tiendaintervenida").setVisible(false);
        // formContext.data.process.setActiveProcess(ID_PROCES_CASO, CALLBACK_CAC);
        // function CALLBACK_CAC(result) {
        //     console.log(result);
        //     if (result === "success") {


        //         //formContext.getControl("header_process_ap_requerimientointerno").setVisible(false);


        //     }
        // }
    }
    //FORMULARIO SINCO 
    if (FORM_NAME === FORM_SINCO || FORM_NAME === FORM_SINCO_BRASIL) {

        if (FORM_NAME === FORM_SINCO) console.log("entro SINCO");
        if (FORM_NAME === FORM_SINCO_BRASIL) console.log("SINCO BRASIL");


        try {

            if (formContext.ui.getFormType() != 1) Xrm.Page.getControl("header_process_ap_requerimientointerno").setDisabled(true)
            formContext.getControl("header_process_ap_requerimientointerno_1").setVisible(false);
            formContext.getControl("header_process_ap_requerimientointerno_2").setVisible(false);
            formContext.getControl("ap_tiendaintervenida").getAttribute().setRequiredLevel('required');
            formContext.getControl("header_process_ap_regional").setVisible(false);

            // formContext.data.process.setActiveProcess(ID_PROCES_CASO, CALLBACK_SINCO);
            // function CALLBACK_SINCO(result) {
            //     console.log(result);
            //     if (result === "success") {
            //         //formContext.getControl("header_process_ap_requerimientointerno").setVisible(false);

            //     }
            // }
        } catch (error) {
            console.log(error);
            console.log("Error script incidet_flujo_de_proceso_js SINCO");
        }
    }
    //FORMULARIO CAS 
    if (FORM_NAME === FORM_CAS) {
        console.log("entro CAS")

        if (formContext.ui.getFormType() != 1) Xrm.Page.getControl("header_process_ap_requerimientointerno").setDisabled(true)

        formContext.getControl("header_process_ap_requerimientointerno_1").setVisible(false);
        formContext.getControl("header_process_ap_requerimientointerno_2").setVisible(false);
        formContext.getControl("header_process_ap_tiendaintervenida").setVisible(false);
        formContext.getControl("ap_regional").getAttribute().setRequiredLevel('required');
        //formContext.data.process.setActiveProcess(ID_PROCES_CASO, CALLBACK_CAS);
        // function CALLBACK_CAS(result) {
        //     console.log(result);
        //     if (result === "success") {
        //         //formContext.getControl("header_process_ap_requerimientointerno").setVisible(false);
        //         formContext.getControl("header_process_ap_requerimientointerno_2").setVisible(false);
        //         formContext.getControl("header_process_ap_tiendaintervenida").setVisible(false);
        //         formContext.getControl("ap_regional").getAttribute().setRequiredLevel('required');
        //     }
        // }
    }

    //FORMULARIO REQUERIMIENTOS INTERNOS
    if (FORM_NAME === FORM_REQUERIMIENTO) {
        console.log("entro INTERNO")

        try {

            if (formContext.ui.getFormType() != 1) Xrm.Page.getControl("header_process_ap_requerimientointerno").setDisabled(true);

            formContext.getControl("header_process_ap_requerimientointerno_1").setVisible(false);
            formContext.getControl("header_process_ap_requerimientointerno_2").setVisible(false);
            formContext.getControl("header_process_ap_requerimientointerno").setVisible(false);
            formContext.getControl('header_process_ap_requerimientointerno').setDisabled(true);
            formContext.getControl("ap_requerimientointerno").getAttribute().setRequiredLevel("required");
            formContext.getControl("header_process_ap_tiendaintervenida").setVisible(false);
            formContext.getControl("header_process_prioritycode").setVisible(false);
            formContext.getControl("header_process_ap_urgencia").setVisible(false);
            formContext.getControl("header_process_ap_impacto").setVisible(false);
            formContext.getControl("header_process_ap_finrealdeatencion").setVisible(false);
            formContext.getControl("header_process_ap_finrealdeatencion").setVisible(false);
            formContext.getControl("header_process_ap_solucionacargode").setVisible(false);
            formContext.getControl("header_process_adx_resolution").setVisible(false);
            formContext.getControl("header_process_ap_plataforma_1").setVisible(false);
            formContext.getControl("header_process_ap_imputablea").setVisible(false);

        } catch (error) {
            console.log(error);
            console.log("Error en la condicion FORM_INTERNO DEL SCRIPT INCIDENT_FLUJO_DE_PROCESO");
        }





        // formContext.data.process.setActiveProcess(ID_PROCES_CASO, CALLBACK_REQINTERNOS);
        // function CALLBACK_REQINTERNOS(result) {
        //     if (result === "success") {

        //         let ActiveProcess = formContext.data.process.getActiveProcess();
        //         let NameActiveProcess = ActiveProcess.getName();

        //     }
        // }

    }

    //metodo para esuchar el cambio de fase manualmente por le usuario
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
        });
    }
}


// function escucharCambio(executionContext) {
//     let formContext = Xrm.Page;
//     let casetypecode = formContext.getAttribute("casetypecode");
//     let ap_procedimientodelcaso = formContext.getAttribute("ap_procedimientodelcaso");
//     formContext.data.process.addOnPreStageChange(callback);
//     //Xrm.Page.data.process.setActiveStage("1887e15f-a5a3-42b8-aafa-27acd1d10868", callback);
// }
// Xrm.Page.getAttribute('casetypecode').addOnChange(escucharCambio);
// function callback() {

//     console.log("entro al escuchar cambio")
//     if (casetypecode.getValue()) {
//         Xrm.Page.data.process.moveNext();
//     }
// }