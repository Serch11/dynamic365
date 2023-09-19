function onRecordSelect(exeContext) {
    // depurador;
    var _formContext = exeContext.getFormContext();
    var data = new Array();

    _formContext.data.entity.attributes.forEach((value, index, array) => {
        //console.log(value._attributeName);
        data.push(value._attributeName);
    });
    //console.log(data);
    
    var disableFields = ["ap_exhibitpwrst", "ownerid", "parentaccountid", "estimatedvalue"];
    lockFields(exeContext, data);
}

function lockFields(exeContext, disableFields) {
    var _formContext = exeContext.getFormContext();
    var currentEntity = _formContext.data.entity;
    currentEntity.attributes.forEach(function (attribute, i) {
        //console.log(attribute.getName());
        if (disableFields.indexOf(attribute.getName()) > -1) {
            //console.log(attribute.controls.get(0));
            var attributeToDisable = attribute.controls.get(0);
            attributeToDisable.setDisabled(true);
        }
    });
}