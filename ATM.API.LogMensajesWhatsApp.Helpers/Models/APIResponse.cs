using System.Net;

namespace ATM.API.LogMensajesWhatsApp.Helpers.Models
{
    public class APIResponse
    {
        /// <summary>
        /// HttpResponse Code
        /// </summary>
        public HttpStatusCode Code { get; set; }

        /// <summary>
        /// Request state
        /// </summary>
        public bool Success { get; set; }

        /// <summary>
        /// Message related to the response
        /// </summary>
        public string Message { get; set; }
    }
}
