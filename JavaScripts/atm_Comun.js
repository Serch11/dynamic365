const dataOptions = [
    {
        "parent": "atm_tipoorigencode",
        "Chaild": "leadsourcecode",
        "Options": {
            //Campaña
            "963540000": [
                { value: 963540010, text: "Cliente campaña" },
                { value: 7, text: "Feria comercial" },
                { value: 963540013, text: 'Cliente centro de servicio' },
                { value: 6, text: 'Seminario' },
            ],
            //Comunidad
            "963540001": [
                { value: 4, text: "Cliente tu camión" }
            ],
            //Encuentro
            "963540002": [
                { value: 963540008, text: "Visto en ruta" },
                { value: 8, text: "Web" },
                { value: 963540014, text: "Google" },
                { value: 1, text: "Anuncio" },
            ],
            //Evento
            "963540008": [
                { value: 963540015, text: 'Evento carpa' },
                { value: 963540017, text: 'A puerta abierta' },
                { value: 963540018, text: 'Parada estratégica' },
                { value: 963540019, text: 'Conversatorio' },
                { value: 963540020, text: 'Congreso' },
                { value: 963540021, text: 'Lanzamiento' },
            ],
            //Listado
            "963540003": [
                { value: 963540000, text: "Listado Asesor" },
                { value: 963540001, text: "Listado director regional" },
                { value: 963540009, text: "Llamada" },
            ],
            //Reactivación
            "963540004": [
                { value: 963540011, text: "Cliente inactivo" },
                { value: 963540016, text: "Chrun" },
            ],
            //Referido
            "963540005": [
                { value: 3, text: "Referido Externo" },
                { value: 963540003, text: "Referido Asesor" },
                { value: 963540004, text: "Referido Recepción" },
                { value: 963540002, text: "Referido Cliente" },
                { value: 2, text: "Referido Empleado" },
                { value: 5, text: "Referido Servicio al cliente" },
                { value: 9, text: "Comentarios de otras personas" },
            ],
            //Redes Sociales
            "963540006": [
                { value: 963540005, text: "Facebook" },
                { value: 963540006, text: "Instagram" },
                { value: 963540007, text: "WhatsApp" },
            ],
            //Otro
            "963540007": [
                { value: 10, text: "Otro" },
            ]
        }
    }
]

if (typeof VENTAS === "undefined") {
    VENTAS = {};
    VENTAS.JS = {};
}

if (typeof VENTAS.JS === "undefined") {
    VENTAS.JS = {};
}

VENTAS.JS.Comun = {}

VENTAS.JS.Comun.ValidarSoloNumeros = function (executionContext, field) {
    "use strict";

    let formContext = executionContext.getFormContext();

    let input = formContext.getAttribute(field).getValue();

    if (input) {
        var regex = /^[0-9]+$/
        let isValid = regex.test(input);

        if (!isValid) {
            formContext.getControl(field).setNotification("Este campo sólo admite números");
        } else {
            formContext.getControl(field).clearNotification();
        }
    }
}

VENTAS.JS.Comun.TelefonoCompleto = async function (executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();

    let numero = formContext.getAttribute("telephone1").getValue();
    let atm_ciudadid = formContext.getAttribute("atm_ciudadid").getValue();

    if (atm_ciudadid) {
        let ciudad = await Xrm.WebApi.retrieveRecord("atm_ciudad", atm_ciudadid[0].id, "?$select=atm_indicativo");
        if (ciudad.atm_indicativo) {
            formContext.getAttribute("atm_telefonofijocompleto").setValue(`${ciudad.atm_indicativo}${numero}`);
        }
    }

}

VENTAS.JS.Comun.OpenAlerDialog = async function (buttonText, messageText) {
    'use strict';
    try {
        let alertStrings = { confirmButtonLabel: buttonText, text: messageText };
        let alertOptions = { height: 120, width: 260 };

        return await Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
    } catch (error) {
        // console.log(error);
    }

}

