function onRecordSelect(exeContext) {
    // depurador;
    var _formContext = exeContext.getFormContext();
    var disableFields = ["ap_exhibitpwrst"];
    lockFields(exeContext, disableFields);
}

function lockFields(exeContext, disableFields) {
    var _formContext = exeContext.getFormContext();
    var currentEntity = _formContext.data.entity;
    currentEntity.attributes.forEach(function (attribute, i) {
        console.log(attribute);
        if (disableFields.indexOf(attribute.getName()) > -1) {
            var attributeToDisable = attribute.controls.get(0);
            attributeToDisable.setDisabled(true);
        }
    });
}
