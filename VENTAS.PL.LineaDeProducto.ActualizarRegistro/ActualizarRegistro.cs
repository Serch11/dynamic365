using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections;
using Microsoft.Crm.Sdk.Messages;

namespace VENTAS.PL.LineaDeProducto.ActualizarRegistro
{
    public class ActualizarRegistro : IPlugin
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

                if ((context.MessageName == "Create") && context.InputParameters.Contains("Target"))
                {
                    entidad = (Entity)context.InputParameters["Target"];
                }

                if (entidad != null)
                {
                    Run(service, entidad, seguimiento);
                }
            }
            catch (Exception ex)
            {

                throw new InvalidPluginExecutionException(ex.Message);
            }
        }

        private void Run(IOrganizationService service, Entity entidad, ITracingService seguimiento)
        {
            try
            {
                //ASOCIAR DETALLE DEL PRODUCTO A LOS DESCUENTOS
                AsociarDescuentos(entidad, service);


                //ACTIVAR OPORTUNIDAD SI ESTA APROADA Y REGISTRAN UN PRODUCTO NUEVO
                ActivarOportunidad(entidad, service);
            }
            catch (Exception ex)
            {

                throw new InvalidPluginExecutionException(ex.Message);
            }
        }

        public void ActivarOportunidad(Entity entidad, IOrganizationService service)
        {
            try
            {
                if (entidad.LogicalName == "opportunityproduct")
                {
                    string campo = SaberEntidad(entidad.LogicalName);
                    string nombre_entidad = entidad.GetAttributeValue<EntityReference>(campo).LogicalName;
                    Guid id_entidad = entidad.GetAttributeValue<EntityReference>(campo).Id;

                    Entity con_entidad = service.Retrieve(nombre_entidad, id_entidad, new ColumnSet(new string[] { "statuscode", "statecode" }));

                    if (con_entidad.GetAttributeValue<OptionSetValue>("statuscode").Value == 7)
                    {                                       
                        SetStateRequest setStateRequest = new SetStateRequest
                        {
                            EntityMoniker = new EntityReference(nombre_entidad, id_entidad), // Reemplaza "opportunity" con el nombre real de la entidad de oportunidad si es diferente
                            State = new OptionSetValue(0), // 0 para estado Activo, 1 para estado Inactivo (Puedes ajustar esto según tus necesidades)
                            Status = new OptionSetValue(1) // El nuevo estado que deseas establecer
                        };

                        SetStateResponse setStateResponse = (SetStateResponse)service.Execute(setStateRequest);
                    }
                }
            }
            catch (Exception ex)
            {

                throw new InvalidPluginExecutionException(ex.Message);
            }
        }

        public string SaberEntidad(string nombreentidad)
        {
            string campoid = "";
            switch (nombreentidad)
            {
                case "opportunityproduct":
                    campoid = "opportunityid";
                    break;
                case "quotedetail":
                    campoid = "quoteid";
                    break;
            }
            return campoid;
        }

        public void AsociarDescuentos(Entity entidad, IOrganizationService service)
        {
            try
            {
                string campoid = SaberEntidad(entidad.LogicalName);

                //ASOCIAR DETALLE DEL PRODUCTO A LOS DESCUENTOS
                if (entidad.Contains("atm_descuentosaplicados"))
                {
                    string[] lista_descuentos = entidad.GetAttributeValue<string>("atm_descuentosaplicados").Split(',');

                    foreach (string id in lista_descuentos)
                    {
                        Entity regla_descuento = new Entity("atm_regladescuentos", new Guid(id));
                        Entity atm_descuentodetalle = new Entity("atm_descuentodetalle");
                        atm_descuentodetalle.Attributes.Add("atm_detalleid", entidad.ToEntityReference());
                        atm_descuentodetalle.Attributes.Add("atm_regladescuentoid", regla_descuento.ToEntityReference());
                        service.Create(atm_descuentodetalle);
                    }
                }
            }
            catch (Exception ex)
            {

                throw new InvalidPluginExecutionException(ex.Message);
            }
        }

        public void CalcularImpuestoPorCantidadProductos(IOrganizationService service, Entity entidad, string campoid, Entity entity)
        {
            RetornarDato resultado = ConsultarRegistrosRelacionados(service, entidad, campoid);

            Entity uptProducto1 = new Entity(entidad.LogicalName, entidad.Id);
            uptProducto1.Attributes.Add("priceperunit", new Money(entity.GetAttributeValue<Money>("priceperunit").Value));

            service.Update(uptProducto1);

            if (resultado.producto.Contains("atm_impuesto"))
            {

                CalculoValores res = RealizarOperaciones(resultado);

                Entity uptProducto = new Entity(entidad.LogicalName, entidad.Id);
                uptProducto.Attributes.Add("tax", new Money(res.tax));
                uptProducto.Attributes.Add("atm_importeiva", res.atm_importeiva);
                service.Update(uptProducto);
            }
        }


        public void ModificarPrecioUnitarioFormaPago(IOrganizationService service, Entity entidad, string campoid, RetornarDato registros)
        {

            string nombreformapago = registros.consultaEntidad.GetAttributeValue<EntityReference>("atm_condicionpagoid").Name;
            decimal preciounidadseteado = 0.0m;
            switch (nombreformapago.Trim())
            {

                case "RUEDA FACIL 4 MESES":
                    preciounidadseteado = registros.elementolistaprecio.GetAttributeValue<Money>("atm_cuotarf4").Value * (int)registros.consultaEntidad.GetAttributeValue<AliasedValue>("atm_condicionpago.atm_numerocuotas").Value;
                    break;
                case "RUEDA FACIL 5 MESES":
                    preciounidadseteado = registros.elementolistaprecio.GetAttributeValue<Money>("atm_cuotarf5").Value * (int)registros.consultaEntidad.GetAttributeValue<AliasedValue>("atm_condicionpago.atm_numerocuotas").Value;
                    break;
                case "RUEDA FACIL 6 MESES":
                    preciounidadseteado = registros.elementolistaprecio.GetAttributeValue<Money>("atm_cuotarf6").Value * (int)registros.consultaEntidad.GetAttributeValue<AliasedValue>("atm_condicionpago.atm_numerocuotas").Value;
                    break;
                case "RUEDA FACIL 7 MESES":
                    preciounidadseteado = registros.elementolistaprecio.GetAttributeValue<Money>("atm_cuotarf7").Value * (int)registros.consultaEntidad.GetAttributeValue<AliasedValue>("atm_condicionpago.atm_numerocuotas").Value;
                    break;
                case "RUEDA FACIL 8 MESES":
                    preciounidadseteado = registros.elementolistaprecio.GetAttributeValue<Money>("atm_cuotarf8").Value * (int)registros.consultaEntidad.GetAttributeValue<AliasedValue>("atm_condicionpago.atm_numerocuotas").Value;
                    break;
                case "RUEDA FACIL 9 MESES":
                    preciounidadseteado = registros.elementolistaprecio.GetAttributeValue<Money>("atm_cuotarf9").Value * (int)registros.consultaEntidad.GetAttributeValue<AliasedValue>("atm_condicionpago.atm_numerocuotas").Value;
                    break;
                case "RUEDA FACIL 10 MESES":
                    preciounidadseteado = registros.elementolistaprecio.GetAttributeValue<Money>("atm_cuotarf10").Value * (int)registros.consultaEntidad.GetAttributeValue<AliasedValue>("atm_condicionpago.atm_numerocuotas").Value;
                    break;
            }


            if (preciounidadseteado != 0)
            {
                //Entity actulizarPrecio = new Entity(entidad.LogicalName, entidad.Id);
                //var result = preciounidadseteado;
                //actulizarPrecio.Attributes.Add("priceperunit", new Money(result));
                //service.Update(actulizarPrecio);

                RetornarDato query = ConsultarRegistrosRelacionados(service, entidad, campoid);

                CalculoValores res = RealizarOperaciones(query);
                Entity uptItem = new Entity(entidad.LogicalName, entidad.Id);
                uptItem.Attributes.Add("tax", res.tax);
                uptItem.Attributes.Add("atm_importeiva", res.atm_importeiva);

            }
        }



        public RetornarDato ConsultarRegistrosRelacionados(IOrganizationService service, Entity entidad, string campoid)
        {


            entidad = service.Retrieve(entidad.LogicalName, entidad.Id, new ColumnSet(true));

            QueryExpression query = new QueryExpression(entidad.GetAttributeValue<EntityReference>(campoid).LogicalName);
            query.ColumnSet.AddColumns("atm_condicionpagoid", "pricelevelid");
            query.Criteria.AddCondition(campoid, ConditionOperator.Equal, entidad.GetAttributeValue<EntityReference>(campoid).Id);
            LinkEntity atm_condicionpago = query.AddLink("atm_condicionpago", "atm_condicionpagoid", "atm_condicionpagoid");
            atm_condicionpago.EntityAlias = "atm_condicionpago";
            atm_condicionpago.Columns.AddColumn("atm_numerocuotas");
            Entity consultaentidad = service.RetrieveMultiple(query).Entities.FirstOrDefault();

            QueryExpression querylista = new QueryExpression("productpricelevel");
            querylista.ColumnSet.AllColumns = true;
            querylista.Criteria.AddCondition("pricelevelid", ConditionOperator.Equal, consultaentidad.GetAttributeValue<EntityReference>("pricelevelid").Id);
            querylista.Criteria.AddCondition("productid", ConditionOperator.Equal, entidad.GetAttributeValue<EntityReference>("productid").Id);
            Entity elementolistaprecio = service.RetrieveMultiple(querylista).Entities.FirstOrDefault();
            Entity producto = service.Retrieve(entidad.GetAttributeValue<EntityReference>("productid").LogicalName, entidad.GetAttributeValue<EntityReference>("productid").Id, new ColumnSet(new string[] { "atm_impuesto" }));

            return new RetornarDato() { consultaEntidad = consultaentidad, elementolistaprecio = elementolistaprecio, producto = producto, entidad = entidad };

        }

        public CalculoValores RealizarOperaciones(RetornarDato datos)
        {
            decimal impuestoproducto = datos.producto.GetAttributeValue<decimal>("atm_impuesto") / 100;
            decimal cantidad = datos.entidad.GetAttributeValue<decimal>("quantity");
            decimal atm_importe = datos.entidad.GetAttributeValue<Money>("atm_importe").Value;
            decimal tax = atm_importe * impuestoproducto;
            decimal atm_importeiva = (atm_importe / cantidad) + (tax / cantidad);

            return new CalculoValores() { atm_importeiva = atm_importeiva, cantidad = cantidad, importe = atm_importe, impuestoproducto = impuestoproducto, tax = tax };
        }
    }


    public class RetornarDato
    {
        public Entity consultaEntidad { get; set; }
        public Entity elementolistaprecio { get; set; }
        public Entity producto { get; set; }
        public Entity entidad { get; set; }
    }

    public class CalculoValores
    {
        public decimal tax { get; set; }
        public decimal atm_importeiva { get; set; }
        public decimal cantidad { get; set; }
        public decimal importe { get; set; }
        public decimal impuestoproducto { get; set; }
    }
}
