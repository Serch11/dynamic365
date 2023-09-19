using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Pruebas;
using System;
using VENTAS.CA.Auditoria.EliminarRegistros;

namespace PruebasATMVentas
{
    [TestClass]
    public class VENTAS_CA_Auditoria_EliminarRegistros
    {
        [TestMethod]
        public void TMAsignarRegistros()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            bool exito = false;
            string mensaje = string.Empty;

            EliminarRegistrosAuditoria prueba = new EliminarRegistrosAuditoria();

            prueba.Run(seguimiento, service, out mensaje, out exito);          
        }
    }
}
