function getChange(exeContext) {
  let formContext = exeContext.getFormContext();
  formContext.getAttribute("statuscode").addOnChange(getStatus);
}
//propuesta = 0;
// Lista para lanzamiento = 1;
// lanzada = 2;
// completada = 3;
//cancelada = 4;
//suspendida = 5;

function getStatus(exeContent) {
  let fecha = new Date();

  let formContext = exeContent.getFormContext();

  // para obtener un atributo o campo del formulario se puede utilizar dos formas
  //primera forma   //let statuscode = formContext.data.entity.getByName('statuscode');
  //segunda forma
  let statuscode = formContext.getAttribute("statuscode");
  let header_statuscode = formContext.getAttribute("header_statuscode");
  let actualstart = formContext.getAttribute("actualstart");
  let actualend = formContext.getAttribute("actualend");

  //console.log(actualend.getValue());
  //console.log(actualend.getValue());
  console.log(statuscode.getValue() + "statuscode");
  console.log(header_statuscode + " header_statuscode ");
  console.log(new Date(fecha.toLocaleDateString()));
  console.log(new Date(fecha.toLocaleDateString()));
  console.log(new Date());
  console.log(fecha.toLocaleDateString());
  console.log(formContext.getAttribute("actualstart").getValue());

  //   if (statuscode.getValue() === 0 || statuscode.getValue() === 1) {
  //     actualstart.setValue(new Date(null));
  //   }

  if (statuscode.getValue() === 2) {
    actualstart.setValue(new Date());
  }
  if (
    statuscode.getValue() === 3 ||
    statuscode.getValue() === 4 ||
    statuscode.getValue() === 5
  ) {
    actualend.setValue(new Date());
  }
}
