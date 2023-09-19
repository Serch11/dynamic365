using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

namespace VENTAS.PL.DescuentoVolumen.ValidarCreacion
{
    public class ValidarCreacion : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(context.UserId);
            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));


            Entity entity = null;

            if (context.MessageName == "Create" && context.InputParameters.Contains("Target"))
            {
                entity = (Entity)context.InputParameters["Target"];
            }

            if (entity != null)
            {
                Run(service, entity, seguimiento);
            }
        }

        private void Run(IOrganizationService service, Entity Dvolumen, ITracingService seguimiento)
        {
            try
            {
                QueryExpression ConsultaDV = new QueryExpression("atm_descuentovolumenregladescuento");
                ConsultaDV.ColumnSet.AddColumns(new string[] { "atm_cantidadinicial", "atm_cantidadfinal" });
                ConsultaDV.Criteria.AddCondition("atm_regladescuentoid", ConditionOperator.Equal, Dvolumen.GetAttributeValue<EntityReference>("atm_regladescuentoid").Id);


                EntityCollection DvolumenEntityCollection = service.RetrieveMultiple(ConsultaDV);

                int cantidadInicial = Dvolumen.GetAttributeValue<int>("atm_cantidadinicial");
                int cantidadFinal = Dvolumen.GetAttributeValue<int>("atm_cantidadfinal");

                if (DvolumenEntityCollection.Entities.Count > 0)
                {
                    foreach (Entity item in DvolumenEntityCollection.Entities)
                    {
                        if (cantidadInicial >= item.GetAttributeValue<int>("atm_cantidadinicial") && cantidadInicial <= item.GetAttributeValue<int>("atm_cantidadfinal") ||
                           cantidadFinal >= item.GetAttributeValue<int>("atm_cantidadinicial") && cantidadFinal <= item.GetAttributeValue<int>("atm_cantidadfinal"))
                        {
                            throw new InvalidPluginExecutionException(OperationStatus.Canceled, 400, "El intervalo especificado coincide con un descuento existente. Para crear un nuevo descuento, debe ajustar la cantidad inicial, la cantidad final o ambas.");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException("Error: " + ex.Message);
            }
        }
    }
}
