/**
 * BY Sergio Redondo Aycardi.
 *  
 * Este Script me permite copiar el encabezado de una lista de precios y llevarme a esta informacion a un nuevo formulario 
 * de creacion de lista de Precio 
 */

function llamarFlujo(executionContext) {
  try {
    //let formContext = executionContext.getFormContext();
    console.log(executionContext);
    let id = executionContext.data.entity.getId()
      ? executionContext.data.entity.getId().slice(1,37)
      : null;
 
    let entityFormOptions = {};
    entityFormOptions["entityName"] = "pricelevel";

    let formParameters  = {};
    
    formParameters["name"] = executionContext.getAttribute("name").getValue();
    formParameters["begindate"] = executionContext.getAttribute("begindate")?.getValue();
    formParameters["enddate"] =  executionContext.getAttribute("enddate").getValue();
    formParameters["description"]  = executionContext.getAttribute("description").getValue();

    // Set lookup column
    formParameters["transactioncurrencyid"] =  executionContext.getAttribute("transactioncurrencyid").getValue()[0].id; // ID of the user.
    formParameters["transactioncurrencyidname"] = executionContext.getAttribute("transactioncurrencyid").getValue()[0].name; // Name of the user.
    formParameters["transactioncurrencyidType"] = executionContext.getAttribute("transactioncurrencyid").getValue()[0].entityType; // Table name.

    formParameters["inovait_businessunit"] = executionContext.getAttribute("inovait_businessunit")?.getValue()[0].id;
    formParameters["inovait_businessunitname"] = executionContext.getAttribute("inovait_businessunit")?.getValue()[0].name;
    formParameters["inovait_businessunitType"] = executionContext.getAttribute("inovait_businessunit")?.getValue()[0].entityType;

    // formParameters["msdyn_copiedfrompricelevel"] = executionContext.data.entity.getId().slice(1,37);
    // formParameters["msdyn_copiedfrompricelevelname"] = executionContext.getAttribute("name").getValue();
    // formParameters["msdyn_copiedfrompricelevelType"] = "pricelevel";

    formParameters["inovait_copiedfrom"] = executionContext.data.entity.getId().slice(1,37);
    formParameters["inovait_copiedfromname"] = executionContext.getAttribute("name").getValue();
    formParameters["inovait_copiedfromType"] = "pricelevel";
    //end Lookup Colum
   
  
    Xrm.Navigation.openForm(entityFormOptions, formParameters).then(
        function (result) {
            // perform operations if record is saved in the quick create form
            console.log(result);
        },
        function (error) {
            console.log(error.message);
            
        }
    );
    console.log(id);
    // if (id) {
    //   let objecto = {
    //     id: id,
    //   };
    //   let url =
    //     "https://prod-28.brazilsouth.logic.azure.com:443/workflows/1e589b7a48e84d839a997b7e0c8790a6/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Mg5H9RRxleiqckjq-K8uK-sWXaWxFjnEiYAYhzodu6Y";
    //   let XHR = new XMLHttpRequest();
    //   let data = JSON.stringify(objecto);
    //   XHR.open("POST", url, true);
    //   XHR.setRequestHeader("Content-Type", "application/json");
    //   XHR.send(data);

    //   XHR.onreadystatechange = function () {
    //     console.log(this);
    //     if (this.onreadystatechange === 200) {
    //       this.onreadystatechange = 0;
    //     }
    //     if (this.status === 200) {
    //       console.log(this.status);
    //     }
    //   };
    // }
  } catch (error) {
    console.log(error);
  }
}
