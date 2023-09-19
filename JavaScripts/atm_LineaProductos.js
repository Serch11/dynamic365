var id_regladescuentos = new Array();

if (typeof VENTAS === "undefined") {
    VENTAS = {};
    VENTAS.JS = {};
}

if (typeof VENTAS.JS === "undefined") {
    VENTAS.JS = {};
}

VENTAS.JS.LineaProducto = {};

const LD = {
    NOMBREENTIDAD: "",
    CAMPOS: {
        PRODUCTID: "productid",
        PRICEPERUNIT: "priceperunit",
        QUANTITY: "quantity",
        TAX: "tax",
        UOMID: "uomid",
        EXTENDEDAMOUNT: "extendedamount",
        BASEAMOUNT: "baseamount",
        ATM_DESCUENTOMONTO: "atm_descuentomonto",
        ATM_DESCUENTOPORCENTAJE: "atm_descuentoporcentaje",
        ATM_DESCUENTOAUTORIZADOCODE: "atm_descuentoautorizado",
        ATM_FECHAPROBACIONRECHAZADA: "atm_fechaprobacionrechazada",//atm_fechadeaprobacionrechazada
        ATM_USUARIOAPRUEBARECHAZAID: "atm_usuarioapruebarechazaid",//atm_usuarioapruebarechazaid
        ATM_IMPORTEIVA: "atm_importeiva",
        ATM_MARCA: "atm_marca",
        ATM_CODIGOPRODUCTO: "atm_codigoproducto",
        ISPRICEOVERRIDDEN: "ispriceoverridden",
        ATM_IMPORTE: "atm_importe",
        MANUALDISCOUNTAMOUNT: "manualdiscountamount",
        ATM_PRECIOUNIDADBASE: "atm_preciounidadbase",
        ATM_DESCUENTOTOTALAUTOMATICO: "atm_descuentototalautomatico",
        ATM_DESCTOTALAUTOMATICOPORCENTAJE: "atm_desctotalautomaticoporcentaje",
        ATM_TIPOOPERACIONCODE: "atm_tipooperacioncode",
        ATM_PRECIOSOLICITADO: "atm_preciosolicitado",
        ATM_PRECIOUNIDADDESAUTOMATICO: "atm_preciounidaddesautomatico",
        ATM_DESCUENTOSAPLICADOS: "atm_descuentosaplicados",
        ATM_DESCUENTOTOTAL: "atm_descuentototal",
        ATM_DESCUENTOTOTALPORCENTAJE: "atm_descuentototalporcentaje",
        ATM_IMPUESTO: "atm_impuesto"
    },
    ATM_TIPOPERACIONCODE: {
        CALCULARPORMONTO: 1001,
        CALCULARPORPORCENTAJE: 1002,
        CALCULARPORPRECIO: 1003
    },
    AUXILIAR: 0
};

const CAMPOSUTIL = {
    PRODUCT: "product",
    ATM_SEMSICECODE: "atm_semsicecode",
    ATM_CLIENTETUCAMION: "atm_clientetucamion",
    ATM_PAIS: "atm_pais",
    ACCOUNT: "account",
    ATM_CATEGORIA: "atm_categoria",
    ATM_RIN: "atm_rin",
    ATM_DIMENSION: "atm_dimension",
    ATM_SUBCATEGORIA: "atm_subcategoria",
    ATM_MARCA: "atm_marca",
    ATM_TIER: "atm_tier",
    ATM_CONDICIONPAGO: "atm_condicionpago",
    ATM_REGIONAL: "atm_regional",
    ATM_PUNTOVENTACODE: "atm_puntoventacode"
}

const ALCANCENOMBRE = {
    SEGMENTO: "Segmento",
    CLIENTE: "Cliente",
    CATEGORIA: "Categoría",
    DIMENSIÓN: "Dimensión",
    FORMADEPAGO: "Forma de pago",
    MARCA: "Marca",
    PRODUCTO: "Producto",
    RIN: "Rin",
    REGIONAL: "Regional",
    SUBCATEGORÍA: "Subcategoría",
    TIER: "Tier",
    CLIENTETUCAMION: "¿Cliente TuCamion?",
    PUNTOVENTA: "Punto de venta",
    VENTAEXTERNA: "ventaexterna"
}

const DV = {
    NOMBRE_LOGICO: "atm_descuentovolumenregladescuento",
    CAMPOS: {
        ATM_REGLADESCUENTOID: "atm_regladescuentoid",
        ATM_CANTIDADINICIAL: "atm_cantidadinicial",
        ATM_CANTIDADFINAL: "atm_cantidadfinal",
        ATM_REGLADESCUENTOSID: "atm_regladescuentosid"
    }
}

const UNIQUEID = {
    ATM_CLIENTEREGLADESCUENTOSID: "atm_clienteregladescuentosid",
    ATM_CATEGORIASREGLADESCUENTOSID: "atm_categoriasregladescuentosid",
    ATM_DIMENSIONREGLADESCUENTOID: "atm_dimensionregladescuentoid",
    ATM_FORMAPAGOSREGLADESCUENTOID: "atm_formapagosregladescuentoid",
    ATM_MARCASREGLADESCUENTOID: "atm_marcasregladescuentoid",
    ATM_PRODUCTOREGLADESCUENTOID: "atm_productoregladescuentoid",
    ATM_REGIONALESREGLADESCUENTOID: "atm_regionalesregladescuentoid",
    ATM_RINESREGLADESCUENTOID: "atm_rinesregladescuentoid",
    ATM_SUBCATEGORIAREGLADESCUENTOID: "atm_subcategoriaregladescuentoid",
    ATM_TIERSREGLADESCUENTOID: "atm_tiersregladescuentoid",
    ATM_REGLADESCUENTOSID: "atm_regladescuentosid",
}

let CONSULTAS = {
    CONS_RD: `?$select=atm_nombre,atm_alcancecode,atm_envigordesde,atm_envigorhasta,atm_segmentocode,atm_tipo,atm_tiporeglacode,atm_paisid,atm_porcentaje,atm_monto&$filter=(statuscode eq {0} and _atm_paisid_value eq {1})`,
    CONS_PRODUCTPRICELEVEL: `?$select=atm_cuotarf10,atm_cuotarf4,atm_cuotarf5,atm_cuotarf6,atm_cuotarf7,atm_cuotarf8,atm_cuotarf9,amount,atm_importeiva,roundingoptionamount&$filter=(_pricelevelid_value eq {0}  and _productid_value eq {1})`,
    CONS_UBICACION: "?$select=_atm_regionalid_value,_atm_paisid_value&$expand=atm_regionalid($select=_atm_directorregional_value),atm_paisid($select=_atm_gerentepaisid_value)&$filter=(accountid eq {0}) and (atm_regionalid/atm_regionalid ne null) and (atm_paisid/atm_paisid ne null)",
    CONS_ROLDESCUENTO: "?$select=atm_consecutivo,atm_descuentorolid,atm_monto,atm_nombre,atm_porcentaje,_atm_rolid_value&$filter=(_atm_regladescuentoid_value eq {0})"

}

function saberCampoEntidad(nombreEntidad) {
    let campoid = "";
    switch (nombreEntidad) {
        case "opportunityproduct":
            campoid = "opportunityid";
            break;
        case "quotedetail":
            campoid = "quoteid"
            break;
        default:
            break;
    }
    return campoid;
}

