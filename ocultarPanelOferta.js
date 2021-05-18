function setPanel(executeContext) {


    let formContext = executeContext.getFormContext();

    let tabObj = formContext.ui.tabs.get('QUOTES');

    let identifycompetitors = formContext.getAttribute('identifycompetitors');
    let identifypursuitteam = formContext.getAttribute('identifypursuitteam');
    let ap_budgetandplanning = formContext.getAttribute('ap_budgetandplanning');


    console.clear();
    console.log("entrando set panel");
    console.log(tabObj);
    console.log(identifycompetitors.getValue());
    console.log(identifypursuitteam.getValue());
    console.log(ap_budgetandplanning.getValue());
    console.log(!identifycompetitors.getValue() || !identifypursuitteam.getValue() || !ap_budgetandplanning.getValue());



    identifycompetitors.addOnChange(validar);
    identifypursuitteam.addOnChange(validar);
    ap_budgetandplanning.addOnChange(validar);

    if (!identifycompetitors.getValue() || !identifypursuitteam.getValue() || !ap_budgetandplanning.getValue()) {
        console.log("false");
        tabObj.setVisible(false);
        console.log(tabObj.getVisible());
    } else {
        tabObj.setVisible(true);
    }

    // let rd_fabricanteinvolucr = formContext.getAttribute('rd_fabricanteinvolucrado');
    // let ap_sepresentoalternat = formContext.getAttribute('ap_sepresentoalternativadesolucion');
    // let ap_sehizopruebadeconc = formContext.getAttribute('ap_sehizopruebadeconcepto');
}




function validar(executeContext) {

    let formContext = executeContext.getFormContext();

    console.log("entro a la segunda function");
    let tabObj = formContext.ui.tabs.get('QUOTES');
    let identifycompetitors = formContext.getAttribute('identifycompetitors');
    let identifypursuitteam = formContext.getAttribute('identifypursuitteam');
    let ap_budgetandplanning = formContext.getAttribute('ap_budgetandplanning');

    if (!identifycompetitors.getValue() || !identifypursuitteam.getValue() || !ap_budgetandplanning.getValue()) {
        console.log("false");
        tabObj.setVisible(false);
        console.log(tabObj.getVisible());
    } else {
        tabObj.setVisible(true);
    }
}