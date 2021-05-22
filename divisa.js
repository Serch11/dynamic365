function obtenerTrm(executeContext) {

  let formContext = executeContext.getFormContext();
  formContext.getAttribute("transactioncurrencyid").addOnChange(ObtenerDivisa);
}

function ObtenerDivisa(executeContext) {
  let formContext = executeContext.getFormContext();

  console.log(formContext);
  let transactioncurrencyid = formContext.getAttribute("transactioncurrencyid");

  if (transactioncurrencyid.getValue()) {
    alert( transactioncurrencyid.getValue()[0].name);
    if (transactioncurrencyid.getValue()[0].name === "US Dollar") {

      const datosAcceso = new FormData();
      datosAcceso.append('usuario', "PRUEBA");
      datosAcceso.append('password', "12356");

      console.log(transactioncurrencyid);
      console.log(transactioncurrencyid.getValue());
      console.log(transactioncurrencyid.getValue()[0].name);

      let xrm = new XMLHttpRequest();

      xrm.addEventListener("readystatechange", (e) => {

        if (xrm.readyState !== 4) return;

        if (xrm.status >= 200 && xrm.status <= 400) {
          let data = JSON.parse(xrm.responseText);
          console.log(e);
          console.log(data);
        }
      });

      xrm.open("POST", "http://localhost:5000/api/pruebaDynamic");
      let body = {
        usuario: "prueba123",
        password: "sergio123"
      }
      xrm.setRequestHeader("Content-type", "application/json; charset=utf-8");
      xrm.send(JSON.stringify(body));




    }
  }
}
