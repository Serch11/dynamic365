function getStateAndCountry(executionContext) {


    try {
        let formContext = executionContext.getFormContext();
        let ap_city = formContext.getAttribute("ap_city");
        let ap_stateprovince = formContext.getAttribute("ap_stateprovince");
        let ap_country = formContext.getAttribute("ap_country");


        if (ap_city.getValue()) {

            let ID = ap_city.getValue()[0].id;
            Xrm.WebApi.retrieveRecord('ap_territories', ID).then(
                function success(result) {
                    if (result) {
                        //console.log(result);
                        ap_stateprovince.setValue(result.ap_estado ? result.ap_estado : "");
                        ap_country.setValue(result.ap_pais ? result.ap_pais : "");
                    }
                },
                function (error) {
                    console.log(error.message);
                    // handle error conditions
                }
            );
        } else if (!ap_city.getValue()) {
            ap_stateprovince.setValue(null);
            ap_country.setValue(null);
        }
    } catch (error) {
        console.log(error);
        console.log("error funcion getStateAndCountry");
    }
}