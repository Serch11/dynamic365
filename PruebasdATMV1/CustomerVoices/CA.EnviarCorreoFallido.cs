using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using System;
using VENTAS.CA.InvitacionEncuestaCustomerVoice.EnviarCorreo;


namespace PruebasATMVentasV1
{
    [TestClass]
    public class VENTAS_CA_CustomerVoice_EnviarCorreoFallido
    {
        [TestMethod]
        public void TMEnviarCorreoFallido()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            bool exito = false;
            string mensaje = string.Empty;
            string respuesta = string.Empty;
            Guid encuesta = new Guid("c326a600-56c1-4922-bd61-d6848aa678c7");
            EntityReference enc = new EntityReference("msfp_surveyinvite", encuesta);
           
            EnviarCorreoEncuestaFallida prueba = new EnviarCorreoEncuestaFallida();
            prueba.Run(service,enc,seguimiento,out exito, out respuesta);
        }
    }
}
