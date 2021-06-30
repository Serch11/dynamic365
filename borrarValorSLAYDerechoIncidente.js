function borrarCampos(executionContext) {
  let formContext = executionContext.getFormContext();
  let entitlementid = formContext.getAttribute("entitlementid");
  let slaid = formContext.getAttribute("slaid");
  let ap_tienecontrato = formContext.getAttribute("ap_tienecontrato");

  formContext.getAttribute("ap_tienecontrato").addOnChange(ClearSLAYDERECHO);
}

function ClearSLAYDERECHO(executionContext) {
  let formContext = executionContext.getFormContext();
  let entitlementid = formContext.getAttribute("entitlementid");
  let slaid = formContext.getAttribute("slaid");

  let ap_tienecontrato = formContext.getAttribute("ap_tienecontrato");

  console.log(ap_tienecontrato.getValue());

  if (!ap_tienecontrato.getValue()) {
    entitlementid.setValue(null);
    slaid.setValue(null);
  }
}
