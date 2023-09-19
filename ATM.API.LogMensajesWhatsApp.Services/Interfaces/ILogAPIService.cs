using ATM.API.LogMensajesWhatsApp.Helpers.Models;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace ATM.API.LogMensajesWhatsApp.Services.Interfaces
{
    public interface ILogAPIService
    {
        Task<APIResponse> createLog(HttpRequestHeaders header, LogRequest logRequest);
    }
}
