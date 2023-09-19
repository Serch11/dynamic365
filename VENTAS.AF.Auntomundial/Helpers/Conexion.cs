using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Tooling.Connector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.AF.Automundial.Helpers
{
    public class Conexion
    {
        public const string clientId = "8e717dfe-a160-4a0f-8973-be3194468b8c";

        private string UserName, Password, ResourceUrl;

        public IOrganizationService _service;

        public Conexion(string Ambiente, string Usuario, string Contrasena)
        {
            ResourceUrl = Ambiente;
            UserName = Usuario;
            Password = Contrasena;
        }

        public IOrganizationService getCRMConn()
        {
            string conn = $@"
                        Url = {ResourceUrl};
                        AuthType = OAuth;
                        UserName = {UserName};
                        Password = {Password};
                        AppId = {clientId};
                        RedirectUri = app://58145B91-0C36-4500-8554-080854F2AC97;
                        LoginPrompt=Auto;
                        RequireNewInstance = True";

            CrmServiceClient devConnection = new CrmServiceClient(conn);
            devConnection.OrganizationWebProxyClient.InnerChannel.OperationTimeout = new TimeSpan(0, 15, 0);

            _service = (IOrganizationService)devConnection.OrganizationWebProxyClient != null ?
                       (IOrganizationService)devConnection.OrganizationWebProxyClient :
                       (IOrganizationService)devConnection.OrganizationServiceProxy;


            return _service;
        }
    }
}
