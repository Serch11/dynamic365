function getCuenta(exeContext) {
    let formContext = exeContext.getFormContext();
    formContext.getAttribute('parentaccountid').addOnChange(setAccount);
}





function setAccount(exeContent) {
    console.clear();
    console.log("se ejecuto metodo onChange");
    //contexto del formulario
    let formContext = exeContent.getFormContext();
    let parentaccountid = formContext.getAttribute('parentaccountid');
    let companyname = formContext.getAttribute('companyname');
    let ap_actividadeconomica = formContext.getAttribute('ap_actividadeconomica');
    let websiteurl = formContext.getAttribute('websiteurl');
    let address1_line1 = formContext.getAttribute('address1_line1');


    if (parentaccountid.getValue() != null) {

        console.clear();
        let userID = parentaccountid.getValue()[0].id;
        console.log(userID);
        Xrm.WebApi.retrieveMultipleRecords('account', "?$select=name,cr5c5_nombrecomercial,websiteurl,address1_line1&$filter=accountid eq" + userID)
            .then(
                function success(result) {
                    // perform operations on on retrieved records
                    console.log(result);
                    let accountdid = result.entities[0]['accountid'];
                    companyname.setValue(String(result.entities[0]['name']));
                    websiteurl.setValue(String(result.entities[0]["websiteurl"] ? result.entities[0]["websiteurl"] : ""));
                    address1_line1.setValue(result.entities[0]["address1_line1"] ? result.entities[0]["address1_line1"] : "");
                    console.log(accountdid);
                },
                function (error) {
                    console.log(error.message);
                    // handle error conditions
                }
            );
    } else {
        companyname.setValue(String(""));
        websiteurl.setValue(String(""));
        address1_line1.setValue(String(""));
    }
}