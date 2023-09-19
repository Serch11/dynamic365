using ATM.Utilidades;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel.Channels;
using System.Text;
using System.Threading.Tasks;
using System.Web.UI.WebControls;

namespace VENTAS.PL.ListaPrecio.ValidarCreacion
{
    public class ValidarCreacion : IPlugin
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
            string pluginName = "VENTAS.PL.ListaPrecio.ValidarCreacion";
            Utilidades util = new Utilidades(service);

            try
            {
                var segmentos = entity.GetAttributeValue<OptionSetValueCollection>("atm_segmentocode").Select(x => x.Value).ToArray();
                List<ConditionExpression> lc = new List<ConditionExpression>
                {
                    new ConditionExpression("statecode", ConditionOperator.Equal, 0),
                    new ConditionExpression("atm_paisid", ConditionOperator.Equal, entity.GetAttributeValue<EntityReference>("atm_paisid").Id),
                    new ConditionExpression("atm_segmentocode", ConditionOperator.ContainValues, segmentos),
                    new ConditionExpression("transactioncurrencyid",ConditionOperator.Equal,entity.GetAttributeValue<EntityReference>("transactioncurrencyid").Id)
                };

                if (entity.Contains("atm_regionalid"))
                {
                    lc.Add(new ConditionExpression("atm_regionalid", ConditionOperator.Equal, entity.GetAttributeValue<EntityReference>("atm_regionalid").Id));
                }
                else
                {
                    lc.Add(new ConditionExpression("atm_regionalid", ConditionOperator.Null));
                }

                List<Entity> listaPrecio = util.ConsultarMultiplesRegistros(util.CrearConsulta("pricelevel", new string[] { "begindate", "enddate" }, lc));

                foreach (var lista in listaPrecio)
                {
                    
                    var fi = entity.GetAttributeValue<DateTime>("begindate");

                    if (fi.ToUniversalTime() >= lista.GetAttributeValue<DateTime>("begindate").ToUniversalTime() && fi.ToUniversalTime() <= lista.GetAttributeValue<DateTime>("enddate").ToUniversalTime())
                    {
                        throw new InvalidPluginExecutionException("El rango de fechas seleccionada coincide con una lista de precios activa, por favor seleccione otro rango");
                    }
                }
            }
            catch (Exception e)
            {
                throw new InvalidPluginExecutionException($"Error: {e.Message}");
            }
        }
    }
}
