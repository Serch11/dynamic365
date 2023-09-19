if (typeof VENTAS === "undefined") {
    VENTAS = {};
    VENTAS.JS = {};
}
if (typeof VENTAS.JS === "undefined") {
    VENTAS.JS = {};
}

VENTAS.JS.Recoleccion = {};


const RECOLECCION = {
    NOMBRE_LOGICO: "atm_recoleccion",
    CAMPOS: {
        REGARDINGOBJECTID: "regardingobjectid",
        ATM_DIRECCIONID: "atm_direccionid",
        SUBJECT: "subject",
        DESCRIPTION: "description",
        REQUIREDATTENDEES: "requiredattendees",
        SCHEDULEDSTART: "scheduledstart",
        SCHEDULEDEND: "scheduledend",
        ATM_FRANJAHORARIACODE: "atm_franjahorariacode",
        ATM_CREADAMODOOFFLINE: "atm_creadamodooffline",
        CREATEDON: "createdon"
    },
    PESTANAS: {
        general: "general"
    },
    SECCIONES: {
        cierre_recoleccion: "cierre_recoleccion"
    }
}

VENTAS.JS.Recoleccion.CrearConsecutivoRecoleccion = async function (executionContext) {
    "use strict";
    try {
        var formContext = executionContext.getFormContext();
        let regardingobjectid = formContext.getAttribute(RECOLECCION.CAMPOS.REGARDINGOBJECTID).getValue();
        var attr = "";
        let regarding = null;
        var control = formContext.getControl(RECOLECCION.CAMPOS.ATM_DIRECCIONID);
        let actRecoleccion;
        let oldid = "";
        let oldattr = "";
        let oldreg = null;
        let indicador = false;

        if (formContext.ui.getFormType() === FORM_TYPE.CREATE) {

            if (regardingobjectid) {
                let entityType = regardingobjectid[0].entityType;
                let id = regardingobjectid[0].id.replace('{', '').replace('}', '');
                indicador = true;
                oldid = id;
                oldreg = regardingobjectid[0];

                if (Xrm.Utility.getGlobalContext().client.getClientState() === CLIENT_STATE.OFFLINE) {

                    if (entityType === "account") {
                        attr = "atm_cuentaid";
                        oldattr = attr;
                        regarding = await VENTAS.JS.Comun.ConsultarRegistroOffline(entityType, id, "?$select=atm_idcuenta,_atm_regionalid_value&$expand=atm_regionalid($select=atm_nombre)");

                    } else if (entityType === "lead") {
                        attr = "atm_leadid";
                        regarding = await VENTAS.JS.Comun.ConsultarRegistroOffline(entityType, id, "?$select=atm_idcuenta");
                    }

                    let option = "?$select=activityid&$filter=(activitytypecode eq 'atm_recoleccion' and _regardingobjectid_value eq '" + id + "')";
                    actRecoleccion = await VENTAS.JS.Comun.ConsultarMultiplesEntidadesOffline(RECOLECCION.NOMBRE_LOGICO, option);

                } else {
                    if (entityType === "account") {
                        attr = "atm_cuentaid";
                        oldattr = attr;
                        regarding = await Xrm.WebApi.retrieveRecord(entityType, id, "?$select=atm_idcuenta,_atm_regionalid_value&$expand=atm_regionalid($select=atm_nombre)");
                    } else if (entityType === "lead") {
                        attr = "atm_leadid";
                        oldattr = attr;
                        regarding = await Xrm.WebApi.retrieveRecord(entityType, id, "?$select=atm_idcuenta");
                    }
                    actRecoleccion = await Xrm.WebApi.retrieveMultipleRecords(RECOLECCION.NOMBRE_LOGICO, "?$select=activityid&$filter=(activitytypecode eq 'atm_recoleccion' and _regardingobjectid_value eq '" + id + "')");
                }

                let idRegarding = regarding.atm_idcuenta ? regarding.atm_idcuenta : regarding.atm_idcuenta;

                formContext.getAttribute(RECOLECCION.CAMPOS.SUBJECT).setValue("AR_" + idRegarding + "_" + (actRecoleccion.entities.length + 1));
                formContext.getControl(RECOLECCION.CAMPOS.ATM_DIRECCIONID).addPreSearch(name);
            } else {
                indicador = false;
                formContext.getControl(RECOLECCION.CAMPOS.ATM_DIRECCIONID).removePreSearch(name);
            }
        }


        function name() {

            let filter = "";
            if (indicador) {
                filter = `<filter type="and"><condition attribute="${attr}" operator="eq" value="${regardingobjectid[0].id.replace('{', '').replace('}', '')}" /></filter>`;
            } else {
                filter = `<filter type="and"><condition attribute="${oldattr}" operator="eq" value="${oldid}" /></filter>`;
            }

            formContext.getControl(RECOLECCION.CAMPOS.ATM_DIRECCIONID).addCustomFilter(filter);
        }

    } catch (error) {
        console.log(error);
    }
}

