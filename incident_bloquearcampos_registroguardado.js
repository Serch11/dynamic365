function bloquearCamposIncidet(executionContext) {


    try {


        let formContext = executionContext.getFormContext();
        let customerid = formContext.getControl("customerid");
        let title = formContext.getControl("title");
        let description = formContext.getControl("description");
        let primarycontactid = formContext.getControl("primarycontactid");



        if (formContext.ui.getFormType() != 1) {
            customerid.setDisabled(true);
            title.setDisabled(true);
            description.setDisabled(true);
            primarycontactid.setDisabled(true);
        }

    } catch (error) {
        console.log(error);
        console.log("errror funcion bloquearCamposIncidet script incident_bloquearcampos.js");
    }
}