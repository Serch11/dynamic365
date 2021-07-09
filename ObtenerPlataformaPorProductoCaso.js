async function ObtenerPlataforma(executionContext) {
  let formContext = executionContext.getFormContext();
  let productid = formContext.getAttribute("productid");
  let ap_plataforma = formContext.getAttribute("ap_plataforma");

  console.log(productid.getValue());
  if (productid.getValue()) {
    console.log(productid.getValue());
    let id = productid.getValue()[0].id;
    let entidad = productid.getValue()[0].entityType;

    let result = await consultaPlataforma(id, entidad);

    if (result.ap_Plataforma) {
      let data = [
        {
          id: result.ap_Plataforma.ap_plataformaid,
          name: result.ap_Plataforma.ap_plataforma,
          entityType: "ap_plataforma",
        },
      ];
      ap_plataforma.setValue(data);
    }
  }

  console.log(executionContext.getDepth());
  if (
    !productid.getValue() &&
    (executionContext.getDepth() === 0 ||
      executionContext.getDepth() === 1 ||
      executionContext.getDepth() === 2 ||
      executionContext.getDepth() === 3)
  ) {
    ap_plataforma.setValue(null);
  }
}

//"?$select=name,cr5c5_nombrecomercial,websiteurl,address1_line1&$expand=ap_Ciudad($select=ap_codigociudad,ap_ciudad)"

const consultaPlataforma = async (id, entidad) => {
  try {
    let res = await Xrm.WebApi.retrieveRecord(
      entidad,
      id,
      "?$expand=ap_Plataforma($select=ap_plataforma)"
    );

    if (res) return res;
    return { error: "false" };
  } catch (error) {
    console.log(error);
  }
};
