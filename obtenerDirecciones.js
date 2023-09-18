

function obtenerCuenta(executionContext) {

    let formContext = executionContext.getFormContext();
    let cliente = formContext.getAttribute("customerid");

    // console.log(cliente);
    // console.log(cliente.getValue());

    var rd_facturara = formContext.getAttribute('rd_facturara');
    var billto_line1 = formContext.getAttribute('billto_line1');
    var shipto_line1 = formContext.getAttribute('shipto_line1');
    var datosClieten = cliente.getValue();
    var id = cliente.getValue()[0].id;
    console.log(id);



    if (id) {
        Xrm.WebApi.retrieveRecord('account', id, "?$select=address1_line1").then(
            function success(result) {

                //console.log(result);
                if (result) {
                    rd_facturara.setValue(datosClieten ? datosClieten : null);
                    billto_line1.setValue(result.address1_line1 ? result.address1_line1 : "");
                    shipto_line1.setValue(result.address1_line1 ? result.address1_line1 : "");
                }
            },
            function (error) {
                console.log(error.message);
                // handle error conditions
            }
        );
    }

}