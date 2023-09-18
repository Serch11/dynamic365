function prueba(  exeContext   )  {
 
    
    
    let formContext = exeContext.getFormContext();
    console.clear();

    console.log( formContext );

    //primera forma
    formContext.getAttribute('parentaccountid').addOnChange( cambioNombre );
    console.log( formContext.getAttribute('parentaccountid') );
       //segunda forma 
    //let  companyname  = exeContext.data.entity.getByName('companyname');
}



function cambioNombre( exeContext ){


    alert("llego segunda function" );
    let formContext =  exeContext.getFormContext(); 
    let companyname =  formContext.getAttribute('companyname');
    let parentaccountid = formContext.getAttribute('parentaccountid');    

    console.log( companyname.getValue() );
    console.log( parentaccountid.getValue() );
    

    if( parentaccountid.getValue() != null   ){
        console.log( parentaccountid.getValue() )
        companyname.setValue( String( parentaccountid.getValue()[0].name)  );
        companyname.setValue( String( parentaccountid.getValue()[0].entityType)  );

    }else{
      companyname.setValue( null );   
    }

    


 
}


gridContext.addOnLoad(myFunction);
gridContext.getEntityName();
gridContext.getGrid();
gridContext.getFetchXml();
gridContext.getGrid();
gridContext.getGrid().getRows();
g














