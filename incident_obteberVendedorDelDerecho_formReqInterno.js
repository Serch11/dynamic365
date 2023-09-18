async function ObtenerVendedorDelDerecho(executionContext) {
  try {
    let formContext = executionContext.getFormContext();
    let entitlementid = formContext.getAttribute("entitlementid");
    let ap_avaladopor = formContext.getAttribute("ap_avaladopor");
    let ap_tieneoportunidadasociada = formContext.getAttribute(
      "ap_tieneoportunidadasociada"
    );

    if (entitlementid.getValue()) {
      console.log(entitlementid.getValue());
      let id = entitlementid.getValue()[0].id;
      let entitytype = entitlementid.getValue()[0].entityType;

      let resDerecho = await consultarEntidades(entitytype, id);

      if (resDerecho) {
        let idPedido = await resDerecho._ap_referenteapedido_value;

        if (idPedido && ap_tieneoportunidadasociada.getValue() === false) {
          let resultPedido = await consultarEntidades("salesorder", idPedido);
          if (resultPedido) {
            let idUsuario = await resultPedido._ownerid_value;
            if (idUsuario) {
              let resultUsuario = await consultarEntidades(
                "systemuser",
                idUsuario
              );
              if (resultUsuario) {
              }
              let data = [
                {
                  id: idUsuario,
                  entityType: "systemuser",
                  name: resultUsuario.fullname,
                },
              ];

              ap_avaladopor.setValue(data);
            }
          }
        }
      }
    }
    console.log(executionContext.getDepth());
    //si no tiene derecho
    if (
      !entitlementid.getValue() &&
      (executionContext.getDepth() === 0 ||
        executionContext.getDepth() === 1 ||
        executionContext.getDepth() === 2)
    ) {
      ap_avaladopor.setValue(null);
    }
  } catch (error) {
    console.log(error);
    console.log(
      "Errro en la funcion obtenerVendedorDerecho en el script incident_obtenerVendedorDelDerecho_formReqInterno"
    );
  }
}

async function consultarEntidades(entidad, id) {
  try {
    if (entidad && id) return await Xrm.WebApi.retrieveRecord(entidad, id);
  } catch (error) {
    console.log(error);
    console.log("error funcion consultarentidades");
  }
}
