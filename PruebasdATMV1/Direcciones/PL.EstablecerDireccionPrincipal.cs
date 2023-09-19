using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using System;
using VENTAS.PL.Direccion.EstablecerDireccionPrincipal;

namespace PruebasATMVentasV1.Direcciones
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
            Target.Id = new Guid("1a3a7e66-d2b9-ed11-b597-000d3ac1076a");
            Target.Attributes.Add("atm_cuentaid", new EntityReference { Id = new Guid("bec5b72f-70a6-ed11-aad0-000d3ac162dc"), LogicalName = "account" });
            Target.Attributes.Add("atm_esprincipal", true);
            Target.Attributes.Add("atm_latitud", "3.4638798");
            Target.Attributes.Add("atm_longitud", "-76.4813893");
            Target.Attributes.Add("atm_tipodireccioncode", new OptionSetValue(963540000));            
            Target.Attributes.Add("atm_ubicacion", "Cra. 23 #4938");

            EstablecerDireccionPrincipal prueba = new EstablecerDireccionPrincipal();
            prueba.Run(service, Target, seguimiento);
        }
    }

}
