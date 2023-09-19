using ATM.API.LogMensajesWhatsApp.Helpers.Models;
using Microsoft.Identity.Client;
using System;
using System.Net.Http.Headers;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace ATM.API.LogMensajesWhatsApp.Helpers
{
    public static class RetrieveAuthToken
    {
        private static string azureTenant = AppConfigUtil.ReadSetting("AzureTenant");

        /// <summary>
        /// Clase que me obtiene el token desde el azure.
        /// </summary>
        /// <param name="headers"> son los encabezados de la peticion, aqui deben venir 
        /// el clientId, clientSecret y organizationUrl </param>
        /// <returns></returns>
        public async static Task<string> GetToken(HttpRequestHeaders headers)
        {
            try
            {
                HeaderRequest headerReq = new HeaderRequest(headers);
                headerReq.ValidateKeys();

                IConfidentialClientApplication app = ConfidentialClientApplicationBuilder
                                                            .Create(headerReq.clientId)
                                                            .WithClientSecret(headerReq.clientSecret)
                                                            .WithAuthority(azureTenant)
                                                            .Build();

                var authResult = await app.AcquireTokenForClient(
                                            new[] { $"{headerReq.organizationUrl}/.default" })
                                            .ExecuteAsync()
                                            .ConfigureAwait(false);
                return authResult.AccessToken;
            }
            catch (Exception Ex)
            {
                throw new Exception("Error in Auth Azure: " + Ex.Message);
            }
        }
    }
}
