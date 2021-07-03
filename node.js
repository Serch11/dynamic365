let cadena = "Sergio Andre Redondo";
let mayusculas = new Array();
let verMayusculas = "";
let tempMayus = new Array() ;




const Mayuscula = () => {

    for (let index = 0; index < cadena.length; index++) {
        
        if(   cadena[index] === cadena[index].toUpperCase()  ){
            
            tempMayus.push( cadena[index] );
        }
    }

    for (let index = 0; index < tempMayus.length; index++) {

        //console.log( tempMayus[index] );
        console.log(tempMayus[index] !=' ');
        if( tempMayus[index] != ' '  && tempMayus[index] != null ){
            console.log( tempMayus[index] );
            verMayusculas = verMayusculas + ","  + tempMayus[index];
        }
    }
    return verMayusculas;
}



const data = Mayuscula();
console.log(data);