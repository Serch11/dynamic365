using ATM.API.LogMensajesWhatsApp.Data.Interface;
using ATM.API.LogMensajesWhatsApp.Helpers.Models;
using ATM.API.LogMensajesWhatsApp.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace ATM.API.MWA.Services
{
    public class LogAPIService : ILogAPIService
    {
        private readonly ILogAPIRepository logAPIRepository;

        public LogAPIService(ILogAPIRepository _leadRepository)
        {
            logAPIRepository = _leadRepository;
        }

        public async Task<APIResponse> createLog(HttpRequestHeaders header, LogRequest logRequest)
        {
            APIResponse response = new APIResponse();
            try
            {
                response = await logAPIRepository.createLog(header, logRequest);
            }
            catch (Exception ex)
            {
                response.Code = HttpStatusCode.InternalServerError;
                response.Success = false;
                response.Message = $"{ex.Message}\r\n{ex.InnerException?.Message}";
            }
            return response;
        }
    }
}
