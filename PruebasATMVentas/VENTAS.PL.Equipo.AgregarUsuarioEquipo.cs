using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Crm.Sdk.Messages;
using System;
using VENTAS.PL.Equipo.AgregarOEliminarUsuarioDeUnEquipo;


namespace Pruebas
{
    [TestClass]
    public class VENTAS_PL_Equipo_AgregarUsuario
    {
        [TestMethod]
        public void TMUsuarioAgregarEquipo()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;


            AddMembersTeamRequest refe = new AddMembersTeamRequest
            {
                TeamId = new Guid("b45cf984-efd5-ec11-a7b5-002248384310"),
                MemberIds = new Guid[] { Guid.Parse("e211b141-a361-ec11-8f8f-00224837beef"), Guid.Parse("dcec485d-db4b-ed11-bba2-000d3ac1076a") }
            };
            service.Execute(refe);

            
            ActualizarUsuarioEnEquipo prueba = new ActualizarUsuarioEnEquipo();
            prueba.Run(service, refe, seguimiento);
        }
    }
}
