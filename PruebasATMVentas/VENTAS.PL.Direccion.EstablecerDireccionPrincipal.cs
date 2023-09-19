using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Tooling.Connector;
using System;
using VENTAS.PL.Direccion.EstablecerDireccionPrincipal;

namespace Pruebas
{
    [TestClass]
    public class VENTAS_PL_Direccion_EstablecerDireccionPrincipal
    {
        [TestMethod]
        public void TMEstablecerDireccionPrincipal()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            Entity Target = new Entity("atm_direccion");
            Target.Id = new Guid("d1305054-d2b9-ed11-b597-000d3ac1076a");
            Target.Attributes.Add("atm_cuentaid", new EntityReference { Id = new Guid("7c2dc01a-5cfc-ec11-82e5-000d3a88f802"), LogicalName = "account" });
            Target.Attributes.Add("atm_esprincipal", true);
            Target.Attributes.Add("atm_latitud", 3.44064);
            Target.Attributes.Add("atm_longitud", -76.5001728);

            EstablecerDireccionPrincipal prueba = new EstablecerDireccionPrincipal();
            prueba.Run(service, Target, seguimiento);
        }
    }
}
