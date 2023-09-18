function NavigateCustomPage(formContext) {
    try {
        console.log();
        Xrm.Navigation.navigateTo({
            pageType: "custom",
            name: "crc4c_sergiodialogpage_00d60",
            entityName: formContext.data.entity.getEntityName(),
            recordId: formContext.data.entity.getId()
        }, {
            target: 2,
            position: 1,
            width: { value: 50, unit: "%" },
            //heigth: 400
            //title:""
        }).then(function () {
            formContext.data.refresh();
        })
            .catch(console.error)

    } catch (error) {
        console.log(error);
    }
}