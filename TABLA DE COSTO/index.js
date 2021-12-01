$("#filetable").change((e) => {
    let reader = new FileReader();
    console.log(e);
    console.log(reader.readAsArrayBuffer(e.target.files[0]));
    reader.onload = async function (e) {


        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const result = XLSX.utils.sheet_to_json(workbook.Sheets[$("#nametable").val()],{header:"A"})

        console.log(result);
    }
});