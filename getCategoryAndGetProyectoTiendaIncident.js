function getTienda(executionContext) {
  let formContext = executionContext.getFormContext();
  formContext.getAttribute("ap_tiendaintervenida").addOnChange(setCampos);
}

async function setCampos(executionContext) {
  let formContext = executionContext.getFormContext();
  let ap_tiendaintervenida = formContext.getAttribute("ap_tiendaintervenida");
  let ap_categoriatienda = formContext.getAttribute("ap_categoriatienda");
  let ap_proyectotienda = formContext.getAttribute("ap_proyectotienda");

  try {
    if (ap_tiendaintervenida.getValue()) {
      let id = ap_tiendaintervenida.getValue()[0].id;
      console.log(id);
      let result = await Xrm.WebApi.retrieveRecord("ap_tienda", id);

      let resCategoria = await Xrm.WebApi.retrieveRecord(
        "ap_categoriatienda",
        result._ap_categoria_value
      );

      let resProyecto = await Xrm.WebApi.retrieveRecord(
        "ap_proyectotienda",
        result._ap_proyectotienda_value
      );

      let setCategoriaTienda = new Array();
      setCategoriaTienda[0] = new Object();
      setCategoriaTienda[0].id = await result._ap_categoria_value;
      setCategoriaTienda[0].entityType = await "ap_categoriatienda";
      setCategoriaTienda[0].name = await resCategoria.ap_nombre;

      let setProyectoTienda = new Array();
      setProyectoTienda[0] = new Object();
      setProyectoTienda[0].id = await result._ap_proyectotienda_value;
      setProyectoTienda[0].entityType = await "ap_proyectotienda";
      setProyectoTienda[0].name = await resProyecto.ap_nombre;

      if (resCategoria) ap_categoriatienda.setValue(setCategoriaTienda);
      if (resProyecto) ap_proyectotienda.setValue(setProyectoTienda);
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
  } catch (error) {
    console.log(error);
  }
}
