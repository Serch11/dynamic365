function getProduct(executionContext) {
    console.log("datatatatatatattaa");
    let formContext = executionContext.getFormContext();
    let producid = formContext.getAttribute("productid");
    formContext.data.removeOnLoad(setProduct);
    formContext.getAttribute("productid").addOnChange(changeProduct);
}

function setProduct(executionContext) {
    let formContext = executionContext.getFormContext();
    let producid = formContext.getAttribute("producid");
    formContext.getAttribute("productid").addOnChange(changeProduct);
}

function changeProduct(executionContext) {
    console.log("Entro  change Producto");
    let formContext = executionContext.getFormContext();
    let producid = formContext.getAttribute("productid");
    console.log(producid.getValue());

    //?$select=ap_exhibitid,createdon,ap_porcentaje,_ap_producto_value&$filter=(statecode eq 0 and _ap_producto_value eq c646ed0b-0734-eb11-a813-000d3a88e95b)&$orderby=createdon asc

    if (producid.getValue()) {
        if (producid.getValue()[0].id) {
            let id = producid.getValue()[0].id;
            //&$filter=productid eq '" + id + "'
            Xrm.WebApi
                .retrieveMultipleRecords(
                    "ap_exhibit",
                    "?$select=ap_exhibitid,createdon,ap_porcentaje,_ap_producto_value&$filter=(statecode eq 0 and _ap_producto_value eq '" +
                    id +
                    "')&$orderby=createdon asc"
                )
                .then(
                    function success(result) {
                        // perform operations on on retrieved records
                        console.log(result);
                        console.log(result.entities);
                        if (result.entities[0]) {
                            let porcentaje = result.entities[0].ap_porcentaje;
                            console.log(result.entities[0]);
                            console.log(porcentaje);
                            if (porcentaje) {
                                let ap_exhibitpwrst = formContext.getAttribute("ap_exhibitpwrst");
                                ap_exhibitpwrst.setValue(porcentaje);
                            }
                        }

                    },
                    function (error) {
                        console.log(error.message);
                        // handle error conditions
                    }
                );
        }
    }

    if (
        !producid.getValue() &&
        (executionContext.getDepth() === 1 ||
            executionContext.getDepth() === 2 ||
            executionContext.getDepth() === 3)
    ) {
        let ap_exhibitpwrst = formContext.getAttribute("ap_exhibitpwrst");
        ap_exhibitpwrst.setValue(null);
    }
}

//cosulta mia
//"?$select=ap_porcentaje&$expand=ap_Producto($select=productnumber)"
