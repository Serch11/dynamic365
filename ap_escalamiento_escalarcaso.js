async function escalarCaso(executionContext) {
  // tipo de escalamiento
  // externo === 778210000
  // interno === 778210001

  try {
    let formContext = executionContext.getFormContext();

    let ap_caso = formContext.getAttribute("ap_caso");
    let ap_tipodeescalamiento = formContext.getAttribute(
      "ap_tipodeescalamiento"
    );
    let ap_numerocasofabricante = formContext.getAttribute(
      "ap_numerocasofabricante"
    );
    let ap_area = formContext.getAttribute("ap_area");
    let ap_niveldeservicio = formContext.getAttribute("ap_niveldeservicio");
    let ap_equipoasignado = formContext.getAttribute("ap_equipoasignado");
    let ap_asignarcaso = formContext.getAttribute("ap_asignarcaso");
    let ap_asignarcasoaexterno = formContext.getAttribute(
      "ap_asignarcasoaexterno"
    );

    console.log(ap_caso.getValue());

    if (ap_caso.getValue()) {
      let entidad = ap_caso.getValue()[0].entityType;
      let id = ap_caso.getValue()[0].id;
      var data;

      if (ap_tipodeescalamiento.getValue()) {
        if (ap_tipodeescalamiento.getSelectedOption().text === "Externo") {
          data = {
            ap_seguimientodelcaso: 778210000,
            ap_numerocasodelfabricanteexterno: ap_numerocasofabricante.getValue(),
            ap_asignaciondecasoafabricanteexterno: {
              logicalname: ap_asignarcasoaexterno.getValue()[0].entityType,
              id: ap_asignarcasoaexterno.getValue()[0].id
            }
          };
        }

        if (ap_tipodeescalamiento.getSelectedOption().text === "Interno") {
          data = {
            ap_area: ap_area.getValue(),
            contractservicelevelcode: ap_niveldeservicio.getValue(),
            ap_equipoasignado: {
              logicalname: ap_equipoasignado.getValue()[0].entityType,
              id: ap_equipoasignado.getValue()[0].id
            },
            ap_asignarcaso: {
              logicalname: ap_asignarcaso.getValue()[0].entityType,
              id: ap_asignarcaso.getValue()[0].id
            }
          };
        }

        console.log(data);

        Xrm.WebApi.updateRecord(entidad, id, data).then(
          function success(result) {
            console.log(result);
            // perform operations on record update
            console.log("data actualizada");
          },
          function(error) {
            console.log(error.message);
            // handle error conditions
          }
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
}
