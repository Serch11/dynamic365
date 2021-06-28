/**
 * opciones del campo  ap_valordelestado;
 * Activo  778210000
 * Inactivo 778210001
 * Bloqueado por cartera = 778210002
 * Cliente inactivo = 778210003
 * Desantendido = 778210004
 * No tiene cupo = 778210005

 * opciones del statuscode de de la cuenta en la entidad cuenta
 * Activo  = 1
 * Bloqueado por cartera = 778210000
 * Cliente Inactivo = 778210001
 * Desantendido = 778210002
 * No tiene cupo = 778210003
 *
 */
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
      let result = await Xrm.WebApi.retrieveRecord(entidad, id);
      console.log(result);

      let statecode = await result.statecode;
      let statuscode = await result.statuscode;

      if (statuscode === 1) ap_valordelestado.setValue(778210000); // activo
      if (statuscode === 778210000) ap_valordelestado.setValue(778210002); // bloqueado por cartera
      if (statuscode === 778210001) ap_valordelestado.setValue(778210003); // cliente inactivo
      if (statuscode === 778210002) ap_valordelestado.setValue(778210004); // desatentido
      if (statuscode === 778210003) ap_valordelestado.setValue(778210002); // No tiene cupo
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
