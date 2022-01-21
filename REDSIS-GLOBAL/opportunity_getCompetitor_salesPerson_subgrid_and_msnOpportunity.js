function loadFunctionGetSubGrid(executionContext) {
  getSubGrid(executionContext);
  mensajeOportunidad(executionContext);
  verificarOportunidad(executionContext);
}

function getSubGrid(executeContext) {
  let formContext = executeContext.getFormContext();
  let cintaName = "Opportunity Sales Process";
  let cintaProspecto = "Lead to Opportunity Sales Process";
  let activeProcess = formContext.data.process.getActiveProcess();

  if (activeProcess) {
    formContext
      .getControl("header_process_identifycompetitors")
      .setDisabled(true);
    formContext
      .getControl("header_process_identifypursuitteam")
      .setDisabled(true);

    let nombreCinta = activeProcess.getName();
    

    if (nombreCinta === cintaName || nombreCinta === cintaProspecto) {
      let gridContextCompetidores = formContext.getControl("Competitors");
      let GridPursuit_Team = formContext.getControl("Pursuit_Team");
      let identifycompetitors = formContext.getAttribute("identifycompetitors");
      let identifypursuitteam = formContext.getAttribute("identifypursuitteam");

      //identifycompetitors.addOnChange(Cambio);

      setTimeout(() => {
        //console.log(gridContext.getGrid());
        //console.log(gridContext.getGrid().getRows());
        //console.log(gridContext.getGrid().getSelectedRows());
        //console.log(gridContext.getGrid().getRows().getLength());
        //console.log(GridPursuit_Team.getGrid().getTotalRecordCount());
        //console.log(gridContext.getGrid().getTotalRecordCount());
        if (gridContextCompetidores.getGrid().getTotalRecordCount() > 0) {
          identifycompetitors.setValue(true);
          formContext
            .getControl("header_process_identifycompetitors")
            .getAttribute()
            .setValue(true);
        } else {
          identifycompetitors.setValue(false);
          formContext
            .getControl("header_process_identifycompetitors")
            .getAttribute()
            .setValue(false);
        }

        if (GridPursuit_Team.getGrid().getTotalRecordCount() > 0) {
          identifypursuitteam.setValue(true);
          formContext
            .getControl("header_process_identifypursuitteam")
            .getAttribute()
            .setValue(true);
        } else {
          identifypursuitteam.setValue(false);
          formContext
            .getControl("header_process_identifypursuitteam")
            .getAttribute()
            .setValue(false);
        }

        gridContextCompetidores.addOnLoad(setCompetidores);
        GridPursuit_Team.addOnLoad(setEquipoVenta);
      }, 5000);
    }
  }
}

// function Cambio(executeContext) {
//   let formContext = executeContext.getFormContext();
//   console.log(formContext.getAttribute("identifycompetitors").getValue());
//   console.log(formContext.getAttribute("identifypursuitteam").getValue());
// }

function setCompetidores(executeContext) {
  //console.log("se ejecuto addOnLoad grid context");

  let formContext = executeContext.getFormContext();
  let cintaName = "Opportunity Sales Process";
  let cintaProspecto = "Lead to Opportunity Sales Process";

  let activeProcess = formContext.data.process.getActiveProcess() ? formContext.data.process.getActiveProcess() : null;
  if (activeProcess) {
    let nombreCinta = activeProcess.getName();
    if (nombreCinta) {
      if (nombreCinta === cintaName || nombreCinta === cintaProspecto) {
        let gridCompetidores = formContext.getControl("Competitors");
        let identifycompetitors = formContext.getAttribute(
          "identifycompetitors"
        );
        //console.log(gridCompetidores.getGrid().getTotalRecordCount());

        if (gridCompetidores.getGrid().getTotalRecordCount() > 0) {
          identifycompetitors.setValue(true);
          formContext
            .getControl("header_process_identifycompetitors")
            .getAttribute()
            .setValue(true);
        } else {
          identifycompetitors.setValue(false);
          formContext
            .getControl("header_process_identifycompetitors")
            .getAttribute()
            .setValue(false);
        }
      }
    }
  }
}

function setEquipoVenta(executeContext) {
   try {
    let formContext = executeContext.getFormContext();
    let cintaName = "Opportunity Sales Process";
    let cintaProspecto = "Lead to Opportunity Sales Process";
    let activeProcess = formContext.data.process.getActiveProcess();
    
    if (activeProcess) {
      let nombreCinta = activeProcess.getName();
      
      if (nombreCinta) {
        if (nombreCinta === cintaName || nombreCinta === cintaProspecto) {
          let GridPursuit_Team = formContext.getControl("Pursuit_Team");
          let Pursuit_Team = formContext.getAttribute("identifypursuitteam");
          
          if (GridPursuit_Team.getGrid().getTotalRecordCount() > 0) {
            Pursuit_Team.setValue(true);
            formContext
              .getControl("header_process_identifypursuitteam")
              .getAttribute()
              .setValue(true);
            
          } else {
            Pursuit_Team.setValue(false);
            formContext
              .getControl("header_process_identifypursuitteam")
              .getAttribute()
              .setValue(false);
            
          }
        }
      }
    }
   } catch (error) {
       console.log(error);
       console.log("Error fc setEquipoVenta");
   } 
  
}

