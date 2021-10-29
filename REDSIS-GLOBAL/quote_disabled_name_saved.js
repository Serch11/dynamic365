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
        id: "556053DE-EA24-EC11-B6E6-00224837257C",
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
