function ocultarOpcionesCampoOrigen(executionContext) {


    try {
        let formContext = executionContext.getFormContext();
        let caseorigincode = formContext.getControl("caseorigincode");

        if (caseorigincode) {
            caseorigincode.removeOption(2483);
            caseorigincode.removeOption(3986);
        }
    } catch (error) {
        console.log("error script ocultarOpcionesCampoOrigin");
    }

}