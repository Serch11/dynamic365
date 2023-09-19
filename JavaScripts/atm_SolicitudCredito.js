if (typeof VENTAS === "undefined") {
    VENTAS = {};
    VENTAS.JS = {};
}

if (typeof VENTAS.JS === "undefined") {
    VENTAS.JS = {};
}

VENTAS.JS.SolicitudCredito = {}

VENTAS.JS.SolicitudCredito.OnLoadDocumentacionObligatoria = async function (executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();

    let createdon = formContext.getAttribute("createdon").getValue();

    let header_process_atm_revisordocumentosid = formContext.getControl("header_process_atm_revisordocumentosid");
    let header_process_atm_fechaaprobacionrechazo = formContext.getControl("header_process_atm_fechaaprobacionrechazo");


    if (header_process_atm_revisordocumentosid) {
        header_process_atm_revisordocumentosid.setDisabled(true);
    }

    if (header_process_atm_fechaaprobacionrechazo) {
        header_process_atm_fechaaprobacionrechazo.setDisabled(true);
    }

    var selected = formContext.data.process.getSelectedStage();
    var userSettings = Xrm.Utility.getGlobalContext().userSettings;

    if (selected.getName() === "Análisis") {
        let hasRole = false;
        userSettings.roles.forEach(x => {
            if (x.name === "System Administrator" || x.name === "Administrador del sistema") {
                hasRole = true;
            }
        });

        let atm_analistacreditoid = formContext.getAttribute("atm_analistacreditoid").getValue();

        if (hasRole) {
            formContext.getControl("atm_analistacreditoid").setDisabled(false);
        } else if (userSettings.userId.replace('{', '').replace('}', '').toUpperCase() === atm_analistacreditoid[0].id.replace('{', '').replace('}', '').toUpperCase()) {
            formContext.getControl("atm_analistacreditoid").setDisabled(false);
        }
    } else {
        if (createdon) {
            formContext.getControl("atm_analistacreditoid").setDisabled(true);
        }
    }

    formContext.data.process.addOnStageChange(CamposObligatorios);
}

VENTAS.JS.SolicitudCredito.CrearId = async function (executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();
    let accountid = formContext.getAttribute("atm_accountid").getValue();
    let atm_idsolicitud = formContext.getAttribute("atm_idsolicitud").getValue();
    if (!accountid) {
        formContext.getAttribute("atm_idsolicitud").setValue(null);
    } else {
        if (accountid && !atm_idsolicitud) {
            let atm_account = await Xrm.WebApi.retrieveRecord("account", accountid[0].id, "?$select=atm_idcuenta");
            let atm_solicitudcredito = await Xrm.WebApi.retrieveMultipleRecords("atm_solicitudcredito", "?$select=atm_solicitudcreditoid&$filter=(_atm_accountid_value eq " + accountid[0].id + ")");
            formContext.getAttribute("atm_idsolicitud").setValue(atm_account.atm_idcuenta + "_" + (Number(atm_solicitudcredito.entities.length) + 1));
        }
    }
}

VENTAS.JS.SolicitudCredito.BloquearCamposFormularioGuardado = function (executionContext) {

    let formContext = executionContext.getFormContext();
    let createdon = formContext.getAttribute("createdon").getValue();

    if (createdon) {
        formContext.getControl("atm_tiposolicitudcode").setDisabled(true);
    }
}

VENTAS.JS.SolicitudCredito.ObetenerDocumentacionNecesaria = async function (executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();
    let accountid = formContext.getAttribute("atm_accountid").getValue();
    let atm_tiposolicitudcode = formContext.getAttribute("atm_tiposolicitudcode").getValue();
    let atm_documentacionnecesaria = formContext.getAttribute("atm_documentacionnecesaria").getValue();

    let tipoPersona = {
        963540000: "PERSONANATURAL",
        963540001: "PERSONAJURIDICA",
        963540002: "GRANDESCONTRIBUYENTES",
        963540003: "PERSONASNATURALESRETENEDORAS"
    }

    if (accountid && !atm_documentacionnecesaria) {
        let atm_tipodocumentos = await Xrm.WebApi.retrieveMultipleRecords("atm_tipodocumento", `?$select=atm_codigo,atm_nombre`);
        let docs = ""

        if (atm_tiposolicitudcode === 963540000) {
            let parametro0 = await Xrm.WebApi.retrieveMultipleRecords("atm_parametro", `?$select=atm_valor&$filter=atm_nombre eq 'AUMENTOCUPO'`);
            let parametros0 = parametro0.entities[0].atm_valor.split(',')

            for (let atm_tipodocumento of atm_tipodocumentos.entities) {
                for (let index = 0; index < parametros0.length; index++) {
                    const element = parametros0[index];
                    if (element === atm_tipodocumento.atm_codigo) {
                        docs = docs + atm_tipodocumento.atm_nombre + ","
                    }
                }
            }
        } else {
            let atm_account = await Xrm.WebApi.retrieveRecord("account", accountid[0].id, "?$select=atm_idcuenta,atm_regimencontributivocode,atm_semsicecode");
            var textoParametro = tipoPersona[atm_account.atm_regimencontributivocode]

            if (textoParametro) {
                if (atm_account.atm_semsicecode) {
                    switch (atm_account.atm_semsicecode) {
                        case 963540005:
                            textoParametro = textoParametro + "DIS";
                    }
                }

                let parametro = await Xrm.WebApi.retrieveMultipleRecords("atm_parametro", `?$select=atm_valor&$filter=atm_nombre eq '${textoParametro}'`);

                if (parametro.entities.length > 0) {
                    let parametros = parametro.entities[0].atm_valor.split(',')

                    for (let atm_tipodocumento of atm_tipodocumentos.entities) {
                        for (let index = 0; index < parametros.length; index++) {
                            const element = parametros[index];
                            if (element === atm_tipodocumento.atm_codigo) {
                                docs = docs + atm_tipodocumento.atm_nombre + ","
                            }
                        }
                    }
                }
            }
        }
        formContext.getAttribute("atm_documentacionnecesaria").setValue(docs.slice(0, -1));
    }
}

