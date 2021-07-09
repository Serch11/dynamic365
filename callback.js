

function prueba1( list , callbackFunction){

    console.log(list instanceof Array)
  if( list instanceof Array  ){
       return callbackFunction( null , 10 );
  }

}


console.log( prueba1([1,2,3], ( error, result )=> error ? console.log(error) : console.log(result)  ));
