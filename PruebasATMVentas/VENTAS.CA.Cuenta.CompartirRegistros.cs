using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Pruebas;
using System;
using VENTAS.CA.Cuenta.CompartirRegistros;

namespace PruebasATMVentas
{
    [TestClass]
    public class VENTAS_CA_Cuenta_CompartirRegistros
    {
        [TestMethod]
        public void TMCerrarCita()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;
            bool exito = false;
            string mensaje = string.Empty;

            CompartirRegistros prueba = new CompartirRegistros();
            EntityReference cuentaHijo = new EntityReference("account", new Guid("512306aa-cda7-ed11-aad0-000d3a88cbac"));
            prueba.Run(service, cuentaHijo, seguimiento, out exito, out mensaje);
        }
    }
}
