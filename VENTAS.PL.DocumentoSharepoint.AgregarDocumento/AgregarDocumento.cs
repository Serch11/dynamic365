using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.PL.DocumentoSharepoint.AgregarDocumento
{
    public class AgregarDocumento : IPlugin
    {

        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(null);

            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            Entity targetEntity = null;

            throw new InvalidPluginExecutionException("EJECUTAAAAAA");


            if (context.MessageName == "Create")
            {
                targetEntity = (Entity)context.InputParameters["Target"];
                Run(service, targetEntity, seguimiento);
            }
        }

        public void Run(IOrganizationService service, Entity entity, ITracingService seguimiento)
        {
            int executionSection = 0;
            string pluginName = "VENTAS.PL.DocumentoSharepoint.AgregarDocumento";

            try
            {
                string dd = "";
                foreach (var d in entity.Attributes)
                {
                    dd = dd + " " + d.Key.ToString();
                }

                throw new InvalidPluginExecutionException(dd);

                if (seguimiento != null) { seguimiento.Trace(string.Format("Inicia ejecución PL: {0}", pluginName)); }

                if (entity.Contains("regardingobjectid"))
                {
                    EntityReference regarding = entity.GetAttributeValue<EntityReference>("regardingobjectid");
                    throw new InvalidPluginExecutionException(regarding.LogicalName + " - " + regarding.Id.ToString());

                    //executionSection = 1;
                    //DateTime fechaFin = entity.GetAttributeValue<DateTime>("scheduledend").ToLocalTime();
                    //DateTime fechaActual = DateTime.Now.ToLocalTime();

                    //if (fechaFin < fechaActual)
                    //{
                    //    Entity updateAct = new Entity() { Id = entity.Id, LogicalName = entity.LogicalName };
                    //    updateAct.Attributes.Add("statuscode", new OptionSetValue(2));
                    //    updateAct.Attributes.Add("statecode", new OptionSetValue(1));
                    //    service.Update(updateAct);
                    //}
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