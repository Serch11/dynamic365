/*
Campos para mostrar  en CAC                                   
 Horas de procedimiento = 778.210.001 , 
 Consulta = 778.210.002, 
 Cortesia comercial = 778.210.003,  
 aplicación de Parche = 778.210.004, 
 Garantia Fabricante = 778.210.005,  
 Manteniemiento extendido = 778.210.006, 
 Servicio imputable al cliente = 778.210.007
*/

/* 
 casos para mostrar en SINCO
 Cambio de tienda =  778.210.008
 Cortesia comercial = 778.210.003, 
 dispositivo dado de baja = 778.210.010
 Horas de procedimiento = 778.210.001 , 
 garantía = 778.210.012 
 Servicio imputable al cliente = 778.210.007
 soporte de proyecto = 778.210.014
 Bolsa de Horas = 778.210.015
 Rollout equipos = 778.210.016
 Plan Proactivo = 778.210.017
 Soporte Incluido = 778.210.018
*/

/**
 todos los campos 
 Consulta = 778.210.002, 
 dispositivo dado de baja = 778.210.010
 aplicación de Parche = 778.210.004, 
 Garantia Fabricante = 778.210.005, 
 Manteniemiento extendido = 778.210.006, 
 Servicio imputable al cliente = 778.210.007
 Actualización = 2
 Configuración = 3 
 Despliegue = 4
 Rollout equipos = 778.210.016
 Plan Proactivo = 778.210.017
 Soporte Incluido = 778.210.018
 dispositivo dado de baja = 778.210.010
 garantía = 778.210.012 }]{{}}
 soporte de proyecto = 778.210.014
 Bolsa de Horas = 778.210.015
 */

function getForm(executeContext) {
  let formContext = executeContext.getFormContext();
  console.clear();
  console.log(formContext.ui.formSelector.getCurrentItem());
  let ap_procedimientodelcaso = formContext.getAttribute(
    "ap_procedimientodelcaso"
  );
  

  var FORM_NAME = formContext.ui.formSelector.getCurrentItem()._label;
  //alert(FORM_NAME);
  ap_procedimientodelcaso.addOnChange(viewData);

  if (FORM_NAME === "Caso CAC") {
    formContext.getControl("ap_procedimientodelcaso").removeOption(1);
    formContext.getControl("ap_procedimientodelcaso").removeOption(2);
    formContext.getControl("ap_procedimientodelcaso").removeOption(3);
    formContext.getControl("ap_procedimientodelcaso").removeOption(4);
    formContext.getControl("ap_procedimientodelcaso").removeOption(778210016);
    formContext.getControl("ap_procedimientodelcaso").removeOption(778210017);
    formContext.getControl("ap_procedimientodelcaso").removeOption(778210018);
    formContext.getControl("ap_procedimientodelcaso").removeOption(778210008);
    formContext.getControl("ap_procedimientodelcaso").removeOption(778210010);
    formContext.getControl("ap_procedimientodelcaso").removeOption(778210012);
    formContext.getControl("ap_procedimientodelcaso").removeOption(778210014);
    formContext.getControl("ap_procedimientodelcaso").removeOption(778210015);
  }

  if (FORM_NAME === "Caso SINCO") {
    formContext.getControl("ap_procedimientodelcaso").removeOption(1);
    formContext.getControl("ap_procedimientodelcaso").removeOption(2);
    formContext.getControl("ap_procedimientodelcaso").removeOption(3);
    formContext.getControl("ap_procedimientodelcaso").removeOption(4);
    formContext.getControl("ap_procedimientodelcaso").removeOption(778210002);
    formContext.getControl("ap_procedimientodelcaso").removeOption(778210004);
    formContext.getControl("ap_procedimientodelcaso").removeOption(778210005);
    formContext.getControl("ap_procedimientodelcaso").removeOption(778210006);
  }
  
}

function viewData(executionContext) {
  let formContext = executionContext.getFormContext();
  let ap_procedimientodelcaso = formContext.getAttribute(
    "ap_procedimientodelcaso"
  );

  console.log(ap_procedimientodelcaso.getValue());
}






