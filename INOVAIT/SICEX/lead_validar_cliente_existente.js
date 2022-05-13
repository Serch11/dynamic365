
//script para utilizar en la entidad de clientes potenciales

var utilidades_lead = {




    validarDominio: function (executionContext) {

        try {

            var formContext = executionContext.getFormContext();
            let emailaddress1 = formContext.getAttribute("emailaddress1");

            if (formContext.ui.getFormType() != 0 && formContext.ui.getFormType() != 1) {
                if (emailaddress1.getValue()) {
                    let email = emailaddress1.getValue().split("@");
                    //console.log(email);
                    let dominio = email[1];
                    let dominiolimpio = dominio.split(".");
                    let ndominio = dominiolimpio[0];
                    //console.log(ndominio);

                    if (dominiolimpio != null) {
                        Xrm.WebApi.retrieveMultipleRecords('account', "?$select=name&$filter=name eq '" + ndominio + "' ").then(
                            function success(result) {
                                // perform operations on on retrieved records
                                //console.log(result);
                                //console.log(result.entities.length);
                                if (result.entities.length > 0) {

                                    let data = {
                                        "invt_clienteexistente": true
                                    }

                                    Xrm.WebApi.updateRecord('lead', formContext.data.entity.getId().slice(1, 37), data).then(
                                        function success(result) {
                                            // perform operations on record update
                                            //console.log("Cliente actualizado")
                                        },
                                        function (error) {
                                            console.log(error.message);
                                            // handle error conditions
                                        }
                                    );
                                }
                            },
                            function (error) {
                                console.log(error.message);
                                // handle error conditions
                            }
                        );
                    }
                }

            }


        } catch (error) {
            console.log("Error script validarDominio" + error)
        }

    }

}