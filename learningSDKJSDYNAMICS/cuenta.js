async function prueba(executionContext) {


    let formContext = executionContext.getFormContext();

    let jobtitle = formContext.getAttribute("jobtitle");


    if (jobtitle.getValue()) {

        console.clear();
        console.log(jobtitle.getValue());


        let result = await Helper.llenarCampo("daniela");

        console.log(result);
    }
}