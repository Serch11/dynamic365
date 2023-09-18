// Centered Dialog

function OpenPageCustom() {
    var pageInput = {
        pageType: "custom",
        name: "sr_devicepage_cc03b",
    };
    var navigationOptions = {
        target: 2,
        position: 2,
        width: { value: 500, unit: "px" },
        title: "Devices"
    };
    Xrm.Navigation.navigateTo(pageInput, navigationOptions)
        .then(
            function () {
                // Called when the dialog closes
            }
        ).catch(
            function (error) {
                // Handle error
            }
        );
}
