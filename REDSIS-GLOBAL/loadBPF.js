function onLoadBPF(executionContext) {
  debugger;
  let formContext = executionContext.getFormContext();
  let activeProcess = formContext.data.process.getActiveProcess();
  let activeStatus = formContext.data.process.getStatus();
  let desiredProcessId = "5773E928-E311-48FF-9A0C-40EE99E3E5A0";
  if (!activeStatus || activeProcess.getId() !== desiredProcessId) {
    formContext.data.process.setActiveProcess(desiredProcessId);
  }
}