VENTAS.JS.SolicitudCredito.FechaSolicitud = function (executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();
    let atm_fechasolicitud = formContext.getAttribute("atm_fechasolicitud").getValue();

    if (!atm_fechasolicitud) {
        formContext.getAttribute("atm_fechasolicitud").setValue(new Date);
    }
}

VENTAS.JS.SolicitudCredito.AsignarPropietarios = async function (executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();

    let accountid = formContext.getAttribute("atm_accountid").getValue();
    let atm_revisordocumentosid = formContext.getAttribute("atm_revisordocumentosid").getValue();
    let atm_analistacreditoid = formContext.getAttribute("atm_analistacreditoid").getValue();

    formContext.ui.clearFormNotification("ERRORUSUARIO")

    if (accountid && !atm_revisordocumentosid && !atm_analistacreditoid) {
        let atm_account = await Xrm.WebApi.retrieveRecord("account", accountid[0].id, "?$select=accountid,atm_semsicecode,atm_regimencontributivocode&$expand=atm_departamentoid($select=atm_nombre),atm_regionalid($select=atm_nombre)&$filter=(atm_departamentoid/atm_departamentoid ne null) and (atm_regionalid/atm_regionalid ne null)");

        if (atm_account.atm_regionalid) {
            let regional = removeAccents(atm_account.atm_regionalid.atm_nombre);
            var separar = regional.split('/');

            if (separar.length > 1 && atm_account.atm_departamentoid) {
                if (separar[0] === atm_account.atm_departamentoid.atm_nombre || separar[1] === atm_account.atm_departamentoid.atm_nombre) {
                    regional = removeAccents(atm_account.atm_departamentoid.atm_nombre)
                }
            }

            let parametro = await Xrm.WebApi.retrieveMultipleRecords("atm_parametro", `?$select=atm_valor&$filter=atm_nombre eq 'SC-${regional}'`);

            let parametros = "";

            if (parametro.entities.length > 0) {
                parametros = parametro.entities[0].atm_valor.split(',')
            } else {
                if (regional === "TOLIMA/HUILA" || regional === "BOYACA/CASANARE") {
                    parametro = await Xrm.WebApi.retrieveMultipleRecords("atm_parametro", `?$select=atm_valor&$filter=atm_nombre eq 'SC-${regional}_ELSE'`);
                    parametros = parametro.entities[0].atm_valor.split(',');
                } else {
                    parametro = await Xrm.WebApi.retrieveMultipleRecords("atm_parametro", `?$select=atm_valor&$filter=atm_nombre eq 'SC-EXTRANJERO'`);
                    parametros = parametro.entities[0].atm_valor.split(',');
                }
            }

            if (atm_account.atm_semsicecode !== Number(963540000)) {
                let systemuserAnalista = await Xrm.WebApi.retrieveMultipleRecords("systemuser", `?$select=systemuserid,fullname&$filter=(domainname eq '${parametros[0]}')`)

                var object0 = new Array();
                object0[0] = new Object();
                object0[0].id = systemuserAnalista.entities[0].systemuserid;
                object0[0].name = systemuserAnalista.entities[0].fullname;
                object0[0].entityType = "systemuser";
                formContext.getAttribute("atm_revisordocumentosid").setValue(object0);

                let systemuserRevisor = await Xrm.WebApi.retrieveMultipleRecords("systemuser", `?$select=systemuserid,fullname&$filter=(domainname eq '${parametros[2]}')`)
                var object1 = new Array();
                object1[0] = new Object();
                object1[0].id = systemuserRevisor.entities[0].systemuserid;
                object1[0].name = systemuserRevisor.entities[0].fullname;
                object1[0].entityType = "systemuser";
                formContext.getAttribute("atm_analistacreditoid").setValue(object1)
            } else {
                for (let index = 0; index < 2; index++) {
                    let user = parametros[index];
                    if (atm_account.atm_regimencontributivocode && index === 1) {
                        //REGIMEN CONTRIBUTIVO
                        if (atm_account.atm_regimencontributivocode === Number(963540001)) {
                            user = parametros[2];
                        }
                    }
                    
                    let systemuser = await Xrm.WebApi.retrieveMultipleRecords("systemuser", `?$select=systemuserid,fullname&$filter=(domainname eq '${user}')`)

                    if (systemuser.entities.length > 0) {
                        var object = new Array();
                        object[0] = new Object();
                        object[0].id = systemuser.entities[0].systemuserid;
                        object[0].name = systemuser.entities[0].fullname;
                        object[0].entityType = "systemuser";

                        index === 0 ? formContext.getAttribute("atm_revisordocumentosid").setValue(object) : formContext.getAttribute("atm_analistacreditoid").setValue(object);
                    } else {
                        formContext.ui.setFormNotification("Usuario no encontrado", "ERROR", "ERRORUSUARIO");
                    }
                }
            }
        }
    }
}

