using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Pruebas;
using System;
using VENTAS.CA.RespuestaEncuesta.CrearActividad;

namespace PruebasATMVentas
{
    [TestClass]
    public class VENTAS_CA_RespuestaEncuesta_CrearActividad
    {
        [TestMethod]
        public void TMCrearActividad()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            bool exito = false;
            string mensaje = string.Empty;

            CrearActividad prueba = new CrearActividad();

            EntityReference Referencia = new EntityReference() { Id = new Guid("695bbbc0-f5a2-ed11-aad1-00224837f942"), LogicalName = "msfp_surveyresponse" };
            prueba.Run(service, Referencia, seguimiento, out exito, out mensaje);
        }
    }
}
