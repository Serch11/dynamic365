using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Pruebas;
using System;
using VENTAS.PL.Cuenta.CompartirRegistros;

namespace PruebasATMVentas
{
    [TestClass]
    public class VENTAS_PL_Cuenta_CompartirRegistros
    {
        [TestMethod]
        public void TMCerrarCita()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            CompartirRegistros prueba = new CompartirRegistros();
            Entity entity = service.Retrieve("account", new Guid("721649b9-cda7-ed11-aad0-0022483751b2"), new Microsoft.Xrm.Sdk.Query.ColumnSet(true));
            prueba.Run(service, entity, seguimiento);
        }
    }
}
