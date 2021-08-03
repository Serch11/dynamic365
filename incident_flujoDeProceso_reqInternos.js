function getProcess(executeContext) {


    let FORM_REQUERIMIENTO = "Caso Requerimiento Interno";
    let formContext = executeContext.getFormContext();
    let NAME_BPF_REQ = "Caso cinta de proceso requerimientos internos";
    let FORM_ACTIVE = formContext.ui.formSelector.getCurrentItem().getLabel();
    let ID_PROCES_CASO_REQUERIMIENTO = "0d7e7b55-5654-49fd-bf66-78fb5d17e4ab";


    if (FORM_REQUERIMIENTO === FORM_ACTIVE) {


        console.log(FORM_ACTIVE);

        formContext.data.process.setActiveProcess(ID_PROCES_CASO_REQUERIMIENTO, CALLBACK_REQINTERNOS);

        function CALLBACK_REQINTERNOS(result) {
            if (result === "success") {
                let ActiveProcess = formContext.data.process.getActiveProcess();
                let NameActiveProcess = ActiveProcess.getName();


                if (NameActiveProcess === NAME_BPF_REQ) {
                    console.log(ActiveProcess);
                    console.log(NameActiveProcess);
                    formContext.getControl("header_process_ap_regional").setVisible(false);
                }
            }
        }
        formContext.data.process.addOnStageChange(cambioStage);
    }

}