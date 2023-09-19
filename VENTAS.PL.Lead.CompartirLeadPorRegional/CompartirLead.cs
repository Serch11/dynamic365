using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk.Query;
using ATM.Utilidades;
using Microsoft.Crm.Sdk.Messages;

namespace VENTAS.PL.Lead.CompartirLeadPorRegional
{
    public class CompartirLead : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(context.UserId);

            Entity Lead = null;
            Entity PreImageLead = null;

            if (context.MessageName == "Create" || context.MessageName == "Update" && context.InputParameters.Contains("Target"))
            {
                Lead = (Entity)context.InputParameters["Target"];
                if (context.MessageName == "Update" && context.PreEntityImages.Contains("PreImage"))
                {
                    PreImageLead = (Entity)context.PreEntityImages["PreImage"];
                }
            }
            if (Lead != null)
            {
                Run(Lead, service, seguimiento, PreImageLead);
            }

        }

        private void Run(Entity lead, IOrganizationService service, ITracingService seguimiento, Entity PreImageLead)
        {
            string nombrePlugin = "VENTAS.PL.Lead.CompartirLeadPorRegional";
            try
            {
                Utilidades util = new Utilidades(service);

                Entity CP = ConsultarRegistro(service, lead);

                if (CP.GetAttributeValue<EntityReference>("owningbusinessunit").Name.ToUpper() != ((string)CP.GetAttributeValue<AliasedValue>("atm_regional.atm_nombre").Value).ToUpper())
                {
                    util.CompartirRegistros(lead.ToEntityReference(), ((EntityReference)CP.GetAttributeValue<AliasedValue>("atm_regional.atm_directorregional").Value));

                    if (PreImageLead != null)
                    {
                        RevokeAccess(service,PreImageLead);
                    }
                }

            }
            catch (Exception ex)
            {
                seguimiento.Trace(string.Format("Error :{0} - {1}", nombrePlugin, ex.Message));
                throw new InvalidPluginExecutionException(string.Format("Error :{0} - {1}", nombrePlugin, ex.Message));
            }
        }

        

        public Entity ConsultarRegistro(IOrganizationService service, Entity entidad)
        {
            QueryExpression queryCP = new QueryExpression("lead");
            queryCP.ColumnSet.AllColumns = true;
            queryCP.Criteria.AddCondition("leadid", ConditionOperator.Equal, entidad.Id);

            LinkEntity linkEntityRegional = new LinkEntity(
                       linkFromEntityName: "lead",
                       linkToEntityName: "atm_regional",
                       linkFromAttributeName: "atm_regionalid",
                       linkToAttributeName: "atm_regionalid",
                       joinOperator: JoinOperator.Inner
                );
            linkEntityRegional.EntityAlias = "atm_regional";
            linkEntityRegional.Columns.AddColumns(new string[] { "atm_directorregional", "atm_nombre" });
            queryCP.LinkEntities.Add(linkEntityRegional);

            return service.RetrieveMultiple(queryCP).Entities.FirstOrDefault();
        }

        private void RevokeAccess(IOrganizationService service, Entity PreEntityLead)
        {
            Entity user = service.Retrieve(PreEntityLead.GetAttributeValue<EntityReference>("atm_regionalid").LogicalName, PreEntityLead.GetAttributeValue<EntityReference>("atm_regionalid").Id, new ColumnSet(true));
            RevokeAccessRequest revokeAccessRequest = new RevokeAccessRequest
            {
                Revokee = user.GetAttributeValue<EntityReference>("atm_directorregional"),
                Target = PreEntityLead.ToEntityReference()

            };
            service.Execute(revokeAccessRequest);
        }
    }
}
