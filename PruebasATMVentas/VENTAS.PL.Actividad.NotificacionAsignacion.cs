using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Pruebas;
using System;
using VENTAS.PL.Actividad.CerrarActividad;
using VENTAS.PL.Actividad.NotificacionAsignacion;

namespace PruebasATMVentas
{
    [TestClass]
    public class VENTAS_PL_Actividad_NotificacionAsignacion
    {
        [TestMethod]
        public void TMNotificarArignacion()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            NotificacionAsignacion prueba = new NotificacionAsignacion();
            Entity entity = service.Retrieve("task", new Guid("6b6f537f-7e5f-ed11-9562-000d3ac162dc"), new Microsoft.Xrm.Sdk.Query.ColumnSet(true));
            prueba.Run(service, entity, seguimiento);
        }
    }
}
