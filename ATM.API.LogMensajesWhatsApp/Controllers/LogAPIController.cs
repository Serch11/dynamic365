using ATM.API.LogMensajesWhatsApp.Helpers.Models;
using ATM.API.LogMensajesWhatsApp.Services.Interfaces;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;

namespace ATM.API.MWA.Controllers
{
    [RoutePrefix("api/Log")]
    public class LogAPIController : ApiController
    {
        private readonly ILogAPIService LogService;

        public LogAPIController(ILogAPIService logService)
        {
            LogService = logService;
        }

        [HttpPost]
        [Route("CreateLog")]
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        public async Task<IHttpActionResult> Post(LogRequest logRequest)
        {
            APIResponse response = new APIResponse();

            response = await LogService.createLog(Request.Headers, logRequest);

            return Ok(response);
        }
    }
}