VENTAS.JS.Comun.ConsultarExistenciaRol = async function (roles, roles2) {
    'use strict';
    let todos_roles;
    
    if (typeof (roles) === "string") {
        todos_roles = roles.split(",");
    }


    if (roles2) {
        roles2 = roles2.split(",");
        for (const rol of roles2) {
            todos_roles.push(rol);
        }
    }
    try {
        let existe = false;
        var userSettings = Xrm.Utility.getGlobalContext().userSettings;
        todos_roles.forEach(rol => {
            userSettings.roles.forEach(x => {
                if (x.name === rol) {
                    existe = true;
                }
            });
        });
        return existe;
    } catch (error) {
        VENTAS.JS.Comun.OpenAlerDialog("Ok", error)
        console.log(error);
    }
}

VENTAS.JS.Comun.ValidarEntidad = async function (entidad, entidadvalidar) {
    try {
        let exito = false;
        if (entidad === entidadvalidar) {
            exito = true;
        }
        return exito;
    } catch (error) {
    }
}

VENTAS.JS.Comun.ObteneroData4Path = function () {
    'use strict';
    var clienteUri = Xrm.Page.context.getClientUrl();
    var oData4Path = clienteUri + "/api/data/v9.1/";

    return oData4Path;
}

///Funcion para consultar multiples registros de una entidad
VENTAS.JS.Comun.ConsultarMultiplesEntidades = async function (entidad, options) {
    'use strict';

    return new Promise((resolve, reject) => {

        parent.Xrm.WebApi.retrieveMultipleRecords(entidad, options).then(
            function success(result) {
                if (result) resolve(result);
            },
            function (error) {
                reject(null);
            }
        );
    });
}

///Funcion para consultar un unico registro de  una entidad
VENTAS.JS.Comun.ConsultarRegistro = async function (entidad, id, options) {
    "use strict";
    try {
        return new Promise((resolve, reject) => {
            parent.Xrm.WebApi.retrieveRecord(entidad, id, options).then(
                function success(result) {
                    if (result) resolve(result);
                },
                function (error) {
                    reject(null);
                }
            );
        });
    } catch (error) {
    }
}

//Funcion para realizar consultas offline
VENTAS.JS.Comun.ConsultarRegistroOffline = async function (entidad, id, options) {

    try {
        return new Promise((resolve, reject) => {
            parent.Xrm.WebApi.retrieveRecord(entidad, id, options).then(
                function success(result) {
                    if (result) resolve(result);
                },
                function (error) {
                    reject(null);
                }
            );
        });
    } catch (error) {

    }
}

VENTAS.JS.Comun.ConsultarMultiplesEntidadesOffline = async function (entidad, options) {
    'use strict';

    return new Promise((resolve, reject) => {
        parent.Xrm.WebApi.retrieveMultipleRecords(entidad, options).then(
            function success(result) {
                if (result) resolve(result);
            },
            function (error) {
                reject(null);
            }
        );
    });
}

///Funcion que se encarga de mostrar notificaciones tipo Toast en Dynamics
VENTAS.JS.Comun.MostrarNotificacionToast = async function (nivel, mensaje) {
    "use strict";
    return new Promise((resolve, reject) => {
        parent.Xrm.App.addGlobalNotification({ type: 1, level: nivel, message: mensaje }).then(
            function success(result) {
                window.setTimeout(function () {
                    parent.Xrm.App.clearGlobalNotification(result);
                }, 7000);
            },
            function (error) { });
    });
}

