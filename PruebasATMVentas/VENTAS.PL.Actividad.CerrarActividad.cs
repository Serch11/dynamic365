using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Pruebas;
using System;
using VENTAS.PL.Actividad.CerrarActividad;

namespace PruebasATMVentas
{
    [TestClass]
    public class VENTAS_PL_Actividad_CerrarActividad
    {
        [TestMethod]
        public void TMCerrarCita()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            CerrarCita prueba = new CerrarCita();
            Entity entity = service.Retrieve("phonecall", new Guid("11efbb28-f788-ec11-93b0-002248d2fc25"), new Microsoft.Xrm.Sdk.Query.ColumnSet(true));
            prueba.Run(service, entity, seguimiento);
        }
    }
}
