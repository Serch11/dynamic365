function abrir_url(executionContext) {
    console.log("SERGIO=STEEVEN");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://onbasemobile.redsis.com/WebServices/OnBase/Soap/OnBaseWebService.asmx', true);

    var sr = `<soap: Envelope xmlns: soap = "http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/">
			<soap:Header>
				<tem:AuthHeader>
					<!--Optional:--><tem:User>?</tem:User>
					<!--Optional:--><tem:Password>?</tem:Password>
				</tem:AuthHeader>
			</soap:Header>
			<soap:Body>
				<tem:GetCheckSum>
					<!--Optional:-->
						<tem:queryString>KT1179_0_0_0=SR60113&amp;KT1180_0_0_0=*CLIENTE*&amp;clienttype=html&amp;cqid=185</tem:queryString>
				</tem:GetCheckSum>
			</soap:Body>
		</soap: Envelope >`;


    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                parser = new DOMParser();
                var xmlDoc = parser.parseFromString(xmlhttp.responseText, "text/xml");
                var cs = xmlDoc.getElementsByTagName("CheckSum")[0].childNodes[0].nodeValue;
                var url = "https://ONBASEMOBILE.redsis.com/AppNetNO-AD/docpop/docpop.aspx?KT1179_0_0_0=SR60113&KT1180_0_0_0=*CLIENTE*&clienttype=html&cqid=185&chksum=" + cs;
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