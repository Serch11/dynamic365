function main(executionContext) {
  try {
    let formContext = executionContext.getFormContext();
    formContext.getAttribute("di_pais").addOnChange(desbloquearDepartamento);
    formContext.getAttribute("di_departamento").addOnChange(desbloquearciudad);
  } catch (error) {
    console.log(error);
  }
}

//funcion para desbloquear la ciudad
function desbloquearciudad(executionContext) {
  try {
    let formContext = executionContext.getFormContext();

    let di_departamento = formContext.getControl("di_departamento");
    let di_ciudad = formContext.getControl("di_ciudad");

    if (di_departamento.getAttribute().getValue()) {
      di_ciudad.setDisabled(false);
    } else {
      di_ciudad.setDisabled(true);
      di_ciudad.getAttribute().setValue(null);
    }
  } catch (error) {
    console.log(error);
  }
}

//funcion para desbloquer el departamento.
function desbloquearDepartamento(executionContext) {
  try {
    let formContext = executionContext.getFormContext();
    let di_pais = formContext.getControl("di_pais");
    let di_departamento = formContext.getControl("di_departamento");
    let di_ciudad = formContext.getControl("di_ciudad");

    if (di_pais.getAttribute().getValue()) {
      di_departamento.setDisabled(false);
    } else {
      di_departamento.getAttribute().setValue(null);
      di_ciudad.getAttribute().setValue(null);
      di_departamento.setDisabled(true);
      di_ciudad.setDisabled(true);
    }
  } catch (error) {
    console.log(error);
  }
}
