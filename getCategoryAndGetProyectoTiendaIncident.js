function getTienda(executionContext) {
  let formContext = executionContext.getFormContext();
  formContext.getAttribute("ap_tiendaintervenida").addOnChange(setCampos);
}

async function setCampos(executionContext) {
  let formContext = executionContext.getFormContext();
  let ap_tiendaintervenida = formContext.getAttribute("ap_tiendaintervenida");
  let ap_categoriatienda = formContext.getAttribute("ap_categoriatienda");
  let ap_proyectotienda = formContext.getAttribute("ap_proyectotienda");
  let resCategoria;
  let resProyecto;

  if (ap_tiendaintervenida.getValue()) {
    let id = await ap_tiendaintervenida.getValue()[0].id;
    console.log(ap_tiendaintervenida.getValue());
    console.log(id);

    let result = await Xrm.WebApi.retrieveRecord("ap_tienda", id);
    let id_categoriatienda = await result._ap_categoria_value;
    let id_proyectotienda = await result._ap_proyectotienda_value;
    
    if (id_categoriatienda) {
      resCategoria = await Xrm.WebApi.retrieveRecord(
        "ap_categoriatienda",
        result._ap_categoria_value
      );

      if (resCategoria) {
        let setCategoriaTienda = new Array();
        setCategoriaTienda[0] = new Object();
        setCategoriaTienda[0].id = await result._ap_categoria_value;
        setCategoriaTienda[0].entityType = await "ap_categoriatienda";
        setCategoriaTienda[0].name = await resCategoria.ap_nombre;
        ap_categoriatienda.setValue(setCategoriaTienda);
      }
    }
    if (id_proyectotienda) {
      resProyecto = await Xrm.WebApi.retrieveRecord(
        "ap_proyectotienda",
        result._ap_proyectotienda_value
      );
      if (resProyecto) {
        let setProyectoTienda = new Array();
        setProyectoTienda[0] = new Object();
        setProyectoTienda[0].id = await result._ap_proyectotienda_value;
        setProyectoTienda[0].entityType = await "ap_proyectotienda";
        setProyectoTienda[0].name = await resProyecto.ap_nombre;

        ap_proyectotienda.setValue(setProyectoTienda);
      }
    }
  }

  if (
    !ap_tiendaintervenida.getValue() &&
    (executionContext.getDepth() === 1 ||
      executionContext.getDepth() === 2 ||
      executionContext.getDepth() === 0)
  ) {
    ap_categoriatienda.setValue(null);
    ap_proyectotienda.setValue(null);
  }
}
