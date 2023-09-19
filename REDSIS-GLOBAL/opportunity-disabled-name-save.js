async function loadFunctionOpportunitys(executionContext) {

    try {
        disableNameOpportunity(executionContext);
    } catch (error) {
        console.log(error);
        console.log("loadFunctionOpportunity")
    }
}


function disableNameOpportunity(executionContext) {


    try {
        let formContext = executionContext.getFormContext();
        let name = formContext.getControl("name");

        if (formContext.ui.getFormType() != 1) {
            name.setDisabled(true);
        }
    } catch (error) {
        console.log(error);
        console.log("opportunity-disabled-name-save");
    }
}


