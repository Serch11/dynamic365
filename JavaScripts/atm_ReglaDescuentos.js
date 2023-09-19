if (typeof VENTAS === "undefined") {
    VENTAS = {};
    VENTAS.JS = {};
}
if (typeof VENTAS.JS === "undefined") {
    VENTAS.JS = {};
}

const RD = {
    NOMBRE_LOGICO: "atm_regladescuentos",
    CAMPOS: {
        ATM_REGLADESCUENTOSID: "atm_regladescuentosId",
        ATM_PAISID: "atm_paisid",
        ATM_TIPO: "atm_tipo",
        ATM_ENVIGORDESDE: "atm_envigordesde",
        ATM_ENVIGORHASTA: "atm_envigorhasta",
        ATM_ALCANCECODE: "atm_alcancecode",
        ATM_TIPOREGLACODE: "atm_tiporeglacode",
        ATM_MONTO: "atm_monto",
        ATM_PORCENTAJE: "atm_porcentaje",
        STATUSCODE: "statuscode",
        ATM_SEGMENTOCODE: "atm_segmentocode",
        ATM_REGLADESCUENTOSID: "atm_regladescuentosid"
    },
    ALCANCE: {
        AGRUPACIONPRODUCTOSENCILLO: 963540007,
        CATEGORIA: 963540000,
        CLIENTE: 963540011,
        DIMENSION: 963540005,
        FORMADEPAGO: 963540008,
        MARCA: 963540002,
        PRODUCTO: 963540004,
        PUNTODEVENTA: 963540012,
        RIN: 963540006,
        SEGMENTO: 963540009,
        SUBCATEGORIA: 963540001,
        TIER: 963540003,
        CLIENTETUCAMION: 963540010,
        REGIONAL: 963540013,
        VENTAEXTERNA: 963540010
    },
    ALCANCENOMBREENTIDAD: {
        //963540007: { nombreEntidad: "", campos: "" },
        963540000: { nombreEntidad: "atm_categoriasregladescuentos", alcance: "categoria", campos: "?$select=atm_categoriasregladescuentosid,_atm_categoriaid_value,_atm_regladescuentoid_value&$filter=(_atm_regladescuentoid_value eq {0} and _atm_categoriaid_value eq {1})" },
        963540011: { nombreEntidad: "atm_clienteregladescuentos", alcance: "cuenta", campos: "?$select=atm_clienteregladescuentosid,_atm_cuentaid_value,_atm_regladescuentoid_value&$filter=(_atm_regladescuentoid_value eq {0} and _atm_cuentaid_value eq {1})" },
        963540008: { nombreEntidad: "atm_formapagosregladescuento", alcance: "condicionpago", campos: "?$select=atm_formapagosregladescuentoid,_atm_formapagoid_value,_atm_regladescuentoid_value&$filter=(_atm_regladescuentoid_value eq {0} and _atm_formapagoid_value eq {1})" },
        963540002: { nombreEntidad: "atm_marcasregladescuento", alcance: "marca", campos: "?$select=atm_marcasregladescuentoid,_atm_marcaid_value,_atm_regladescuentoid_value&$filter=(_atm_regladescuentoid_value eq {0} and _atm_marcaid_value eq {1})" },
        963540004: { nombreEntidad: "atm_productoregladescuento", alcance: "marca", campos: "?$select=atm_productoregladescuentoid,_atm_productoid_value,_atm_regladescuentoid_value&$filter=(_atm_regladescuentoid_value eq {0} and _atm_productoid_value eq {1})" },
        963540006: { nombreEntidad: "atm_rinesregladescuento", alcance: "rin", campos: "?$select=atm_rinesregladescuentoid,_atm_regladescuentoid_value,_atm_rinid_value&$filter=(_atm_regladescuentoid_value eq {0} and _atm_rinid_value eq {1})" },
        963540001: { nombreEntidad: "atm_subcategoriaregladescuento", alcance: "subcategoria", campos: "?$select=atm_subcategoriaregladescuentoid,_atm_regladescuentoid_value,_atm_subcategoriaid_value&$filter=(_atm_regladescuentoid_value eq {0} and _atm_subcategoriaid_value eq {1})" },
        963540013: { nombreEntidad: "atm_regionalesregladescuento", alcance: "regional", campos: "?$select=atm_regionalesregladescuentoid,_atm_regionalid_value,_atm_regladescuentoid_value&$filter=(_atm_regladescuentoid_value eq {0} and _atm_regionalid_value eq {1})" },
        963540009: { nombreEntidad: "atm_segmentocode", alcance: "segmento", campos: "atm_segmentocode" },
        963540010: { nombreEntidad: "", alcance: "clientetucamion", campos: "" },
        963540012: { nombreEntidad: "", alcance: "puntoventa", campos: 963540000 },
        963540014: { nombreEntidad: "", alcance: "ventaexterna", campos: 963540001 },
        //963540003: { nombreEntidad: "atm_tiersregladescuento", alcance: "tier", campos: "" },
        //963540012: { nombreEntidad: "atm_categoriasregladescuentos", alcance: "categoria", campos: "" },
    },
    TABS: {
        TAB_GENERAL: "tab_general",
        TAB_CATEGORIA: "tab_categoria",
        TAB_SUBCATEGORIA: "tab_subcategoria",
        TAB_MARCA: "tab_marca",
        TAB_TIER: "tab_tier",
        TAB_PRODUCTO: "tab_producto",
        TAB_DIMENSION: "tab_dimension",
        TAB_FORMAPAGO: "tab_formapago",
        TAB_SEGMENTO: "tab_segmento",
        TAB_CLIENTE: "tab_cliente",
        TAB_REGIONAL: "tab_regional",
        TAB_RIN: "tab_rin"
    },
    TIPOREGLA: {
        AUTORIZACION: 963540000,
        VOLUMEN: 963540001,
        AUTOMATICO: 963540002
    },
    SECCIONES: {
        ROLES: "section_roles",
        DESCUENTO_VOLUMEN: "section_descuento_volumen",
        DESCUENTO_AUTOMATICO: "section_descuento_automatico",
        MARCA: "section_marca"
    },
    OPCIONES: {
        atm_alcance: {
            AGRUPACIÓNPRODUCTOSENCILLO: 963540007,
            CATEGORÍA: 963540000,
            CLIENTE: 963540011,
            DIMENSIÓN: 963540005,
            FORMADEPAGO: 963540008,
            MARCA: 963540002,
            PRODUCTO: 963540004,
            PUNTODEVENTA: 963540012,
            RIN: 963540006,
            SEGMENTO: 963540009,
            SUBCATEGORÍA: 963540001,
            TIER: 963540003,
            CLIENTETUCAMION: 963540010,
            VENTAEXTERNA: 963540010
        },
        STATUSCODE: {
            BORRADOR: 1,
            APROBADO: 963540001
        },
        ATM_TIPO: {
            IMPORTE: true,
            PORCENTAJE: false
        }
    }
}