///Funcion que se encarga de buscar la lista de precio en base a los parametros de una cuenta
VENTAS.JS.Comun.SeleccionarListaPrecios = async function (executionContext, lblcuenta, tipo) {
    "use strict";
    try {
        let isrevenuesystemcalculated = "";
        let formContext = executionContext.getFormContext();
        let parentaccountid = formContext.getAttribute(lblcuenta).getValue();
        let pricelevelid = formContext.getAttribute("pricelevelid");
        let transactioncurrencyid = formContext.getAttribute("transactioncurrencyid");

        if (tipo === "oportunidad") {
            isrevenuesystemcalculated = formContext.getAttribute("isrevenuesystemcalculated");
        }

        if (!pricelevelid.getValue()) {
            if (parentaccountid) {
                var cuenta = await VENTAS.JS.Comun.ConsultarRegistro("account", parentaccountid[0].id, "?$select=_atm_paisid_value,atm_semsicecode,_transactioncurrencyid_value,_atm_regionalid_value");
                // var FECHAS = VENTAS.JS.Comun.ObtenerDiasFecha();
                // var FI = VENTAS.JS.Comun.FormatDate(FECHAS[0], 2);
                // var FF = VENTAS.JS.Comun.FormatDate(FECHAS[1], 2);
                // var dia = "";

                let filtro = `?$select=begindate,enddate,name,pricelevelid&$filter=(statecode eq 0 and
                    Microsoft.Dynamics.CRM.ContainValues(PropertyName='atm_segmentocode',PropertyValues=['${cuenta.atm_semsicecode}']) and
                    _atm_paisid_value eq ${cuenta._atm_paisid_value} and _atm_regionalid_value eq null)
                    &$orderby=begindate`;

                let filtroRegional = `?$select=begindate,enddate,name,pricelevelid&$filter=(statecode eq 0 and
                        Microsoft.Dynamics.CRM.ContainValues(PropertyName='atm_segmentocode',PropertyValues=['${cuenta.atm_semsicecode}']) and
                        _atm_paisid_value eq ${cuenta._atm_paisid_value} and _atm_regionalid_value eq ${cuenta._atm_regionalid_value})
                        &$orderby=begindate`;



                //Modificamos la Divisa
                let divisa = new Array();
                divisa[0] = new Object();
                divisa[0].id = cuenta._transactioncurrencyid_value;
                divisa[0].name = VENTAS.JS.Comun.RetrieveTitleSuccess(cuenta, "_transactioncurrencyid_value@OData.Community.Display.V1.FormattedValue");
                divisa[0].entityType = "transactioncurrency";
                transactioncurrencyid.setValue(divisa);

                var LISTA;
                var LISTA_REGIONAL;
                var LISTA_GENERAL;
                if (cuenta._atm_regionalid_value) {
                    LISTA_REGIONAL = await VENTAS.JS.Comun.ConsultarMultiplesEntidades("pricelevel", filtroRegional);
                }
                LISTA_GENERAL = await VENTAS.JS.Comun.ConsultarMultiplesEntidades("pricelevel", filtro);

                if (LISTA_REGIONAL?.entities?.length > 0) {
                    LISTA = LISTA_REGIONAL;
                } else {
                    LISTA = LISTA_GENERAL;
                }
                if (LISTA?.entities?.length > 0) {
                    for (let index = 0; index < LISTA.entities.length; index++) {
                        const element = LISTA.entities[index];
                        var coincide = await VENTAS.JS.Comun.ValidarFechaEnRango(new Date(element.begindate), new Date(element.enddate), new Date())

                        if (coincide) {
                            var object = new Array();
                            if (tipo === "oportunidad") {
                                isrevenuesystemcalculated.setValue(true);
                            }

                            //Modificamos Lista de Precios
                            object[0] = new Object();
                            object[0].id = element.pricelevelid;
                            object[0].name = element.name;
                            object[0].entityType = "pricelevel";
                            pricelevelid.setValue(object);
                            break;
                        }
                    }
                } else {
                    VENTAS.JS.Comun.OpenAlerDialog("Ok", "No hay listas de precios activas para esta cuenta en este momento");
                }

            } else {
                pricelevelid.setValue(null);
                if (tipo === "oportunidad") {
                    isrevenuesystemcalculated.setValue(false);
                }
            }
        }
    } catch (error) {
        VENTAS.JS.Comun.OpenAlerDialog("Ok", "VENTAS.JS.Comun.SeleccionarListaPrecios : " + error);
    }
}

