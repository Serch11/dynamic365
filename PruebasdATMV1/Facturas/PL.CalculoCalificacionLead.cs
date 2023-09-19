using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using System;
using Microsoft.Xrm.Sdk.Query;
using VENTAS.PL.Factura.CalculoCalificacionLead;

namespace PruebasATMVentasV1
{
    [TestClass]
    public class VENTAS_PL_Factura_CalculoCalificacionLead
    {
        [TestMethod]
        public void TMCalcularCalificacionCP() 
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            CalcularCalificacionCP prueba = new CalcularCalificacionCP();

            Entity entity =  service.Retrieve("invoice", new Guid("aeea05d8-4a31-ee11-bdf4-000d3ac162dc"), new ColumnSet(true));

            prueba.Run(service, entity, seguimiento);
        }
    }
}
