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
}
