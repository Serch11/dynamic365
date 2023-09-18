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
    let FORM_NAME = formContext.ui.formSelector.getCurrentItem().getLabel();
    const BPF_ACTIVA = formContext.data.process.getActiveProcess();
    const BPF_ESTADO_CUMPLIDO = "718843ae-00b3-433f-b96f-c5de3ef1dd2e";

    const ID_PROCES_CASO = "627e1aca-0b86-40d7-9755-1a3060ca56c9";
    const ID_PROCES_CASO_REQUERIMIENTO = "0d7e7b55-5654-49fd-bf66-78fb5d17e4ab";

    //esta funcion se ejecuta cuando se carga el formularios del caso siempre y cuando no sea un formulario nuevo
    //se encarga de validar el estado en el que se encuentra el caso y si esta en cumplido bloqueara todos los campos del caso.
    if (formContext.ui.getFormType() != 1) bloquearCampos(executionContext);

    //FORMULARIO CAC
    if (FORM_NAME === FORM_CAC) {
        try {
            console.log("entro CAC");

            if (formContext.ui.getFormType() != 1)
                Xrm.Page.getControl(
                    "header_process_ap_requerimientointerno"
                ).setDisabled(true);
            formContext
                .getControl("header_process_ap_requerimientointerno_1")
                .setVisible(false);
            formContext
                .getControl("header_process_ap_requerimientointerno_2")
                .setVisible(false);
            //formContext.getControl("header_process_ap_areadeequipo").setVisible(false);
            formContext.getControl("header_process_ap_regional").setVisible(false);
            formContext
                .getControl("header_process_ap_tiendaintervenida")
                .setVisible(false);
            formContext
                .getControl("header_process_ap_agenteasignado")
                .setVisible(false);

            formContext
                .getControl("header_process_ap_necesidaddeescalaraterceros")
                .setDisabled(true);
            formContext
                .getControl("header_process_ap_asignaciondecasoafabricanteexterno")
                .setDisabled(true);
            formContext
                .getControl("header_process_ap_numerocasodelfabricanteexterno")
                .setDisabled(true);
            formContext
                .getControl("header_process_ap_areadeequipo")
                .setDisabled(true);
            formContext
                .getControl("header_process_ap_areadeequipo_1")
                .setDisabled(true);
            formContext
                .getControl("header_process_contractservicelevelcode")
                .setDisabled(true);
            formContext
                .getControl("header_process_ap_equipoasignado")
                .setDisabled(true);
            formContext.getControl("header_process_ap_asignarcaso").setDisabled(true);
            formContext.getControl("header_process_ap_plataforma").setDisabled(true);
            if (
                formContext.getControl("header_process_ap_tiempofacturablesdelcasohrs")
            )
                formContext
                    .getControl("header_process_ap_tiempofacturablesdelcasohrs")
                    .setDisabled(true);
            if (formContext.getControl("header_process_entitlementid_1"))
                formContext
                    .getControl("header_process_entitlementid_1")
                    .setDisabled(true);
            // formContext.data.proce
        } catch (error) {
            console.log(error);
            console.log("error condicion //FORMULARIO CAC ");
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
        try {
            if (formContext.ui.getFormType() != 1)
                Xrm.Page.getControl(
                    "header_process_ap_requerimientointerno"
                ).setDisabled(true);
            formContext
                .getControl("header_process_ap_requerimientointerno_1")
                .setVisible(false);
            formContext
                .getControl("header_process_ap_requerimientointerno_2")
                .setVisible(false);
            //formContext.getControl("header_process_ap_areadeequipo").setVisible(false);
            formContext.getControl("header_process_ap_regional").setVisible(false);
            formContext
                .getControl("header_process_ap_agenteasignado")
                .setVisible(false);

            formContext
                .getControl("header_process_ap_necesidaddeescalaraterceros")
                .setDisabled(true);
            formContext
                .getControl("header_process_ap_asignaciondecasoafabricanteexterno")
                .setDisabled(true);
            formContext
                .getControl("header_process_ap_numerocasodelfabricanteexterno")
                .setDisabled(true);
            formContext
                .getControl("header_process_ap_areadeequipo")
                .setDisabled(true);
            formContext
                .getControl("header_process_ap_areadeequipo_1")
                .setDisabled(true);
            formContext
                .getControl("header_process_contractservicelevelcode")
                .setDisabled(true);
            formContext
                .getControl("header_process_ap_equipoasignado")
                .setDisabled(true);
            formContext.getControl("header_process_ap_asignarcaso").setDisabled(true);
            formContext.getControl("header_process_ap_plataforma").setDisabled(true);
            if (
                formContext.getControl("header_process_ap_tiempofacturablesdelcasohrs")
            )
                formContext
                    .getControl("header_process_ap_tiempofacturablesdelcasohrs")
                    .setDisabled(true);
            if (formContext.getControl("header_process_entitlementid_1"))
                formContext
                    .getControl("header_process_entitlementid_1")
                    .setDisabled(true);

            formContext
                .getControl("ap_tiendaintervenida")
                .getAttribute()
                .setRequiredLevel("required");

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
            console.log("entro CAS");

            if (formContext.ui.getFormType() != 1)
                formContext
                    .getControl("header_process_ap_requerimientointerno")
                    .setDisabled(true);

            if (formContext.getControl("header_process_ap_requerimientointerno_1"))
                formContext
                    .getControl("header_process_ap_requerimientointerno_1")
                    .setVisible(false);
            if (formContext.getControl("header_process_ap_requerimientointerno_2"))
                formContext
                    .getControl("header_process_ap_requerimientointerno_2")
                    .setVisible(false);
            if (formContext.getControl("header_process_ap_tiendaintervenida"))
                formContext
                    .getControl("header_process_ap_tiendaintervenida")
                    .setVisible(false);
            if (formContext.getControl("header_process_ap_agenteasignado"))
                formContext
                    .getControl("header_process_ap_agenteasignado")
                    .setVisible(false);
            //formContext.getControl("header_process_ap_areadeequipo").setVisible(false);
            if (formContext.getControl("header_process_ap_agenteasignados"))
                formContext
                    .getControl("header_process_ap_agenteasignados")
                    .setVisible(false);
            if (
                formContext.getControl("header_process_ap_necesidaddeescalaraterceros")
            )
                formContext
                    .getControl("header_process_ap_necesidaddeescalaraterceros")
                    .setDisabled(true);

            if (
                formContext.getControl(
                    "header_process_ap_asignaciondecasoafabricanteexterno"
                )
            )
                formContext
                    .getControl("header_process_ap_asignaciondecasoafabricanteexterno")
                    .setDisabled(true);
            if (
                formContext.getControl(
                    "header_process_ap_numerocasodelfabricanteexterno"
                )
            )
                formContext
                    .getControl("header_process_ap_numerocasodelfabricanteexterno")
                    .setDisabled(true);
            if (formContext.getControl("header_process_ap_areadeequipo"))
                formContext
                    .getControl("header_process_ap_areadeequipo")
                    .setDisabled(true);
            if (formContext.getControl("header_process_ap_areadeequipo_1"))
                formContext
                    .getControl("header_process_ap_areadeequipo_1")
                    .setDisabled(true);
            if (formContext.getControl("header_process_prioritycode"))
                formContext.getControl("header_process_prioritycode").setDisabled(true);
            if (formContext.getControl("header_process_ap_urgencia"))
                formContext.getControl("header_process_ap_urgencia").setDisabled(true);
            if (formContext.getControl("header_process_ap_impacto"))
                formContext.getControl("header_process_ap_impacto").setDisabled(true);
            if (formContext.getControl("header_process_ap_plataforma"))
                formContext
                    .getControl("header_process_ap_plataforma")
                    .setDisabled(true);
            if (formContext.getControl("header_process_contractservicelevelcode"))
                formContext
                    .getControl("header_process_contractservicelevelcode")
                    .setDisabled(true);
            if (formContext.getControl("header_process_ap_equipoasignado"))
                formContext
                    .getControl("header_process_ap_equipoasignado")
                    .setDisabled(true);
            if (formContext.getControl("header_process_ap_asignarcaso"))
                formContext
                    .getControl("header_process_ap_asignarcaso")
                    .setDisabled(true);
            if (formContext.getControl("ap_regional"))
                formContext
                    .getControl("ap_regional")
                    .getAttribute()
                    .setRequiredLevel("required");
            if (
                formContext.getControl("header_process_ap_tiempofacturablesdelcasohrs")
            )
                formContext
                    .getControl("header_process_ap_tiempofacturablesdelcasohrs")
                    .setDisabled(true);
            if (formContext.getControl("header_process_entitlementid_1"))
                formContext
                    .getControl("header_process_entitlementid_1")
                    .setDisabled(true);

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
            console.log("error condiciosn del cas");
        }
    }

    //FORMULARIO REQUERIMIENTOS INTERNOS
    if (FORM_NAME === FORM_REQUERIMIENTO) {
        console.log("entro INTERNO");

        try {
            console.log("Cambios en la cinta de proceso de requerimientos internos");
            if (formContext.ui.getFormType() != 1) {
                Xrm.Page.getControl(
                    "header_process_ap_requerimientointerno"
                ).setDisabled(true);
            }

            formContext
                .getControl("header_process_ap_requerimientointerno_1")
                .setVisible(false);
            formContext
                .getControl("header_process_ap_requerimientointerno_2")
                .setVisible(false);
            formContext
                .getControl("header_process_ap_requerimientointerno")
                .setVisible(false);
            formContext
                .getControl("header_process_ap_requerimientointerno")
                .setDisabled(true);
            formContext
                .getControl("ap_requerimientointerno")
                .getAttribute()
                .setRequiredLevel("required");
            formContext
                .getControl("header_process_ap_tiendaintervenida")
                .setVisible(false);
            //formContext.getControl("header_process_prioritycode").setVisible(false);
            //formContext.getControl("header_process_ap_urgencia").setVisible(false);
            //formContext.getControl("header_process_ap_impacto").setVisible(false);
            formContext
                .getControl("header_process_ap_finrealdeatencion")
                .setVisible(false);
            //formContext.getControl("header_process_ap_finrealdeatencion").setVisible(false);
            formContext
                .getControl("header_process_ap_solucionacargode")
                .setVisible(false);
            //formContext.getControl("header_process_adx_resolution").setVisible(false);
            formContext
                .getControl("header_process_ap_plataforma_1")
                .setVisible(false);
            formContext.getControl("header_process_ap_imputablea").setVisible(false);
            formContext.getControl("header_process_ap_regional").setVisible(false);
            formContext.getControl("header_process_casetypecode").setVisible(false);
            formContext
                .getControl("header_process_contractservicelevelcode")
                .setVisible(false);
            formContext
                .getControl("header_process_ap_tienecontrato")
                .setVisible(false);
            formContext
                .getControl("header_process_ap_procedimientodelcaso")
                .setVisible(false);
            formContext
                .getControl("header_process_entitlementid_1")
                .setVisible(false);
            formContext
                .getControl("header_process_ap_equipoasignado")
                .setVisible(false);
            formContext.getControl("header_process_ap_asignarcaso").setVisible(false);
            formContext
                .getControl("header_process_ap_areadeequipo")
                .setVisible(false);

            formContext
                .getControl("header_process_ap_necesidaddeescalaraterceros")
                .setDisabled(true);
            formContext
                .getControl("header_process_ap_asignaciondecasoafabricanteexterno")
                .setDisabled(true);
            formContext
                .getControl("header_process_ap_numerocasodelfabricanteexterno")
                .setDisabled(true);
            formContext.getControl("header_process_prioritycode").setDisabled(true);
            formContext.getControl("header_process_ap_urgencia").setDisabled(true);
            formContext.getControl("header_process_ap_impacto").setDisabled(true);
            formContext
                .getControl("header_process_contractservicelevelcode")
                .setDisabled(true);
            formContext
                .getControl("header_process_ap_equipoasignado")
                .setDisabled(true);
            formContext
                .getControl("header_process_ap_areadeequipo_1")
                .setDisabled(true);
            formContext.getControl("header_process_ap_asignarcaso").setDisabled(true);
            formContext.getControl("header_process_ap_plataforma").setDisabled(true);
            formContext
                .getControl("header_process_ap_tiempofacturablesdelcasohrs")
                .setDisabled(true);
            formContext
                .getControl("header_process_entitlementid_1")
                .setDisabled(true);

            //formContext.getControl("header_process_prioritycode").getAttribute().setRequiredLevel("required");
            //formContext.getControl("header_process_ap_urgencia").getAttribute().setRequiredLevel("required");
            //formContext.getControl("header_process_ap_impacto").getAttribute().setRequiredLevel("required");
            formContext
                .getControl("ap_asignarcaso")
                .getAttribute()
                .setRequiredLevel("required");
            formContext
                .getControl("ap_equipoasignado")
                .getAttribute()
                .setRequiredLevel("required");
            formContext
                .getControl("ap_areadeequipo")
                .getAttribute()
                .setRequiredLevel("required");
            formContext
                .getControl("header_process_entitlementid_1")
                .getAttribute()
                .setRequiredLevel("none");
            //formContext.getControl("header_process_prioritycode").getAttribute().setRequiredLevel("required");
            //formContext.getControl("header_process_ap_urgencia").getAttribute().setRequiredLevel("required");
            //formContext.getControl("header_process_ap_impacto").getAttribute().setRequiredLevel("required");
        } catch (error) {
            console.log(error);
            console.log(
                "Error en la condicion FORM_INTERNO DEL SCRIPT INCIDENT_FLUJO_DE_PROCESO"
            );
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
    formContext.data.process.addOnProcessStatusChange(
        enviarNotificacionCasoFinalizado
    );
    //}
} //FIN FUNCION MAIN

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
    // RevisiÃƒÆ’Ã‚Â³n trabajo 778.210.005
    // Listo para entregar 778.210.004
    // Cumplido 2
    // Asignado 1
    try {
        let formContext = executionContext.getFormContext();
        let faseActiva = formContext.data.process.getActiveStage(); //Capturar la fase en la que se encuentra
        let razon_para_el_estado = formContext.getAttribute("statuscode");
        let statecode = formContext.getAttribute("statecode");
        let fase = faseActiva.getName(); // capturas la fase como tal, el nombre

        console.log(faseActiva);
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
            bloquearCampos(executionContext);
            Xrm.Page.data.entity.save();
        }
        if (fase === "Diagnostico") {
            razon_para_el_estado.setValue(4);
            bloquearCampos(executionContext);
            Xrm.Page.data.entity.save();
        }
        if (fase === "Esperando Atencion De Terceros") {
            razon_para_el_estado.setValue(3);
            bloquearCampos(executionContext);
            Xrm.Page.data.entity.save();
        }

        if (fase === "Revision Trabajo") {
            razon_para_el_estado.setValue(778210005);
            bloquearCampos(executionContext);
            Xrm.Page.data.entity.save();
        }

        if (fase === "Listo Para Entregar") {
            razon_para_el_estado.setValue(778210004);
            bloquearCampos(executionContext);
            Xrm.Page.data.entity.save();
        }

        if (fase === "Cumplido") {
            razon_para_el_estado.setValue(2);
            bloquearCampos(executionContext);
            Xrm.Page.data.entity.save();
        }
    } catch (error) {
        var alertStrings = {
            confirmButtonLabel: "Yes",
            text: error,
            title: "Sample title",
        };
        var alertOptions = { height: 120, width: 260 };
        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
            function (success) {
                console.log("alerta cerrada");
            },
            function (error) {
                console.log(error);
            }
        );
    }
}

