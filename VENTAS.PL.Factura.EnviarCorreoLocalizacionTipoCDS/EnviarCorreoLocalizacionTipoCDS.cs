using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk;
using Microsoft.Crm.Sdk.Messages;


namespace VENTAS.PL.Factura.NotificacionTipoLocalizacion
{
    public class EnviarCorreoLocalizacionTipoCDS : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = (IOrganizationService)factory.CreateOrganizationService(context.UserId);

            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            Entity entity = null;

            if (context.MessageName == "Create")
            {
                entity = (Entity)context.InputParameters["Target"];
            }
            if (entity != null)
            {
                Run(service, entity, seguimiento);
            }

        }

        public void Run(IOrganizationService service, Entity entity, ITracingService seguimiento)
        {
            int executionSection = 0;
            string pluginName = "VENTAS.PL.Factura.NotificacionTipoLocalizacion";
            try
            {
                if (entity.Contains("atm_localizacionid"))
                {
                    executionSection = 1;
                    QueryExpression consultarInvoice = new QueryExpression() { EntityName = "invoice" };
                    consultarInvoice.NoLock = true;
                    consultarInvoice.ColumnSet.AddColumns(new string[] { "invoiceid", "atm_localizacionid", "customerid" });
                    consultarInvoice.Criteria.AddCondition("invoiceid", ConditionOperator.Equal, entity.Id);

                    LinkEntity linkLocalizacion = new LinkEntity(
                        linkFromEntityName: "invoice",
                        linkToEntityName: "atm_localizacion",
                        linkFromAttributeName: "atm_localizacionid",
                        linkToAttributeName: "atm_localizacionid",
                        joinOperator: JoinOperator.Inner);
                    linkLocalizacion.Columns.AddColumns(new string[] { "atm_nombre", "atm_tipolocalizacioncode" });
                    linkLocalizacion.EntityAlias = "localizacion";

                    LinkEntity linkAccount = new LinkEntity(
                        linkFromEntityName: "invoice",
                        linkToEntityName: "account",
                        linkFromAttributeName: "customerid",
                        linkToAttributeName: "accountid",
                        joinOperator: JoinOperator.Inner);
                    linkAccount.Columns.AddColumns(new string[] { "emailaddress1", "ownerid" });
                    linkAccount.EntityAlias = "account";

                    consultarInvoice.LinkEntities.Add(linkLocalizacion);
                    consultarInvoice.LinkEntities.Add(linkAccount);

                    Entity resLocalizacion = service.RetrieveMultiple(consultarInvoice).Entities.FirstOrDefault();

                    if (resLocalizacion.Contains("localizacion.atm_tipolocalizacioncode"))
                    {
                        if (((OptionSetValue)resLocalizacion.GetAttributeValue<AliasedValue>("localizacion.atm_tipolocalizacioncode").Value).Value == 963540002)//CDS
                        {
                            executionSection = 2;
                            Entity plantilla = ObtenerPlantilla(service, "PlantillaNotificacionCuenta-TipoLocalizacionCDS");
                            EntityReference account = entity.GetAttributeValue<EntityReference>("customerid");
                            EntityReference usuarioTo = (EntityReference)resLocalizacion.GetAttributeValue<AliasedValue>("account.ownerid").Value;
                            //EnviarCorreo(service, plantilla, account, usuarioTo, account);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                throw new InvalidPluginExecutionException(string.Format("Error: {0} - ({1}) Execution Section {2}", e.Message, pluginName, executionSection.ToString()), e);
            }
        }

        public static Entity ObtenerPlantilla(IOrganizationService service, String nombrePlantilla)
        {
            QueryExpression query = new QueryExpression() { EntityName = "template" };
            query.NoLock = true;
            query.ColumnSet = new ColumnSet(false);
            query.Criteria.AddCondition("title", ConditionOperator.Equal, nombrePlantilla);

            return service.RetrieveMultiple(query).Entities.FirstOrDefault();
        }

        public void EnviarCorreo(IOrganizationService service, Entity plantilla, EntityReference entity, EntityReference usuarioFromRef, EntityReference usuarioToRef)
        {
            InstantiateTemplateRequest instantiateTemplateRequest = new InstantiateTemplateRequest
            {
                TemplateId = plantilla.Id,
                ObjectId = entity.Id,
                ObjectType = entity.LogicalName
            };
            InstantiateTemplateResponse instantiateTemplateResponse = (InstantiateTemplateResponse)service.Execute(instantiateTemplateRequest);

            Entity email = instantiateTemplateResponse.EntityCollection.Entities.FirstOrDefault();

            email["regardingobjectid"] = entity;
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
}
