function set_ap_requerimientointerno(executionContext) {
    try {
        let formContext = executionContext.getFormContext();
        let FORM_CURRENT = formContext.ui.formSelector.getCurrentItem();
        let FORM_REQUERIMIENTO = "Caso Requerimiento Interno";
        let ap_equipoasignado = formContext.getAttribute("ap_equipoasignado");

        var equipo1 = [{
            entityType: "team",
            id: "{28C87D00-A7F4-EB11-94EF-002248370AE9}",
            name: "Coordinadores de Requerimientos internos"
        }]


        if (formContext.ui.getFormType() === 1) {
            if (FORM_CURRENT.getLabel() === FORM_REQUERIMIENTO) {
                let ap_requerimientointerno = formContext.getAttribute(
                    "ap_requerimientointerno"
                );

                if (ap_requerimientointerno) {
                    ap_requerimientointerno.setValue(true);
                    formContext.getControl("ap_requerimientointerno").setDisabled(true);
                }
                if (ap_equipoasignado) {
                    ap_equipoasignado.setValue(equipo1);
                    formContext.getControl("ap_equipoasignado").setDisabled(true);
                }
            }
        }
    } catch (error) {
        console.log(error);
        console.log("error en scriot incident_ap_requerimientointerno_setValue.js");
    }
}