function ocultatTabIncident(executionContext) {
    try {
        let formContext = executionContext.getFormContext();
        console.log("Entro a remover las pestaÃƒÂ±as");
        console.log(formContext.ui.getFormType());
        if (
            formContext.ui.getFormType() === 1 ||
            formContext.ui.getFormType() === 0
        ) {
            if (formContext.ui.tabs.get("Validaciondeatencion"))
                formContext.ui.tabs.get("Validaciondeatencion").setVisible(false);
            if (formContext.ui.tabs.get("Detalledeasignacion"))
                formContext.ui.tabs.get("Detalledeasignacion").setVisible(false);
            if (formContext.ui.tabs.get("DiagnosticoyCausaRaiz"))
                formContext.ui.tabs.get("DiagnosticoyCausaRaiz").setVisible(false);
            if (formContext.ui.tabs.get("Actividadesdelcaso"))
                formContext.ui.tabs.get("Actividadesdelcaso").setVisible(false);
            if (formContext.ui.tabs.get("Detallederesolucion"))
                formContext.ui.tabs.get("Detallederesolucion").setVisible(false);
            if (formContext.ui.tabs.get("Dispositivos"))
                formContext.ui.tabs.get("Dispositivos").setVisible(false);
            if (formContext.ui.tabs.get("tab_6"))
                formContext.ui.tabs.get("tab_6").setVisible(false);
            if (formContext.ui.tabs.get("CASERELATIONSHIP_TAB"))
                formContext.ui.tabs.get("CASERELATIONSHIP_TAB").setVisible(false);
        }
    } catch (error) {
        console.log(error);
        console.log("error function ocultarTabIncident");
    }
}

