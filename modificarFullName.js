function getName(executionContext) {

    let formContext = executionContext.getFormContext();


    let fullname = formContext.getAttribute('fullname');
    let name = formContext.getAttribute('firstname');
    let lastname = formContext.getAttribute('lastname');


    console.clear();


    fullname.setValue(String(name));

    if (fullname.getValue()) {
        console.log(fullname.getValue());
        console.log(name.getValue());
        console.log(lastname.getValue());
    }

    // 
}