VENTAS.JS.Recoleccion.BloquearCamposCrearRecoleccionFormPrincipal = function (executionContext) {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();
        formContext.getControl(RECOLECCION.CAMPOS.REGARDINGOBJECTID).setEntityTypes(['account', 'lead']);
        let regardingobjectid = formContext.getControl(RECOLECCION.CAMPOS.REGARDINGOBJECTID);
        let atm_direccionid = formContext.getControl(RECOLECCION.CAMPOS.ATM_DIRECCIONID);

        if (formContext.ui.getFormType() === FORM_TYPE.CREATE) {
            regardingobjectid.setDisabled(false);
            atm_direccionid.setDisabled(false);
            formContext.getAttribute(RECOLECCION.CAMPOS.REGARDINGOBJECTID).setRequiredLevel(REQUIRED_LEVEL.REQUIRED);
        } else {
            regardingobjectid.setDisabled(true);
            atm_direccionid.setDisabled(true);
        }
    } catch (error) {
        let alertStrings = { confirmButtonLabel: 'Ok', text: error };
        let alertOptions = { height: 120, width: 260 };
        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
    }
}

VENTAS.JS.Recoleccion.AbrirFormularioRecoleccion = async function (executionContext) {
    "use strict";
    try {
        let entityFormOptions = {
            entityName: 'atm_recoleccion',
            useQuickCreateForm: true
        };
        let formParameters = {}

        Xrm.Navigation.openForm(entityFormOptions, formParameters).then(
            function (result) { },
            function (error) { }
        );
    } catch (error) {

    }
}

VENTAS.JS.Recoleccion.AbrirRecoleccionCerrada = async function (primaryControl) {
    "use strict";
    let formContext = primaryControl;
    if (formContext.data.entity.getId() === null) {
        return;
    }
    Xrm.Utility.showProgressIndicator('Abriendo Recoleccion');
    try {
        let idRecoleccion = formContext.data.entity.getId().replace('{', '').replace('}', '');
        let recoleccion = {};
        recoleccion["statecode"] = 0;
        let res = await Xrm.WebApi.updateRecord('atm_recoleccion', idRecoleccion, recoleccion);
        if (res != null) {
            Xrm.Utility.closeProgressIndicator();
            formContext.data.refresh();
        }
    } catch (error) {
        Xrm.Utility.closeProgressIndicator();
        formContext.data.refresh();
    }
}

VENTAS.JS.Recoleccion.OcultarRecoleccionReal = function (executionContext) {
    "use strict";
    try {
        //Automundial - Coordinador de Logística
        let comprobador = false;
        let formContext = executionContext;
        let userRoles = Xrm.Utility.getGlobalContext().userSettings;

        if (Object.keys(userRoles.roles._collection).length > 0) {
            userRoles.roles.forEach(x => {
                if (x.name === "Automundial - Coordinador de Logística" || x.name === "Administrador del sistema") {
                    comprobador = true;
                }
            });
        }
        if (comprobador) {
            Xrm.Page.ui.tabs.get(RECOLECCION.PESTANAS.general).sections.get(RECOLECCION.SECCIONES.cierre_recoleccion).setVisible(true);
        } else {
            Xrm.Page.ui.tabs.get(RECOLECCION.PESTANAS.general).sections.get(RECOLECCION.SECCIONES.cierre_recoleccion).setVisible(false);
        }

    } catch (error) {
        MostrarCuadroError(error);
    }
}

