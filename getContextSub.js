function getSubGrid(executeContext) {
  let formContext = executeContext.getFormContext();
  let cintaName = "Proceso de venta de la oportunidad";
  let cintaProspecto = "Proceso de venta de cliente potencial a oportunidad";
  let activeProcess = formContext.data.process.getActiveProcess();

  if (activeProcess) {

    formContext.getControl('header_process_identifycompetitors').setDisabled(true);
    formContext.getControl('header_process_identifypursuitteam').setDisabled(true);

    let nombreCinta = activeProcess.getName();
    //console.log(nombreCinta === cintaName);


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
          formContext.getControl('header_process_identifycompetitors').getAttribute().setValue(true);
        } else {
          identifycompetitors.setValue(false);
          formContext.getControl('header_process_identifycompetitors').getAttribute().setValue(false);
        }

        if (GridPursuit_Team.getGrid().getTotalRecordCount() > 0) {
          identifypursuitteam.setValue(true);
          formContext.getControl('header_process_identifypursuitteam').getAttribute().setValue(true);
        } else {
          identifypursuitteam.setValue(false);
          formContext.getControl('header_process_identifypursuitteam').getAttribute().setValue(false);
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
  let cintaName = "Proceso de venta de la oportunidad";
  let cintaProspecto = "Proceso de venta de cliente potencial a oportunidad";
  let activeProcess = formContext.data.process.getActiveProcess();
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
          formContext.getControl('header_process_identifycompetitors').getAttribute().setValue(true)
        } else {
          identifycompetitors.setValue(false);
          formContext.getControl('header_process_identifycompetitors').getAttribute().setValue(false)
        }
      }
    }
  }
}

function setEquipoVenta(executeContext) {


  let formContext = executeContext.getFormContext();

  let cintaName = "Proceso de venta de la oportunidad";
  let cintaProspecto = "Proceso de venta de cliente potencial a oportunidad";
  let activeProcess = formContext.data.process.getActiveProcess();
  //console.log(activeProcess);
  if (activeProcess) {
    let nombreCinta = activeProcess.getName();
    //console.log(nombreCinta === cintaName);
    if (nombreCinta) {
      if (nombreCinta === cintaName || nombreCinta === cintaProspecto) {
        console.log("entro a setCompetidores validacion entra cinta de proceso equipo de venta")
        let GridPursuit_Team = formContext.getControl("Pursuit_Team");
        let Pursuit_Team = formContext.getAttribute("identifypursuitteam");
        //console.log(GridPursuit_Team.getGrid().getTotalRecordCount());
        if (GridPursuit_Team.getGrid().getTotalRecordCount() > 0) {
          Pursuit_Team.setValue(true);
          formContext.getControl('header_process_identifypursuitteam').getAttribute().setValue(true);
          //formContext.getControl('header_process_identifycompetitors').getAttribute().setValue(true);
        } else {
          Pursuit_Team.setValue(false);
          formContext.getControl('header_process_identifypursuitteam').getAttribute().setValue(false);
          //formContext.getControl('header_process_identifycompetitors').getAttribute().setValue(false);
        }
      }
    }
  }
}



function mensajeOportunidad(executionContext) {



  let formContext = executionContext.getFormContext();

  formContext.data.addOnLoad(viewMessage);
  if (formContext.getControl("header_process_ap_ofertaaprobada").getAttribute()) {
    Xrm.Page.getControl("header_process_ap_ofertaaprobada").getAttribute().addOnChange(viewMessage);
  }

  function viewMessage() {
    if (formContext.getControl("header_process_ap_ofertaaprobada").getAttribute().getValue() && formContext.getAttribute("statuscode").getValue() != 3) {
      formContext.ui.setFormNotification('NO OLVIDE CERRAR LA OPORTUNIDAD COMO LOGRADA EN EL BOTON DE LA PARTE SUPERIOR', 'WARNING', 'notification_unique_id');
      //NO OLVIDAR CERRAR COMO LOGRADA LA OPORTUNIDAD  EN EL BOTON  DE LA PARTE SUPERIOR
      //NO OLVIDE CERRAR LA OPORTUNIDAD COMO LOGRADA EN EL BOTON DE LA PARTE SUPERIOR
    } else {
      formContext.ui.clearFormNotification('notification_unique_id');
    }
  }
}
