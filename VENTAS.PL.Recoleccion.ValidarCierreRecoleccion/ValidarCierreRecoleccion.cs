using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;

namespace VENTAS.PL.Recoleccion.ValidarCierreRecoleccion
{
    public class ValidarCierreRecoleccion : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(context.UserId);

            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            Entity Target = null;

            if (context.MessageName == "StateCode" && context.InputParameters.Contains("Target"))
            {
                Target = (Entity)context.InputParameters["Target"];
            }

            if (Target != null)
            {
                Run(Target,service,seguimiento);
            }
        }

        private void Run(Entity target, IOrganizationService service, ITracingService seguimiento)
        {
            try
            {
                string pluginname = "VENTAS.PL.Recoleccion.ValidarCierreRecoleccion";
            }
            catch (Exception ex)
            {

                throw new InvalidPluginExecutionException(string.Format("Error:{0} ", ex.Message.ToString()));
            }
        }
    }
}
