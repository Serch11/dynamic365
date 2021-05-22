function setQuequeandFrom(executionContext) {
  var CRM_FORM_TYPE_CREATE = 1;
  var CRM_FORM_TYPE_UPDATE = 2;
  var Context = executionContext.getFormContext();
  if (Xrm.Page.ui.getFormType() == CRM_FORM_TYPE_CREATE) {
    if (Xrm.Page.getAttribute("regardingobjectid").getValue() != null) {
      var casoId = Context.getAttribute("regardingobjectid").getValue()[0].id;
      var TypeRegarding = Context.getAttribute(
        "regardingobjectid"
      ).getValue()[0].entityType;
      //var casoId = Xrm.Page.getAttribute("regardingobjectid").getValue()[0].id;
      //var TypeRegarding = Xrm.Page.getAttribute("regardingobjectid").getValue()[0].entityType;
      if (TypeRegarding == "incident") {
        Xrm.WebApi.online
          .retrieveMultipleRecords(
            "incident",
            "?$select=incidentid,_ownerid_value,_ap_clientemarcaid_value,emailaddress,title&$filter=incidentid eq" +
              casoId
          )
          .then(
            function success(results) {
              for (var c = 0; c < results.entities.length; c++) {
                var equipoId = results.entities[c]["_ownerid_value"];
              }
              for (var b = 0; b < results.entities.length; b++) {
                var clientemarca =
                  results.entities[b]["_ap_clientemarcaid_value"];
              }
              for (var l = 0; l < results.entities.length; l++) {
                var title = results.entities[l]["title"];
              }
              Xrm.WebApi.online
                .retrieveMultipleRecords(
                  "queue",
                  "?$select=queueid,name,_ownerid_value&$filter=_ownerid_value eq " +
                    equipoId
                )
                .then(function success(results) {
                  for (var i = 0; i < results.entities.length; i++) {
                    var colaname = results.entities[i]["name"];
                  }
                  for (var m = 0; m < results.entities.length; m++) {
                    var colaid = results.entities[m]["queueid"];
                  }
                  /*Xrm.WebApi.online.retrieveMultipleRecords("team", "?$select=teamid,name&$filter=teamid eq " + equipoId).then(
    function success(results) {
    for (var i = 0; i < results.entities.length; i++) {
    var teamname = results.entities[i]["name"];
    }*/
                  Xrm.WebApi.online
                    .retrieveMultipleRecords(
                      "ap_clientemarca",
                      "?$select=ap_clientemarcaid,ap_name&$filter=ap_clientemarcaid eq " +
                        clientemarca
                    )
                    .then(function success(results) {
                      for (var a = 0; a < results.entities.length; a++) {
                        var cliente = results.entities[a]["ap_name"];
                      }
                      for (var e = 0; e < results.entities.length; e++) {
                        var clienteid =
                          results.entities[e]["ap_clientemarcaid"];
                      }
                      let setUserValue = new Array();
                      setUserValue[0] = new Object();
                      setUserValue[0].id = colaid;
                      setUserValue[0].entityType = "queue";
                      setUserValue[0].name = colaname;
                      Context.getAttribute("from").setValue(setUserValue);
                      //Xrm.Page.getAttribute("from").setValue(setUserValue);
                      let setUserValue1 = new Array();
                      setUserValue1[0] = new Object();
                      setUserValue1[0].id = clienteid;
                      setUserValue1[0].entityType = "ap_clientemarca";
                      setUserValue1[0].name = cliente;
                      Context.getAttribute("to").setValue(setUserValue1);
                      Context.getAttribute("subject").setValue(title);
                      //Xrm.Page.getAttribute("to").setValue(setUserValue1);
                      //Xrm.Page.data.entity.save();
                    });
                });
            },
            function(error) {
              Xrm.Navigation.openAlertDialog(
                { confirmButtonLabel: "Ok", text: error.message },
                { height: 250, width: 550 }
              );
            }
          );
      } else {
        //Xrm.Page.getAttribute("ap_name").setValue(0);
        //Xrm.Page.getAttribute("ap_name").setSubmitMode("always");
      }
    }
  }
}
