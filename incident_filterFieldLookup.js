function filterField(executionContext) {
  try {
    let formContext = executionContext.getFormContext();

    formContext.getControl("entitlementid").addPreSearch(filtrado);

    console.log("entro en la funcion filterfield");
  } catch (error) {
    console.log(error);
    console.log("error en la function  filterField ->>>>>>");
  }
}

function filtrado(executionContext) {
  try {
    let formContext = executionContext.getFormContext();

    let fetch =
      '<filter type="and"><condition attribute="rd_tipodederecho" operator="eq" uiname="Convenio de soporte" uitype="rd_tipodederecho" value="{DAD1A5D8-CB0C-EC11-B6E6-00224836CCC8}"/> <condition attribute="customerid" operator="eq" uiname="OLIMPICA S.A." uitype="account" value="{6EDCD8A5-9520-EC11-B6E6-002248375E4F}" /> </filter>';

    var entityName = "account";
    var filter =
      '<filter type="and"><condition attribute="address1_city" operator="eq" value="Redmond" /></filter>';

    formContext.getControl("entitlementid").addCustomFilter(fetch);
    console.log("aplico el filtro");
  } catch (error) {
    console.log(error);
    console.log("error funcion filtrado");
  }
}