VENTAS.JS.Comun.FormatDate = function (date, estilo = 1, simbolo = "-") {
    let formatoFecha = [].join('-')

    switch (estilo) {
        case 1:
            formatoFecha = [
                VENTAS.JS.Comun.PadTo2Digits(date.getDate()),
                VENTAS.JS.Comun.PadTo2Digits(date.getMonth() + 1),
                date.getFullYear(),
            ].join(simbolo)
            break;
        case 2:
            formatoFecha = [
                date.getFullYear(),
                VENTAS.JS.Comun.PadTo2Digits(date.getMonth() + 1),
                VENTAS.JS.Comun.PadTo2Digits(date.getDate()),
            ].join(simbolo)
            break;
    }
    return formatoFecha;
}

VENTAS.JS.Comun.ObtenerDiasFecha = function () {
    "use strict";

    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);

    return [firstDay, lastDay]
}

VENTAS.JS.Comun.PadTo2Digits = function (num) {
    "use strict";

    return num.toString().padStart(2, '0');
}

VENTAS.JS.Comun.RetrieveTitleSuccess = function (data, texto) {
    "use strict";

    try {
        return data[texto];
    } catch (e) {

    }
}

VENTAS.JS.Comun.OcultarOpciones = async function (formContext, campo, opcion, nombre) {
    'use strict';

    var name_attr = campo.substring(7);
    let control = formContext.getControl(campo);
    let attr = formContext.getAttribute(name_attr);

    for (var i = 0; i < attr.getOptions().length; i++) {
        control.removeOption(attr.getOptions()[i].value);
    }

    let filterOptions = dataOptions.filter(function (entry) { return entry.parent === nombre });

    if (filterOptions[0].Options[opcion]) {
        filterOptions[0].Options[opcion].forEach(option => {
            control.addOption({ value: option.value, text: option.text });
        })
    }
}

VENTAS.JS.Comun.DescargarArchivo = async function (nombreParametro) {
    "use strict";
    try {

        let data = null;
        let idParametro = "";
        let urlAutomundial = parent.Xrm.Utility.getGlobalContext().getClientUrl();
        let res = await this.ConsultarMultiplesEntidades("atm_parametro", "?$filter=atm_nombre eq '" + nombreParametro + "'");

        if (res) {
            idParametro = res.entities[0].atm_parametroid;
            let fechamodificacion = res.entities[0].modifiedon;
            let idarchivo = res.entities[0]?.atm_archivo ? res.entities[0].atm_archivo : null;
            let urlSend = urlAutomundial + "/api/data/v9.2/atm_parametros(" + idParametro + ")/atm_archivo/";
            if (idarchivo) {
                data = {

                    url: urlSend,
                    fecha: fechamodificacion,
                    id: idarchivo
                }
            }
        }
        return data;
    } catch (error) {
    }
}

VENTAS.JS.Comun.PeticionXMLHTTP = async function (metodo, url, data) {
    "use strict";
    try {
        new Promise(async (resolve, reject) => {
            try {
                let req = new XMLHttpRequest();
                req.open(metodo, url, true);
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.onreadystatechange = async function () {
                    if (this.readyState === 4) {
                        req.onreadystatechange = null;
                        if (this.status === 200) {
                            await resolve(this.response);
                        } else {
                            resolve(false);
                        }
                    }
                }
                req.send(data);
            } catch (error) {
                reject(error);
            }
        });
    } catch (error) {
    }
}

function base64ToBufferArray(base64content) {
    var binaryString = window.atob(base64content);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}

function downloadFile(name, data) {

    var blob = new Blob(data, { type: "octet/stream" }),
        url = window.URL.createObjectURL(blob);
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, name);
    } else {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
}

VENTAS.JS.Comun.CreateXml = function (fetchXml, pagingCookie, page) {
    var domParser = new DOMParser();
    var xmlSerializer = new XMLSerializer();

    var fetchXmlDocument = domParser.parseFromString(fetchXml, "text/xml");

    if (page) {
        fetchXmlDocument
            .getElementsByTagName("fetch")[0]
            .setAttribute("page", page.toString());
    }

    if (pagingCookie) {
        var cookieDoc = domParser.parseFromString(pagingCookie, "text/xml");
        var innerPagingCookie = domParser.parseFromString(
            decodeURIComponent(
                decodeURIComponent(
                    cookieDoc
                        .getElementsByTagName("cookie")[0]
                        .getAttribute("pagingcookie")
                )
            ),
            "text/xml"
        );
        fetchXmlDocument
            .getElementsByTagName("fetch")[0]
            .setAttribute(
                "paging-cookie",
                xmlSerializer.serializeToString(innerPagingCookie)
            );
    }

    return xmlSerializer.serializeToString(fetchXmlDocument);
}

