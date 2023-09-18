function obtenerURl(executionContext) {
    try {
        console.log("entro a remover funcion");
        let formContext = executionContext.getFormContext();

        let ap_url_registro_entidad = formContext.getAttribute("ap_url_registro_entidad");
        let url2 =
            "https://redsisdesarrollo.crm2.dynamics.com/main.aspx?appid=98b5e45f-25f0-ea11-a815-000d3ac090ba&pagetype=entityrecord&etn=salesorder&id=330aac14-e33b-45fc-9ecb-61d670f935bc";

        // https://redsisdesarrollo.crm2.dynamics.com/main.aspx?appid=98b5e45f-25f0-ea11-a815-000d3ac090ba&pagetype=entityrecord&etn=salesorder&id=330aac14-e33b-45fc-9ecb-61d670f935bc
        let idEntidad;
        let url3 = ``;
        let data;
        let entidad = formContext.data.entity.getEntityName();
        //&pagetype=entityrecord&etn=salesorder&id=
        //https://redsisdesarrollo.crm2.dynamics.com/main.aspx?appid=98b5e45f-25f0-ea11-a815-000d3ac090ba"

        if (formContext.ui.getFormType() != 1) {
            let url = Xrm.Utility.getGlobalContext().getCurrentAppUrl();
            idEntidad = formContext.data.entity.getId().slice(1, 37).toLowerCase();
            data = `${url}&pagetype=entityrecord&etn=${entidad}&id=${idEntidad}`;
<<<<<<< HEAD
=======
            
>>>>>>> 5de8aba30d5bb03e7e577f09f1b44f5cd0ca416a
            if (ap_url_registro_entidad) ap_url_registro_entidad.setValue(data);
        } else {
            console.log("Nuevo registro");
        }
    } catch (error) {
        console.log(error);
        console.log("error funcion obtenerUrl");
    }
}