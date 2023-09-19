using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using System;
using VENTAS.CA.RespuestaEncuesta.CrearActividad;



namespace PruebasATMVentasV1
{
    [TestClass]
    public class VENTAS_CA_CustomerVoice_CrearActividades
    {
        [TestMethod]
        public void TMCrearActividades()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            bool exito = false;
            string mensaje = string.Empty;
            string respuesta = string.Empty;
            Entity encuestaCus =  service.Retrieve("msfp_surveyresponse", new Guid("65D7B771-B62F-EE11-BDF4-000D3AC184A2"), new Microsoft.Xrm.Sdk.Query.ColumnSet(true));
     
            CrearActividad prueba = new CrearActividad();
            prueba.Run(service, "c8e4aa7e-883c-ee11-bdf4-000d3a8863e0", seguimiento, out exito, out mensaje);
        }
    }
}
