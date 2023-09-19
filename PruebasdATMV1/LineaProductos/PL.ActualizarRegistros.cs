using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using VENTAS.PL.LineaDeProducto.ActualizarRegistro;
using System;
using Microsoft.Xrm.Sdk.Query;

namespace PruebasATMVentasV1
{
    [TestClass]
    public class VENTAS_PL_LineaProductos_ActualizarRegistro
    {
        [TestMethod]
        public void TMValidarCreacion() 
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            ModificarDescuentosAsociados prueba = new ModificarDescuentosAsociados();

            Entity entity =  service.Retrieve("quotedetail", new Guid("2483f7ac-5b52-ee11-be6f-000d3a88f346"), new ColumnSet(true));

            prueba.Run(service, entity, seguimiento);
        }
    }
}
