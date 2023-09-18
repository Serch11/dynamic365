function abrir_url(executionContext) {
  console.log("SERGIO=STEEVEN");
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open(
    "POST",
    "https://onbasemobile.redsis.com/WebServices/OnBase/Soap/OnBaseWebService.asmx",
    true
  );

  var sr =
    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">' +
    "<soapenv:Header>" +
    "<tem:AuthHeader>" +
    "<!--Optional:-->" +
    "<tem:User>?</tem:User>" +
    "<!--Optional:-->" +
    "<tem:Password>?</tem:Password>" +
    "</tem:AuthHeader>" +
    "</soapenv:Header>" +
    "<soapenv:Body>" +
    "<tem:GetCheckSum>" +
    "<!--Optional:-->" +
    "<tem:queryString>KT1179_0_0_0=SR60113&amp;KT1180_0_0_0=*CLIENTE*&amp;clienttype=html&amp;cqid=185</tem:queryString>" +
    "</tem:GetCheckSum>" +
    "</soapenv:Body>" +
    "</soapenv:Envelope>";

  xmlhttp.onreadystatechange = function() {
    console.log(xmlhttp.readyState);
    console.log(xmlhttp.status);
    //if (xmlhttp.readyState == 4) {
    //if (xmlhttp.status == 200) {
    parser = new DOMParser();
    console.error(parser);
    var xmlDoc = parser.parseFromString(xmlhttp.responseText, "text/xml");
    console.error(xmlhttp.responseText);
    console.error(xmlDoc);
    var cs = xmlDoc.getElementsByTagName("CheckSum")[0].childNodes[0].nodeValue;
    var url =
      "https://ONBASEMOBILE.redsis.com/AppNetNO-AD/docpop/docpop.aspx?KT1179_0_0_0=SR60113&KT1180_0_0_0=*CLIENTE*&clienttype=html&cqid=185&chksum=" +
      cs;
    window.open(url, "_blank");
    //}
    //}
  };
  //Send the POST request
  xmlhttp.setRequestHeader("Content-Type", "text/xml");
  xmlhttp.send(sr);
  // send request
  // ...
}
