/*
Biblioteca de scripts con el CRUD del Web API
*/
var UtilidadesWebApi = {

    /*
    Funciones: PrepararParaRecursos
    Autor: Mario Alejandro Ramírez (mramirezr@intergrupo.com)
    Descripción: Prepara la biblioteca para ejecutar desde un recurso web.
    */
    PrepararParaRecursos: function () {
        Xrm = window.parent.Xrm;
    },

    /*
    Funciones: PrepararParaRecursosOpener
    Autor: Mario Alejandro Ramírez (mramirezr@intergrupo.com)
    Descripción: Prepara la biblioteca para ejecutar desde un recurso web.
    */
    PrepararParaRecursosOpener: function () {
        Xrm = window.top.opener.Xrm;
    },

    /*
    Funciones: ObteneroData4Path
    Autor: Mario Alejandro Ramírez (mramirezr@intergrupo.com)
    Descripción: Permite obtener el url base para la ejecución del WebAPI.
    */
    ObteneroData4Path: function () {
        var clientUri = Xrm.Page.context.getClientUrl();
        var oData4Path = clientUri + "/api/data/v9.1/";

        return oData4Path;
    },

    /*
    Funciones: Ejecutar
    Autor: Mario Alejandro Ramírez (mramirezr@intergrupo.com)
    Descripción: Ejecuta la instrucción WebAPI.
    */
    Ejecutar: function (url, asincrono) {
        try {

            if (Xrm.Page.ui !== null) {
                Xrm.Page.ui.clearFormNotification("NetworkError");
            }

            var resultado = null;

            //// Prepara el request
            var req = new XMLHttpRequest();
            req.open("GET", url, asincrono);
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("Prefer", "odata.include-annotations=OData.Community.Display.V1.FormattedValue");
            //// Ejecuta el request
            req.onreadystatechange = function () {

                //// Completo el request
                if (this.readyState === 4) {
                    req.onreadystatechange = null;
                    switch (this.status) {

                        //// Request exitoso
                        case 200:
                            resultado = JSON.parse(this.response);
                            break;
                        case 204:
                            resultado = null;
                            break;

                        //// Se notifica el error.
                        default:
                            error = JSON.parse(this.response).error;
                            break;
                    }
                }
            };

            //// Se envia el request.
            req.send();

            return resultado;

        } catch (e) {
            //// Error de conexión
            if (e.name === "NetworkError") {

                //// Si es mobile se muestra el alert.
                var dispositivoMovil = Xrm.Page.context.client.getClient() === "Mobile";
                if (dispositivoMovil) {
                    Xrm.Utility.alertDialog(Comunes.DevuelveMensajeErrorPorConexion(), "ERROR");
                } else {
                    Xrm.Page.ui.setFormNotification(
                        Comunes.DevuelveMensajeErrorPorConexion(),
                        "ERROR",
                        "NetworkError");
                }
            }
        }
    },

    /*
    Funciones: LlamarFlow
    Autor: Juan Camilo Calderón (jcalderone@intergrupo.com)
    Descripción: Realiza request tipo POST para llamar Flows.
    */
    LlamarFlow: function (urlFlow, parametrosFlow) {
        try {
            let resultado = null;
            let error = null;

            //// Prepara el request
            var req = new XMLHttpRequest();
            req.open("POST", urlFlow, false);
            req.setRequestHeader("cache-control", "no-cache");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");

            //// Ejecuta el request
            req.onreadystatechange = function () {

                //// Completo el request
                if (this.readyState === 4) {
                    req.onreadystatechange = null;

                    switch (this.status) {

                        //// Request exitoso
                        case 200:

                            resultado = JSON.parse(this.response);
                            break;
                        case 204:

                            resultado = null;
                            break;

                        //// Se notifica el error.
                        default:
                            error = JSON.parse(this.response).error;
                            break;
                    }
                }
            };

            //// Se envia el request.
            req.send(window.JSON.stringify(parametrosFlow));

            if (error !== null && error !== undefined)
                throw new Error(error.message);

            return resultado;

        } catch (e) {
            //// Error de conexión
            if (e.name === "NetworkError") {

                //// Si es mobile se muestra el alert.
                var dispositivoMovil = Xrm.Page.context.client.getClient() === "Mobile";
                if (dispositivoMovil) {
                    Xrm.Utility.alertDialog(Comunes.DevuelveMensajeErrorPorConexion(), "ERROR");
                } else {
                    Xrm.Page.ui.setFormNotification(
                        Comunes.DevuelveMensajeErrorPorConexion(),
                        "ERROR",
                        "NetworkError");
                }
            } else {
                throw new Error(e.message);
            }
        }
    },

    /*
       Funciones: ConsultarMultiplePersonalizada
       Autor: Viviana Cano Castrillon (vcano@intergrupo.com)
       Descripción: Permite realizar retrieve multiples con la cuenta técnica.
       */
    ConsultarMultiplePersonalizada: function (nombreEntidad, asincrono, filtro) {

        var resultado = null;
        const idCuentaTecnica = Comunes.ConsultarParametroTecnico("Id Cuenta Tecnica");

        //// Prepara la url de la consulta multiple.
        oData4Path = UtilidadesWebApi.ObteneroData4Path();
        url = encodeURI(oData4Path + nombreEntidad + filtro);

        //// Ejecuta la consulta.
        resultado = UtilidadesWebApi.Ejecutar(url, asincrono, idCuentaTecnica);

        return resultado;
    },
    /*
    Funciones: ConsultarMultiple
    Autor: Mario Alejandro Ramírez (mramirezr@intergrupo.com)
    Descripción: Permite realizar retrieve multiples.
    */
    ConsultarMultiple: function (nombreEntidad, asincrono, filtro) {

        var resultado = null;

        //// Prepara la url de la consulta multiple.
        oData4Path = UtilidadesWebApi.ObteneroData4Path();
        url = encodeURI(oData4Path + nombreEntidad + filtro);

        //// Ejecuta la consulta.
        resultado = UtilidadesWebApi.Ejecutar(url, asincrono);

        return resultado;
    },

    /*
    Funciones: Consultar
    Autor: Mario Alejandro Ramírez (mramirezr@intergrupo.com)
    Descripción: Permite realizar retrieve.
    */
    Consultar: function (nombreEntidad, asincrono, idRegistro, columnset) {

        var resultado = null;

        //// Prepara la url para la consulta.
        oData4Path = UtilidadesWebApi.ObteneroData4Path();
        url = encodeURI(oData4Path + nombreEntidad + "(" + idRegistro + ")" + columnset);

        //// Ejecuta la consulta.
        resultado = UtilidadesWebApi.Ejecutar(url, asincrono);

        return resultado;
    },

    /*
    Funciones: ConsultarFetch
    Autor: Guillermo Rosales Goethe (grosales@intergrupo.com)
    Descripción: Permite realizar consultaspor medio de un fetch.
    */
    ConsultarFetch: function (nombreEntidad, asincrono, fetch) {
        var resultado = null;
        oData4Path = UtilidadesWebApi.ObteneroData4Path();
        url = encodeURI(oData4Path + nombreEntidad + "?fetchXml=" + fetch);
        return UtilidadesWebApi.Ejecutar(url, asincrono);
    },

    /*
    Funciones: EjecutarAccionPersonalizada
    Autor: Mario Alejandro Ramírez (mramirezr@intergrupo.com)
    Descripción: Permite disparar un custom action.
    */
    EjecutarAccionPersonalizada: function (nombreAccion, parametros) {
        try {
            if (Xrm.Page.ui !== null) {
                Xrm.Page.ui.clearFormNotification("NetworkError");
            }

            var resultado = null;
            var error = null;
            var oData4Path = UtilidadesWebApi.ObteneroData4Path();

            //// Prepara el request
            var req = new XMLHttpRequest();
            req.open("POST", oData4Path + nombreAccion, false);
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");

            //// Ejecuta el request
            req.onreadystatechange = function () {

                //// Completo el request
                if (this.readyState === 4) {
                    req.onreadystatechange = null;

                    switch (this.status) {

                        //// Request exitoso
                        case 200:
                            resultado = JSON.parse(this.response);
                            break;
                        case 204:
                            resultado = null;
                            break;

                        //// Se notifica el error.
                        default:
                            error = JSON.parse(this.response).error;
                            break;
                    }
                }
            };

            //// Se envia el request.
            req.send(window.JSON.stringify(parametros));

            if (error !== null && error !== undefined)
                throw new Error(error.message);

            return resultado;

        } catch (e) {
            //// Error de conexión
            if (e.name === "NetworkError") {

                //// Si es mobile se muestra el alert.
                var dispositivoMovil = Xrm.Page.context.client.getClient() === "Mobile";
                if (dispositivoMovil) {
                    Xrm.Utility.alertDialog(Comunes.DevuelveMensajeErrorPorConexion(), "ERROR");
                } else {
                    Xrm.Page.ui.setFormNotification(
                        Comunes.DevuelveMensajeErrorPorConexion(),
                        "ERROR",
                        "NetworkError");
                }
            } else {
                throw new Error(e.message);
            }
        }
    },

    /*
    Funciones: EjecutarAccionPersonalizadaEntidad
    Autor: Mario Ramirez
    Descripción: Permite disparar un custom action.
    Parametros: nombreAccion: Nombre único de la acción
                nombreEntidad: nombre de schema de la entidad
                registroId: Id del registro de la entidad en la que se esta ejecutando la acción
                parametros: Parametros de entrada, null si no tiene.
                idUsuarioImpersonalizar: Id del usuario a nombre de quien se ejecuta la acción. null si se hace con el usuario actual.
    */
    EjecutarAccionPersonalizadaEntidad: function (nombreAccion, nombreEntidad, registroId, parametros, idUsuarioImpersonalizar) {
        try {
            if (Xrm.Page.ui !== null) {
                Xrm.Page.ui.clearFormNotification("NetworkError");
            }

            var resultado = null;
            var error = null;
            var oData4Path = UtilidadesWebApi.ObteneroData4Path();

            //// Prepara el request
            var req = new XMLHttpRequest();
            var query = oData4Path + nombreEntidad + "(" + registroId + ")/Microsoft.Dynamics.CRM." + nombreAccion;
            req.open("POST", query, false);
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");

            if (idUsuarioImpersonalizar !== null) {
                req.setRequestHeader("MSCRMCallerID", idUsuarioImpersonalizar);
            }

            //// Ejecuta el request
            req.onreadystatechange = function () {

                //// Completo el request
                if (this.readyState === 4) {
                    req.onreadystatechange = null;

                    switch (this.status) {

                        //// Request exitoso
                        case 200:
                            resultado = JSON.parse(this.response);
                            break;
                        case 204:
                            resultado = null;
                            break;

                        //// Se notifica el error.
                        default:
                            error = JSON.parse(this.response).error;
                            break;
                    }
                }
            };

            //// Se envia el request.
            if (parametros !== null) {
                req.send(window.JSON.stringify(parametros));
            }
            else {
                req.send();
            }

            if (error !== null && error !== undefined)
                throw new Error(error.message);

            return resultado;

        } catch (e) {
            //// Error de conexión
            if (e.name === "NetworkError") {

                //// Si es mobile se muestra el alert.
                var dispositivoMovil = Xrm.Page.context.client.getClient() === "Mobile";
                if (dispositivoMovil) {
                    Xrm.Utility.alertDialog(Comunes.DevuelveMensajeErrorPorConexion(), "ERROR");
                } else {
                    Xrm.Page.ui.setFormNotification(
                        Comunes.DevuelveMensajeErrorPorConexion(),
                        "ERROR",
                        "NetworkError");
                }
            } else {
                throw new Error(e.message);
            }
        }
    },

    /*
    Funciones: EjecutarAccionPersonalizadaSinParametros
    Autor: Fabio Alejandro Giraldo (fgiraldog@intergrupo.com)
    Descripción: Permite disparar un custom action.
    Parametros: nombreAccion: Nombre único de la acción
                nombreEntidad: nombre de schema de la entidad
                registroId: Id del registro de la entidad en la que se esta ejecutando la acción
                idUsuarioImpersonalizar: Id del usuario a nombre de quien se ejecuta la acción. null si se hace con el usuario actual.
    */
    EjecutarAccionPersonalizadaSinParametros: function (nombreAccion, nombreEntidad, registroId, idUsuarioImpersonalizar) {
        try {
            if (Xrm.Page.ui !== null) {
                Xrm.Page.ui.clearFormNotification("NetworkError");
            }

            var resultado = null;
            var error = null;
            var oData4Path = UtilidadesWebApi.ObteneroData4Path();

            var data = {
                "dummy": "dummyValue"
            };

            //// Prepara el request
            var req = new XMLHttpRequest();
            var query = oData4Path + nombreEntidad + "(" + registroId + ")/Microsoft.Dynamics.CRM." + nombreAccion;
            req.open("POST", query, false);
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");

            if (idUsuarioImpersonalizar !== null) {
                req.setRequestHeader("MSCRMCallerID", idUsuarioImpersonalizar);
            }

            //// Ejecuta el request
            req.onreadystatechange = function () {

                //// Completo el request
                if (this.readyState === 4) {
                    req.onreadystatechange = null;

                    switch (this.status) {

                        //// Request exitoso
                        case 200:
                            resultado = JSON.parse(this.response);
                            break;
                        case 204:
                            resultado = null;
                            break;

                        //// Se notifica el error.
                        default:
                            error = JSON.parse(this.response).error;
                            break;
                    }
                }
            };

            //// Se envia el request.
            req.send(window.JSON.stringify(data));

            if (error !== null && error !== undefined)
                throw new Error(error.message);

            return resultado;

        } catch (e) {
            //// Error de conexión
            if (e.name === "NetworkError") {

                //// Si es mobile se muestra el alert.
                var dispositivoMovil = Xrm.Page.context.client.getClient() === "Mobile";
                if (dispositivoMovil) {
                    Xrm.Utility.alertDialog(Comunes.DevuelveMensajeErrorPorConexion(), "ERROR");
                } else {
                    Xrm.Page.ui.setFormNotification(
                        Comunes.DevuelveMensajeErrorPorConexion(),
                        "ERROR",
                        "NetworkError");
                }
            } else {
                throw new Error(e.message);
            }
        }
    },

    /*    
    Funciones: EjecutarEdicion
    Autor: Mario Céspedes (mcespedes@intergrupo.com)
    Descripción: Ejecuta la instrucción WebAPI.
    */
    EjecutarEdicion: function (url, entidad, asincrono) {
        try {

            if (Xrm.Page.ui !== null) {
                Xrm.Page.ui.clearFormNotification("NetworkError");
            }

            var error = null;
            var resultado = null;

            //// Prepara el request
            var req = new XMLHttpRequest();
            req.open("PATCH", url, asincrono);
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");

            //// Ejecuta el request
            req.onreadystatechange = function () {

                //// Completo el request
                if (this.readyState === 4) {
                    req.onreadystatechange = null;
                    switch (this.status) {
                        //// Request exitoso
                        case 200:
                            resultado = JSON.parse(this.response);
                            break;

                        case 204:
                            resultado = null;
                            break;

                        //// Se notifica el error.
                        default:
                            error = JSON.parse(this.response).error;
                            break;
                    }
                }
            };

            //// Se envia el request.
            req.send(JSON.stringify(entidad));

            if (error !== null && error !== undefined)
                throw new Error(error.message);

            return resultado;

        } catch (e) {
            //// Error de conexión
            if (e.name === "NetworkError") {

                //// Si es mobile se muestra el alert.
                var dispositivoMovil = Xrm.Page.context.client.getClient() === "Mobile";
                if (dispositivoMovil) {
                    Xrm.Utility.alertDialog(Comunes.DevuelveMensajeErrorPorConexion(), "ERROR");
                } else {
                    Xrm.Page.ui.setFormNotification(
                        Comunes.DevuelveMensajeErrorPorConexion(),
                        "ERROR",
                        "NetworkError");
                }
            } else {
                Xrm.Utility.alertDialog(e.message, "ERROR");
                throw new Error(e.message);
            }
        }
    },

    /*
    Funciones: Editar
    Autor: Mario Céspedes (mcespedes@intergrupo.com)
    Descripción: Permite realizar el update.
    */
    Editar: function (nombreEntidad, asincrono, idRegistro, coleccionCamposValores) {

        var resultado = null;

        //// Prepara la url para la edición.
        oData4Path = UtilidadesWebApi.ObteneroData4Path();
        url = encodeURI(oData4Path + nombreEntidad + "(" + idRegistro + ")");

        //// Ejecuta la consulta.
        try {
            resultado = UtilidadesWebApi.EjecutarEdicion(url, coleccionCamposValores, asincrono);
        } catch (error) {
            throw new Error(error.message);
        }

        return resultado;
    },

    /*
    Funciones: Desasociar
    Autor: Juan Camilo Calderón (jcalderone@intergrupo.com)
    Descripción: limpia la relacion con un campo lookup.
    */
    Desasociar: function (entidadPrincipal, idPrincipal, entidadRelacionada, idEntidadRelacionada, asincrono) {

        var resultado = null;

        //// Prepara la url para la edición.
        oData4Path = UtilidadesWebApi.ObteneroData4Path();
        url = encodeURI(oData4Path + entidadPrincipal + "(" + idPrincipal + ")/" + entidadRelacionada + "(" + idEntidadRelacionada + ")/$ref");

        //// Ejecuta la consulta.
        resultado = UtilidadesWebApi.EjecutarDesasociacion(url, asincrono);

        return resultado;
    },

    /*    
    Funciones: EjecutarDesasociacion
    Autor: Juan Camilo Caldeón (jcalderone@intergrupo.com)
    Descripción: Ejecuta la instrucción WebAPI.
    */
    EjecutarDesasociacion: function (url, asincrono) {
        try {

            if (Xrm.Page.ui !== null) {
                Xrm.Page.ui.clearFormNotification("NetworkError");
            }

            var resultado = null;

            //// Prepara el request
            var req = new XMLHttpRequest();
            req.open("DELETE", url, asincrono);
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");

            //// Ejecuta el request
            req.onreadystatechange = function () {

                //// Completo el request
                if (this.readyState === 4) {
                    req.onreadystatechange = null;
                    switch (this.status) {
                        //// Request exitoso
                        case 200:
                            resultado = JSON.parse(this.response);
                            break;

                        case 204:
                            resultado = null;
                            break;

                        //// Se notifica el error.
                        default:
                            error = JSON.parse(this.response).error;
                            break;
                    }
                }
            };

            //// Se envia el request.
            req.send();

            return resultado;

        } catch (e) {
            //// Error de conexión
            if (e.name === "NetworkError") {

                //// Si es mobile se muestra el alert.
                var dispositivoMovil = Xrm.Page.context.client.getClient() === "Mobile";
                if (dispositivoMovil) {
                    Xrm.Utility.alertDialog(Comunes.DevuelveMensajeErrorPorConexion(), "ERROR");
                } else {
                    Xrm.Page.ui.setFormNotification(
                        Comunes.DevuelveMensajeErrorPorConexion(),
                        "ERROR",
                        "NetworkError");
                }
            }
        }
    },
    /*
    Funciones: ConsultarParametroTecnico
    Autor: Gao (gossio@intergrupo.com)    
    Descripción: Consulta un parametro tecnico y devuelve su valor
    Parámetros: Identificador del parametro tecnico
    */
    ConsultarParametroTecnicoFlow: function (codigoParametro) {
        var entidad = "ig_parametrotecnicos";
        var filtro = "?$select=ig_valoropcional&$filter=ig_codigo eq '" + codigoParametro + "' and statecode eq 0";
        var parametroTecnico = UtilidadesWebApi.ConsultarMultiple(entidad, false, filtro);

        if (parametroTecnico !== null &&
            parametroTecnico !== undefined &&
            parametroTecnico.value.length > 0) {
            return parametroTecnico.value[0].ig_valoropcional;
        }
        return "";
    }
};