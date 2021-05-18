
Xrm.Utility.getGlobalContext()


function obtenerContacto(executeContext) {

    let formContext = executeContext.getFormContext();
    let mobilephone = formContext.getAttribute('mobilephone');
    let emailaddress1 = formContext.getAttribute('emailaddress1');
    let firstname = formContext.getAttribute('firstname');
    let lastname = formContext.getAttribute('lastname');
    let jobtitle = formContext.getAttribute('jobtitle');
    let parentcontactid = formContext.getAttribute('parentcontactid').getValue();


    formContext.data.removeOnLoad(pruebaFunction);
    //formContext.data.addOnLoad(pruebaFunction);
    //formContext.data.addOnLoad(setContact);

    //formContext.getAttribute('parentcontactid').addOnChange(setContact);


}

function setContact(executionContext) {

    console.log("se ejecuto metodo onChange");
    console.log(executionContext.getEventSource());
    console.log(executionContext.getDepth());
    let formContext = executionContext.getFormContext();
    let formType = formContext.ui.getFormType(); 
    //
    console.log("tipo evento");
    console.log(formType);

    let parentcontactid = formContext.getAttribute('parentcontactid');
    let mobilephone = formContext.getAttribute('mobilephone');
    let emailaddress1 = formContext.getAttribute('emailaddress1');
    let firstname = formContext.getAttribute('firstname');
    let lastname = formContext.getAttribute('lastname');
    let jobtitle = formContext.getAttribute('jobtitle');


    console.log(parentcontactid.getValue());

    if (parentcontactid.getValue() != null) {
        console.log("entro al primer si");
        let userID = parentcontactid.getValue()[0].id;
        // console.clear();
        // console.log(parentcontactid.getValue());
        // console.log(formType + "formtype");
        // console.log(userID + "ID");
        //Xrm.WebApi.online.retrieveMultipleRecords("systemuser", "?$select=med_identificacion,systemuserid&$filter=systemuserid  eq " + userid)
        Xrm.WebApi.retrieveMultipleRecords('contact', "?$select=emailaddress1,mobilephone,firstname,lastname,jobtitle&$filter=contactid eq " + userID)
            .then(function success(result) {

                mobilephone.setValue(result.entities[0]['mobilephone']);
                emailaddress1.setValue(result.entities[0]['emailaddress1']);
                firstname.setValue(result.entities[0]['firstname']);
                lastname.setValue(result.entities[0]['lastname']);
                jobtitle.setValue(result.entities[0]['jobtitle']);
            },
                function (error) {
                    console.log(error.message);
                    // handle error conditions
                }
            );
        console.log("se ejecuto el sino");
    } else if (parentcontactid.getValue() === null && executionContext.getDepth() === 1) {
        mobilephone.setValue("");
        emailaddress1.setValue("");
        firstname.setValue("");
        lastname.setValue("");
        jobtitle.setValue("");
    }
    console.log(executionContext.getDepth() === 1);
    console.log(parentcontactid.getValue() === null);
    console.log(parentcontactid.getValue() === null && executionContext.getDepth() === 1);
    // 
}
function pruebaFunction(executeContext) {
    console.log("se ejecuto pruebaFunction");
    let formContext = executeContext.getFormContext();
    formContext.getAttribute('parentcontactid').addOnChange(setContact);
}


