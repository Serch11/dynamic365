//inicializamos todas las funciones que se ejecutaran en la carga de la entidad
function loadFunctionSalesOrder(executionContext) {
    let formContext = executionContext.getFormContext();
    if (formContext.ui.getFormType() != 1) disabledNameSaved(executionContext);
    formContext.data.process.addOnStageChange(changeStateSaleOrder);

    changeEnergiaAndConectividad(executionContext);
    formContext
        .getAttribute("rd_energiayconectividad")
        .addOnChange(changeEnergiaAndConectividad);
}

function disabledNameSaved(executionContext) {
    try {
        let formContext = executionContext.getFormContext();
        let name = formContext.getControl("name");
        name.setDisabled(true);
    } catch (error) {
        console.log("disabledNameSavedY");
    }
}

function changeStateSaleOrder(executionContext) {
    try {
        /**
         *
         * In Elaboration  899,080,000                           1
         * In Review  899,080,001                                2 
         * Pending for Purcharses 899,080,002                    3
         *
         *
         * Pending to receive 899,080,003                         4
         * Pending invoice  899,080,004                           5 
         * Partial Invoiced / billing 899,080,005                           6
         * Invoiced 899,080,006                                   7 
         * Operational area 899,080,007                           8
         * Stopped in shopping 899,080,008                        9
         *
         */

        let formContext = executionContext.getFormContext();
        var objEstado = formContext.data.process.getActiveStage();
        var estado = formContext.getAttribute("statuscode");
        var estate = formContext.getAttribute("billto_line3");
        var statecode = formContext.getAttribute("statecode");
        var fase = objEstado.getName();

        //alert("JS Estado Pedido: Fase = "+fase);
        console.log("JS Estado Pedido: Fase = " + fase);

        if (fase === "In Elaboration") {
            estado.setValue(899080000);
            estate.setValue("899080000");
            Xrm.Page.data.entity.save();
        }
        if (fase === "In Review") {
            estado.setValue(899080001);
            estate.setValue("899080001");
            Xrm.Page.data.entity.save();
        }
        if (fase === "Operational Area") {
            estado.setValue(899080007);
            estate.setValue("899080007");
            Xrm.Page.data.entity.save();
        }
        if (fase === "Pending For Purchases") {
            estado.setValue(899080002);
            estate.setValue("899080002");
            Xrm.Page.data.entity.save();
        }
        if (fase === "Stopped In Shopping") {
            estado.setValue(899080008);
            estate.setValue("899080008");
            Xrm.Page.data.entity.save();
        }
        if (fase === "Pending To Receive") {
            estado.setValue(899080003);
            estate.setValue("899080003");
            Xrm.Page.data.entity.save();
        }
        if (fase === "Pending Invoice") {
            estado.setValue(899080004);
            estate.setValue("899080004");
            Xrm.Page.data.entity.save();
        }
        if (fase === "Partial Billing") {
            estado.setValue(899080005);
            estate.setValue("899080005");
            Xrm.Page.data.entity.save();
        }
        if (fase === "Invoiced") {
            estado.setValue(899080006);
            estate.setValue("899080006");
            Xrm.Page.data.entity.save();
        }
        console.log("Estado Pedido: " + estado.getValue());
        console.log(estate.getValue());
    } catch (error) {
        console.log("changeStateSaleOrder");
    }
}

function changeEnergiaAndConectividad(executionContext) {
    let formContext = executionContext.getFormContext();
    let rd_energiayconectividad = formContext.getAttribute(
        "rd_energiayconectividad"
    );
    let rd_mantenimientoce = formContext.getControl("rd_mantenimientoce");
    let rd_servicioexternoeyc = formContext.getControl("rd_servicioexternoeyc");
    let rd_serviciointernoeyc = formContext.getControl("rd_serviciointernoeyc");

    if (rd_energiayconectividad.getValue()) {
        formContext.getControl("rd_mantenimientoce").setVisible(true);
        rd_servicioexternoeyc.setVisible(true);
        rd_serviciointernoeyc.setVisible(true);
    } else {
        formContext.getControl("rd_mantenimientoce").setVisible(false);
        rd_servicioexternoeyc.setVisible(false);
        rd_serviciointernoeyc.setVisible(false);
    }
}

function setiarValorEnCero(exectutioncontext) {
    let formContext = exectutioncontext.getFormContext();
    let nombrecampo = formContext.getAttribute("nombrecampo");
    //if (formContext.ui.getFormType() === 1) si es igual a 1 es un registro nuevo
    if (formContext.ui.getFormType() === 1) {
        //valido que si exista el campo en el formulario
        if (nombrecampo) nombrecampo.setValue(0);
    }
}