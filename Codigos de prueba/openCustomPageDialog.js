function OpenCustomPageDialog(primaryControl, id, entityName) {

    var pageInput = {
        pageType: "custom",
        name: "serch_paginapersonalizada_7f785",
        entityName: entityName,
        recordId: id.replace(/[{}]/g, '')
    };

    var navigationOptions = {
        target: 2,
        position: 1,
        title: "Task generator"
    };

    Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(function () {
        primaryControl.data.refresh()
    }).catch((err) => {
        console.log(err);
    });
}