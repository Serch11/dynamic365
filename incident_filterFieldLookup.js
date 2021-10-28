function filterField(executionContext) {
  try {
    let formContext = executionContext.getFormContext();

    let customerid = formContext.getControl("customerid");
    let ap_tipodederecho = formContext.getControl("ap_tipodederecho");
    let entitlementid = formContext.getControl("entitlementid");

    if (customerid)
      customerid.getAttribute().addOnChange(validarCamposDocumentados);

    if (ap_tipodederecho)
      ap_tipodederecho.getAttribute().addOnChange(validarCamposDocumentados);

    //formContext.getControl("entitlementid").addPreSearch(filtrado);
  } catch (error) {
    console.log(error);
    console.log("error en la function  filterField ->>>>>>");
  }
}

function validarCamposDocumentados(executionContext) {
  try {
    console.log("Entro en validar campos documentados");
    let formContext = executionContext.getFormContext();

    if (
      formContext.getAttribute("customerid").getValue() &&
      formContext.getAttribute("ap_tipodederecho").getValue()
    ) {
      formContext.getControl("entitlementid").addPreSearch(filtrado);
    } else {
      console.log("no tienen datos");
    }
  } catch (error) {
    console.log(error);
    console.log("error funcion validarCamposDocumentados");
  }
}

function filtrado(executionContext) {
  try {
    let formContext = executionContext.getFormContext();

    let fetch =
      '<filter type="and"><condition attribute="rd_tipodederecho" operator="eq" uiname=" ' +
      formContext.getAttribute("ap_tipodederecho").getValue()[0].name +
      ' " uitype="rd_tipodederecho" value="   ' +
      formContext.getAttribute("ap_tipodederecho").getValue()[0].id +
      ' "/> <condition attribute="customerid" operator="eq" uiname=" ' +
      formContext.getAttribute("customerid").getValue()[0].name +
      '  " uitype="account" value=" ' +
      formContext.getAttribute("customerid").getValue()[0].id +
      ' " /> </filter>';

    formContext.getControl("entitlementid").addCustomFilter(fetch);
    console.log("aplico el filtro");
  } catch (error) {
    console.log(error);
    console.log("error funcion filtrado");
  }
}
/*
'<filter type="and"><condition attribute="rd_tipodederecho" operator="eq" uiname="Convenio de soporte" uitype="rd_tipodederecho" value="{DAD1A5D8-CB0C-EC11-B6E6-00224836CCC8}"/> <condition attribute="customerid" operator="eq" uiname="OLIMPICA S.A." uitype="account" value="{6EDCD8A5-9520-EC11-B6E6-002248375E4F}" /> </filter>';



?$select=name,createdon,entitytype,entitlementid&$filter=(_rd_tipodederecho_value%20eq%20dad1a5d8-cb0c-ec11-b6e6-00224836ccc8%20and%20_customerid_value%20eq%206edcd8a5-9520-ec11-b6e6-002248375e4f)&$orderby=name%20asc


*/
