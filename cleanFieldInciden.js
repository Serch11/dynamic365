function limpiarCampos(executeContext) {
    let formContext = executeContext.getFormContext();
    let ap_plataforma = formContext.getAttribute("ap_plataforma");
    ap_plataforma.addOnChange(borrar);
}

//FUNCION PARA BORRAR CAMPOS CUANDO LA PLATAFORMA NO TENGO UN VALOR
function borrar(executeContext) {
    let formContext = executeContext.getFormContext();
    let ap_plataforma = formContext.getAttribute("ap_plataforma");
    let ap_tipoactividadporplataforma = formContext.getAttribute(
        "ap_tipoactividadporplataforma"
    );

    console.log(ap_plataforma.getValue());
    console.log(executeContext.getDepth());

    if (!ap_plataforma.getValue() &&
        (executeContext.getDepth() === 0 ||
            executeContext.getDepth() === 1 ||
            executeContext.getDepth() === 3)
    ) {
        ap_tipoactividadporplataforma.setValue(null);
    }
}