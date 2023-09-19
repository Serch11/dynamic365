if (typeof VENTAS === "undefined") {
    VENTAS = {};
    VENTAS.JS = {};
}
if (typeof VENTAS.JS === "undefined") {
    VENTAS.JS = {};
}

VENTAS.JS.PLanAccion = {};

const PLANACCION = {
    CAMPOS: {
        ATM_NOMBRE: "atm_nombre",
        ATM_TIPOPLANDEACCIONCODE: "atm_tipoplandeaccioncode",
        ATM_FECHAESPERADADECIERRE: "atm_fechaesperadadecierre",
        OWNERID: "ownerid",
        ATM_FECHAREALCIERRE: "atm_fecharealcierre",
        ATM_DESCRIPCION: "atm_descripcion",
        ATM_LECCIONESAPRENDIDAS: "atm_leccionesaprendidas",
        STATUSCODE: "statuscode",
        CREATEDON: "createdon"

    },
    OPCIONES: {
        MEJORACONTINUA: 963540000,
        ACCIÓNINMEDIATA: 963540001,
        STATUSCODE: {
            ACTIVO: 1,
            INACTIVO: 2,
            CERRADO: 963540000,
        },
        STATECODE: {
            ACTIVO: 0,
            INACTIVO: 1
        }
    },
    PESTAÑAS: {

    },
    SECCION: {

    }
};

VENTAS.JS.PLanAccion.BloquearCamposRegistroCreado = function (executionContext) {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();

        if (formContext.ui.getFormType() === FORM_TYPE.UPDATE) {
            Xrm.Page.getControl(PLANACCION.CAMPOS.ATM_TIPOPLANDEACCIONCODE).setDisabled(true);
        }

    } catch (error) {

    }
}

VENTAS.JS.PLanAccion.RestringirFechaEstimadaDeCierrePorTipoPlanAccion = async function (executionContext) {
    "use strict";
    try {

        const DIA_ACTUAL = new Date();
        const UN_DIA_EN_MILISEGUNDOS = 24 * 60 * 60 * 1000;
        const INTERVALO = UN_DIA_EN_MILISEGUNDOS * 1;
        const FORMATEADORFECHA = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', });
        let contDias = 0;

        let formContext = executionContext.getFormContext();
        let atm_fechaesperadadecierre = formContext.getControl(PLANACCION.CAMPOS.ATM_FECHAESPERADADECIERRE);
        let createdon = formContext.getAttribute(PLANACCION.CAMPOS.CREATEDON);


        if (DIA_ACTUAL.getTime() < atm_fechaesperadadecierre.getAttribute().getValue().getTime()) {
            if (formContext.getAttribute(PLANACCION.CAMPOS.ATM_TIPOPLANDEACCIONCODE).getValue() === PLANACCION.OPCIONES.ACCIÓNINMEDIATA) {

                const DIAS_TRANSCURRIDOS_EN_MILISEGUNDOS = Math.abs(atm_fechaesperadadecierre.getAttribute().getValue().getTime() - DIA_ACTUAL.getTime())
                const DIAS_TRANSCURRIDOS = Math.round(DIAS_TRANSCURRIDOS_EN_MILISEGUNDOS / UN_DIA_EN_MILISEGUNDOS);

                for (let index = DIA_ACTUAL; index <= atm_fechaesperadadecierre.getAttribute().getValue().getTime(); index = new Date(index.getTime() + INTERVALO)) {

                    if (index.getDay() === 0) {
                        contDias++;
                    }
                }

                const DIAS_TOTAL_TRANSCURRIDOS = (DIAS_TRANSCURRIDOS - 1) - contDias;
                console.log(DIAS_TOTAL_TRANSCURRIDOS);
                if (DIAS_TOTAL_TRANSCURRIDOS > 5) {
                    let res = await VENTAS.JS.Comun.OpenAlerDialog("Aceptar", "La fecha estimada de cierre no puede superar 5 dias habiles a la fecha de hoy");
                    formContext.getAttribute(PLANACCION.CAMPOS.ATM_FECHAESPERADADECIERRE).setValue(null);
                }
            }
        } else {
            let res = await VENTAS.JS.Comun.OpenAlerDialog("Aceptar", "La fecha estimada de cierre no puede ser mayor a la fecha de creacion");
            formContext.getAttribute(PLANACCION.CAMPOS.ATM_FECHAESPERADADECIERRE).setValue(null);
        }

    } catch (error) {
        
    }
};