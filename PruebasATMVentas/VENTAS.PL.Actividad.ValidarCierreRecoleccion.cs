using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Pruebas;
using System;
using VENTAS.PL.Actividad.CerrarActividad;
using VENTAS.PL.Actividad.ValidarCierreRecoleccion;

namespace PruebasATMVentas
{
    [TestClass]
    public class VENTAS_PL_Actividad_ValidarCierreRecoleccion
    {
        [TestMethod]
        public void TMvalidarCierreRecoleccion()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            ValidarCierreRecoleccion prueba = new ValidarCierreRecoleccion();
            Entity entity = service.Retrieve("atm_recoleccion", new Guid("8f730d49-f374-ed11-81ac-000d3ac162dc"), new Microsoft.Xrm.Sdk.Query.ColumnSet(true));
            prueba.Run(service, entity, seguimiento);
        }
    }
}
