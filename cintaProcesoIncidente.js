function cintaProcesoIncidente(executionContext) {
  let formContext = executionContext.getFormContext();

  let activeProcess = formContext.data.process.getActiveProcess();
  console.log(activeProcess);
  console.log(formContext.data.entity);
  console.log(formContext.data.process);
  console.log(formContext.ui.process.getDisplayState());
  console.log(activeProcess.getName());
  console.log(activeProcess.getStages());
}

function manipularCintaDeProceso(executionContext) {
  let formContext = executionContext.getFormContext();
}