VENTAS.JS.SolicitudCredito.AprobarSolicitud = async function (executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();
    var userSettings = Xrm.Utility.getGlobalContext().userSettings;
    let atm_analistacreditoid = formContext.getAttribute("atm_analistacreditoid").getValue();
    let hasRole = false;
    userSettings.roles.forEach(x => {
        if (x.name === "System Administrator" || x.name === "Administrador del sistema") {
            hasRole = true;
        }
    });

    formContext.ui.clearFormNotification("ERRORUSUARIO");
    if (hasRole) {
        formContext.getAttribute("atm_fechaaprobacionrechazo").setValue(new Date);
        return;
    }
    else if (atm_analistacreditoid[0].id.replace('{', '').replace('}', '').toUpperCase() !== userSettings.userId.replace('{', '').replace('}', '').toUpperCase()) {
        formContext.getAttribute("atm_aprobarsolicitudcode").setValue(null);
        formContext.getAttribute("atm_comentarioaprobacion").setValue(null);
        formContext.getAttribute("atm_fechaaprobacionrechazo").setValue(null);
        formContext.ui.setFormNotification("Si no es el usuario Analista de Crédito no puede aprobar o rechazar esta solicitud", "ERROR", "ERRORUSUARIO");
    } else {
        formContext.getAttribute("atm_fechaaprobacionrechazo").setValue(new Date);
    }
}

VENTAS.JS.SolicitudCredito.ConfiguracionParametros = async function () {
    "use strict";

    Xrm.Navigation.navigateTo(
        {
            pageType: "webresource",
            webresourceName: "atm_configuracionparametrossc",
            //data: url
        },
        {
            target: 2,
            position: 1,
            width: { value: 70, unit: "%" }
        }
    );

}

VENTAS.JS.Actividad.VisibilidadBotonSC = async function () {
    "use strict";

    var userSettings = Xrm.Utility.getGlobalContext().userSettings;

    let retorno = false;
    let hasRole = false;
    userSettings.roles.forEach(x => {
        if (x.name === "System Administrator" || x.name === "Administrador del sistema" || x.name === "Automundial - Gerente Administrativo") {
            hasRole = true;
        }
    });

    if (hasRole) {
        retorno = true;
    }

    return retorno;
}

function CamposObligatorios(executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();

    let hasRole = false;
    var userSettings = Xrm.Utility.getGlobalContext().userSettings;
    let atm_accountid = formContext.getAttribute("atm_accountid").getValue();
    let createdon = formContext.getAttribute("createdon").getValue();

    if (atm_accountid && createdon) {
        var selected = formContext.data.process.getSelectedStage();

        if (selected.getName() === "Análisis") {
            userSettings.roles.forEach(x => {
                if (x.name === "System Administrator" || x.name === "Administrador del sistema") {
                    hasRole = true;
                }
            });

            let atm_analistacreditoid = formContext.getAttribute("atm_analistacreditoid").getValue();

            if (hasRole) {
                formContext.getControl("atm_analistacreditoid").setDisabled(false);
            } else if (userSettings.userId.replace('{', '').replace('}', '').toUpperCase() === atm_analistacreditoid[0].id.replace('{', '').replace('}', '').toUpperCase()) {
                formContext.getControl("atm_analistacreditoid").setDisabled(false);
            }
        } else {
            formContext.getControl("atm_analistacreditoid").setDisabled(true);
        }
    }
}

function removeAccents(str) {
    return str.normalize("NFD").replace("-", "").replace(/[\u0300-\u036f]/g, "").replace(" ", "").replace(" ", "").toUpperCase();
}