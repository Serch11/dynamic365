using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using System;
using VENTAS.CA.Actividad.RegistroEnvioMensajeWhatsApp;

namespace PruebasATMVentasV1.Actividades
{
    [TestClass]
    public class VENTAS_CA_Actividad_RegistroEnvioMensajeWhatsApp
    {
        [TestMethod]
        public void TMRegistroEnvioMensajeWhatsApp()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            bool exito = false;
            string mensaje = string.Empty;
            string cuentas = "['5d1c1fe0-19ec-ec11-bb3c-002248dea34b']";
            string tipo = "account";
            string flujo = "ATM_COL_PAR_BRIDGESTONE_MARZO";

            GuardarRegistro prueba = new GuardarRegistro();
            prueba.Run(service, cuentas, tipo, flujo, seguimiento, out exito, out mensaje);
        }
    }
}
