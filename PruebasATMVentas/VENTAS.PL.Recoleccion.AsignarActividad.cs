using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Pruebas;
using System;
using VENTAS.PL.Recoleccion.AsignarActividad;

namespace PruebasATMVentas
{
    [TestClass]
    public class VENTAS_PL_Recoleccion_AsignarActividad
    {
        [TestMethod]
        public void TMAsignarActividad()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            AsignarActividad prueba = new AsignarActividad();
            
            //DIFERENTE
            Entity entity = service.Retrieve("atm_recoleccion", new Guid("767292a0-384a-ed11-bba2-000d3ac1076a"), new Microsoft.Xrm.Sdk.Query.ColumnSet(true));

            //MISMO            
            //Entity entity = service.Retrieve("atm_recoleccion", new Guid("c815c407-324a-ed11-bba2-000d3ac1076a"), new Microsoft.Xrm.Sdk.Query.ColumnSet(true));
            prueba.Run(service, entity, seguimiento);
        }
    }
}
