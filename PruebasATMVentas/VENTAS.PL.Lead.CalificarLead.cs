using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Tooling.Connector;
using System;
using VENTAS.PL.Lead.CalificarLead;

namespace Pruebas
{
    [TestClass]
    public class VENTAS_PL_Lead_CalificarLead
    {
        [TestMethod]
        public void TMCalificarLead()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            EntityReference refe = new EntityReference() { Id = new Guid("fba64390-bd0b-45af-9d31-f5548bac36d3"), LogicalName = "lead" };

            CalificarLead prueba = new CalificarLead();
            prueba.Run(service, refe, seguimiento);
        }
    }
}
