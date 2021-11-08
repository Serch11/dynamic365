/** 
 * taks
 * nombre con un numero de consecutivo
 * agregar campos en la vista de create on y modified 
 * notificacion en la parte superior cuando los documentos esten listos.
 * 
 * 
 *  tipos de documentos para RMX
    
    ESTADOS FINANCIEROS A 31 DE DIC DEL AÑO INMEDIATAMENTE ANTERIOR (AUDITADOS)
    ESTADOS FINANCIEROS DEL AÑO EN CURSO
    ACTA CONSTITUTIVA
    OPINIÓN DE CUMPLIMIENTOS
    CONSTANCIA DE SITUACIÓN FISCAL NO MAYOR A 30 DÍAS
    COMPROBANTE DE DOMICILIO FISCAL
    CARÁTULA DE ESTADO DE CUENTA BANCARIO 

 * 
*/

function loadSubGrid(executionContext) {
    try {

        let formContext = executionContext.getFormContext();
        let gridDocument = formContext.getControl("document_view");

        console.log("cargando funcion loadSubgrid");
        validaciones(executionContext);
        gridDocument.addOnLoad(documentosCargados);
    } catch (error) {
        console.log(error);
    }
}


//funcion para 
function validaciones(executionContext) {
    try {

        let formContext = executionContext.getFormContext();
        let ap_validate_send = formContext.getAttribute("ap_validate_send");
        let ap_validateddocuments = formContext.getControl("ap_validateddocuments");
        if (ap_validate_send.getValue() === 1) {
            ap_validateddocuments.setDisabled(false);
            formContext.ui.setFormNotification('DOCUMENTS ARE READY TO BE REVIEWED BY THE ADMINISTRATIVE AREA. A NOTICE HAS BEEN SENT', 'WARNING', 'notification_unique_id');

        } else {
            formContext.ui.clearFormNotification('notification_unique_id');
            ap_validateddocuments.setDisabled(true);
        }
    } catch (error) {

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

        //obtengo el contexto del formulario
        let formContext = executionContext.getFormContext();
        let validate_send = formContext.getAttribute("ap_validate_send");
        let ap_validateddocuments = formContext.getControl("ap_validateddocuments");
        let name = formContext.getAttribute("name");
        //ap_validateddocuments.getAttribute().setValue(false);
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
            console.log(`validate send ${validate_send.getValue()}`);
            if ((tp1 >= 1 && tp2 >= 1 && tp3 >= 1 && tp4 >= 1) && (validate_send.getValue() === 0 || validate_send.getValue() === null)) {
                console.log("enviamos la notificacion");

                let urlflujo = "https://prod-06.brazilsouth.logic.azure.com:443/workflows/31996b6eb7b9400ebfbeb38d54689c5b/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=R1zlR6HJsNihYFodTXgI76keC7D36YXON2_C_7suHSA"
                let req = new XMLHttpRequest();
                let salida = JSON.stringify({
                    "accountname": name.getValue(),
                    "send": validate_send.getValue(),
                    "url": formContext.getAttribute("ap_url_registro_entidad").getValue()
                });
                req.open("POST", urlflujo, true);
                req.setRequestHeader("Content-Type", "application/json");
                req.send(salida);

                validate_send.setValue(1);

                //validamos la respuesta de la solicitud
                req.onreadystatechange = function () {

                    if (this.onreadystatechange === 4) {
                        this.onreadystatechange = null;
                    }
                    if (this.status === 200) {
                        console.log("todook")
                    }
                }
                validaciones(executionContext);


            } else if ((tp1 === 0 || tp2 === 0 || tp3 === 0 || tp4 === 0) && validate_send.getValue() === 1) {
                console.log("restablecemos el envio de notificaciones a 0");
                validate_send.setValue(0);

                validaciones(executionContext);

            }
        }, 1000);
    } catch (error) {
        console.log(error);
    }
}