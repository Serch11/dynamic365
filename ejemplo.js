Xrm.WebApi.online.execute(request).then(
    function success(result) {
        if (result.ok) {
            // perform operations as required

        }
    },
    function (error) {
        console.log(error.message);
        // handle error conditions
    }
);




var prueba = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("exito");
    }, 250)

    reject("error");
});


prueba.then((value) => {
    console.log(value);
})


var lookupObjects = {
    allowMultiSelect: true,
    defaultEntityType: 'account',
    defaultViewId: '00000000-0000-0000-0000-000000000001',
    disableMru: true,
    entityTypes: ['account'],
    showBarcodeScanner: true,
    viewIds: ['00000000-0000-0000-0000-000000000001'],
    filters: [{ filterXml: fetchXml, entityLogicalName: 'account' }]
};

Xrm.Utility.lookupObjects(lookupOptions).then(
    function success(result) {
        console.log(result);
    },
    function (error) {
        console.log(error.message);
        // handle error conditions
    }
);