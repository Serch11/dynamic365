

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
        let alertOptions = { height: 160, width: 260 };


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
    }
}


