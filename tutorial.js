<<<<<<< HEAD
const apiUrl = 'https://source.unsplash.com/category/nature/';

// Hacer una solicitud a la API usando fetch
fetch(apiUrl)
    .then(response => response.blob())  // Obtener la respuesta como un objeto Blob
    .then(blob => {
        const jsonbinary2 = new File([blob], 'imagen.jpg', { type: 'image/jpeg' })
        console.log(jsonbinary2)
        const reader = new FileReader();   // Crear un lector de archivos
        reader.onload = (e) => {
            console.log(e.target.result);
            const binaryData = reader.result; // Obtener el código binario de la imagen
            RealizarPeticion(jsonbinary2);
            const jsonbinary = new File([blob], 'imagen.jpg', { type: 'image/jpeg' })
            console.log(jsonbinary);          // Hacer algo con el código binario (mostrarlo, procesarlo, etc.)
        };
        reader.readAsBinaryString(blob);    // Leer el contenido del objeto Blob como código binario
    })
    .catch(error => {
        console.error('Error al obtener la imagen:', error);
    });


// URL de la imagen
const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Google_Images_2015_logo.svg/1200px-Google_Images_2015_logo.svg.png';
const imageUrl2 = "https://paginawebam.s3.us-east-2.amazonaws.com/catalogo/goodyear/Fichas+tecnicas+Goodyear+pagina+web/steelmark-agd.pdf";

let nombre = imageUrl.split(".");

// Hacer una solicitud a la URL de la imagen
fetch(imageUrl)
    .then(response => response.arrayBuffer()) // Obtener los datos binarios de la respuesta como ArrayBuffer
    .then(res => {
        console.log(res.headers.get('content-type'));
        let arrayBuffer = res.arrayBuffer();
        // Convertir el ArrayBuffer en un array de bytes
        console.log(typeof arrayBuffer);
        console.log(arrayBuffer);
        const base64Data = btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));
        console.log(base64Data);
        RealizarPeticion(base64Data)
        // Ahora tienes el contenido binario de la imagen en forma de un array de bytes (byteArray)


        // Puedes usar byteArray para adjuntar la imagen en un correo electrónico u otras operaciones
    })
    .catch(error => {
        console.error("Error al obtener el contenido de la imagen:", error);
    });

async function peticion() {
    let res = await fetch(imageUrl);
    console.log(res.arrayBuffer());
    console.log(res.headers.get('content-type'));
}



async function RealizarPeticion(content) {
    let URL = "https://prod-02.brazilsouth.logic.azure.com:443/workflows/f7a820b1e7eb409cb7e23ee909a708cf/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=SuMtmXQz6VAaGhqa3MCTRkUPPYKIUc419IF_QiNo8JE";
    const response = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ imagen: content })
    });

    console.log(response);
}

let headers = new Headers();

headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');
headers.append('Access-Control-Allow-Origin', 'true');

fetch(imageUrl, {
    method: "GET"
}).then(response => response.blob()) // Obtener el contenido del archivo como Blob
    .then(blob => {
        const reader = new FileReader();

        reader.onload = function (event) {
            const base64String = event.target.result.split(',')[1]; // Obtener solo la parte base64 de la URL
            console.log('Tipo de archivo:', blob.type);
            console.log('Archivo en formato base64:', base64String);

            // Puedes utilizar 'blob.type' y 'base64String' según tus necesidades
        };

        reader.readAsDataURL(blob); // Leer el Blob como URL base64
    })
    .catch(error => {
        console.error('Error al obtener la información del archivo:', error);
    })
=======
// A namespace defined for the sample code
// As a best practice, you should always define 
// a unique namespace for your libraries
var Sdk = window.Sdk || {};


 function  samplefunction() {
     console.clear();
     console.log(this);
    // Define some global variables
    var myUniqueId = "_myUniqueId"; // Define an ID for the notification
    var currentUserName = Xrm.Utility.getGlobalContext().userSettings.userName; // get current user name
    var message = currentUserName + ": Your JavaScript code in action!";

    // Code to run in the form OnLoad event
    this.formOnLoad = function (executionContext) {
        var formContext = executionContext.getFormContext();

        // display the form level notification as an INFO
        formContext.ui.setFormNotification(message, "INFO", myUniqueId);

        // Wait for 5 seconds before clearing the notification
        window.setTimeout(function () { formContext.ui.clearFormNotification(myUniqueId); }, 5000);
    }

    // Code to run in the column OnChange event 
    this.attributeOnChange = function (executionContext) {
        var formContext = executionContext.getFormContext();

        // Automatically set some column values if the account name contains "Contoso"
        var accountName = formContext.getAttribute("name").getValue();
        if (accountName.toLowerCase().search("contoso") != -1) {
            formContext.getAttribute("websiteurl").setValue("https://www.contoso.com");
            formContext.getAttribute("telephone1").setValue("425-555-0100");
            formContext.getAttribute("description").setValue("Website URL, Phone and Description set using custom script.");
        }
    }

    // Code to run in the form OnSave event 
    this.formOnSave = function () {
        // Display an alert dialog
        Xrm.Navigation.openAlertDialog({ text: "Record saved." });
    }
};
>>>>>>> 5de8aba30d5bb03e7e577f09f1b44f5cd0ca416a