VENTAS.JS.ReglaDescuento = {};

// ######################################
// Author: Larry Suarez
// Fecha: Agosto 23 2023
// ######################################
VENTAS.JS.ReglaDescuento.OnLoad = async function (executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();

    let statuscode = formContext.getAttribute(RD.CAMPOS.STATUSCODE).getValue()

    if (FORM_TYPE.UPDATE === formContext.ui.getFormType()) {

        if (statuscode === RD.OPCIONES.STATUSCODE.BORRADOR) {
            formContext.ui.setFormNotification('Esta regla de descuento se encuentra en estado Borrador, no se podrá activar hasta que el detalle del alcance se complete', 'WARNING', 'RD_EN_BORRADOR');
        } else if (statuscode === RD.OPCIONES.STATUSCODE.APROBADO) {
            VENTAS.JS.Comun.BloquearCamposDelFormulario(executionContext, 'Solo lectura: estado de este registro: Aprobado', 'INFO', 'RD_EN_APROBADA')
        }

        await VENTAS.JS.ReglaDescuento.CambiarTipo(executionContext);

        formContext.getControl(RD.CAMPOS.ATM_ALCANCECODE).setDisabled(true);
        var atm_alcancecode = formContext.getAttribute(RD.CAMPOS.ATM_ALCANCECODE).getValue();

        atm_alcancecode.forEach(alcance => {
            switch (alcance) {
                case RD.ALCANCE.CATEGORIA:
                    formContext.ui.tabs.get(RD.TABS.TAB_CATEGORIA).setVisible(true);
                    break;
                case RD.ALCANCE.SUBCATEGORIA:
                    formContext.ui.tabs.get(RD.TABS.TAB_SUBCATEGORIA).setVisible(true);
                    break;
                case RD.ALCANCE.MARCA:
                    formContext.ui.tabs.get(RD.TABS.TAB_MARCA).setVisible(true);
                    break;
                case RD.ALCANCE.TIER:
                    formContext.ui.tabs.get(RD.TABS.TAB_TIER).setVisible(true);
                    break;
                case RD.ALCANCE.PRODUCTO:
                    formContext.ui.tabs.get(RD.TABS.TAB_PRODUCTO).setVisible(true);
                    break;
                case RD.ALCANCE.DIMENSION:
                    formContext.ui.tabs.get(RD.TABS.TAB_DIMENSION).setVisible(true);
                    break;
                case RD.ALCANCE.FORMADEPAGO:
                    formContext.ui.tabs.get(RD.TABS.TAB_FORMAPAGO).setVisible(true);
                    break;
                case RD.ALCANCE.SEGMENTO:
                    formContext.getControl(RD.CAMPOS.ATM_SEGMENTOCODE).setVisible(true);
                    formContext.getControl(RD.CAMPOS.ATM_SEGMENTOCODE).setDisabled(true);
                    break;
                case RD.ALCANCE.CLIENTE:
                    formContext.ui.tabs.get(RD.TABS.TAB_CLIENTE).setVisible(true);
                    break;
                case RD.ALCANCE.REGIONAL:
                    formContext.ui.tabs.get(RD.TABS.TAB_REGIONAL).setVisible(true);
                    break;
                case RD.ALCANCE.RIN:
                    formContext.ui.tabs.get(RD.TABS.TAB_RIN).setVisible(true);
                    break;
                default:
                    break;
            }
        });
    }
}

