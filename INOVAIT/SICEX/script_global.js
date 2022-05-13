

var script_global = {


    obtenerURl: function(executionContext) {
        try {
           
            let formContext = executionContext.getFormContext();
    
            let invt_url_entidad = formContext.getAttribute("invt_url_entidad");
    
            
            let idEntidad;
            let url3 = ``;
            let data;
            let entidad = formContext.data.entity.getEntityName();
          
    
            if (formContext.ui.getFormType() != 1) {
                let url = Xrm.Utility.getGlobalContext().getCurrentAppUrl();
                idEntidad = formContext.data.entity.getId().slice(1, 37).toLowerCase();
                data = `${url}&pagetype=entityrecord&etn=${entidad}&id=${idEntidad}`;
                
                if (invt_url_entidad) invt_url_entidad.setValue(data);
            } else {
                //console.log("Nuevo registro");
            }
        } catch (error) {
            console.log(error);
            console.log("error funcion obtenerUrl");
        }
    }

}