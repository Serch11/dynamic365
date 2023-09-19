function user(exeContext) {
    var Context = exeContext.getFormContext();
    var userid = Context.getAttribute("ownerid").getValue()[0].id;
    if (Context.getAttribute("ownerid").getValue() != null) {
        Xrm.WebApi.online.retrieveMultipleRecords("systemuser", "?$select=med_identificacion,systemuserid&$filter=systemuserid  eq " + userid)
        .then(function success(result) {
            for (var i = 0; i < result.entities.length; i++) {
                var usuario = result.entities[i]["med_identificacion"];

            }
            Context.getAttribute("med_identificaciondeusuario").setValue(String(usuario));
            //console.log(usuario);   

        },
            function (error) {
                console.log(error.message);
                // handle error conditions
            }
        );

    } else {
        console.log("Null");
    }
}

