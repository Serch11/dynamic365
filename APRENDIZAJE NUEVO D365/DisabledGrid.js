function onGridRowSelected(eventContext) {
    "use strict";
    try {
        console.log(eventContext.getEventSource());
        eventContext.getEventSource().attributes.forEach(function (attr) {
            attr.controls.forEach(function (myField) {
                console.log(myField);
                myField.setDisabled(true);
            })
        })
    } catch (error) {
        console.log(error);
    }

}