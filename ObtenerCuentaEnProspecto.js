function getCuenta(exeContext) {
  let formContext = exeContext.getFormContext();

  //formContext.getAttribute('parentaccountid').addOnChange(setAccount);
  console.log(exeContext.getDepth() + " getdepth ");
  formContext.data.removeOnLoad(removeSetAccountOnLoadForm);
  formContext.getAttribute("ap_ciudad").addOnChange(addCiudad);
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
  let ap_ciudad = formContext.getAttribute("ap_ciudad");
  let ap_departamento = formContext.getAttribute("ap_departamento");
  let ap_pais = formContext.getAttribute("ap_pais");

  console.log(exeContent.getDepth() + " getdepth ");

  if (parentaccountid.getValue() != null) {
    let userID = parentaccountid.getValue()[0].id;
    console.log(userID);
    console.log(ap_ciudad.getValue());
    //$select=name&$expand=ap_Ciudad($select=contactid,fullname)"
    Xrm.WebApi
      .retrieveRecord(
        "account",
        userID,
        "?$select=name,cr5c5_nombrecomercial,websiteurl,address1_line1&$expand=ap_Ciudad($select=ap_codigociudad,ap_ciudad)"
      )
      .then(
        function success(result) {
          console.log(
            "Retrieved values: Name: " +
            result.name +
            ", Primary Contact ID: " +
            result.ap_Ciudad.ap_ciudad +
            ", Primary Contact Name: " +
            result.ap_Ciudad.ap_codigociudad
          );

          if (result.ap_Ciudad) {
            console.log(result);
            var lookupVal = new Array();
            lookupVal[0] = new Object();
            lookupVal[0].id = result.ap_Ciudad.ap_territorioid;
            lookupVal[0].name = result.ap_Ciudad.ap_ciudad;
            lookupVal[0].entityType = "ap_territorio";
            // {
            //   id: result.ap_Ciudad.ap_territorioid,
            //   name: result.ap_Ciudad.name,
            //   entityType: "ap_territorio"
            // }
            ap_ciudad.setValue(lookupVal);
          }
        },
        function (error) {
          console.log(error.message);
          // handle error conditions
        }
      );

    Xrm.WebApi
      .retrieveMultipleRecords(
        "account",
        "?$select=name,cr5c5_nombrecomercial,websiteurl,address1_line1,ap_Ciudad&$filter=accountid eq" +
        userID
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
        function (error) {
          console.log(error.message);
          // handle error conditions
        }
      );
  } else if (
    parentaccountid.getValue() === null &&
    (exeContent.getDepth() === 1 ||
      exeContent.getDepth() === 2 ||
      exeContent.getDepth() === 0)
  ) {
    companyname.setValue(String(""));
    websiteurl.setValue(String(""));
    address1_line1.setValue(String(""));
    ap_ciudad.setValue(null);
    ap_pais.setValue(null);
    ap_departamento.setValue(null);
  }
}

function removeSetAccountOnLoadForm(executeContext) {
  console.log("entro a remover la function");
  console.log(executeContext.getDepth() + " getdepth ");
  let formContext = executeContext.getFormContext();
  formContext.getAttribute("parentaccountid").addOnChange(setAccount);
}

function addCiudad(executeContext) {
  let formContext = executeContext.getFormContext();
  console.log(formContext.getAttribute("ap_ciudad").getValue());
}
