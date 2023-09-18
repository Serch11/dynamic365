function changeStatusQuote(executionContext) {

    try {
        let formContext = executionContext.getFormContext();
        let ap_stattus_receiver = formContext.getAttribute("ap_stattus_receiver");
        let statuscode = formContext.getAttribute("statuscode");
        let shipto_line1 = formContext.getAttribute("ap_direcciondeenvio");



        if (statuscode.getValue()) {

            ap_stattus_receiver.setValue(statuscode.getValue());
            shipto_line1.setValue(String(statuscode.getValue()));
            console.log(statuscode.getValue());
            console.log(ap_stattus_receiver.getValue());
        }


    } catch (error) {
        console.log(error);
    }
}