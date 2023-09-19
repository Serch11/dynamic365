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
    //    let ap_area = formContext.getAttribute("ap_area");
    let ap_niveldeservicio = formContext.getAttribute("ap_niveldeservicio");
    let ap_equipoasignado = formContext.getAttribute("ap_equipoasignado");
    let ap_asignarcaso = formContext.getAttribute("ap_asignarcaso");
    let ap_asignarcasoaexterno = formContext.getAttribute(
      "ap_asignarcasoaexterno"
    );
    let ap_areadeequipo = formContext.getAttribute("ap_areadeequipo");

    console.log(ap_caso.getValue());

    if (ap_caso.getValue()) {
      let entidad = ap_caso.getValue()[0].entityType;
      let id = ap_caso.getValue()[0].id;
      var entity = {};
      var externoID;
      var casoID;
      var equipoAsignadoID;
      var areadeEquipoID;
      var asignarCasoId;

      casoID = ap_caso.getValue()[0].id.slice(1, 37);
      console.log(casoID);
      if (ap_tipodeescalamiento.getValue()) {
        if (ap_tipodeescalamiento.getSelectedOption().text === "Externo") {
          externoID = ap_asignarcasoaexterno.getValue()[0].id.slice(1, 37);

          //entity["ap_seguimientodelcaso"] = ap_numerocasofabricante.getValue();
          entity["ap_AsignaciondecasoafabricanteExterno@odata.bind"] =
            "/accounts(" + externoID + ")";
          entity.ap_seguimientodelcaso = ap_tipodeescalamiento.getValue();
          entity.ap_numerocasodelfabricanteexterno =
            ap_numerocasofabricante.getValue();
          entity.ap_necesidaddeescalaraterceros = true;
        }
      }

      if (ap_tipodeescalamiento.getSelectedOption().text === "Interno") {

        console.log("entro escalamiento interno");
        if (ap_equipoasignado.getValue()) equipoAsignadoID = ap_equipoasignado.getValue()[0].id.slice(1, 37);
        if (ap_asignarcaso.getValue()) asignarCasoId = ap_asignarcaso.getValue()[0].id.slice(1, 37);
        if (ap_areadeequipo.getValue()) areadeEquipoID = ap_areadeequipo.getValue()[0].id.slice(1, 37);
        console.log(ap_areadeequipo.getValue()[0].entityType);
        console.log(areadeEquipoID);
        console.log(ap_asignarcaso.getValue()[0].entityType);
        let nombre_entidad = ap_asignarcaso.getValue()[0].entityType + "s";
        console.log(nombre_entidad);

        entity["ap_Equipoasignado@odata.bind"] = "/teams(" + equipoAsignadoID + ")";
        entity["ap_Asignarcaso@odata.bind"] = "/systemusers(" + asignarCasoId + ")";
        entity["ownerid@odata.bind"] = "/" + nombre_entidad + "(" + asignarCasoId + ")";
        //entity.ap_area = ap_area.getValue();
        entity["ap_Areadeequipo@odata.bind"] = "/ap_areas(" + areadeEquipoID + ")";
        entity.contractservicelevelcode = ap_niveldeservicio.getValue();
        entity.ap_seguimientodelcaso = ap_tipodeescalamiento.getValue();
        console.log(entity);
      }
    }
    
    let url = ""+formContext.context.getClientUrl() +"/api/data/v9.1/incidents(" +casoID +")";
    var req = new XMLHttpRequest();
    req.open("PATCH",url,true );
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.onreadystatechange = function () {
      if (this.readyState === 4) {
        req.onreadystatechange = null;
        if (this.status === 204) {
          //Success - No Return Data - Do Somethingth
          console.log("data actualizada");
          console.log(entity);
          console.log(this.responseText);
        } else {
          Xrm.Utility.alertDialog(this.statusText);
        }
      }
    };
    req.send(JSON.stringify(entity));
  } catch (error) {
    console.log(error);
  }
}
