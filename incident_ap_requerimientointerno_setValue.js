function set_ap_requerimientointerno(executionContext) {

    try {
        let formContext = executionContext.getFormContext();
        let FORM_CURRENT = formContext.ui.formSelector.getCurrentItem();
        let FORM_REQUERIMIENTO = "Caso Requerimiento Interno";
        if (FORM_CURRENT === FORM_REQUERIMIENTO) {
            let ap_requerimientointerno = formContext.getAttribute("ap_requerimientointerno");
            if (ap_requerimientointerno) {
                console.log(FORM_CURRENT);
                console.log(ap_requerimientointerno);
                ap_requerimientointerno.setValue(true);
            }
        }
    } catch (error) {
        console.log(error);
    }

}