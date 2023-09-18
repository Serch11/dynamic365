function disabledField (executionContext ) {

    let formContext = executionContext.getFormContext();

    if( formContext.getAttribute('name').getValue()){
        formContext.getControl('name').setDisabled(true);
    }else{
        formContext.getControl('name').setDisabled(false);
    }
}