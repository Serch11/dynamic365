
function getChange ( exeContext ){

    let formContext = exeContext.getFormContext();
    formContext.getAttribute('statuscode').addOnChange(getStatus);

}

// lanzada = 2;
// completada = 3;
//cancelada = 4;
//suspendida = 5;

function getStatus( exeContent ) {

    let fecha = new Date();

    let formContext = exeContent.getFormContext();

    // para obtener un atributo o campo del formulario se puede utilizar dos formas
    //primera forma   //let statuscode = formContext.data.entity.getByName('statuscode');
    //segunda forma
    let statuscode = formContext.getAttribute('statuscode');
    let ap_comienzoreal = formContext.getAttribute('ap_comienzoreal');
    let ap_finreal = formContext.getAttribute('ap_finreal');

    //console.log(actualend.getValue());
    //console.log(actualend.getValue());
    //console.log(statuscode.getValue());

    console.log(statuscode.getValue());

    if(statuscode.getValue() === 778210000 || statuscode.getValue() === 778210001){
        ap_comienzoreal.setValue(null); 
    }
    
    if(statuscode.getValue() === 778210002) {
        ap_comienzoreal.setValue( new Date( ) );
    }
  
    if( statuscode.getValue() === 778210003 ||  statuscode.getValue() === 778210008 || statuscode.getValue() === 778210009 ){
        ap_finreal.setValue( new Date(  ) );
    }
}


 


