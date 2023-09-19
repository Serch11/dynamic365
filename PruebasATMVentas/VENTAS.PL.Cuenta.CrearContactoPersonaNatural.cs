using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Pruebas;
using System;
using VENTAS.PL.Cuenta.CrearContactoPersonaNatural;

namespace PruebasATMVentas
{
    [TestClass]
    public class VENTAS_PL_Cuenta_CrearContactoPersonaNatural
    {
        [TestMethod]
        public void TMNotificacionFinalizacion()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            CrearContactoPersonaNatural prueba = new CrearContactoPersonaNatural();
            Entity entity = service.Retrieve("account", new Guid("76233423-9ed0-ec11-a7b5-000d3a88ab99"), new Microsoft.Xrm.Sdk.Query.ColumnSet(true));
            prueba.Run(service, entity, seguimiento);
        }
    }
}
