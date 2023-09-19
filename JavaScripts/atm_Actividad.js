if (typeof VENTAS === "undefined") {
    VENTAS = {};
    VENTAS.JS = {};
}

if (typeof VENTAS.JS === "undefined") {
    VENTAS.JS = {};
}

VENTAS.JS.Actividad = {}

VENTAS.JS.Actividad.Accounts = null;

VENTAS.JS.Actividad.ObtenerNumero = async function (executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();

    let regardingobjectid = formContext.getAttribute("regardingobjectid").getValue();
    let atm_urlmensajedirecto = formContext.getAttribute("atm_urlmensajedirecto").getValue();

    if (regardingobjectid && !atm_urlmensajedirecto) {
        switch (regardingobjectid[0].entityType) {
            case "lead":
                let lead = await Xrm.WebApi.retrieveRecord("lead", regardingobjectid[0].id, "?$select=mobilephone,_atm_paisid_value");
                if (lead._atm_paisid_value) {
                    if (lead.mobilephone) {
                        let pais = await Xrm.WebApi.retrieveRecord("atm_pais", lead._atm_paisid_value, "?$select=atm_indicativo");
                        formContext.getAttribute("atm_urlmensajedirecto").setValue(`https://wa.me/${pais.atm_indicativo}${lead.mobilephone}`);
                    } else {
                        MostrarCuadroError("No se encuentra un número teléfonico registrado en el cliente potencial asociado")
                    }
                }
                break;
            case "account":
                let account = await Xrm.WebApi.retrieveRecord("account", regardingobjectid[0].id, "?$select=telephone2,_atm_paisid_value");
                if (account._atm_paisid_value) {
                    if (account.telephone2) {
                        let pais = await Xrm.WebApi.retrieveRecord("atm_pais", account._atm_paisid_value, "?$select=atm_indicativo");
                        formContext.getAttribute("atm_urlmensajedirecto").setValue(`https://wa.me/${pais.atm_indicativo}${account.telephone2}`);
                    } else {
                        MostrarCuadroError("No se encuentra un número teléfonico registrado en la cuenta asociada")
                    }
                }
                break;
            case "contact":
                let contact = await Xrm.WebApi.retrieveRecord("contact", regardingobjectid[0].id, "?$select=mobilephone,_atm_paisid_value");
                if (contact._atm_paisid_value) {
                    if (contact.mobilephone) {
                        let pais = await Xrm.WebApi.retrieveRecord("atm_pais", contact._atm_paisid_value, "?$select=atm_indicativo");
                        formContext.getAttribute("atm_urlmensajedirecto").setValue(`https://wa.me/${pais.atm_indicativo}${contact.mobilephone}`);
                    } else {
                        MostrarCuadroError("No se encuentra un número teléfonico registrado en el contacto asociado")
                    }
                }
                break;
        }
    } else {
        var control = formContext.ui.controls.get("WebResource_botonwhatsapp");

        control.setVisible(true);
    }
}

VENTAS.JS.Actividad.CrearAsuntoAutomaticoMensajeWhatsApp = async function (executionContext) {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();
        let subject = formContext.getControl("subject");
        let regardingobjectid = formContext.getControl("regardingobjectid");
        subject.setDisabled(true);
        formContext.getAttribute('regardingobjectid').setRequiredLevel('required');

        if (formContext.ui.getFormType() === 1) {
            regardingobjectid.setEntityTypes(["account", "lead", "contact"]);
            if (regardingobjectid.getAttribute().getValue()) {
                subject.getAttribute().setValue("Mensaje de WhatsApp - " + regardingobjectid.getAttribute().getValue()[0].name)
            }
        }
    } catch (error) {
        let alertStrings = { confirmButtonLabel: 'Ok', text: error };
        let alertOptions = { height: 120, width: 260 };
        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
    }
}

