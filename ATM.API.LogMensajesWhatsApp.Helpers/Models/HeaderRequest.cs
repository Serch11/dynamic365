using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace ATM.API.LogMensajesWhatsApp.Helpers.Models
{
    public class HeaderRequest
    {
        public string organizationUrl { get; set; }

        public string clientId { get; set; }

        public string clientSecret { get; set; }

        public HeaderRequest(HttpRequestHeaders headers)
        {
            organizationUrl = headers.Contains("organizationUrl") ? getValueHeader(headers.GetValues("organizationUrl")) : null;
            clientId = headers.Contains("clientId") ? getValueHeader(headers.GetValues("clientId")) : null;
            clientSecret = headers.Contains("clientSecret") ? getValueHeader(headers.GetValues("clientSecret")) : null;
        }

        public void ValidateKeys()
        {
            if (string.IsNullOrEmpty(organizationUrl))
            {
                throw new Exception("the organizationUrl is obligatory");
            }

            if (string.IsNullOrEmpty(clientId))
            {
                throw new Exception("the clientId is obligatory");
            }

            if (string.IsNullOrEmpty(clientSecret))
            {
                throw new Exception("the clientSecret is obligatory");
            }
        }

        private string getValueHeader(IEnumerable<string> list)
        {
            string result = "";
            foreach (string str in list)
            {
                result = str;
            }
            return result;
        }
    }
}