function ver(executionContext) {
    let formContext = executionContext.getFormContext();
    console.log("entro visibilidadPesta");
    if (formContext.data.entity.getId()) {
        if (formContext.ui.tabs.get("Validaciondeatencion"))
            formContext.ui.tabs.get("Validaciondeatencion").setVisible(true);
        if (formContext.ui.tabs.get("Detalledeasignacion"))
            formContext.ui.tabs.get("Detalledeasignacion").setVisible(true);
        if (formContext.ui.tabs.get("DiagnosticoyCausaRaiz"))
            formContext.ui.tabs.get("DiagnosticoyCausaRaiz").setVisible(true);
        if (formContext.ui.tabs.get("Actividadesdelcaso"))
            formContext.ui.tabs.get("Actividadesdelcaso").setVisible(true);
        if (formContext.ui.tabs.get("Detallederesolucion"))
            formContext.ui.tabs.get("Detallederesolucion").setVisible(true);
        if (formContext.ui.tabs.get("Dispositivos"))
            formContext.ui.tabs.get("Dispositivos").setVisible(true);
        if (formContext.ui.tabs.get("tab_6"))
            formContext.ui.tabs.get("tab_6").setVisible(true);
        if (formContext.ui.tabs.get("CASERELATIONSHIP_TAB"))
            formContext.ui.tabs.get("CASERELATIONSHIP_TAB").setVisible(true);
    }
}

