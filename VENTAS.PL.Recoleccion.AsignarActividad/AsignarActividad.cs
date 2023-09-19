using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.PL.Recoleccion.AsignarActividad
{
    public class AsignarActividad : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(null); //Se coloca null para que se ejecute como SYSTEM

            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            Entity targetEntity = null;

            if (context.MessageName == "Create")
            {
                targetEntity = (Entity)context.InputParameters["Target"];
                Run(service, targetEntity, seguimiento);
            }
        }

        public void Run(IOrganizationService service, Entity entity, ITracingService seguimiento)
        {
            int executionSection = 0;
            string pluginName = "VENTAS.PL.Recoleccion.AsignarActividad2";

            try
            {
                EntityReference autor = entity.GetAttributeValue<EntityReference>("createdby");
                EntityReference regarding = entity.GetAttributeValue<EntityReference>("regardingobjectid");
                Entity account = service.Retrieve(regarding.LogicalName, regarding.Id, new ColumnSet(new string[] { "ownerid" }));
                Entity URL = service.Retrieve("atm_parametro", new Guid("2168605d-ef0f-ee11-8f6e-000d3ac162dc"), new ColumnSet(new string[] { "atm_valor" }));


                if (entity.Contains("requiredattendees"))
                {
                    //Enviamos el correo a los attendees
                    EntityCollection requiredattendees = entity.GetAttributeValue<EntityCollection>("requiredattendees");
                    Entity regional = null;
                    if (entity.Contains("atm_regionalid"))
                    {
                        regional = service.Retrieve(entity.GetAttributeValue<EntityReference>("atm_regionalid").LogicalName, entity.GetAttributeValue<EntityReference>("atm_regionalid").Id, new ColumnSet("atm_responsabledelogistica", "atm_directorregional"));
                    }

                    //consultar direccion recoleccion.
                    Entity direccion = service.Retrieve("atm_direccion", entity.GetAttributeValue<EntityReference>("atm_direccionid").Id, new ColumnSet(true));
                    //Asignamos registro
                    Entity updateAct = new Entity() { Id = entity.Id, LogicalName = entity.LogicalName };
                    updateAct.Attributes.Add("ownerid", requiredattendees[0].GetAttributeValue<EntityReference>("partyid"));
                    if (direccion.Contains("atm_ciudadid"))
                    {
                        updateAct.Attributes.Add("atm_ciudadrecoleccion", direccion.GetAttributeValue<EntityReference>("atm_ciudadid").Name);
                    }
                    updateAct.Attributes.Add("atm_linkcrm", $"{URL.GetAttributeValue<string>("atm_valor")}main.aspx?etc=10578&id={entity.Id}&histKey=683708833&newWindow=true&pagetype=entityrecord");
                    service.Update(updateAct);

                    if (regional.Contains("atm_directorregional"))
                    {
                        CompartirRegistro(entity, regional.GetAttributeValue<EntityReference>("atm_directorregional"), service);
                    }

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

                    Entity plantilla = obtenerPlantilla(service, "PlantillaNotificacionAR-CreacionActividad");
                    if (entity.GetAttributeValue<bool>("atm_creadamodooffline") == false)
                    {
                        enviarCorreo(service, plantilla, entity.ToEntityReference(), autor, usuariosToRef, account.ToEntityReference());
                    }
                }

            }
            catch (Exception e)
            {
                if (seguimiento != null) { seguimiento.Trace("Error: " + e.Message); }
                throw new InvalidPluginExecutionException(string.Format("Error: {0} - ({1}) Execution Section {2}", e.Message, pluginName, executionSection.ToString()), e);
            }
        }

        private static Entity obtenerPlantilla(IOrganizationService service, String nombrePlantilla)
        {
            QueryExpression query = new QueryExpression("template");
            query.ColumnSet = new ColumnSet(false);
            query.Criteria.AddCondition("title", ConditionOperator.Equal, nombrePlantilla);

            EntityCollection result = service.RetrieveMultiple(query);

            return result.Entities.FirstOrDefault();
        }

        public static void CompartirRegistro(Entity recoleccion, EntityReference systemuser, IOrganizationService service)
        {
            try
            {
                AccessRights AccessRights = new AccessRights();

                AccessRights = AccessRights.ReadAccess |
                                 AccessRights.WriteAccess |
                                 AccessRights.AppendToAccess |
                                 AccessRights.AppendAccess;

                var grantAccessRequest = new GrantAccessRequest
                {
                    PrincipalAccess = new PrincipalAccess
                    {
                        AccessMask = AccessRights,
                        Principal = systemuser
                    },
                    Target = recoleccion.ToEntityReference()
                };
                service.Execute(grantAccessRequest);
            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException($"Error: {ex.Message}");
            }
        }

        private static void enviarCorreo(IOrganizationService service, Entity plantilla, EntityReference entRec, EntityReference usuarioFromRef, EntityCollection usuarioToRef, EntityReference entAcc)
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
                    email["regardingobjectid"] = entAcc;
                    email["from"] = new Entity[] { new Entity("activityparty") { Attributes = new AttributeCollection() { new KeyValuePair<string, object>("partyid", usuarioFromRef) } } };
                    email["to"] = usuarioToRef;

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
}