async function datosDelDispositivo(executionContext) {
  let formContext = executionContext.getFormContext();

  //declaracion y inicializacion de las variables
  let ap_serialfisico = formContext.getAttribute("ap_serialfisico");
  let ap_activofijo = formContext.getAttribute("ap_activofijo");
  let ap_serialcliente = formContext.getAttribute("ap_serialcliente");
  let ap_dispositivo = formContext.getAttribute("ap_dispositivo_nativo");
  let ap_fabricante = formContext.getAttribute("ap_fabricante");
  let ap_modelo = formContext.getAttribute("ap_modelo");

  if (ap_serialfisico.getValue()) {
    console.log(ap_serialfisico.getValue());
    //let options = "?$select=ap_activofijo,ap_serialcliente,";
    let options =
      "?$select=msdyn_customerassetid,msdyn_name,_msdyn_product_value,ap_serialdefabricante,ap_serialcliente,_ap_modelo_value,statecode,ap_activofijo,&$filter=(contains(ap_serialfisico, '" +
      ap_serialfisico.getValue() +
      "' ))&$orderby=_msdyn_product_value desc";
    let result = await Xrm.WebApi.retrieveMultipleRecords(
      "msdyn_customerasset",
      options
    );
    console.log(result.entities.length);
    if (result.entities.length > 0) {
      console.log(result);
      let query = result.entities[0];
      if (query) {
        console.log(query);

        let dispositivo = [
          {
            id: query.msdyn_customerassetid,
            name: query.msdyn_name,
            entityType: "msdyn_customerasset",
          },
        ];

        ap_activofijo.setValue(
          query.ap_activofijo ? query.ap_activofijo : null
        );
        ap_serialcliente.setValue(
          query.ap_serialcliente ? query.ap_serialcliente : null
        );
        ap_activofijo.setValue(
          query.ap_activofijo ? query.ap_activofijo : null
        );
        ap_dispositivo.setValue(dispositivo);
      }
    }

    if (result.entities.length === 0) {
      var alertStrings = {
        confirmButtonLabel: "Yes",
        text:
          "No existe el dispositivo con numero de serie" +
          ap_serialfisico.getValue().toUpperCase(),
      };
      var alertOptions = { height: 120, width: 260 };

      Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
        function success() {
          // perform operations on alert dialog close
        },
        function (error) {
          console.log(error.message);
          // handle error conditions
        }
      );
      //   formContext.ui.setFormNotification(
      //     "No existe el dispositivo con numero de serie" +
      //       ap_serialfisico.getValue(),
      //     "ERROR",
      //     "1"
      //   );
      //   setTimeout(() => {
      //     formContext.ui.clearFormNotification("1");
      //   }, 3000);
    }
  }

  if (!ap_serialfisico.getValue()) {
    ap_activofijo.setValue(null);
    ap_serialcliente.setValue(null);
    ap_dispositivo.setValue(null);
    ap_fabricante.setValue(null);
    ap_modelo.setValue(null);
  }
}

/*
msdyn_customerassets?$select=_msdyn_product_value,_msdyn_parentasset_value,_msdyn_masterasset_value,msdyn_customerassetid,_ap_tipodedispositivo_value,ap_serialfisico,ap_serialdefabricante,ap_serialcliente,_ap_modelo_value,statecode,ap_activofijo&$filter=(contains(ap_serialfisico, '%25123%25'))&$orderby=_msdyn_product_value desc
*/
