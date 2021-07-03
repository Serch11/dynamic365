function estadoPedido(executeContext) {
  let formContext = executeContext.getFormContext();
  //formContext.data.process.addOnProcessStatusChange(cambioEstado);
  formContext.data.process.addOnStageChange(cambioEstado);
}
function cambioEstado(executeContext) {
  let formContext = executeContext.getFormContext();
  var objEstado = formContext.data.process.getActiveStage();
  var estado = formContext.getAttribute("statuscode");
  var estate = formContext.getAttribute("billto_line3");
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
  if (fase === "Pendiente Por Compra") {
    estado.setValue(778210000);
    estate.setValue("778210000");
    Xrm.Page.data.entity.save();
  }
  if (fase === "Detenido En Compras") {
    estado.setValue(778210001);
    estate.setValue("778210001");
    Xrm.Page.data.entity.save();
  }
  if (fase === "Pendiente Por Recibir") {
    estado.setValue(778210002);
    estate.setValue("778210002");
    Xrm.Page.data.entity.save();
  }
  if (fase === "Pendiente Por Facturar") {
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

  //alert("JS Estado Pedido: "+estado.getValue());
}

try {
  
} catch (error) {
  
}