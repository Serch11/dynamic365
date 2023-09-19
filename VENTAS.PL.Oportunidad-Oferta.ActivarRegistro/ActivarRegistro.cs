using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.PL.Oportunidad_Oferta.ActivarRegistro
{
    public class ActivarRegistro : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService services = factory.CreateOrganizationService(context.UserId);

            Entity entity = null;

            if (context.MessageName == "Update" && context.InputParameters.Contains("Target"))
            {
                entity = (Entity)context.InputParameters["Target"];
            }

            if (entity != null)
            {
                Run(entity, services, seguimiento);
            }

        }

        private void Run(Entity entity, IOrganizationService services, ITracingService seguimiento)
        {
            try
            {

                var campos = new
                {
                    atm_descuentototal = "atm_descuentototal",
                    atm_descuentototalporcentaje = "atm_descuentototalporcentaje",
                    atm_preciounidadbase = "atm_preciounidadbase",
                    priceperunit = "priceperunit"
                };

                Entity con_entidad = services.Retrieve(entity.LogicalName, entity.Id, new ColumnSet(new string[] { "statuscode", "statecode" }));

                decimal suma_precioporunidadbase = 0.0m;
                decimal suma_precioporunidad = 0.0m;                
                decimal descuento_total = 0.0m;
                decimal descuento_total_porcentaje = 0.0m;
                string campo = entity.LogicalName == "quote" ? "quoteid" : "opportunityid";
                string nombre_entidad = entity.LogicalName == "quote" ? "quotedetail" : "opportunityproduct";


                    QueryExpression query = new QueryExpression(nombre_entidad);
                    query.ColumnSet.AddColumns(campos.atm_descuentototal, campos.atm_descuentototalporcentaje, campos.atm_preciounidadbase, campos.priceperunit);
                    query.Criteria.AddCondition(campo, ConditionOperator.Equal, entity.Id);

                    EntityCollection entityCollection = services.RetrieveMultiple(query);

                    if (entityCollection.Entities.Count > 0)
                    {
                        foreach (Entity reg in entityCollection.Entities)
                        {
                            suma_precioporunidadbase += reg.GetAttributeValue<Money>(campos.atm_preciounidadbase).Value;
                            suma_precioporunidad += reg.GetAttributeValue<Money>(campos.priceperunit).Value;

                        }

                        descuento_total = suma_precioporunidadbase - suma_precioporunidad;
                        descuento_total_porcentaje = (descuento_total / suma_precioporunidadbase) * 100;

                        Entity actualiza_entidad = new Entity(entity.LogicalName, entity.Id);
                        actualiza_entidad.Attributes.Add(campos.atm_descuentototal, new Money(descuento_total));
                        actualiza_entidad.Attributes.Add(campos.atm_descuentototalporcentaje, descuento_total_porcentaje);
                        services.Update(actualiza_entidad);
                    }                             
            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException(ex.Message);
            }
        }
    }
}