VENTAS.JS.Recoleccion.MostrarNotificacionRecoleccion = function (executionContext) {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();
        let regardingobjectid = formContext.getAttribute(RECOLECCION.CAMPOS.REGARDINGOBJECTID);
        let mensajeRecoleccionLead = `Al crearse una actividad de recolección con un cliente potencial debe ser aclarado
                                        que el  pago de la recolección se hará de contado en caso de que un crédito 
                                        no sea aprobado.`;
        let mensajerecoleccion24hr = `La actividad de recolección se realizará en las próximas 24 hrs para las rutas 
                                        urbanas, para rutas fuera del perímetro urbano se deberá definir la fecha 
                                        según frecuencia de recolección asignada.`;

        if (formContext.ui.getFormType() === FORM_TYPE.CREATE) {

            formContext.ui.setFormNotification(mensajerecoleccion24hr, "INFO", "MENSAJERECOLECCION");

            if (regardingobjectid.getValue()) {
                if (regardingobjectid.getValue()[0]?.entityType === "lead") {
                    formContext.ui.setFormNotification(mensajeRecoleccionLead, "INFO", "MENSAJERECOLECCIONLEAD");
                }
            } else {

                formContext.ui.clearFormNotification("MENSAJERECOLECCIONLEAD");
            }
        }
    } catch (error) {

    }
}

VENTAS.JS.Recoleccion.AsistentesObligatorios = async function (executionContext) {
    "use strict";

    try {
        var formContext = executionContext.getFormContext();
        let atm_parametros = null;
        if (formContext.ui.getFormType() === FORM_TYPE.CREATE) {

            formContext.getAttribute(RECOLECCION.CAMPOS.REQUIREDATTENDEES).setValue(null);

            var ms = new Date().getTime() + 86400000;

            var tomorrow = new Date(ms);

            if (tomorrow.getDay() === 7) {
                tomorrow = AgregarDias(tomorrow, 1);
            }

            formContext.getAttribute(RECOLECCION.CAMPOS.SCHEDULEDSTART).setValue(tomorrow);
            formContext.getAttribute(RECOLECCION.CAMPOS.SCHEDULEDEND).setValue(tomorrow);

            if (Xrm.Utility.getGlobalContext().client.getClientState() === CLIENT_STATE.OFFLINE) { //offline
                atm_parametros = await VENTAS.JS.Comun.ConsultarMultiplesEntidadesOffline("atm_parametro", "?$select=atm_valor&$filter=atm_nombre eq 'ASISTENTELOGISTICA'");
                if (atm_parametros.entities.length > 0) {
                    for (let atm_parametro of atm_parametros.entities) {
                        let user = await VENTAS.JS.Comun.ConsultarMultiplesEntidadesOffline("systemuser", "?$select=systemuserid,fullname&$filter=domainname eq '" + atm_parametro.atm_valor + "'");
                        if (user.entities.length > 0) {
                            var lookup = new Array();
                            lookup[0] = new Object();
                            lookup[0].id = user.entities[0].systemuserid;
                            lookup[0].name = user.entities[0].fullname;
                            lookup[0].entityType = "systemuser";
                            formContext.getAttribute(RECOLECCION.CAMPOS.REQUIREDATTENDEES).setValue(lookup);
                        }
                    }

                } else {
                    MostrarCuadroError("No se encontró el parametro ASISTENTELOGISTICA");
                }
            } else { //online
                atm_parametros = await Xrm.WebApi.retrieveMultipleRecords("atm_parametro", "?$select=atm_valor&$filter=atm_nombre eq 'ASISTENTELOGISTICA'");
                if (atm_parametros.entities.length > 0) {
                    for (let atm_parametro of atm_parametros.entities) {
                        let user = await Xrm.WebApi.retrieveMultipleRecords("systemuser", "?$select=systemuserid,fullname&$filter=domainname eq '" + atm_parametro.atm_valor + "'");
                        if (user.entities.length > 0) {
                            var lookup = new Array();
                            lookup[0] = new Object();
                            lookup[0].id = user.entities[0].systemuserid;
                            lookup[0].name = user.entities[0].fullname;
                            lookup[0].entityType = "systemuser";
                            formContext.getAttribute(RECOLECCION.CAMPOS.REQUIREDATTENDEES).setValue(lookup);
                        }
                    }
                } else {
                    MostrarCuadroError("No se encontró el parametro ASISTENTELOGISTICA");
                }
            }
        }
    } catch (error) {

    }
}

