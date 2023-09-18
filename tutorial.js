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