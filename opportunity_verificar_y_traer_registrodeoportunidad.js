

//verificamos la procedencia de la oportunidad 
function verificarOportunidad(executionContext) {
    try {
        let formContext = executionContext.getFormContext();

        let idOportunidad = formContext.data.entity.getId().slice(1, 37);
        let entidad = formContext.data.entity.getEntityName();

        //CONSULTAMOS LA DATA DE LA OPORTUNDAD EN LA QUE NOS ENCONTRAMOS PARA VALIDAR SI VIENE DE UN PROSPECTO 
        Xrm.WebApi.retrieveRecord(entidad, idOportunidad,).then(
            function success(result) {
                if (result) {
                    //CAPTURAMOS EL ID DEL PROSPECTO
                    let idProspecto = result._originatingleadid_value;
                    if (idProspecto) {
                        //CONSULTAMOS LA ENTIDAD DE PROSPECTO PARA CONSEGUIR EL NUMERO DEL PROSPECTO
                        Xrm.WebApi.retrieveRecord('lead', idProspecto,).then(
                            function success(result) {
                                // perform operations on record retrieval
                                let numProspecto = result.rd_numeroprospecto;
                                //consultamos la entidad ap_codigodeasignacion de prospecto filtrada por el numero del pedido
                                let req = new XMLHttpRequest();
                                req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/ap_codigodeasignaciondelprospectos?$select=ap_codigodeasignaciondelprospectoid,ap_codigo,_ap_fabricante_value,ap_numerodeoportunidad&$filter=(ap_idlead%20eq%20%27" + numProspecto + "%27)&$orderby=ap_codigo%20asc", true);
                                req.setRequestHeader("OData-MaxVersion", "4.0");
                                req.setRequestHeader("OData-Version", "4.0");
                                req.setRequestHeader("Accept", "application/json");
                                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                                req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
                                req.onreadystatechange = function () {
                                    if (this.readyState === 4) {
                                        req.onreadystatechange = null;
                                        if (this.status === 200) {
                                            let results = JSON.parse(this.response);

                                            if (results.value.length > 0) {
                                                results.value.forEach((value, index) => {

                                                    let ap_codigodeasignaciondelprospectoid = results.value[index].ap_codigodeasignaciondelprospectoid;

                                                    if (ap_codigodeasignaciondelprospectoid) {
                                                        let entity = {};
                                                        entity["ap_IDOportunidad@odata.bind"] = "/opportunities(" + idOportunidad + ")";

                                                        let req = new XMLHttpRequest();
                                                        req.open("PATCH", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/ap_codigodeasignaciondelprospectos(" + ap_codigodeasignaciondelprospectoid + ")", true);
                                                        req.setRequestHeader("OData-MaxVersion", "4.0");
                                                        req.setRequestHeader("OData-Version", "4.0");
                                                        req.setRequestHeader("Accept", "application/json");
                                                        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                                                        req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
                                                        req.onreadystatechange = function () {
                                                            if (this.readyState === 4) {
                                                                req.onreadystatechange = null;
                                                                if (this.status === 204) {
                                                                    //Success - No Return Data - Do Something
                                                                    console.log("todo ok");
                                                                } else {
                                                                    Xrm.Utility.alertDialog(this.statusText);
                                                                }
                                                            }
                                                        };
                                                        req.send(JSON.stringify(entity));
                                                    }
                                                });
                                            }
                                            else {
                                                console.log("no tiene resultados");
                                            }
                                        } else {
                                            console.log("no se encontraron datos");
                                        }
                                    }
                                };
                                req.send();
                            },
                            function (error) {
                                console.log(error.message);
                            }
                        );
                    } else {
                        console.log("la oportunidad no  proviene de un  prospecto");
                    }
                }
            },
            function (error) {
                console.log(error.message);
                // handle error conditions
            }
        );
    } catch (error) {
        console.log(error);
    }

}