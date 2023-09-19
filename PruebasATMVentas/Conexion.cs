using Microsoft.Crm.Sdk.Messages;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.WebServiceClient;
using Microsoft.Xrm.Tooling.Connector;
using System;

namespace Pruebas
{
    public class Conexion
    {

        //AUTOMUNDIALcrm
        //public const string clientId = "6c0a6eb3-e12e-45ad-9c1d-947396d0bd92";
        //public const string secretKey = "ym_8Q~Fik2V.2RidTms1xUl0VxEXVt-CSnnAhdnD";
        //public const string redirectURI = "https://automundialcrm.azurewebsites.net/.auth/login/aad/callback";

        //D365ATM
        public const string clientId = "8e717dfe-a160-4a0f-8973-be3194468b8c";
        public const string secretKey = "ohB8Q~NqRGF2OQ32NeIYIrVyYrjCNpnLNQBqpbKB";
        public const string redirectURI = "https://d365atm.azurewebsites.net/.auth/login/aad/callback";

        public const string userName = "lsuarez@automundial.com.co";
        public const string password = "Esteestemporal02";
        public const string ResourceUrl = "https://automundialdev.crm2.dynamics.com/";

        public IOrganizationService _service;

        public CrmServiceClient getCRMConnv1()
        {
            string authority = @"https://login.microsoftonline.com/b2924d49-7059-4217-bf1e-a56430be3125";
            string discoveryUrl = $"{ResourceUrl}XRMServices/2011/Organization.svc/web";
            Uri discoveryUri = new Uri(discoveryUrl);

            AuthenticationContext authContext = new AuthenticationContext(authority, false);

            UserCredential cred = new UserCredential(userName, password);
            AuthenticationResult authResult = authContext.AcquireTokenAsync(ResourceUrl, clientId, cred).Result;

            var sdkService = new OrganizationWebProxyClient(discoveryUri, true);
            CrmServiceClient service = new CrmServiceClient(sdkService);
            
            service.OrganizationWebProxyClient.HeaderToken = authResult.AccessToken;

            return service;
        }

        public IOrganizationService getCRMConnv2()
        {
            

            string conn = $@"
                        Url = {ResourceUrl};
                        AuthType = OAuth;
                        UserName = {userName};
                        Password = {password};
                        AppId = {clientId};
                        RedirectUri = app://58145B91-0C36-4500-8554-080854F2AC97;
                        LoginPrompt=Auto;
                        RequireNewInstance = True";

            CrmServiceClient devConnection = new CrmServiceClient(conn);
            //devConnection.OrganizationWebProxyClient.InnerChannel.OperationTimeout = new TimeSpan(0, 5, 0);

            _service = (IOrganizationService)devConnection.OrganizationWebProxyClient != null ?
                       (IOrganizationService)devConnection.OrganizationWebProxyClient :
                       (IOrganizationService)devConnection.OrganizationServiceProxy;

            
            return _service;
        }
    }
}
