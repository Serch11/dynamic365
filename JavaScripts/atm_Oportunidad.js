if (typeof VENTAS === "undefined") {
    VENTAS = {};
    VENTAS.JS = {};
}

if (typeof VENTAS.JS === "undefined") {
    VENTAS.JS = {};
}

const OPORTUNIDAD = {
    CAMPOS: {
        STATECODE: "statecode",
        STATUSCODE: "statuscode"
    },
    ID: Xrm.Page.data.entity.getId(),
    NOMBRE: Xrm.Page.data.entity.getEntityName()
}

VENTAS.JS.Oportunidad = {}

VENTAS.JS.Oportunidad.OnLoad = function (executionContext) {
    "use strict";
    let formContext = executionContext.getFormContext();
    formContext.getAttribute(OPORTUNIDAD.CAMPOS.STATUSCODE).fireOnChange();
}

VENTAS.JS.Oportunidad.BloquearTodosLosCampos = async function (executionContext) {
    "use strict";  
    try {
        let formContext = executionContext.getFormContext();
        let formControls = formContext.ui.controls;

        if (formContext.getAttribute(OPORTUNIDAD.CAMPOS.STATECODE).getValue() === 0 && formContext.getAttribute(OPORTUNIDAD.CAMPOS.STATUSCODE).getValue() === 6) {
            formControls.forEach(control => {
                if (control.getName() != "" && control.getName() != null) {
                    control.setDisabled(true);
                }
            });
            let mensaje = "Solo lectura: estado de este registro: Pendiente aprobación"
            formContext.ui.setFormNotification(mensaje, "INFO", "OPORTUNIDADREAD");
        }
    } catch (error) {
        console.log(error);
    }
}


VENTAS.JS.Oportunidad.CierreOportunidad = async function (executionContext) {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();
        if (FORM_TYPE.CREATE === formContext.ui.getFormType()) {
            if (formContext.getAttribute("opportunitystatecode").getValue() === 1) {
                formContext.getControl("opportunityid").setDisabled(true);
                formContext.getControl('competitorid').setVisible(false);
                formContext.getControl('description').setDisabled(false);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

VENTAS.JS.Oportunidad.ValidarEstadoOportunidad = function (entidad, primarycontrol) {
    "use strict";
    console.log(entidad);
    console.log(primarycontrol);
    let formContext = primarycontrol;
    let ok = false;

    if (entidad === "account") {
        ok = true;
    }
    if (entidad === "opportunity" && formContext.getAttribute("statuscode").getValue() === 7) {
        ok = true;
    }
    return ok;
}

VENTAS.JS.Oportunidad.ValidarEstadoLineaOportunidad = function (primarycontrol) {
    "use strict";

    console.log(primarycontrol);
    let formContext = primarycontrol;
    console.log(formContext.getAttribute("statuscode"));
    let ok = false;
    if (formContext.getAttribute("statuscode").getValue() != 6) {
        ok = true;
    }
    return ok;
}



