var Sdk = windon.Sdk || {};
(function () {
  this.formOnLoad = function (executionContext) {
    var formContext = executionContext.getFormContext();
    var firstName = formContext.getAttribute("firstname").getValue();
    alert("@Prueba");
  };
}.call(Sdk));

//validacion de campos
//form Notification
formContext.ui.setFormNotification(
  "message",
  "ERROR",
  "notification_unique_id"
);
//field Notification
formContex.getControl("attribute").setNotification("message", "uniqueid");



//clear notification
formContex.getControl("attribute").clearNotification("telephonensg");
formContext.ui.clearFormNotification("notification_unique_id");
