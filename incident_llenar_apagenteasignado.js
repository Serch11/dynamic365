function get_apAsignado(exeuctionContext) {

    try {
        let formContext = exeuctionContext.getFormContext();
        let ap_agenteasignado = formContext.getAttribute("ap_agenteasignado");
        let usuario;
        let userSettings = Xrm.Utility.getGlobalContext().userSettings;

        if (formContext.ui.getFormType() === 1) {

            if (userSettings) {

                usuario = [{
                    id: userSettings.userId.slice(1, 37),
                    entityType: "systemuser",
                    name: userSettings.userName
                }]

                ap_agenteasignado.setValue(usuario);
            }
        }
        //else

    } catch (error) {
        console.log(error);
        console.log("error en el script incident_llenar_apAgenteasignado");
    }


}