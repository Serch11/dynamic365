function obtenerTrm(executeContext) {
  let formContext = executeContext.getFormContext();

  let transactioncurrencyid = formContext.getAttribute("transactioncurrencyid");

  formContext.getAttribute("transactioncurrencyid").addOnChange(ObtenerDivisa);
}

function ObtenerDivisa(executeContext) {
  let formContext = executeContext.getFormContext();

  console.log(formContext);
  let transactioncurrencyid = formContext.getAttribute("transactioncurrencyid");

  if (transactioncurrencyid.getValue()) {
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



      //xrm.addEventListener("readystatechange",(e))


      //   req.onreadystatechange = function(aEvt) {
      //     if (req.readyState == 4) {

      //         console.log(aEvt);
      //     }
      //   };
      //   xml.setRequestHeader("Content-Type", "application/json");
      //   xml.open("POST", "http://192.168.30.187/D365/oferta/trm", {
      //     username: "prueba",
      //     password: "123"
      //   });
      //   xml.send();
    }
  }
}
