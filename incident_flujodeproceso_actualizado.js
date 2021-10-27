async function getChangeStage(executionContext) {



    //declaracion de varibales
    let FORM_CAC = "Caso CAC";
    let FORM_CAS = "Caso CAS";
    let FORM_SINCO = "Caso SINCO";
    let FORM_SINCO_BRASIL = "Caso SINCO BRASIL";
    let FORM_REQUERIMIENTO = "Caso Requerimiento Interno";

    //formCOntex recibe el contexto de la entidad en la que se encuentra 
    //que es el contexto , campos , subcuadriculas , vistas , paneles
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

        try {
            console.log("entro CAC");

            if (formContext.ui.getFormType() != 1) Xrm.Page.getControl("header_process_ap_requerimientointerno").setDisabled(true)
            formContext.getControl("header_process_ap_requerimientointerno_1").setVisible(false);
            formContext.getControl("header_process_ap_requerimientointerno_2").setVisible(false);
            //formContext.getControl("header_process_ap_areadeequipo").setVisible(false);
            formContext.getControl("header_process_ap_regional").setVisible(false);
            formContext.getControl("header_process_ap_tiendaintervenida").setVisible(false);
            formContext.getControl("header_process_ap_agenteasignado").setVisible(false);


            formContext.getControl('header_process_ap_necesidaddeescalaraterceros').setDisabled(true);
            formContext.getControl('header_process_ap_asignaciondecasoafabricanteexterno').setDisabled(true);
            formContext.getControl('header_process_ap_numerocasodelfabricanteexterno').setDisabled(true);
            formContext.getControl("header_process_ap_areadeequipo").setDisabled(true);
            formContext.getControl("header_process_ap_areadeequipo_1").setDisabled(true);
            formContext.getControl("header_process_contractservicelevelcode").setDisabled(true);
            formContext.getControl("header_process_ap_equipoasignado").setDisabled(true);
            formContext.getControl("header_process_ap_asignarcaso").setDisabled(true);
            formContext.getControl("header_process_ap_plataforma").setDisabled(true);
            // formContext.data.proce    
        } catch (error) {
            console.log(error);
            console.log("error condicion //FORMULARIO CAC ")
        }
        //ss.setActiveProcess(ID_PROCES_CASO, CALLBACK_CAC);
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
            //formContext.getControl("header_process_ap_areadeequipo").setVisible(false);
            formContext.getControl("header_process_ap_regional").setVisible(false);
            formContext.getControl("header_process_ap_agenteasignado").setVisible(false);

            formContext.getControl('header_process_ap_necesidaddeescalaraterceros').setDisabled(true);
            formContext.getControl('header_process_ap_asignaciondecasoafabricanteexterno').setDisabled(true);
            formContext.getControl('header_process_ap_numerocasodelfabricanteexterno').setDisabled(true);
            formContext.getControl("header_process_ap_areadeequipo").setDisabled(true);
            formContext.getControl("header_process_ap_areadeequipo_1").setDisabled(true);
            formContext.getControl("header_process_contractservicelevelcode").setDisabled(true);
            formContext.getControl("header_process_ap_equipoasignado").setDisabled(true);
            formContext.getControl("header_process_ap_asignarcaso").setDisabled(true);
            formContext.getControl("header_process_ap_plataforma").setDisabled(true);

            formContext.getControl("ap_tiendaintervenida").getAttribute().setRequiredLevel('required');

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

        try {
            console.log("entro CAS")

        if (formContext.ui.getFormType() != 1) formContext.getControl("header_process_ap_requerimientointerno").setDisabled(true)

        if (formContext.getControl("header_process_ap_requerimientointerno_1")) formContext.getControl("header_process_ap_requerimientointerno_1").setVisible(false);
        if (formContext.getControl("header_process_ap_requerimientointerno_2")) formContext.getControl("header_process_ap_requerimientointerno_2").setVisible(false);
        if (formContext.getControl("header_process_ap_tiendaintervenida")) formContext.getControl("header_process_ap_tiendaintervenida").setVisible(false);
        if (formContext.getControl("header_process_ap_agenteasignado")) formContext.getControl("header_process_ap_agenteasignado").setVisible(false);
        //formContext.getControl("header_process_ap_areadeequipo").setVisible(false);
        if (formContext.getControl("header_process_ap_agenteasignados")) formContext.getControl("header_process_ap_agenteasignados").setVisible(false);
        if (formContext.getControl('header_process_ap_necesidaddeescalaraterceros')) formContext.getControl('header_process_ap_necesidaddeescalaraterceros').setDisabled(true);

        if (formContext.getControl('header_process_ap_asignaciondecasoafabricanteexterno')) formContext.getControl('header_process_ap_asignaciondecasoafabricanteexterno').setDisabled(true);
        if (formContext.getControl('header_process_ap_numerocasodelfabricanteexterno')) formContext.getControl('header_process_ap_numerocasodelfabricanteexterno').setDisabled(true);
        if (formContext.getControl("header_process_ap_areadeequipo")) formContext.getControl("header_process_ap_areadeequipo").setDisabled(true);
        if (formContext.getControl("header_process_ap_areadeequipo_1")) formContext.getControl("header_process_ap_areadeequipo_1").setDisabled(true);
        if (formContext.getControl("header_process_prioritycode")) formContext.getControl("header_process_prioritycode").setDisabled(true);
        if (formContext.getControl("header_process_ap_urgencia")) formContext.getControl("header_process_ap_urgencia").setDisabled(true);
        if (formContext.getControl("header_process_ap_impacto")) formContext.getControl("header_process_ap_impacto").setDisabled(true);
        if (formContext.getControl("header_process_ap_plataforma")) formContext.getControl("header_process_ap_plataforma").setDisabled(true);
        if (formContext.getControl("header_process_contractservicelevelcode")) formContext.getControl("header_process_contractservicelevelcode").setDisabled(true);
        if (formContext.getControl("header_process_ap_equipoasignado")) formContext.getControl("header_process_ap_equipoasignado").setDisabled(true);
        if (formContext.getControl("header_process_ap_asignarcaso")) formContext.getControl("header_process_ap_asignarcaso").setDisabled(true);
        if (formContext.getControl("ap_regional")) formContext.getControl("ap_regional").getAttribute().setRequiredLevel('required');


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
        } catch (error) {
            console.log("error condiciosn del cas")
        }
        
    }

    //FORMULARIO REQUERIMIENTOS INTERNOS
    if (FORM_NAME === FORM_REQUERIMIENTO) {
        console.log("entro INTERNO")

        try {

            console.log("Cambios en la cinta de proceso de requerimientos internos");
            if (formContext.ui.getFormType() != 1) { Xrm.Page.getControl("header_process_ap_requerimientointerno").setDisabled(true); }

            formContext.getControl("header_process_ap_requerimientointerno_1").setVisible(false);
            formContext.getControl("header_process_ap_requerimientointerno_2").setVisible(false);
            formContext.getControl("header_process_ap_requerimientointerno").setVisible(false);
            formContext.getControl('header_process_ap_requerimientointerno').setDisabled(true);
            formContext.getControl("ap_requerimientointerno").getAttribute().setRequiredLevel("required");
            formContext.getControl("header_process_ap_tiendaintervenida").setVisible(false);
            //formContext.getControl("header_process_prioritycode").setVisible(false);
            //formContext.getControl("header_process_ap_urgencia").setVisible(false);
            //formContext.getControl("header_process_ap_impacto").setVisible(false);
            formContext.getControl("header_process_ap_finrealdeatencion").setVisible(false);
            //formContext.getControl("header_process_ap_finrealdeatencion").setVisible(false);
            formContext.getControl("header_process_ap_solucionacargode").setVisible(false);
            //formContext.getControl("header_process_adx_resolution").setVisible(false);
            formContext.getControl("header_process_ap_plataforma_1").setVisible(false);
            formContext.getControl("header_process_ap_imputablea").setVisible(false);
            formContext.getControl("header_process_ap_regional").setVisible(false);
            formContext.getControl("header_process_casetypecode").setVisible(false);
            formContext.getControl("header_process_contractservicelevelcode").setVisible(false);
            formContext.getControl("header_process_ap_tienecontrato").setVisible(false);
            formContext.getControl("header_process_ap_procedimientodelcaso").setVisible(false);
            formContext.getControl("header_process_entitlementid_1").setVisible(false);
            formContext.getControl("header_process_ap_equipoasignado").setVisible(false);
            formContext.getControl("header_process_ap_asignarcaso").setVisible(false);
            formContext.getControl("header_process_ap_areadeequipo").setVisible(false);



            formContext.getControl('header_process_ap_necesidaddeescalaraterceros').setDisabled(true);
            formContext.getControl('header_process_ap_asignaciondecasoafabricanteexterno').setDisabled(true);
            formContext.getControl('header_process_ap_numerocasodelfabricanteexterno').setDisabled(true);
            formContext.getControl("header_process_prioritycode").setDisabled(true);
            formContext.getControl("header_process_ap_urgencia").setDisabled(true);
            formContext.getControl("header_process_ap_impacto").setDisabled(true);
            formContext.getControl("header_process_contractservicelevelcode").setDisabled(true);
            formContext.getControl("header_process_ap_equipoasignado").setDisabled(true);
            formContext.getControl("header_process_ap_asignarcaso").setDisabled(true);
            formContext.getControl("header_process_ap_plataforma").setDisabled(true);


            //formContext.getControl("header_process_prioritycode").getAttribute().setRequiredLevel("required");
            //formContext.getControl("header_process_ap_urgencia").getAttribute().setRequiredLevel("required");
            //formContext.getControl("header_process_ap_impacto").getAttribute().setRequiredLevel("required");
            formContext.getControl("ap_asignarcaso").getAttribute().setRequiredLevel("required");
            formContext.getControl("ap_equipoasignado").getAttribute().setRequiredLevel("required");
            formContext.getControl("ap_areadeequipo").getAttribute().setRequiredLevel("required");
            //formContext.getControl("header_process_prioritycode").getAttribute().setRequiredLevel("required");
            //formContext.getControl("header_process_ap_urgencia").getAttribute().setRequiredLevel("required");
            //formContext.getControl("header_process_ap_impacto").getAttribute().setRequiredLevel("required");



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
    // RevisiÃ³n trabajo 778.210.005
    // Listo para entregar 778.210.004
    // Cumplido 2
    // Asignado 1
    try {

        let formContext = executionContext.getFormContext();
        let faseActiva = formContext.data.process.getActiveStage(); //Capturar la fase en la que se encuentra
        let razon_para_el_estado = formContext.getAttribute("statuscode");
        let statecode = formContext.getAttribute("statecode");
        let fase = faseActiva.getName();// capturas la fase como tal, el nombre

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





function ocultatTabIncident(executionContext) {

    try {

        let formContext = executionContext.getFormContext();
        console.log("Entro a remover las pestañas");
        console.log(formContext.ui.getFormType());
        if (formContext.ui.getFormType() === 1 || formContext.ui.getFormType() === 0) {

            if (formContext.ui.tabs.get("Validaciondeatencion")) formContext.ui.tabs.get("Validaciondeatencion").setVisible(false);
            if (formContext.ui.tabs.get("Detalledeasignacion")) formContext.ui.tabs.get("Detalledeasignacion").setVisible(false);
            if (formContext.ui.tabs.get("DiagnosticoyCausaRaiz")) formContext.ui.tabs.get("DiagnosticoyCausaRaiz").setVisible(false);
            if (formContext.ui.tabs.get("Actividadesdelcaso")) formContext.ui.tabs.get("Actividadesdelcaso").setVisible(false);
            if (formContext.ui.tabs.get("Detallederesolucion")) formContext.ui.tabs.get("Detallederesolucion").setVisible(false);
            if (formContext.ui.tabs.get("Dispositivos")) formContext.ui.tabs.get("Dispositivos").setVisible(false);
            if (formContext.ui.tabs.get("tab_6")) formContext.ui.tabs.get("tab_6").setVisible(false);
            if (formContext.ui.tabs.get("CASERELATIONSHIP_TAB")) formContext.ui.tabs.get("CASERELATIONSHIP_TAB").setVisible(false);
        }




    } catch (error) {
        console.log(error);
        console.log("error function ocultarTabIncident");
    }
}


function ver(executionContext) {

    let formContext = executionContext.getFormContext();
    console.log("entro visibilidadPesta")
    if (formContext.data.entity.getId()) {
        if (formContext.ui.tabs.get("Validaciondeatencion")) formContext.ui.tabs.get("Validaciondeatencion").setVisible(true);
        if (formContext.ui.tabs.get("Detalledeasignacion")) formContext.ui.tabs.get("Detalledeasignacion").setVisible(true);
        if (formContext.ui.tabs.get("DiagnosticoyCausaRaiz")) formContext.ui.tabs.get("DiagnosticoyCausaRaiz").setVisible(true);
        if (formContext.ui.tabs.get("Actividadesdelcaso")) formContext.ui.tabs.get("Actividadesdelcaso").setVisible(true);
        if (formContext.ui.tabs.get("Detallederesolucion")) formContext.ui.tabs.get("Detallederesolucion").setVisible(true);
        if (formContext.ui.tabs.get("Dispositivos")) formContext.ui.tabs.get("Dispositivos").setVisible(true);
        if (formContext.ui.tabs.get("tab_6")) formContext.ui.tabs.get("tab_6").setVisible(true);
        if (formContext.ui.tabs.get("CASERELATIONSHIP_TAB")) formContext.ui.tabs.get("CASERELATIONSHIP_TAB").setVisible(true);
    }

}

function pruebaPrevent(executionContext) {
    let formContext = executionContext.getFormContext();
    console.log(formContext);
}