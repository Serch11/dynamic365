using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Pruebas;
using System;
using VENTAS.PL.Actividad.CerrarActividad;
using VENTAS.PL.Actividad.ValidarCierreRecolecciones;

namespace PruebasATMVentas
{
    [TestClass]
    public class VENTAS_PL_Actividad_CerrarRecoleccion
    {
        [TestMethod]
        public void TMCerrarRecoleccion()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            ValidarCierreRecolecciones prueba = new ValidarCierreRecolecciones();
            Entity entity = service.Retrieve("atm_recoleccion", new Guid("6a0ec95f-e1a3-ed11-aad1-000d3ac162dc"), new Microsoft.Xrm.Sdk.Query.ColumnSet(true));
            prueba.Run(service, entity, seguimiento);
        }
    }
}
