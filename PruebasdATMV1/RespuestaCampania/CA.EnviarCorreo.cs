using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using VENTAS.CA.RespuestaCampania.EnviarCorreo;



namespace PruebasATMVentasV1
{
    [TestClass]
    public class VENTAS_CA_RespuestaCampania_EnviarCorreo
    {
        [TestMethod]
        public void TMCrearObjetivosV1()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;
            //496ccfd9-4eef-ed11-8848-000d3ac1076a
            bool exito = false;
            string respuesta = string.Empty;
            string plantilla = "c8bc01d2-dfed-ed11-8849-000d3ac1076a";
            string campania = "[\"c53d1e1b-46ef-ed11-8848-000d3ac1076a\",\"03d43308-46ef-ed11-8848-000d3ac1076a\",\"62f06503-5bef-ed11-8848-000d3ac1076a\"]";
            EnviarCorreo prueba = new EnviarCorreo();

            prueba.Run(service,seguimiento, campania , new System.Guid(plantilla), out exito, out respuesta);
        }
    }
}
