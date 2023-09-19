function getCiudad(executionContext) {


    try {


        let formContext = executionContext.getFormContext();
        let ap_ciudad = formContext.getAttribute("ap_ciudad");
        let ap_departamento = formContext.getAttribute("ap_departamento");
        let ap_pais = formContext.getAttribute("ap_pais");


        if (ap_ciudad.getValue()) {

            let idCiudad = ap_ciudad.getValue()[0].id;
            let entidad = ap_ciudad.getValue()[0].entityType;

            Xrm.WebApi.retrieveRecord(entidad, idCiudad).then(
                function success(result) {

                    if (result) {

                        ap_departamento.setValue(result.ap_departamento ? result.ap_departamento : "");
                        ap_pais.setValue(result.ap_pais ? result.ap_pais : "");

                        //console.log(result);
                    }

                },
                function (error) {
                    console.log(error.message);
                    // handle error conditions
                }
            );


        } else {
            ap_pais.setValue("");
            ap_departamento.setValue("");
        }

    } catch (error) {
        console.log(error);
    }

}


async function consultaTerritorio(entidad, id) {
    return await Xrm.WebApi.retrieveRecord(entidad, id);
}