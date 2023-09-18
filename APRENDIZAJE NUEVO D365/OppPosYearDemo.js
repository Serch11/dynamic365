async function OpenTheRecordSidePane(executionContext) {
    try {
        "use strict";
        const paneId = "sergio_OpenTheRecordSidePane";
        const formContext = executionContext.getFormContext();
        const entityName = formContext.data.entity.getEntityName();
        const recordId = formContext.data.entity.getId();

        if (recordId == null) {
            return;
        }

        const pane = Xrm.App.sidePanes.getPane(paneId) ?? await Xrm.App.sidePanes.createPane({ paneId: paneId, canClose: true });
        pane.width = 600;
        pane.navigate({
            pageType: "entityrecord",
            entityName: entityName,
            entityId: recordId
        });

    } catch (error) {
        console.log(error);
    }
}

function Sergio_RegisterSendMessage(executionContext) {
    "use strict";
    try {

        function sendMessageFromSidePane(executionContext) {
            const formContext = executionContext.getFormContext();
            const entityName = formContext.data.entity.getEntityName();
            const recordId = formContext.data.entity.getId();

            Array.from(parent.frames).forEach((frames) => {
                frames.postMessage({
                    messageName: "Sergio.SidePaneChanged",
                    data: {
                        entityName: entityName,
                        recordId: recordId
                    }
                }, "*")
            });
        }
        const formContext = executionContext.getFormContext();
        formContext.data.entity.addOnPostSave(sendMessageFromSidePane);

    } catch (error) {
        console.log(error);
    }
}

function Sergio_RegisterMessageListener(executionContext) {
    "use strict";
    try {
        const formContext = executionContext.getFormContext();
        window.addEventListener("message", (e) => {
            console.log("Register message");
            if (e.data?.messageName === "Sergio.SidePaneChanged") {
                const data = e.data.data;
                console.log(data);
                if (formContext.data.entity.getEntityName() === data.entity && formContext.data.entity.getId() == data.recordId) {
                    formContext.data.refresh(true);
                    console.log("si");
                } else {
                    console.log("no");
                    Xrm.Page.ui.controls.get("opportunityproductsGrid")?.refresh();
                }
            }
            
        })
    } catch (error) {
        console.log(error);
    }
}