VENTAS.JS.Recoleccion.ConfigurarFranjaHoraria = function (executionContext) {
    "use strict";

    var formContext = executionContext.getFormContext();
    let atm_franjahorariacode = formContext.getAttribute(RECOLECCION.CAMPOS.ATM_FRANJAHORARIACODE).getValue();

    let start = formContext.getAttribute(RECOLECCION.CAMPOS.SCHEDULEDSTART).getValue();
    let end = formContext.getAttribute(RECOLECCION.CAMPOS.SCHEDULEDEND).getValue();

    let newStart = new Date(start);
    let newEnd = new Date(end);

    switch (atm_franjahorariacode) {
        case Number(963540000):
            newStart.setHours(8, 0, 0, 0);
            newEnd.setHours(12, 0, 0, 0);
            break;
        case Number(963540001):
            newStart.setHours(13, 0, 0, 0);
            newEnd.setHours(17, 0, 0, 0);
            break;
        case Number(963540002):
            newStart.setHours(8, 0, 0, 0);
            newEnd.setHours(17, 0, 0, 0);
            break;
    }

    formContext.getAttribute(RECOLECCION.CAMPOS.SCHEDULEDSTART).setValue(newStart);
    formContext.getAttribute(RECOLECCION.CAMPOS.SCHEDULEDEND).setValue(newEnd);
}

VENTAS.JS.Recoleccion.CargarFormularioRecoleccion = function (executionContext) {
    try {
        let formContext = executionContext.getFormContext();
        if (Xrm.Utility.getGlobalContext().client.getClientState() === CLIENT_STATE.OFFLINE) {
            formContext.getAttribute(RECOLECCION.CAMPOS.ATM_CREADAMODOOFFLINE).setValue(true);
        }
    } catch (error) {
    }
}

VENTAS.JS.Recoleccion.VisualizarEstadoDeRelecoleccion = function (rowData) {
    "use strict";
    try {
        var imgName = "";
        var tooltip = "";
        let data = JSON.parse(rowData);

        if (data.scheduledstart) {
            let fActual = new Date(formatDate(new Date())).getTime();
            let fInicio = new Date(formatDate(new Date(data.scheduledstart_Value))).getTime();

            switch (data.statecode_Value) {
                case 1://completado
                    imgName = "atm_iconoverde";
                    tooltip = data.atm_ordenllegada
                    break;
                case 2://cancelado
                    imgName = "atm_icononegro";
                    tooltip = data.atm_ordenllegada;
                    break;
                case 0://abierto
                    if (fActual > fInicio) {
                        imgName = "atm_iconorojo";
                        tooltip = data.atm_ordenllegada_Value;
                    }
                    if (fActual < fInicio) {
                        imgName = "atm_iconoazul";
                        tooltip = data.atm_ordenllegada_Value;
                    }
                    if (fActual == fInicio) {
                        imgName = "atm_iconoamarillo";
                        tooltip = data.atm_ordenllegada_Value;
                    }
                default:
                    break;
            }
            return [imgName, tooltip];
        }
    } catch (error) {
        let alertStrings = { confirmButtonLabel: 'Ok', text: error };
        let alertOptions = { height: 120, width: 260 };
        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
    }
}

