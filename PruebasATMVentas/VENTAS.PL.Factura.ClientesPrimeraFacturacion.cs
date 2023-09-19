using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using System;
using VENTAS.PL.Factura.ClientesPrimeraFacturacion;

namespace Pruebas
{
    [TestClass]
    public class VENTAS_PL_Factura_ClientesPrimeraFacturacion
    {
        [TestMethod]
        public void TMClientesPrimeraFacturacion()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            Entity refe = service.Retrieve("invoice", new Guid("15990cbd-4867-ed11-9562-000d3ac1076a"), new Microsoft.Xrm.Sdk.Query.ColumnSet(true));

            ClientesPrimeraFacturacion prueba = new ClientesPrimeraFacturacion();
            prueba.Run(service, refe, seguimiento);
        }
    }
}
