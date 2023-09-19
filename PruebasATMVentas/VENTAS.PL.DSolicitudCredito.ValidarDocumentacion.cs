using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Tooling.Connector;
using System;
using VENTAS.PL.PVSC.ValidarEstadoProceso;

namespace Pruebas
{
    [TestClass]
    public class VENTAS_PL_SolicitudCredito_ValidarDocumentacion
    {
        [TestMethod]
        public void TMValidarDocumentacion()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            //ITracingService seguimiento = null;

            Entity entity = service.Retrieve("atm_solicitudcredito", new Guid("427477c4-4425-45bf-bb23-1ef2d100aeef"), new Microsoft.Xrm.Sdk.Query.ColumnSet(true));

            //ValidarDocumentacion prueba = new ValidarDocumentacion();
            //prueba.Run(service, entity, seguimiento);
        }
    }
}
