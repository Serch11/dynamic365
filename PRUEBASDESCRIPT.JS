function getChange(exeContext) {
  let formContext = exeContext.getFormContext();
  formContext.getAttribute("statuscode").addOnChange(getStatus);
}

// lanzada = 2;
// completada = 3;
//cancelada = 4;
//suspendida = 5;

function getStatus(exeContent) {
  let fecha = new Date();

  try {
    let formContext = exeContent.getFormContext();

    // para obtener un atributo o campo del formulario se puede utilizar dos formas
    //primera forma   //let statuscode = formContext.data.entity.getByName('statuscode');
    //segunda forma
    let statuscode = formContext.getAttribute("statuscode");
    let ap_comienzoreal = formContext.getAttribute("ap_comienzoreal");
    let ap_finreal = formContext.getAttribute("ap_finreal");

    if (
      statuscode.getValue() === 100000000 /* propuesta  */ ||
      statuscode.getValue() === 100000001 /** lista para lanzamiento */
    ) {
      ap_comienzoreal.setValue(null);
    }

    if (statuscode.getValue() === 100000002) {
      /*lanzada*/ ap_comienzoreal.setValue(new Date());
    }

    if (
      statuscode.getValue() === 100000003 /*completada* */ ||
      statuscode.getValue() === 100000004 /*cancelada*/ ||
      statuscode.getValue() === 100000000 /*propuesta*/
    ) {
      ap_finreal.setValue(new Date());
    }
  } catch (error) {
    console.log("error de codigo script");
    console.log(error);
  }
}

/**
 * 
 * Proposed  100,000,000
 * Ready To Lauch  100,000,001
 * Lauched   100,000,002
 * Completed  100,000,003 
 * Canceled   100,000,004
   Suspended  100,000,005 
 
 * Cancelada  778.210.004 
 * Suspendida  778.210.005 
 * Propuesta    778.210.000 
 *  
 * Lista para lanzamiento  778.210.001 
 * Lanzada  778.210.002 
 * Completada  778.210.003 
 * Cancelada  778.210.008 
 * 
 */

function getChangeStatus(exeContext) {
  let formContext = exeContext.getFormContext();
  formContext.getAttribute("statuscode").addOnChange(getStatusDate);
  /**
    * VALORES PARA LAS ESTRATEGIAS
    * Proposed  0
    * Ready To Launch 1 
    * Launched 2 
    * Completed  3 
    * Canceled  4 
    * Suspended 5 
    * 
    * 
    */
}

function getStatusDate(exeContent) {
  let fecha = new Date();

  let formContext = exeContent.getFormContext();

  let statuscode = formContext.getAttribute("statuscode");
  let actualstart = formContext.getAttribute("actualstart");
  let actualend = formContext.getAttribute("actualend");

  if (statuscode.getValue() === 0 || statuscode.getValue() === 1) {
    actualstart.setValue(null);
  }

  if (statuscode.getValue() === 2) {
    actualstart.setValue(new Date());
  }
  if (
    statuscode.getValue() === 3 ||
    statuscode.getValue() === 4 ||
    statuscode.getValue() === 5
  ) {
    actualend.setValue(new Date());
  }
}
