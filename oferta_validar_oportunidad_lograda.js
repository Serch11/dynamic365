async function validarOportunidad(executionContext) {



    //statuscode 
    /*
 
    1 en curso
    2 retenida
    3 generar pedido 
    4 cliente no ejecuto
    5 por competencia
    

    */

    let formContext = executionContext.getFormContext();

    try {


        let idOferta = formContext.data.entity.getId();
        let resultOferta = await consultarDatos("quote", idOferta);
        if (resultOferta) {

            let idOportunidad = resultOferta._ap_oportunidadid_value;

            if (idOportunidad) {
                let resultOportunidad = await consultarDatos("opportunity", idOportunidad);
                let estadoOportunidad = resultOportunidad.statuscode;
                if (estadoOportunidad != 3) {
                    formContext.ui.setFormNotification('NECESITA COMPLETAR LA OPORTUNIDAD COMO LOGRADA PARA PODER GENERAR EL PEDIDO', 'ERROR', '1');
                }
            }

        }

    } catch (error) {
        console.log(error)
        console.log("error en el script oferta_validar_oportunidad_lograda");
    }

}



async function consultarDatos(entidad, id) {

    try {
        return await Xrm.WebApi.retrieveRecord(entidad, id);
    } catch (error) {
        console.log(error);

    }

}