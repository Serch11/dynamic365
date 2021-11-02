
function loadSubGrid(executionContext) {
    try {
        let formContext = executionContext.getFormContext();
        let gridDocument = formContext.getControl("document_view");
        gridDocument.addOnLoad(documentosCargados);
    } catch (error) {
        console.log(error);
    }
}




function documentosCargados(executionContext) {


    try {

        //declaramos el array que guardara los registros creados;
        let ArrayDeRegistros = new Array();
        let send = 0;
        //declaramos los tipos de registros
        let tp1 = 0;
        let tp2 = 0;
        let tp3 = 0;
        let tp4 = 0;

        let formContext = executionContext.getFormContext();

        let ap_validateddocuments = formContext.getControl("ap_validateddocuments");
        ap_validateddocuments.getAttribute().setValue(false);
        //obtenemos el contexto de la subcuadricula
        let gridDocument = formContext.getControl("document_view");
        //obtenemos la coleccion de datos de la subcuadricula
        let myRows = gridDocument.getGrid().getRows();
        //obtenemos la cantidad de registro que se encuentran en la subcuadricula
        let RowCount = myRows.getLength();

        setTimeout(() => {
            myRows.forEach((value, index) => {
                //console.log(value, index);
                let gridRowData = myRows.get(index).getData();
                //console.log(gridRowData);
                //obtenmos la coleccion de cada registro de la coleccion
                let entity = gridRowData.getEntity();
                //console.log(entity);
                //obtenemos la data relaccionada a cada registro
                let entityReference = entity.getEntityReference();
                //console.log(entityReference);
                ArrayDeRegistros.push(entityReference.name);
            });
            //console.log(ArrayDeRegistros);
            ArrayDeRegistros.forEach((value, index, array) => {
                //console.log(value);
                let separador = value.split("-");
                //console.log(separador[1]);
                if (separador[1]) {
                    console.log(Number(separador[1]));
                    console.log(typeof Number(separador[1]));
                    switch (Number(separador[1])) {
                        case 1:
                            tp1++;
                            break;
                        case 2:
                            tp2++;
                            break;
                        case 3:
                            tp3++;
                            break;
                        case 4:
                            tp4++;
                            break;
                        default:
                            console.log(`documento con nombre ${value} no es valido`);
                            break;
                    }

                }

            });
            console.log(tp1, tp2, tp3, tp4);
            if ((tp1 >= 1 && tp2 >= 1 && tp3 >= 1 && tp4 >= 1) && send === 0) {
                console.log("enviamos la notificacion");
                ap_validateddocuments.setDisabled(true);

                let urlflujo = "https://prod-10.brazilsouth.logic.azure.com:443/workflows/b90cd048530145c9b01fad3df21c7f21/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=oT4eofpTbc8yJST7AWEtU_pxTjUXt3F3mZq78JdCxfM"
                let req = new XMLHttpRequest();
                let salida = JSON.stringify({
                    "send": send,
                    "url": formContext.getAttribute("ap_url_registro_entidad").getValue()
                });
                req.open("POST", urlflujo, true);
                req.setRequestHeader("Content-Type", "application/json");
                req.send(salida);


                //validamos la respuesta de la solicitud
                req.onreadystatechange = function () {

                    if (this.onreadystatechange === 4) {
                        this.onreadystatechange = null;
                    }
                    if (this.status === 200) {
                        console.log(this.status);
                        console.log("se ejecuto el flujo con exito");
                    }

                }


            } else if ((tp1 >= 0 || tp2 >= 0 || tp3 >= 0 || tp4 >= 0) && send === 1) {
                console.log("restablecemos el envio de notificaciones a 0");
                send = 0;
            }
        }, 2000);



    } catch (error) {
        console.log(error);
    }
}