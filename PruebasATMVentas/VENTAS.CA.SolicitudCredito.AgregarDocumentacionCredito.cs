using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Pruebas;
using System;
using VENTAS.CA.SolicitudCredito.AgregarDocumentacionCredito;

namespace PruebasATMVentas
{
    [TestClass]
    public class VENTAS_CA_SolicitudCredito_AgregarDocumentacionCredito
    {
        [TestMethod]
        public void TMAgregarDocumentacionCredito()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            bool exito = false;
            string mensaje = string.Empty;

            AgregarDocumentacionCredito prueba = new AgregarDocumentacionCredito();
            EntityReference entity = new EntityReference() { Id = new Guid("bf5848c7-b742-485c-ac08-2bccac3d179a"), LogicalName = "atm_solicitudcredito" };
            
            prueba.Run(service, entity, seguimiento, out exito, out mensaje);
        }
    }
}
