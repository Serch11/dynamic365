


function capturarDatos() {
    let d = document;
    let objecto;

    objecto = {
        subject: d.getElementById("subject").value,
        firtname: d.getElementById("firstname").value,
        lastname: d.getElementById("lastname").value,
        invt_pais: d.getElementById("invt_pais"),
        ciudad: d.getElementById("invt_ciudad").value,
        companyname: d.getElementById("companyname").value,
        emailaddress1: d.getElementById("emailaddress1").value,
        invt_cargoempresarial: d.getElementById("invt_cargoempresarial").value,
        mobilephone: d.getElementById("mobilephone").value,
        comopodemosayudarte: d.getElementById("comopodemosayudarte").value,
        description: d.getElementById("description").value,
    };

    enviarDatos(objecto)
}


function enviarDatos(data) {
    let req = new XMLHttpRequest();
    let url = "url";
    req.open("POST", url, true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; chatset=utf-8");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            this.onreadystatechange = 0;
            if (this.status === 204 || this.status === 202 || this.status === 200) {
                console.log("ok");
            }
        }
    }
    req.send(JSON.stringify(data));
}







