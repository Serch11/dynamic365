using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using VENTAS.PL.Recoleccion.AsignarActividad;



namespace PruebasATMVentasV1
{
    [TestClass]
    public class VENTAS_PL_AsignarActividad
    {
        [TestMethod]
        public void TMCrearObjetivosV1()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            bool exito = false;
            string mensaje = string.Empty;
            string respuesta = string.Empty;

            AsignarActividad prueba = new AsignarActividad();
            string idrecoleccion = "26ad2ff2-1533-ee11-bdf4-00224835f737";
            Entity recoleccion = service.Retrieve("atm_recoleccion", new System.Guid(idrecoleccion), new ColumnSet(true));

            prueba.Run(service, recoleccion, seguimiento);
        }
    }
}