VENTAS.JS.Recoleccion.ValidarCambioFechaVencimiento = async function (executionContext) {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();
        let SCHEDULEDEND = formContext.getAttribute(RECOLECCION.CAMPOS.SCHEDULEDEND);
        let CREATEDON = formContext.getAttribute(RECOLECCION.CAMPOS.CREATEDON);
        let fechahoy = new Date();
        let mensaje = "La fecha de vencimiento no puede ser inferior a 24 horas despues de la creacion. los horarios de recoleccion seran modificados nuevamente.";

        if (SCHEDULEDEND.getValue()) {
            let nuevaFechaVencimiento = new Date(`${SCHEDULEDEND.getValue().getMonth() + 1}/${SCHEDULEDEND.getValue().getDate()}/${SCHEDULEDEND.getValue().getFullYear()}`);
            let nuevaFechaDeHoy = new Date(`${fechahoy.getMonth() + 1}/${fechahoy.getDate()}/${fechahoy.getFullYear()}`);

            if (FORM_TYPE.CREATE === formContext.ui.getFormType()) {
                if (nuevaFechaVencimiento.getTime() <= nuevaFechaDeHoy.getTime()) {
                    let result = await VENTAS.JS.Comun.OpenAlerDialog("Aceptar", mensaje);
                    if (result != null) {
                        SCHEDULEDEND.setValue(Tomorrow())
                    }
                }
            } else if (FORM_TYPE.UPDATE === formContext.ui.getFormType()) {
                nuevaFechaVencimiento = new Date(`${SCHEDULEDEND.getValue().getMonth() + 1}/${SCHEDULEDEND.getValue().getDate()}/${SCHEDULEDEND.getValue().getFullYear()}`);
                nuevaFechaDeHoy = AgregarDias(new Date(`${CREATEDON.getValue().getMonth() + 1}/${CREATEDON.getValue().getDate()}/${CREATEDON.getValue().getFullYear()}`), 1);
                if (nuevaFechaVencimiento.getTime() <= nuevaFechaDeHoy.getTime()) {
                    let result = await VENTAS.JS.Comun.OpenAlerDialog("Aceptar", mensaje);
                    if (result != null) {
                        SCHEDULEDEND.setValue(null);
                        formContext.getAttribute(RECOLECCION.CAMPOS.SCHEDULEDEND).setRequiredLevel('required');
                    }
                }
            }
        }

    } catch (error) {
        console.log(error);
    }
}

function ValidarRolAbrirRecoleccion(primaryControl) {
    "use strict";
    try {
        //Automundial - Coordinador de Logística
        let mostrar = false;
        let formContext = primaryControl;
        let userRoles = Xrm.Utility.getGlobalContext().userSettings;

        if (Object.keys(userRoles.roles._collection).length > 0) {
            userRoles.roles.forEach(x => {
                if (x.name === "Automundial - Coordinador de Logística" || x.name === "Administrador del sistema" & formContext.getAttribute("statecode").getValue() != 0) {
                    mostrar = true;
                }
            })
        }
        return mostrar;
    } catch (error) {
        MostrarCuadroError(error);
    }
}

function AgregarDias(date = new Date(), dia) {
    date.setDate(date.getDate() + dia);
    return date;
}

function MostrarCuadroError(detalles) {
    "use strict";
    Xrm.Navigation.openErrorDialog({ errorCode: "ATM001-TEST", message: detalles }).then(function () { }, function () { });
}
function Tomorrow() {

    let ms = new Date().getTime() + 86400000;
    let tomorrow = new Date(ms);
    if (tomorrow.getDay() === 7) {
        tomorrow = AgregarDias(tomorrow, 1);
    }
    return tomorrow;
}