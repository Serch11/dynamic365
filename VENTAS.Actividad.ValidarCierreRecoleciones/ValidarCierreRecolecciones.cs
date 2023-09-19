using System;
using System.Globalization;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

namespace VENTAS.PL.Actividad.ValidarCierreRecolecciones
{
    public class ValidarCierreRecolecciones : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(context.UserId); //Se coloca null para que se ejecute como SYSTEM

            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            Entity targetEntity = null;

            try
            {
                if (context.MessageName == "Update")
                {
                    targetEntity = (Entity)context.InputParameters["Target"];
                }

                if (targetEntity != null)
                {
                    Run(service, targetEntity, seguimiento);
                }
            }
            catch (Exception ex)
            {

                throw new InvalidPluginExecutionException(ex.Message);
            }
        }

        public void Run(IOrganizationService services, Entity entity, ITracingService seguimiento)
        {
            //int executionSection = 0;
            //string pluginName = "VENTAS.PL.Actividades.ValidarCierreRecoleccion";
            try
            {
                if (entity.GetAttributeValue<OptionSetValue>("statecode").Value == 1)
                {
                    string statecode = entity.GetAttributeValue<OptionSetValue>("statecode").Value.ToString();

                    Entity recoleccion = services.Retrieve(entity.LogicalName, entity.Id, new ColumnSet(true));

                    //validar fecha real de recoleccion
                    if (recoleccion.Contains("atm_fecharealderecoleccion"))
                    {
                        //DateTime atm_fecharealderecoleccion = recoleccion.GetAttributeValue<DateTime>("atm_fecharealderecoleccion").AddHours(-5);
                        //DateTime today = DateTime.Now;
                        //TimeSpan difEnDias = today - atm_fecharealderecoleccion;
                        //string diaSemana = today.AddDays(-2).ToString("dddd dd MMMM", CultureInfo.CreateSpecificCulture("es-Es"));

                        //if (difEnDias.Days > 2)
                        //{
                        //    throw new InvalidPluginExecutionException($"La fecha real de recolección no debe ser menor al {diaSemana}");
                        //}
                    }
                    else
                    {
                        throw new InvalidPluginExecutionException("La fecha real de recolección debe ser completada");
                    }


                    //Validar seccion recoleccion real
                    if (!recoleccion.Contains("atm_llantastotalesdisposicionfinal") || !recoleccion.Contains("atm_llantastotalesajuste") || !recoleccion.Contains("atm_llantastotalesreencauche") || !recoleccion.Contains("atm_llantastotalesreparacion") || !recoleccion.Contains("atm_llantastotalesotr"))
                    {
                        throw new InvalidPluginExecutionException("Necesita completar la Sección  de recolección Real para completar la actividad");
                    }

                    //validar número de multiordern
                    if (!recoleccion.Contains("atm_numeromultiorden") || !recoleccion.Contains("atm_comentarioslogistica"))
                    {
                        throw new InvalidPluginExecutionException("Registre el número de multiorden de la recolección y el comentario de logistica");
                    }

                    //validar categoria cierre recoleccion
                    if (!recoleccion.Contains("atm_categoriacierrerecoleccioncode"))
                    {
                        throw new InvalidPluginExecutionException("Registre la categoria de cierre de recolección");

                    }
                }
            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException(ex.Message.ToString());
            }
        }
    }
}