function pruebaPrevent(executionContext) {
    let formContext = executionContext.getFormContext();
    console.log(formContext);
}

function onLoadChangeApCategoria(executionContext) {
    try {
        let formContext = executionContext.getFormContext();

        let ap_categoria = formContext.getAttribute("ap_categoria");
        if (ap_categoria) ap_categoria.addOnChange(changeAp_categoria);
    } catch (error) {
        console.log(
            "errror en la funcion change_Apcategoria en el script incident_flujodeprocesos_Actualizado"
        );
    }
}

function changeAp_categoria(executionContext) {
    try {
        let formContext = executionContext.getFormContext();

        let ap_categoria = formContext.getAttribute("ap_categoria");
        let ap_aplicativo = formContext.getAttribute("ap_aplicativo");
        let ap_componentehw = formContext.getAttribute("ap_componentehw");
        let ap_componentessw = formContext.getAttribute("ap_componentessw");

        if (ap_aplicativo) ap_aplicativo.setValue(null);
        if (ap_componentehw) ap_componentehw.setValue(null);
        if (ap_componentessw) ap_componentessw.setValue(null);
    } catch (error) {
        console.log(
            "errror en la funcion change_Apcategoria en el script incident_flujodeprocesos_Actualizado"
        );
    }
}

function cambio(executionContext) {
    try {
        let formContext = executionContext.getFormContext();
        let ap_equipoasignado = formContext.getAttribute("ap_equipoasignado");
        let ap_asignarcaso = formContext.getControl("ap_asignarcaso");
        if (ap_equipoasignado.getValue()) ap_asignarcaso.setDisabled(false);
    } catch (error) {
        console.log(error);
    }
}

