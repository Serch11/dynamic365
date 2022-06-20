


var utilidadesOferta = {


    //funcion para validar el porcentaje de descuento dentro de la linea de oferta
    ofertaValidarSolicitudCredito: async function (executionContext) {
        //valor DAECO  124510001
        //valor SICEX  124510000
        try {

            let formContext = executionContext.getFormContext();
            let invt_descuentopor = formContext.getAttribute("invt_descuentopor");
            let productid = formContext.getControl("productid");

            //validamos que la oferta ya este creada
            console.log("hola");

            if (Xrm.Page.data.entity.getId()) {

                console.log(Xrm.Page.data.entity.getId());
                //consultamos informacion del usuarios
                let lineaDetail = await script_global.consultarEntidadId(formContext.data.entity.getId().slice(1, 37), formContext.data.entity.getEntityName());
                let productoId = await script_global.consultarEntidadId(productid.getAttribute().getValue()[0].id, "product");
                let resusuario = await script_global.consultarEntidadId(lineaDetail._ownerid_value, "systemuser");


                if (resusuario) {

                    let nombreUnidadDeNegocio = resusuario["_businessunitid_value@OData.Community.Display.V1.FormattedValue"];

                    //unidad de negocio por producto toca cambiar el nombre del campo despues
                    let unidadUsuario = await script_global.consultarEntidadId(productoId._invt_unidaddenegocio_value, "businessunit");

                    if (unidadUsuario) {

                        let porcentajeDescuento = unidadUsuario.invt_porcentajededescuento;
                        let nomUnidadNegocio = unidadUsuario.name;

                        if (nomUnidadNegocio === "SICEX") {
                            if (invt_descuentopor.getValue() > porcentajeDescuento) {

                                let resultado = await script_global.enviarAlertaDeDialogo("Ok", "No puede superar el " + porcentajeDescuento + "% de descuento para los productos o servicios que esten bajo la unidad de negocio de " + nomUnidadNegocio + " si desea obtener un mayor descuento solicite un descuento", "Descuento mayor a " + porcentajeDescuento + "%");
                                if (resultado) invt_descuentopor.setValue(0);
                            }
                        }
                        //VALIDAMOS SICEX
                        //valor DAECO  124510001
                        if (nomUnidadNegocio === "DAECO") {

                            if (invt_descuentopor.getValue() > porcentajeDescuento) {
                                let resultado = await script_global.enviarAlertaDeDialogo("Ok", "No puede superar el " + porcentajeDescuento + "% de descuento para los productos o servicios que esten bajo la unidad de negocio de " + nomUnidadNegocio + " si desea obtener un mayor descuento solicite un descuento", "Descuento mayor a" + porcentajeDescuento + "%");
                                if (resultado) invt_descuentopor.setValue(0);
                            }
                        }
                    }
                    //validamos la unidad de negocio.
                }
            } else {
                console.log("No vino nada");
                let res = await script_global.enviarAlertaDeDialogo("OK", "Guarde el registro para poder diligenciar el descuento en la oferta")
                console.log(res);
                if (res) invt_descuentopor.setValue(0);
            }
        } catch (error) {
            console.log(error);
        }
    },

    //no se esta utilizando esta funcion
    enviarCorreoSolicitandoDescuento: async function (executionContext) {
        try {


            let url = "https://prod-03.brazilsouth.logic.azure.com:443/workflows/333404c4478444188eb89b82c628b4a2/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Mx84kI3xQP90YRq_vUtLxq2RWzfiOxO0OfIuap4rJOI";

            let formContext = executionContext.getFormContext();

            let invt_enviarcorreosolicitandodescuento = formContext.getControl("invt_enviarcorreosolicitandodescuento");
            // NO 124510001
            // SI 124510000
            if (invt_enviarcorreosolicitandodescuento.getAttribute().getValue() === 1) {

                let respuesta = await script_global.enviarAlertaDeConfirmacionDeDialogo("Confirmar el envio del correo", "Estas seguro que deseas enviar el correo para solicitar el descuento en la oferta con #" + formContext.getAttribute("quotenumber").getValue() +
                    "al gerente comercial y coordinador de la empresa", "Validacion de envio de correo electronico");
                if (respuesta) {

                    //llama al flujo de power automate que enviara el correo electronico;
                    var entity = {};
                    entity.id = Xrm.Page.data.entity.getId().slice(1, 37);
                    entity.descuento_solicitado = Xrm.Page.getAttribute("invt_descuentoqh").getValue()
                    entity.unidadDeNegocio = Xrm.Page.getAttribute("invt_unidaddenegocio").getValue();
                    //
                    let req = new XMLHttpRequest();

                    req.open("POST", url, true);
                    req.setRequestHeader("OData-MaxVersion", "4.0");
                    req.setRequestHeader("OData-Version", "4.0");
                    req.setRequestHeader("Accept", "application/json");
                    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                    req.onreadystatechange = function () {
                        ""

                        if (this.readyState === 4) {
                            req.onreadystatechange = null;
                            if (this.status === 204) {
                                //Success - No Return Data - Do Somethingth

                            } else {

                            }
                        }
                    };
                    req.send(JSON.stringify(entity));
                    formContext.data.entity.save();
                } else {
                    console.log(respuesta);

                    //invt_enviarcorreosolicitandodescuento.getAttribute().setValue(2);
                    formContext.getAttribute("description").setValue("SI");
                    invt_enviarcorreosolicitandodescuento.getAttribute().setValue(2);
                    Xrm.Utility.openEntityForm("quote", Xrm.Page.data.entity.getId());
                }
            }
        } catch (error) {
            console.log(error);
        }
    },


    ejecutarFormulario: function (executionContext) {
        //Xrm.Page.getAttribute("invt_enviarcorreosolicitandodescuento").setSubmitMode("always");

        var cs = Xrm.Page.ui.controls.get();
        for (var i in cs) {
            var c = cs[i];
            if (c.getName() != "" && c.getName() != null) {

                if (Xrm.Page.getAttribute(c['_controlName']) != null) {
                    Xrm.Page.getAttribute(c['_controlName']).setSubmitMode("always");
                }
                //c.getAttribute().setSubmitMode("always");
            }
        }
    },

    //esta funcion se ejecuta cuando se presiona el boton solicitar descuento en las ofetas
    ejecutarBotonSolicitud: async function (executionContext) {

        try {



            let id = Xrm.Page.data.entity.getId().slice(1, 37);



            console.log("Entro");
            //realizamos declaracion de contexto y campos

            let formContext = executionContext;

            let invt_descuentopor = formContext.getControl("invt_descuentopor");
            let invt_solicitardescuento = formContext.getControl("invt_solicitardescuento");
            let invt_descuentosolicitado = formContext.getControl("invt_descuentosolicitado");
            let invt_descuentoactual = formContext.getControl("invt_descuentoactual");
            let invt_controldescuentosolicitado = formContext.getControl("invt_controldescuentosolicitado");



            let ownerid = formContext.getAttribute("ownerid");
            let invt_solicituddedescuento = formContext.getControl("invt_solicituddedescuento");
            let invt_descuentoqh = formContext.getControl("invt_descuentoqh");

            //URL DEL ENTORNO DE DESARROLLO
            //let url = "https://prod-03.brazilsouth.logic.azure.com:443/workflows/333404c4478444188eb89b82c628b4a2/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Mx84kI3xQP90YRq_vUtLxq2RWzfiOxO0OfIuap4rJOI";

            //URL DE ENTORNO DE PRODUCCION
            let url = "https://prod-12.brazilsouth.logic.azure.com:443/workflows/27efddc211634d4a952ea95ae1af51c9/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=XkJpHb6__xnisOPY355TtE_fLM_BvR51XC4QYwr0swk";
            let estado;

            if (id) {

                let resLineaDeOferta = await script_global.consultarEntidadId(id, Xrm.Page.data.entity.getEntityName());

                if (resLineaDeOferta._invt_descuentoactual_value) {
                    let resSolDes = await script_global.consultarEntidadId(resLineaDeOferta._invt_descuentoactual_value, "invt_aprobaciondedescuentos");
                    estado = resSolDes['statuscode@OData.Community.Display.V1.FormattedValue'];
                }


                //validamos si existe alguna solicitud pendiente
                if (resLineaDeOferta.invt_controldescuentosolicitado === true && (estado === "Aprobada" || estado === "En Aprobacion")) {

                    script_global.enviarAlertaDeDialogo("Ok", "En este momento existe una solicitud de descuento en estado " + estado + ".");
                    
                    //realizamos solicitud de descuento
                } else {

                    //obetenemos la informacion del usuario
                    //let resusuario = await script_global.consultarEntidadId(ownerid.getValue()[0].id.slice(1, 37), ownerid.getValue()[0].entityType);
                    let resusuario = await script_global.consultarEntidadId(resLineaDeOferta._ownerid_value, "systemuser");

                    //validamos que si venga la informacion del usuario
                    if (resusuario) {

                        //obetenemos el nombre de la unidad de negocio
                        let nombreUnidadDeNegocio = resusuario["_businessunitid_value@OData.Community.Display.V1.FormattedValue"];

                        //obtenemos los datos de la unidad de negocio del propietario
                        let unidadUsuario = await script_global.consultarEntidadId(resusuario._businessunitid_value, "businessunit");

                        if (unidadUsuario) {
                            let porcentajeDescuento = unidadUsuario.invt_porcentajededescuento;
                            let nomUnidadNegocio = unidadUsuario.name;

                            if (invt_solicitardescuento.getAttribute().getValue() === true && invt_descuentosolicitado.getAttribute().getValue() > porcentajeDescuento) {

                                //formContext.data.entity.save();


                                let saveOptions = {
                                    saveMode: 1,
                                    useSchedulingEngine: true
                                };

                                let save = await Xrm.Page.data.save(saveOptions);



                                var entity = {}

                                entity.id = Xrm.Page.data.entity.getId().slice(1, 37);

                                //iniciamos  solicitud 
                                let req = new XMLHttpRequest();

                                req.open("POST", url, true);
                                req.setRequestHeader("OData-MaxVersion", "4.0");
                                req.setRequestHeader("OData-Version", "4.0");
                                req.setRequestHeader("Accept", "application/json");
                                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                                req.onreadystatechange = async function () {
                                    ""
                                    if (this.readyState === 4) {
                                        req.onreadystatechange = null;

                                        if (this.status === 204 || this.status === 202 || this.status === 200) {

                                            //Success - No Return Data - Do Somethingth
                                            let resultado = await script_global.enviarAlertaDeDialogo("Ok", "Solicitud creada con exito");

                                            if (resultado) {
                                                formContext.data.refresh(true);
                                            }
                                        } else {
                                            let resultado = await script_global.enviarAlertaDeDialogo("Ok", "No se pudo crear la solicitud. intente nuevamente.");
                                            if (resultado) {
                                                formContext.data.refresh(true);
                                            }
                                        }
                                    }
                                };
                                req.send(JSON.stringify(entity));
                            } else {
                                let resultado = await script_global.enviarAlertaDeDialogo("Ok", "Necesita diligenciar el campo Solicitar descuento y Descuento solicitado con un valor mayor de " + porcentajeDescuento + "%");
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    },

    validarUnidadDeNegocioLineaDeOferta: async function (executionContext) {

        try {

            let formContext = executionContext.getFormContext();
            let quoteid = formContext.getControl("quoteid");
            let invt_tipodecompra = formContext.getControl("invt_tipodecompra");
            let invt_periododeiniformanciaosuscripciondesde = formContext.getControl("invt_periododeiniformanciaosuscripciondesde");
            let invt_periododeinformacionosuscripcionhasta = formContext.getControl("invt_periododeinformacionosuscripcionhasta");
            //obtener unidad de negocio propietaria de la liena de oferta
            let infoOferta = await script_global.consultarEntidadId(quoteid.getAttribute().getValue()[0].id.slice(1, 37), quoteid.getAttribute().getValue()[0].entityType);
            console.log(infoOferta);
            //validamos que venga la informacion de la oferta
            if (infoOferta) {

                //capturamos el nombre de la unidad de negocio
                let nameUnidadDeNegocio = infoOferta['_owningbusinessunit_value@OData.Community.Display.V1.FormattedValue'];
                console.log(nameUnidadDeNegocio);
                let _owningbusinessunit_value = infoOferta['_owningbusinessunit_value'];
                console.log(_owningbusinessunit_value);

                let consultatUnidadDeNegocio = await script_global.consultarEntidadId(_owningbusinessunit_value, "businessunit");

                console.log(consultatUnidadDeNegocio);

                //logica de campos unidad de negocio SICEX
                if (consultatUnidadDeNegocio.name === "SICEX") {
                    invt_periododeiniformanciaosuscripciondesde.getAttribute().setRequiredLevel("required");
                    invt_periododeinformacionosuscripcionhasta.getAttribute().setRequiredLevel("required");
                }
                //logica de campos unidad de negocio DAECO
                if (consultatUnidadDeNegocio.name === "DAECO") {
                    invt_periododeiniformanciaosuscripciondesde.getAttribute().setRequiredLevel("none");
                    invt_periododeinformacionosuscripcionhasta.getAttribute().setRequiredLevel("none");
                }
            }
        } catch (error) {
            console.log(error);
        }
    },

    validarPeriodoDeInfomacionDesde: async function (executionContext) {
        try {

            let formContext = executionContext.getFormContext();
            let invt_periododeiniformanciaosuscripciondesde = formContext.getControl("invt_periododeiniformanciaosuscripciondesde");
            let invt_tipodecompra = formContext.getControl("invt_tipodecompra");
            let fechaDia = new Date();
            let fNewDateC = new Date(`${fechaDia.getFullYear()}-${fechaDia.getMonth() + 1}-${fechaDia.getDate()}`);


            if (invt_tipodecompra.getAttribute().getValue() === 1) {
                if (invt_periododeiniformanciaosuscripciondesde.getAttribute().getValue()) {
                    let fechaInformacionDesde = invt_periododeiniformanciaosuscripciondesde.getAttribute().getValue() ? invt_periododeiniformanciaosuscripciondesde.getAttribute().getValue() : null;
                    let fCompletaDesde = fechaInformacionDesde ? new Date(`${fechaInformacionDesde.getFullYear()}-${fechaInformacionDesde.getMonth() + 1}-${fechaInformacionDesde.getDate()}`) : null;

                    if (fCompletaDesde.getTime() > fNewDateC.getTime() || fCompletaDesde.getTime() === fNewDateC.getTime()) {
                        await script_global.enviarAlertaDeDialogo("Ok", "La fecha asignada en el campo Periodo de informacion o suscripcion desde no puede ser igual a la fecha de hoy o mayor si el tipo de compra es esporadica");
                        invt_periododeiniformanciaosuscripciondesde.getAttribute().setValue();
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    },

    validarFechasProductosLineaOferta: async function (executionContext) {
        try {

            //124510000 - esporadica

            //declaramos campos de la linea de oferta
            let formContext = executionContext.getFormContext();
            let quoteid = formContext.getControl("quoteid");
            let invt_tipodecompra = formContext.getControl("invt_tipodecompra");
            let invt_periododeiniformanciaosuscripciondesde = formContext.getControl("invt_periododeiniformanciaosuscripciondesde");
            let invt_periododeinformacionosuscripcionhasta = formContext.getControl("invt_periododeinformacionosuscripcionhasta");
            let fechaDia = new Date();

            if (invt_tipodecompra.getAttribute().getValue() === 1) {

                let fechaInformacionDesde = invt_periododeiniformanciaosuscripciondesde.getAttribute().getValue() ? invt_periododeiniformanciaosuscripciondesde.getAttribute().getValue() : null;
                let fechaInformacionHasta = invt_periododeinformacionosuscripcionhasta.getAttribute().getValue() ? invt_periododeinformacionosuscripcionhasta.getAttribute().getValue() : null;

                let fCompletaDesde = fechaInformacionDesde ? new Date(`${fechaInformacionDesde.getFullYear()}-${fechaInformacionDesde.getMonth() + 1}-${fechaInformacionDesde.getDate()}`) : null;
                let fCompletaHasta = fechaInformacionHasta ? new Date(`${fechaInformacionHasta.getFullYear()}-${fechaInformacionHasta.getMonth() + 1}-${fechaInformacionHasta.getDate()}`) : null;
                let fNewDateC = new Date(`${fechaDia.getFullYear()}-${fechaDia.getMonth() + 1}-${fechaDia.getDate()}`);

                //validamos que la fecha inicial contenga valores
                if (fechaInformacionDesde) {
                    if (fCompletaDesde.getTime() > fCompletaHasta.getTime() || fCompletaDesde.getTime() === fCompletaHasta.getTime()) {
                        await script_global.enviarAlertaDeDialogo("Ok", "La fecha asignada en el campo Periodo de informacion o suscripcion hasta no puede ser menor al campo Periodo de informacion o suscripncion desde");
                        //Si el tipo de compra es Esporadica el campo periodo de informacion suscripcion hasta no puede ser menor al campo fecha de informacion suscripcion desde");
                        invt_periododeinformacionosuscripcionhasta.getAttribute().setValue(null);
                    }

                    if (fCompletaHasta.getTime() === fNewDateC.getTime() || fCompletaHasta.getTime() > fNewDateC.getTime()) {
                        await script_global.enviarAlertaDeDialogo("Ok", "La fecha asignada en el campo Periodo de informacion o suscripcion hasta no puede ser igual o mayor a la fecha actual cuando el tipo de compra es esporadica");
                        invt_periododeinformacionosuscripcionhasta.getAttribute().setValue(null);
                    }
                }
                if (fechaInformacionDesde === null && fechaInformacionHasta != null) {
                    await script_global.enviarAlertaDeDialogo("Ok", "Para asignar un valor en el campo Periodo de  informacion o suscripcion hasta, debe diligenciar primero el campo Periodo de facturacion o suscripcion desde");
                    invt_periododeinformacionosuscripcionhasta.getAttribute().setValue(null);
                }
            }
        } catch (error) {
            console.log(error);
        }
    },


    validarFechaDeFacturacionLineaOferta: async function (executionContext) {

        try {

            let formContext = executionContext.getFormContext();
            let invt_periododefacturaciondesde = formContext.getControl("invt_periododefacturaciondesde");
            let invt_periododefacturacionhasta = formContext.getControl("invt_periododefacturacionhasta");


            let periododefacturaciondesde = invt_periododefacturaciondesde.getAttribute().getValue() ? invt_periododefacturaciondesde.getAttribute().getValue().getTime() : null;
            let periododefacturacionhasta = invt_periododefacturacionhasta.getAttribute().getValue() ? invt_periododefacturacionhasta.getAttribute().getValue().getTime() : null;
            let fechaDia = new Date().getTime();


            if (periododefacturaciondesde) {

                if (periododefacturaciondesde > periododefacturacionhasta) {
                    await script_global.enviarAlertaDeDialogo("Ok", "La fecha asignada al campo Perido  de facturacion hasta no puede ser menor o igual al campo Periodo de facturacion desde");
                    invt_periododefacturacionhasta.getAttribute().setValue(null);
                }
            }


            if (periododefacturaciondesde === null && periododefacturacionhasta != null) {
                await script_global.enviarAlertaDeDialogo("Ok", "Debe seleccionar la fecha de facturacion desde para poder completar la fecha de facturacion hasta.");
                invt_periododefacturacionhasta.getAttribute().setValue(null);
            }
        } catch (error) {
            console.log(error);
        }
    },


    //no se esta utilizando
    capturarClaveParaCampos: async function (executionContext) {
        try {
            let formContext = executionContext.getFormContext();
            let invt_tipodecompra = formContext.getControl("invt_tipodecompra");
            let invt_periododeiniformanciaosuscripciondesde = formContext.getControl("invt_periododeiniformanciaosuscripciondesde");
            let invt_periododeinformacionosuscripcionhasta = formContext.getControl("invt_periododeinformacionosuscripcionhasta");
            let invt_frecuenciadefacturacion = formContext.getControl("invt_frecuenciadefacturacion");

            if (formContext.ui.getFormType() === 1) {
                if (invt_periododeiniformanciaosuscripciondesde.getAttribute().getValue() && invt_periododeinformacionosuscripcionhasta.getAttribute().getValue()) {
                    formContext.getAttribute("invt_fechasunidas").setValue(invt_periododeiniformanciaosuscripciondesde.getAttribute().getValue().getTime().toString().concat(invt_periododeinformacionosuscripcionhasta.getAttribute().getValue().getTime().toString()))
                }
                formContext.getAttribute("invt_tipodecompraytipofactura").setValue(invt_tipodecompra.getAttribute().getValue().toString().concat(invt_frecuenciadefacturacion.getAttribute().getValue()[0].name));
            }
        } catch (error) {
            console.log(error);
        }
    },
    //no se esta utilizando
    prevenirGuardarProductosRepetidos: async function (executionContext) {

        try {
            let formContext = executionContext.getFormContext();
            let productid = formContext.getAttribute("productid");
            let invt_tipodecompra = formContext.getAttribute("invt_tipodecompra");
            let invt_frecuenciadefacturacion = formContext.getAttribute("invt_frecuenciadefacturacion");
            let invt_periododeiniformanciaosuscripciondesde = formContext.getAttribute("invt_periododeiniformanciaosuscripciondesde");
            let invt_periododeinformacionosuscripcionhasta = formContext.getAttribute("invt_periododeinformacionosuscripcionhasta");
            let quoteid = formContext.getAttribute("quoteid");


            let id = quoteid.getValue()[0].id;
            //"2022-05-23";
            let fechaDesde = invt_periododeiniformanciaosuscripciondesde.getValue().getFullYear() + "-" + (invt_periododeiniformanciaosuscripciondesde.getValue().getMonth() + 1) + "-" + invt_periododeiniformanciaosuscripciondesde.getValue().getDate()
            let fechaHasta = invt_periododeinformacionosuscripcionhasta.getValue().getFullYear() + "-" + (invt_periododeinformacionosuscripcionhasta.getValue().getMonth() + 1) + "-" + invt_periododeinformacionosuscripcionhasta.getValue().getDate()


            console.log(fechaDesde);
            console.log(fechaHasta);
            //executionContext.getEventArgs().preventDefault();
            Xrm.WebApi.retrieveMultipleRecords("quotedetail", "?$filter=(_quoteid_value eq " + id + " and invt_tipodecompra eq " + invt_tipodecompra.getValue() + " and _invt_frecuenciadefacturacion_value eq " + invt_frecuenciadefacturacion.getValue()[0].id +
                " and Microsoft.Dynamics.CRM.On(PropertyName='invt_periododeiniformanciaosuscripciondesde',PropertyValue='" + fechaDesde + "') and Microsoft.Dynamics.CRM.On(PropertyName='invt_periododeinformacionosuscripcionhasta',PropertyValue=' " + fechaHasta + "') and _productid_value eq " + productid.getValue()[0].id + ")")
                .then(
                    function success(result) {
                        // perform operations on on retrieved records
                        if (result.entities.length > 1) {
                            console.log(result.entities.length);
                            executionContext.getEventArgs().preventDefault();
                        }
                    },
                    function (error) {
                        console.log(error.message);
                        // handle error conditions
                    }
                );



        } catch (error) {

        }
    },

    ejecutarBotonSolicitud2: async function (executionContext) {

        try {



            let id = Xrm.Page.data.entity.getId().slice(1, 37);



            console.log("Entro");
            //realizamos declaracion de contexto y campos
            let formContext = executionContext;
            let ownerid = formContext.getAttribute("ownerid");
            let invt_solicituddedescuento = formContext.getControl("invt_solicituddedescuento");
            let invt_descuentoqh = formContext.getControl("invt_descuentoqh");

            //URL DEL ENTORNO DE DESARROLLO
            //let url = "https://prod-03.brazilsouth.logic.azure.com:443/workflows/333404c4478444188eb89b82c628b4a2/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Mx84kI3xQP90YRq_vUtLxq2RWzfiOxO0OfIuap4rJOI";

            //URL DE ENTORNO DE PRODUCCION
            let url = "https://prod-12.brazilsouth.logic.azure.com:443/workflows/27efddc211634d4a952ea95ae1af51c9/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=XkJpHb6__xnisOPY355TtE_fLM_BvR51XC4QYwr0swk";
            let estado;

            if (id) {

                let resOferta = await script_global.consultarEntidadId(id, Xrm.Page.data.entity.getEntityName());

                if (resOferta._invt_descuentosolicitado_value) {
                    let resSolDes = await script_global.consultarEntidadId(resOferta._invt_descuentosolicitado_value, "invt_aprobaciondedescuentos");
                    estado = resSolDes['statuscode@OData.Community.Display.V1.FormattedValue'];
                }


                //validamos si existe alguna solicitud pendiente
                if (resOferta.invt_descuentosolicitadocampooculto === true) {
                    script_global.enviarAlertaDeDialogo("Ok", "En este momento existe una solicitud de descuento en estado " + estado + ".");

                    //realizamos solicitud de descuento
                } else {

                    //obetenemos la informacion del usuario
                    let resusuario = await script_global.consultarEntidadId(ownerid.getValue()[0].id.slice(1, 37), ownerid.getValue()[0].entityType);

                    //validamos que si venga la informacion del usuario
                    if (resusuario) {

                        //obetenemos el nombre de la unidad de negocio
                        let nombreUnidadDeNegocio = resusuario["_businessunitid_value@OData.Community.Display.V1.FormattedValue"];

                        //obtenemos los datos de la unidad de negocio del propietario
                        let unidadUsuario = await script_global.consultarEntidadId(resusuario._businessunitid_value, "businessunit");

                        if (unidadUsuario) {
                            let porcentajeDescuento = unidadUsuario.invt_porcentajededescuento;
                            let nomUnidadNegocio = unidadUsuario.name;

                            if (invt_solicituddedescuento.getAttribute().getValue() === true && invt_descuentoqh.getAttribute().getValue() > porcentajeDescuento) {

                                //formContext.data.entity.save();


                                let saveOptions = {
                                    saveMode: 1,
                                    useSchedulingEngine: true
                                };

                                let save = await Xrm.Page.data.save(saveOptions);



                                var entity = {}

                                entity.id = Xrm.Page.data.entity.getId().slice(1, 37);

                                //iniciamos  solicitud 
                                let req = new XMLHttpRequest();

                                req.open("POST", url, true);
                                req.setRequestHeader("OData-MaxVersion", "4.0");
                                req.setRequestHeader("OData-Version", "4.0");
                                req.setRequestHeader("Accept", "application/json");
                                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                                req.onreadystatechange = async function () {
                                    ""
                                    if (this.readyState === 4) {
                                        req.onreadystatechange = null;

                                        if (this.status === 204 || this.status === 202 || this.status === 200) {

                                            //Success - No Return Data - Do Somethingth
                                            let resultado = await script_global.enviarAlertaDeDialogo("Ok", "Solicitud creada con exito");

                                            if (resultado) {
                                                formContext.data.refresh(true);
                                            }
                                        } else {
                                            let resultado = await script_global.enviarAlertaDeDialogo("Ok", "No se pudo crear la solicitud. intente nuevamente.");
                                            if (resultado) {
                                                formContext.data.refresh(true);
                                            }
                                        }
                                    }
                                };
                                req.send(JSON.stringify(entity));
                            } else {
                                let resultado = await script_global.enviarAlertaDeDialogo("Ok", "Necesita diligenciar el campo Solicitar descuento y Descuento solicitado con un valor mayor de " + porcentajeDescuento + "%");
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}
