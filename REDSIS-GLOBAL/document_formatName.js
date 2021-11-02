function formarNombre(executionContext) {
    try {
        let formContext = executionContext.getFormContext();
        executionContext.getFormContext();

        let ap_name = formContext.getAttribute("ap_name");
        let ap_type = formContext.getAttribute("ap_type");
        console.log("ejecutance al guardar");
        console.log(ap_type.getValue());
        console.log(ap_name.getValue());
        if (ap_name.getValue() && ap_type.getValue()) {
            console.log("entro condicion");
            console.log(`${ap_name.getValue()}-${ap_type.getValue()}`.toUpperCase());
            ap_name.setValue(`${ap_name.getValue()}-${ap_type.getValue()}`.toUpperCase());
        }
    } catch (error) {
        console.log(error);
    }
}