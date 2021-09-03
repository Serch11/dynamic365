function removeFuncionChangeApModena(executionContext) {
  let formContext = executionContext.getFormContext();
  formContext.data.removeOnLoad(changeApMoneda);
}

async function changeApMoneda(executionContext) {
  let formContext = executionContext.getFormContext();

  //let ap_moneda = formContext.getAttribute("ap_moneda");
  //let ap_trm = formContext.getAttribute("ap_trm");
  //let ap_trmControl = formContext.getControl("ap_trm");
  let header_estimatedvalueControl = formContext.getControl(
    "header_estimatedvalue"
  );
  let header_estimatedvalueAttribute = formContext.getAttribute(
    "header_estimatedvalue"
  );
  let header_ap_ingestdolar = formContext.getAttribute("header_ap_ingestdolar");
  let header_ap_ingestdolarControl = formContext.getControl(
    "header_ap_ingestdolar"
  );
  let exchangerate = formContext.getAttribute("exchangerate");
  let exchangerateControl = formContext.getControl("exchangerate");
  let transactioncurrencyid = formContext.getAttribute("transactioncurrencyid");
  let transactioncurrencyidControl = formContext.getControl(
    "transactioncurrencyidControl"
  );

  try {
    if (transactioncurrencyid.getValue()) {
      if (transactioncurrencyid.getValue()[0].name === "Peso colombiano") {
        header_ap_ingestdolarControl.setVisible(false);
        header_estimatedvalueControl.setDisable(false);

        formContext.getAttribute("estimatedvalue").setRequiredLevel("required");
        formContext.getAttribute("ap_ingestdolar").setRequiredLevel("none");
        exchangerateControl.setVisible(true);
        //ap_trmControl.setVisible(false);

        if (
          executionContext.getDepth() === 1 ||
          executionContext.getDepth() === 2 ||
          executionContext.getDepth() === 0
        ) {
          formContext.getAttribute("ap_ingestdolar").setValue(null);
          formContext.getAttribute("estimatedvalue").setValue(null);
          //ap_trm.setValue(1);
        }
      }

      if (transactioncurrencyid.getValue()[0].name === "US Dollar") {
        //ap_trmControl.setVisible(true);
        //ap_trmControl.setDisabled(true);
        header_ap_ingestdolarControl.setVisible(true);
        header_estimatedvalueControl.setDisabled(true);
        //formContext.getAttribute("ap_ingestdolar").setValue(null);

        formContext.getAttribute("ap_ingestdolar").setRequiredLevel("required");
        formContext.getAttribute("estimatedvalue").setRequiredLevel("none");

        if (
          executionContext.getDepth() === 1 ||
          executionContext.getDepth() === 2 ||
          executionContext.getDepth() === 0
        ) {
          formContext.getAttribute("estimatedvalue").setValue(null);
          let result = await consultaTRM();
          if (result) {
            let valor = result.entities[0].exchangerate;
            console.log(valor);
            // ap_trm.setValue(valor);
            exchangerate.setValue(valor);
            console.log(result);
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function consultaTRM() {
  try {
    return await Xrm.WebApi.retrieveMultipleRecords(
      "transactioncurrency",
      "?$select=exchangerate&$filter=currencyname eq 'US Dollar'"
    );
  } catch (error) {
    console.log("error consulta trm script oportunity_changeDivisa");
    console.log(error);
  }
}
