using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Pruebas;
using System;
using VENTAS.PL.Actividad.CerrarActividad;
using VENTAS.PL.Vehiculo.CalcularNumeroVehiculos;

namespace PruebasATMVentas
{
    [TestClass]
    public class VENTAS_PL_Vehiculo_CalcularNumeroVehiculos
    {
        [TestMethod]
        public void TMCalcularNumeroVehiculos()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            CalcularNumeroVehiculos prueba = new CalcularNumeroVehiculos();
            Entity entity = service.Retrieve("atm_vehiculo", new Guid("1da9cbdf-9675-ed11-81ac-000d3ac162dc"), new Microsoft.Xrm.Sdk.Query.ColumnSet(true));
            prueba.Run(service, entity, seguimiento);
        }
    }
}
