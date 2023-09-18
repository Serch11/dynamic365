

function getValueDivisaOnLoad(executionContext) {

    let formContext = executionContext.getFormContext();
    let transactioncurrencyid = formContext.getAttribute("transactioncurrencyid");
    let header_estimatedvalue_base = formContext.getAttribute("header_estimatedvalue_base");
    let exchangerate = formContext.getAttribute("exchangerate");


    try {


        if (transactioncurrencyid.getValue()[0].name === "Peso colombiano") {

            formContext.getControl('header_estimatedvalue_base').setVisible(false);
            formContext.getControl("exchangerate").setVisible(false);
        }

       

        if (transactioncurrencyid.getValue()[0].name === "US Dollar") {
            formContext.getControl('header_estimatedvalue_base').setVisible(true);
            formContext.getControl("exchangerate").setVisible(true);
        }

        if (transactioncurrencyid.getValue()[0].name === "USD Dollar") {
            formContext.getControl('header_estimatedvalue_base').setVisible(true);
            formContext.getControl("exchangerate").setVisible(true);
        }
        if (transactioncurrencyid.getValue()[0].name === "Peso Colombiano") {

            formContext.getControl('header_estimatedvalue_base').setVisible(false);
            formContext.getControl("exchangerate").setVisible(false);
        }


    } catch (error) {
        console.log(error);
    }

}


function ocultarCampos(executionContext) {

    let formContext = executionContext.getFormContext();
    let header_estimatedvalue_base = formContext.getAttribute("header_estimatedvalue_base");
    let transactioncurrencyid = formContext.getAttribute("transactioncurrencyid");
    let exchangerate = formContext.getAttribute("exchangerate");



    try {



        if (transactioncurrencyid.getValue()[0].name === "Peso colombiano") {

            formContext.getControl('header_estimatedvalue_base').setVisible(false);
            formContext.getControl("exchangerate").setVisible(false);
        }

        if (transactioncurrencyid.getValue()[0].name === "US Dollar") {
            formContext.getControl('header_estimatedvalue_base').setVisible(true);
            formContext.getControl("exchangerate").setVisible(true);
        }

        if (transactioncurrencyid.getValue()[0].name === "USD Dollar") {
            formContext.getControl('header_estimatedvalue_base').setVisible(true);
            formContext.getControl("exchangerate").setVisible(true);
        }

        if (transactioncurrencyid.getValue()[0].name === "Peso Colombiano") {

            formContext.getControl('header_estimatedvalue_base').setVisible(false);
            formContext.getControl("exchangerate").setVisible(false);
        }



    } catch (error) {
        console.log(error);
    }
}