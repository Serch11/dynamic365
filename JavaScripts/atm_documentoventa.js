
if (typeof VENTAS === "undefined") {
    VENTAS = {};
    VENTAS.JS = {}
}
if (typeof VENTAS.JS === "undefined") {
    VENTAS.JS = {}
}

VENTAS.JS.DocumentoVenta = {};



VENTAS.JS.DocumentoVenta.OnLoadForm = async (executionContext) => {
    "use strict";
    try {

        let formContext = executionContext.getFormContext();
        formContext.getControl("Documento").addOnLoad(RefrescarRibbon);

        if (formContext.ui.getFormType() == FORM_TYPE.UPDATE) {
            formContext.getControl('atm_name').setDisabled(true);
        }

    } catch (error) {

    }
}

VENTAS.JS.DocumentoVenta.IniciarCreacionDeCorreo = async (formContext) => {
    try {

        const ID = formContext.data.entity.getId();
        const USERID = Xrm.Utility.getGlobalContext().userSettings.userId.replace("{", "").replace("}", "");

        let obtenerUrl = await VENTAS.JS.Comun.ConsultarMultiplesEntidades("atm_parametro", "?$select=atm_valor&$filter=(atm_nombre eq 'URLDESCARGARIMAGENSHAREPOINT')");

        const URL = obtenerUrl.entities[0].atm_valor;

        Xrm.Utility.showProgressIndicator("Preparando envio de correo...");

        let imagen = await realizarPeticion(URL, ID);

        if (imagen.imagen) {
            let nuevoCorreo = await CrearCorreo(USERID);
            if (nuevoCorreo) {
                await crearAdjunto(nuevoCorreo.id, nuevoCorreo.entityType, imagen.imagen["$content-type"], imagen.imagen["$content"], imagen.array[0]["{FilenameWithExtension}"]);
            }
            CerrarProgressIndicador();
            await NavigateTo({
                pageType: "entityrecord",
                entityName: "email",
                entityId: nuevoCorreo.id
            });

        } else {
            CerrarProgressIndicador();
            VENTAS.JS.Comun.OpenAlerDialog("Ok", "No puede realizar el envio de un correo si la entidad no tiene una imagen cargada");
        }
    } catch (error) {
        CerrarProgressIndicador();
    }
}

VENTAS.JS.DocumentoVenta.OcultarBotonesGrid = async (executionContext) => {
    "use strict";
    try {
        let formContext = executionContext;
        let entidad = "atm_documentoventa";
        let resultado = false;
        if (formContext.data.entity.getEntityName() === entidad) {
            resultado = false;
        }
        return resultado;
    } catch (error) {

    }
}

VENTAS.JS.DocumentoVenta.OcultarBotonCargar = async (executionContext) => {
    "use strict";
    try {
        let formContext = executionContext;
        let resultado = true;
        let entidad = "atm_documentoventa";
        const ID = formContext.data.entity.getId();

        if (formContext.data.entity.getEntityName() === entidad) {
            let obtenerUrl = await VENTAS.JS.Comun.ConsultarMultiplesEntidades("atm_parametro", "?$select=atm_valor&$filter=(atm_nombre eq 'URLDESCARGARIMAGENSHAREPOINT')");
            const URL = obtenerUrl.entities[0].atm_valor;
            let imagen = await realizarPeticion(URL, ID);
            if (imagen.imagen) {
                resultado = false;
            }
        }
        return resultado;
    } catch (error) {

    }
}

VENTAS.JS.DocumentoVenta.IniciarImportacionMasivaDeArchivos = async (executionContext, selecteControl) => {
    try {

        Xrm.Navigation.navigateTo(
            {
                pageType: "webresource",
                webresourceName: "atm_importardocumento",
            },
            {
                target: 2,
                position: 1,
                width: { value: 50, unit: "%" },
            }
        ).then(
            function success() {
                // Run code on success
                selecteControl.refresh();
            },
            function error() {
                // Handle errors
            }
        );
    } catch (error) {
        console.log(error);
    }
}

async function CrearCorreo(userId) {
    return new Promise((resolve, rejects) => {
        try {

            var activityParties = []
            var Sender = {};

            Sender["partyid_systemuser@odata.bind"] = "/systemusers(" + userId + ")";
            Sender["participationtypemask"] = 1;
            activityParties.push(Sender);

            var createEmailRequest = {
                "email_activity_parties": activityParties,
                "scheduledend": new Date().toISOString()
            }
            Xrm.WebApi.createRecord('email', createEmailRequest).then(
                function success(Email) {
                    resolve(Email)
                },
                function Error(e) {
                    rejects(e);
                }
            )
        } catch (error) {

        }
    })
}

async function realizarPeticion(URL, ID) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ID: ID.replace("{", "").replace("}", "")
                    })
                }
            );
            if (response.ok === true)
                resolve(response.json());
            else resolve({ ok: false })
        } catch (error) {
            reject(error);
        }

    })
}

function crearAdjunto(activityId, activityType, mimetype, imagen, nombre) {

    return new Promise((resolve, reject) => {
        try {
            console.log(activityId);
            var entity = {};
            entity["objectid_activitypointer@odata.bind"] = "/activitypointers(" + activityId + ")";
            entity.body = imagen; //your file encoded with Base64
            entity.filename = nombre;
            entity.subject = nombre;
            entity.objecttypecode = activityType;
            //entity.mimetype = mimetype;

            console.log(entity);

            var req = new XMLHttpRequest();
            req.open("POST", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/activitymimeattachments", true);
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.onreadystatechange = function () {
                if (this.readyState === 4) {
                    req.onreadystatechange = null;
                    if (this.status === 204) {
                        var uri = this.getResponseHeader("OData-EntityId");
                        var regExp = /\(([^)]+)\)/;
                        var matches = regExp.exec(uri);
                        var newEntityId = matches[1];
                        resolve(newEntityId);
                    } else {
                        Xrm.Utility.alertDialog(this.statusText);
                    }
                }
            };
            req.send(JSON.stringify(entity));
        } catch (error) {
            console.log(error);
            reject(error.message)
        }
    })
}

async function NavigateTo(pageInput) {
    "use strict";

    return new Promise((resolve, reject) => {
        try {
            let navigationOptions = {
                target: 2,
                height: { value: 80, unit: "%" },
                width: { value: 70, unit: "%" },
                position: 1
            };
            Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(
                function success(result) {
                    resolve(result);
                },
                function error(error) {
                    resolve(error);
                }
            );
        } catch (error) {
            reject(error);
        }
    })
}

function CerrarProgressIndicador() {
    Xrm.Page.data.refresh();
    Xrm.Page.ui.refreshRibbon();
    Xrm.Utility.closeProgressIndicator();
}


function RefrescarRibbon(executionContext) {
    "use strict";
    try {
        let formContext = executionContext.getFormContext();
        formContext.ui.refreshRibbon(true);
        formContext.getControl("Documento").refreshRibbon();
    } catch (error) {

    }
}