function prueba(executionContext){
    console.log("prueba");
    alert("prueba desde alerta dyanmic 365");


    var formContext = executionContext.getFormContext();

    var telefono1 = formContext.data.entity.attributes.getByName('telephone1');
    var name = formContext.data.entity.attributes.getByName('name');
    var sitioWeb = formContext.data.entity.attributes.getByName('websiteurl');
    var dataTelefono = telefono1.getValue();


    var telephoneField = telefono1.controls.getByIndex(0);


    name.styles.backgroundColor.red;

    console.log(name.getValue());

    console.log(name.getValue().length);

    console.log( typeof(name.getValue()) );
    console.log( name.getValue() === undefined );

    if(name.getValue().length <=0 ){
        name.controls.getByName(0).setNotification("llene el campo");
    }else{
        sitioWeb.setValue( `www.${name.getValue()}.com` ); 
    }

    if (!dataTelefono) {
        telephoneField.setNotification('Please include the country code beginning with ‘+’.', 'countryCodeNotification');
    }
    else {
        telephoneField.clearNotification('countryCodeNotification');
    }
    

    alert( telefono1 );
    console.log(  " data telefono" , dataTelefono);
    alert( Object.values(formContext) );
    console.log(Object.values(formContext));
    console.log(formContext);
}



