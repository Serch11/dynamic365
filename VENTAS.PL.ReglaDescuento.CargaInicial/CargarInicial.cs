using ATM.Utilidades;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.PL.ReglaDescuento.CargaInicial
{
    public class CargarInicial : IPlugin
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

        public void Run(IOrganizationService service, Entity entity, ITracingService seguimiento)
        {
            int executionSection = 0;
            string pluginName = "VENTAS.PL.ReglaDescuento.CargaInicial";
            try
            {
                if (entity.GetAttributeValue<OptionSetValue>("atm_tiporeglacode").Value == 963540000)//autorizacion
                {
                    Utilidades Util = new Utilidades(service);
                    if (seguimiento != null) { seguimiento.Trace(string.Format("Inicia ejecución PL: {0}", pluginName)); }

                    List<ConditionExpression> lc = new List<ConditionExpression>
                    {
                    new ConditionExpression("atm_nombre", ConditionOperator.Equal, "ROLESDESCUENTO")
                    };

                    List<Entity> entities = Util.ConsultarMultiplesRegistros(Util.CrearConsulta("atm_parametro", new string[] { "atm_valor" }, lc));
                    int consecutivo = 1;
                    foreach (string rol in entities[0].GetAttributeValue<string>("atm_valor").Split(','))
                    {
                        lc = new List<ConditionExpression>
                    {
                        new ConditionExpression("name", ConditionOperator.Equal, rol)
                    };

                        Entity rolId = Util.ConsultarMultiplesRegistros(Util.CrearConsulta("role", new string[] { "roleid" }, lc))[0];

                        Entity addRolDescuento = new Entity() { LogicalName = "atm_descuentorol" };
                        addRolDescuento.Attributes.Add("atm_rolid", rolId.ToEntityReference());
                        addRolDescuento.Attributes.Add("atm_regladescuentoid", entity.ToEntityReference());
                        addRolDescuento.Attributes.Add("atm_monto", new Money(0));
                        addRolDescuento.Attributes.Add("atm_porcentaje", new Decimal(0));
                        addRolDescuento.Attributes.Add("atm_nombre", $"{rol}");
                        addRolDescuento.Attributes.Add("atm_consecutivo", consecutivo);
                        consecutivo++;
                        service.Create(addRolDescuento);
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