function mensajeOportunidad(executionContext) {
  try {
    let formContext = executionContext.getFormContext();
    let activeProcess = formContext.data.process.getActiveProcess()
      ? formContext.data.process.getActiveProcess()
      : null;

    if (activeProcess) {
      formContext.data.addOnLoad(viewMessage);
      if (
        formContext
          .getControl("header_process_ap_ofertaaprobada")
          .getAttribute()
      ) {
        Xrm.Page.getControl("header_process_ap_ofertaaprobada")
          .getAttribute()
          .addOnChange(viewMessage);
      }

      function viewMessage() {
        if (
          formContext
            .getControl("header_process_ap_ofertaaprobada")
            .getAttribute()
            .getValue() &&
          formContext.getAttribute("statuscode").getValue() != 3
        ) {
          formContext.ui.setFormNotification(
            "DONT FORGET TO CLOSE THE OPPORTUNITY AS WON IN THE BUTTON ON THE TOP",
            "WARNING",
            "notification_unique_id"
          );
          //NO OLVIDAR CERRAR COMO LOGRADA LA OPORTUNIDAD  EN EL BOTON  DE LA PARTE SUPERIOR
          //NO OLVIDE CERRAR LA OPORTUNIDAD COMO LOGRADA EN EL BOTON DE LA PARTE SUPERIOR
        } else {
          formContext.ui.clearFormNotification("notification_unique_id");
        }
      }
    }
  } catch (error) {
    console.log(error);
    console.log("error fc mensajeOportunidad");
  }
}

//FUNCION PARA VERIFICAR SI LA OPORTUNIDAD CONTIENE UN CODIGO DE REGISTRO DE LA OPORTUNIDAD
function verificarOportunidad(executionContext) {
  try {
    let formContext = executionContext.getFormContext();

    let idOportunidad = formContext.data.entity.getId().slice(1, 37);
    let entidad = formContext.data.entity.getEntityName();

    //CONSULTAMOS LA DATA DE LA OPORTUNDAD EN LA QUE NOS ENCONTRAMOS PARA VALIDAR SI VIENE DE UN PROSPECTO
    Xrm.WebApi.retrieveRecord(entidad, idOportunidad).then(
      function success(result) {
        if (result) {
          console.log(result);
          //CAPTURAMOS EL ID DEL PROSPECTO

          let idProspecto = result._originatingleadid_value;

          if (idProspecto) {
            //CONSULTAMOS LA ENTIDAD DE PROSPECTO PARA CONSEGUIR EL NUMERO DEL PROSPECTO
            Xrm.WebApi.retrieveRecord("lead", idProspecto).then(
              function success(result) {
                console.log(result);
                // perform operations on record retrieval
                let numProspecto = result.rd_numeroprospecto;
                console.log("numero de prospecto" + numProspecto);
                //consultamos la entidad ap_codigodeasignacion de prospecto filtrada por el numero del pedido
                let req = new XMLHttpRequest();
                req.open(
                  "GET",
                  Xrm.Page.context.getClientUrl() +
                    "/api/data/v9.1/ap_codigodeasignaciondelprospectos?$select=ap_codigodeasignaciondelprospectoid,ap_codigo,_ap_fabricante_value,ap_numerodeoportunidad&$filter=(ap_idlead%20eq%20%27" +
                    numProspecto +
                    "%27)&$orderby=ap_codigo%20asc",
                  true
                );
                req.setRequestHeader("OData-MaxVersion", "4.0");
                req.setRequestHeader("OData-Version", "4.0");
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader(
                  "Content-Type",
                  "application/json; charset=utf-8"
                );
                req.setRequestHeader("Prefer", 'odata.include-annotations="*"');

                req.onreadystatechange = function () {
                  if (this.readyState === 4) {
                    req.onreadystatechange = null;
                    if (this.status === 200) {
                      let results = JSON.parse(this.response);

                      if (results.value.length > 0) {
                        results.value.forEach((value, index) => {
                          let ap_codigodeasignaciondelprospectoid =
                            results.value[index]
                              .ap_codigodeasignaciondelprospectoid;

                          if (ap_codigodeasignaciondelprospectoid) {
                            //actualizamos el codigo de asignacion de prospecto a la oportunidad creada
                            let entity = {};

                            entity["ap_IDOportunidad@odata.bind"] =
                              "/opportunities(" + idOportunidad + ")";
                            console.log(entity);
                            console.log(
                              "codigo de asignacion del prospecto " +
                                ap_codigodeasignaciondelprospectoid
                            );
                            let req = new XMLHttpRequest();
                            req.open(
                              "PATCH",
                              Xrm.Page.context.getClientUrl() +
                                "/api/data/v9.1/ap_codigodeasignaciondelprospectos(" +
                                ap_codigodeasignaciondelprospectoid +
                                ")",
                              true
                            );
                            req.setRequestHeader("OData-MaxVersion", "4.0");
                            req.setRequestHeader("OData-Version", "4.0");
                            req.setRequestHeader("Accept", "application/json");
                            req.setRequestHeader(
                              "Content-Type",
                              "application/json; charset=utf-8"
                            );
                            req.setRequestHeader(
                              "Prefer",
                              'odata.include-annotations="*"'
                            );
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
                      } else {
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
