async function ObtEstadoCuentaReqInterno(executionContext) {
  let formContext = executionContext.getFormContext();

  let customerid = formContext.getAttribute("customerid");
  let ap_valordelestado = formContext.getAttribute("ap_valordelestado");

  if (customerid.getValue()) {
    let id = customerid.getValue()[0].id;
    let entidad = customerid.getValue()[0].entityType;
    let options = "?$select=statecode,statuscode";

    try {
      let result = await Xrm.WebApi.retrieveRecord(entidad, id, options);

      if (result) {
        let { statecode, statuscode } = await result;

        if (statecode === 1) ap_valordelestado.setValue(778210001); // inactivo
        if (statuscode === 1) ap_valordelestado.setValue(778210000); // activo
        if (statuscode === 778210000) ap_valordelestado.setValue(778210002); // bloqueado por cartera
        if (statuscode === 778210001) ap_valordelestado.setValue(778210003); // cliente inactivo
        if (statuscode === 778210002) ap_valordelestado.setValue(778210004); // desatentido
        if (statuscode === 778210003) ap_valordelestado.setValue(778210005);
      }
    } catch (error) {
      console.log(error);
      console.log("errro funcion ObtEstadoCuentaReqIntern");
    }
  }

  if (
    !customerid.getValue() &&
    (executionContext.getDepth() === 0 ||
      executionContext.getDepth() === 1 ||
      executionContext.getDepth() === 2)
  ) {
    ap_valordelestado.setValue(null);
  }
}
