function obtenerTrm(executeContext) {
  let formContext = executeContext.getFormContext();
  formContext.getAttribute("transactioncurrencyid").addOnChange(obtenerDivisa);
}

function obtenerDivisa(executeContext) {
  let formContext = executeContext.getFormContext();
  let transactioncurrencyid = formContext.getAttribute("transactioncurrencyid");
  let ap_trm = formContext.getAttribute("ap_trm");

  if (transactioncurrencyid.getValue()) {
    if (transactioncurrencyid.getValue()[0].name === "US Dollar") {
      console.log(transactioncurrencyid.getValue()[0].name);

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
              ap_trm.setValue(trm);
              // perform additional operations on retrieved records
            }
          },
          function(error) {
            console.log(error.message);
            // handle error conditions
          }
        );
    } else {
      ap_trm.setValue(null);
    }
  }
}
