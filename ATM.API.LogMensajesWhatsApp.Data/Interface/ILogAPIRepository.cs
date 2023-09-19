using ATM.API.LogMensajesWhatsApp.Helpers.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace ATM.API.LogMensajesWhatsApp.Data.Interface
{
    public interface ILogAPIRepository
    {
        Task<APIResponse> createLog(HttpRequestHeaders header, LogRequest logRequest);
    }
}
