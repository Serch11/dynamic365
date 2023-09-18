function getDay(executionContext){

//data.entity.attributes.getByName
    alert("Probando");
    console.clear();
     let context =  executionContext.getFormContext();
     let actualStart = context.data.entity.attributes.getByName('actualstart');
     let estado = context.data.entity.attributes.getByName('statuscode');
     let proposedend = context.getAttribute("proposedend");   

    console.log(context);
    console.log(estado);
    console.log(Object.values(estado));
    alert(estado);
    alert(estado.getValue());
    alert( `nueva variable ${proposedend}` );


    let fecha = new Date();
    
    
    console.log(fecha);
    console.log(actualStart);

    console.log(fecha.toLocaleDateString());

    context.getAttribute("statuscode").addOnChange(getEstado);


    if( estado.getValue() ===  2 ){

        actualStart.setValue( new Date( fecha.toLocaleDateString() ) );
    }
}


function getEstado( exeContext ){
 
    let fecha = new Date();
    let formContext = exeContext.getFormContext();
    let actualStart = formContext.data.entity.attributes.getByName('actualstart');
    let valEstado = formContext.getAttribute("statuscode").getValue();
    console.log( " valor del estado " + valEstado);
    if(valEstado === 2){
        actualStart.setValue( new Date( fecha.toLocaleString() ) );   
    }
    console.log(formContext.getAttribute("statuscode").getValue());
    
}


function cambio(exeContent){

    alert("ejecutando cambio");
    let formContext = exeContent.getFormContext();
    formContext.getAttribute('statuscode').addOnChange(getEstado);

}