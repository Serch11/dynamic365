using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Crm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Crm.Sdk.Messages;

namespace VENTAS.PL.PVSC.AprobacionSolicitudCredito
{
    public class EnviarCorreoAprobacionSolicitudCredito : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(context.UserId);

            Entity entidad = null;
            if (context.MessageName == "Update" && context.InputParameters.Contains("Target"))
            {
                entidad = (Entity)context.PostEntityImages["PostImage"];
            }

            if (entidad != null)
            {
                Run(service, entidad, seguimiento);
            }

        }

        private void Run(IOrganizationService service, Entity entidad, ITracingService seguimiento)
        {
            try
            {
                EntityCollection usuariosToRef = new EntityCollection();
                EntityReference fase = entidad.GetAttributeValue<EntityReference>("activestageid");
                if (fase.Name == "Finalizar" && entidad.GetAttributeValue<OptionSetValue>("statecode").Value == 1 && entidad.GetAttributeValue<OptionSetValue>("statuscode").Value == 2)
                {
                    QueryExpression querySolicitud = new QueryExpression("atm_solicitudcredito");
                    querySolicitud.ColumnSet.AddColumns("atm_aprobarsolicitudcode", "atm_faseactivacode", "atm_accountid");
                    querySolicitud.Criteria.AddCondition("atm_solicitudcreditoid", ConditionOperator.Equal, entidad.GetAttributeValue<EntityReference>("bpf_atm_solicitudcreditoid").Id);

                    LinkEntity linkAccount = new LinkEntity(
                           linkFromEntityName: "atm_solicitudcredito",
                           linkToEntityName: "account",
                           linkFromAttributeName: "atm_accountid",
                           linkToAttributeName: "accountid",
                           joinOperator: JoinOperator.Inner);
                    linkAccount.Columns.AddColumns("atm_correofacturacionelectronica", "emailaddress1", "emailaddress2", "ownerid");
                    linkAccount.EntityAlias = "account";
                    querySolicitud.LinkEntities.Add(linkAccount);

                    Entity solicitudCredito = service.RetrieveMultiple(querySolicitud).Entities.FirstOrDefault();
                     

                    if (solicitudCredito.GetAttributeValue<OptionSetValue>("atm_aprobarsolicitudcode").Value == 963540000)
                    {
                        if (solicitudCredito.Contains("account.emailaddress1"))
                        {
                            Entity Party = new Entity("activityparty");
                            Party["addressused"] = solicitudCredito.GetAttributeValue<AliasedValue>("account.emailaddress1").Value;
                            Party["partyid"] = new EntityReference(solicitudCredito.GetAttributeValue<EntityReference>("atm_accountid").LogicalName, solicitudCredito.GetAttributeValue<EntityReference>("atm_accountid").Id);
                            usuariosToRef.Entities.Add(Party);
                        }

                        if (solicitudCredito.Contains("account.atm_correofacturacionelectronica"))
                        {
                            Entity Party = new Entity("activityparty");
                            Party["addressused"] = solicitudCredito.GetAttributeValue<AliasedValue>("account.atm_correofacturacionelectronica").Value;
                            usuariosToRef.Entities.Add(Party);
                        }

                        Entity Plantilla = obtenerPlantilla(service, "PlantillaNotificacion-SolicitudCreditoAprobada");

                        if (usuariosToRef.Entities.Count > 0)
                            enviarCorreo(service, Plantilla, solicitudCredito.GetAttributeValue<EntityReference>("atm_accountid"), (EntityReference)solicitudCredito.GetAttributeValue<AliasedValue>("account.ownerid").Value, usuariosToRef);
                    }
                }
            }
            catch (Exception ex)
            {

                throw new InvalidPluginExecutionException("Error :" + ex.Message);
            }
        }


        private static void enviarCorreo(IOrganizationService service, Entity plantilla, EntityReference entRec, EntityReference usuarioFromRef, EntityCollection usuarioToRef)
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
                    email["scheduledend"] = DateTime.UtcNow;
                    email["regardingobjectid"] = entRec;

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


        public static Entity obtenerPlantilla(IOrganizationService service, String nombrePlantilla)
        {
            QueryExpression query = new QueryExpression("template");
            query.ColumnSet = new ColumnSet(false);
            query.Criteria.AddCondition("title", ConditionOperator.Equal, nombrePlantilla);

            EntityCollection result = service.RetrieveMultiple(query);

            return result.Entities.FirstOrDefault();
        }
    }
}
