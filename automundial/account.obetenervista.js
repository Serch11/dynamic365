var request = {};

request.entity = { entityType: "account", id: "7c6ff4e8-7b7d-ed11-81ad-000d3a888ada" };
request.EntRef = { "@account.id": "7c6ff4e8-7b7d-ed11-81ad-000d3a888ada" };
request.EntColl = [
    {
        "@account.id": "7c6ff4e8-7b7d-ed11-81ad-000d3a888ada", "name": "acc1",
        "@odata.type": "Microsoft.Dynamics.CRM.account"
    },
    {
        "@account.id": "7c6ff4e8-7b7d-ed11-81ad-000d3a888ada", "name": "acc2",
        "@odata.type": "Microsoft.Dynamics.CRM.account"
    }
];

request.getMetadata = function () {
    return {
        boundParameter: "entity",
        operationType: 0,
        operationName: "sr_ActionsProccessAccount",
        parameterTypes: {
            "entity": { typeName: "mscrm.account", structuralProperty: 5 },
            "EntRef:": {
                typeName: "mscrm.account",
                structuralProperty: 5
            },
            "EntColl": {
                typeName: "Collection(mscrm.crmbaseentity)",
                structuralProperty: 4
            }
        }
    };
};

Xrm.WebApi.online.execute(request).then(
    function success(result) {
        if (result.ok) {
            // perform operations as required
            console.log(result);
        }
    },
    function (error) {
        console.log(error.message);
        // handle error conditions
    }
);


var request = {};
request.entity = { entityType: "account", id: "7c6ff4e8-7b7d-ed11-81ad-000d3a888ada" };
request.EntRef = { "@account.id": "475B158C-541C-E511-80D3-3863BB347BA7" };
request.EntColl = [
    {
        "@account.id": "475B158C-541C-E511-80D3-3863BB347BA6", "name": "acc1", "@odata.type": "Microsoft.Dynamics.CRM.account"
    }
    ,
    {
        "@account.id": "475B158C-541C-E511-80D3-3863BB347BA5", "name": "acc2", "@odata.type": "Microsoft.Dynamics.CRM.account"
    }
];
request.getMetadata = function () {
    return {
        boundParameter: "entity",
        operationType: 0,
        operationName: "sr_ActionsProccessAccount",
        parameterTypes: {
            "entity": { typeName: "mscrm.account", structuralProperty: 5 },
            "EntRef": {
                typeName: "mscrm.account",
                structuralProperty: 5
            },
            "EntColl": {
                typeName: "Collection(mscrm.crmbaseentity)",
                structuralProperty: 4
            }
        }
    };
};
Xrm.WebApi.execute(request).then(
    function (result) {
        console.log(result);
    },
    function (error) {
    }
);