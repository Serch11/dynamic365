function setPanel(executeContext) {
  try {
    let formContext = executeContext.getFormContext();

    let Process = formContext.data.process.getActiveProcess()
      ? formContext.data.process.getActiveProcess()
      : null;

    if (Process) {
      let cintaActiva = Process.getName();
      let cintaName = "Proceso de venta de la oportunidad";
      if (cintaName === cintaActiva) {
        let tabObj = formContext.ui.tabs.get("QUOTES");
        let identifycompetitors = formContext.getAttribute(
          "identifycompetitors"
        );
        let identifypursuitteam = formContext.getAttribute(
          "identifypursuitteam"
        );
        let ap_budgetandplanning = formContext.getAttribute(
          "ap_budgetandplanning"
        );

        setTimeout(() => {
          if (
            !identifycompetitors.getValue() ||
            !identifypursuitteam.getValue()
          ) {
            console.log("false");
            tabObj.setVisible(false);
            console.log(tabObj.getVisible());
          } else {
            tabObj.setVisible(true);
          }
        }, 5000);

        identifycompetitors.addOnChange(validar);
        identifypursuitteam.addOnChange(validar);
        ap_budgetandplanning.addOnChange(validar);
      }
    }
  } catch (error) {
    console.log(error);
  }

  // let rd_fabricanteinvolucr = formContext.getAttribute('rd_fabricanteinvolucrado');
  // let ap_sepresentoalternat = formContext.getAttribute('ap_sepresentoalternativadesolucion');
  // let ap_sehizopruebadeconc = formContext.getAttribute('ap_sehizopruebadeconcepto');
}

function validar(executeContext) {
  try {
    let formContext = executeContext.getFormContext();

    let Process = formContext.data.process.getActiveProcess()
      ? formContext.data.process.getActiveProcess()
      : null;

    if (Process) {
      let cintaActiva = Process.getName();
      let cintaName = "Proceso de venta de la oportunidad";
      console.log(cintaActiva);
      if (cintaActiva === cintaName) {
        console.log("entro a la segunda function");
        let tabObj = formContext.ui.tabs.get("QUOTES");
        let identifycompetitors = formContext.getAttribute(
          "identifycompetitors"
        );
        let identifypursuitteam = formContext.getAttribute(
          "identifypursuitteam"
        );
        let ap_budgetandplanning = formContext.getAttribute(
          "ap_budgetandplanning"
        );

        if (
          !identifycompetitors.getValue() ||
          !identifypursuitteam.getValue()
        ) {
          console.log("false");
          tabObj.setVisible(false);
          console.log(tabObj.getVisible());
        } else {
          tabObj.setVisible(true);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}
