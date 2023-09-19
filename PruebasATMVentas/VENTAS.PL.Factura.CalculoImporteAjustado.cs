using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using System;
using VENTAS.PL.Factura.CalculoImporteAjustado;

namespace Pruebas
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

            Entity refe = service.Retrieve("invoicedetail", new Guid("cef9c3ba-8154-ed11-9561-000d3ac162dc"), new Microsoft.Xrm.Sdk.Query.ColumnSet(true));

            CalculoImporteAjustado prueba = new CalculoImporteAjustado();
            prueba.Run(service, refe, seguimiento, "Update");

        }
    }
}
