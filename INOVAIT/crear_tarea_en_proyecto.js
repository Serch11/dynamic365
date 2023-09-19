
var crear_tarea_en_proyecto = {

    validarRegarding: async function (executionContext) {
        try {

            let formContext = executionContext.getFormContext();
            let regardingobjectid = formContext.getAttribute("regardingobjectid");
            let description = formContext.getAttribute("description");
            let invt_actividaddeproyecto = formContext.getAttribute("invt_actividaddeproyecto");
            let scheduledend = formContext.getAttribute("scheduledend");

            if (regardingobjectid.getValue()) {
                console.log(regardingobjectid.getValue()[0]);
                if (regardingobjectid.getValue()[0].entityType === "msdyn_project") {
                    formContext.getControl('invt_actividaddeproyecto').setVisible(true);
                    description.setRequiredLevel("required");
                    invt_actividaddeproyecto.setRequiredLevel("required");
                    scheduledend.setRequiredLevel("required");
                }

            } else {
                formContext.getControl('invt_actividaddeproyecto').setVisible(false);
                description.setRequiredLevel("none");
                invt_actividaddeproyecto.setRequiredLevel("none");
                scheduledend.setRequiredLevel("none");
                invt_actividaddeproyecto.setValue(null);
            }

        } catch (error) {
            console.log(error);
        }
    }

}