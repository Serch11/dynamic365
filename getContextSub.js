function getSubGrid(executeContext) {
  
  let formContext = executeContext.getFormContext();
  let gridContext = formContext.getControl("Competitors");
  let GridPursuit_Team = formContext.getControl("Pursuit_Team");
  let identifycompetitors = formContext.getAttribute("identifycompetitors");
  let identifypursuitteam = formContext.getAttribute("identifypursuitteam");

  identifycompetitors.addOnChange(Cambio);

  setTimeout(() => {
    console.clear();
    //console.log(gridContext.getGrid());
    //console.log(gridContext.getGrid().getRows());
    //console.log(gridContext.getGrid().getSelectedRows());
    //console.log(gridContext.getGrid().getRows().getLength());
    console.log(GridPursuit_Team.getGrid().getTotalRecordCount());
    console.log(gridContext.getGrid().getTotalRecordCount());

    if (gridContext.getGrid().getTotalRecordCount() > 0) {
      identifycompetitors.setValue(true);
    }
    if (GridPursuit_Team.getGrid().getTotalRecordCount() > 0) {
      identifypursuitteam.setValue(true);
    } else {
      identifypursuitteam.setValue(false);
    }

    gridContext.addOnLoad(setCompetidores);
    GridPursuit_Team.addOnLoad(setEquipoVenta);
  }, 5000);
}

function Cambio(executeContext) {
  let formContext = executeContext.getFormContext();
  console.clear();
  console.log(formContext.getAttribute("identifycompetitors").getValue());
  console.log(formContext.getAttribute("identifypursuitteam").getValue());
}

function setCompetidores(executeContext) {
  console.log("se ejecuto addOnLoad grid context");

  let formContext = executeContext.getFormContext();
  let gridCompetidores = formContext.getControl("Competitors");
  let identifycompetitors = formContext.getAttribute("identifycompetitors");
  console.log(gridCompetidores.getGrid().getTotalRecordCount());
  if (gridCompetidores.getGrid().getTotalRecordCount() > 0) {
    identifycompetitors.setValue(true);
  } else {
    identifycompetitors.setValue(false);
  }
}

function setEquipoVenta(executeContext) {
  console.log("se ejecuto addOnLoad grid context equipo venta");

  let formContext = executeContext.getFormContext();
  let GridPursuit_Team = formContext.getControl("Pursuit_Team");
  let Pursuit_Team = formContext.getAttribute("identifypursuitteam");
  console.log(GridPursuit_Team.getGrid().getTotalRecordCount());
  if (GridPursuit_Team.getGrid().getTotalRecordCount() > 0) {
    Pursuit_Team.setValue(true);
  } else {
    Pursuit_Team.setValue(false);
  }
}
