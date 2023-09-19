if (typeof VENTAS === "undefined") {
    VENTAS = {};
    VENTAS.JS = {};
}

if (typeof VENTAS.JS === "undefined") {
    VENTAS.JS = {};
}


const LEAD = {
    CAMPOS: {
        EMAILADDRESS1: "emailaddress1",
        ATM_CORREOVALIDO: "atm_correovalido"
    }
}

VENTAS.JS.Lead = {}

VENTAS.JS.Lead.EstadoOriginal = null;
VENTAS.JS.Lead.PropietarioOriginal = null;

VENTAS.JS.Lead.OnLoad = function (executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();

    try {
        formContext.ui.clearFormNotification("ERRORPREVENTA");

        VENTAS.JS.Lead.EstadoOriginal = formContext.getAttribute("leadqualitycode").getValue();
        VENTAS.JS.Lead.PropietarioOriginal = formContext.getAttribute("ownerid").getValue();

        //Desabilitamos los campos que se actualizan con las grid
        let header_process_atm_direccionprincipalid = formContext.getControl("header_process_atm_direccionprincipalid");

        if (header_process_atm_direccionprincipalid) {
            header_process_atm_direccionprincipalid.setDisabled(true);
        }

        //Según el paso establecemos los campos que son obligatorios
        var selected = formContext.data.process.getSelectedStage();
        let atm_segmentopotencialcode = formContext.getAttribute("atm_segmentopotencialcode").getText();

        if (selected) {
            if (selected.getName() === "Perfilamiento") {
                formContext.getAttribute("atm_regionalid").setRequiredLevel("required");
                formContext.getAttribute("atm_departamentoid").setRequiredLevel("required");
                formContext.getAttribute("atm_ciudadid").setRequiredLevel("required");
                formContext.getAttribute("atm_terrenocode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
                formContext.getAttribute("atm_tipollantacode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
                formContext.getAttribute("atm_rutacode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
                formContext.getAttribute("atm_interescode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
                formContext.getAttribute("atm_preventistaid").setRequiredLevel("required");
                formContext.getAttribute("atm_tipocompradorcode").setRequiredLevel("required");
            }
            else if (selected.getName() === "Identificación De Necesidades") {
                formContext.getAttribute("atm_regionalid").setRequiredLevel("required");
                formContext.getAttribute("atm_departamentoid").setRequiredLevel("required");
                formContext.getAttribute("atm_ciudadid").setRequiredLevel("required");
                formContext.getAttribute("atm_terrenocode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
                formContext.getAttribute("atm_tipollantacode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
                formContext.getAttribute("atm_rutacode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
                formContext.getAttribute("atm_interescode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
                formContext.getAttribute("atm_preventistaid").setRequiredLevel("required");
                formContext.getAttribute("atm_preventistaid").setRequiredLevel("required");
                formContext.getAttribute("atm_tipocompradorcode").setRequiredLevel("required");
            }
            else if (selected.getName() === "Asignación De Asesor") {
                formContext.getAttribute("atm_regionalid").setRequiredLevel("required");
                formContext.getAttribute("atm_departamentoid").setRequiredLevel("required");
                formContext.getAttribute("atm_ciudadid").setRequiredLevel("required");
                formContext.getAttribute("atm_terrenocode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
                formContext.getAttribute("atm_tipollantacode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
                formContext.getAttribute("atm_rutacode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
                formContext.getAttribute("atm_interescode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
                formContext.getAttribute("atm_preventistaid").setRequiredLevel("required");
                formContext.getAttribute("atm_tipocompradorcode").setRequiredLevel("required");
            }
            else if (selected.getName() === "Contacto Inicial") {
                formContext.getAttribute("atm_regionalid").setRequiredLevel("required");
                formContext.getAttribute("atm_departamentoid").setRequiredLevel("none");
                formContext.getAttribute("atm_ciudadid").setRequiredLevel("none");
                formContext.getAttribute("atm_terrenocode").setRequiredLevel("none");
                formContext.getAttribute("atm_tipollantacode").setRequiredLevel("none");
                formContext.getAttribute("atm_rutacode").setRequiredLevel("none");
                formContext.getAttribute("atm_interescode").setRequiredLevel("none");
                formContext.getAttribute("atm_preventistaid").setRequiredLevel("none");
                formContext.getAttribute("atm_tipocompradorcode").setRequiredLevel("none");
            }
        }

        //Agregamos la funcion para que lo establesca dinamicamente
        formContext.data.process.addOnStageChange(CamposObligatorios);
    } catch (error) {

    }
}

VENTAS.JS.Lead.CambiarInteres = function (executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();

    var options = GetMultiSelectOptions(formContext, "atm_interescode");
    if (options !== null) {
        if (options.filter(i => i.value === 963540015).length > 0) {
            formContext.getControl("atm_descripcioninteres").setVisible(true);
            formContext.getAttribute("atm_descripcioninteres").setRequiredLevel("required");

        } else {
            formContext.getControl("atm_descripcioninteres").setVisible(false);
            formContext.getAttribute("atm_descripcioninteres").setValue(null);
            formContext.getAttribute("atm_descripcioninteres").setRequiredLevel("none");
        }
    }
}

VENTAS.JS.Lead.EstablecerPaisUsuarioPorDefecto = async function (executionContext) {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();
        let owner = formContext.getAttribute("ownerid").getValue();
        let atm_paisid = formContext.getAttribute("atm_paisid");
        let clientContext = Xrm.Utility.getGlobalContext().client;
        let option = "?$select=_atm_paisid_value&$expand=atm_paisid($select=atm_paisid,atm_nombre)";

        if (!atm_paisid.getValue()) {

            if (clientContext.getClientState() === "Offline") {
                Xrm.WebApi.offline.retrieveRecord("systemuser", owner[0].id, option).then(
                    function success(result) {
                        if (result) {
                            var object = new Array();
                            object[0] = new Object();
                            object[0].id = result.atm_paisid.atm_paisid;
                            object[0].name = result.atm_paisid.atm_nombre;
                            object[0].entityType = "atm_pais";
                            atm_paisid.setValue(object);
                        }
                    },
                    function (error) {
                    }
                )
            } else {
                let result = await VENTAS.JS.Comun.ConsultarRegistro("systemuser", owner[0].id, option)
                if (result._atm_paisid_value) {
                    var object = new Array();
                    object[0] = new Object();
                    object[0].id = result.atm_paisid.atm_paisid;
                    object[0].name = result.atm_paisid.atm_nombre;
                    object[0].entityType = "atm_pais";
                    atm_paisid.setValue(object);
                }
            }
        }
    } catch (error) {
        MostrarCuadroError(error.message)
    }
}

VENTAS.JS.Lead.FechaDeContactoMenor = function (executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();
    let atm_fechacontacto = formContext.getAttribute("atm_fechacontacto").getValue();
    let day = new Date();
    day.setHours(0, 0, 0, 0);

    if (atm_fechacontacto) {
        if (atm_fechacontacto < day) {
            formContext.getControl("atm_fechacontacto").setNotification("La fecha de contacto no puede ser menor a la actual");
        } else {
            formContext.getControl("atm_fechacontacto").clearNotification();
        }
    } else {
        formContext.getControl("atm_fechacontacto").clearNotification();
    }
}

VENTAS.JS.Lead.CambiarObligatoriedadSegmento = function (executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();

    var selected = formContext.data.process.getSelectedStage();
    let atm_segmentopotencialcode = formContext.getAttribute("atm_segmentopotencialcode").getText();

    if (selected.getName() !== "Contacto Inicial") {
        formContext.getAttribute("atm_terrenocode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
        formContext.getAttribute("atm_tipollantacode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
        formContext.getAttribute("atm_rutacode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
        formContext.getAttribute("atm_interescode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
    }
}

VENTAS.JS.Lead.CambiarEstadoVerificado = async function (executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();
    let id = formContext.data.entity.getId()
    let atm_procesoventasleadoportunidad = await Xrm.WebApi.retrieveMultipleRecords("atm_procesoventasleadoportunidad", "?$select=_activestageid_value,_bpf_leadid_value&$expand=activestageid($select=stagename)&$filter=(_bpf_leadid_value eq " + id + ") and (activestageid/processstageid ne null)");
    let atm_documentacionenviadalead = formContext.getAttribute("atm_documentacionenviadalead").getValue();

    for (let atm_procesoventasleadop of atm_procesoventasleadoportunidad.entities) {
        if (atm_documentacionenviadalead) {
            if (atm_procesoventasleadop.activestageid.stagename !== "Asignación De Asesor") {
                formContext.getAttribute("atm_documentacionenviadalead").setValue(false);
                formContext.getAttribute("statuscode").setValue(1);
                MostrarCuadroError("No puede cambiar el valor al campo si el cliente potencial no ha pasado por las fases anteriores");
            }
        }
    }
}

VENTAS.JS.Lead.CambiarNivelInteres = async function (executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();
    let estadoNuevo = formContext.getAttribute("leadqualitycode").getValue();
    let createdon = formContext.getAttribute("createdon").getValue();
    var userSettings = Xrm.Utility.getGlobalContext().userSettings;

    if (createdon) {
        let hasRole = false;
        userSettings.roles.forEach(x => {
            if (x.name === "System Administrator" || x.name === "Administrador del sistema" || x.name === "Automundial - Profesional de Preventa" || x.name === "Automundial - Coordinador de Preventa") {
                hasRole = true;
            }
        });

        if (hasRole) {
            //Cambiamos la fecha indiferentemente del cambio que haga al tipo de estado
            formContext.getAttribute("atm_fechaultimadisminucioninteres").setValue(new Date());

            if (VENTAS.JS.Lead.EstadoOriginal === 1 && estadoNuevo === 2) {
                let preventista = formContext.getAttribute("atm_preventistaid").getValue();
                formContext.getAttribute("ownerid").setValue(preventista);
                formContext.getAttribute("atm_cambioestadocode").setRequiredLevel("required");
            } else {
                formContext.getAttribute("ownerid").setValue(VENTAS.JS.Lead.PropietarioOriginal);
                formContext.getAttribute("atm_cambioestadocode").setValue(null);
                formContext.getAttribute("atm_cambioestadocode").setRequiredLevel("none");
            }
        } else {
            formContext.getAttribute("leadqualitycode").setValue(Number(VENTAS.JS.Lead.EstadoOriginal));
            await VENTAS.JS.Comun.MostrarNotificacionToast(3, "No puede cambiar este valor si no es usuario de Preventa");
        }
    }
}

VENTAS.JS.Lead.BloquearBotones = function () {
    "use strict";

    var userSettings = Xrm.Utility.getGlobalContext().userSettings;

    let retorno = false;

    userSettings.roles.forEach(x => {
        if (x.name === "System Administrator" || x.name === "Administrador del sistema" || x.name === "Automundial - Profesional de Preventa" || x.name === "Automundial - Coordinador de Preventa") {
            retorno = true;
        }
    });

    return retorno;
}

VENTAS.JS.Lead.ConsultarExistenciaDelCliente = async function (executionContext) {
    'use strict';
    try {
        let formContext = executionContext.getFormContext();
        let atm_idcuenta = formContext.getAttribute("atm_idcuenta");
        let parentaccountid = formContext.getAttribute("parentaccountid");
        let companyname = formContext.getAttribute("companyname");

        if (atm_idcuenta.getValue()) {
            let result = await VENTAS.JS.Comun.ConsultarMultiplesEntidades('account', "?$filter=atm_idcuenta eq '" + atm_idcuenta.getValue() + "'");
            if (result.entities.length > 0) {
                let cuenta = [
                    {
                        entityType: "account",
                        id: result.entities[0].accountid,
                        name: result.entities[0].name
                    }
                ];
                parentaccountid.setValue(cuenta);
                companyname.setValue(result.entities[0].name);
                await VENTAS.JS.Comun.MostrarNotificacionToast(1, "Se ha actualizado la cuenta existente en el formulario");
            } else {
                parentaccountid.setValue(null);
                companyname.setValue(null);
                await VENTAS.JS.Comun.MostrarNotificacionToast(3, "El NIT/CC/RUC digitado no se encuentra registrado en el CRM");
            }
        } else {
            companyname.setValue(null);
            parentaccountid.setValue(null);
        }
    } catch (error) {
        VENTAS.JS.Comun.OpenAlerDialog('Ok', error.message);
    }
}

VENTAS.JS.Lead.FiltrarOrigenClientePotencial = async function (executionContext) {
    'use strict';

    let formContext = executionContext.getFormContext();
    let atm_tipoorigencode = formContext.getAttribute("atm_tipoorigencode").getValue();

    await VENTAS.JS.Comun.OcultarOpciones(formContext, "header_leadsourcecode", atm_tipoorigencode, "atm_tipoorigencode");

}

VENTAS.JS.Lead.ValidarCorreoElectronicoValido = async function (executionContext) {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();
        let emailaddress1 = formContext.getAttribute(LEAD.CAMPOS.EMAILADDRESS1);
        let expresion = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"

        if (emailaddress1.getValue()) {
            let result = new RegExp(expresion).test(emailaddress1.getValue());
            console.log(result);
            if (result) {
                formContext.getAttribute(LEAD.CAMPOS.ATM_CORREOVALIDO).setValue(true);
            } else {
                formContext.getAttribute(LEAD.CAMPOS.ATM_CORREOVALIDO).setValue(false);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

function CamposObligatorios(executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();

    var selected = formContext.data.process.getSelectedStage();
    let atm_segmentopotencialcode = formContext.getAttribute("atm_segmentopotencialcode").getText();

    if (selected) {
        if (selected.getName() === "Perfilamiento") {
            formContext.getAttribute("atm_regionalid").setRequiredLevel("required");
            formContext.getAttribute("atm_departamentoid").setRequiredLevel("required");
            formContext.getAttribute("atm_ciudadid").setRequiredLevel("required");
            formContext.getAttribute("atm_terrenocode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
            formContext.getAttribute("atm_tipollantacode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
            formContext.getAttribute("atm_rutacode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
            formContext.getAttribute("atm_interescode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
            formContext.getAttribute("atm_preventistaid").setRequiredLevel("required");
            formContext.getAttribute("atm_tipocompradorcode").setRequiredLevel("required");
        }
        else if (selected.getName() === "Identificación De Necesidades") {
            formContext.getAttribute("atm_regionalid").setRequiredLevel("required");
            formContext.getAttribute("atm_departamentoid").setRequiredLevel("required");
            formContext.getAttribute("atm_ciudadid").setRequiredLevel("required");
            formContext.getAttribute("atm_terrenocode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
            formContext.getAttribute("atm_tipollantacode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
            formContext.getAttribute("atm_rutacode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
            formContext.getAttribute("atm_interescode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
            formContext.getAttribute("atm_preventistaid").setRequiredLevel("required");
            formContext.getAttribute("atm_preventistaid").setRequiredLevel("required");
            formContext.getAttribute("atm_tipocompradorcode").setRequiredLevel("required");
        }
        else if (selected.getName() === "Asignación De Asesor") {
            formContext.getAttribute("atm_regionalid").setRequiredLevel("required");
            formContext.getAttribute("atm_departamentoid").setRequiredLevel("required");
            formContext.getAttribute("atm_ciudadid").setRequiredLevel("required");
            formContext.getAttribute("atm_terrenocode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
            formContext.getAttribute("atm_tipollantacode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
            formContext.getAttribute("atm_rutacode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
            formContext.getAttribute("atm_interescode").setRequiredLevel(atm_segmentopotencialcode === "DIS" ? "none" : "required");
            formContext.getAttribute("atm_preventistaid").setRequiredLevel("required");
            formContext.getAttribute("atm_tipocompradorcode").setRequiredLevel("required");
        }
        else if (selected.getName() === "Contacto Inicial") {
            formContext.getAttribute("atm_regionalid").setRequiredLevel("none");
            formContext.getAttribute("atm_departamentoid").setRequiredLevel("none");
            formContext.getAttribute("atm_ciudadid").setRequiredLevel("none");
            formContext.getAttribute("atm_terrenocode").setRequiredLevel("none");
            formContext.getAttribute("atm_tipollantacode").setRequiredLevel("none");
            formContext.getAttribute("atm_rutacode").setRequiredLevel("none");
            formContext.getAttribute("atm_interescode").setRequiredLevel("none");
            formContext.getAttribute("atm_preventistaid").setRequiredLevel("none");
            formContext.getAttribute("atm_tipocompradorcode").setRequiredLevel("none");
        }
    }
}

function GetMultiSelectOptions(formContext, field) {
    "use strict";

    try {
        var optionField = formContext.getAttribute(field);

        if (optionField !== null) {
            var options = optionField.getSelectedOption();

            return options;
        }
    }
    catch (e) {
        MostrarCuadroError(`Error recibiendo opciones Multi-Select para el campo ${field}`);
    }
}

function MostrarCuadroError(detalles) {
    "use strict";
    Xrm.Navigation.openErrorDialog({ errorCode: "ATM001-TEST", message: detalles }).then(function () { }, function () { });
}
