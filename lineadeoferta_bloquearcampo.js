function bloquearUomid(executionContext) {

    let formContext = executionContext.getFormContext();
    formContext.getControl("uomid").setDisabled(true);

    let quoteid = formContext.getAttribute("quoteid");
    if (quoteid.getValue()) {
        formContext.getControl("uomid").setDisabled(true);
    }
}