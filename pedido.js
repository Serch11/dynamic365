function stateProcess(executeContext) {
  let formContext = executeContext.getFormContext();

  //formContext.getAttribute("transactioncurrencyid").addOnChange(obtenerDivisa);
  console.clear();
  console.log(executeContext.getDepth() + " getdepth 1");
  console.log("estado");
  console.log(formContext.ui.process.getDisplayState());
  console.log(formContext.getAttribute("statuscode"));
  console.log(formContext.getAttribute("statuscode").getValue());

  var statuscode = formContext.getAttribute("statuscode");
  var activeProcess = formContext.data.process.getActiveProcess(); // devuelve un objecto de proceso que represnta el procesos activo
  //formContext.data.process.setActiveProcess(); // define un proceso como proceso activo
  var processId = activeProcess.getId(); // devuelve el identificador unico del proceso
  var processName = activeProcess.getName(); // devuelve el nombre del proceso
  var stageCollection = activeProcess.getStages(); // devuelve una coleeccion de fases del procesos
  var processRendered = activeProcess.isRendered(); // devuelve un valor booleano de indica si el procesos se ha representado
  var stageObj = formContext.data.process.getActiveStage();
  var stepObj = stageObj.getSteps();

  console.log(formContext.data.process.getStatus() + " estado de la cinta"); // devuelve el estado actual de la instancia de procesos
  console.log(activeProcess);
  console.log(processId);
  console.log(stageCollection);
  console.log(processRendered);
  console.log(processName);
  console.log(formContext.data.process.getInstanceId()); //Devuelve el identificador único de la instancia de proceso.
  console.log(formContext.data.process.getInstanceName()); //devuelve el nombre de la instancia de proceso
  console.log(formContext.data.process.getStatus()); //Devuelve el estado actual de la instancia de proceso.ç
  console.log(formContext.data.process.getActiveStage()); //Devuelve un objeto de Fase que representa la fase activa.
  console.log(stageObj.getName());
  console.log(stageObj.getStatus());
  console.log(stageObj.getSteps());
  console.log(statuscode);
  console.log(statuscode.getValue());

  //   console.log(stageObj.getSteps().getAttribute());
  //   console.log(stepObj.getAttribute()); // devuelve el nombre logico de la columna asociada
  //   console.log(stepObj.getName()); // nombre del paso
  //   console.log(stepObj.getProgress()); // progreso del paso

  formContext.data.process.addOnPreProcessStatusChange(preProcess);
  formContext.data.process.addOnProcessStatusChange(OnProcessStatus);
  formContext.data.process.addOnStageChange(addOnStageChange);
  formContext.data.process.addOnStageSelected(addOnStageSelected);
}

function preProcess(executeContext) {
  executeContext.getEventArgs().preventDefault();
  console.log("preProcess");
}

function OnProcessStatus(executeContext) {
  executeContext.getEventArgs().preventDefault();
  console.log("OnProcessStatus");
}

function addOnStageChange(executeContext) {
  let formContext = executeContext.getFormContext();
  console.log("addOnStageChange");
  let processInstanceId = formContext.data.process.getInstanceId();
  let stageObj = formContext.data.process.getActiveStage();
  let header_statuscode = Xrm.Page.getAttribute("header_statuscode");

  var moveToNext = true;
  // Para adquirir información del Stage activo del proceso.
  var activeStage = Xrm.Page.data.process.getActiveStage();
  // Para adquirir la colección de Stages del proceso.
  var activePathCollection = Xrm.Page.data.process.getActivePath();
  // Para adquirir el Stage actual
  var StageSelect = Xrm.Page.data.process.getSelectedStage();
  //Para adquirir el nombre del Stage actual
  var StageName = StageSelect.getName();
  // Para adquirir el ID de la Stage actual
  var idstages = StageSelect.getId();

  console.log(idstages);
  console.log(StageName);

  console.log(formContext.data.process.getInstanceId()); //Devuelve el identificador único de la instancia de proceso.
  console.log(formContext.data.process.getInstanceName()); //devuelve el nombre de la instancia de proceso
  formContext.data.process.setActiveProcessInstance(processInstanceId, function(
    result
  ) {
    console.log(result);
  });
  formContext.data.process.setActiveStage(idstages, function(result) {
    console.log("fase colocada como activa");
    console.log(result);
  });
}

function addOnStageSelected(executeContext) {
  console.log("addOnStageSelected");
}
