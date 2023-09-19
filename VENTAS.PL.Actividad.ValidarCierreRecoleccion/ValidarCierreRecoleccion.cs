using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Crm.Sdk.Messages;

namespace VENTAS.PL.Actividad.ValidarCierreRecoleccion
{
    public class ValidarCierreRecoleccion : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(context.UserId); //Se coloca null para que se ejecute como SYSTEM

            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));


            Entity targetEntity = null;

            if (context.MessageName == "Update")
            {
                targetEntity = (Entity)context.InputParameters["Target"];
            }

            if (targetEntity != null)
            {
                Run(service, targetEntity, seguimiento);
            }
        }

        public void Run(IOrganizationService services, Entity entity, ITracingService seguimiento)
        {
            int executionSection = 0;
            string pluginName = "VENTAS.PL.Actividades.ValidarCierreRecoleccion";
            try
            {
                if (entity.GetAttributeValue<OptionSetValue>("statecode").Value == 1)
                {
                    string statecode = entity.GetAttributeValue<OptionSetValue>("statecode").Value.ToString();

                    Entity recoleccion = services.Retrieve(entity.LogicalName, entity.Id, new ColumnSet(true));

                    int atm_llantastotalesdisposicionfinal = recoleccion.GetAttributeValue<int>("atm_llantastotalesdisposicionfinal");
                    int atm_llantastotalesajuste = recoleccion.GetAttributeValue<int>("atm_llantastotalesajuste");
                    int atm_llantastotalesreencauche = recoleccion.GetAttributeValue<int>("atm_llantastotalesreencauche");


                    if (atm_llantastotalesdisposicionfinal == 0 && atm_llantastotalesajuste == 0 && atm_llantastotalesreencauche == 0)
                    {
                        // throw new InvalidPluginExecutionException(atm_llantastotalesdisposicionfinal.ToString() + " - " + atm_llantastotalesajuste.ToString() + " - " + atm_llantastotalesreencauche.ToString());
                        throw new InvalidPluginExecutionException("Necesita completar la Sección  de recoleccion Real para completar la actividad");
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
