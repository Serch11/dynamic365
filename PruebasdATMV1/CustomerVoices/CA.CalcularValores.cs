using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using System;
using VENTAS.CA.RespuestaEncuesta.CalcularValores;



namespace PruebasATMVentasV1
{
    [TestClass]
    public class VENTAS_CA_CustomerVoice_CalcularValores
    {
        [TestMethod]
        public void TMCalcularValores()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            bool exito = false;
            string mensaje = string.Empty;
            string respuesta = string.Empty;

            CalcularValores prueba = new CalcularValores();
            string n = "8FC1C890-4C32-EE11-BDF4-00224837F942";
            string n1 = "c8e4aa7e-883c-ee11-bdf4-000d3a8863e0";
            string dili = "f86a6489-b93a-ee11-bdf4-002248df557e";
            prueba.Run(service, seguimiento, "dfd93ab9-bb50-ee11-be6e-6045bd3c2679", out exito, out mensaje);
        }
    }
}
