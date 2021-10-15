async function ObtenerVendedorDelDerecho(executionContext) {
  try {
    let formContext = executionContext.getFormContext();
    let entitlementid = formContext.getAttribute("entitlementid");
    let ap_avaladopor = formContext.getAttribute("ap_avaladopor");

    if (entitlementid.getValue()) {
      let id = entitlementid.getValue()[0].id.slice(1, 37);
      let entitytype = entitlementid.getValue()[0].entityType;

      ///aqui comienzas a capturar el pedido del derecho
      let resDerecho = await consultarEntidades(entitytype, id);

      if (resDerecho) {
        let idPedido = await resDerecho._ap_referenteapedido_value;
        if (idPedido) consultaPedido(formContext, idPedido);

        //validamos que el derecho haga ferefencia a una oportunidad

        if (resDerecho._ap_referenteaoportunidad_value) {
          consultarOportunidad(
            formContext,
            resDerecho._ap_referenteaoportunidad_value
          );
        }
        if (resDerecho._ap_referenteaproyecto_value)
          consultaProjecto(
            formContext,
            resDerecho._ap_referenteaproyecto_value
          );
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

//function que se utiliza cuando el derecho esta asociado a un pedido
async function consultaPedido(formContext, idPedido) {
  try {
    let ap_avaladopor = formContext.getAttribute("ap_avaladopor");
    let ap_tieneoportunidadasociada = formContext.getAttribute(
      "ap_tieneoportunidadasociada"
    );
    let ap_pedidoasociado = formContext.getAttribute("ap_pedidoasociado");

    if (ap_tieneoportunidadasociada.getValue() === false) {
      //consultamos el pedido asociados al derecho
      let resultPedido = await consultarEntidades("salesorder", idPedido);

      if (resultPedido) {
        //obtenemos el nombre , la id y la entidad para asignarcela al campo ap_pedidoasociado
        let referenteapedido = [
          {
            id: idPedido,
            name: resultPedido.name,
            entityType: "salesorder",
          },
        ];

        if (Object.values(referenteapedido[0]).length === 3) {
          ap_pedidoasociado.setValue(referenteapedido);
        } else {
          console.log("no tiene la info completa");
        }

        //consultamos el usuario asociado al pedido y lo asignamos al campo ap_avaladopor
        let idUsuario = await resultPedido._ownerid_value;
        if (idUsuario) {
          let resultUsuario = await consultarEntidades("systemuser", idUsuario);
          if (resultUsuario) {
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
  } catch (error) {
    console.log(error);
    console.log("error funcion consultaPedido");
  }
}

async function consultaProjecto(formContext, idProjecto) {
  try {
    let ap_proyectoasociado = formContext.getAttribute("ap_proyectoasociado");

    let resProyecto = await consultarEntidades("msdyn_project", idProjecto);
    console.log(resProyecto);
    if (resProyecto) {
      let dataProjecto = [
        {
          id: idProjecto,
          name: resProyecto.ap_codigodelproyecto,
          entityType: "msdyn_project",
        },
      ];
      if (Object.values(dataProjecto[0] === 3)) {
        ap_proyectoasociado.setValue(dataProjecto);
      }
    }
  } catch (error) {
    console.log(error);
    console.log("error funcion consultar porjecto");
  }
}

async function consultarOportunidad(formContext, idOportunidad) {
  try {
    let ap_oportunidadasociada = formContext.getAttribute(
      "ap_oportunidadasociada"
    );
    let ap_tieneoportunidadasociada = formContext.getAttribute(
      "ap_tieneoportunidadasociada"
    );

    let resOportunidad = await consultarEntidades("opportunity", idOportunidad);
    console.log(resOportunidad);
    if (resOportunidad) {
      let dataoportunidad = [
        {
          id: idOportunidad,
          name: resOportunidad.name,
          entityType: "opportunity",
        },
      ];
      console.log(dataoportunidad);
      if (Object.values(dataoportunidad[0] === 3)) {
        ap_oportunidadasociada.setValue(dataoportunidad);
      }
    }
  } catch (error) {
    console.log(error);
    console.log("error funtion consultaOportunidadF");
  }
}

async function consultarEntidades(entidad, id) {
  console.log("function consultar entidades ----------->");
  console.log(entidad, id);
  try {
    if (entidad && id) return await Xrm.WebApi.retrieveRecord(entidad, id);
    return false;
  } catch (error) {
    console.log(error);
    console.log("error funcion consultarentidades");
  }
}
