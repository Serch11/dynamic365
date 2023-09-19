function enviarSolicitud(executionContext) {


    try {
        console.log(executionContext);
        var formContext = Xrm.Page;
        console.log(formContext);
        let urlflow = "https://prod-05.brazilsouth.logic.azure.com:443/workflows/01d49ae2288944dd9efe8e1a1840c3e8/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=lV6jxSSqsp4rd9msqginKLWBbY7yrXnkfcCw4Eo9Zo4";
        let salida = JSON.stringify({
            "contactid": formContext.data.entity.getId().slice(1, 37),
            "sendCant": "0"
        });
        console.log(salida);
        let req = new XMLHttpRequest();
        req.open("POST", urlflow, true);
        req.setRequestHeader("Content-Type", "application/json");
        req.send(salida);


        req.onreadystatechange = function () {
            if (this.onreadystatechange === 4) {
                console.log(this.onreadystatechange);
                this.onreadystatechange = null;
            }
            if (this.status === 200) {
                console.log(" Mostrando la respuesta desde el flujo ->>>>>>>");
                console.log(this.response);
            }
        }

    } catch (error) {
        console.log(error);
    }
}