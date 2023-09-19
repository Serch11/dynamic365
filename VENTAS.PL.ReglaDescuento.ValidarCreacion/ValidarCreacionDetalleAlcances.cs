using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ATM.Utilidades;
using System.Globalization;

namespace VENTAS.PL.ReglaDescuento.ValidarCreacion
{
    public class ValidarCreacionDetalleAlcances : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService services = factory.CreateOrganizationService(context.UserId);
            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));


            Entity entity = null;

            if (context.MessageName == "Create" && context.InputParameters.Contains("Target"))
            {
                entity = (Entity)context.InputParameters["Target"];
            }

            if (entity != null)
            {
                Run(services, entity, seguimiento);
            }
        }

        private void Run(IOrganizationService services, Entity entity, ITracingService seguimiento)
         {
            string nombrePlugin = "VENTAS.PL.ReglaDescuento.ValidarCreacionDetalleAlcance";

            try
            {
                Utilidades util = new Utilidades(services);

                Entity regladescuento = util.ConsultarRegistro(entity.GetAttributeValue<EntityReference>("atm_regladescuentoid").LogicalName, entity.GetAttributeValue<EntityReference>("atm_regladescuentoid").Id,
                     new string[] { "atm_alcancecode", "atm_paisid", "atm_envigordesde", "atm_envigorhasta", "atm_tiporeglacode" });

                EntityCollection consulta = RealizarConsulta(services, entity, regladescuento);

                if (consulta.Entities.Count > 0)
                {
                    throw new InvalidPluginExecutionException(OperationStatus.Canceled, "El item que dese asociar a la regla de descuento ya se esta utilizando en un registro existen.");
                }

            }
            catch (Exception ex)
            {
                seguimiento.Trace(String.Format("Nombre plugin :{0} -  Error: {1}", nombrePlugin, ex.Message));
                throw new InvalidPluginExecutionException(OperationStatus.Canceled, String.Format("Error : {0}", ex.Message));
            }
        }


        public EntityCollection RealizarConsulta(IOrganizationService service, Entity entity, Entity regladescuento)
        {
            var datos = new
            {
                campobusquedad = IdentificarCampoBusquedad(entity),
            };

            string segmmentos = "";
            string valsegmentos = "";
            string alcances = "";

            if (regladescuento.Contains("atm_segmentocode"))
            {

                foreach (OptionSetValue item in regladescuento.GetAttributeValue<OptionSetValueCollection>("atm_segmentocode"))
                {
                    valsegmentos += $@"<value>{item}</value>";
                }

                segmmentos += $@"<condition attribute=""atm_segmentocode"" operator=""in"">
                                          {valsegmentos}
                                </condition>";
            }

            foreach (OptionSetValue item in regladescuento.GetAttributeValue<OptionSetValueCollection>("atm_alcancecode"))
            {
                alcances += $@"<value>{item.Value}</value>";
            }


            var fetchXml = $@"<?xml version=""1.0"" encoding=""utf-16""?>
                            <fetch>
                              <entity name=""{entity.LogicalName}"">
                                <filter>
                                  <condition attribute=""{datos.campobusquedad}"" operator=""eq"" value=""{entity.GetAttributeValue<EntityReference>(datos.campobusquedad).Id}""  uitype=""{entity.GetAttributeValue<EntityReference>(datos.campobusquedad).LogicalName}"" />
                                </filter>
                                <link-entity name=""{regladescuento.LogicalName}"" from=""atm_regladescuentosid"" to=""atm_regladescuentoid"">
                                  <filter>
                                    <condition attribute=""atm_alcancecode"" operator=""in"">
                                     {alcances}
                                    </condition>
                                     {segmmentos}
                                    <condition attribute=""atm_paisid"" operator=""eq"" value=""{regladescuento.GetAttributeValue<EntityReference>("atm_paisid").Id}"" uitype=""atm_pais"" />
                                    <condition attribute=""atm_tiporeglacode"" operator=""eq"" value=""{regladescuento.GetAttributeValue<OptionSetValue>("atm_tiporeglacode").Value}"" />
                                    <condition attribute=""atm_envigordesde"" operator=""on-or-after"" value=""{regladescuento.GetAttributeValue<DateTime>("atm_envigordesde").ToString("yyyy-MM-dd")}"" />
                                    <condition attribute=""atm_envigorhasta"" operator=""on-or-before"" value=""{regladescuento.GetAttributeValue<DateTime>("atm_envigorhasta").ToString("yyyy-MM-dd")}"" />
                                  </filter>
                                </link-entity>
                              </entity>
                            </fetch>";

            return service.RetrieveMultiple(new FetchExpression(fetchXml));
        }


        public string IdentificarCampoBusquedad(Entity entity)
        {
            string campoid = "";
            switch (entity.LogicalName)
            {
                case "atm_categoriasregladescuentos":
                    campoid = "atm_categoriaid";
                    break;
                case "atm_marcasregladescuento":
                    campoid = "atm_marcaid";
                    break;
                case "atm_formapagosregladescuento":
                    campoid = "atm_formapagoid";
                    break;
                case "atm_productoregladescuento":
                    campoid = "atm_productoid";
                    break;
                case "atm_subcategoriaregladescuento":
                    campoid = "atm_subcategoriaid";
                    break;
                case "atm_rinesregladescuento":
                    campoid = "atm_rinid";
                    break;
                case "atm_tiersregladescuento":
                    campoid = "atm_tierid";
                    break;
                case "atm_dimensionregladescuento":
                    campoid = "atm_dimensionid";
                    break;
                case "atm_clienteregladescuentos":
                    campoid = "atm_cuentaid";
                    break;
                case "atm_regionalesregladescuento":
                    campoid = "atm_regionalid";
                    break;

                default:
                    break;
            }
            return campoid;
        }


        public string ObtenerFecha(string mes, int año)
        {

            CultureInfo cult = new CultureInfo("es-ES", false);
            int numeromes = DateTime.ParseExact(mes.Split('-')[0], "MMMM", cult).Month;

            DateTime primerida = new DateTime(año, numeromes, 1);
            DateTime fechaFin = primerida.AddMonths(1).AddDays(-1);

            return $"{primerida.ToString("yyyy-MM-dd")},{fechaFin.ToString("yyyy-MM-dd")}";
        }
    }
}
