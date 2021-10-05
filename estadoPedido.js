function estadoPedido(executeContext) {
  let formContext = executeContext.getFormContext();
  //formContext.data.process.addOnProcessStatusChange(cambioEstado);


  //estos roles van a poder editar el pedido cuando el estado este 

  //en elaboracion
  //RCO - Asistente de ventas   id  7879B20D-2955-EB11-A812-000D3AC1B829
  //RCO - Arquitecto de Soluciones  45469B0A-F58B-EB11-B1AC-0022483729A9
  //RCO - Vendedor                  30CF527A-6844-EB11-A812-000D3A887093





  //Estado de revision  
  //RCO - Facturación               CFACAE89-EDC3-EB11-BACC-002248378D06
  //se le habilita todo el formulario


  //AREA OPERATIVA
  // RCO - COORDINADOR DE SERVICIO    E4ABEDC3-F68B-EB11-B1AC-0022483729A9


  //pendiente por compra
  //RCO - Compras                  4A5F3C25-24CB-EB11-BACC-002248369E9F
  // se le habilita todo el formulario

  //detenido en compras
  //RCO - Compras                  4A5F3C25-24CB-EB11-BACC-002248369E9F
  //se le habilitan todos los campos

  //pendiente por recibir
  //RCO - Almacén                   C801ECEE-D7C3-EB11-BACC-002248378D06

  //pendiente por facturar
  //RCO - Facturación               CFACAE89-EDC3-EB11-BACC-002248378D06

  //factura parcial
  //RCO - Facturación               CFACAE89-EDC3-EB11-BACC-002248378D06


  //factura
  //RCO - Facturación               CFACAE89-EDC3-EB11-BACC-002248378D06


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





function validarRoles(executionContext) {


  var roles = new Array();

  roles = ["7879B20D-2955-EB11-A812-000D3AC1B829", "45469B0A-F58B-EB11-B1AC-0022483729A9", "30CF527A-6844-EB11-A812-000D3A887093", "CFACAE89-EDC3-EB11-BACC-002248378D06", "E4ABEDC3-F68B-EB11-B1AC-0022483729A9", "4A5F3C25-24CB-EB11-BACC-002248369E9F", "C801ECEE-D7C3-EB11-BACC-002248378D06"];

  let formContext = executionContext.getFormContext();
  let statuscode = formContext.getAttribute("statuscode");
  let userSettings = Xrm.Utility.getGlobalContext().userSettings;


  //  7879B20D - 2955 - EB11 - A812 - 000D3AC1B829
  //RCO - Arquitecto de Soluciones  45469B0A-F58B-EB11-B1AC-0022483729A9
  //RCO - Vendedor                  30CF527A-6844-EB11-A812-000D3A887093
  if (statuscode === 1) {

    let arr = ["7879B20D-2955-EB11-A812-000D3AC1B829", "45469B0A-F58B-EB11-B1AC-0022483729A9", "30CF527A-6844-EB11-A812-000D3A887093"];
    Xrm.Utility.getGlobalContext().userSettings.securityRolePrivileges;
    Xrm.Utility.getGlobalContext().userSettings.securityRoles;
    arr.indexOf(searchElement, fromIndex)


    Xrm.Utility.getGlobalContext().userSettings.securityRoles.forEach(function (att, index) {
      if (arr.includes(att)) {
        console.log(arr.includes(att));
        console.log(att)
        Xrm.Page.data.entity.attributes.forEach(e => { e.controls.get(0).setDisabled(false) })
      } else {
        Xrm.Page.data.entity.attributes.forEach(e => { e.controls.get(0).setDisabled(true) })
      }
    })
  }
}

// else {
//   console.log("encontrol el rol")
//   Xrm.Page.data.entity.attributes.forEach(e => { e.controls.get(0).setDisabled(false) })
// }


Xrm.Page.data.process.addOnPreProcessStatusChange(function (e) {
  e.getEventArgs().preventDefault();
  var alertStrings = { confirmButtonLabel: "OK", texto: "Esta operación no está permitida", título: "¡Cambio de estado! " };
  var alertOptions = { altura: 120, ancho: 260 };
  Xrm.Navigation.openAlertDialog(alertStrings, alertOptions)
});