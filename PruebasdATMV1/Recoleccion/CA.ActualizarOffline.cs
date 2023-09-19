using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using VENTAS.CA.Recoleccion.ActualizacionOffline;



namespace PruebasATMVentasV1
{
    [TestClass]
    public class VENTAS_CA_Recoleccion_ActualizacionOffline
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

            ActualizacionOffline prueba = new ActualizacionOffline();
            string idrecoleccion = "60674ddd-8d9a-4466-b966-5ecab0893359";


            prueba.Run(service, idrecoleccion,  seguimiento, out mensaje, out exito);
        }
    }
}
