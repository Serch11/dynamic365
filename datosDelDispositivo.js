async function datosDelDispositivo(executionContext) {
  let formContext = executionContext.getFormContext();

  //declaracion y inicializacion de las variables
  let ap_serialfisico = formContext.getAttribute("ap_serialfisico");
  let ap_activofijo = formContext.getAttribute("ap_activofijo");
  let ap_serialcliente = formContext.getAttribute("ap_serialcliente");
  let ap_dispositivo = formContext.getAttribute("ap_dispositivo");
  let ap_fabricante = formContext.getAttribute("ap_fabricante");
  let ap_modelo = formContext.getAttribute("ap_modelo");

  if (ap_serialfisico.getValue()) {
    console.log(ap_serialfisico.getValue());
    let options =
      "?$select=ap_activofijo,ap_serialcliente&$filter=ap_serialfisico" +
      ap_serialfisico.getValue();
    let result = await Xrm.WebApi.retrieveMultipleRecords(
      "msdyn_customerasset",
      options
    );

    console.log(result);
  }
}
