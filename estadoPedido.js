function estadoPedido(executeContext) {
  let formContext = executeContext.getFormContext();
  //formContext.data.process.addOnProcessStatusChange(cambioEstado);


  //estos roles van a poder editar el pedido cuando el estado este en elaboracion
  //RCO - Asistente de ventas
  //RCO - Arquitecto de Soluciones
  //RCO - Vendedor


  //Estado de revision
  //RCO - Facturación
  //se le habilita todo el formulario


  //pendiente por compra
  //RCO - Compras 
  // se le habilita todo el formulario




  //detenido en compras
  //RCO - Compras 
  //se le habilitan todos los campos


  //pendiente por recibir
  //RCO - Almacén


  //pendiente por facturar
  //RCO - Facturación


  //factura parcial
  //RCO - Facturación

  //factura
  //RCO - Facturación
  formContext.data.process.addOnStageChange(cambioEstado);
  //rol prueba
}
function cambioEstado(executeContext) {

  try {
    let formContext = executeContext.getFormContext();
    var objEstado = formContext.data.process.getActiveStage();
    var estado = formContext.getAttribute("statuscode");
    var estate = formContext.getAttribute("billto_line3");
    var statecode = formContext.getAttribute("statecode");
    var fase = objEstado.getName();
    console.clear();
    //alert("JS Estado Pedido: Fase = "+fase);
    console.log("JS Estado Pedido: Fase = " + fase);

    if (fase === "En Elaboración") {
      estado.setValue(1);
      estate.setValue("1");
      Xrm.Page.data.entity.save();
    }
    if (fase === "En Revisión") {
      estado.setValue(2);
      estate.setValue("2");
      Xrm.Page.data.entity.save();
    }
    if (fase === "Área Operativa") {
      estado.setValue(778210005);
      estate.setValue("778210005");
      Xrm.Page.data.entity.save();
    }
    if (fase === "Pendiente Por Compra" || fase === "Pendiente por compra") {
      estado.setValue(778210000);
      estate.setValue("778210000");
      Xrm.Page.data.entity.save();
    }
    if (fase === "Detenido En Compras" || fase === "Detenido en compras") {
      estado.setValue(778210001);
      estate.setValue("778210001");
      Xrm.Page.data.entity.save();
    }
    if (fase === "Pendiente Por Recibir" || fase === "Pendiente por recibir") {
      estado.setValue(778210002);
      estate.setValue("778210002");
      Xrm.Page.data.entity.save();
    }
    if (fase === "Pendiente Por Facturar" || fase === "Pendiente por facturar") {
      estado.setValue(778210003);
      estate.setValue("778210003");
      Xrm.Page.data.entity.save();
    }
    if (fase === "Facturación Parcial") {
      estado.setValue(778210004);
      estate.setValue("778210004");
      Xrm.Page.data.entity.save();
    }
    if (fase === "Facturado") {
      estado.setValue(100003);
      estate.setValue("100003");
      Xrm.Page.data.entity.save();
    }
    console.log("Estado Pedido: " + estado.getValue());
    console.log(estate.getValue());


  } catch (error) {
    console.log(error);
    console.log("error script estadoPedido.js");
  }
  //alert("JS Estado Pedido: "+estado.getValue());
}

