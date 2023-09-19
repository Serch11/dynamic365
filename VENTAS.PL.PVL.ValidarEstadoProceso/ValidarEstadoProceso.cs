using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.PL.PVL.ValidarEstadoProceso
{
    public class ValidarEstadoProceso : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(null); //Se coloca null para que se ejecute como SYSTEM

            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            Entity targetEntity = null;


            if (context.MessageName == "Update")
            {
                targetEntity = context.PostEntityImages["postImage"];
            }

            if (targetEntity != null)
                Run(service, targetEntity, seguimiento);
        }

        public void Run(IOrganizationService service, Entity reference, ITracingService seguimiento)
        {
            string pluginName = "VENTAS.PL.PVL.ValidarEstadoProceso";

            try
            {
                if (seguimiento != null) { seguimiento.Trace(string.Format("Inicia ejecución PL: {0}", pluginName)); }

                //Buscamos el Lead
                Entity Lead = service.Retrieve("lead", reference.GetAttributeValue<EntityReference>("bpf_leadid").Id, new ColumnSet(true));

                //Calculamos la fase en la que se encuentra
                string fase = reference.GetAttributeValue<EntityReference>("activestageid").Name;

                Entity updateLead = new Entity() { Id = Lead.Id, LogicalName = Lead.LogicalName };

                if (fase == "Contacto Inicial")
                {
                    updateLead.Attributes.Add("atm_faseactivacode", new OptionSetValue(963540000));
                    service.Update(updateLead);
                }
                else if (fase == "Perfilamiento")
                {
                    updateLead.Attributes.Add("atm_faseactivacode", new OptionSetValue(963540001));
                    service.Update(updateLead);
                }
                else if (fase == "Identificación De Necesidades")
                {
                    updateLead.Attributes.Add("atm_faseactivacode", new OptionSetValue(963540002));
                    service.Update(updateLead);
                }
                else if (fase == "Asignación De Asesor")
                {
                    updateLead.Attributes.Add("atm_faseactivacode", new OptionSetValue(963540003));
                    service.Update(updateLead);

                }
                else if (fase == "Desarrollar")
                {
                    updateLead.Attributes.Add("atm_faseactivacode", new OptionSetValue(963540004));
                    service.Update(updateLead);
                }

                if (seguimiento != null) { seguimiento.Trace(string.Format("Finaliza ejecución PL: {0}", pluginName)); }
            }
            catch (Exception e)
            {
                if (seguimiento != null) { seguimiento.Trace("Error: " + e.Message); }
                //throw new InvalidPluginExecutionException(string.Format("Error: {0} - ({1}) Execution Section {2}", e.Message, pluginName, executionSection.ToString()), e);
                throw new InvalidPluginExecutionException($"Error: {e.Message}", e);
            }
        }
    }
}
