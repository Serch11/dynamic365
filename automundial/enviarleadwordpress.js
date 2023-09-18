
function capturarDatos() {
    let d = document;
    let objecto;

    objecto = {

        firtname: d.getElementById("firstname").value
    };

    enviarDatos(objecto)
}


function enviarDatos(objecto) {


    let req = new XMLHttpRequest();
    let url = "";
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
    req.send(JSON.stringify(objecto));
}

console.log("I'm an inline script tag added to the header.12");
document.addEventListener("load", function (event) {
    console.log("Pagina cargada");
})


var wpcf7Elm = document.querySelector('.wpcf7-form');
//let wpcf7Elm = document.getElementById("wpcf7-form init");



var wpcf7Elm = document.querySelector('.wpcf7-form');
wpcf7Elm.addEventListener("wpcf7submit", function (event) {
        capturarDatos();
 });




