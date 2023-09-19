using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

namespace VENTAS.PL.PlanAccion.Cerrar
{
    public class Cerrar : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = (IOrganizationService)factory.CreateOrganizationService(context.UserId);

            Entity entidad = null;

            if (context.MessageName == "Update" && context.InputParameters.Contains("Target"))
            {
                entidad = (Entity)context.InputParameters["Target"];
            }
            if (entidad != null)
            {
                Run(entidad, service, seguimiento);
            }
        }


        public void Run(Entity entity, IOrganizationService service, ITracingService seguimiento)
        {
            Entity planAccion = service.Retrieve(entity.LogicalName, entity.Id, new ColumnSet(true));


            if (entity.GetAttributeValue<OptionSetValue>("statecode").Value == 1)
            {
                QueryExpression query = new QueryExpression("activitypointer");
                query.ColumnSet.AddColumn("subject");
                query.Criteria.AddCondition("regardingobjectid", ConditionOperator.Equal, planAccion.Id);
                query.Criteria.AddCondition("statecode", ConditionOperator.Equal, 0);

                EntityCollection resultado = service.RetrieveMultiple(query);

                if (resultado.Entities.Count > 0)
                {
                    throw new InvalidPluginExecutionException("No puede cerrar el plan de accion con actividades abiertas");
                }

                if (!planAccion.Contains("atm_leccionesaprendidas"))
                {
                    throw new InvalidPluginExecutionException("Digite la leccion aprendida para poder cerrar el plan de acción");
                }
                if (!planAccion.Contains("atm_descripcion"))
                {
                    throw new InvalidPluginExecutionException("Digite una descripción para poder cerrar el plan de acción");
                }

                Entity ActualizarPlanAccion = new Entity("atm_plandeaccion");
                ActualizarPlanAccion.Id = planAccion.Id;
                ActualizarPlanAccion.Attributes.Add("atm_fecharealcierre", DateTime.UtcNow);
                service.Update(ActualizarPlanAccion);
            }
        }
    }
}
