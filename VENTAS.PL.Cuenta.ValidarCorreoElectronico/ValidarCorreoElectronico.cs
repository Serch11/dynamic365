using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace VENTAS.PL.Cuenta.ValidarCorreoElectronico
{
    public class ValidarCorreoElectronico : IPlugin
    {

        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            ITracingService itracing = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(context.UserId);

            Entity entity = null;

            if (context.MessageName == "Create" || context.MessageName == "Update" & context.InputParameters.Contains("Target"))
            {
                entity = (Entity)context.InputParameters["Target"];
            }

            if (entity != null)
                Run(entity, service, itracing);
        }

        private void Run(Entity entity, IOrganizationService service, ITracingService itracing)
        {
            try
            {
                if (entity.Contains("emailaddress1"))
                {
                    Entity newLead = new Entity(entity.LogicalName, entity.Id);
                    bool resultIsMatch = Regex.IsMatch(entity.GetAttributeValue<string>("emailaddress1"), @"^[^@]+@[^@]+\.[a-zA-Z]{2,}$");
                    bool resultIsMatch2 = Regex.IsMatch(entity.GetAttributeValue<string>("emailaddress1"), @"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$");
                    if (resultIsMatch == resultIsMatch2) { newLead.Attributes.Add("atm_correovalido", true); }
                    else { newLead.Attributes.Add("atm_correovalido", false); }
                    service.Update(newLead);
                }
            }
            catch (Exception ex)
            {
                itracing.Trace("VENTAS.PL.Cuenta.ValidarCorreo" + ex.Message);
                throw new InvalidPluginExecutionException(ex.Message);
            }
        }
    }
}
