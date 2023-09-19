using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text;
using Newtonsoft.Json.Linq;


namespace ATM.Utilidades
{
    public class API
    {
        private static readonly HttpClient _Client = new HttpClient();

        public static async Task<T> POST<T>(string URL, object data)
        {
            var response = await Request(HttpMethod.Post, URL, JsonConvert.SerializeObject(data), new Dictionary<string, string>());
            string responseText = await response.Content.ReadAsStringAsync();
            T serializedResult = JsonConvert.DeserializeObject<T>(responseText);
            return serializedResult;
        }

        public static async Task<T> PUT<T>(string URL, object data)
        {
            var response = await Request(HttpMethod.Put, URL, JsonConvert.SerializeObject(data), new Dictionary<string, string>());
            string responseText = await response.Content.ReadAsStringAsync();
            T serializedResult = JsonConvert.DeserializeObject<T>(responseText);
            return serializedResult;
        }

        public static async Task<T> GET<T>(string URL)
        {
            var response = await Request(HttpMethod.Get, URL, null, new Dictionary<string, string>());
            string responseText = await response.Content.ReadAsStringAsync();
            T serializedResult = JsonConvert.DeserializeObject<T>(responseText);
            return serializedResult;
        }

        static async Task<HttpResponseMessage> Request(HttpMethod pMethod, string pUrl, string pJsonContent, Dictionary<string, string> pHeaders)
        {
            var httpRequestMessage = new HttpRequestMessage();
            httpRequestMessage.Method = pMethod;
            httpRequestMessage.RequestUri = new Uri(pUrl);
            foreach (var head in pHeaders)
            {
                httpRequestMessage.Headers.Add(head.Key, head.Value);
            }
            HttpContent httpContent = new StringContent(pJsonContent, Encoding.UTF8, "application/json");

            switch (pMethod.Method)
            {
                case "PUT":
                    httpRequestMessage.Content = httpContent;
                    break;
                case "POST":
                    httpRequestMessage.Content = httpContent;
                    return await _Client.PostAsync(pUrl, httpContent);
            }

            return await _Client.SendAsync(httpRequestMessage);
        }
    }
}
