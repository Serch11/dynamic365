function obtenerTrm(executeContext) {
  let formContext = executeContext.getFormContext();
  console.log(formContext);

  if (formContext) {
    formContext
      .getAttribute("transactioncurrencyid")
      .addOnChange(obtenerDivisa);
  }
}

function obtenerDivisa(executeContext) {
 
  let formContext = executeContext.getFormContext();
  let transactioncurrencyid = formContext.getAttribute("transactioncurrencyid");

  if (transactioncurrencyid.getValue()) {
    console.log(transactioncurrencyid.getValue());

    if (transactioncurrencyid.getValue()[0].name === "US Dollar") {
      console.log(transactioncurrencyid.getValue()[0].name);

      let xrm = new XMLHttpRequest();

      let url =
        "https://www.superfinanciera.gov.co/SuperfinancieraWebServiceTRM/TCRMServicesWebService/TCRMServicesWebService";

      //'<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/"><soap:Header><tem:AuthHeader><!--Optional:--><tem:User>?</tem:User><!--Optional:--><tem:Password>?</tem:Password></tem:AuthHeader></soap:Header><soap:Body><tem:GetCheckSum><!--Optional:--><tem:queryString>datasource=ONBASETEST64&amp;KT1261_0_0_0=BAQ-0151-20&amp;clienttype=html&amp;cqid=169</tem:queryString></tem:GetCheckSum></soap:Body></soap:Envelope>';
      let doc = {
        username: "prueba",
        password: "123"
      };
      var strRequest =
        '<?xml version="1.0" encoding="utf-8"?>' +
        "<soap:Envelope " +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"" ' +
        'xmlns:xsd="http://www.w3.org/2001/XMLSchema"" ' +
        'xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
      +"<soap:Body>" +
        '<queryTCRM xmlns="http://action.trm.services.generic.action.superfinanciera.nexura.sc.com.co/">' +
        "</queryTCRM>" +
        "</soap:Body>" +
        "</soap:Envelope>";
      let body =
        "<Envelope xmlns='http://schemas.xmlsoap.org/soap/envelope/'> <Body> <queryTCRM xmlns='http://action.trm.services.generic.action.superfinanciera.nexura.sc.com.co/'> </queryTCRM></Body> </Envelope> ";

      xrm.open("POST", "http://192.168.30.187/D365/oferta/trm", true);
      xrm.addEventListener("readystatechange", e => {
        if (xrm.readyState !== 4) return;
        console.log(xrm.responseText);
        console.log(xrm);
        if (xrm.status >= 200 && xrm.status <= 400) {
         // alert(xrm.responseText);
          let data = JSON.parse(xrm.responseText);
          console.log(e);
          console.log(data);
          console.log(xrm.responseText);
          console.log(xrm);
        }
        console.log(e);
        //alert(xrm.status + " fallo");
        console.log(xrm.status);
      });
      //xrm.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
      // xrm.setRequestHeader(
      //   "SOAPAction",
      //   '"urn:thesecretserver.com/Authenticate"'
      // );
      xrm.setRequestHeader("Content-type", "application/json; charset=utf-8");
      xrm.send(JSON.stringify(doc));
    }
  }
}

// if (transactioncurrencyid.getValue()) {
//   if (transactioncurrencyid.getValue()[0].name === "US Dollar") {
//     // const datosAcceso = new FormData();
//     // datosAcceso.append("usuario", "prueba");
//     // datosAcceso.append("password", "12356");
//     lucho = "sergio";
//     console.log(transactioncurrencyid);
//     console.log(transactioncurrencyid.getValue());
//     console.log(transactioncurrencyid.getValue()[0].name);

//     let xrm = new XMLHttpRequest();
//     let url =
//       "https://www.superfinanciera.gov.co/SuperfinancieraWebServiceTRM/TCRMServicesWebService/TCRMServicesWebService";

//     //'<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/"><soap:Header><tem:AuthHeader><!--Optional:--><tem:User>?</tem:User><!--Optional:--><tem:Password>?</tem:Password></tem:AuthHeader></soap:Header><soap:Body><tem:GetCheckSum><!--Optional:--><tem:queryString>datasource=ONBASETEST64&amp;KT1261_0_0_0=BAQ-0151-20&amp;clienttype=html&amp;cqid=169</tem:queryString></tem:GetCheckSum></soap:Body></soap:Envelope>';

//     let body =
//       "<Envelope xmlns='http://schemas.xmlsoap.org/soap/envelope/'> <Body> <queryTCRM xmlns='http://action.trm.services.generic.action.superfinanciera.nexura.sc.com.co/'> </queryTCRM></Body> </Envelope> ";

//     xrm.open("POST", url);
//     xrm.addEventListener("readystatechange", e => {
//       if (xrm.readyState !== 4) return;
//       if (xrm.status >= 200 && xrm.status <= 400) {
//         alert(xrm.responseText);
//         let data = JSON.parse(xrm.responseText);
//         console.log(e);
//         console.log(data);
//         console.log(xrm.responseText);
//       }
//       alert(xrm.status + " fallo");

//       console.log(xrm.status);
//     });
//     let url =
//       "https://www.superfinanciera.gov.co/SuperfinancieraWebServiceTRM/TCRMServicesWebService/TCRMServicesWebService";
//     xrm.setRequestHeader("Content-Type", "text/xml");
//     //xrm.setRequestHeader("Content-type", "application/json; charset=utf-8");
//     xrm.send(body);
//   }
// }
