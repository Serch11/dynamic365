
    var QuoteGridCommandActions = (function () {
        function QuoteGridCommandActions() {
            this.addNewFromSubGridStandard = function (gridEntityName, parentEntityName, parentEntityId, primaryControl, gridControl, shouldNavigateProcessOnOpportunity) {
                var _this = this;
                if (shouldNavigateProcessOnOpportunity === void 0) { shouldNavigateProcessOnOpportunity = false; }
                if (parentEntityName === Sales.EntityNames.Opportunity) {
                    var progressIndicator_1 = new ClientUtility.ProgressIndicator();
                    progressIndicator_1.show();
                    Xrm.Page.data.save().then(function () {
                        var generateQuoteFromOpportunityRequest = new ODataContract.GenerateQuoteFromOpportunityRequest();
                        generateQuoteFromOpportunityRequest.OpportunityId = { guid: parentEntityId };
                        generateQuoteFromOpportunityRequest.ColumnSet = new ODataContract.ColumnSet(false, ["quoteid"]);
                        if (shouldNavigateProcessOnOpportunity && Xrm.Page.data != null && Xrm.Page.data.process != null) {
                            var processInstanceReference = null;
                            var instanceId = Xrm.Page.data.process.getInstanceId();
                            if (!ClientUtility.DataUtil.isNullOrEmptyString(instanceId)) {
                                processInstanceReference = { entityType: "businessprocessflowinstance", id: instanceId };
                                generateQuoteFromOpportunityRequest.ProcessInstanceId = processInstanceReference;
                            }
                        }
                        Xrm.WebApi.online.execute(generateQuoteFromOpportunityRequest).then(function (response) {
                            response.json().then(function (response) {
                                var quoteId = response.quoteid;
                                Xrm.Page.data.refresh(true).then(function () {
                                    Xrm.Page.ui.refreshRibbon();
                                    if (gridControl !== undefined && gridControl !== null
                                        && gridControl.refresh !== undefined && gridControl.refresh !== null) {
                                        gridControl.refresh();
                                    }
                                    Xrm.Utility.openEntityForm(Sales.EntityNames.Quote, quoteId, null, { openInNewWindow: !Xrm.Internal.isUci(), height: 500, width: 500 });
                                    if (Xrm.Internal.isUci() && !ClientUtility.DataUtil.isNullOrEmptyString(quoteId)) {
                                        _this.showToastMessage("Sales_ToastNotification_CreateQuoteFromOpty");
                                    }
                                    progressIndicator_1.hide();
                                });
                            });
                        }, function (error) {
                            Sales.ClientUtil.addSteps(error).then(function () {
                                progressIndicator_1.hideOnError(ClientUtility.ActionFailedHandler.actionFailedCallback)(error);
                            });
                        });
                    }, function (error) { progressIndicator_1.hideOnError(ClientUtility.ActionFailedHandler.actionFailedCallback)(error); });
                }
                else {
                    var formContext = Xrm.Page;
                    if (!formContext.data.isValid()) {
                        Xrm.Utility.alertDialog(Sales.StringProvider.getResourceString("RequiredFieldsNotFilledError"));
                        return;
                    }
                    XrmCore.Commands.Open.addNewFromSubGridStandard.apply(XrmCore.Commands.Open, arguments);
                }
            };
            this.showToastMessage = function (resourceString) {
                Xrm.Utility.getEntityMetadata(Sales.EntityNames.Quote).then(function (result) {
                    var toastLabel = Sales.ResourceStringProvider.getResourceString(resourceString);
                    var toastMessage = String.format(toastLabel, result.DisplayName);
                    if (toastLabel.indexOf("{0}") != 0) {
                        toastMessage = String.format(toastLabel, result.DisplayName.toLowerCase());
                    }
                    Xrm.UI.addGlobalNotification(1 /* toast */, 1 /* success */, toastMessage, null, null, null);
                });
            };
        }
        return QuoteGridCommandActions;
    }());