VENTAS.JS.Actividad.CambiarRemitente = async function (executionContext) {
    "use strict";

    var formContext = executionContext.getFormContext();
    let from = formContext.getAttribute("from").getValue();
    let cc = formContext.getAttribute("cc").getValue();
    if (!cc) {
        formContext.getAttribute("cc").setValue(from);
    }

    let atm_parametros = await Xrm.WebApi.retrieveMultipleRecords("atm_parametro", "?$select=atm_valor&$filter=atm_nombre eq 'CORREODEPORDEFECTO'");
    if (atm_parametros.entities.length > 0) {
        for (let atm_parametro of atm_parametros.entities) {
            let user = await Xrm.WebApi.retrieveMultipleRecords("systemuser", "?$select=systemuserid,fullname&$filter=domainname eq '" + atm_parametro.atm_valor + "'");
            if (user.entities.length > 0) {
                var lookup = new Array();
                lookup[0] = new Object();
                lookup[0].id = user.entities[0].systemuserid;
                lookup[0].name = user.entities[0].fullname;
                lookup[0].entityType = "systemuser";
                formContext.getAttribute("from").setValue(lookup);
            }
        }
    }
}

VENTAS.JS.Actividad.ObtenerFechaActual = function (executionContext) {
    "use strict";

    var formContext = executionContext.getFormContext();
    let today = new Date();
    formContext.getAttribute("scheduledend").setValue(today);
}

VENTAS.JS.Actividad.ModificarAsunto = function (executionContext) {
    "use strict";

    var formContext = executionContext.getFormContext();
    let referente = "";

    let tipoLlamada = formContext.getAttribute("atm_tipollamadacode").getText();
    let regardingobjectid = formContext.getAttribute("regardingobjectid").getValue();

    if (regardingobjectid) {
        referente = " - " + regardingobjectid[0].name;
    }

    if (tipoLlamada !== "Otros")
        formContext.getAttribute("subject").setValue(tipoLlamada + "" + referente);
    else
        formContext.getAttribute("subject").setValue("");

}

VENTAS.JS.Actividad.AgregarDireccion = function (executionContext) {
    "use strict";

    var formContext = executionContext.getFormContext();

    let atm_direccionid = formContext.getAttribute("atm_direccionid").getValue();

    if (atm_direccionid) {
        formContext.getAttribute("location").setValue(atm_direccionid[0].name);
    }
}

VENTAS.JS.Actividad.AsistentesObligatorios = async function (executionContext) {
    "use strict";

    try {
        var formContext = executionContext.getFormContext();
        let atm_parametros = null;
        if (formContext.ui.getFormType() === 1) {

            formContext.getAttribute("requiredattendees").setValue(null);

            if (Xrm.Utility.getGlobalContext().client.getClientState() === "Offline") {//offline
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
                            formContext.getAttribute("requiredattendees").setValue(lookup);
                        }
                    }
                } else {
                    MostrarCuadroError("No se encontró el parametro ASISTENTELOGISTICA");
                }
            }
            else { //online
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
                            formContext.getAttribute("requiredattendees").setValue(lookup);
                        }
                    }
                } else {
                    MostrarCuadroError("No se encontró el parametro ASISTENTELOGISTICA");
                }
            }

            var ms = new Date().getTime() + 86400000;
            var tomorrow = new Date(ms);
            formContext.getAttribute("scheduledstart").setValue(tomorrow);
            formContext.getAttribute("scheduledend").setValue(tomorrow);
        }
    } catch (error) {
        MostrarCuadroError(error)
    }
}

