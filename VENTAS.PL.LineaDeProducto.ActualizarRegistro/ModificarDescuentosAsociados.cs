using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.PL.LineaDeProducto.ActualizarRegistro
{
    public class ModificarDescuentosAsociados : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            try
            {
                IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
                ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
                IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
                IOrganizationService service = factory.CreateOrganizationService(context.UserId);

                Entity entidad = null;

                if ((context.MessageName == "Update") && context.InputParameters.Contains("Target"))
                {
                    entidad = (Entity)context.InputParameters["Target"];
                }

                if (entidad != null)
                {
                    Run(service, entidad, seguimiento);
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public void Run(IOrganizationService service, Entity entidad, ITracingService seguimiento)
        {
            try
            {
                if (entidad.Contains("atm_descuentosaplicados"))
                {

                    string campo = entidad.LogicalName == "quotedetail" ? "quoteid" : "opportunityid";

                    string[] idreglas = entidad.GetAttributeValue<string>("atm_descuentosaplicados").Split(',');

                    QueryExpression query_descuentos = new QueryExpression("atm_descuentodetalle");
                    query_descuentos.Criteria.AddCondition("atm_detalleid", ConditionOperator.Equal, entidad.Id);
                    //query_descuentos.ColumnSet.AddColumns("atm_descuentodetalleid");

                    EntityCollection list_descuentodetalle = service.RetrieveMultiple(query_descuentos);

                    if (list_descuentodetalle.Entities.Count > 0)
                    {
                        foreach (Entity reg in list_descuentodetalle.Entities)
                        {
                            service.Delete(reg.LogicalName, reg.Id);
                        }
                    }

                    foreach (string id in idreglas)
                    {
                        Entity regla_descuento = new Entity("atm_regladescuentos", new Guid(id));
                        Entity nuevo_descuentodetalle = new Entity("atm_descuentodetalle");
                        nuevo_descuentodetalle.Attributes.Add("atm_regladescuentoid", regla_descuento.ToEntityReference());
                        nuevo_descuentodetalle.Attributes.Add("atm_detalleid", entidad.ToEntityReference());
                        service.Create(nuevo_descuentodetalle);
                    }
                }
            }
            catch (Exception ex)
            {
                seguimiento.Trace(ex.Message);
                throw;
            }
        }
    }
}
