using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;

namespace VENTAS.PL.Factura.CalculoConversion
{
    public class CalculoConversion : IPlugin
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
            }

            if (targetEntity != null)
                Run(service, targetEntity, seguimiento);
        }

        public void Run(IOrganizationService service, Entity reference, ITracingService seguimiento)
        {
            try
            {
                if (reference.Attributes.Contains("customerid"))
                {
                    Entity cuenta = service.Retrieve(
                            "account",
                            reference.GetAttributeValue<EntityReference>("customerid").Id,
                            new ColumnSet(new string[] { "originatingleadid", "atm_leadreactivacionid", "atm_diasconversion" })
                        );

                    if ((cuenta.Contains("originatingleadid") || cuenta.Contains("atm_leadreactivacionid")) && !cuenta.Contains("atm_diasconversion"))
                    {
                        Entity lead = service.Retrieve(
                                "lead",
                                cuenta.GetAttributeValue<EntityReference>(cuenta.Contains("originatingleadid") ? "originatingleadid" : "atm_leadreactivacionid").Id,
                                new ColumnSet(new string[] { "atm_fechacontacto" })
                            );

                        DateTime fechaFact = reference.GetAttributeValue<DateTime>("createdon");
                        DateTime fechaCont = lead.GetAttributeValue<DateTime>("atm_fechacontacto");

                        if (fechaFact > fechaCont)
                        {
                            int calculo = (fechaFact - fechaCont).Days;
                            Entity updateEnt = new Entity() { Id = reference.GetAttributeValue<EntityReference>("customerid").Id, LogicalName = "account" };
                            updateEnt.Attributes.Add("atm_diasconversion", calculo);
                            service.Update(updateEnt);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                if (seguimiento != null) { seguimiento.Trace("Error: " + e.Message); }

                throw new InvalidPluginExecutionException($"Error: {e.Message}", e);
            }
        }
    }
}