VENTAS.JS.LineaProducto.OnLoad = async function (executionContext) {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();
        LD.NOMBREENTIDAD = formContext.data.entity.getEntityName()
        let campoid = saberCampoEntidad(formContext.data.entity.getEntityName());
        let entidadesrelacionadas = formContext.getAttribute(campoid)?.getValue();
        let productid = formContext.getAttribute(LD.CAMPOS.PRODUCTID)?.getValue();

        formContext.getAttribute(LD.CAMPOS.ISPRICEOVERRIDDEN).setValue(true);
        formContext.getControl(LD.CAMPOS.PRICEPERUNIT).setDisabled(true);

        console.log("EJECUTANDO ONLOAD");



        ////////////////////////////////////////////////////////////////
        if (FORM_TYPE.UPDATE === formContext.ui.getFormType()) {
            let ObjetoEntidades = await VENTAS.JS.LineaProducto.ObjetoEntidades(entidadesrelacionadas, productid);
            if (ObjetoEntidades.entidadrelacionada.statecode === 0) {
                let lista_reglas_descuentos = await VENTAS.JS.Comun.ConsultarMultiplesEntidades(RD.NOMBRE_LOGICO, CONSULTAS.CONS_RD.replace("{0}", RD.OPCIONES.STATUSCODE.APROBADO).replace("{1}", ObjetoEntidades.entidades.pais.data));
                if (lista_reglas_descuentos?.entities?.length > 0) {
                    let lista_rd_aplicable_fecha = await VENTAS.JS.LineaProducto.ValidarReglaDescuendoEntreLaFechaDelDia(lista_reglas_descuentos);
                    if (lista_rd_aplicable_fecha?.length > 0) {
                        let lista_rd_aplicables = await VENTAS.JS.LineaProducto.ValidarReglasAplicables(lista_rd_aplicable_fecha, ObjetoEntidades);
                        if (lista_rd_aplicables?.length > 0) {
                            let lista_rd_tipo = await VENTAS.JS.LineaProducto.DividirDescuentoPorTipo(lista_rd_aplicables, formContext, RD.CAMPOS.ATM_TIPOREGLACODE);
                            console.log(lista_rd_tipo);
                            let valores = Object.keys(lista_rd_tipo);
                            for await (const codigo of valores) {
                                if (Number(codigo) === RD.TIPOREGLA.AUTORIZACION) {
                                    formContext.getControl(LD.CAMPOS.ATM_TIPOOPERACIONCODE).setDisabled(false);
                                    await SwitchHabilitatoDesabilitarCampos(formContext.getAttribute(LD.CAMPOS.ATM_TIPOOPERACIONCODE).getValue(), executionContext);
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}
// ######################################
// Author: Sergio Redondo
// Fecha: Septiembre
// Descripcion : Esta funcion se ejecuta en el momento de que cambia el campo atm_descuentoporcentaje y atm_descuentomonto que se encuentran dentro del 
// formulario principal llamado Informacion y de creacion rapida llamado quotedetail
// ######################################
VENTAS.JS.LineaProducto.CambioEnDescuentos = async function (executionContext) {
    try {
        let formContext = executionContext.getFormContext();
        let campo = saberCampoEntidad(formContext.data.entity.getEntityName())
        let lookup = formContext.getAttribute(campo);

        if (lookup.getValue() && campo === "opportunityid") {
            let data = {};
            data.statecode = 0;
            data.statuscode = 1;
            await Xrm.WebApi.updateRecord(lookup.getValue()[0].entityType, lookup.getValue()[0].id, data);
        }
    } catch (error) {
    }
}
VENTAS.JS.LineaProducto.BloquearCampos = async function (executionContext) {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();

        if (FORM_TYPE.UPDATE === formContext.ui.getFormType()) {

            let campoid = saberCampoEntidad(LD.NOMBREENTIDAD);
            let campo = formContext.getAttribute(campoid);
            let registro = await VENTAS.JS.Comun.ConsultarRegistro(campo.getValue()[0].entityType, campo.getValue()[0].id);

            if (campoid === "quoteid") {
                if (registro.statuscode === 3 || registro.statuscode === 9 || registro.statuscode === 2) {
                    await VENTAS.JS.Comun.BloquearCamposDelFormulario(executionContext, "Solo lectura: estado de este registro: " + "Estado" + ".")
                } else {

                }
            } else if (campoid === "opportunityid") {
                if (registro.statuscode === 6) {
                    await VENTAS.JS.Comun.BloquearCamposDelFormulario(executionContext, "Solo lectura: estado de este registro: " + "Estado" + ".")
                } else {

                }
            }
        } else {

        }
    } catch (error) {

    }
}

VENTAS.JS.LineaProducto.CalcularPrecioPorFormaPago = async (executionContext) => {
    "use strict";
    try {

        let formContext = executionContext.getFormContext();
        let resultado = await ConsultarRegistrosRelacionados(executionContext, formContext.getAttribute(LD.CAMPOS.PRODUCTID))
        let preciounidadseteado = 0;
        let entidad = resultado.consultaentidad;
        let elementolistaprecio = resultado.elementolistaprecio;
        let producto = resultado.producto;
        let nombreformapago = entidad.atm_condicionpagoid.atm_nombre;
        let numerodecuotas = parseInt(entidad.atm_condicionpagoid.atm_numerocuotas);
        let tax = formContext.getAttribute(LD.CAMPOS.TAX);
        let quantity = formContext.getAttribute(LD.CAMPOS.QUANTITY);
        console.log(elementolistaprecio);
        console.log("atm_cuotarf" + numerodecuotas);
        if (!elementolistaprecio.entities[0]["atm_cuotarf" + numerodecuotas]) {
            VENTAS.JS.Comun.OpenAlerDialog("Ok", "Este producto no tiene precios para la forma de pago " + nombreformapago + " se colocara el precio por unidad por defecto de la lista de precios");
        } else {
            while (formContext.getAttribute(LD.CAMPOS.PRICEPERUNIT).getValue() != preciounidadseteado && LD.AUXILIAR <= 3) {

                formContext.getAttribute(LD.CAMPOS.ISPRICEOVERRIDDEN).setValue(true);
                formContext.getControl(LD.CAMPOS.PRICEPERUNIT).setDisabled(true);

                switch (nombreformapago.trim()) {

                    case "RUEDA FACIL 4 MESES":
                        preciounidadseteado = elementolistaprecio.entities[0].atm_cuotarf4 * numerodecuotas;
                        break;
                    case "RUEDA FACIL 5 MESES":
                        preciounidadseteado = elementolistaprecio.entities[0].atm_cuotarf5 * numerodecuotas;
                        break;
                    case "RUEDA FACIL 6 MESES":
                        preciounidadseteado = elementolistaprecio.entities[0].atm_cuotarf6 * numerodecuotas;
                        break;
                    case "RUEDA FACIL 7 MESES":
                        preciounidadseteado = elementolistaprecio.entities[0].atm_cuotarf7 * numerodecuotas;
                        break;
                    case "RUEDA FACIL 8 MESES":
                        preciounidadseteado = elementolistaprecio.entities[0].atm_cuotarf8 * numerodecuotas;
                        break;
                    case "RUEDA FACIL 9 MESES":
                        preciounidadseteado = elementolistaprecio.entities[0].atm_cuotarf9 * numerodecuotas;
                        break;
                    case "RUEDA FACIL 10 MESES":
                        preciounidadseteado = elementolistaprecio.entities[0].atm_cuotarf10 * numerodecuotas;
                        break;
                    default:
                        break;
                }
                console.log(preciounidadseteado);
                if (preciounidadseteado) {
                    formContext.getAttribute(LD.CAMPOS.PRICEPERUNIT).setValue(preciounidadseteado);
                    tax.setValue(quantity.getValue() * (preciounidadseteado * (producto.atm_impuesto / 100)));
                    formContext.getAttribute(LD.CAMPOS.ATM_IMPORTEIVA).setValue(preciounidadseteado + tax.getValue())
                    formContext.getAttribute(LD.CAMPOS.PRICEPERUNIT).fireOnChange();
                    LD.AUXILIAR++;
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

VENTAS.JS.LineaProducto.AlCargarMostrarAdvertenciaCotizacion = async (executionContext) => {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();
        let entidad = LD.NOMBREENTIDAD === "quote" ? "Oferta" : "Oportunidad";
        if (formContext.ui.getFormType() === FORM_TYPE.UPDATE) {

            if (formContext.getAttribute("statuscode").getValue() != 4 || formContext.getAttribute("statuscode").getValue() != 5 || formContext.getAttribute("statuscode").getValue() != 6 || formContext.getAttribute("statuscode").getValue() != 7) {
                formContext.ui.setFormNotification(`Los descuentos aplicados a cada uno de los productos de esta ${entidad} no se veran aplicado hasta que este registro sea activado`, "INFO", 'NOTIFICACION_COTIZACION');
            }

        }
    } catch (error) {
        console.log(error);
    }
}

// ######################################
// Author: Sergio Redondo
// Fecha: Agosto 23 2023
// Descripcion : esta funcion se ejecuta en el metodo onchange del campo producto en el detalle de la oferta y el detalle de la oportunidad
// ######################################
VENTAS.JS.LineaProducto.ObtenerDescuentos = async (executionContext) => {
    "use strict";
    try {

        //variable contexto de formulario 
        let formContext = executionContext.getFormContext();
        let campoid = saberCampoEntidad(formContext.data.entity.getEntityName())
        let entidadrelacionada = formContext.getAttribute(campoid).getValue();
        let priceperunit = formContext.getAttribute(LD.CAMPOS.PRICEPERUNIT);
        let productid = formContext.getAttribute(LD.CAMPOS.PRODUCTID)?.getValue();
        let cantidad = formContext.getAttribute(LD.CAMPOS.QUANTITY)?.getValue();
        let tax = formContext.getAttribute(LD.CAMPOS.TAX);
        let baseamount = formContext.getAttribute(LD.CAMPOS.BASEAMOUNT)?.getValue()

        // variables parametricas
        let listadoDescuentos = null;
        let listadoDescuentosAplicables = new Array();
        let sumaDescuentoPorMonto = 0;
        let descuento_por_porcentaje = 0;
        let precioConDescuentos = 0;
        let precio_por_unidad_base = 0;
        let descuento_automatico_total = 0;
        let descuento_en_porcentaje_automatico = 0;


        if (productid) {

            Xrm.Utility.showProgressIndicator('Aplicando descuentos');
            //logica de la funcion
            let ObjetoEntidades = await VENTAS.JS.LineaProducto.ObjetoEntidades(entidadrelacionada, productid);
            console.log(ObjetoEntidades);

            let ReglasAplicables = await VENTAS.JS.Comun.ConsultarMultiplesEntidades(RD.NOMBRE_LOGICO, CONSULTAS.CONS_RD.replace("{0}", RD.OPCIONES.STATUSCODE.APROBADO).replace("{1}", ObjetoEntidades.entidades.pais.data));
            console.log(ReglasAplicables);

            let elemento_lista_precio = await VENTAS.JS.Comun.ConsultarMultiplesEntidades("productpricelevel", CONSULTAS.CONS_PRODUCTPRICELEVEL.replace("{0}", ObjetoEntidades.listaprecioid).replace("{1}", ObjetoEntidades.entidades.producto.data));


            let precio_forma_pago = await VENTAS.JS.LineaProducto.ObtenerPrecioFormaPago(elemento_lista_precio, ObjetoEntidades.entidades.condicionpago);
            console.log(precio_forma_pago);

            precioConDescuentos = precio_forma_pago.preciounidadseteado > 0 ? precio_forma_pago.preciounidadseteado : elemento_lista_precio.entities[0].amount;
            precio_por_unidad_base = precio_forma_pago.preciounidadseteado > 0 ? precio_forma_pago.preciounidadseteado : elemento_lista_precio.entities[0].amount;

            //VALIDAR REGLAS DE DESCUENTO ENTRE EL RANGO DE FECHAS
            listadoDescuentos = await VENTAS.JS.LineaProducto.ValidarReglaDescuendoEntreLaFechaDelDia(ReglasAplicables);


            console.log(listadoDescuentos);

            if (listadoDescuentos?.length > 0) {
                //FOR EACH QUE ME PERMITA RECORRER CADA UNA DE LAS REGLAS DE DESCUENTO Y VALIDAR DE QUE SEAN APLICABLES PARA LA OFERTA.
                listadoDescuentosAplicables = await VENTAS.JS.LineaProducto.ValidarReglasAplicables(listadoDescuentos, ObjetoEntidades);
                if (listadoDescuentosAplicables?.length > 0) {
                    //OBTENER LAS REGLAS DE DESCUENTO APLICABLES POR TIPO
                    let listaDescuentoPorTipo = await VENTAS.JS.LineaProducto.DividirDescuentoPorTipo(listadoDescuentosAplicables, formContext, RD.CAMPOS.ATM_TIPOREGLACODE);
                    console.log(listaDescuentoPorTipo);

                    let valores = Object.keys(listaDescuentoPorTipo);

                    if (valores?.length > 0) {
                        for (const codigo_tiporegla of valores) {

                            switch (Number(codigo_tiporegla)) {
                                case RD.TIPOREGLA.AUTOMATICO:
                                    for await (const rd of listaDescuentoPorTipo[codigo_tiporegla]) {
                                        id_regladescuentos.push(rd[RD.CAMPOS.ATM_REGLADESCUENTOSID])
                                        if (rd[RD.CAMPOS.ATM_TIPO] == true) { sumaDescuentoPorMonto += rd[RD.CAMPOS.ATM_MONTO] } else {
                                            descuento_por_porcentaje = precioConDescuentos * (Number(rd[RD.CAMPOS.ATM_PORCENTAJE]) / 100);
                                            precioConDescuentos -= descuento_por_porcentaje;
                                        };
                                    }
                                    break;
                                case RD.TIPOREGLA.VOLUMEN:
                                    for await (const rd of listaDescuentoPorTipo[codigo_tiporegla]) {
                                        console.log(rd);

                                        let detalle_descuento_volumen = await VENTAS.JS.Comun.ConsultarMultiplesEntidades(DV.NOMBRE_LOGICO, `?$select=${DV.CAMPOS.ATM_CANTIDADINICIAL},${DV.CAMPOS.ATM_CANTIDADFINAL},${RD.CAMPOS.ATM_MONTO},${RD.CAMPOS.ATM_PORCENTAJE}&$filter=(_atm_regladescuentoid_value eq ${rd[RD.CAMPOS.ATM_REGLADESCUENTOSID]})`);
                                        console.log(detalle_descuento_volumen);
                                        if (detalle_descuento_volumen?.entities?.length > 0) {
                                            for await (const d_volumen of detalle_descuento_volumen.entities) {
                                                console.log("CANTIDAD : " + cantidad);
                                                let coincide = await VENTAS.JS.Comun.ValidarNumeroEntreDosValores(d_volumen[DV.CAMPOS.ATM_CANTIDADINICIAL], d_volumen[DV.CAMPOS.ATM_CANTIDADFINAL], cantidad);
                                                if (coincide) {
                                                    id_regladescuentos.push(rd[RD.CAMPOS.ATM_REGLADESCUENTOSID]);
                                                    if (rd[RD.CAMPOS.ATM_TIPO] == true) { sumaDescuentoPorMonto += d_volumen[RD.CAMPOS.ATM_MONTO] } else {
                                                        descuento_por_porcentaje = precioConDescuentos * (Number(d_volumen[RD.CAMPOS.ATM_PORCENTAJE]) / 100);
                                                        precioConDescuentos -= descuento_por_porcentaje;
                                                    };
                                                }
                                            }
                                        }
                                    }
                                    break;
                                case RD.TIPOREGLA.AUTORIZACION:
                                    if (listaDescuentoPorTipo[codigo_tiporegla]?.length > 0) {
                                        formContext.getControl(LD.CAMPOS.ATM_TIPOOPERACIONCODE).setDisabled(false);
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                    let precio_por_unidad_con_descuento = precioConDescuentos - sumaDescuentoPorMonto;
                    let precio_valor_descontando_automatico = precio_por_unidad_base - precio_por_unidad_con_descuento;
                    descuento_en_porcentaje_automatico = ((precio_por_unidad_base - precio_por_unidad_con_descuento) / precio_por_unidad_base) * 100

                    console.log("PRECIO POR UNIDAD BASE : " + precio_por_unidad_base);
                    console.log("PRECIO POR UNIDAD CON DESCUENTO " + precio_por_unidad_con_descuento);
                    console.log("DESCUENTO POR MONTO : " + sumaDescuentoPorMonto);
                    console.log("DESCUENTO TOTAL  : " + precio_valor_descontando_automatico);
                    console.log("DESCUENTO POR % : " + descuento_en_porcentaje_automatico);

                    formContext.getAttribute(LD.CAMPOS.ATM_PRECIOUNIDADBASE).setValue(precio_por_unidad_base);
                    formContext.getAttribute(LD.CAMPOS.ATM_PRECIOUNIDADDESAUTOMATICO).setValue(precio_por_unidad_con_descuento);
                    formContext.getAttribute(LD.CAMPOS.PRICEPERUNIT).setValue(precio_por_unidad_con_descuento);
                    formContext.getAttribute(LD.CAMPOS.ATM_DESCTOTALAUTOMATICOPORCENTAJE).setValue(Number(descuento_en_porcentaje_automatico.toFixed(2)));
                    formContext.getAttribute(LD.CAMPOS.ATM_DESCUENTOTOTALAUTOMATICO).setValue(precio_valor_descontando_automatico)


                    if (precio_forma_pago.mensaje) {
                        VENTAS.JS.Comun.MostrarNotificacionToast(4, precio_forma_pago.mensaje);
                    }

                    //DESCUENTOS APLICADOS

                    let idsrd = [...new Set(id_regladescuentos)];
                    formContext.getAttribute(LD.CAMPOS.ATM_DESCUENTOSAPLICADOS).setValue(null);
                    formContext.getAttribute(LD.CAMPOS.ATM_DESCUENTOSAPLICADOS).setValue(idsrd.join());
                } else {
                    ///SI NO HAY RD APLICABLES SE SETEA EL VALOR DE ESTOS CAMPOS IGUAL AL PRICEPERUNIT
                    formContext.getAttribute(LD.CAMPOS.ATM_PRECIOUNIDADBASE).setValue(priceperunit.getValue());
                    formContext.getAttribute(LD.CAMPOS.ATM_PRECIOUNIDADDESAUTOMATICO).setValue(priceperunit.getValue());
                }
            } else {
                ///SI NO HAY RD APLICABLES SE SETEA EL VALOR DE ESTOS CAMPOS IGUAL AL PRICEPERUNIT
                formContext.getAttribute(LD.CAMPOS.ATM_PRECIOUNIDADBASE).setValue(priceperunit.getValue());
                formContext.getAttribute(LD.CAMPOS.ATM_PRECIOUNIDADDESAUTOMATICO).setValue(priceperunit.getValue());
            }

            //ONCHANGE CANTIDAD
            if (formContext.ui.formContext.ui.getFormType() === FORM_TYPE.UPDATE) {
                Modificarvalor_campo(executionContext, [
                    { name: LD.CAMPOS.ATM_DESCUENTOMONTO, valor: null },
                    { name: LD.CAMPOS.ATM_DESCUENTOPORCENTAJE, valor: null },
                    { name: LD.CAMPOS.ATM_PRECIOSOLICITADO, valor: null },
                    { name: LD.CAMPOS.ATM_USUARIOAPRUEBARECHAZAID, valor: null },
                    { name: LD.CAMPOS.ATM_FECHAPROBACIONRECHAZADA, valor: null }
                ])
            }


            //CALCULAR EL IMPUESTO DEL PRODUCTO CREACION RAPIDA Y EL IMPORTE MAS IVA
            let valor = priceperunit.getValue() ? priceperunit.getValue() * cantidad : 0;
            let impuesto = ObjetoEntidades?.producto?.atm_impuesto ? ObjetoEntidades.producto.atm_impuesto : 0;
            let impuesto_calculado = ObjetoEntidades?.producto?.atm_impuesto ? (ObjetoEntidades.producto.atm_impuesto / 100) : 0;
            let valortax = ObjetoEntidades?.producto?.atm_impuesto ? (valor * impuesto_calculado) : 0;

            formContext.getAttribute(LD.CAMPOS.ATM_IMPUESTO).setValue(impuesto);
            tax.setValue(valortax);
            formContext.getAttribute(LD.CAMPOS.ATM_IMPORTEIVA).setValue(priceperunit.getValue() + (priceperunit.getValue() * impuesto_calculado));
            //OBTENER MARCA DEL PRODUCTO
            if (ObjetoEntidades?.producto?.hasOwnProperty("atm_marcaid") && ObjetoEntidades?.producto?.atm_marcaid !== null) {
                formContext.getAttribute(LD.CAMPOS.ATM_MARCA).setValue(ObjetoEntidades.producto.atm_marcaid.atm_nombre);
            }
            //OBTENER EL CODIGO DEL PRODUCTO
            formContext.getAttribute(LD.CAMPOS.ATM_CODIGOPRODUCTO).setValue(ObjetoEntidades.producto.atm_codigoproducto);

            //VALIDAR LA FORMA DE PAGO
            if (ObjetoEntidades?.entidades?.condicionpago?.atm_name.trim().includes("RUEDA FACIL")) {
                //VENTAS.JS.LD.CalcularPrecioPorFormaPago(executionContext);
            }
            Xrm.Utility.closeProgressIndicator();
            formContext.getControl(LD.CAMPOS.PRICEPERUNIT).setDisabled(true);
        } else {
            //BORRAR VALORES CAMPOS NO NECESARIOS
            Modificarvalor_campo(executionContext, [
                { name: LD.CAMPOS.TAX, valor: null },
                { name: LD.CAMPOS.ATM_PRECIOUNIDADDESAUTOMATICO, valor: null },
                { name: LD.CAMPOS.PRICEPERUNIT, valor: null },
                { name: LD.CAMPOS.ATM_DESCUENTOMONTO, valor: null },
                { name: LD.CAMPOS.ATM_DESCUENTOPORCENTAJE, valor: null },
                { name: LD.CAMPOS.ATM_MARCA, valor: null },
                { name: LD.CAMPOS.ATM_CODIGOPRODUCTO, valor: null },
                { name: LD.CAMPOS.ATM_PRECIOSOLICITADO, valor: null },
                { name: LD.CAMPOS.ATM_USUARIOAPRUEBARECHAZAID, valor: null },
                { name: LD.CAMPOS.ATM_FECHAPROBACIONRECHAZADA, valor: null }
            ]);
        }
    } catch (error) {
        LD.AUXILIAR = 0;
        Xrm.Utility.closeProgressIndicator();
        console.log(error);
    }
}

VENTAS.JS.LineaProducto.ObtenerPrecioFormaPago = async (elemento_lista_precio, forma_pago) => {
    "use strict";
    try {
        console.log(forma_pago)
        let preciounidadseteado = 0;
        let mensaje = null;
        let texto = "El producto seleccionado no tiene un valor para la forma de pago  " + forma_pago.atm_name.trim() + " se aplico el valor base."
        switch (forma_pago.atm_name.trim()) {

            case "RUEDA FACIL 4 MESES":
                mensaje = elemento_lista_precio.entities[0].atm_cuotarf4 ? null : texto
                preciounidadseteado = elemento_lista_precio.entities[0].atm_cuotarf4 ? elemento_lista_precio.entities[0].atm_cuotarf4 * forma_pago.atm_numerocuotas : amount;
                break;
            case "RUEDA FACIL 5 MESES":
                mensaje = elemento_lista_precio.entities[0].atm_cuotarf5 ? null : texto
                preciounidadseteado = elemento_lista_precio.entities[0].atm_cuotarf5 * forma_pago.atm_numerocuotas;
                break;
            case "RUEDA FACIL 6 MESES":
                mensaje = elemento_lista_precio.entities[0].atm_cuotarf6 ? null : texto
                preciounidadseteado = elemento_lista_precio.entities[0].atm_cuotarf6 * forma_pago.atm_numerocuotas;
                break;
            case "RUEDA FACIL 7 MESES":
                mensaje = elemento_lista_precio.entities[0].atm_cuotarf7 ? null : texto
                preciounidadseteado = elemento_lista_precio.entities[0].atm_cuotarf7 * forma_pago.atm_numerocuotas;
                break;
            case "RUEDA FACIL 8 MESES":
                mensaje = elemento_lista_precio.entities[0].atm_cuotarf8 ? null : texto
                preciounidadseteado = elemento_lista_precio.entities[0].atm_cuotarf8 * forma_pago.atm_numerocuotas;
                break;
            case "RUEDA FACIL 9 MESES":
                mensaje = elemento_lista_precio.entities[0].atm_cuotarf9 ? null : texto
                preciounidadseteado = elemento_lista_precio.entities[0].atm_cuotarf9 * forma_pago.atm_numerocuotas;
                break;
            case "RUEDA FACIL 10 MESES":
                mensaje = elemento_lista_precio.entities[0].atm_cuotarf10 ? null : texto
                preciounidadseteado = elemento_lista_precio.entities[0].atm_cuotarf10 * forma_pago.atm_numerocuotas;
                break;
            default:
                break;
        }

        return {
            preciounidadseteado,
            mensaje
        };

    } catch (error) {
        console.log(error);
    }
}
// ######################################
// Author: Sergio Redondo
// Fecha: Agosto 23 2023
// Descripcion : me permite obtener los ID O Valores de las entidades asociadas a una regla de descuento
// ######################################
VENTAS.JS.LineaProducto.ObjetoEntidades = async function (entidadrelacionada, productid) {
    "use strict";
    try {

        let valor_puntoventa = null;//963540000
        let valor_ventaexterna = null;//963540001

        let consultaentidadrelacionada = await VENTAS.JS.Comun.ConsultarRegistro(entidadrelacionada[0].entityType, entidadrelacionada[0].id.replace("{", "").replace("}", ""),
            "?$select=atm_puntoventacode,statecode,_customerid_value,_transactioncurrencyid_value,_atm_condicionpagoid_value,_pricelevelid_value&$expand=atm_condicionpagoid($select=atm_nombre,atm_numerocuotas),customerid_account($select=atm_idcuenta,_atm_paisid_value,_atm_regionalid_value,atm_semsicecode,atm_clientetucamion)");
        let conproducto = productid ? await VENTAS.JS.Comun.ConsultarRegistro(productid[0].entityType, productid[0].id.replace("{", "").replace("}", ""),
            "?$select=_atm_categoriaid_value,_atm_subcategoriaid_value,_atm_marcaid_value,_atm_dimensionid_value,_atm_rinid_value,_parentproductid_value,atm_impuesto,atm_codigoproducto,_atm_marcaid_value&$expand=atm_marcaid($select=atm_nombre)")
            : null;

        let account = consultaentidadrelacionada.hasOwnProperty("customerid_account") && consultaentidadrelacionada.customerid_account != null ?
            consultaentidadrelacionada.customerid_account : null;

        let condicionpago = { data: consultaentidadrelacionada._atm_condicionpagoid_value, nombre: CAMPOSUTIL.ATM_CONDICIONPAGO, alcance: ALCANCENOMBRE.FORMADEPAGO, atm_name: consultaentidadrelacionada.atm_condicionpagoid.atm_nombre, atm_numerocuotas: consultaentidadrelacionada.atm_condicionpagoid.atm_numerocuotas };
        let cuenta = { data: account.accountid, nombre: CAMPOSUTIL.ACCOUNT, alcance: ALCANCENOMBRE.CLIENTE };
        let segmento = { data: account.atm_semsicecode, nombre: CAMPOSUTIL.ATM_SEMSICECODE, alcance: ALCANCENOMBRE.SEGMENTO };
        let clientetucamion = { data: account.atm_clientetucamion, nombre: CAMPOSUTIL.ATM_CLIENTETUCAMION, alcance: ALCANCENOMBRE.CLIENTETUCAMION };
        let pais = { data: account._atm_paisid_value, nombre: CAMPOSUTIL.ATM_PAIS, alcance: null };
        let producto = { data: productid[0].id.replace("{", "").replace("}", ""), nombre: productid[0].entityType, alcance: ALCANCENOMBRE.PRODUCTO }
        let marca = { data: conproducto._atm_marcaid_value, nombre: CAMPOSUTIL.ATM_MARCA, alcance: ALCANCENOMBRE.MARCA };
        let categoria = { data: conproducto._atm_categoriaid_value, nombre: CAMPOSUTIL.ATM_CATEGORIA, alcance: ALCANCENOMBRE.CATEGORIA };
        let subcategoria = { data: conproducto._atm_subcategoriaid_value, nombre: CAMPOSUTIL.ATM_SUBCATEGORIA, alcance: ALCANCENOMBRE.SUBCATEGORÍA };
        let rin = { data: conproducto._atm_rinid_value, nombre: CAMPOSUTIL.ATM_RIN, alcance: ALCANCENOMBRE.RIN };
        let dimension = { data: conproducto._atm_dimensionid_value, nombre: CAMPOSUTIL.ATM_DIMENSION, alcance: ALCANCENOMBRE.DIMENSIÓN };
        let regional = { data: account._atm_regionalid_value, nombre: CAMPOSUTIL.ATM_REGIONAL, alcance: ALCANCENOMBRE.REGIONAL };

        if (consultaentidadrelacionada._atm_puntoventacode == 963540000) {
            valor_puntoventa = consultaentidadrelacionada._atm_puntoventacode;
        } else {
            valor_ventaexterna = consultaentidadrelacionada._atm_puntoventacode
        }
        let puntoventa = { data: valor_puntoventa, nombre: CAMPOSUTIL.ATM_PAIS, alcance: ALCANCENOMBRE.PUNTOVENTA };
        let ventaexterna = { data: valor_ventaexterna, nombre: CAMPOSUTIL.ATM_PAIS, alcance: ALCANCENOMBRE.PUNTOVENTA };

        return {
            entidadrelacionada: consultaentidadrelacionada,
            listaprecioid: consultaentidadrelacionada._pricelevelid_value,
            producto: conproducto,
            entidades: {
                condicionpago,
                cuenta,
                segmento,
                clientetucamion,
                pais,
                producto,
                marca,
                categoria,
                subcategoria,
                rin,
                dimension,
                regional,
                puntoventa,
                ventaexterna
            }
        };
    } catch (error) {
        console.log(error);
    }
}

// ######################################
// Author: Sergio Redondo
// Fecha: Agosto 23 2023
// Descripcion : Permite dividir las reglas de descuento en por tipo en un objeto
// ######################################
VENTAS.JS.LineaProducto.DividirDescuentoPorTipo = async (listaDescuentos, formContext, campo) => {
    "use strict";
    try {

        let listaDescuentoPorTipo = {};

        for await (const descuento of listaDescuentos) {

            const tipo_regla = descuento[campo];
            if (!listaDescuentoPorTipo[tipo_regla]) {
                listaDescuentoPorTipo[tipo_regla] = [];
            }
            listaDescuentoPorTipo[tipo_regla].push(descuento);
        }

        for (const tipo_regla in listaDescuentoPorTipo) {
            console.log(tipo_regla);
            listaDescuentoPorTipo[tipo_regla].sort((a, b) => a[RD.CAMPOS.ATM_TIPO] === b[RD.CAMPOS.ATM_TIPO] ? 0 : a[RD.CAMPOS.ATM_TIPO] ? -1 : 1)
        }

        return listaDescuentoPorTipo;

    } catch (error) {
        console.log(error);
    }
}

// ######################################
// Author: Sergio Redondo
// Fecha: Septiembre 04  2023
// Descripcion : 
// ######################################
VENTAS.JS.LineaProducto.ValidarReglasAplicables = async (listadoDescuentos, ObjetoEntidades) => {
    "use strict";
    try {
        let lista = new Array();
        for await (const regla of listadoDescuentos) {
            let regla_alcancecode = regla.atm_alcancecode.split(',');
            let contadorAlcance = 0;
            for await (const codigoAlcance of regla_alcancecode) {
                let opciones = RD.ALCANCENOMBREENTIDAD[codigoAlcance];
                if (opciones) {
                    switch (Number(codigoAlcance)) {
                        case RD.ALCANCE.SEGMENTO:
                            let valido_segmento = regla[opciones.campos].split(",").filter(x => Number(x) == ObjetoEntidades.entidades[opciones.alcance].data)
                            if (valido_segmento?.length > 0) contadorAlcance++;
                            break;
                        case RD.ALCANCE.CLIENTETUCAMION:
                            //case RD.ALCANCE.AGRUPACIONPRODUCTOSENCILLO:
                            if (ObjetoEntidades.entidades[opciones.alcance].data === true) contadorAlcance++;
                            break;
                        case RD.ALCANCE.PUNTODEVENTA:
                            if (ObjetoEntidades.entidades[opciones.alcance].data === opciones.campos) contadorAlcance++;
                            break;
                        case RD.ALCANCE.VENTAEXTERNA:
                            if (ObjetoEntidades.entidades[opciones.alcance].data === opciones.campos) contadorAlcance++;
                            break;
                        default:
                            let webApi = opciones.campos.replace("{0}", regla.atm_regladescuentosid).replace('{1}', ObjetoEntidades.entidades[opciones.alcance].data);
                            let coincide = await VENTAS.JS.Comun.ConsultarMultiplesEntidades(opciones.nombreEntidad, webApi);
                            if (coincide.entities.length > 0) {
                                contadorAlcance++;
                            }
                            break;
                    }
                }
            }
            if (contadorAlcance === regla_alcancecode.length) {
                lista.push(regla);
            }
        }
        return lista;
    } catch (error) {
        console.log(error);
    }
};

// ######################################
// Author: Sergio Redondo
// Fecha: Septiembre 04  2023
// Descripcion : 
// ######################################
VENTAS.JS.LineaProducto.ValidarReglaDescuendoEntreLaFechaDelDia = async (ReglasAplicables) => {
    "use strict";
    try {
        let list = new Array();
        for await (const regla of ReglasAplicables.entities) {
            let coincide = await VENTAS.JS.Comun.ValidarFechaEnRango(new Date(regla.atm_envigordesde), new Date(regla.atm_envigorhasta), new Date())
            if (coincide) {
                list.push(regla)
            }
        }
        return list;
    } catch (error) {
        console.log(error);
    }
}

// ######################################
// Author: Sergio Redondo
// Fecha: Agosto  04 / 09 / 2023
// Descripcion : funcion que se ejecuta en el momento en que el valor del campo tipo operacion es cambiado
// ######################################
VENTAS.JS.LineaProducto.OnchangeTipoOperacion = async (executionContext) => {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();
        let atm_tipooperacioncode = formContext.getAttribute(LD.CAMPOS.ATM_TIPOOPERACIONCODE)?.getValue();

        await Modificarvalor_campo(executionContext, [
            { name: LD.CAMPOS.ATM_DESCUENTOMONTO, valor: null },
            { name: LD.CAMPOS.ATM_DESCUENTOPORCENTAJE, valor: null },
            { name: LD.CAMPOS.ATM_PRECIOSOLICITADO, valor: null }
        ]);
        await SwitchHabilitatoDesabilitarCampos(atm_tipooperacioncode, executionContext);

    } catch (error) {
        console.log(error);
    }
}
// ######################################
// Author: Sergio Redondo
// Fecha: Agosto  04 / 09 / 2023
// Descripcion :
// ######################################
VENTAS.JS.LineaProducto.OnChangeValoresAutorizacion = async (executionContext) => {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();
        let campo = saberCampoEntidad(formContext.data.entity.getEntityName())
        let lookup = formContext.getAttribute(campo);
        let atm_tipooperacioncode = formContext.getAttribute(LD.CAMPOS.ATM_TIPOOPERACIONCODE)?.getValue();
        let priceperunit = formContext.getAttribute(LD.CAMPOS.PRICEPERUNIT)
        let atm_precioautomatico = formContext.getAttribute(LD.CAMPOS.ATM_PRECIOUNIDADDESAUTOMATICO)
        let atm_descuentomonto = formContext.getAttribute(LD.CAMPOS.ATM_DESCUENTOMONTO);
        let atm_descuentoporcentaje = formContext.getAttribute(LD.CAMPOS.ATM_DESCUENTOPORCENTAJE);
        let atm_preciosolicitado = formContext.getAttribute(LD.CAMPOS.ATM_PRECIOSOLICITADO);
        let cantidad = formContext.getAttribute(LD.CAMPOS.QUANTITY)
        let atm_impuesto = formContext.getAttribute(LD.CAMPOS.ATM_IMPUESTO)
        let a = 0;
        let b = 0;

        switch (atm_tipooperacioncode) {
            case LD.ATM_TIPOPERACIONCODE.CALCULARPORMONTO:
                a = RedondearNumero(atm_precioautomatico.getValue() - atm_descuentomonto.getValue());
                b = RedondearNumero((atm_descuentomonto.getValue() / atm_precioautomatico.getValue()) * 100);
                atm_preciosolicitado.setValue(Math.ceil(b / 100) * 100);
                atm_descuentoporcentaje.setValue(b);
                break;
            case LD.ATM_TIPOPERACIONCODE.CALCULARPORPORCENTAJE:
                a = RedondearNumero((atm_descuentoporcentaje.getValue() / 100) * atm_precioautomatico.getValue());
                b = RedondearNumero(atm_precioautomatico.getValue() - (atm_precioautomatico.getValue() * (atm_descuentoporcentaje.getValue() / 100)))
                atm_descuentomonto.setValue(a);
                atm_preciosolicitado.setValue(Math.ceil(b / 100) * 100);
                break;
            case LD.ATM_TIPOPERACIONCODE.CALCULARPORPRECIO:
                if (atm_preciosolicitado.getValue()) {
                    a = RedondearNumero(atm_precioautomatico.getValue() - atm_preciosolicitado.getValue());
                    b = RedondearNumero(((atm_precioautomatico.getValue() - atm_preciosolicitado.getValue()) / atm_precioautomatico.getValue()) * 100);
                    atm_descuentomonto.setValue(a);
                    atm_descuentoporcentaje.setValue(b);
                } else {
                    atm_descuentomonto.setValue(atm_preciosolicitado.getValue());
                    atm_descuentoporcentaje.setValue(atm_preciosolicitado.getValue());
                }
                break;
            default:
                break;
        }

        if (FORM_TYPE.UPDATE === formContext.ui.getFormType()) {
            Modificarvalor_campo(executionContext, [
                { name: LD.CAMPOS.ATM_USUARIOAPRUEBARECHAZAID, valor: null },
                { name: LD.CAMPOS.ATM_FECHAPROBACIONRECHAZADA, valor: null },
                { name: LD.CAMPOS.ATM_DESCUENTOAUTORIZADOCODE, valor: false },
                { name: LD.CAMPOS.ATM_DESCUENTOTOTAL, valor: null },
                { name: LD.CAMPOS.ATM_DESCUENTOTOTALPORCENTAJE, valor: null }
            ]);

            if (lookup.getValue() && campo === "opportunityid") {
                let data = {};
                data.statecode = 0;
                data.statuscode = 1;
                await Xrm.WebApi.updateRecord(lookup.getValue()[0].entityType, lookup.getValue()[0].id, data);
            }
        }
        if (atm_preciosolicitado.getValue()) {
            formContext.getAttribute(LD.CAMPOS.PRICEPERUNIT).setValue(atm_preciosolicitado.getValue());
            Modificarvalor_campo(executionContext, [
                { name: LD.CAMPOS.ATM_IMPORTEIVA, valor: priceperunit.getValue() + (priceperunit.getValue() * (atm_impuesto.getValue() / 100)) },
                { name: LD.CAMPOS.TAX, valor: (priceperunit.getValue() * cantidad.getValue()) * (atm_impuesto.getValue() / 100) }
            ])
        } else {
            formContext.getAttribute(LD.CAMPOS.PRICEPERUNIT).setValue(atm_precioautomatico.getValue());
        }
    } catch (error) {
        console.log(error);
    }
}
// ######################################
// Author: Sergio Redondo
// Fecha: Agosto 23 2023
// Descripcion : funcion que permite validar el producto de la oferta y oportunidad valindado si el detalle necesitan una autorización de descuento
// ######################################
VENTAS.JS.LineaProducto.ActivarRegistro = async function (executionContext, aprobacion) {
    "use strict";
    try {
        var formContext = executionContext;

        const ROL = await VENTAS.JS.Comun.GuardarRoles();
        const USUARIO = Xrm.Utility.getGlobalContext().userSettings.userId.slice(1, 37);
        const REGISTRO = {
            NAME: formContext.data.entity.getEntityName(),
            ID: formContext.data.entity.getId(),
            CUSTOMERID: formContext.data.entity.getEntityName() === "quote" ? "customerid" : "parentaccountid",
            ESTIMATEDCLOSEDATE: "estimatedclosedate",
            EFFECTIVEFROM: "effectivefrom",
            EFFECTIVETO: "effectiveto",
            LOOKUPID: "quotedetailid"
        }

        switch (REGISTRO.NAME) {
            case "quote":
                VENTAS.JS.Comun.Cargando("Validando activación de la oferta");
                break;
            case "opportunity":
                VENTAS.JS.Comun.Cargando("Validando cierre de la oportunidad");
                break;
            default:
                break;
        }

        var nuevorol = "";
        var aceptarautorizacion = false;
        var nmayor = 0;
        var ok = false;
        let customerid = formContext.getAttribute(REGISTRO.CUSTOMERID);
        let effectiveto = formContext.getAttribute(REGISTRO.EFFECTIVETO);
        var nombre_rol_superior = "";
        let lista_rd_mayor = null;
        var valor_campo = null;
        var id_usuario_regional = "";
        var lista_detalle_productos_con_descuento = new Array();
        var nombre_entida_detalle_producto = REGISTRO.NAME === "quote" ? "quotedetail" : "opportunityproduct";
        let filtro = REGISTRO.NAME === "quote" ? "_quoteid_value" : "_opportunityid_value";
        let select = REGISTRO.NAME === "quote" ? "quotedetailid,_quoteid_value" : "opportunityproductid,_opportunityid_value";
        let roles_de_autorizacion = null;


        roles_de_autorizacion = await VENTAS.JS.Comun.ConsultarMultiplesEntidades("atm_parametro", "?$select=atm_valor&$filter=(atm_nombre eq 'ROLESDEAUTORIZACION')");
        roles_de_autorizacion = roles_de_autorizacion.entities[0].atm_valor;

        let rol_del_usuario = await ObtenerRolDeSeguridadIdentico();

        let cons_todos_los_prod = `?$select=productname,atm_descuentototalautomatico,atm_desctotalautomaticoporcentaje,atm_preciosolicitado,atm_preciounidadbase,atm_preciounidaddesautomatico,baseamount,extendedamount,priceperunit,atm_descuentomonto,quantity,atm_tipooperacioncode,atm_descuentoporcentaje,atm_descuentomonto,_productid_value,${select},atm_descuentoautorizado
                    &$filter=( ${filtro} eq ${REGISTRO.ID.slice(1, 37)})`;
        let con_lista_productos = await VENTAS.JS.Comun.ConsultarMultiplesEntidades(nombre_entida_detalle_producto, cons_todos_los_prod);


        if (con_lista_productos?.entities?.length > 0) {
            if (customerid.getValue() && REGISTRO.ID && (REGISTRO.NAME === "opportunity" && formContext.getAttribute(REGISTRO.ESTIMATEDCLOSEDATE).getValue() ||
                REGISTRO.NAME === "quote" && effectiveto.getValue() && effectiveto.getValue())) {

                let ubicacion = await consultarRegistros("account", CONSULTAS.CONS_UBICACION.replace("{0}", customerid.getValue()[0].id.replace("{", "").replace("}", "")));

                let consulta = `?$select=productname,atm_descuentototalautomatico,atm_desctotalautomaticoporcentaje,atm_preciosolicitado,atm_preciounidadbase,atm_preciounidaddesautomatico,baseamount,extendedamount,priceperunit,atm_descuentomonto,quantity,atm_tipooperacioncode,atm_descuentoporcentaje,atm_descuentomonto,_productid_value,${select},atm_descuentoautorizado
            &$filter=( ${filtro} eq ${REGISTRO.ID.slice(1, 37)}) and 
            (productid/productid ne null and atm_descuentoporcentaje ne null and atm_descuentomonto ne null and atm_preciosolicitado ne null and atm_descuentoautorizado eq false)`;

                let lista_rd = await VENTAS.JS.Comun.ConsultarMultiplesEntidades(RD.NOMBRE_LOGICO, CONSULTAS.CONS_RD.replace("{0}", RD.OPCIONES.STATUSCODE.APROBADO).replace("{1}", ubicacion.entities[0]._atm_paisid_value).concat(` and atm_tiporeglacode eq ${RD.TIPOREGLA.AUTORIZACION}`));
                let lista_rd_fecha_valida = await VENTAS.JS.LineaProducto.ValidarReglaDescuendoEntreLaFechaDelDia(lista_rd);
                let lista_productos = await Xrm.WebApi.retrieveMultipleRecords(nombre_entida_detalle_producto, consulta);
                let lista_rd_aplicable = null;
                let lista_ultimo_porcentaje = 0;
                //SE VALIDA QUE EXISTAN PRODUCTOS QUE REQUIERAN AUTORIZACION
                if (lista_productos?.entities?.length > 0) {
                    for await (const d_producto of lista_productos.entities) {

                        let entidad = [{ entityType: REGISTRO.NAME, id: REGISTRO.ID }];
                        let productoid = [{ entityType: "product", id: d_producto._productid_value }]
                        let ObjetoEntidades = await VENTAS.JS.LineaProducto.ObjetoEntidades(entidad, productoid);
                        console.log(ObjetoEntidades);

                        lista_rd_aplicable = await VENTAS.JS.LineaProducto.ValidarReglasAplicables(lista_rd_fecha_valida, ObjetoEntidades);
                        console.log(lista_rd_aplicable);

                        if (lista_rd_aplicable?.length > 0) {

                            for await (const rd of lista_rd_aplicable) {

                                let lista_descuento_por_rol = await Xrm.WebApi.retrieveMultipleRecords("atm_descuentorol", CONSULTAS.CONS_ROLDESCUENTO.replace("{0}", rd[RD.CAMPOS.ATM_REGLADESCUENTOSID]));
                                let descuento_rol_para_el_usuario = lista_descuento_por_rol.entities.filter((item) => item.atm_nombre === rol_del_usuario);
                                let monto = descuento_rol_para_el_usuario[0].atm_monto;
                                let porcentaje = descuento_rol_para_el_usuario[0].atm_porcentaje;
                                let precio_automatico = d_producto[LD.CAMPOS.ATM_PRECIOUNIDADDESAUTOMATICO];
                                let obtener_valor_mayor = 0;
                                if (rd[RD.CAMPOS.ATM_TIPO] === RD.OPCIONES.ATM_TIPO.IMPORTE) {
                                    obtener_valor_mayor = (monto / precio_automatico) * 100;
                                } else {
                                    obtener_valor_mayor = porcentaje;
                                }
                                if (obtener_valor_mayor > lista_ultimo_porcentaje || obtener_valor_mayor === 0) {
                                    lista_rd_mayor = rd;
                                    lista_ultimo_porcentaje = obtener_valor_mayor;
                                }
                            }
                        } else {
                            //////////////////////////////// SE ACTIVA LA OFERTA
                        }

                        console.log(lista_rd_mayor);
                        let tipo = lista_rd_mayor[RD.CAMPOS.ATM_TIPO];
                        let valor_detalle_oferta = tipo ? d_producto[LD.CAMPOS.ATM_DESCUENTOMONTO] : d_producto[LD.CAMPOS.ATM_DESCUENTOPORCENTAJE];
                        let listadescuentorol = await VENTAS.JS.Comun.ConsultarMultiplesEntidades("atm_descuentorol", CONSULTAS.CONS_ROLDESCUENTO.replace("{0}", lista_rd_mayor[RD.CAMPOS.ATM_REGLADESCUENTOSID]))
                        let res = await identificarRol(listadescuentorol, valor_detalle_oferta, tipo, d_producto, rol_del_usuario, lista_rd_mayor, roles_de_autorizacion);
                        nuevorol = res.nombre_rol_superior;
                        ok = res.ok;
                        console.log(res);
                        console.log(lista_detalle_productos_con_descuento);
                        console.log("NOMBRE ROL SUPERIOR 2");
                        console.log(nombre_rol_superior);
                    }
                    if (lista_detalle_productos_con_descuento?.length > 0) {
                        console.log("NUEVO ROL " + nuevorol);
                        id_usuario_regional = await identificarDestinarioDeAutorizacion({ lista: lista_detalle_productos_con_descuento, ok, rol: nuevorol }, ubicacion);
                        console.log(id_usuario_regional);
                        if (id_usuario_regional) {
                            cerrarProgress();
                            let res = await enviarConfirmacionDeSolicitud();
                            if (res) {
                                let res = await realizarPeticion(REGISTRO.ID.slice(1, 37), lista_detalle_productos_con_descuento, Xrm.Utility.getGlobalContext().userSettings.userId.slice(1, 37), id_usuario_regional, REGISTRO.NAME);

                                VENTAS.JS.Comun.Cargando('Enviando solicitud');

                                if (res.ok) {
                                    VENTAS.JS.Comun.MostrarNotificacionToast(1, "Solicitud creada exitosamente");
                                    cerrarProgress();
                                } else {
                                    VENTAS.JS.Comun.MostrarNotificacionToast(2, "Solicitud fallida. Intente volver a crearla");
                                    cerrarProgress();
                                }
                            } else {
                                ///
                            }
                        } else {
                            cerrarProgress();
                            alertaDeDialogos("No se pudo completar la operación debido a que la cuenta asociada al registro no tiene un pais o una regional asignado");
                        }
                    } else {
                        //SE ACTIVA LA OFERTA   
                        console.log("CONSOLE 2");
                        console.log(con_lista_productos);
                        await actualizarLineaProductos(con_lista_productos, nombre_entida_detalle_producto, USUARIO);
                        await ElegirAccion(REGISTRO, aprobacion);
                    }
                } else {
                    console.log("CONSOLE 3");
                    console.log(con_lista_productos);
                    //SE ACTIVA LA OFERTA
                    await actualizarLineaProductos(con_lista_productos, nombre_entida_detalle_producto, USUARIO);
                    await ElegirAccion(REGISTRO, aprobacion);
                }
            } else {
                alertaDeDialogos("No puede iniciar la operacion si el registro no esta creado con todos sus campos requeridos.");
                cerrarProgress();
            }
        } else {
            Xrm.Utility.closeProgressIndicator();
            let mensaje = REGISTRO.NAME === "quote" ? "No puede activar una oferta sin productos" : "No puede ganar una oportunidad sin productos";
            alertaDeDialogos(mensaje);
        }
    } catch (error) {
        VENTAS.JS.Comun.OpenAlerDialog("OK", error);
        cerrarProgress();
    }

    async function enviarConfirmacionDeSolicitud() {
        return new Promise((resolve, reject) => {
            let mensaje = `Este registro contiene productos que superan el margen del descuento autorizado. Presione enviar para realizar la solicitud de autorización sino presione cancelar para revisar los item de los productos.`;
            let confirmStrings = {
                cancelButtonLabel: 'Cancelar',
                confirmButtonLabel: 'Enviar',
                subtitle: 'Presiona enviar para continuar',
                text: mensaje,
                title: 'Solicitar autorización de descuento'
            };
            let confirmOptions = { height: 300, width: 500 };

            Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions).then(
                function (success) {
                    resolve(success.confirmed);
                },
                function (error) {

                    reject(error);
                    // handle error conditions
                }
            );
        })
    }

    async function identificarRol(listadescuentorol, valorDetalleOferta, tipo, registro, rol_del_usuario, rd, roles_principales) {

        nmayor = 0;
        let es_mayor = false;
        nombre_rol_superior = null;
        let array_rol = new Array();
        let objeto_rol = roles_principales.split(",");
        let consecutivo_rol = 0;
        objeto_rol.unshift(rol_del_usuario);
        console.log(objeto_rol);


        let valor_consecutivo_usuario = listadescuentorol.entities.filter(x => x.atm_nombre === rol_del_usuario);

        //let objeto_rol = [rol_del_usuario, "Automundial - Director Regional", "Automundial - Gerente de país"];
        return new Promise(async (resolve, reject) => {
            try {
                for await (const rol of objeto_rol) {
                    for await (const des of listadescuentorol.entities) {
                        if (des.atm_nombre === rol) {
                            array_rol.push(des)
                        }
                    }
                }
                console.log(array_rol);
                //for await (const rol of objeto_rol) {
                for await (const rol_des of array_rol) {
                    let atm_porcentaje = rol_des.atm_porcentaje;
                    let atm_monto = rol_des.atm_monto;
                    valor_campo = tipo ? atm_monto : atm_porcentaje;
                    if (valorDetalleOferta >= nmayor) {
                        es_mayor = true;
                        nmayor = valor_campo;
                        nombre_rol_superior = rol_des.atm_nombre;
                        consecutivo_rol = rol_des.atm_consecutivo;
                    }
                }
                console.log("DESPUES DEL FOR");
                if (nombre_rol_superior) {
                    console.log(nombre_rol_superior);
                    console.log(valorDetalleOferta);
                    console.log(nmayor);
                    console.log(valor_consecutivo_usuario[0].atm_consecutivo);
                    console.log(consecutivo_rol);
                    if (nmayor && es_mayor && consecutivo_rol > valor_consecutivo_usuario[0].atm_consecutivo) {
                        aceptarautorizacion = true;
                        lista_detalle_productos_con_descuento.push({
                            quotedetailid: registro.quotedetailid ? registro.quotedetailid : registro.opportunityproductid,
                            valor: valorDetalleOferta,
                            nombreproducto: registro.productname,
                            tipo: tipo ? "Monto" : "Porcentaje",
                            idrd: rd[RD.CAMPOS.ATM_REGLADESCUENTOSID]
                        });
                    }
                }
                //}
                console.log(array_rol);
                console.log("ROL NOMBRE");
                resolve({
                    ok: aceptarautorizacion,
                    nombre_rol_superior
                });
            } catch (error) {

                reject(error)
            }
        });
    }
    async function ActivarOferta(id) {
        try {

            let record = {};
            record.statecode = 1;
            record.statuscode = 3;
            Xrm.WebApi.updateRecord("quote", await RetornarId(id), record).then(
                function success(result) {
                    return result;
                },
                function (error) {

                }
            );
        } catch (error) {
            return error;
        }
    }

    async function realizarPeticion(registroid, lista, usuarioid, idusuarioaprobador, entidad) {

        mostrarEspera("Enviando la solicitud de autorizacion");

        let URL = "";
        let consultaParametro = await VENTAS.JS.Comun.ConsultarMultiplesEntidades("atm_parametro", "?$select=atm_valor&$filter=(atm_nombre eq 'URLSOLICITUDDESCUENTO')");
        URL = consultaParametro.entities[0].atm_valor;

        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: registroid,
                        entidad,
                        listaproductos: lista,
                        usuarioid,
                        idusuarioaprobador,
                    }),
                });
                resolve(response)
            } catch (error) {
                VENTAS.JS.Comun.OpenAlerDialog("OK", error);
                reject(error);
            }
        });
    }

    async function consultarRegistros(entidad, options) {
        return new Promise((resolve, reject) => {
            Xrm.WebApi.retrieveMultipleRecords(entidad, options).then(
                function success(result) {
                    resolve(result);
                },
                function (error) {
                    reject(error)
                }
            );
        })
    }

    async function actualizarLineaProductos(listaLineaProductos, entidaddetalles, usuarioaprobador) {
        try {
            let f = new Date();
            let valor_campo = null;
            console.log(listaLineaProductos);
            return new Promise(async (resolve, reject) => {

                for (const entidad of listaLineaProductos.entities) {
                    let id = entidad.quotedetailid ? entidad.quotedetailid : entidad.opportunityproductid;
                    let data = {};
                    data[LD.CAMPOS.ATM_DESCUENTOTOTAL] = entidad[LD.CAMPOS.ATM_DESCUENTOTOTALAUTOMATICO] + entidad[LD.CAMPOS.ATM_DESCUENTOMONTO];
                    data[LD.CAMPOS.ATM_DESCUENTOTOTALPORCENTAJE] = entidad[LD.CAMPOS.ATM_DESCTOTALAUTOMATICOPORCENTAJE] + entidad[LD.CAMPOS.ATM_DESCUENTOPORCENTAJE];
                    data[LD.CAMPOS.ATM_FECHAPROBACIONRECHAZADA] = new Date(`${f.getUTCFullYear()}-${f.getMonth() + 1}-${f.getDate()}`).toISOString();
                    data["atm_usuarioapruebarechazaid@odata.bind"] = "/systemusers(" + usuarioaprobador + ")";
                    data[LD.CAMPOS.ATM_DESCUENTOAUTORIZADOCODE] = true;
                    await Xrm.WebApi.updateRecord(entidaddetalles, id, data);
                }
                resolve();
            });

        } catch (error) {
            VENTAS.JS.Comun.OpenAlerDialog("Ok", error);
        }
    }

    function cerrarProgress() {
        Xrm.Page.data.refresh();
        Xrm.Page.ui.refreshRibbon();
        Xrm.Utility.closeProgressIndicator();
    }

    function mostrarEspera(mensaje) {
        Xrm.Utility.showProgressIndicator(mensaje);
    }

    function identificarDestinarioDeAutorizacion(result, ubicacion) {
        try {
            let data;
            console.log(result);
            console.log(ubicacion);
            return new Promise((resolve, reject) => {
                switch (result.rol) {
                    case "Automundial - Gerente de país":
                        data = ubicacion.entities[0].atm_paisid._atm_gerentepaisid_value;
                        break;
                    case "Automundial - Director Regional":
                        data = ubicacion.entities[0].atm_regionalid._atm_directorregional_value;
                        break;
                    default:
                        data = null;
                        break;
                }
                resolve(data);
            })
        } catch (error) {
            VENTAS.JS.Comun.OpenAlerDialog("Ok", error);
        }
    }

    async function alertaDeDialogos(mensaje) {

        return new Promise((resolve, reject) => {

            let alertStrings = { confirmButtonLabel: 'Si', text: mensaje };
            let alertOptions = { height: 300, width: 500 };

            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                function success(result) {
                    resolve(result);
                },
                function (error) {
                    reject(error);
                }
            );
        });
    }

    async function GanarOportunidad(id) {
        "use strict";
        try {

            let oportunidad = await VENTAS.JS.Comun.ConsultarRegistro("opportunity", await RetornarId(id));

            let entityFormOptions = {
                useQuickCreateForm: true,
                entityName: "opportunityclose"
            };
            let formParameters = {}
            //campos visibles
            formParameters["opportunitystatuscode"] = 3;
            formParameters["opportunitystatecode"] = 1;
            formParameters["actualrevenue"] = oportunidad.totalamount;
            formParameters["actualend"] = new Date();


            //campos ocultos
            formParameters["opportunityid"] = id;
            formParameters["opportunityidname"] = oportunidad.name;
            formParameters["opportunityidtype"] = "opportunity";

            formParameters["transactioncurrencyid"] = formContext.getAttribute("transactioncurrencyid").getValue()[0].id;
            formParameters["transactioncurrencyidname"] = formContext.getAttribute("transactioncurrencyid").getValue()[0].name;
            formParameters["transactioncurrencyidtype"] = formContext.getAttribute("transactioncurrencyid").getValue()[0].entityType;

            formParameters["subject"] = oportunidad.name;

            cerrarProgress();

            let res = await VENTAS.JS.Comun.OpenForm(entityFormOptions, formParameters);


        } catch (error) {
            VENTAS.JS.Comun.OpenAlerDialog("Ok", error);
        }
    }

    async function ElegirAccion(REGISTRO, desicion) {
        "use strict";
        try {

            switch (desicion) {
                case "quote":
                    await ActivarOferta(REGISTRO.ID);
                    cerrarProgress();
                    VENTAS.JS.Comun.MostrarNotificacionToast(1, "Oferta activada");
                    break;
                case "opportunity":
                    await GanarOportunidad(REGISTRO.ID);
                    cerrarProgress();
                    VENTAS.JS.Comun.MostrarNotificacionToast(1, "Oportunidad lograda");
                    break;
                case "Aprobacion":
                    let data = {};
                    data.statecode = 0;
                    data.statuscode = 7;
                    await VENTAS.JS.Comun.ActualizarRegistro(REGISTRO.NAME, REGISTRO.ID, data);
                    cerrarProgress();
                    VENTAS.JS.Comun.MostrarNotificacionToast(1, "Oportunidad aprobada");
                    break;
                default:
                    break;
            }
        } catch (error) {
            VENTAS.JS.Comun.OpenAlerDialog("OK", error);
        }
    }

    async function ObtenerRolDeSeguridadIdentico() {

        let obt_roles_paramatrizados = await VENTAS.JS.Comun.ConsultarMultiplesEntidades("atm_parametro", "?$select=atm_valor&$filter=(atm_nombre eq 'ROLESDESCUENTO')");
        let roles_parametrizados = obt_roles_paramatrizados.entities[0].atm_valor.split(",").map(rol => rol.trim());
        let roles_usuario = await VENTAS.JS.Comun.GuardarRoles();

        for await (const rol of roles_parametrizados) {
            if (roles_usuario.includes(rol)) {
                return rol;
            }
        }
        return null;
    }
}

async function BloquearCamposDynamicamente(executionContext, ListaCampos) {
    "use strict"
    try {
        let formContext = executionContext.getFormContext();

        if (ListaCampos.length > 0) {
            for (const campo of ListaCampos) {
                formContext.getControl(campo.name).setDisabled(campo.valor);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

async function Modificarvalor_campo(executionContext, listaCampos) {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();
        if (listaCampos?.length > 0) {
            for await (const campo of listaCampos) {
                formContext.getAttribute(campo.name).setValue(campo.valor);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

async function SwitchHabilitatoDesabilitarCampos(atm_tipooperacioncode, executionContext) {
    "use strict";
    switch (atm_tipooperacioncode) {
        case LD.ATM_TIPOPERACIONCODE.CALCULARPORMONTO:

            await BloquearCamposDynamicamente(executionContext, [
                { name: LD.CAMPOS.ATM_DESCUENTOMONTO, valor: false },
                { name: LD.CAMPOS.ATM_DESCUENTOPORCENTAJE, valor: true },
                { name: LD.CAMPOS.ATM_PRECIOSOLICITADO, valor: true }
            ]);
            break;
        case LD.ATM_TIPOPERACIONCODE.CALCULARPORPORCENTAJE:
            await BloquearCamposDynamicamente(executionContext, [
                { name: LD.CAMPOS.ATM_DESCUENTOMONTO, valor: true },
                { name: LD.CAMPOS.ATM_DESCUENTOPORCENTAJE, valor: false },
                { name: LD.CAMPOS.ATM_PRECIOSOLICITADO, valor: true }
            ]);
            break;
        case LD.ATM_TIPOPERACIONCODE.CALCULARPORPRECIO:
            await BloquearCamposDynamicamente(executionContext, [
                { name: LD.CAMPOS.ATM_DESCUENTOMONTO, valor: true },
                { name: LD.CAMPOS.ATM_DESCUENTOPORCENTAJE, valor: true },
                { name: LD.CAMPOS.ATM_PRECIOSOLICITADO, valor: false }
            ]);
            break;
        default:
            break;
    }
}

VENTAS.JS.LineaProducto.EliminarDuplicadosPorId = async (array, text) => {

    const idsVistos = {};

    return array.filter(obj => {

        if (!idsVistos[obj[tex]]) {

            idsVistos[obj[tex]] = true;

            return true;

        }

        return false;

    });

}

VENTAS.JS.LineaProducto.CalcularPorcentajeYmonto = async (precio_inicial, precio_solicitado) => {
    "use strict";
    try {
        let d_monto = precio_inicial - precio_solicitado;
        let d_porcentaje = (d_monto / precio_inicial) * 100;
        d_porcentaje = (Math.round(d_porcentaje * 100) / 100);
        return {
            d_monto,
            d_porcentaje
        };
    } catch (error) {
        console.log(error);
    }
}

function RedondearNumero(numero, tipo) {
    "use strict";
    try {
        var numeroRedondeado = 0;
        numeroRedondeado = (Math.round(numero * 100) / 100)
        return numeroRedondeado;
    } catch (error) {
        console.log(error);
    }
}

async function ConsultarRegistrosRelacionados(executionContext, productid) {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();
        let campoid = saberCampoEntidad(LD.NOMBREENTIDAD);
        let consultaentidad = await VENTAS.JS.Comun.ConsultarRegistro(formContext.getAttribute(campoid).getValue()[0].entityType, formContext.getAttribute(campoid).getValue()[0].id, "?$select=_pricelevelid_value,_atm_condicionpagoid_value&$expand=atm_condicionpagoid($select=atm_nombre,atm_numerocuotas)");
        let elementolistaprecio = await VENTAS.JS.Comun.ConsultarMultiplesEntidades("productpricelevel", "?$select=amount,atm_importeiva,atm_cuotarf4,atm_cuotarf5,atm_cuotarf6,atm_cuotarf7,atm_cuotarf8,atm_cuotarf9,atm_cuotarf10&$filter=(_pricelevelid_value eq " + consultaentidad._pricelevelid_value + " and _productid_value eq " + productid.getValue()[0].id.slice(1, 37) + ")");
        let producto = await VENTAS.JS.Comun.ConsultarRegistro(productid.getValue()[0].entityType, productid.getValue()[0].id, "?$select=atm_impuesto,atm_codigoproducto,_atm_marcaid_value&$expand=atm_marcaid($select=atm_nombre)");

        return { elementolistaprecio, producto, consultaentidad };

    } catch (error) {
        console.log(error);
    }
}


