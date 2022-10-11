

var script_global = {

    obtenerURl: function (executionContext) {
        try {

            let formContext = executionContext.getFormContext();

            let invt_url_entidad = formContext.getAttribute("invt_url_entidad");

            let idEntidad;
            let url3 = ``;
            let data;
            let entidad = formContext.data.entity.getEntityName();


            if (formContext.ui.getFormType() != 1) {
                let url = Xrm.Utility.getGlobalContext().getCurrentAppUrl();
                idEntidad = formContext.data.entity.getId().slice(1, 37).toLowerCase();
                data = `${url}&pagetype=entityrecord&etn=${entidad}&id=${idEntidad}`;

                if (invt_url_entidad) invt_url_entidad.setValue(data);
            } else {
                //console.log("Nuevo registro");
            }
        } catch (error) {
            console.log(error);
            console.log("error funcion obtenerUrl");
        }
    },


    consultarEntidadId: function (id, entidad, campos = null) {
        try {
            return new Promise((resolve, reject) => {
                Xrm.WebApi.retrieveRecord(entidad, id).then(
                    function success(result) {

                        if (result) {
                            resolve(result);
                        }
                        reject(null);
                    },
                    function (error) {
                        console.log(error.message);
                        // handle error conditions
                    }
                );
            })

        } catch (error) {
            console.log("Error consultar entidades");
        }
    },

    //consultar multiples datos dentro de una entidad
    consultaMultipleEntidades: async function (entidad, options) {

        return new Promise((resolve, reject) => {


            Xrm.WebApi.online.retrieveMultipleRecords(entidad, options).then(
                function success(result) {
                    // perform operations on on retrieved records
                    if (result) resolve(result);
                },
                function (error) {
                    console.log(error.message);
                    reject(null);
                    // handle error conditions
                }
            );
        });
    },

    enviarAlertaDeDialogo: function (confirmButton, mensaje, titulo = null) {

        console.log("ingreso a enviarAlertaDeDialogo")
        let alertStrings = { confirmButtonLabel: confirmButton, text: mensaje, title: titulo };
        let alertOptions = { height: 260, width: 260 };


        return new Promise((resolve, reject) => {
            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                function success() {

                    resolve(true);
                },
                function (error) {
                    reject(false);
                    // handle error conditions
                }
            );
        })

    },

    enviarAlertaDeConfirmacionDeDialogo: function (subtitulo, texto, titulo) {

        let confirmStrings = {
            cancelButtonLabel: 'Cancelar',
            confirmButtonLabel: 'Confirmar',
            subtitle: subtitulo,
            text: texto,
            title: titulo
        };
        let confirmOptions = { height: 200, width: 450 };

        return new Promise((resolve, reject) => {
            Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions).then(
                function (success) {
                    if (success.confirmed) {
                        resolve(success.confirmed);
                    } else {
                        resolve(success.confirmed);
                    }
                },
                function (error) {
                    console.log(error.message);
                    // handle error conditions
                }
            );

        })
    },

    EjecutarAccionPersonalizada: async function (url, nombreAccion, nombreEntidad, registroId, parametros, IdUsuarioPersonalizar) {
        try {

            if (Xrm.Page.ui != null) {
                Xrm.Page.ui.clearFormNotification("NetWorkError");
            }

            let resultado = null;
            // let error = null;
            let oData4Path = script_global.ObtenerData4Path();

            //preparar el request
            let req = new XMLHttpRequest();
            // let query = oData4Path + entidad + "(" + idEntidad + ")Microsoft.Dynamics.CRM." + accion;
            var query = oData4Path + nombreEntidad + "(" + registroId + ")/Microsoft.Dynamics.CRM." + nombreAccion;
            console.log(url);
            req.open("POST", query, false);
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");



            // if (idUsuarioImpersonalizar !== null) {
            //     req.setRequestHeader("MSCRMCallerID", idUsuarioImpersonalizar);
            // }
            //ejecutar el request
            req.onreadystatechange = function () {

                ///completo el request
                if (this.readyState === 4) {
                    req.onreadystatechange = null;

                    switch (this.status) {

                        /// Request exitoso
                        case 200:
                            resultado = JSON.parse(this.response);
                            break;
                        case 204:
                            resultado = null;
                            break;
                        //// se notifica el error 
                        default:
                            error = JSON.parse(this.response).error;
                            break;
                    }
                }
            }
            /// Se envia el request
            if (parametros !== null) {
                req.send(window.JSON.stringify(parametros));
            } else {
                req.send();
            }

            if (error !== null && error !== undefined)
                throw new Error(error.message);

            return resultado;
        } catch (error) {
            if (error.name === "NetworkError") {
                console.log(error.name);
            }
        }

    },


    ObtenerData4Path: function () {

        let clienteUri = Xrm.Page.context.getClientUrl();
        let oData4Path = clienteUri + "/api/data/v9.2/";
        return oData4Path;
    },

    obtenerFechaDelDia: async function () {
        let fechaDia = new Date();
        let fNewDateC = new Date(`${fechaDia.getFullYear()}-${fechaDia.getMonth() + 1}-${fechaDia.getDate()}`);
        return fNewDateC.getTime();
    }
}


let fetch = "<fetch mapping = 'logical' ><entity name='account'><attribute name='name'/><attribute name='accountid' /></entity></fetch >"