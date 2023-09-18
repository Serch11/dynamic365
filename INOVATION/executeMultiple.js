var Sdk = window.Sdk || {};

/**
 * Request to create a record
 * @param {string} entityTypeName - The entity type name.
 * @param {Object} payload - The entity payload.
 */
Sdk.CreateRequest = function (entityTypeName, payload) {
  this.etn = entityTypeName;
  this.payload = payload;
  this.getMetadata = function () {
    return {
      boundParameter: null,
      parameterTypes: {},
      operationType: 2,
      operationName: "Create",
    };
  };
};

let objectodepersonas = [
    {
        nombre :"LEONEL MESSI"
    },
]
var requests = [];

var request2 =[
    new Sdk.CreateRequest("account", {name: "Jose cervante" })
]
objectodepersonas.forEach((element) => {
  requests.push(new Sdk.CreateRequest("account",  ));
});
Xrm.WebApi.online.executeMultiple(requests2).then(
  (result) => {
    if (result.ok) {
      console.log(`${result.status} ${result.statusText}`);
    }
  },
  (error) => {
    console.log(error.message);
  }
);

// Construct a request object array from the metadata
console.log(requests);

// Use the request object array to execute the function
