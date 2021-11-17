function getCustomerId(executionContext) {
  try {
    let formContext = executionContext.getFormContext();
    let customerid = formContext.getAttribute("customerid");
    let QueryStringParams = formContext.context.getQueryStringParameters();
    let valueCustomer;
    //console.log(QueryStringParams);

    Xrm.WebApi.retrieveRecord(
      QueryStringParams.parentrecordtype,
      QueryStringParams.parentrecordid
    ).then(
      function success(result) {
        if (result) {
          //console.log(result);

          if (result._customerid_value) {
            //consultamos la cuenta
            Xrm.WebApi.retrieveRecord("account", result._customerid_value).then(
              function success(res) {
                // perform operations on record retrieval
                //console.log(res);

                valueCustomer = [
                  {
                    entityType: "account",
                    id: `{${result._customerid_value}}`,
                    name: res.name,
                  },
                ];
                console.log(valueCustomer);
                customerid.setValue(valueCustomer);
              },
              function (error) {
                console.log(error.message);
                // handle error conditions
              }
            );
          }
        }
        // perform operations on record retrieval
      },
      function (error) {
        console.log(error.message);
        // handle error conditions
      }
    );
  } catch (error) {
    console.log(error);
    console.log("Error function getCustomerId");
  }
}

async function consultarEntidad(entidad, id) {
  try {
    return Xrm.WebApi.retrieveRecord(entidad, id);
  } catch (error) {
    console.log(error);
  }
}
