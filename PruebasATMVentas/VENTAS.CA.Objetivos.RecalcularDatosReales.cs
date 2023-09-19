using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Pruebas;
using System;
using VENTAS.CA.Objetivos.RecalcularDatosReales;

namespace PruebasATMVentas
{
    [TestClass]
    public class VENTAS_CA_Objetivos_RecalcularDatosReales
    {
        [TestMethod]
        public void RecalcularDatosReales()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            bool exito = false;
            string mensaje = string.Empty;

            RecalcularDatosReales prueba = new RecalcularDatosReales();

            prueba.Run(service, seguimiento, out mensaje, out exito);          
        }
    }
}
