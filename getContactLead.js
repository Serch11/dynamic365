Xrm.Utility.getGlobalContext();

function obtenerContacto(executeContext) {
  let formContext = executeContext.getFormContext();

  console.log(executeContext.getDepth() + " contacto ");
  //removemos la funcion cuando se carguen los datos del formulario
  formContext.data.removeOnLoad(removeSetContactOnLoadData);
  //formContext.data.addOnLoad(pruebaFunction);
  //formContext.data.addOnLoad(setContact);
  //formContext.getAttribute('parentcontactid').addOnChange(setContact);
}

function setContact(executionContext) {
  //console.log(executionContext.getEventSource());
  //console.log(executionContext.getDepth());
  //let formType = formContext.ui.getFormType();

  console.log(executionContext.getDepth() + " contacto ");

  let formContext = executionContext.getFormContext();
  let parentcontactid = formContext.getAttribute("parentcontactid");
  let mobilephone = formContext.getAttribute("mobilephone");
  let emailaddress1 = formContext.getAttribute("emailaddress1");
  let firstname = formContext.getAttribute("firstname");
  let lastname = formContext.getAttribute("lastname");
  let jobtitle = formContext.getAttribute("jobtitle");

  if (parentcontactid.getValue() != null) {
    let userID = parentcontactid.getValue()[0].id;
    //Xrm.WebApi.online.retrieveMultipleRecords("systemuser", "?$select=med_identificacion,systemuserid&$filter=systemuserid  eq " + userid)
    Xrm.WebApi
      .retrieveMultipleRecords(
        "contact",
        "?$select=emailaddress1,mobilephone,firstname,lastname,jobtitle&$filter=contactid eq " +
          userID
      )
      .then(
        function success(result) {
          mobilephone.setValue(result.entities[0]["mobilephone"]);
          emailaddress1.setValue(result.entities[0]["emailaddress1"]);
          firstname.setValue(result.entities[0]["firstname"]);
          lastname.setValue(result.entities[0]["lastname"]);
          jobtitle.setValue(result.entities[0]["jobtitle"]);
        },
        function(error) {
          console.log(error.message);
          // handle error conditions
        }
      );
    console.log("se ejecuto el sino");
  } else if (
    parentcontactid.getValue() === null &&
    (executionContext.getDepth() === 1 ||
    executionContext.getDepth() === 0 ||
    executionContext.getDepth() === 2)
  ) {
    mobilephone.setValue("");
    emailaddress1.setValue("");
    firstname.setValue("");
    lastname.setValue("");
    jobtitle.setValue("");
  }
}

function removeSetContactOnLoadData(executeContext) {
  console.log("removeSetContactOnLoadData");
  console.log(executeContext.getDepth());
  let formContext = executeContext.getFormContext();
  formContext.getAttribute("parentcontactid").addOnChange(setContact);
}
