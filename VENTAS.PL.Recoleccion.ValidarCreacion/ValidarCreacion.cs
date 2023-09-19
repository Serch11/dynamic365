using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk.Messages;
using 

namespace VENTAS.PL.Recoleccion.ValidarCreacion
{
    public class ValidarCreacion : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            ITracingService tracing = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService services = factory.CreateOrganizationService(context.UserId);

            Entity entidad = null;

            if (context.MessageName == "Create" && context.InputParameters.Contains("Target"))
            {
                entidad = (Entity)context.InputParameters["Target"];
            }

            if (entidad != null)
            {
                Run(services, entidad, tracing);
            }
        }

        private void Run(IOrganizationService services, Entity entidad, ITracingService tracing)
        {
            try
            {
                if (entidad.GetAttributeValue<EntityReference>("regardingobjectid").LogicalName == "lead")
                {
                    Entity Lead = services.Retrieve("lead", entidad.GetAttributeValue<EntityReference>("regardingobjectid").Id, new ColumnSet(new string[] { "atm_faseactivacode" }));

                    if (Lead.GetAttributeValue<OptionSetValue>("atm_faseactivacode").Value == 963540000 || Lead.GetAttributeValue<OptionSetValue>("atm_faseactivacode").Value == 963540001)
                    {
                        throw new InvalidPluginExecutionException("No puede crear una recolección asociada a un cliente potencial si no ha pasado la fase de perfilamiento");
                    }
                }

                if (entidad.GetAttributeValue<EntityReference>("regardingobjectid").LogicalName == "contact")
                {
                    throw new InvalidPluginExecutionException("No puede crear una recolección referente a un contacto. Por favor verifique la informacion ingresada.");
                }


            }
            catch (Exception ex)
            {

                throw new InvalidPluginExecutionException(ex.Message.ToString());
            }
        }
    }
}
