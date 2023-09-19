using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Pruebas;
using System;


namespace PruebasATMVentas
{
    [TestClass]
    public class VENTAS_PL_RespuestaEncuesta_CalculoValores
    {
        [TestMethod]
        public void TMCalculoValores()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

           
        }
    }
}
