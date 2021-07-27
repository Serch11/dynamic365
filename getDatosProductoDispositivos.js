async function getDataProduct(executionContext) {
  let formContext = executionContext.getFormContext();

  let msdyn_product = formContext.getAttribute("msdyn_product");
  let ap_fabricante = formContext.getAttribute("ap_fabricante");
  let ap_modelo = formContext.getAttribute("ap_modelo");
  let ap_serialdefabricante = formContext.getAttribute("ap_serialdefabricante");
  let ap_numero_provedor = formContext.getAttribute("ap_numero_provedor");

  if (msdyn_product.getValue()) {
    //"?$expand=ap_Plataforma($select=ap_plataforma)"
    let idproduct = msdyn_product.getValue()[0].id;
    let query =
      "?$select=ap_nopartefabricante,ap_nopartedelproveedor,_ap_modelo_value&$expand=ap_Fabricante($select=ap_fabricante)";

    try {
      let resProduct = await Xrm.WebApi.retrieveRecord(
        "product",
        idproduct,
        query
      );
      console.log(resProduct);
      if (resProduct) {
        if (resProduct.ap_Fabricante) {
          let fabricante = [
            {
              name: resProduct.ap_Fabricante.ap_fabricante,
              id: resProduct.ap_Fabricante.ap_fabricanteid,
              entityType: "ap_fabricante",
            },
          ];
          console.log(fabricante);
          ap_fabricante.setValue(fabricante);
        }

        if (resProduct._ap_modelo_value) {
          let resModelo = await Xrm.WebApi.retrieveRecord(
            "ap_modelo",
            resProduct._ap_modelo_value
          );
          let modelo = [
            {
              name: resModelo.ap_nombre,
              id: resProduct._ap_modelo_value,
              entityType: "ap_modelo",
            },
          ];
          ap_modelo.setValue(modelo);
        }

        ap_serialdefabricante.setValue(
          resProduct.ap_nopartefabricante
            ? resProduct.ap_nopartefabricante
            : null
        );
        ap_numero_provedor.setValue(
          resProduct.ap_nopartedelproveedor
            ? resProduct.ap_nopartedelproveedor
            : null
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (!msdyn_product.getValue()) {
    ap_fabricante.setValue(null);
    ap_modelo.setValue(null);
    ap_serialdefabricante.setValue(null);
    ap_numero_provedor.setValue(null);
  }
}
