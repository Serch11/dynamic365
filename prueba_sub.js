    

function getData( executeContext ){

    let formContext = executeContext.getFormContext();
    let gridContext = formContext.getControl('Competitors');

    console.clear();
    console.log( gridContext );
    console.log( formContext );

}



function disableField( executeContext ){

    let formContext = executeContext.getFormContext();

    let name = formContext.getAttribute('name');

    if( name.getValue() !=null ){
        formContext.getControl('name').setDisabled(true);
    }

}