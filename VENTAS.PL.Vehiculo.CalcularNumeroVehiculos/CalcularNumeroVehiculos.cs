using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.PL.Vehiculo.CalcularNumeroVehiculos
{
    public class CalcularNumeroVehiculos : IPlugin
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
            }
            else if (context.MessageName == "Update")
            {
                targetEntity = context.PostEntityImages["postImage"];
            }
            else if (context.MessageName == "Delete")
            {
                targetEntity = (Entity)context.PreEntityImages["PreImage"];
            }

            if (targetEntity != null)
                Run(service, targetEntity, seguimiento);
        }

        public void Run(IOrganizationService service, Entity reference, ITracingService seguimiento)
        {
            int executionSection = 0;
            string pluginName = "VENTAS.PL.Vehiculo.CalcularNumeroVehiculos";
            int numVehiculos = 0;
            int totalLLantas = 0;
            int numVehiculosGrandes = 0;

            try
            {
                if (seguimiento != null) { seguimiento.Trace(string.Format("Inicia ejecución PL: {0}", pluginName)); }

                EntityReference account = reference.GetAttributeValue<EntityReference>("atm_cuentaid");

                QueryExpression consultaVehiculos = new QueryExpression() { EntityName = "atm_vehiculo" };
                consultaVehiculos.NoLock = true;
                consultaVehiculos.ColumnSet.AddColumns("atm_cantidadvehiculos", "atm_cuentaid", "atm_tipovehiculoid");
                consultaVehiculos.Criteria.AddCondition("statecode", ConditionOperator.Equal, 0);
                consultaVehiculos.Criteria.AddCondition("atm_cuentaid", ConditionOperator.Equal, account.Id);
                LinkEntity linkTipoVehiculo = new LinkEntity(
                                            linkFromEntityName: "atm_vehiculo",
                                            linkToEntityName: "atm_tipovehiculo",
                                            linkFromAttributeName: "atm_tipovehiculoid",
                                            linkToAttributeName: "atm_tipovehiculoid",
                                            joinOperator: JoinOperator.Inner);
                linkTipoVehiculo.Columns.AddColumns("atm_llantasvehiculo", "atm_tamanovehiculocode");
                linkTipoVehiculo.EntityAlias = "tipo_vehiculo";
                consultaVehiculos.LinkEntities.Add(linkTipoVehiculo);
                EntityCollection resultadoVehiculos = service.RetrieveMultiple(consultaVehiculos);

                executionSection = 1;

                foreach (Entity entity in resultadoVehiculos.Entities)
                {
                    executionSection = 2;
                    if (entity.Contains("atm_cantidadvehiculos"))
                    {
                        numVehiculos = numVehiculos + entity.GetAttributeValue<int>("atm_cantidadvehiculos");

                        if (((OptionSetValue)entity.GetAttributeValue<AliasedValue>("tipo_vehiculo.atm_tamanovehiculocode").Value).Value == 963540000) // Grandes 963540000
                        {
                            numVehiculosGrandes = numVehiculosGrandes + entity.GetAttributeValue<int>("atm_cantidadvehiculos");
                        }

                        if (entity.Contains("atm_tipovehiculoid"))
                        {
                            if (entity.Contains("tipo_vehiculo.atm_llantasvehiculo"))
                            {
                                totalLLantas = totalLLantas + (entity.GetAttributeValue<int>("atm_cantidadvehiculos") * (int)entity.GetAttributeValue<AliasedValue>("tipo_vehiculo.atm_llantasvehiculo").Value);
                            }
                        }
                    }
                }

                executionSection = 3;

                Entity updateCuenta = new Entity() { Id = account.Id, LogicalName = account.LogicalName };
                updateCuenta.Attributes.Add("atm_numerovehiculostxt", numVehiculos);
                updateCuenta.Attributes.Add("atm_numerollantas", totalLLantas);
                updateCuenta.Attributes.Add("atm_numerovehiculosgrandes", numVehiculosGrandes);
                updateCuenta.Attributes.Add("atm_numerovehiculospequenos", numVehiculos - numVehiculosGrandes);
                service.Update(updateCuenta);

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