VENTAS.JS.Actividad.MostrarNotificacionRecoleccion = function (executionContext) {
    "use strict";
    try {

        let formContext = executionContext.getFormContext();
        let regardingobjectid = formContext.getAttribute("regardingobjectid");
        let mensajerecoleccion24hr = `Al crearse una actividad de recolección con un cliente potencial debe ser aclarado
                                        que el  pago de la recolección se hará de contado en caso de que un crédito 
                                        no sea aprobado.`;
        let mensajeRecoleccionLead = `La actividad de recolección se realizará en las próximas 24 hrs para las rutas 
                                        urbanas, para rutas fuera del perímetro urbano se deberá definir la fecha 
                                        según frecuencia de recolección asignada.`;

        if (formContext.ui.getFormType() === 1) {

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
        MostrarCuadroError(error)
    }
}

VENTAS.JS.Actividad.CrearConsetivoRecoleccion = async function (executionContext) {
    "use strict";
    try {
        var formContext = executionContext.getFormContext();
        let regardingobjectid = formContext.getAttribute("regardingobjectid").getValue();
        var attr = "";
        let regarding = null;
        var control = formContext.getControl("atm_direccionid");
        let actRecoleccion;

        if (regardingobjectid) {

            if (Xrm.Utility.getGlobalContext().client.getClientState() === "Offline") {

                if (regardingobjectid[0].entityType === "account") {
                    attr = "atm_cuentaid";
                    regarding = await VENTAS.JS.Comun.ConsultarRegistroOffline(regardingobjectid[0].entityType, regardingobjectid[0].id, "?$select=atm_idcuenta,_atm_regionalid_value&$expand=atm_regionalid($select=atm_nombre)")

                } else if (regardingobjectid[0].entityType === "lead") {
                    attr = "atm_leadid";
                    regarding = await VENTAS.JS.Comun.ConsultarRegistroOffline(regardingobjectid[0].entityType, regardingobjectid[0].id, "?$select=atm_consecutivo");
                }
                //actRecoleccion = await VENTAS.JS.Comun.ConsultarMultiplesEntidadesOffline("activitypointer", "?$filter=(activitytypecode eq 'atm_recoleccion' and _regardingobjectid_value eq '" + regardingobjectid[0].id.replace('{', '').replace('}', '') + "')");

                let option = "?$filter=(activitytypecode eq 'atm_recoleccion' and _regardingobjectid_value eq '" + regardingobjectid[0].id.replace('{', '').replace('}', '') + "')";
                Xrm.WebApi.offline.retrieveMultipleRecords('activitypointer', option).then(
                    function success(result) {
                        // perform operations on on retrieved records
                        if (result) {
                            actRecoleccion = result;
                        }
                    },
                    function (error) {
                        // handle error conditions
                    }
                );

            } else {
                if (regardingobjectid[0].entityType === "account") {
                    attr = "atm_cuentaid";
                    regarding = await Xrm.WebApi.retrieveRecord(regardingobjectid[0].entityType, regardingobjectid[0].id, "?$select=atm_idcuenta,_atm_regionalid_value&$expand=atm_regionalid($select=atm_nombre)");
                } else if (regardingobjectid[0].entityType === "lead") {
                    attr = "atm_leadid";
                    regarding = await Xrm.WebApi.retrieveRecord(regardingobjectid[0].entityType, regardingobjectid[0].id, "?$select=atm_consecutivo");
                }
                actRecoleccion = await Xrm.WebApi.retrieveMultipleRecords("activitypointer", "?$filter=(activitytypecode eq 'atm_recoleccion' and _regardingobjectid_value eq '" + regardingobjectid[0].id.replace('{', '').replace('}', '') + "')");
            }

            let idRegarding = regarding.atm_idcuenta ? regarding.atm_idcuenta : regarding.atm_consecutivo;

            formContext.getAttribute("subject").setValue("AR_" + idRegarding + "_" + (actRecoleccion.entities.length + 1));

            control.addPreSearch(function name() {
                var filter = '<filter type="or"> <condition attribute="' + attr + '" operator="eq" uiname="' + regardingobjectid[0].name + '" uitype="' + regardingobjectid[0].entityType + '" value="{' + regardingobjectid[0].id.replace('{', '').replace('}', '') + '}" /> </filter>';
                control.addCustomFilter(filter);
            });

        } else {
            control.removePreSearch(function name() {
                var filter = '<filter type="or"> <condition attribute="' + attr + '" operator="eq" uiname="' + regardingobjectid[0].name + '" uitype="' + regardingobjectid[0].entityType + '" value="{' + regardingobjectid[0].id.replace('{', '').replace('}', '') + '}" /> </filter>';
                control.addCustomFilter(filter);
            });
        }
    } catch (error) {
        MostrarCuadroError(error)
    }
}

VENTAS.JS.Actividad.BloquearCamposCrearRecoleccionFormPrincipal = function (executionContext) {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();
        formContext.getControl('regardingobjectid').setEntityTypes(['account', 'lead']);
        let regardingobjectid = formContext.getControl("regardingobjectid");
        let atm_direccionid = formContext.getControl("atm_direccionid");

        if (formContext.ui.getFormType() === 1) {
            regardingobjectid.setDisabled(false);
            atm_direccionid.setDisabled(false);
            formContext.getAttribute('regardingobjectid').getRequiredLevel('required');
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

VENTAS.JS.Actividad.AbrirFormularioRecoleccion = async function (executionContext) {
    "use strict";
    try {
        let entityFormOptions = {
            entityName: 'atm_recoleccion',
            useQuickCreateForm: true
        };
        let formParameters = {}

        Xrm.Navigation.openForm(entityFormOptions, formParameters).then(
            function (result) { }, function (error) { MostrarCuadroError(error) }
        );
    } catch (error) { MostrarCuadroError(error) }
}

VENTAS.JS.Actividad.MensajeMasivoWhatsApp = async function (selected, unselected, tipo) {
    "use strict";

    let record = selected;
    let pais = ""
    let pais1 = ""
    let id = "";

    if (selected.length <= 0)
        record = unselected

    switch (tipo) {
        case "account":
        case "contact":
        case "lead":
            pais = ",atm_paisid($select=atm_indicativo)"
            id = tipo + "id";
            break;
        default:
            pais1 = ";$expand=atm_paisid($select=atm_indicativo)"
            id = "activityid"
            break;
    }

    let url = "?$filter=(";
    record.forEach(x => {
        url = url + id + " eq " + x + " or ";
    });

    url = url.slice(0, -4) + ")&$expand=owninguser($select=mobilephone,fullname" + pais1 + ")" + pais;

    Xrm.Navigation.navigateTo(
        {
            pageType: "webresource",
            webresourceName: "atm_configuracionmensajemasivo",
            data: "parametros#" + url + "|tipo#" + tipo
        },
        {
            target: 2,
            position: 1,
            width: { value: 70, unit: "%" }
        }
    );

}

VENTAS.JS.Actividad.VisibilidadBotonMW = async function (executionContext) {
    "use strict";

    var userSettings = Xrm.Utility.getGlobalContext().userSettings;

    let retorno = false;
    let hasRole = false;
    userSettings.roles.forEach(x => {
        if (x.name === "System Administrator" || x.name === "Administrador del sistema" || x.name === "Automundial - Analista de Mercado") {
            hasRole = true;
        }
    });

    if (hasRole) {
        retorno = true;
    }

    return retorno;
}


VENTAS.JS.Actividad.VisibilidadCausal = function (executionContext) {
    "use strict";
    let createdon;
    var formContext = executionContext.getFormContext();

    var scheduledend = formContext.getAttribute("scheduledend").getValue();
    var hoy = new Date();

    try {
        createdon = formContext.getAttribute("createdon")?.getValue();
        if (createdon || (scheduledend <= hoy)) {
            let atm_tipollamadacode = formContext.getAttribute("atm_tipollamadacode").getValue();
            let atm_causalllamadacode = formContext.getAttribute("atm_causalllamadacode").getValue();

            //Si es reactivación
            if (atm_tipollamadacode === 963540009) {
                formContext.getAttribute("atm_causalllamadacode").setRequiredLevel("required");
                formContext.getControl("atm_causalllamadacode").setVisible(true);

                formContext.getAttribute("atm_subcausalllamadacode").setRequiredLevel("none");
                formContext.getControl("atm_subcausalllamadacode").setVisible(false);
                formContext.getAttribute("atm_subcausalllamadacode").setValue(null);

                formContext.getAttribute("atm_contestollamadasac").setRequiredLevel("none");
                formContext.getControl("atm_contestollamadasac").setVisible(false);
                formContext.getAttribute("atm_contestollamadasac").setValue(null);

                formContext.getAttribute("atm_tiposeguimientocode").setRequiredLevel("none");
                formContext.getControl("atm_tiposeguimientocode").setVisible(false);
                formContext.getAttribute("atm_tiposeguimientocode").setValue(null);

                //Si es información desactualizada
                if (atm_causalllamadacode === 963540006) {
                    formContext.getAttribute("atm_subcausalllamadacode").setRequiredLevel("required");
                    formContext.getControl("atm_subcausalllamadacode").setVisible(true);
                }
            }
            // Si es Encuenta SAC
            else if (atm_tipollamadacode === 963540005) {
                formContext.getAttribute("atm_contestollamadasac").setRequiredLevel("required");
                formContext.getControl("atm_contestollamadasac").setVisible(true);

                //Escondemos los causales
                formContext.getAttribute("atm_causalllamadacode").setRequiredLevel("none");
                formContext.getControl("atm_causalllamadacode").setVisible(false);
                formContext.getAttribute("atm_causalllamadacode").setValue(null);

                formContext.getAttribute("atm_subcausalllamadacode").setRequiredLevel("none");
                formContext.getControl("atm_subcausalllamadacode").setVisible(false);
                formContext.getAttribute("atm_subcausalllamadacode").setValue(null);

                formContext.getAttribute("atm_tiposeguimientocode").setRequiredLevel("none");
                formContext.getControl("atm_tiposeguimientocode").setVisible(false);
                formContext.getAttribute("atm_tiposeguimientocode").setValue(null);
            }
            //Si es Seguimiento SAC
            else if (atm_tipollamadacode === 963540010) {
                formContext.getAttribute("atm_tiposeguimientocode").setRequiredLevel("required");
                formContext.getControl("atm_tiposeguimientocode").setVisible(true);

                //Escondemos los causales
                formContext.getAttribute("atm_causalllamadacode").setRequiredLevel("none");
                formContext.getControl("atm_causalllamadacode").setVisible(false);
                formContext.getAttribute("atm_causalllamadacode").setValue(null);

                formContext.getAttribute("atm_subcausalllamadacode").setRequiredLevel("none");
                formContext.getControl("atm_subcausalllamadacode").setVisible(false);
                formContext.getAttribute("atm_subcausalllamadacode").setValue(null);

                formContext.getAttribute("atm_contestollamadasac").setRequiredLevel("none");
                formContext.getControl("atm_contestollamadasac").setVisible(false);
                formContext.getAttribute("atm_contestollamadasac").setValue(null);
            }
            else {
                formContext.getAttribute("atm_causalllamadacode").setRequiredLevel("none");
                formContext.getControl("atm_causalllamadacode").setVisible(false);
                formContext.getAttribute("atm_causalllamadacode").setValue(null);

                formContext.getAttribute("atm_subcausalllamadacode").setRequiredLevel("none");
                formContext.getControl("atm_subcausalllamadacode").setVisible(false);
                formContext.getAttribute("atm_subcausalllamadacode").setValue(null);

                formContext.getAttribute("atm_contestollamadasac").setRequiredLevel("none");
                formContext.getControl("atm_contestollamadasac").setVisible(false);
                formContext.getAttribute("atm_contestollamadasac").setValue(null);

                formContext.getAttribute("atm_tiposeguimientocode").setRequiredLevel("none");
                formContext.getControl("atm_tiposeguimientocode").setVisible(false);
                formContext.getAttribute("atm_tiposeguimientocode").setValue(null);
            }

        } else {
            formContext.getAttribute("atm_causalllamadacode").setRequiredLevel("none");
            formContext.getControl("atm_causalllamadacode").setVisible(false);
            formContext.getAttribute("atm_causalllamadacode").setValue(null);

            formContext.getAttribute("atm_subcausalllamadacode").setRequiredLevel("none");
            formContext.getControl("atm_subcausalllamadacode").setVisible(false);
            formContext.getAttribute("atm_subcausalllamadacode").setValue(null);

            formContext.getAttribute("atm_contestollamadasac").setRequiredLevel("none");
            formContext.getControl("atm_contestollamadasac").setVisible(false);
            formContext.getAttribute("atm_contestollamadasac").setValue(null);

            formContext.getAttribute("atm_tiposeguimientocode").setRequiredLevel("none");
            formContext.getControl("atm_tiposeguimientocode").setVisible(false);
            formContext.getAttribute("atm_tiposeguimientocode").setValue(null);
        }
    } catch (error) {
        MostrarCuadroError(error)
    }
}

VENTAS.JS.Actividad.VisualizarEstadoDeRelecoleccion = function (rowData) {
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

VENTAS.JS.Actividad.AbrirRecoleccionCerrada = async function (primaryControl) {
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

VENTAS.JS.Actividad.OcultarRecoleccionReal = function (executionContext) {
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
            Xrm.Page.ui.tabs.get("general").sections.get("cierre_recoleccion").setVisible(true);
        } else {
            Xrm.Page.ui.tabs.get("general").sections.get("cierre_recoleccion").setVisible(false);
        }

    } catch (error) {
        MostrarCuadroError(error);
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

VENTAS.JS.Actividad.RestringirOpcionesSACllamadaTelefonica = async function (executionContext) {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();
        let atm_tipollamadacode = formContext.getControl("atm_tipollamadacode");
        let res = await VENTAS.JS.Comun.ConsultarExistenciaRol("Automundial - Servicio al cliente,Administrador del sistema");

        if (res === false) {
            atm_tipollamadacode.removeOption(963540005);
            atm_tipollamadacode.removeOption(963540010);
            atm_tipollamadacode.removeOption(963540011)
        }
    } catch (error) {
        VENTAS.JS.Comun.MostrarNotificacionToast(2, error.message)
    }
}

VENTAS.JS.Actividad.OcultarSeccionPlanDeAccionLlamadaTelefononica = async function (executionContext) {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();
        let atm_tipollamadacode = formContext.getControl("atm_tipollamadacode");

        if (atm_tipollamadacode.getAttribute().getValue() == 963540010 || atm_tipollamadacode.getAttribute().getValue() == 963540005) {
            formContext.ui.tabs.get("phonecall").sections.get("plandeaccion").setVisible(true);
        } else {
            formContext.ui.tabs.get("phonecall").sections.get("plandeaccion").setVisible(false);
        }
    } catch (error) {
        VENTAS.JS.Comun.MostrarNotificacionToast(2, error.message)
    }
}

VENTAS.JS.Actividad.AbrirHtmlEnviarCorreoRespuestaCampania = function (executionContext, selected, unselected, entidad) {
    "use strict";
    try {
        let record = selected;

        if (selected.length <= 0)
            record = unselected

        Xrm.Navigation.navigateTo(
            {
                pageType: "webresource",
                webresourceName: "atm_respuestadecampania",
                data: record
            },
            {
                target: 2,
                position: 1,
                width: { value: 50, unit: "%" },
            }
        ).then(
            function success() {
                // Run code on success

            },
            function error() {
                // Handle errors
            }
        );
    } catch (error) {
        MostrarCuadroError(error)
    }

}

VENTAS.JS.Actividad.CrearNombrePorcentajeComision = function (executionContext) {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();
        let paisid = formContext.getAttribute("atm_paisid");
        let categoria = formContext.getAttribute("atm_categoriaid");
        if (paisid.getValue() && categoria.getValue()) {
            formContext.getAttribute("atm_name").setValue(`${paisid.getValue()[0].name} - ${categoria.getValue()[0].name}`.toUpperCase())
        }
    } catch (error) {

    }
}

function MostrarCuadroError(detalles) {
    "use strict";
    Xrm.Navigation.openErrorDialog({ message: detalles }).then(function () { }, function () { });
}

function formatDate(date) {
    return [padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate()), date.getFullYear(),].join('/');
}

function padTo2Digits(num) { return num.toString().padStart(2, '0'); }
