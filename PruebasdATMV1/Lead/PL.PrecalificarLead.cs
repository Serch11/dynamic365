using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
//using VENTAS.PL.Lead.CalificarLead;

namespace PruebasATMVentasV1
{
    [TestClass]
    public class VENTAS_PL_Lead_PreCalificarLead
    {
        [TestMethod]
        public void TMPreCalificarLead()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            //PreCalificarLead prueba = new PreCalificarLead();
            //EntityReference cuenta = new EntityReference() { Id = new Guid("8875bbe6-0c35-4023-9ef6-7cdab5fce459"), LogicalName = "lead" };

            //prueba.Run(service, cuenta, seguimiento);
        }
    }
}
