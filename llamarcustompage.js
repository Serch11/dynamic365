function OpenCustomPageDialog(primaryControl, id, entityName) {// Centered Dialog
    console.log("Hola");
    var pageInput = {
        pageType: "custom",
        name: "cr5bd_crearllamadadeplandeaccion",
        entityName: entityName,
        recordId: id.replace(/[{}]/g, ''),
    };
    var navigationOptions = {
        target: 2, 
        position: 1,
        title: "Task generator"
    };
    Xrm.Navigation.navigateTo(pageInput, navigationOptions)
        .then(
            function () {
                primaryControl.data.refresh()
            }
        ).catch(
            function (error) {
                // Handle error
                console.log(error);
            }
        );
}