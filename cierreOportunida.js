function cierreoportunidad(executionContext) {
    var formContext;
    formContext = executionContext.getFormContext();
    if (formContext.getAttribute("opportunityid").getValue() != null) {
        var Oportunidad = formContext.getAttribute("opportunityid").getValue()[0].id;
        Xrm.WebApi.online.retrieveMultipleRecords("opportunity", "?$select=name,opportunityid,_ap_uenid_value&$filter=opportunityid eq " + Oportunidad).then(
            function success(results) {
                for (var i = 0; i < results.entities.length; i++) {
                    var UEN = results.entities[i]["_ap_uenid_value"];

                }
                Xrm.WebApi.online.retrieveMultipleRecords("businessunit", "?$select=name,businessunitid&$filter=businessunitid eq " + UEN).then(
                    function success(results) {
                        for (var a = 0; a < results.entities.length; a++) {
                            var UENname = results.entities[a]["name"];
                        }
                        let setUserValue = new Array();
                        setUserValue[0] = new Object();
                        setUserValue[0].id = UEN;
                        setUserValue[0].entityType = 'businessunit';
                        setUserValue[0].name = UENname;
                        formContext.getAttribute("ap_uen").setValue(setUserValue);

                        var estado = Xrm.Page.getAttribute("opportunitystatuscode").getValue();

                        if (estado == 3) {
                            //alert("Ganada");

                        } else if (estado == 4) {
                            //alert("Perdida");
                            if (UEN == "ec1d7649-f668-e811-a963-000d3ac1b2cd") {
                                /* Américas BPS={ec1d7649-f668-e811-a963-000d3ac1b2cd}
                                Pregunta:  	¿Por qúe se perdió?  
                                Respuesta:  	Alcance  
                                                Causas internas  
                                                Experiencia  
                                                Precio   */
                                formContext.getControl("ap_porqueseperdio").removeOption(100000001);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000002);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000004);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000005);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000007);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000008);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000009);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000011);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000012);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000013);
                            } else if (UEN == "504e724f-f668-e811-a963-000d3ac1b2cd") {
                                /*                                
                                BPO={504e724f-f668-e811-a963-000d3ac1b2cd}
                                Pregunta:  	¿Por qúe se perdió?  
                                Respuesta:  	Capacidad financiera  
                                                Capacidad jurídica  
                                                Condiciones técnicas  
                                                Experiencia  
                                                Precio
                                */
                                formContext.getControl("ap_porqueseperdio").removeOption(100000000);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000003);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000004);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000007);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000008);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000009);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000011);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000012);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000013);
                            } else if (UEN == "91bd0259-f668-e811-a963-000d3ac1b2cd") {
                                /*                                
                                Publico={91bd0259-f668-e811-a963-000d3ac1b2cd}
                                Pregunta:  	¿Por qúe se perdió?
                                Respuesta:  	Capacidad financiera  
                                                Capacidad jurídica  
                                                Condiciones técnicas  
                                                Experiencia  
                                                Precio  
                                                Requisitos de hoja de vida  
                                                Puntaje técnico  
                                                La entidad declaró desierto el proceso de selección
                                */
                                formContext.getControl("ap_porqueseperdio").removeOption(100000000);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000003);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000004);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000008);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000009);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000013);

                            }
                            else if (UEN == "49c061c3-f468-e811-a963-000d3ac1b2cd" || UEN == "700f3bb3-f468-e811-a963-000d3ac1b2cd") {
                                /*Impresión digital={49c061c3-f468-e811-a963-000d3ac1b2cd}
                                Salud={700f3bb3-f468-e811-a963-000d3ac1b2cd}
                                Pregunta:  	¿Porqué se perdió?  
                                Respuesta:  	Alcance  
                                                Capacidad financiera  
                                                Capacidad jurídica  
                                                Causas internas  
                                                Competencia  
                                                Condiciones técnicas  
                                                Experiencia  
                                                Precio  
                                                Servicio   */
                                formContext.getControl("ap_porqueseperdio").removeOption(100000007);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000008);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000009);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000011);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000012);
                            }
                            else if (UEN == "956b1136-7cf8-ea11-a815-000d3a7524a4" || UEN == "bc49f3be-e3db-ea11-a813-000d3a74747f" || UEN == "d0690f65-f668-e811-a963-000d3ac1b2cd" || UEN == "ca11775c-5733-eb11-a813-000d3a7524a4" || UEN == "e39e87c3-e139-e911-a992-000d3a75c000" || UEN == "872cedc9-d0b3-e911-a812-000d3a7471ca" || UEN == "53e7c79a-2830-eb11-a813-000d3a7524a4" || UEN == "27e1a873-f668-e811-a963-000d3ac1b2cd" || UEN == "ef98b92d-b5bb-ea11-a812-000d3a74747f" || UEN == "cc4c48cd-5fe2-ea11-a813-000d3a74747f") {
                                /*  Assenda Red={956b1136-7cf8-ea11-a815-000d3a7524a4}
                                    Ciberseguridad={bc49f3be-e3db-ea11-a813-000d3a74747f}
                                    E-Business={d0690f65-f668-e811-a963-000d3ac1b2cd}
                                    E-Business Alianza={ca11775c-5733-eb11-a813-000d3a7524a4}
                                    Innovación={e39e87c3-e139-e911-a992-000d3a75c000}
                                    ITO={872cedc9-d0b3-e911-a812-000d3a7471ca}
                                    MEPAL={53e7c79a-2830-eb11-a813-000d3a7524a4}
                                    Privado={27e1a873-f668-e811-a963-000d3ac1b2cd}
                                    Soluciones de Comunicación={ef98b92d-b5bb-ea11-a812-000d3a74747f}
                                    Transversal={cc4c48cd-5fe2-ea11-a813-000d3a74747f}  
                                    Para todos los demas
                                    Respuesta:  	Por competencia  
                                                    Precio  
                                                    Los productos o servicios no cumplen con la necesidad
    
                                    */
                                formContext.getControl("ap_porqueseperdio").removeOption(100000000);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000001);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000002);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000003);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000005);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000006);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000007);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000009);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000011);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000012);
                                formContext.getControl("ap_porqueseperdio").removeOption(100000013);

                            }


                        } else if (estado == 5) {
                            if (UEN == "91bd0259-f668-e811-a963-000d3ac1b2cd") {
                                //alert("Declinada");
                                /* Publico={91bd0259-f668-e811-a963-000d3ac1b2cd}
                                Pregunta:  	    ¿Razón por la que se declina?  
                                Respuesta:  	No cumplimiento de requisitos financieros  
                                                No cumplimiento de requisitos jurídicos  
                                                No cumplimiento de requisitos técnicos  
                                                No cumplimiento de experiencia  
                                                No cumplimiento de hojas de vida  
                                                Presupuesto oficial Insuficiente*/
                                formContext.getControl("ap_razonporlaquesedeclina").removeOption(100000006);
                                formContext.getControl("ap_razonporlaquesedeclina").removeOption(100000007);
                            } else if (UEN != "91bd0259-f668-e811-a963-000d3ac1b2cd") {
                                //alert("Declinada");
                                /*  Para todos los demas
                                Pregunta:  	¿Por qué se declina?  
                                Respuesta:  	No cumplimiento de requisitos financieros  
                                                No cumplimiento de requisitos jurídicos  
                                                No cumplimiento de requisitos técnicos  
                                                Declinada por el cliente  
                                                No cumplimiento de experiencia  
                                                Precio  */

                                formContext.getControl("ap_razonporlaquesedeclina").removeOption(100000004);
                                formContext.getControl("ap_razonporlaquesedeclina").removeOption(100000005);

                            }


                        }

                    },
                    function (error) {
                        Xrm.Navigation.openAlertDialog({ confirmButtonLabel: "Ok", text: error.message }, { height: 250, width: 550 });
                    }
                );
            },
            function (error) {
                //alert("1");
                Xrm.Utility.alertDialog(error.message);
            }
        );
    } else {
        Xrm.Page.getAttribute("ap_name").setValue(0);
        Xrm.Page.getAttribute("ap_name").setSubmitMode("always");
    }

}

