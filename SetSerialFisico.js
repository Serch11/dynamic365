function setSerialFisico(executionContext) {
  let formContext = executionContext.getFormContext();

  let msdyn_name = formContext.getAttribute("msdyn_name");
  let ap_serialfisico = formContext.getAttribute("ap_serialfisico");

  if (ap_serialfisico.getValue())
    msdyn_name.setValue(ap_serialfisico.getValue());

  if (!ap_serialfisico.getValue()) msdyn_name.setValue(null);





}
