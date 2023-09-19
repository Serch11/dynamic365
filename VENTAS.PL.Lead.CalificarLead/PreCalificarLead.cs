using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.PL.Lead.CalificarLead
{
    public class PreCalificarLead : IPlugin
    {

        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(null); //Se coloca null para que se ejecute como SYSTEM

            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));


            if (context.MessageName == "QualifyLead")
            {
                EntityReference reference = (EntityReference)context.InputParameters["LeadId"];
                Run(service, reference, seguimiento);
            }
        }

        public void Run(IOrganizationService service, EntityReference reference, ITracingService seguimiento)
        {
            int executionSection = 0;
            string pluginName = "VENTAS.PL.Lead.PreCalificarLead";

            try
            {
                if (seguimiento != null) { seguimiento.Trace(string.Format("Inicia ejecución PL: {0}", pluginName)); }
                executionSection = 1000;
                Entity account;

                //Buscamos el lead, si es una conversion de cliente existente debe agregar modificar el campo originating lead
                Entity lead = service.Retrieve("lead", reference.Id, new ColumnSet(new string[] { "parentaccountid", "atm_idcuenta", "atm_idcontacto" }));

                executionSection = 2000;

                if ((lead.Attributes.Contains("atm_idcuenta") || lead.Attributes.Contains("atm_idcontacto")) && !lead.Attributes.Contains("parentaccountid"))
                {
                    //Modificamos la fecha de calificacion cada vez que se califica
                    Entity updateLead = new Entity() { LogicalName = lead.LogicalName, Id = lead.Id };

                    FilterExpression fe = new FilterExpression();
                    fe.AddCondition("atm_idcuenta", ConditionOperator.Equal, lead.GetAttributeValue<string>("atm_idcuenta"));

                    QueryExpression consultaCuenta = new QueryExpression()
                    {
                        EntityName = "account",
                        NoLock = true,
                        ColumnSet = new ColumnSet(new string[] { "atm_fechaultimafacturacion" }),
                        Criteria = fe
                    };

                    executionSection = 3000;

                    account = service.RetrieveMultiple(consultaCuenta).Entities.FirstOrDefault();

                    if (account != null)
                    {
                        updateLead.Attributes.Add("parentaccountid", account.ToEntityReference());

                        if (account.Contains("atm_fechaultimafacturacion"))
                            updateLead.Attributes.Add("atm_fecharealcalificacion", account.GetAttributeValue<DateTime>("atm_fechaultimafacturacion"));
                        
                        service.Update(updateLead);
                    }
                    executionSection = 4000;
                }
                else
                {
                    throw new InvalidPluginExecutionException("El cliente potencial debe tener la información del cliente diligenciada para poder Calificar");
                }

                if (seguimiento != null) { seguimiento.Trace(string.Format("Finaliza ejecución PL: {0}", pluginName)); }
            }
            catch (Exception e)
            {
                if (seguimiento != null) { seguimiento.Trace("Error: " + e.Message); }
                throw new InvalidPluginExecutionException(string.Format("Error: {0} - ({1}) Execution Section {2}", e.Message, pluginName, executionSection.ToString()), e);
            }
        }
    }
}
