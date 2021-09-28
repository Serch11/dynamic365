function loadFunctionQuotes(executionContext) {

    try {
        disabledNameQuotes(executionContext);
    } catch (error) {
        console.log(error);
        console.log("loadFunctionQuotes")
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