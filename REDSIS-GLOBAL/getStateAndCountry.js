function getStateAndCountry(executionContext) {


    try {
        let formContext = executionContext.getFormContext();
        let ap_city = formContext.getAttribute("ap_city");
        let ap_stateprovince = formContext.getAttribute("ap_stateprovince");
        let ap_country = formContext.getAttribute("ap_country");

        let address1_stateorprovince = formContext.getAttribute("address1_stateorprovince");
        let address1_country = formContext.getAttribute("address1_country");


        if (ap_city.getValue()) {

            let ID = ap_city.getValue()[0].id;
            Xrm.WebApi.retrieveRecord('ap_territories', ID).then(
                function success(result) {
                    if (result) {
                        //console.log(result);
                        address1_stateorprovince.setValue(result.ap_estado ? result.ap_estado : "");
                        address1_country.setValue(result.ap_pais ? result.ap_pais : "");
                    }
                },
                function (error) {
                    console.log(error.message);
                    // handle error conditions
                }
            );
        } else if (!ap_city.getValue()) {
            address1_stateorprovince.setValue(null);
            address1_country.setValue(null);
        }
    } catch (error) {
        console.log(error);
        console.log("error funcion getStateAndCountry");
    }
}