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
      console.log(transactioncurrencyid);
      console.log(transactioncurrencyid.getValue());
      console.log(transactioncurrencyid.getValue()[0].name);

      let xrm = new XMLHttpRequest();

      xrm.addEventListener("readystatechange", (e) => {
        console.log(e);
      });



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