VENTAS.JS.Comun.retrieveAllRecords = function (entityName, fetchXml, page, pagingCookie) {
    if (!page) {
        page = 0;
    }

    return VENTAS.JS.Comun.retrievePage(entityName, fetchXml, page + 1, pagingCookie).then(
        function success(pageResults) {
            if (pageResults.fetchXmlPagingCookie) {
                return VENTAS.JS.Comun.retrieveAllRecords(
                    entityName,
                    fetchXml,
                    page + 1,
                    pageResults.fetchXmlPagingCookie
                ).then(
                    function success(results) {
                        if (results) {
                            return pageResults.entities.concat(results);
                        }
                    },
                    function error(e) {
                        throw e;
                    }
                );
            } else {
                return pageResults.entities;
            }
        },
        function error(e) {
            throw e;
        }
    );
}

VENTAS.JS.Comun.retrievePage = function (entityName, fetchXml, pageNumber, pagingCookie) {
    var fetchXml = "?fetchXml=" + VENTAS.JS.Comun.CreateXml(fetchXml, pagingCookie, pageNumber);

    return parent.Xrm.WebApi.online.retrieveMultipleRecords(entityName, fetchXml).then(
        function success(result) {
            return result;
        },
        function error(e) {
            throw e;
        }
    );
}

VENTAS.JS.Comun.crearURLEntidad = function (entidad, idEntidad) {
    let url = parent.Xrm.Utility.getGlobalContext().getCurrentAppUrl();
    data = `${url}&pagetype=entityrecord&etn=${entidad}&id=${idEntidad}`;
    return data;
}

VENTAS.JS.Comun.RemoveEntityTypeLookup = function (executionContext, listaEntidades, campo) {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();
        if (listaEntidades.length > 0 && campo) {
            formContext.getControl(campo).setEntityTypes(listaEntidades);
        }
    } catch (error) {
        VENTAS.JS.Comun.MostrarNotificacionToast(2, error.message);
    }
}

VENTAS.JS.Comun.CrearNombre = async function (executionContext, lista, nomenclatura, simbolo, campo, tieneregional) {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();
        let nombre = nomenclatura;
        let contador = 0;
        if (lista.length > 0) {
            for await (const item of lista) {
                var _campo = formContext.getAttribute(item).getValue();
                if (_campo) {
                    switch (formContext.getAttribute(item).getAttributeType()) {
                        case "multiselectoptionset":
                            nombre += nombre === "" ? formContext.getAttribute(item).getText().toString().replace(",", "-") : `${simbolo}${formContext.getAttribute(item).getText().toString().replace(",", "-")}`;
                            break;
                        case "lookup":
                            nombre += nombre === "" ? _campo[0].name : `${simbolo}${_campo[0].name}`;
                            break;
                        case "string":
                            nombre += nombre === "" ? _campo : `${simbolo}${_campo}`;
                            break;
                        case "datetime":
                            nombre += nombre === "" ? VENTAS.JS.Comun.FormatDate(_campo, 1, "/") : `${simbolo}${VENTAS.JS.Comun.FormatDate(_campo, 1, "/")}`;
                            break;
                        case "optionset":
                            nombre += nombre === "" ? formContext.getAttribute(item).getText() : `${simbolo}${formContext.getAttribute(item).getText()}`;
                            break;
                        default:
                            break;
                    }
                } else {
                    contador++;
                    if (item === "atm_regionalid") {
                        contador--;
                    }
                }
            }
        }
        formContext.getAttribute(campo).setValue(contador > 0 ? "" : nombre.toUpperCase());

    } catch (error) {
        VENTAS.JS.Comun.OpenAlerDialog("Ok", error)
    }
}

