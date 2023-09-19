using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using VENTAS.PL.ListaPrecio.ValidarCreacion;
using System;
using Microsoft.Xrm.Sdk.Query;

namespace PruebasATMVentasV1
{
    [TestClass]
    public class VENTAS_PL_ListaPrecio_ValidarCreacion
    {
        [TestMethod]
        public void TMValidarCreacion() 
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            ValidarCreacion prueba = new ValidarCreacion();

            Entity entity =  service.Retrieve("pricelevel", new Guid("f2a1884a-5617-ee11-9cbe-000d3ac162dc"), new ColumnSet(true));

            prueba.Run(service, entity, seguimiento);
        }
    }
}