// ######################################
// Author: Larry Suarez
// Fecha: Agosto 23 2023
// ######################################
VENTAS.JS.ReglaDescuento.CambiarTipo = async function (executionContext) {
    "use strict";

    let formContext = executionContext.getFormContext();

    var atm_tiporeglacode = formContext.getAttribute(RD.CAMPOS.ATM_TIPOREGLACODE).getValue();
    var atm_tipo = formContext.getAttribute(RD.CAMPOS.ATM_TIPO).getValue();

    switch (atm_tiporeglacode) {
        case RD.TIPOREGLA.AUTORIZACION:
            formContext.ui.tabs.get(RD.TABS.TAB_GENERAL).sections.get(RD.SECCIONES.ROLES).setVisible(true);
            formContext.ui.tabs.get(RD.TABS.TAB_GENERAL).sections.get(RD.SECCIONES.DESCUENTO_VOLUMEN).setVisible(false);
            formContext.ui.tabs.get(RD.TABS.TAB_GENERAL).sections.get(RD.SECCIONES.DESCUENTO_AUTOMATICO).setVisible(false);
            break;
        case RD.TIPOREGLA.VOLUMEN:
            formContext.ui.tabs.get(RD.TABS.TAB_GENERAL).sections.get(RD.SECCIONES.ROLES).setVisible(false);
            formContext.ui.tabs.get(RD.TABS.TAB_GENERAL).sections.get(RD.SECCIONES.DESCUENTO_VOLUMEN).setVisible(true);
            formContext.ui.tabs.get(RD.TABS.TAB_GENERAL).sections.get(RD.SECCIONES.DESCUENTO_AUTOMATICO).setVisible(false);
            break;
        case RD.TIPOREGLA.AUTOMATICO:
            formContext.ui.tabs.get(RD.TABS.TAB_GENERAL).sections.get(RD.SECCIONES.ROLES).setVisible(false);
            formContext.ui.tabs.get(RD.TABS.TAB_GENERAL).sections.get(RD.SECCIONES.DESCUENTO_VOLUMEN).setVisible(false);
            formContext.ui.tabs.get(RD.TABS.TAB_GENERAL).sections.get(RD.SECCIONES.DESCUENTO_AUTOMATICO).setVisible(true);
            if (atm_tipo) {
                formContext.getControl(RD.CAMPOS.ATM_MONTO).setVisible(true);
                formContext.getAttribute(RD.CAMPOS.ATM_MONTO).setRequiredLevel(REQUIRED_LEVEL.REQUIRED);
                formContext.getControl(RD.CAMPOS.ATM_PORCENTAJE).setVisible(false);
                formContext.getAttribute(RD.CAMPOS.ATM_PORCENTAJE).setRequiredLevel(REQUIRED_LEVEL.NONE);
            } else {
                formContext.getControl(RD.CAMPOS.ATM_MONTO).setVisible(false);
                formContext.getAttribute(RD.CAMPOS.ATM_MONTO).setRequiredLevel(REQUIRED_LEVEL.NONE);
                formContext.getControl(RD.CAMPOS.ATM_PORCENTAJE).setVisible(true);
                formContext.getAttribute(RD.CAMPOS.ATM_PORCENTAJE).setRequiredLevel(REQUIRED_LEVEL.REQUIRED);
            }
            break;
        default:
            break;
    }
}

