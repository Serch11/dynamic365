SetDownloadButton = function () {

    var entityList = $(".entitylist.entity-grid").eq(0);

    entityList.on("loaded", function () {



        //hide url column
        console.log(entityList.find("table thead th").eq(4).hide());
        entityList.find("table tbody tr").each(function () {

            $(this).find("td").eq(4).hide();

        });


        entityList.find("table tbody > tr").each(function (index, value) {
            console.log(index);
            console.log(value);
            var tr = $(this);


            var documentUrlAttribute = tr.find('td[data-attribute="ser_urldedocumentogenerado"]');


            if (documentUrlAttribute.length > 0) {
                var documentURL = $(documentUrlAttribute).attr("data-value");


                if (documentURL) {
                    console.log(documentURL.split("id=")[1].split("&")[0]);
                    var idRegistro = documentURL.split("id=")[1].split("&")[0];
                    console.log(idRegistro);

                    var PATRONURL = "https://portalcustomerservices.powerappsportals.com/_entity/annotation/" + idRegistro;
                    console.log(PATRONURL);


                    var downloadElement = "";
                    downloadElement += "<li>";
                    downloadElement += "<a href='" + PATRONURL + "' target='_blank'>";

                    downloadElement += "<span class='fa fa-download fa-fw' aria-hidden='true'/>";
                    downloadElement += "</a>";
                    downloadElement += "</li>";

                    var generateWord = tr.find(".dropdown-menu");
                    console.log(downloadElement);
                    generateWord.append(downloadElement);


                }

            }
        });

    });
}