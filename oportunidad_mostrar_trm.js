function mostrarTrm(executionContext){
    try {
        
        let formContext = executionContext.getFormContext();
        
        let ap_trm = formContext.getControl("ap_trm");
        let transactioncurrencyid = formContext.getAttribute("transactioncurrencyid");
        //console.log(transactioncurrencyid.getValue());
        Xrm.WebApi.retrieveRecord(transactioncurrencyid.getValue()[0].entityType, transactioncurrencyid.getValue()[0].id,"?$select=exchangerate").then(
            function success(result) {
                // perform operations on record retrieval
                //console.log(result);
                if( result ){
                    ap_trm.getAttribute().setValue( 1/Number(result.exchangerate));
                }
            },
            function (error) {
                console.log(error.message);
                // handle error conditions
            }
        );
    } catch (error) {
        console.log("ERROR  FUNCION MOSTRAR TRM ASIGNADA A LA ESCUCHA DEL CAMPO TRANSACTIONCURRENCY");
    }
}


