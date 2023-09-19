function disableFiel(executionContext) {



    let formContext = executionContext.getFormContext();

    if (formContext.getAttribute('subject').getValue()) {
        formContext.getControl('subject').setDisabled(true);
    } else {
        formContext.getControl('subject').setDisabled(false);
    }
}





function setFullName(executeContext) {

    let formContext = executeContext.getFormContext();

    let fullname = formContext.getAttribute('fullname');
    let rd_numeroprospecto = formContext.getAttribute('rd_numeroprospecto');
    console.clear();
    console.log(Xrm.Page.data.entity);

    if (rd_numeroprospecto.getValue != null && fullname.getValue() != null) {
        let nuevoName = `${rd_numeroprospecto.getValue()}-${fullname.getValue()}`;
        console.log(nuevoName);
        fullname.setValue(String(nuevoName));
        formContext.data.entity.save();
    }
}




