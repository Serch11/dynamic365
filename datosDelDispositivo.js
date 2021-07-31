async function datosDelDispositivo(executionContext) {
  //obtenermos el contexto de formulario

  let formContext = executionContext.getFormContext();
  //declaracion y inicializacion de las variables
  let ap_serialfisico = formContext.getAttribute("ap_serialfisico");
  let ap_activofijo = formContext.getAttribute("ap_activofijo");
  let ap_serialcliente = formContext.getAttribute("ap_serialcliente");
  let ap_dispositivo = formContext.getAttribute("ap_dispositivo_nativo");
  let ap_fabricante = formContext.getAttribute("ap_fabricante");
  let ap_modelo = formContext.getAttribute("ap_modelo");

  //condicionales
  if (ap_dispositivo.getValue()) {
    //let options = "?$select=ap_activofijo,ap_serialcliente,";
    let idDispositivo = ap_dispositivo.getValue()[0].id;
    let options =
      "?$select=msdyn_customerassetid,msdyn_name,_msdyn_product_value,ap_serialdefabricante,ap_serialcliente,_ap_modelo_value,_ap_fabricante_value,statecode,ap_activofijo,ap_serialfisico";

    let result = await Xrm.WebApi.retrieveRecord(
      "msdyn_customerasset",
      idDispositivo,
      options
    );

    if (result) {
      //console.log(result);
      let query = result;
      if (query) {
        ap_activofijo.setValue(
          query.ap_activofijo ? query.ap_activofijo : null
        );
        ap_serialfisico.setValue(
          query.ap_serialfisico ? query.ap_serialfisico : null
        );
        ap_serialcliente.setValue(
          query.ap_serialcliente ? query.ap_serialcliente : null
        );

        if (query._msdyn_product_value) {
          let resFabricante = await consultarApi(
            "ap_fabricante",
            query._ap_fabricante_value
          );

          if (resFabricante) ap_fabricante.setValue(resFabricante);
        }

        if (query._ap_modelo_value) {
          let resModelo = await consultarApi(
            "ap_modelo",
            query._ap_modelo_value
          );

          if (resModelo) ap_modelo.setValue(resModelo);
        }
      }
    }

    // if (result.entities.length === 0) {
    //   var alertStrings = {
    //     confirmButtonLabel: "Si",
    //     text:
    //       "No existe el dispositivo con numero de activo fijo " +
    //       ap_activofijo.getValue().toUpperCase(),
    //     title: "No se encontro dispositivo",
    //   };
    //   var alertOptions = { height: 120, width: 260 };

    //   Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
    //     function success() {
    //       // perform operations on alert dialog close
    //     },
    //     function (error) {
    //       console.log(error.message);
    //       // handle error conditions
    //     }
    //   );
    //   //   formContext.ui.setFormNotification(
    //   //     "No existe el dispositivo con numero de serie" +
    //   //       ap_serialfisico.getValue(),
    //   //     "ERROR",
    //   //     "1"
    //   //   );
    //   //   setTimeout(() => {
    //   //     formContext.ui.clearFormNotification("1");
    //   //   }, 3000);
    // }
  }

  if (!ap_dispositivo.getValue()) {
    ap_serialfisico.setValue(null);
    ap_serialcliente.setValue(null);
    ap_activofijo.setValue(null);
    ap_fabricante.setValue(null);
    ap_modelo.setValue(null);
  }
}

/*
msdyn_customerassets?$select=_msdyn_product_value,_msdyn_parentasset_value,_msdyn_masterasset_value,msdyn_customerassetid,_ap_tipodedispositivo_value,ap_serialfisico,ap_serialdefabricante,ap_serialcliente,_ap_modelo_value,statecode,ap_activofijo&$filter=(contains(ap_serialfisico, '%25123%25'))&$orderby=_msdyn_product_value desc
*/
const consultarApi = async (entidad, id) => {
  try {
    
    let result = await Xrm.WebApi.retrieveRecord(entidad, id);

    if (entidad === "ap_fabricante") {
      if (result) {
        return [
          {
            name: result.ap_fabricante,
            id: result.ap_fabricanteid,
            entityType: entidad,
          },
        ];
      }
    }
    if (entidad === "ap_modelo") {
      if (result) {
        return [
          {
            name: result.ap_nombre,
            id: result.ap_modeloid,
            entityType: entidad,
          },
        ];
      }
    }
    if (!result) return [{ ok: false }];
  } catch (error) {
    console.log(error);
  }
};
