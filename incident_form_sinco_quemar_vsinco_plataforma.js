function quemarValorSincoEnPlataforma(exeuctionContext) {
  //getFormType()
  // 0 = undefined
  // 1 = Create
  // 2 = update
  // 3 = read only
  // 4 = disabled
  // 6 = bulk edit

  try {
    let formContext = exeuctionContext.getFormContext();
    let ap_plataforma = formContext.getAttribute("ap_plataforma");

    let FORM_SINCO = "Caso SINCO";
    let FORM_CAS = "Caso CAS"
    let SINCO = [
      {
        entityType: "ap_plataforma",
        id: "56659B5A-DF81-EB11-B1AB-000D3AC090BA",
        name: "SINCO",
      },
    ];
    console.log(formContext.ui.formSelector.getCurrentItem().getLabel());
    if (
      FORM_SINCO === formContext.ui.formSelector.getCurrentItem().getLabel() || FORM_CAS === formContext.ui.formSelector.getCurrentItem().getLabel()
    ) {
      if (formContext.ui.getFormType() === 1) {
        ap_plataforma.setValue(SINCO);
      }
    }
  } catch (error) {
    console.log(error);
  }
}
