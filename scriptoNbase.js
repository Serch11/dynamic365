





function abrir_url(executionContext) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://labonbase/WebServices/OnBase/Soap/OnBaseWebService.asmx',true);
    var sr = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/"><soap:Header><tem:AuthHeader><!--Optional:--><tem:User>?</tem:User><!--Optional:--><tem:Password>?</tem:Password></tem:AuthHeader></soap:Header><soap:Body><tem:GetCheckSum><!--Optional:--><tem:queryString>datasource=ONBASETEST64&amp;KT1261_0_0_0=BAQ-0151-20&amp;clienttype=html&amp;cqid=169</tem:queryString></tem:GetCheckSum></soap:Body></soap:Envelope>';
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                parser = new DOMParser();
                var xmlDoc = parser.parseFromString(xmlhttp.responseText,"text/xml");
                var cs = xmlDoc.getElementsByTagName("CheckSum")[0].childNodes[0].nodeValue;
                var url = "http://LABONBASE/AppNet64/docpop/docpop.aspx?datasource=ONBASETEST64&KT1261_0_0_0=BAQ-0151-20&clienttype=html&cqid=169&chksum="+cs;
                window.open(url, '_blank');
            }
        }
    }
   //Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);
    // send request
    // ...
}