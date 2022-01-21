$("#input-excel").change(function (e) {
  $(".modal").show();

  var reader = new FileReader();

  reader.readAsArrayBuffer(e.target.files[0]);

  reader.onload = async function (e) {
    var data = new Uint8Array(e.target.result);

    var workbook = XLSX.read(data, { type: "array" });

    var result = XLSX.utils.sheet_to_json(workbook.Sheets[$("#hoja").val()], {
      header: "A",
    });
    let refs = await ref_inexistentes(result);

    var queryString = window.parent.location.search;

    var urlParams = new URLSearchParams(queryString);

    setTimeout(function () {
      if (refs.length > 0) {
        $("#tabla").hide();

        $("#cuerpo_tabla").html("");

        refs.forEach((value) => {
          $("#cuerpo_tabla").append("<tr><td>" + value + "</td></tr>");
        });

        $("#tabla").show();
      } else {
        agregar_items(result, urlParams);
      }
    }, 10000);
  };
});

async function ref_inexistentes(result) {
  let ref_inexistentes = [];

  result.forEach(async (value, index, array) => {
    if (value["B"] && index >= 3) {
      let ref = await existe_ref(value["B"]);

      if (ref.entities.length == 0) await ref_inexistentes.push(value["B"]);
    }
  });

  return ref_inexistentes;
}

async function existe_ref(referencia) {
  console.log(referencia);

  existe = await Xrm.WebApi.retrieveMultipleRecords(
    "product",
    "?$select=productid&$filter=productnumber eq  '" + referencia + "' "
  );

  console.log(existe);

  return existe;
}

function agregar_items(result, urlParams) {
  let contador = 0;

  result.forEach((value, index, array) => {
    contador++;

    if (value["B"] && index >= 3) {
      var referencia = value["B"];

      var descripcion = value["C"];

      var categoria = value["A"];

      Xrm.WebApi.retrieveMultipleRecords(
        "product",
        "?$select=productid&$filter=productnumber eq  '" + referencia + "' "
      ).then(async function success(result) {
        var productid = result.entities[0].productid;
        var porcentaje = 0;

        Xrm.WebApi.retrieveMultipleRecords(
          "ap_exhibit",

          "?$select=ap_exhibitid,createdon,ap_porcentaje,_ap_producto_value&$filter=(statecode eq 0 and ap_referenciaproveedor eq '" +
            referencia +
            "')"
        ).then(async function success(result) {
          if (result.entities[0]) {
            porcentaje = result.entities[0].ap_porcentaje;
          }

          var cantidad = value["D"];
          var margen = value["Q"];

          var data = {
            quantity: Number(cantidad),

            "productid@odata.bind": "/products(" + productid + ")",

            ap_referenciainterna: referencia,

            ap_exhibitpwrst: Number(porcentaje),

            "quoteid@odata.bind": "/quotes(" + urlParams.get("id") + ")",

            "uomid@odata.bind": "/uoms(f6008f58-2cf0-ea11-a815-000d3ac090ba)",

            ap_margen: Number(margen) * 100,

            ap_categoria: categoria,
          };

          if (value["E"]) {
            var precio = value["E"];

            data.priceperunit = Number(precio);
          }

          if (value["J"]) {
            var descuento_especial = value["J"];

            data.ap_descuentoespecialoexhibitx =
              Number(descuento_especial) * 100;
          }

          if (value["H"] && !value["E"]) {
            var costo = value["H"];

            data.rd_costounit = Number(costo);
          }

          if (value["L"] && !value["E"] && !value["H"]) {
            var costo_fob = value["L"];

            data.ap_costounitfobmiami = Number(costo_fob);

            var porcentaje_importacion = value["M"];

            data.ap_porcentajedeimportacion =
              Number(porcentaje_importacion) * 100;
          }
          var requests = [
            new Sdk.CreateRequest("account", { "name": objectodepersonas })
          ];
            console.log(element.nombre);
            
          
            

          if (contador % 50 == 0) {
            setTimeout(() => {
              Xrm.WebApi.createRecord("quotedetail", data);
            }, 5000);
          } else {
            Xrm.WebApi.createRecord("quotedetail", data);
          }

          cerrar();
        });
      });
    }
  });
}
