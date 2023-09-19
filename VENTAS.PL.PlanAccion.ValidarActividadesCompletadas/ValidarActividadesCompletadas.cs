using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

namespace VENTAS.PL.PlanAccion.ValidarActividadesCompletadas
{
    public class ValidarActividadesCompletadas : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);

            Entity planAccion = null;

            if (context.MessageName == "Update")
            {
                if (context.InputParameters.Contains("Target"))
                {
                    planAccion = (Entity)context.InputParameters["Target"];
                }
            }

            if (planAccion != null)
            {
                Run(planAccion, service, seguimiento);
            }
        }


        private void Run(Entity entity, IOrganizationService service, ITracingService seguimiento)
        {
            string pluginName = "VENTAS.PL.PlanAccion.ValidarActividadesCompletadas";
            int executioContent = 0;
            try
            {
                Entity planAccion = service.Retrieve(entity.LogicalName, entity.Id, new ColumnSet(true));
                //throw new InvalidPluginExecutionException("Digite la leccion aprendida para poder cerrar el plan de acción");
                //if (entity.GetAttributeValue<OptionSetValue>("statecode").Value == 1)
                //{
                //    QueryExpression query = new QueryExpression("activitypointer");
                //    query.ColumnSet.AddColumn("subject");
                //    query.Criteria.AddCondition("regardingobjectid", ConditionOperator.Equal, planAccion.Id);
                //    query.Criteria.AddCondition("statecode", ConditionOperator.Equal, 0);

                //    EntityCollection resultado = service.RetrieveMultiple(query);

                //    if (resultado.Entities.Count > 0)
                //    {
                //        throw new InvalidPluginExecutionException("No puede cerrar el plan de accion con actividades abiertas");
                //    }

                //    if (!planAccion.Contains("atm_leccionesaprendidas"))
                //    {
                //        throw new InvalidPluginExecutionException("Digite la leccion aprendida para poder cerrar el plan de acción");
                //    }
                //    //entity.Attributes.Add("atm_fecharealcierre", DateTime.Now);
                //}
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
