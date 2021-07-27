function cintaProcesoIncidente(executionContext) {
  let formContext = executionContext.getFormContext();

  //
  let activeProcess = formContext.data.process.getActiveProcess();
  let objEstado = formContext.data.process.getActiveStage();

  //obtenemos el formulario en el que nos encontramos
  let FORM_NAME = formContext.ui.formSelector.getCurrentItem()._label;

  //tipificacion de formularios
  let FORM_CAC = "Caso CAC";
  let FORM_CAS = "Caso CAS";
  let FORM_SINCO = "Caso SINCO";

  formContext.getControl("fieldName");

  //condiciones para formulario SINCO
  if (FORM_NAME === FORM_SINCO) {
    try {
      //formContext.getAttribute("ap_regional").setRequiredLevel("required");
      formContext
        .getControl("header_process_ap_regional")
        .getAttribute()
        .setRequiredLevel("required");

      if (objEstado.getName() != "Registrar") {
        formContext.getControl("ap_tiendaintervenida").setDisabled(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (FORM_NAME != FORM_SINCO) {
    formContext.getControl("header_process_ap_regional").setVisible(false);
  }
 
  formContext.data.process.addOnStageChange(cambioPaso);

  console.log(activeProcess);
  console.log(formContext.data);
  console.log(formContext.data.process);
  console.log(formContext.ui);
  console.log(formContext.ui.process.getDisplayState());
  console.log(activeProcess.getName()); //obtengo el nombre de la cinta de proceso;
  console.log(activeProcess.getStages()); //obtengo una colleccion de todos los procesos de la cinta;
  //console.log(activeProcess.getStages().getName()); //obtengo el nombre del proceso que esta corriendo
  console.log(activeProcess.getName());
  console.log(objEstado.getName()); //obtengo el nombre del proceso actua de la cinta

  // console.log(Xrm.Page.getControl("header_process_ap_valordelestado"));
  //Xrm.Page.getControl("header_process_ap_valordelestado").setDisabled(true);
  //formContext.getControl("header_process_ap_valordelestado").setDisabled(true);
  //formContext.getControl("header_process_ownerid").setDisabled(true);
  //formContext.getControl("header_process_ap_plataforma").setDisabled(true);

  // console.log(
  //   formContext
  //     .getControl("header_process_ap_valordelestado")
  //     .getAttribute()
  //     .getValue()
  // ); // obtenemo valore de los campos que se encuentran dentro de la cinta de proceso

  //formContext.ui.setFormNotification('probando noitificacion', 'ERROR', 'sergio');

  /*var alertStrings = {
    confirmButtonLabel: "Yes",
    text: "This is an alert.",
    title: "Sample title",
  };
  var alertOptions = { height: 120, width: 260 };
  Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
    function (success) {
      console.log("Alert dialog closed");
    },
    function (error) {
      console.log(error.message);
    }
  );*/
}

function manipularCintaDeProceso(executionContext) {
  let formContext = executionContext.getFormContext();
}

function cambioPaso(executionContext) {
  let formContext = executionContext.getFormContext();
  let objFase = formContext.data.process.getActiveStage();
  let fase = objFase.getName();

  if (fase != "Registrar") {
    formContext.getControl("title").setDisabled(true);
    formContext.getControl("description").setDisabled(true);
    formContext.getControl("customerid").setDisabled(true);
    formContext.getControl("primarycontactid").setDisabled(true);
  }
}
