async function obtenerTrm(executionContext) {

    let formContext = executionContext.getFormContext();
    let transactioncurrencyid = formContext.getAttribute("transactioncurrencyid");
    let ap_trm = formContext.getAttribute("ap_trm");
    //formContext.getAttribute("transactioncurrencyid").addOnChange(obtenerDivisa);


    try {

        formContext.data.removeOnLoad(removerFuncion);
        if (transactioncurrencyid.getValue()) {

            if ((transactioncurrencyid.getValue()[0].name === "US Dollar") && (ap_trm.getValue() === null || undefined)) {

                let result = await consultaTRMUS();

                if (result) {
                    if (result.entities[0].exchangerate) {
                        let trm = result.entities[0].exchangerate;
                        formContext.getControl("ap_trm").setVisible(true);
                        ap_trm.setValue(trm);
                        // perform additional operations on retrieved records
                    }
                }
            }
            if ((transactioncurrencyid.getValue()[0].name === "Peso Colombiano") && (ap_trm.getValue() === null || undefined)) {

                let result = await consultaTRMCOP("Peso Colombiano");

                if (result) {
                    if (result.entities[0].exchangerate) {
                        let trm = result.entities[0].exchangerate;
                        formContext.getControl("ap_trm").setVisible(true);
                        ap_trm.setValue(trm);
                        // perform additional operations on retrieved records
                    }
                }
            }
            //Peso colombiano
            if ((transactioncurrencyid.getValue()[0].name === "Peso colombiano") && (ap_trm.getValue() === null || undefined)) {

                let result = await consultaTRMCOP("Peso colombiano");

                if (result) {
                    if (result.entities[0].exchangerate) {
                        let trm = result.entities[0].exchangerate;
                        formContext.getControl("ap_trm").setVisible(true);
                        ap_trm.setValue(trm);
                        // perform additional operations on retrieved records
                    }
                }
            }
        }

    } catch (error) {
        console.log(error);
        console.log("Error en el script divisa.js")
    }

}

function obtenerDivisa(executeContext) {

    try {
        let formContext = executeContext.getFormContext();
        let transactioncurrencyid = formContext.getAttribute("transactioncurrencyid");
        var ap_trm = formContext.getAttribute("ap_trm");
        console.log(formContext.ui.formSelector.getCurrentItem());

        if (transactioncurrencyid.getValue()) {
            if (
                transactioncurrencyid.getValue()[0].name === "US Dollar" &&
                (executeContext.getDepth() === 1 ||
                    executeContext.getDepth() === 2 ||
                    executeContext.getDepth() === 0)
            ) {
                console.log("Entro a dollar")
                Xrm.WebApi
                    .retrieveMultipleRecords(
                        "transactioncurrency",
                        "?$select=exchangerate&$filter=currencyname eq 'US Dollar'"
                    )
                    .then(
                        function success(result) {
                            console.log(result);
                            if (result.entities[0].exchangerate) {
                                let trm = result.entities[0].exchangerate;
                                formContext.getControl("ap_trm").setVisible(true);
                                ap_trm.setValue(trm);
                                // perform additional operations on retrieved records
                            }
                        },
                        function (error) {
                            console.log(error.message);
                            // handle error conditions
                        }
                    );
            }

            //Peso Colombiano
            if (transactioncurrencyid.getValue()[0].name === "Peso Colombiano" && (executeContext.getDepth() === 1 ||
                executeContext.getDepth() === 2 ||
                executeContext.getDepth() === 0)) {
                formContext.getControl("ap_trm").setVisible(false);
                Xrm.WebApi
                    .retrieveMultipleRecords(
                        "transactioncurrency",
                        "?$select=exchangerate&$filter=currencyname eq 'Peso colombiano'"
                    )
                    .then(
                        function success(result) {
                            console.log(result);
                            if (result.entities[0].exchangerate) {
                                let trm = result.entities[0].exchangerate;
                                formContext.getControl("ap_trm").setVisible(true);
                                ap_trm.setValue(trm);
                                // perform additional operations on retrieved records
                            }
                        },
                        function (error) {
                            console.log(error.message);
                            // handle error conditions
                        }
                    );
            }
            if ((transactioncurrencyid.getValue()[0].name === "Peso colombiano") && (executeContext.getDepth() === 1 ||
                executeContext.getDepth() === 2 ||
                executeContext.getDepth() === 0)) {
                //formContext.getControl("ap_trm").setVisible(false);
                console.log("Entro a pesos");
                Xrm.WebApi
                    .retrieveMultipleRecords(
                        "transactioncurrency",
                        "?$select=exchangerate&$filter=currencyname eq 'Peso colombiano'"
                    )
                    .then(
                        function success(result) {
                            console.log(result);
                            if (result.entities[0].exchangerate) {
                                let trm = result.entities[0].exchangerate;
                                formContext.getControl("ap_trm").setVisible(true);
                                ap_trm.setValue(trm);
                                // perform additional operations on retrieved records
                            }
                        },
                        function (error) {
                            console.log(error.message);
                            // handle error conditions
                        }
                    );
            }

            if (transactioncurrencyid.getValue()[0].name === "Colombian Peso" && (executeContext.getDepth() === 1 ||
                executeContext.getDepth() === 2 ||
                executeContext.getDepth() === 0)) {

                //formContext.getControl("ap_trm").setVisible(false);
                ap_trm.setValue(null);
                ap_trm.setValue(1);
            }
            if (transactioncurrencyid.getValue()[0].name === "Peso") {

                //formContext.getControl("ap_trm").setVisible(false);
                ap_trm.setValue(null);
                ap_trm.setValue(1);
            }


        }
    } catch (error) {
        console.log(error);
        console.log("Error en el script de divisa.js entidad oferta")
    }


}

function removerFuncion(executeContext) {
    let formContext = executeContext.getFormContext();
    console.log("estado");
    console.log(formContext.ui.process.getDisplayState());
    formContext.getAttribute("transactioncurrencyid").addOnChange(obtenerDivisa);
}


async function consultaTRMUS() {

    try {
        return Xrm.WebApi
            .retrieveMultipleRecords(
                "transactioncurrency",
                "?$select=exchangerate&$filter=currencyname eq 'US Dollar'"
            );
    } catch (error) {
        console.log(error);
    }

}

async function consultaTRMCOP(trm) {

    try {
        return await Xrm.WebApi
            .retrieveMultipleRecords(
                "transactioncurrency",
                "?$select=exchangerate&$filter=currencyname eq '" + trm + "'"
            );
    } catch (error) {
        console.log(error)
    }

}