//funcion para guardar en un array la lista de roles de un usuario
VENTAS.JS.Comun.GuardarRoles = async function () {
    roles = new Array();
    Xrm.Utility.getGlobalContext().userSettings.roles.forEach(x => {
        roles.push(x.name);
    })
    return roles;
}

VENTAS.JS.Comun.OpenForm = async function (entityFormOptions, formParameters) {

    return new Promise((resolve, reject) => {

        Xrm.Navigation.openForm(entityFormOptions, formParameters).then(
            function (result) {
                resolve(result);
            },
            function (error) {
                reject(error);
            }
        );
    });
}

VENTAS.JS.Comun.CrearRegistro = async function (entidad, data) {
    "use strict";
    try {
        return new Promise((resolve, reject) => {
            parent.Xrm.WebApi.createRecord(entidad, data).then(
                function success(result) {
                    // perform operations on record creation
                    resolve(result);
                },
                function (error) {
                    reject(error)
                }
            );
        })
    } catch (error) {
        VENTAS.JS.Comun.OpenAlerDialog("OK", error);
    }
}

VENTAS.JS.Comun.ActualizarRegistro = async function (entidad, id, data) {
    return new Promise((resolve, reject) => {

        Xrm.WebApi.updateRecord(entidad, id, data).then(
            function success(result) {
                resolve(result);
            },
            function (error) {
                reject(error);
            }
        );
    });
}

async function RetornarId(id) {
    return id.replace("{", "").replace("}", "");
}

VENTAS.JS.Comun.ValidarFechaEnRango = async function (fechaInicio, fechaFin, fechaValidar) {

    const fechaInicioMs = fechaInicio.getTime();
    const fechaFinMs = fechaFin.getTime();
    const fechaValidarMs = fechaValidar.getTime();

    if (fechaValidarMs >= fechaInicioMs && fechaValidarMs <= fechaFinMs) {
        return true;
    } else {
        return false;
    }
}

VENTAS.JS.Comun.ValidarFechaMayorEntreDosFechas = async function (executionContext, fInicio, Ffin) {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();
        let fechaInicial = formContext.getAttribute(fInicio);
        let fechaFinal = formContext.getAttribute(Ffin);
        let mensaje = "";

        if (fechaInicial.getValue()) {
            if (fechaInicial.getValue().getTime() > fechaFinal.getValue().getTime()) {

                mensaje = `La fecha del campo ${formContext.getControl(Ffin).getLabel()} no puede ser menor a la fecha del campo ${formContext.getControl(fInicio).getLabel()}`;
                let result = await VENTAS.JS.Comun.OpenAlerDialog("Ok", mensaje);
                if (result) {
                    fechaFinal.setValue(null);
                }
            }
        } else {
            mensaje = `Para seleccionar la fecha del campo ${formContext.getControl(Ffin).getLabel()} debe primero escoger la fecha del campo ${formContext.getControl(fInicio).getLabel()}`;
            let result = await VENTAS.JS.Comun.OpenAlerDialog("Ok", mensaje);
            if (result) {
                fechaFinal.setValue(null);
            }
        }
    } catch (error) {
        VENTAS.JS.Comun.OpenAlerDialog("OK", error);
    }
}

VENTAS.JS.Comun.ValidarFechaMayorEntreDosFechasV1 = async function (executionContext, fInicio, Ffin, campo) {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();
        let fechaInicial = formContext.getAttribute(fInicio);
        let fechaFinal = formContext.getAttribute(Ffin);
        let mensaje = "";

        formContext.getControl(campo).clearNotification(campo);

        if (fechaInicial.getValue() && fechaFinal.getValue()) {
            if (fechaInicial.getValue().getTime() > fechaFinal.getValue().getTime()) {
                mensaje = `La fecha del campo ${formContext.getControl(Ffin).getLabel()} no puede ser menor a la fecha del campo ${formContext.getControl(fInicio).getLabel()}`;
                formContext.getControl(campo).setNotification(mensaje, campo);
            }
        } else {
            mensaje = `Para seleccionar la fecha del campo ${formContext.getControl(Ffin).getLabel()} debe primero escoger la fecha del campo ${formContext.getControl(fInicio).getLabel()}`;
            formContext.getControl(campo).setNotification(mensaje, campo);
        }
    } catch (error) {
        VENTAS.JS.Comun.OpenAlerDialog("OK", error);
    }
}

