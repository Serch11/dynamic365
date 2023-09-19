using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using VENTAS.CA.Recoleccion.ActualizacionOffline;
using VENTAS.PL.ReglaDescuento.CargaInicial;

namespace PruebasATMVentasV1
{
    [TestClass]
    public class VENTAS_PL_CargaInicial
    {
        [TestMethod]
        public void TMCargaInicial()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;
            
            CargarInicial prueba = new CargarInicial();
            Entity entity = new Entity() { Id = new System.Guid("50bbd613-f709-ee11-8f6e-000d3ac162dc"), LogicalName = "atm_regladescuentos" };


            prueba.Run(service, entity,  seguimiento);
        }
    }
}
