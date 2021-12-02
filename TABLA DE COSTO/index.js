document.getElementById("nametable").value = "TC";
document.getElementById("nametable").style.display = "n";
$("#filetable").change(async(e) => {
    let reader = new FileReader();
    console.log(e);
    console.log(reader.readAsArrayBuffer(e.target.files[0]));
    reader.onload = async function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {
            type: "array",
        });
        const result = XLSX.utils.sheet_to_json(
            workbook.Sheets[$("#nametable").val()], {
                header: "A",
            }
        );

        const obtenerItem = await validarItem(result);
        console.log(obtenerItem);
    };
});

//1. validar que la referencia exista
// si tiene referencia vamos a proceder a mostrar el item
// validamos campos vacios

const validarItem = async(item) => {
    let itemValidados = [];
    let objItem = {};

    item.forEach((value, index) => {
        if (value["B"] && index >= 3) {
            console.log(value["B"]);

            objItem.referencia = value["B"];
            objItem.descripcion = value["C"];
            objItem.categoria = value["A"];
            objItem.cantidad = value["D"];
            objItem.margen = value["Q"];



            if (typeof value["E"] !== "number" ? value["E"].trim() : value["E"])
                objItem.priceperunit = value["E"];
            let validaJ = typeof value["J"] !== "number" ? value["J"].trim() : value["J"];
            if (validaJ)
                objItem.descuentoespecialexhibit = Number(value["J"]) * 100;

            let validaL =
                typeof value["L"] !== "number" ? value["L"].trim() : value["L"]; //true
            let validaE =
                typeof value["E"] !== "number" ? value["E"].trim() : value["E"]; //false
            let validaH =
                typeof value["H"] !== "number" ? value["H"].trim() : value["H"]; //

            if (validaL && !validaE && !validaH) {
                objItem.costounitfobmiami = value["L"];
                objItem.porcentajedeimportacion = Number(value["M"]) * 100;
            }
            itemValidados.push(objItem);
            objItem = {};
        }
    });
    return itemValidados;
};