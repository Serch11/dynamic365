using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.PL.SolicitudCredito.RevisarSolicitudesActivas
{
    public class RevisarSolicitudesActivas : IPlugin
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

            if (targetEntity != null)
                Run(service, targetEntity, seguimiento);
        }

        public void Run(IOrganizationService service, Entity reference, ITracingService seguimiento)
        {
            try
            {
                var cuenta = reference.GetAttributeValue<EntityReference>("atm_accountid");

                QueryExpression consultaSC = new QueryExpression() { EntityName = "atm_solicitudcredito" };
                consultaSC.NoLock = true;
                consultaSC.Criteria.AddCondition("atm_accountid", ConditionOperator.Equal, cuenta.Id);
                consultaSC.Criteria.AddCondition("statecode", ConditionOperator.Equal, 0);

                EntityCollection resultadoSC = service.RetrieveMultiple(consultaSC);

                if (resultadoSC.Entities.Count > 0)
                {
                    throw new InvalidPluginExecutionException($"No se puede crear una solicitud de credito nueva si ya existe una abierta para este cliente");
                }

                CalculateRollupFieldRequest rollupFieldRequest = new CalculateRollupFieldRequest();
                rollupFieldRequest.Target = new EntityReference(cuenta.LogicalName, cuenta.Id);
                rollupFieldRequest.FieldName = "atm_cantidadcontactos";
                CalculateRollupFieldResponse response = (CalculateRollupFieldResponse)service.Execute(rollupFieldRequest);

                //validar
                Entity consultaCuenta = service.Retrieve(cuenta.LogicalName, cuenta.Id, new ColumnSet(true));

                int segmento = consultaCuenta.GetAttributeValue<OptionSetValue>("atm_semsicecode").Value;
                var nVehiculos = consultaCuenta.GetAttributeValue<int>("atm_numerovehiculostxt");
                var nContactos = consultaCuenta.GetAttributeValue<int>("atm_cantidadcontactos");


                //DIS
                if (segmento == 963540005 && nContactos == 0)
                {
                    throw new InvalidPluginExecutionException($"No se puede crear una solicitud de credito para un cliente del segmento DIS si no tiene por lo menos un contacto asociado");
                }

                if (segmento != 963540005 && (nVehiculos == 0 || nContactos == 0))
                {
                    throw new InvalidPluginExecutionException($"No se puede crear una solicitud de credito para este cliente si no tiene por lo menos un vehiculo o contacto asociado");
                }

            }
            catch (Exception e)
            {
                if (seguimiento != null) { seguimiento.Trace("Error: " + e.Message); }

                throw new InvalidPluginExecutionException($"Atencion: {e.Message}", e);
            }
        }
    }
}
