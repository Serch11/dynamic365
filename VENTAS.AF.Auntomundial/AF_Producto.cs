using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Newtonsoft.Json;
using VENTAS.AF.Automundial.Helpers;
using VENTAS.AF.Automundial.Models;

namespace VENTAS.AF.Automundial
{
    public static class AF_Producto
    {
        private static Conexion con;
        private static Utilidades utilidades = new Utilidades();

        [FunctionName("CargarProductoListaPrecio")]
        public static async Task<HttpResponseMessage> CargarProductoListaPrecio([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "CargarProductoListaPrecio")] HttpRequestMessage req, TraceWriter log)
        {

            CargarProductosRequest data = await utilidades.ConvertirRequest<CargarProductosRequest>(req);
            con = new Conexion(data.Ambiente, data.Usuario, data.Contrasena);
            IOrganizationService service = con.getCRMConn();
            Utilidades util = new Utilidades(service);

            try
            {
                List<ConditionExpression> lc = new List<ConditionExpression>
                {
                    new ConditionExpression("pricelevelid", ConditionOperator.Equal, new Guid(data.ListaPrecio))
                };
                var ListaProductos = util.ConsultarMultiplesRegistros(util.CrearConsulta("product", new string[] { "defaultuomid", "productid", "atm_impuesto" }, new List<ConditionExpression>()));
                var ListaPrecioActual = util.ConsultarRegistro("pricelevel", new Guid(data.ListaPrecio), new string[] { "transactioncurrencyid", "atm_paisid" });
                var ElementoListaPrecioActual = util.ConsultarMultiplesRegistros(util.CrearConsulta("productpricelevel", new string[] { "pricelevelid", "productid" }, lc));
                
      
                foreach (DataExcel item in data.Productos)
                {
                    var existe = ElementoListaPrecioActual.Where(x => x.GetAttributeValue<EntityReference>("productid").Id == item.idProd);
                    var uom = ListaProductos.Where(x => x.Id == item.idProd).FirstOrDefault().GetAttributeValue<EntityReference>("defaultuomid");
                    var procentaje = ListaProductos.Where(x => x.Id == item.idProd).FirstOrDefault().GetAttributeValue<decimal>("atm_impuesto");
                    var IVA = item.B + (item.B * (procentaje / 100));

                    Entity prod = new Entity() { LogicalName = "productpricelevel" };
                    prod.Attributes.Add("pricelevelid", new EntityReference() { Id = new Guid(data.ListaPrecio), LogicalName = "pricelevel" });
                    prod.Attributes.Add("productid", new EntityReference() { LogicalName = "product", Id = item.idProd });
                    prod.Attributes.Add("amount", new Money(item.B));
                    prod.Attributes.Add("uomid", uom);

                    //Campos nuevos
                    if (ListaPrecioActual.GetAttributeValue<EntityReference>("atm_paisid").Name == "COLOMBIA")
                    {
                        prod.Attributes.Add("atm_importeiva", new Money(IVA));
                        prod.Attributes.Add("atm_cuotarf4", new Money((IVA * (decimal)1.0600) / 4));
                        prod.Attributes.Add("atm_cuotarf5", new Money((IVA * (decimal)1.0720) / 5));
                        prod.Attributes.Add("atm_cuotarf6", new Money((IVA * (decimal)1.0725) / 6));
                        prod.Attributes.Add("atm_cuotarf7", new Money((IVA * (decimal)1.0835) / 7));
                        prod.Attributes.Add("atm_cuotarf8", new Money((IVA * (decimal)1.0940) / 8));
                        prod.Attributes.Add("atm_cuotarf9", new Money((IVA * (decimal)1.1050) / 9));
                        prod.Attributes.Add("atm_cuotarf10", new Money((IVA * (decimal)1.1150) / 10));
                    }
                    else
                    {
                        prod.Attributes.Add("atm_importeiva", new Money(IVA));
                    }

                    if (existe.Count() > 0)
                    {
                        prod.Id = existe.FirstOrDefault().Id;
                        service.Update(prod);
                    }
                    else
                    {
                        prod.Attributes.Add("createdby", new EntityReference() { Id = new Guid(data.Propietario), LogicalName = "systemuser" });
                        service.Create(prod);
                    }
                }
                
                return req.CreateResponse(HttpStatusCode.OK, new ReturnResponse() { Correcto = true, Mensaje = "Productos cargados" });
            }
            catch (Exception e)
            {
                return req.CreateResponse(HttpStatusCode.InternalServerError, new ReturnResponse() { Correcto = false, Mensaje = $"Error No Controlado:  {e.Message}" });
            }
        }
    }
}
