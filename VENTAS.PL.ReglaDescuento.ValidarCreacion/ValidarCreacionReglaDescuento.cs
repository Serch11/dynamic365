using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.PL.ReglaDescuento.ValidarCreacion
{
    public class ValidarCreacionReglaDescuento : IPlugin
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
            try
            {

                // Instantiate QueryExpression query
                QueryExpression query = new QueryExpression("atm_regladescuentos");
                query.ColumnSet.AllColumns = true;

                // Add conditions to query.Criteria
                query.Criteria.AddCondition("statecode", ConditionOperator.Equal, 0);
                query.Criteria.AddCondition("atm_paisid", ConditionOperator.Equal, targetEntity.GetAttributeValue<EntityReference>("atm_paisid").Id);

                EntityCollection listado = service.RetrieveMultiple(query);

                foreach (Entity lista in listado.Entities)
                {
                    var fInicial = targetEntity.GetAttributeValue<DateTime>("atm_envigordesde");
                    var fi = lista.GetAttributeValue<DateTime>("atm_envigordesde");
                    var ff = lista.GetAttributeValue<DateTime>("atm_envigorhasta");

                    //if (fInicial.ToUniversalTime() >= fi.ToUniversalTime() && fInicial.ToUniversalTime() <= ff.ToUniversalTime())
                    //{
                    //    throw new InvalidPluginExecutionException("El rango de fechas seleccionada coincide con una regla de descuento activa, por favor seleccione otro rango");
                    //}
                }
            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException(ex.Message);
            }
        }
    }
}
