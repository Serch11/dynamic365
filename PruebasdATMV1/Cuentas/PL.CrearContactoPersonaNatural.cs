using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using VENTAS.PL.Cuenta.CrearContactoPersonaNatural;

namespace PruebasATMVentasV1
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
            Entity entity = service.Retrieve("account", new Guid("d7902287-ba2f-ee11-bdf4-000d3a88ba42"), new Microsoft.Xrm.Sdk.Query.ColumnSet(true));
            prueba.Run(service, entity, seguimiento);
        }
    }
}
