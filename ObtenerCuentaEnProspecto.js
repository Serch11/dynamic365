function getCuenta(exeContext) {
  let formContext = exeContext.getFormContext();

  //formContext.getAttribute('parentaccountid').addOnChange(setAccount);
  console.log(exeContext.getDepth());
  formContext.data.removeOnLoad(removeSetAccountOnLoadForm);
}

function setAccount(exeContent) {
  console.log("se ejecuto metodo onChange");
  //contexto del formulario
  let formContext = exeContent.getFormContext();
  let parentaccountid = formContext.getAttribute("parentaccountid");
  let companyname = formContext.getAttribute("companyname");
  let ap_actividadeconomica = formContext.getAttribute("ap_actividadeconomica");
  let websiteurl = formContext.getAttribute("websiteurl");
  let address1_line1 = formContext.getAttribute("address1_line1");

  console.log(exeContent.getDepth());

  if (parentaccountid.getValue() != null) {
    let userID = parentaccountid.getValue()[0].id;
    console.log(userID);
    Xrm.WebApi
      .retriveRecord(
        "account",
        userID,
        "?$select=name,cr5c5_nombrecomercial,websiteurl,address1_line1&$filter=accountid"
      )
      .then(
        function success(result) {
          // perform operations on on retrieved records
          console.log(result);
          let accountdid = result.entities[0]["accountid"];
          companyname.setValue(String(result.entities[0]["name"]));
          websiteurl.setValue(
            String(
              result.entities[0]["websiteurl"]
                ? result.entities[0]["websiteurl"]
                : ""
            )
          );
          address1_line1.setValue(
            result.entities[0]["address1_line1"]
              ? result.entities[0]["address1_line1"]
              : ""
          );
          console.log(accountdid);
        },
        function(error) {
          console.log(error.message);
          // handle error conditions
        }
      );
  } else if (
    parentaccountid.getValue() === null &&
    exeContent.getDepth() === 0
  ) {
    companyname.setValue(String(""));
    websiteurl.setValue(String(""));
    address1_line1.setValue(String(""));
  }
}

function removeSetAccountOnLoadForm(executeContext) {
  console.log("entro a remover la function");
  console.log(executeContext.getDepth());
  let formContext = executeContext.getFormContext();
  formContext.getAttribute("parentaccountid").addOnChange(setAccount);
}
