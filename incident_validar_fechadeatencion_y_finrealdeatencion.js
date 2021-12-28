function validarFechas(executionContext) {
  try {
    let formContext = executionContext.getFormContext();
    let ap_iniciorealdeatencion = formContext.getAttribute(
      "ap_iniciorealdeatencion"
    );
    let ap_finrealdeatencion = formContext.getAttribute("ap_finrealdeatencion");
    let todayDate = new Date();

    const mensajeF =
      "La fecha final de atencion no puede ser menor  a la fecha inicial de atencion. se le colocara la fecha actual";

    if (ap_iniciorealdeatencion.getValue() && ap_finrealdeatencion.getValue()) {
      if (
        ap_finrealdeatencion.getValue().getTime() <
        ap_iniciorealdeatencion.getValue().getTime()
      ) {
        mensajeAlerta(executionContext, mensajeF, "ap_finrealdeatencion", null);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function validarFechasInicial(executionContext) {
  try {
    let formContext = executionContext.getFormContext();
    let ap_iniciorealdeatencion = formContext.getAttribute(
      "ap_iniciorealdeatencion"
    );
    let todayDate = new Date();
    const mensajeI =
      "La fecha inicial de atencio no puede ser mayor a la fecha actual";

    if (ap_iniciorealdeatencion.getValue().getTime() > todayDate.getTime()) {
      mensajeAlerta(
        executionContext,
        mensajeI,
        "ap_iniciorealdeatencion",
        true
      );
    }
  } catch (error) {
    console.log(error);
    console.log("Error en la funcion validar inicio real");
  }
}

///funcion para corregir mensaje de alerta
async function mensajeAlerta(executionContext, mensaje, campo, tcampo) {
  let formContext = executionContext.getFormContext();
  var alertStrings = {
    confirmButtonLabel: "Yes",
    text: mensaje,
  };
  var alertOptions = { height: 120, width: 260 };

  Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
    async function success() {
      // perform operations on alert dialog close
      if (tcampo) {
        let result = await capFechaAnterior(executionContext);
        if (result) {
          let fecha = new Date(result);
          formContext.getAttribute(campo).setValue(null);
          formContext.getAttribute(campo).setValue(fecha);
        } else {
          formContext.getAttribute(campo).setValue(null);
          formContext.getAttribute(campo).setValue(new Date());
        }
      } else {
        formContext.getAttribute(campo).setValue(null);
        formContext.getAttribute(campo).setValue(new Date());
      }
    },
    function (error) {
      console.log(error.message);
      // handle error conditions
    }
  );
}

async function capFechaAnterior(executionContext) {
  try {
    let formContext = executionContext.getFormContext();
    let id = formContext.data.entity.getId();

    let result = await Xrm.WebApi.retrieveRecord("incident", id);

    if (result) {
      return result?.ap_iniciorealdeatencion
        ? result?.ap_iniciorealdeatencion
        : null;
    }
    return null;
  } catch (error) {
    console.log(error);
  }
}
