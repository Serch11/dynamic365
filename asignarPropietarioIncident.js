function asignarPropietario(executeContent) {
  let formContext = executeContent.getFormContext();

  let ownerid = formContext.getAttribute("ownerid");
  let ap_asignarcaso = formContext.getAttribute("ap_asignarcaso");

  if (ap_asignarcaso.getValue()) {
    console.log(ap_asignarcaso.getValue());
    ownerid.setValue(ap_asignarcaso.getValue());
  }
}
