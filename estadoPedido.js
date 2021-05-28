function stateProcess(executeContext) {
    let formContext = executeContext.getFormContext();
    var objEstado = formContext.data.process.getActiveStage();
    var estado = formContext.getAttribute("statuscode");
    var fase = objEstado.getName();
    console.log(objEstado.getName());
    if(fase === "En Elaboración"){
      estado.setValue(1);
    }
    if(fase === "En Revisión"){
      estado.setValue(2);
    }
    if(fase === "Área Operativa"){
      estado.setValue(778210005);
    }
    if(fase === "Pendiente Por Compra"){
      estado.setValue(778210000);
    }
    if(fase === "Detenido En Compras"){
      estado.setValue(778210001);
    }
    if(fase === "Pendiente Por Recibir"){
      estado.setValue(778210002);
    }
    if(fase === "Pendiente Por Facturar"){
      estado.setValue(778210003);
    }
    if(fase === "Facturación Parcial"){
      estado.setValue(778210004);
    }
    if(fase === "Facturado"){
      estado.setValue(100003);
    } 
    
  }