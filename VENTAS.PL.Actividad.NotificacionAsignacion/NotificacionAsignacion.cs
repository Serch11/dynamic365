using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;

namespace VENTAS.PL.Actividad.NotificacionAsignacion
{
    public class NotificacionAsignacion : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(context.UserId); //Se coloca null para que se ejecute como SYSTEM

            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            Entity targetEntity = null;


            if (context.MessageName == "Create")
            {
                targetEntity = (Entity)context.InputParameters["Target"];
            }

            if (targetEntity != null)
                Run(service, targetEntity, seguimiento);
        }

        public void Run(IOrganizationService service, Entity entity, ITracingService seguimiento)
        {
            int executionSection = 0;
            string pluginName = "VENTAS.PL.Actividad.NotificacionAsignacion";
            try
            {
                executionSection = 1;
                if (seguimiento != null) { seguimiento.Trace(string.Format("Inicia ejecución PL: {0}", pluginName));}

                //throw new InvalidPluginExecutionException(entity.GetAttributeValue<EntityReference>("createdby").Id + " - " + entity.GetAttributeValue<EntityReference>("ownerid").Id);

                if (entity.GetAttributeValue<EntityReference>("createdby").Id != entity.GetAttributeValue<EntityReference>("ownerid").Id)
                {
                    executionSection = 2;
                    if (entity.Contains("regardingobjectid") && entity.GetAttributeValue<EntityReference>("ownerid").LogicalName != "team" )
                    {
                        executionSection = 3;
                        Entity userTo = entity;
                        var entidad = "createdby";
                        if ( entity.GetAttributeValue<EntityReference>("regardingobjectid").LogicalName == "lead" ) {
                            entidad = "atm_preventistaid";
                            Entity Lead = service.Retrieve("lead", entity.GetAttributeValue<EntityReference>("regardingobjectid").Id, new ColumnSet(true));
                            userTo = Lead;
                        }
                        Entity plantilla = obtenerPlantilla(service, "PlantillaNotificacionActividad-AsignacionActividad");
                        EntityReference reference = entity.GetAttributeValue<EntityReference>("regardingobjectid");
                        executionSection = 4;
                        enviarCorreo(service, plantilla, reference, userTo.GetAttributeValue<EntityReference>(entidad), entity.GetAttributeValue<EntityReference>("ownerid"));
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

        private static void enviarCorreo(IOrganizationService service, Entity plantilla, EntityReference entRef, EntityReference usuarioFromRef, EntityReference usuarioToRef)
        {
            try
            {
                InstantiateTemplateRequest instantiateTemplateRequest = new InstantiateTemplateRequest
                {
                    TemplateId = plantilla.Id,
                    ObjectId = entRef.Id,
                    ObjectType = entRef.LogicalName
                };

                InstantiateTemplateResponse instantiateTemplateResponse = (InstantiateTemplateResponse)service.Execute(instantiateTemplateRequest);

                Entity email = instantiateTemplateResponse.EntityCollection.Entities.FirstOrDefault();

                if (email != null)
                {
                    email["regardingobjectid"] = entRef;
                    email["from"] = new Entity[] { new Entity("activityparty") { Attributes = new AttributeCollection() { new KeyValuePair<string, object>("partyid", usuarioFromRef) } } };
                    email["to"] = new Entity[] { new Entity("activityparty") { Attributes = new AttributeCollection() { new KeyValuePair<string, object>("partyid", usuarioToRef) } } };
                    email["ownerid"] = usuarioFromRef;

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
                throw new InvalidPluginExecutionException($"Error enviando correo: { e.Message } ", e);
            }
        }

    }
}
