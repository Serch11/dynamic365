function limpiarCampos(executeContext) {
  let formContext = executeContext.getFormContext();
  let ap_plataforma = formContext.getAttribute("ap_plataforma");

  ap_plataforma.addOnChange(borrar);
}

function borrar(executeContext) {
  let formContext = executeContext.getFormContext();
  let ap_plataforma = formContext.getAttribute("ap_plataforma");
  let ap_tipodeservicio_plataforma = formContext.getAttribute(
    "ap_tipodeservicio_plataforma"
  );
  let ap_categoraingeniera = formContext.getAttribute("ap_categoraingeniera");
  console.log(ap_plataforma.getValue());
  console.log(executeContext.getDepth());
  if (executeContext.getDepth() === 1 || executeContext.getDepth() === 2 || executeContext.getDepth() === 3) {
    ap_tipodeservicio_plataforma.setValue(null);
    ap_categoraingeniera.setValue(null);
  }
  if (!ap_plataforma.getValue()) {
    ap_tipodeservicio_plataforma.setValue(null);
    ap_categoraingeniera.setValue(null);
  }
}
