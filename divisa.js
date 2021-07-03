function obtenerTrm(executeContext) {
  let formContext = executeContext.getFormContext();

  //formContext.getAttribute("transactioncurrencyid").addOnChange(obtenerDivisa);
  console.log(executeContext.getDepth() + " getdepth 1");
  formContext.data.removeOnLoad(removerFuncion);
}

function obtenerDivisa(executeContext) {
  console.log(executeContext.getDepth() + " getdepth  2");
  let formContext = executeContext.getFormContext();
  let transactioncurrencyid = formContext.getAttribute("transactioncurrencyid");
  let ap_trm = formContext.getAttribute("ap_trm");
  console.log(formContext.ui.formSelector.getCurrentItem());

  if (transactioncurrencyid.getValue()) {
    if (
      transactioncurrencyid.getValue()[0].name === "US Dollar" &&
      (executeContext.getDepth() === 1 ||
        executeContext.getDepth() === 2 ||
        executeContext.getDepth() === 0)
    ) {
      console.log(transactioncurrencyid.getValue()[0].name);
      console.log(
        executeContext.getDepth() + " getdepth  entro a las dos condiciones"
      );
      Xrm.WebApi
        .retrieveMultipleRecords(
          "transactioncurrency",
          "?$select=exchangerate&$filter=currencyname eq 'US Dollar'"
        )
        .then(
          function success(result) {
            console.log(result);
            if (result.entities[0].exchangerate) {
              let trm = result.entities[0].exchangerate;
              console.log("hizo el cambio de la divisa");
              console.log(
                executeContext.getDepth() +
                  " getdepth  entro a las dos condiciones y al resultado"
              );
              console.log(executeContext.getDepth() + " getdepth 2");
              formContext.getControl("ap_trm").setVisible(true);
              ap_trm.setValue(trm);
              // perform additional operations on retrieved records
            }
          },
          function(error) {
            console.log(error.message);
            // handle error conditions
          }
        );
    }

    if (transactioncurrencyid.getValue()[0].name === "Peso Colombiano") {
      console.log("quitar valor divisa");
      formContext.getControl("ap_trm").setVisible(false);
      ap_trm.setValue(0);
    }
    if (transactioncurrencyid.getValue()[0].name === "Colombian Peso") {
      console.log("quitar valor divisa");
      formContext.getControl("ap_trm").setVisible(false);
      ap_trm.setValue(0);
    }
    if (transactioncurrencyid.getValue()[0].name === "Peso") {
      console.log("quitar valor divisa");
      formContext.getControl("ap_trm").setVisible(false);
      ap_trm.setValue(0);
    }
  }
}

function removerFuncion(executeContext) {
  console.log(executeContext.getDepth() + " getdepth  3");
  console.log("entro a remover la function");
  let formContext = executeContext.getFormContext();
  console.log("estado");
  console.log(formContext.ui.process.getDisplayState());
  formContext.getAttribute("transactioncurrencyid").addOnChange(obtenerDivisa);
}
