using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.PL.Lead.Cuenta.EliminarDirecciones
{
    public class EliminarDireccionesRegistro : IPlugin
    {

        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(null); //Se coloca null para que se ejecute como SYSTEM

            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            Entity targetEntity = null;

            if (context.MessageName == "Delete")
            {
                targetEntity = (Entity)context.PreEntityImages["PreImage"];
            }

            if (targetEntity != null)
                Run(service, targetEntity, seguimiento);
        }

        public void Run(IOrganizationService service, Entity target, ITracingService seguimiento)
        {
            int executionSection = 0;
            string pluginName = "VENTAS.PL.Lead.Cuenta.EliminarDirecciones";

            try
            {
                string attr = "";

                if (target.Attributes.Contains("leadid"))
                {
                    attr = "atm_leadid";
                }
                else if (target.Attributes.Contains("accountid"))
                {
                    attr = "atm_cuentaid";
                }


                if (attr != "")
                {
                    executionSection = 1;

                    EntityReference clienteRef = target.ToEntityReference();

                    executionSection = 2;

                    QueryExpression consulta = new QueryExpression() { EntityName = "atm_direccion" };
                    consulta.NoLock = true;
                    consulta.Criteria.AddCondition(attr, ConditionOperator.Equal, clienteRef.Id);

                    EntityCollection resultado = service.RetrieveMultiple(consulta);
                    
                    executionSection = 3;

                    foreach (Entity entity in resultado.Entities)
                    {
                        service.Delete(entity.LogicalName, entity.Id);
                    }

                }
            }
            catch (Exception e)
            {
                if (seguimiento != null) { seguimiento.Trace("Error: " + e.Message); }
                throw new InvalidPluginExecutionException(string.Format("Error: {0} - ({1}) Execution Section {2}", e.Message, pluginName, executionSection.ToString()), e);
            }
        }
    }
}
