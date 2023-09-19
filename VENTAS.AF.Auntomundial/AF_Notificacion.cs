using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Newtonsoft.Json;
using VENTAS.AF.Automundial.Helpers;
using VENTAS.AF.Automundial.Models;

namespace VENTAS.AF.Automundial
{
    public static class AF_Notificacion
    {
        private static Conexion con;
        private static Utilidades utilidades = new Utilidades();

        [FunctionName("EnviarNotificaciones")]
        public static async Task<HttpResponseMessage> EnviarNotificaciones([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequestMessage req, TraceWriter log)
        {

            List<Entity> listaNotificaciones = new List<Entity>();
            List<Entity> listaCorreos = new List<Entity>();
            List<InfoCorreo> listaInfoCorreo = new List<InfoCorreo>();
            try
            {
                ConectarRequest data = await utilidades.ConvertirRequest<CompartirRegistrosRequest>(req);
                con = new Conexion(data.Ambiente, data.Usuario, data.Contrasena);
                IOrganizationService service = con.getCRMConn();
                utilidades = new Utilidades(service);

                WhoAmIRequest systemUserRequest = new WhoAmIRequest();
                WhoAmIResponse systemUserResponse = (WhoAmIResponse)service.Execute(systemUserRequest);
                Guid userId = systemUserResponse.UserId;


                //Actividades vencidas
                List<Entity> actividades = utilidades.ConsultarMultiplesRegistrosFetch(@"
                                            <fetch {0} version='1.0' output-format='xml-platform' mapping='logical' distinct='false' no-lock='false'>
                                              <entity name='activitypointer'>
                                                <attribute name='subject' />
                                                <attribute name='activitytypecode' />
                                                <attribute name='regardingobjectid' />
                                                <attribute name='ownerid' />
                                                <attribute name='createdby' />
                                                <order attribute='subject' descending='false' />
                                                <attribute name='activityid' />
                                                <filter type='and'>
                                                  <condition attribute='activitytypecode' operator='in'>
                                                    <value>4210</value>
                                                    <value>4201</value>
                                                    <value>4212</value>
                                                  </condition>
                                                  <condition attribute='statecode' operator='in'>
                                                    <value>0</value>
                                                    <value>3</value>
                                                  </condition>
                                                  <filter type='or'>
                                                    <condition attribute='scheduledend' operator='olderthan-x-days' value='1' />
                                                    <condition attribute='scheduledend' operator='null' />
                                                  </filter>
                                                  <filter type='and'>
                                                    <condition attribute='activitytypecode' operator='ne' value='4220' />
                                                  </filter>
                                                </filter>
                                              </entity>
                                            </fetch>");
                var agruparActividades = actividades.GroupBy(x => x.GetAttributeValue<EntityReference>("ownerid"));

                foreach (var usuario in agruparActividades)
                {
                    Entity notificacion = new Entity() { LogicalName = "appnotification" };
                    notificacion.Attributes.Add("title", $"Actividades vencidas");
                    notificacion.Attributes.Add("body", $"Estimado usuario, tiene un total de **{usuario.Count()}** actividades vencidas a la fecha");
                    notificacion.Attributes.Add("ownerid", usuario.Key);
                    notificacion.Attributes.Add("icontype", new OptionSetValue(100000000));
                    notificacion.Attributes.Add("toasttype", new OptionSetValue(200000000));
                    notificacion.Attributes.Add("data", JsonConvert.SerializeObject(
                        new data()
                        {
                            actions = new actions()
                            {
                                title = "Ver Registros",
                                data = new dataurl()
                                {
                                    url = "?pagetype=entitylist&etn=activitypointer&viewid=9b8cc19c-7c4f-ed11-bba3-000d3ac162dc&viewType=1039"
                                }
                            }
                        }));
                    listaNotificaciones.Add(notificacion);
                    listaInfoCorreo.Add(new InfoCorreo() { contador = usuario.Count(), tipo = "Actividades", usuario = usuario.Key });
                }

                //Cuentas sin vehiculos
                List<Entity> cuentasVehiculos = utilidades.ConsultarMultiplesRegistrosFetch(@"<fetch {0} version='1.0' output-format='xml-platform' mapping='logical' distinct='false' no-lock='false'>
                                <entity name='account'>                                
                                    <attribute name='name'/>
                                    <attribute name='atm_idcuenta'/>
                                    <attribute name='accountid'/>
                                    <attribute name='atm_numerovehiculostxt'/>
                                    <attribute name='ownerid'/>
                                    <order attribute='ownerid' descending='false'/>
                                    <filter type='and'>
                                        <condition attribute='statecode' operator='eq' value='0'/>
                                        <condition attribute='atm_numerovehiculostxt' operator='null'/>
                                        <condition attribute='accountratingcode' operator='ne' value='963540002'/>
                                    </filter>
                                </entity>
                            </fetch>");
                var agruparCuentas = cuentasVehiculos.GroupBy(x => x.GetAttributeValue<EntityReference>("ownerid"));

                foreach (var usuario in agruparCuentas)
                {
                    Entity notificacion = new Entity() { LogicalName = "appnotification" };
                    notificacion.Attributes.Add("title", $"Cuentas sin vehículos");
                    notificacion.Attributes.Add("body", $"Estimado usuario, tiene un total de **{usuario.Count()}** cuentas sin vehículos");
                    notificacion.Attributes.Add("ownerid", usuario.Key);
                    notificacion.Attributes.Add("icontype", new OptionSetValue(100000000));
                    notificacion.Attributes.Add("toasttype", new OptionSetValue(200000000));
                    notificacion.Attributes.Add("data", JsonConvert.SerializeObject(
                        new data()
                        {
                            actions = new actions()
                            {
                                title = "Ver Registros",
                                data = new dataurl()
                                {
                                    url = "?pagetype=entitylist&etn=account&viewid=8a8b4713-28c9-ed11-b596-000d3ac1076a&viewType=1039"
                                }
                            }
                        }));
                    listaNotificaciones.Add(notificacion);
                    listaInfoCorreo.Add(new InfoCorreo() { contador = usuario.Count(), tipo = "Vehiculos", usuario = usuario.Key });
                }

                //Cuentas sin contactos
                List<Entity> cuentasContactos = utilidades.ConsultarMultiplesRegistrosFetch(@"<fetch {0} version='1.0' output-format='xml-platform' mapping='logical' distinct='false' no-lock='false'>
                                <entity name='account'>                                
                                    <attribute name='name'/>
                                    <attribute name='atm_idcuenta'/>
                                    <attribute name='accountid'/>
                                    <attribute name='ownerid'/>
                                    <order attribute='ownerid' descending='false'/>
                                    <filter type='and'>
                                        <condition attribute='statecode' operator='eq' value='0' />
                                        <condition attribute='accountratingcode' operator='ne' value='963540002'/>
                                    </filter>
                                    <link-entity name='contact' alias='ab' link-type='outer' from='parentcustomerid' to='accountid'/>
                                        <filter type='and'>
                                            <condition attribute='parentcustomerid' operator='null' entityname='ab'/>
                                        </filter>
                                </entity>
                            </fetch>");
                var agruparCuentasContactos = cuentasContactos.GroupBy(x => x.GetAttributeValue<EntityReference>("ownerid"));

                foreach (var usuario in agruparCuentasContactos)
                {
                    Entity notificacion = new Entity() { LogicalName = "appnotification" };
                    notificacion.Attributes.Add("title", $"Cuentas sin contactos");
                    notificacion.Attributes.Add("body", $"Estimado usuario, tiene un total de **{usuario.Count()}** cuentas sin contactos");
                    notificacion.Attributes.Add("ownerid", usuario.Key);
                    notificacion.Attributes.Add("icontype", new OptionSetValue(100000000));
                    notificacion.Attributes.Add("toasttype", new OptionSetValue(200000000));
                    notificacion.Attributes.Add("data", JsonConvert.SerializeObject(
                        new data()
                        {
                            actions = new actions()
                            {
                                title = "Ver Registros",
                                data = new dataurl()
                                {
                                    url = "?pagetype=entitylist&etn=account&viewid=0a601043-29c9-ed11-b596-000d3ac1076a&viewType=1039"
                                }
                            }
                        }));
                    listaNotificaciones.Add(notificacion);
                    listaInfoCorreo.Add(new InfoCorreo() { contador = usuario.Count(), tipo = "Contactos", usuario = usuario.Key });
                }

                utilidades.EjecutarGuardadoMultiple(listaNotificaciones);
                
                var agruparInfoCorreos = listaInfoCorreo.GroupBy(x => x.usuario);

                //Enviar correos de forma masiva!
                foreach (var usuario in agruparInfoCorreos)
                {
                    var act = 0;
                    var cuentasVeh = 0;
                    var cuentasCont = 0;

                    EntityReference usuarioFromRef = new EntityReference() { Id = userId, LogicalName = "systemuser" };
                    EntityReference usuarioToRef = usuario.Key;

                    foreach (InfoCorreo infoCorreo in usuario)
                    {
                        switch (infoCorreo.tipo)
                        {
                            case "Actividades":
                                act = infoCorreo.contador;
                                break;
                            case "Vehiculos":
                                cuentasVeh = infoCorreo.contador;
                                break;
                            case "Contactos":
                                cuentasCont = infoCorreo.contador;
                                break;
                        }
                    }
                     //var u = $"ms-apps-sales:{data.Ambiente.Substring(6, 34)}_1bb39de2-7cad-eb11-8236-000d3ac17912?tenantId=b2924d49-7059-4217-bf1e-a56430be3125&isShortcut=true&appType=AppModule&openApp=true&restartApp=true&forceOfflineDataSync=true&pagetype=entitylist&etn=activitypointer&viewid=9b8cc19c-7c4f-ed11-bba3-000d3ac162dc&viewType=1039";

                    string mensaje = $@"Información diaria de notificaciones.
                                    <br/>
                                    <br/>
                                    Apreciado {usuario.Key.Name}, a continuación se presenta el informe diario de actividades y clientes:
                                    <br/>
                                    <br/>
                                    Actividades vencidas: {act} - <a href='{data.Ambiente}main.aspx?pagetype=entitylist&etn=activitypointer&viewid=9b8cc19c-7c4f-ed11-bba3-000d3ac162dc&viewType=1039'>Web</a>
                                    <br/>
                                    Cuentas sin vehículos {cuentasVeh} - <a href='{data.Ambiente}main.aspx?pagetype=entitylist&etn=account&viewid=8a8b4713-28c9-ed11-b596-000d3ac1076a&viewType=1039'>Web</a>
                                    <br/>
                                    Cuentas sin contactos: {cuentasCont} - <a href='{data.Ambiente}main.aspx?pagetype=entitylist&etn=account&viewid=0a601043-29c9-ed11-b596-000d3ac1076a&viewType=1039'>Web</a>
                                    <br/>
                                    <br/>
                                    Le deseamos un excelente día.
                                    <br/>
                                    *** Este correo es solo de carácter informativo, por favor no responder.";

                    Entity email = new Entity("email");
                    
                    email["subject"] = "Notificación diaría de actividades y cuentas";
                    //email["IsBodyHtml "] = true;
                    email["description"] = mensaje;
                    email["from"] = new Entity[] { new Entity("activityparty") { Attributes = new AttributeCollection() { new KeyValuePair<string, object>("partyid", usuarioFromRef) } } };
                    email["to"] = new Entity[] { new Entity("activityparty") { Attributes = new AttributeCollection() { new KeyValuePair<string, object>("partyid", usuarioToRef) } } };
                    email["ownerid"] = usuarioFromRef;

                    listaCorreos.Add(email);
                }

                utilidades.EnviarCorreoMasivoSinPlantilla(listaCorreos);

                return req.CreateResponse(HttpStatusCode.OK,
                        new ReturnResponse()
                        {
                            Correcto = true,
                            Mensaje = "Notificaciones enviadas",
                            Datos = utilidades.errores.ErroresEnvioCorreo
                        });
            }
            catch (Exception e)
            {
                return req.CreateResponse(HttpStatusCode.InternalServerError,
                        new ReturnResponse()
                        {
                            Correcto = false,
                            Mensaje = "Error No Controlado: " + e.Message,
                            Datos = utilidades.errores.ErroresGenerales
                        });
            }
        }

        public class data
        {
            public actions actions { get; set; }
        }

        public class actions
        {
            public string title { get; set; }
            public dataurl data { get; set; }
        }

        public class dataurl
        {
            public string url { get; set; }
        }

        public class InfoCorreo
        {
            public EntityReference usuario { get; set; }

            public int contador { get; set; }
            public string tipo { get; set; }
        }
    }
}
