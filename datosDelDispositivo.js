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
    //let options = "?$select=ap_activofijo,ap_serialcliente,";
    let options =
      "?$select=_msdyn_product_value,_msdyn_parentasset_value,_msdyn_masterasset_value,msdyn_customerassetid,_ap_tipodedispositivo_value,ap_serialfisico,ap_serialdefabricante,ap_serialcliente,_ap_modelo_value,statecode,ap_activofijo&$filter=(contains(ap_serialfisico, '122'))&$orderby=_msdyn_product_value desc";
    let result = await Xrm.WebApi.retrieveMultipleRecords(
      "msdyn_customerasset",
      options
    );

    console.log(result);
  }
}

/*
msdyn_customerassets?$select=_msdyn_product_value,_msdyn_parentasset_value,_msdyn_masterasset_value,msdyn_customerassetid,_ap_tipodedispositivo_value,ap_serialfisico,ap_serialdefabricante,ap_serialcliente,_ap_modelo_value,statecode,ap_activofijo&$filter=(contains(ap_serialfisico, '%25123%25'))&$orderby=_msdyn_product_value desc
*/