VENTAS.JS.Comun.ValidarNumeroEntreDosValores = async function (valorInicio, ValorFin, valor) {
    "use strict";
    try {
        if (valor >= valorInicio && valor <= ValorFin) {
            return true;
        } else {
            return false;
        }
    } catch (error) {

    }
}

VENTAS.JS.Comun.BloquearCamposDelFormulario = async function (executionContext, mensaje) {
    "use  strict";
    try {
        let formContext = executionContext.getFormContext();
        let formControls = formContext.ui.controls;

        formControls.forEach(control => {
            if (control.getName() != "" && control.getName() != null) {
                control.setDisabled(true);
            }
        });
        formContext.ui.setFormNotification(mensaje, "INFO", "REGISTROBLOQUEADO");
    } catch (error) {
        VENTAS.JS.Comun.OpenAlerDialog("OK", error);
    }
}

VENTAS.JS.Comun.NavigateTo = async (pageInput) => {
    "use strict";

    return new Promise((resolve, reject) => {
        try {
            let navigationOptions = {
                target: 2,
                height: { value: 80, unit: "%" },
                width: { value: 70, unit: "%" },
                position: 1
            };
            Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(
                function success(result) {
                    resolve(result);
                },
                function error(error) {
                    resolve(error);
                }
            );
        } catch (error) {
            reject(error);
        }
    })
}

VENTAS.JS.Comun.Cargando = async function (mensaje) {
    "use strict";
    try {
        Xrm.Utility.showProgressIndicator(mensaje);
    } catch (error) {
        VENTAS.JS.Comun.OpenAlerDialog("OK", error);
    }
}

VENTAS.JS.Comun.HabilitarODesabilitarGridEditable = function (eventContext, booleano) {
    "use strict";
    try {
        console.log(eventContext.getEventSource());
        eventContext.getEventSource().attributes.forEach(function (attr) {
            attr.controls.forEach(function (myField) {
                console.log(myField);
                myField.setDisabled(booleano);
            })
        })
    } catch (error) {
        console.log(error);
    }
}

VENTAS.JS.Comun.OpenTheRecordSidePane = async function (executionContext, nombrepanel) {
    try {
        "use strict";
        const paneId = nombrepanel;
        const formContext = executionContext.getFormContext();
        const entityName = formContext.data.entity.getEntityName();
        const recordId = formContext.data.entity.getId();

        if (recordId == null) {
            return;
        }

        const pane = Xrm.App.sidePanes.getPane(paneId) ?? (await Xrm.App.sidePanes.createPane({ paneId: paneId, canClose: true }));
        pane.width = 400;
        pane.navigate({
            pageType: "entityrecord",
            entityName: entityName,
            entityId: recordId
        });
    } catch (error) {
        console.log(error);
    }
}

VENTAS.JS.Comun.AlertaError = async function (formContext, mensaje) {

    return new Promise((resolve, reject) => {
        Xrm.Navigation.openErrorDialog({ errorCode: mensaje }).then(
            function (success) {
                resolve(success)
            },
            function (error) {
                reject(error)
            });
    })
}

VENTAS.JS.Comun.ConfirmarDialogo = async function (formContext, confirmStrings, confirmOptions) {
    return new Promise((resolve, reject) => {
        Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions).then(
            function (success) {
                if (success.confirmed) {
                    resolve(success.confirmed)

                } else {
                    resolve(success)
                }
            },
            function (error) {
                reject(error)
            }
        );
    })

}

// ######################################
// Author: Sergio Redondo
// Fecha: Septimebre 05 2023
// Description : Esta funcion se utiliza para cargar el script COMUN en el ribbon workbench
// ######################################
VENTAS.JS.Comun.CargarComun = async function () {
    "use strict";
}