//bloquear campos de la cinta de procesos
function bloquearCampos(exetucionContext) {
    try {
        let formContext = exetucionContext.getFormContext();
        let statuscode = formContext.getAttribute("statuscode");
        const BPF_ESTADO_CUMPLIDO = "627e1aca-0b86-40d7-9755-1a3060ca56c9";

        if (
            statuscode.getValue() === 2 &&
            formContext.data.process.getActiveProcess().getId() ===
            BPF_ESTADO_CUMPLIDO &&
            formContext.data.process.getStatus() === "finished"
        ) {
            formContext.data.entity.attributes.forEach((e) => {
                e.controls.get(0).setDisabled(true);
            });
        }
    } catch (error) {
        console.log(error);
    }

    // else {
    //     formContext.data.entity.attributes.forEach((e) => {
    //         e.controls.get(0).setDisabled(false);
    //     });
    // }
}

//esta funcion se va ejecutar cuando el estaado de la BPF === FINALIZADO && la fasePBF ===  CUMPLIDA  && statuscode === CUMPLIDO
function enviarNotificacionCasoFinalizado(executionContext) {
    try {
        const BPF_ESTADO_CUMPLIDO = "627e1aca-0b86-40d7-9755-1a3060ca56c9";
        let url =
            "https://prod-20.brazilsouth.logic.azure.com:443/workflows/7383d3feda52424694d85a216f56f961/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0K3j0Ez4Vx2z_3WjK_RoqZvr1v92A89kZS36Gfegb0g";
        let formContext = executionContext.getFormContext();
        let statuscode = formContext.getAttribute("statuscode");
        let stateBPF = formContext.data.process.getStatus();

        if (
            stateBPF === "finished" &&
            formContext.data.process.getActiveProcess().getId() ===
            BPF_ESTADO_CUMPLIDO &&
            statuscode.getValue() === 2
        ) {
            let data = {
                id: formContext.data.entity.getId().slice(1, 37),
            };
            let req = new XMLHttpRequest();
            req.open("POST", url, true);
            req.setRequestHeader("Content-Type", "application/json");
            req.send(JSON.stringify(data));
            bloquearCampos(executionContext);
        }
    } catch (error) {
        console.log(error);
        console.log(
            "Se presenta error en la function enviarNotificacionCasoFinalizado , archivo incident_flujo_de_proceso"
        );
    }
}