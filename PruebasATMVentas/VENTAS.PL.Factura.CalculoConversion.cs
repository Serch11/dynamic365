using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Tooling.Connector;
using System;
using VENTAS.PL.Factura.CalculoConversion;
using VENTAS.PL.Lead.CalificarLead;

namespace Pruebas
{
    [TestClass]
    public class VENTAS_PL_Factura_CalculoConversion
    {
        [TestMethod]
        public void TMCalculoConversion()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            Entity refe = service.Retrieve("invoice", new Guid("45329287-063e-ed11-bba3-00224836b2ce"), new Microsoft.Xrm.Sdk.Query.ColumnSet(true));

            CalculoConversion prueba = new CalculoConversion();
            prueba.Run(service, refe, seguimiento);
        }
    }
}
