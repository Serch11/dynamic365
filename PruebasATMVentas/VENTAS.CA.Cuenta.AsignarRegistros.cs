using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Pruebas;
using System;
using VENTAS.CA.Cuenta.AsignarRegistros;

namespace PruebasATMVentas
{
    [TestClass]
    public class VENTAS_CA_Cuenta_AsignarRegistros
    {
        [TestMethod]
        public void TMAsignarRegistros()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            bool exito = false;
            string mensaje = string.Empty;
            string respuesta = string.Empty;

            AsignarRegistros prueba = new AsignarRegistros();

            //string data = "[\"1b3e4ec6-5cfc-ec11-82e6-000d3a88f346\",\"45341047-5dfc-ec11-82e5-000d3a88f802\",\"e3361047-5dfc-ec11-82e5-000d3a88f802\",\"c4391047-5dfc-ec11-82e5-000d3a88f802\",\"5d1c1fe0-19ec-ec11-bb3c-002248dea34b\"]";
            //string data = "[\"5b1a7d5d-41c6-ec11-a7b5-002248d30244\"]";
            //prueba.Run(service, data, "jsuarez@automundial.com.co", seguimiento, out exito, out mensaje, out respuesta);
            
            string data = "[\"b9b45fa5-7c66-ed11-9562-00224836b2ce\"]"; //PROD
            prueba.Run(service, data, "dquadros@automundial.com.co", seguimiento, out exito, out mensaje, out respuesta);

        }
    }
}
