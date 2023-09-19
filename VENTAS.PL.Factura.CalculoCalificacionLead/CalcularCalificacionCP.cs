using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.UI.WebControls;

namespace VENTAS.PL.Factura.CalculoCalificacionLead
{
    public class CalcularCalificacionCP : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {

            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(null); // se coloca null para que se ejecute como SYSTEM

            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            Entity TargetEntity = null;

            if (context.MessageName == "Create")
            {
                TargetEntity = (Entity)context.InputParameters["Target"];
            }
            if (TargetEntity != null)
            {
                Run(service, TargetEntity, seguimiento);
            }
        }

        public void Run(IOrganizationService service, Entity invoice, ITracingService seguimiento)
        {
            int executionSection = 0;
            string pluginName = "VENTAS.PL.Factura.CalculoCalificacionLead";

            try
            {
                //Consultamos la informacion del cliente y la factura
                Entity account = service.Retrieve("account",
                    invoice.GetAttributeValue<EntityReference>("customerid").Id,
                    new ColumnSet(new string[] { "createdon", "accountid", "atm_idcuenta", "originatingleadid", "atm_leadreactivacionid" }));

                executionSection = 1;
                //var query_Filters_atm_idcuenta = "901060399";

                //Buscamos los LEADS
                QueryExpression ConsultarLead = new QueryExpression("lead")
                {
                    NoLock = true,
                    ColumnSet = new ColumnSet("atm_faseactivacode", "statecode", "parentaccountid"),
                    Criteria = {
                        Filters =
                        {
                            new FilterExpression(LogicalOperator.Or)
                            {
                                Conditions =
                                {
                                    new ConditionExpression("atm_idcuenta", ConditionOperator.Equal, account.GetAttributeValue<string>("atm_idcuenta")),
                                    new ConditionExpression("atm_idcontacto", ConditionOperator.Equal, account.GetAttributeValue<string>("atm_idcuenta"))
                                }
                            },
                            new FilterExpression()
                            {
                                Conditions =
                                {
                                    new ConditionExpression("statecode", ConditionOperator.Equal, 0)
                                }
                            }
                        }
                    }
                };

                executionSection = 2;

                EntityCollection resLead = service.RetrieveMultiple(ConsultarLead);

                executionSection = 3;
                foreach (Entity ent in resLead.Entities)
                {
                    if (ent.Contains("atm_faseactivacode") && (!account.Contains("originatingleadid") || !account.Contains("atm_leadreactivacionid")) && !ent.Contains("parentaccountid"))
                    {
                        Entity lead = new Entity() { Id = ent.Id, LogicalName = ent.LogicalName };
                        lead.Attributes.Add("parentaccountid", account.ToEntityReference());
                        service.Update(lead);

                        switch (ent.GetAttributeValue<OptionSetValue>("atm_faseactivacode").Value)
                        {
                            case 963540003:
                            case 963540004:
                                //Se debe calificar
                                var qualify = new QualifyLeadRequest
                                {
                                    CreateAccount = false,
                                    CreateContact = true,
                                    LeadId = new EntityReference() { Id = ent.Id, LogicalName = ent.LogicalName },
                                    Status = new OptionSetValue(3)
                                };

                                executionSection = 4;
                                var qualifyIntoAccountContactRes = (QualifyLeadResponse)service.Execute(qualify);
                                break;
                        }
                    }
                }
            }
            catch (Exception e)
            {
                if (seguimiento != null) { seguimiento.Trace(string.Format("Error: {0} - ({1}) Execution Section {2}", e.Message, pluginName, executionSection.ToString()), e); }
                //throw new InvalidPluginExecutionException(string.Format("Error: {0} - ({1}) Execution Section {2}", e.Message, pluginName, executionSection.ToString()), e);
            }
        }
    }
}
