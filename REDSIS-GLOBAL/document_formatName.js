function formarNombre(executionContext) {
    try {

        let formContext = executionContext.getFormContext();
        executionContext.getFormContext();

        let ap_name = formContext.getAttribute("ap_name");
        let ap_type = formContext.getAttribute("ap_type");


        ap_name.setValue(String(Math.floor(Math.random() * 10000)));
<<<<<<< HEAD
        if (ap_name.getValue() && ap_type.getValue()) {
=======
       
        if (ap_name.getValue() && ap_type.getValue()) {
          
>>>>>>> 2b55f50d48210307062009ce2a338dd47b3afc1d
            ap_name.setValue(`${ap_name.getValue()}-${ap_type.getValue()}`.toUpperCase());
        }
    } catch (error) {
        console.log(error);
    }
}