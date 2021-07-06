//BLOQUEADO POR CARTERA
// DESANTEDIDO 
// CLIENTE POR CARTERA 
// CLIENTE INACTIVO 
// NO TIENE CUPO 


function getContactAndAccount(executionContext) {
  let formContext = executionContext.getFormContext();

  formContext.getAttribute("customerid").addOnChange(listentChange);
}

async function listentChange(executionContext) {
  let formContext = executionContext.getFormContext();
  let customerid = formContext.getAttribute("customerid");
  let ap_valordelestado = formContext.getAttribute("ap_valordelestado");

  if (customerid.getValue()) {
    console.log(customerid.getValue());

    let entidad = customerid.getValue()[0].entityType;
    let id = customerid.getValue()[0].id;
    let options = "?$select=statecode,statuscode";

    try {
      let result = await Xrm.WebApi.retrieveRecord(entidad, id, options);
      console.log(result);
      let statuscode = await result.statuscode;

      statuscode === 1
        ? ap_valordelestado.setValue(778210000)
        : ap_valordelestado.setValue(778210001);
    } catch (error) {
      console.log(error);
    }
  }

  if (
    !customerid.getValue() &&
    (executionContext.getDepth() === 0 ||
      executionContext.getDepth() === 1 ||
      executionContext.getDepth() === 3)
  ) {
    ap_valordelestado.setValue(null);
  }
}
