if (typeof VENTAS === "undefined") {
    VENTAS = {};
    VENTAS.JS = {};
}

if (typeof VENTAS.JS === "undefined") {
    VENTAS.JS = {};
}

VENTAS.JS.FrecuenciaRecoleccion = {}

const FR = {
    NOMBRE_LOGICO: "atm_frecuenciarecoleccion",
    CAMPOS: {
        ATM_DIACODE: "atm_diacode",
        ATM_DIASCODE: "atm_diascode",
        ATM_MESCODE: "atm_mescode",
        ATM_MISMO: "atm_mismo",
        ATM_NAME: "atm_name",
        ATM_REFERENTEAID: "atm_referenteaid",
        ATM_REPETIRCODE: "atm_repetircode",
        ATM_SEMANACODE: "atm_semanacode",
        ATM_DIRECCIONID: "atm_direccionid"
    }
}

VENTAS.JS.FrecuenciaRecoleccion.CambiarRepetir = async function (executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();

    let atm_repetircode = formContext.getAttribute(FR.CAMPOS.ATM_REPETIRCODE).getValue();
    let atm_mismo = formContext.getAttribute(FR.CAMPOS.ATM_MISMO);

    switch (atm_repetircode) {
        case 0:
            asignarLimpiar(formContext, FR.CAMPOS.ATM_DIASCODE, false);
            asignarLimpiar(formContext, FR.CAMPOS.ATM_MISMO, false);
            asignarLimpiar(formContext, FR.CAMPOS.ATM_DIACODE, false);
            asignarLimpiar(formContext, FR.CAMPOS.ATM_SEMANACODE, false);
            asignarLimpiar(formContext, FR.CAMPOS.ATM_MESCODE, false);
            break;
        case 1:
            asignarLimpiar(formContext, FR.CAMPOS.ATM_DIASCODE, true);
            asignarLimpiar(formContext, FR.CAMPOS.ATM_MISMO, false);
            asignarLimpiar(formContext, FR.CAMPOS.ATM_DIACODE, false);
            asignarLimpiar(formContext, FR.CAMPOS.ATM_SEMANACODE, false);
            asignarLimpiar(formContext, FR.CAMPOS.ATM_MESCODE, false);
            break;
        case 2:
            asignarLimpiar(formContext, FR.CAMPOS.ATM_DIASCODE, false);
            asignarLimpiar(formContext, FR.CAMPOS.ATM_MISMO, true);
            asignarLimpiar(formContext, FR.CAMPOS.ATM_DIACODE, true);
            asignarLimpiar(formContext, FR.CAMPOS.ATM_MESCODE, false);
            asignarLimpiar(formContext, FR.CAMPOS.ATM_SEMANACODE, false);
            atm_mismo.setValue(false);
            break;
        case 3:
            asignarLimpiar(formContext, FR.CAMPOS.ATM_DIASCODE, false);
            asignarLimpiar(formContext, FR.CAMPOS.ATM_MISMO, true);
            asignarLimpiar(formContext, FR.CAMPOS.ATM_DIACODE, true);
            asignarLimpiar(formContext, FR.CAMPOS.ATM_MESCODE, true);
            asignarLimpiar(formContext, FR.CAMPOS.ATM_SEMANACODE, false);
            atm_mismo.setValue(false);
            break;
    }
}


VENTAS.JS.FrecuenciaRecoleccion.CambiarMismo = async function (executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();
    let atm_repetircode = formContext.getAttribute(FR.CAMPOS.ATM_REPETIRCODE).getValue();
    let atm_mismo = formContext.getAttribute(FR.CAMPOS.ATM_MISMO).getValue();

    switch (atm_repetircode) {
        case 2:
            asignarLimpiar(formContext, FR.CAMPOS.ATM_SEMANACODE, !atm_mismo ? false : true);
            asignarLimpiar(formContext, FR.CAMPOS.ATM_MESCODE, false);
            break;
        case 3:
            asignarLimpiar(formContext, FR.CAMPOS.ATM_SEMANACODE, !atm_mismo ? false : true);
            asignarLimpiar(formContext, FR.CAMPOS.ATM_MESCODE, true);
            break;
    }
}

VENTAS.JS.FrecuenciaRecoleccion.CargarFR = async function (executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();
    let atm_referenteaid = formContext.getAttribute(FR.CAMPOS.ATM_REFERENTEAID).getValue()[0].id.replace('{', '').replace('}', '');
    let registros = await VENTAS.JS.Comun.ConsultarMultiplesEntidades(FR.NOMBRE_LOGICO, `?$select=atm_frecuenciarecoleccionid&$filter=(_atm_referenteaid_value eq ${atm_referenteaid})`);
    formContext.getAttribute(FR.CAMPOS.ATM_NAME).setValue(`Frecuencia recolección #${registros.entities.length + 1}`);
}

VENTAS.JS.FrecuenciaRecoleccion.FiltrarDirección = async function (executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();
    let atm_referenteaid = formContext.getAttribute(FR.CAMPOS.ATM_REFERENTEAID).getValue()[0].id.replace('{', '').replace('}', '');
    var control = formContext.getControl(FR.CAMPOS.ATM_DIRECCIONID);

    control.addPreSearch(function () {
        var filter = `<filter type="and"><condition attribute="statecode" operator="eq" value="0"/><condition attribute="atm_cuentaid" operator="eq" value="${atm_referenteaid}" uitype="account"/></filter>`;
        control.addCustomFilter(filter);
    });

}

function asignarLimpiar(formContext, nombre, valor) {
    formContext.getControl(nombre).setVisible(valor);

    if (!valor) {
        formContext.getAttribute(nombre).setValue(null);
        formContext.getAttribute(nombre).setRequiredLevel(REQUIRED_LEVEL.NONE);
    } else {
        formContext.getAttribute(nombre).setRequiredLevel(REQUIRED_LEVEL.REQUIRED);
    }
}