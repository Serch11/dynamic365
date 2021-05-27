function stateProcess(executeContext) {
  let formContext = executeContext.getFormContext();

  //formContext.getAttribute("transactioncurrencyid").addOnChange(obtenerDivisa);
  console.log(executeContext.getDepth() + " getdepth 1");
  console.log("estado");
  console.log(formContext.ui.process.getDisplayState());
  console.log(formContext.getAttribute("statuscode"));
  console.log(formContext.getAttribute("statuscode").getValue());



  var activeProcess = formContext.data.process.getActiveProcess();

  console.log(activeProcess);
}
