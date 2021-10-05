function loadFunctionQuotes(executionContext) {
  try {
    disabledNameQuotes(executionContext);
    quemarCPTquote(executionContext);
  } catch (error) {
    console.log(error);
    console.log("loadFunctionQuotes");
  }
}

function disabledNameQuotes(executionContext) {
  try {
    let formContext = executionContext.getFormContext();
    let name = formContext.getControl("name");

    if (formContext.ui.getFormType() != 1) {
      name.setDisabled(true);
    }
  } catch (error) {
    console.log(error);
    console.log("disabledNameQuotes");
  }
}

function quemarCPTquote(executionContext) {
  try {
    let formContext = executionContext.getFormContext();
    let ap_inconterm = formContext.getAttribute("ap_iconterm");
    let CPT = [
      {
        entityType: "ap_inconterm",
        id: "DCC93061-F41B-EC11-B6E7-000D3A886E71",
        name: "CPT",
      },
    ];
    if (formContext.ui.getFormType() === 1) {
      if (ap_inconterm) ap_inconterm.setValue(CPT);
    }
  } catch (error) {
    console.log("quemarCPTquote error funcion");
  }
}
