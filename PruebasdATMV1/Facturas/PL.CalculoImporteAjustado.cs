using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using System;
using VENTAS.PL.Factura.CalculoImporteAjustado;

namespace PruebasATMVentasV1
{
    [TestClass]
    public class VENTAS_PL_Factura_CalculoImporteAjustado
    {
        [TestMethod]
        public void TMCalculoImporteAjustado()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            Entity refe = service.Retrieve("invoicedetail", new Guid("76769a94-6a31-ee11-bdf4-00224836b2ce"), new Microsoft.Xrm.Sdk.Query.ColumnSet(true));

            CalculoImporteAjustado prueba = new CalculoImporteAjustado();
            prueba.Run(service, refe, seguimiento, "Update");

        }
    }
}
