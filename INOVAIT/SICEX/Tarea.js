function produccion(executionContext) {

    let formContext = executionContext.getFormContext();
    console.log(formContext);
}


var IniciarTarea = {

    loadForm: function (executionContext) {

        try {
            let formContext = executionContext.getFormContext();
            formContext.getAttribute("statecode").addOnChange(this.faseInicialBPF);
        } catch (error) {
            console.log(error);
        }
    },

    bloquearCampos: async function (executionContext) {

        try {

            let formContext = executionContext.getFormContext();

            //escuchamos el cambio de fase 
            formContext.data.process.addOnStageChange(IniciarTarea.avanzarBPF);

            let usersettings = Xrm.Utility.getGlobalContext().userSettings;
            let currentUser = usersettings.userId.slice(1, 37).toLowerCase();
            console.log(currentUser);


            let idTask = formContext.data.entity.getId().slice(1, 37).toLowerCase();
            let resTarea = await script_global.consultarEntidadId(idTask, 'task');
            console.log(resTarea);


            let header_statuscode = formContext.getControl("header_process_statuscode");
            let header_invt_tarearevisada = formContext.getControl("header_process_invt_tarearevisada");




            header_statuscode.setDisabled(true);
            if (currentUser != resTarea._createdby_value) {
                header_invt_tarearevisada.setDisabled(true);
            } else {
                header_invt_tarearevisada.setDisabled(false);
            }

            formContext.getAttribute("statuscode").setSubmitMode("always")

        } catch (error) {
            console.log(error);
        }



    },
    avanzarBPF: function (executionContext) {

        try {


            let formContext = executionContext.getFormContext();
            let header_statuscode = formContext.getControl("header_process_statuscode");
            let faseActiva = formContext.data.process.getActiveStage(); // capturamos la fase activa
            let faseNombre = faseActiva.getName(); // capturamos el nombre de la fase
            let invt_control_statuscode = formContext.getControl("invt_control_statuscode");

            console.log(faseNombre);

            if (faseNombre === "En Revision") {
                header_statuscode.getAttribute().setValue(124510000);
                invt_control_statuscode.getAttribute().setValue("124510000");
                formContext.data.entity.save();
            }

        } catch (error) {
            console.log("avanzarBPF");
            console.log(error);
        }
    },


    faseInicialBPF: function (executionContext) {

        try {

            let idFaseParaHacer = "93baf039-3759-4078-8f6a-c8e2d4aae129";
            console.log(executionContext);
            let formContext = executionContext.getFormContext();
            console.log(formContext.getAttribute("statecode").getValue());


            if (formContext.getAttribute("statecode").getValue() === 0) {
                Xrm.Page.data.process.setActiveStage("93baf039-3759-4078-8f6a-c8e2d4aae129", updatePage);
                function updatePage(executionContext) {
                    formContext.data.refresh(true);
                }
            }
        } catch (error) {
            console.log(error);
        }
    },

    showFieldsByFrecuency: function () {
        var frecuency = Xrm.Page.getAttribute("sc_frecuencia").getValue();
        console.log("Frecuency: " + frecuency);

        //Otros
        if (frecuency == 947960000) {
            Xrm.Page.getControl("sc_dias").setDisabled(false);
            Xrm.Page.getControl("sc_dias").setVisible(true);
            Xrm.Page.getAttribute("sc_dias").setRequiredLevel("required");
        }
        else {
            Xrm.Page.getControl("sc_dias").setDisabled(true);
            Xrm.Page.getControl("sc_dias").setVisible(false);
            Xrm.Page.getAttribute("sc_dias").setRequiredLevel("none");
            Xrm.Page.getAttribute("sc_dias").setValue("");
        }

        var days = Xrm.Page.getAttribute("sc_dias").getValue();
        console.log("Days: " + days);

        var typ = typeof days;
        console.log("Days: " + typ);

        if (days == null) { }
        else {
            Xrm.Page.getAttribute("sc_daysstring").setValue(days.toString());
        }
    }

}




