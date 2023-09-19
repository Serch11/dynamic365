using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using System;
using VENTAS.PL.Factura.NotificacionTipoLocalizacion;

namespace Pruebas
{
    [TestClass]
    public class VENTAS_PL_Factura_NotificacionTipoLocalizacion
    {
        [TestMethod]
        public void TMNotificacionTipoLocalizacion()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            Entity refe = service.Retrieve("invoice", new Guid("3149a25e-3056-ed11-9561-000d3ac162dc"), new Microsoft.Xrm.Sdk.Query.ColumnSet(true));

            EnviarCorreoLocalizacionTipoCDS prueba = new EnviarCorreoLocalizacionTipoCDS();
            prueba.Run(service, refe, seguimiento);
        }
    }
}
