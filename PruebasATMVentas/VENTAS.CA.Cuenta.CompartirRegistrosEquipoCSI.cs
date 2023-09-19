using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Pruebas;
using System;
using VENTAS.CA.Cuenta.CompartirRegistros;
using VENTAS.PL.Cuenta.CompartirCSI;

namespace PruebasATMVentas
{
    [TestClass]
    public class VENTAS_CA_Cuenta_CompartirRegistrosEquipoCSI
    {
        [TestMethod]
        public void TMCompartirRegistrosEquipoCSI()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            CompartirRegistrosEquipoCSI prueba = new CompartirRegistrosEquipoCSI();
            Entity cuenta =service.Retrieve("account", new Guid("5de0f3ac-5dfc-ec11-82e5-000d3a88f802"), new Microsoft.Xrm.Sdk.Query.ColumnSet(true));
            prueba.Run(service, cuenta, seguimiento);
        }
    }
}
