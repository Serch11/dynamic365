using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.PL.ReglaDescuento.ValidarCreacion
{
    public class ValidarCreacionCategoria : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(context.UserId); //Se coloca null para que se ejecute como SYSTEM

            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            Entity targetEntity = null;


            if (context.MessageName == "Create")
            {
                targetEntity = (Entity)context.InputParameters["Target"];
            }

            if (targetEntity != null)
                Run(service, targetEntity, seguimiento);
        }

        private void Run(IOrganizationService service, Entity targetEntity, ITracingService seguimiento)
        {
            int executionSection = 0;
            string pluginName = "VENTAS.PL.ReglaDescuento.ValidarCreacion";
            try
            {
                Entity reglaDescuento = service.Retrieve("atm_regladescuentos", targetEntity.GetAttributeValue<EntityReference>("atm_regladescuentoid").Id, new ColumnSet(true));

                QueryExpression consultarCategoria = new QueryExpression("atm_categoriasregladescuentos");
                consultarCategoria.ColumnSet.AddColumns("atm_categoriaid", "atm_categoriasregladescuentosid", "atm_nombre", "atm_regladescuentoid", "statecode", "statuscode");
                consultarCategoria.Criteria.AddCondition("atm_categoriaid", ConditionOperator.Equal, targetEntity.GetAttributeValue<EntityReference>("atm_categoriaid").Id);
                consultarCategoria.Criteria.AddCondition("atm_tiporeglacode", ConditionOperator.Equal, targetEntity.GetAttributeValue<OptionSetValue>("atm_tiporeglacode").Value);
                LinkEntity atm_regladescuento = consultarCategoria.AddLink("atm_regladescuentos", "atm_regladescuentoid", "atm_regladescuentosid");
                atm_regladescuento.EntityAlias = "atm_regladescuento";
                atm_regladescuento.Columns.AddColumn("atm_nombre");
                atm_regladescuento.LinkCriteria.AddCondition("atm_paisid", ConditionOperator.Equal, reglaDescuento.GetAttributeValue<EntityReference>("atm_paisid").Id);
                atm_regladescuento.LinkCriteria.AddCondition("statecode", ConditionOperator.Equal, 0);



                EntityCollection result = service.RetrieveMultiple(consultarCategoria);

                if (result.Entities.Count > 0)
                {
                    throw new InvalidPluginExecutionException("Esta categoria ya se encuentra asociada a una regla de descuento activa.");
                }

            }
            catch (Exception e)
            {
                if (seguimiento != null) { seguimiento.Trace("Error: " + e.Message); }
                throw new InvalidPluginExecutionException(e.Message);
                throw new InvalidPluginExecutionException(string.Format("Error: {0} - ({1}) Execution Section {2}", e.Message, pluginName, executionSection.ToString()), e);
            }
        }
    }

}
