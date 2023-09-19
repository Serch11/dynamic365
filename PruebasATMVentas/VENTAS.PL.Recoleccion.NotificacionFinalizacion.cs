using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Pruebas;
using System;
using VENTAS.PL.Actividad.CerrarActividad;
using VENTAS.PL.Recoleccion.NotificacionFinalizacion;

namespace PruebasATMVentas
{
    [TestClass]
    public class VENTAS_PL_Recoleccion_NotificacionFinalizacion
    {
        [TestMethod]
        public void TMNotificacionFinalizacion()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            NotificacionFinalizacion prueba = new NotificacionFinalizacion();
            EntityReference entity = new EntityReference() { Id = new Guid("9c51db38-5925-ed11-9db1-000d3ac1076a"), LogicalName = "atm_recoleccion" };
            prueba.Run(service, entity, seguimiento);
        }
    }
}
