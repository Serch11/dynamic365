using System;
using System.Collections.Generic;
using System.IdentityModel.Metadata;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
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
    public static class AF_Recoleccion
    {

        private static Conexion con;
        private static Utilidades utilidades = new Utilidades();

        [FunctionName("NotificacionVencimiento")]
        public static async Task<HttpResponseMessage> NotificacionVencimiento([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequestMessage req, TraceWriter log)
        {
            string nombre = null;

            try
            {
                //Datos data = await utilidades.ConvertirRequest<Datos>(req);
                string body = await req.Content.ReadAsStringAsync();

                Datos datos = JsonConvert.DeserializeObject<Datos>(body);
                con = new Conexion(datos.Ambiente, datos.Usuario, datos.Contrasena);
                IOrganizationService service = con.getCRMConn();
                utilidades = new Utilidades(service);

                DateTime fechahoy = DateTime.UtcNow;
                string nombreAsunto = string.Empty;
                Entity plantillacorreo = obtenerPlantilla(service, "PlantillaNotificacionAR-CreacionActividad");

                foreach (Guid id in datos.recolecciones)
                {
                    Entity recoleccion = service.Retrieve("atm_recoleccion", id, new ColumnSet(true));
                    DateTime fechavencimiento = recoleccion.GetAttributeValue<DateTime>("scheduledend");

                    var diferenciadias = fechahoy - fechavencimiento;

                    nombreAsunto = diferenciadias.Days > 3 ? "Actividad de recoleccion vencidad en tres dias" : diferenciadias.Days > 2 && diferenciadias.Days < 3 ? "Actividad de recoleccion vencidad en dos dias" : "Actividad de recoleccion vencidad en un dia";

                    if (recoleccion.Contains("requiredattendees"))
                    {
                        EntityCollection requiredattendees = recoleccion.GetAttributeValue<EntityCollection>("requiredattendees");
                        Entity regional = null;

                        regional = service.Retrieve(recoleccion.GetAttributeValue<EntityReference>("atm_regionalid").LogicalName, recoleccion.GetAttributeValue<EntityReference>("atm_regionalid").Id, new ColumnSet("atm_responsabledelogistica", "atm_directorregional"));

                        EntityCollection usuariosToRef = new EntityCollection();
                        if (regional.Contains("atm_responsabledelogistica"))
                        {
                            Entity party1 = new Entity("activityparty");
                            party1["addressused"] = regional.GetAttributeValue<string>("atm_responsabledelogistica");
                            usuariosToRef.Entities.Add(party1);
                        }
                        foreach (Entity ent in requiredattendees.Entities)
                        {
                            Entity party2 = new Entity("activityparty");
                            Entity registro = service.Retrieve(ent.GetAttributeValue<EntityReference>("partyid").LogicalName, ent.GetAttributeValue<EntityReference>("partyid").Id, new ColumnSet(true));
                            party2["addressused"] = registro.GetAttributeValue<string>("internalemailaddress");
                            party2["partyid"] = new EntityReference(registro.LogicalName, registro.Id);
                            usuariosToRef.Entities.Add(party2);
                        }
                        enviarCorreo(service, plantillacorreo, recoleccion.ToEntityReference(), recoleccion.GetAttributeValue<EntityReference>("createdby"), usuariosToRef, recoleccion.ToEntityReference(), nombreAsunto);
                    }
                }

                return req.CreateResponse(HttpStatusCode.OK,
                        new ReturnResponse()
                        {
                            Correcto = true,
                            Mensaje = "Notificaciones enviadas",
                            Datos = utilidades.errores.ErroresEnvioCorreo
                        });

            }
            catch (System.Exception ex)
            {
                return req.CreateResponse(HttpStatusCode.OK,
                         new ReturnResponse()
                         {
                             Correcto = true,
                             Mensaje = "Error no controlado " + ex.Message,
                             Datos = utilidades.errores.ErroresEnvioCorreo
                         });
            }
        }

        public static Entity obtenerPlantilla(IOrganizationService service, String nombrePlantilla)
        {
            QueryExpression query = new QueryExpression("template");
            query.ColumnSet = new ColumnSet(false);
            query.Criteria.AddCondition("title", ConditionOperator.Equal, nombrePlantilla);

            EntityCollection result = service.RetrieveMultiple(query);

            return result.Entities.FirstOrDefault();
        }


        private static void enviarCorreo(IOrganizationService service, Entity plantilla, EntityReference entRec, EntityReference usuarioFromRef, EntityCollection usuarioToRef, EntityReference entAcc, string asunto)
        {
            try
            {
                InstantiateTemplateRequest instantiateTemplateRequest = new InstantiateTemplateRequest
                {
                    TemplateId = plantilla.Id,
                    ObjectId = entRec.Id,
                    ObjectType = entRec.LogicalName
                };

                InstantiateTemplateResponse instantiateTemplateResponse = (InstantiateTemplateResponse)service.Execute(instantiateTemplateRequest);

                Entity email = instantiateTemplateResponse.EntityCollection.Entities.FirstOrDefault();

                if (email != null)
                {

                    email["from"] = new Entity[] { new Entity("activityparty") { Attributes = new AttributeCollection() { new KeyValuePair<string, object>("partyid", usuarioFromRef) } } };
                    email["to"] = usuarioToRef;
                    email["subject"] = asunto;

                    Guid idEmail = service.Create(email);
                    SendEmailRequest request = new SendEmailRequest();
                    request.EmailId = idEmail;
                    request.IssueSend = true;
                    request.TrackingToken = "";
                    service.Execute(request);
                }
            }
            catch (Exception e)
            {
                throw new InvalidPluginExecutionException($"Error enviando correo: {e.Message} ", e);
            }
        }
    }

    public class Datos : ConectarRequest
    {
        public List<Guid> recolecciones { get; set; } = new List<Guid>();
    }



}

