function onRecordSelect(exeContext) {
    // depurador;
    var _formContext = exeContext.getFormContext();
    var disableFields = ["ap_exhibitpwrst", "ownerid", "parentaccountid", "estimatedvalue"];
    lockFields(exeContext, disableFields);
}

function lockFields(exeContext, disableFields) {
    var _formContext = exeContext.getFormContext();
    var currentEntity = _formContext.data.entity;
    currentEntity.attributes.forEach(function (attribute, i) {
        console.log(attribute.getName());
        if (disableFields.indexOf(attribute.getName()) > -1) {
            console.log(attribute.controls.get(0));
            var attributeToDisable = attribute.controls.get(0);
            attributeToDisable.setDisabled(true);
        }
    });
}


function prueba(executionContext) {
    console.log(executionContext);
    var cs = Xrm.Page.ui.controls.get();
    for (var i in cs) {
        var c = cs[i];
        if (c.getName() != "" && c.getName() != null) {
            if (!c.getDisabled()) { c.setDisabled(true); }
        }
    }
}