function cintaProcesoIncidente(executionContext) {
  let formContext = executionContext.getFormContext();

  let activeProcess = formContext.data.process.getActiveProcess();
  let objEstado = formContext.data.process.getActiveStage();
  
  console.log(activeProcess);
  console.log(formContext.data);
  console.log(formContext.data.process);
  console.log(formContext.ui);
  console.log(formContext.ui.process.getDisplayState());
  console.log(activeProcess.getName());
  console.log(activeProcess.getStages());
  console.log(activeProcess.getName());
  console.log(objEstado.getName());

  console.log(Xrm.Page.getControl("header_process_ap_valordelestado"));
  Xrm.Page.getControl("header_process_ap_valordelestado").setDisabled(true);
  formContext.getControl("header_process_ap_valordelestado").setDisabled(true);

  formContext.getControl("header_process_ownerid").setDisabled(true);
  formContext.getControl("header_process_ap_plataforma").setDisabled(true);
  console.log(
    formContext
      .getControl("header_process_ap_valordelestado")
      .getAttribute()
      .getValue()
  ); // obtenemo valore de los campos que se encuentran dentro de la cinta de proceso

  //formContext.ui.setFormNotification('probando noitificacion', 'ERROR', 'sergio');
  var actionCollection = {
    message: "Notification body message",
    actions: null,
  };

  actionCollection.actions = [function () { }];
  formContext.getControl("ap_valordelestado").addNotification({
    messages: ["Notification title"],
    notificationLevel: "RECOMMENDATION",
    uniqueId: "notification_unique_id",
    actions: [actionCollection],
  });

  console.log(formContext.getAttribute("statuscode"));
  let estado = formContext.getAttribute("statuscode").getValue();

  if (formContext.getAttribute("statuscode").getValue()) {
    console.log(estado);
    //formContext.getAttribute('ap_iniciorealdeatencion').setRequiredLevel('required');
  }


 
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