// ######################################
// Author: Sergio Redondo
// Fecha: Agosto 23 2023
// ######################################
VENTAS.JS.ReglaDescuento.CambiarAlcance = async function (executionContext) {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();
        let atm_alcancecode = formContext.getAttribute(RD.CAMPOS.ATM_ALCANCECODE);
        let atm_segmentocode = formContext.getAttribute(RD.CAMPOS.ATM_SEGMENTOCODE);


        if (atm_alcancecode.getValue()) {
            console.log(atm_alcancecode.getValue());
            let res = atm_alcancecode.getValue().filter(x => x === RD.ALCANCE.SEGMENTO)
            if (res.length > 0) {
                formContext.getControl(RD.CAMPOS.ATM_SEGMENTOCODE).setVisible(true);
                atm_segmentocode.setRequiredLevel(REQUIRED_LEVEL.REQUIRED);
            } else {
                formContext.getControl(RD.CAMPOS.ATM_SEGMENTOCODE).setVisible(false);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

// ######################################
// Author: Sergio Redondo
// Fecha: Agosto 23 2023
// ######################################
VENTAS.JS.ReglaDescuento.ActivarReglaDescuento = async function (primaryControl) {
    "use strict";
    try {

        let verificarexistenciaregistro = 0;
        let formContext = primaryControl;
        let atm_alcancecode = formContext.getAttribute(RD.CAMPOS.ATM_ALCANCECODE);
        let idregladescuento = formContext.data.entity.getId().replace("{", "").replace("}", "");

        if (atm_alcancecode.getValue()) {
            Xrm.Utility.showProgressIndicator('Validando aprobación regla de descuentos');
            for await (const segmento of atm_alcancecode.getValue()) {
                let entidad = await VENTAS.JS.ReglaDescuento.IdentificarEntidadBusquedad(segmento);
                if (segmento === RD.ALCANCE.SEGMENTO || segmento === RD.ALCANCE.CLIENTETUCAMION) verificarexistenciaregistro++;
                if (entidad != "") {
                    let consulta = await VENTAS.JS.Comun.ConsultarMultiplesEntidades(entidad, "?$filter=(_atm_regladescuentoid_value eq " + idregladescuento + ")");
                    if (consulta.entities.length > 0) {
                        verificarexistenciaregistro++;
                    }
                }
            }

            if (verificarexistenciaregistro === atm_alcancecode.getValue().length) {
                await VENTAS.JS.Comun.ActualizarRegistro(RD.NOMBRE_LOGICO, idregladescuento, { statuscode: RD.OPCIONES.STATUSCODE.APROBADO });
                formContext.data.refresh();
                Xrm.Utility.closeProgressIndicator();
                Xrm.Utility.openEntityForm(RD.NOMBRE_LOGICO, idregladescuento);
            } else {
                Xrm.Utility.closeProgressIndicator();
                await VENTAS.JS.Comun.AlertaError(formContext, "Se requiere que cada uno de los alcances seleccionados tenga por lo menos un registro asociado a la regla de descuento para aprobarla.")
            }
        }
    } catch (error) {
        VENTAS.JS.Comun.OpenAlerDialog("Ok", error)
        Xrm.Utility.closeProgressIndicator();
    }
}

// ######################################
// Author: Sergio Redondo
// Fecha: Agosto 23 2023
// ######################################
VENTAS.JS.ReglaDescuento.BorradorReglaDescuento = async function (primaryControl) {
    "use strict";
    try {
        let formContext = primaryControl;
        let confirmStrings = {
            cancelButtonLabel: 'Cancelar',
            confirmButtonLabel: 'Confirmar',
            //subtitle: 'Clic  confirmar el procesos',
            text: 'Al cambiar el estado en borrador el registro no se podra aplicar para las ofertas y oportunidadess',
            title: 'Cambiar estado en borrador'
        };
        let confirmOptions = { height: 200, width: 450 };
        let res = await VENTAS.JS.Comun.ConfirmarDialogo(formContext, confirmStrings, confirmOptions);
        console.log(res);
        if (res) {
            Xrm.Utility.showProgressIndicator('Modificando el registro...');
            await VENTAS.JS.Comun.ActualizarRegistro(RD.NOMBRE_LOGICO, formContext.data.entity.getId().replace("{", "").replace("}", ""), { statuscode: RD.OPCIONES.STATUSCODE.BORRADOR });
            formContext.data.refresh(true);
            Xrm.Utility.openEntityForm(RD.NOMBRE_LOGICO, formContext.data.entity.getId().replace("{", "").replace("}", ""));
            Xrm.Utility.closeProgressIndicator();
        }

    } catch (error) {
        console.log(error);
        Xrm.Utility.closeProgressIndicator();
    }
}

// ######################################
// Author: Sergio Redondo
// Fecha: Agosto 23 2023
// ######################################
VENTAS.JS.ReglaDescuento.IdentificarEntidadBusquedad = async function (alcance) {
    let entidadid = "";
    switch (alcance) {
        case RD.ALCANCE.CATEGORIA:
            entidadid = "atm_categoriasregladescuentos";
            break;
        case RD.ALCANCE.MARCA:
            entidadid = "atm_marcasregladescuento";
            break;
        case RD.ALCANCE.FORMADEPAGO:
            entidadid = "atm_formapagosregladescuento";
            break;
        case RD.ALCANCE.PRODUCTO:
            entidadid = "atm_productoregladescuento";
            break;
        case RD.ALCANCE.SUBCATEGORIA:
            entidadid = "atm_subcategoriaregladescuento";
            break;
        case RD.ALCANCE.RIN:
            entidadid = "atm_rinesregladescuento";
            break;
        case RD.ALCANCE.TIER:
            entidadid = "atm_tiersregladescuento";
            break;
        case RD.ALCANCE.DIMENSION:
            entidadid = "atm_dimensionregladescuento";
            break;
        case RD.ALCANCE.CLIENTE:
            entidadid = "atm_clienteregladescuentos";
            break;
        case RD.ALCANCE.REGIONAL:
            entidadid = "atm_regionalesregladescuento";
            break;
        default:
            break;
    }
    return entidadid;
}


// ######################################
// Author: Larry Suarez
// Fecha: Agosto 25 2023
// ######################################
VENTAS.JS.ReglaDescuento.BloquearBotonRibbonHijos = async function (executionContext) {
    "use strict";

    let existe = true;
    let formContext = executionContext;
    let statuscode = formContext.getAttribute(RD.CAMPOS.STATUSCODE).getValue()
    if (statuscode === RD.OPCIONES.STATUSCODE.APROBADO) {
        existe = false;
    }

    return existe;
}

// ######################################
// Author: Sergio Redondo
// Fecha: Septimebre 05 2023
// Description : Esta funcion se utiliza para cargar el script regla de descuento en el ribbon workbench
// ######################################
VENTAS.JS.ReglaDescuento.CargarScript = async function () {
    "use strict";
    console.log("CARGANDO SCRIPT");
};