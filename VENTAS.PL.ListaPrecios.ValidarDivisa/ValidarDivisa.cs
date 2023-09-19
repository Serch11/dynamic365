using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;


namespace VENTAS.PL.ListaPrecios.ValidarDivisa
{
    public class ValidarDivisa : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);

            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            Entity listadeprecio = null;

            if (context.InputParameters.Contains("Target") && context.MessageName == "Create")
            {
                listadeprecio = (Entity)context.InputParameters["Target"];
            }

            if (listadeprecio != null)
            {
                Run(listadeprecio, service, seguimiento);
            } 

        }

        private void Run(Entity listadeprecio, IOrganizationService service, ITracingService seguimiento)
        {
            string pluginName = "VENTAS.PL.ListaPrecios.ValidarDivisa";
            try
            {
                //(listadeprecio.GetAttributeValue<EntityReference>("atm_paisid").Name == "COLOMBIA" && listadeprecio.GetAttributeValue<EntityReference>("transactioncurrencyid").Name != "Peso colombiano"
                if (listadeprecio.Contains("atm_paisid") && listadeprecio.Contains("transactioncurrencyid"))
                {
                    Entity pais = service.Retrieve("atm_pais", listadeprecio.GetAttributeValue<EntityReference>("atm_paisid").Id, new ColumnSet(new string[] { "atm_nombre" }));
                    Entity divisa = service.Retrieve("transactioncurrency", listadeprecio.GetAttributeValue<EntityReference>("transactioncurrencyid").Id, new ColumnSet(new string[] { "currencyname" }));

                    if (pais.GetAttributeValue<string>("atm_nombre") == "COLOMBIA" && divisa.GetAttributeValue<string>("currencyname") != "Peso colombiano")
                    {
                        throw new InvalidPluginExecutionException("La divisa para una lista de precio de colombia tiene que ser Peso colombiano");
                    }
                    else if (pais.GetAttributeValue<string>("atm_nombre") == "ECUADOR" && divisa.GetAttributeValue<string>("currencyname") != "US Dollar")
                    {
                        throw new InvalidPluginExecutionException("La divisa para una lista de precio de ecuador debe ser US Dollar");
                    }
                }
            }
            catch (Exception ex)
            {
                seguimiento.Trace(string.Format("Plugin Name : {0} , Error: ", pluginName, ex.Message));
                throw new InvalidPluginExecutionException(ex.Message);
            }
        }
    }
}
