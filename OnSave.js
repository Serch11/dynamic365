function SaveAsyncWithDialog(executionContext) {
    console.log("Entering save");
    const eventArgs = executionContext.getEventArgs();
    if (eventArgs.getSaveMode() === 70) {
        eventArgs.preventDefault();
        return;
    }

    eventArgs.disableAsyncTimeout();

}

function onAccountFormLoad(executionContext) {
    var formContext = executionContext.getFormContext();
    formContext.data.entity.addOnSave(
        (() => {
            return async (eContext) => {
                eContext.getEventArgs().preventDefaultOnError();

                await createChildRecords(eContext);
            }
        }
        )());
}

var validateSaveAsync = (eContext) => {
    return new Promise((resolve, reject) => {
        var recordId = eContext.getFormContext().data.entity.getId().replace("{", "").replace("}", "");
        Xrm.WebApi.retrieveRecord('account', recordId, "?$select=industrycode").then(
            function success(result) {
                // perform operations on record retrieval
                if (result.industrycode === undefined || result.industrycode === null) {
                    console.log(result);
                    resolve(true)
                } else {
                    reject("Error");
                }
            },
            function (error) {
                console.log(error.message);
                // handle error conditions
            }
        );
    })
}

async function ConfirmarDialogo(executionContext) {
    confirmStrings = {
        cancelButtonLabel: 'Cancel',
        confirmButtonLabel: 'Confirm',
        subtitle: 'Click confirm to proceed',
        text: 'This is a confirmation.',
        title: 'Confirmation Dialog'
    };
    let confirmOptions = { height: 200, width: 450 };

    return new Promise((resolve, reject) => {
        Xrm.Navigation.openConfirmDialog({ text: "Would you lime to save?", title: "Save confirmation" }, confirmOptions).then(
            function (success) {
                if (success.confirmed) {
                    resolve(true)
                    console.log('Dialog closed using OK button.');

                } else {
                    console.log('Dialog closed using Cancel button or X.');
                    reject(false)
                }
            },
            function (error) {
                console.log(error.message);
                // handle error conditions
            }
        );
    })
}

var createChildRecords = (eContext) => {
    return new Promise((resolve, reject) => {
        var recordId = eContext.getFormContext().data.entity.getId().replace("{", "").replace("}", "");
        var data = {};
        data.subject = "sample task";
        data["regardingobjectid@odata.bind"] = "/accounts(" + recordId + ")";

        Xrm.WebApi.createRecord("task", data)
            .then(function (result) {
                console.log("Task created with id: " + result.id);
            }, function (error) {
                console.log(error.message);
            });
    });
}
