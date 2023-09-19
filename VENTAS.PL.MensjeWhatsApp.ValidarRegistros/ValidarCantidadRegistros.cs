using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.PL.MensajeWhatsApp.ValidarRegistros
{
    public class ValidarCantidadRegistros : IPlugin
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
                Run(service, targetEntity, seguimiento);
            }
        }

        public void Run(IOrganizationService service, Entity entity, ITracingService seguimiento)
        {
            int executionSection = 0;
            string pluginName = "VENTAS.PL.MensajeWhatsApp.ValidarRegistros";

            try
            {
                if (seguimiento != null) { seguimiento.Trace(string.Format("Inicia ejecución PL: {0}", pluginName)); }

                if (entity.Contains("atm_urlmensajedirecto"))
                {
                    executionSection = 1;
                    QueryExpression consultaMW = new QueryExpression() { EntityName = "atm_mensajewhatsapp" };
                    consultaMW.NoLock = true;
                    consultaMW.ColumnSet.AddColumns("subject");
                    consultaMW.Criteria.AddCondition("regardingobjectid", ConditionOperator.Equal, entity.GetAttributeValue<EntityReference>("regardingobjectid").Id);
                    executionSection = 2;
                    EntityCollection resultadoMW = service.RetrieveMultiple(consultaMW);
                    executionSection = 3;

                    if (resultadoMW.Entities.Count > 1)
                    {
                        throw new InvalidPluginExecutionException("Sólo se puede tener un registro de mensaje de WhatsApp");
                    }
                }
                else
                {
                    throw new InvalidPluginExecutionException("El campo URL Mensaje directo se encuentra vácio, por favor asegurese que el registro asociado tenga información en el campo Teléfono");
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
