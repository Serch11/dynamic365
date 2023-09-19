function ocultarBoton(executionContext) {

    let formContext = executionContext.getFormContext();

    setTimeout(() => {
        let elemento = 
        parent.document.getElementById("quote|NoRelationship|Form|Mscrm.Form.quote.ActivateQuote100-button");


        if (elemento) {
            console.log(elemento);
        }
        console.log("No existe");

    }, 10000)



}