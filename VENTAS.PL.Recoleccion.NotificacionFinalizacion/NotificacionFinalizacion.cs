using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.PL.Recoleccion.NotificacionFinalizacion
{
    public class NotificacionFinalizacion : IPlugin
    {

        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(null); //Se coloca null para que se ejecute como SYSTEM

            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));


            if (context.MessageName == "SetStateDynamicEntity")
            {
                EntityReference targetEntity = (EntityReference)context.InputParameters["EntityMoniker"];
                Run(service, targetEntity, seguimiento);
            }
        }

        public void Run(IOrganizationService service, EntityReference entityRef, ITracingService seguimiento)
        {
            int executionSection = 0;
            string pluginName = "VENTAS.PL.Recoleccion.NotificacionFinalizacion";

            try
            {
                if (seguimiento != null) { seguimiento.Trace(string.Format("Inicia ejecución PL: {0}", pluginName)); }

                Entity entity = service.Retrieve("atm_recoleccion", entityRef.Id, new ColumnSet(true));

                if (entity.Contains("regardingobjectid"))
                {
                    //Pasar la nota
                    QueryExpression consulta = new QueryExpression() { EntityName = "annotation" };
                    consulta.ColumnSet = new ColumnSet(true);
                    consulta.Criteria.AddCondition("objectid", ConditionOperator.Equal, entity.Id);

                    EntityCollection annotations = service.RetrieveMultiple(consulta);

                    foreach (Entity annotation in annotations.Entities)
                    {
                        Entity newAnnotation = new Entity() { LogicalName = "annotation" };
                        newAnnotation.Attributes.Add("objectid", entity.GetAttributeValue<EntityReference>("regardingobjectid"));
                        newAnnotation.Attributes.Add("objecttypecode", entity.GetAttributeValue<EntityReference>("regardingobjectid").LogicalName);

                        if (annotation.Contains("subject"))
                            newAnnotation.Attributes.Add("subject", entity.GetAttributeValue<string>("subject"));

                        if (annotation.Contains("isdocument"))
                            newAnnotation.Attributes.Add("isdocument", annotation.GetAttributeValue<bool>("isdocument"));

                        if (annotation.Contains("notetext"))
                            newAnnotation.Attributes.Add("notetext", annotation.GetAttributeValue<string>("notetext"));

                        if (annotation.Contains("documentbody"))
                            newAnnotation.Attributes.Add("documentbody", annotation.GetAttributeValue<string>("documentbody"));

                        if (annotation.Contains("filename"))
                            newAnnotation.Attributes.Add("filename", annotation.GetAttributeValue<string>("filename"));

                        if (annotation.Contains("mimetype"))
                            newAnnotation.Attributes.Add("mimetype", annotation.GetAttributeValue<string>("mimetype"));

                        service.Create(newAnnotation);
                    }

                    Entity plantilla = obtenerPlantilla(service, "PlantillaNotificacionActividad-CierreRecoleccion");

                    EntityReference propietario = entity.GetAttributeValue<EntityReference>("ownerid");
                    EntityReference autor = entity.GetAttributeValue<EntityReference>("createdby");
                    Entity account = service.Retrieve(entity.GetAttributeValue<EntityReference>("regardingobjectid").LogicalName, entity.GetAttributeValue<EntityReference>("regardingobjectid").Id, new Microsoft.Xrm.Sdk.Query.ColumnSet(new string[] { "ownerid" }));

                    List<Entity> usuariosToRef = new List<Entity>();

                    if (autor.Id != account.GetAttributeValue<EntityReference>("ownerid").Id)
                    {
                        usuariosToRef.Add(new Entity("activityparty") { Attributes = new AttributeCollection() { new KeyValuePair<string, object>("partyid", autor) } });
                        usuariosToRef.Add(new Entity("activityparty") { Attributes = new AttributeCollection() { new KeyValuePair<string, object>("partyid", account.GetAttributeValue<EntityReference>("ownerid")) } });
                    }
                    else
                    {
                        usuariosToRef.Add(new Entity("activityparty") { Attributes = new AttributeCollection() { new KeyValuePair<string, object>("partyid", autor) } });
                    }

                    EntityReference reference = entity.GetAttributeValue<EntityReference>("regardingobjectid");
                    enviarCorreo(service, plantilla, entity.ToEntityReference(), propietario, usuariosToRef.ToArray(), account.ToEntityReference());
                }

                if (seguimiento != null) { seguimiento.Trace(string.Format("Finaliza ejecución PL: {0}", pluginName)); }
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

        private static void enviarCorreo(IOrganizationService service, Entity plantilla, EntityReference entRec, EntityReference usuarioFromRef, Entity[] usuarioToRef, EntityReference entAcc)
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
                throw new InvalidPluginExecutionException($"Error enviando correo: { e.Message } ", e);
            }
        }

    }
}
