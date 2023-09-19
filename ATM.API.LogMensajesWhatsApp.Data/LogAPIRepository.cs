using ATM.API.LogMensajesWhatsApp.Data.Interface;
using ATM.API.LogMensajesWhatsApp.Helpers;
using ATM.API.LogMensajesWhatsApp.Helpers.Models;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk.WebServiceClient;
using Microsoft.Xrm.Tooling.Connector;
using System;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace ATM.API.MWA.Data
{
    public class LogAPIRepository : ILogAPIRepository
    {
        public async Task<APIResponse> createLog(HttpRequestHeaders header, LogRequest logRequest)
        {
            APIResponse response = new APIResponse() { Code = HttpStatusCode.Unauthorized };

            string token = await RetrieveAuthToken.GetToken(header);

            HeaderRequest headerReq = new HeaderRequest(header);
            Uri serviceUrl = new Uri($"{headerReq.organizationUrl}/XRMServices/2011/Organization.svc/web");
            using (var sdkService = new OrganizationWebProxyClient(serviceUrl, true))
            using (CrmServiceClient service = new CrmServiceClient(sdkService))
            {
                service.OrganizationWebProxyClient.HeaderToken = token;

                Entity regCRM = service.Retrieve(logRequest.Tipo, new Guid(logRequest.ID), new ColumnSet(true));

                if (regCRM != null)
                {
                    QueryExpression consultaFlujo = new QueryExpression("atm_flujoterceros");
                    consultaFlujo.ColumnSet.AllColumns = false;
                    consultaFlujo.NoLock = true;
                    consultaFlujo.Criteria.AddCondition("atm_nombre", ConditionOperator.Equal, logRequest.Flujo);

                    Entity flujo = service.RetrieveMultiple(consultaFlujo).Entities.FirstOrDefault();

                    if (flujo != null)
                    {
                        string Nombre = string.Empty;

                        switch (regCRM.ToEntityReference().LogicalName)
                        {
                            case "account":
                                Nombre = regCRM.GetAttributeValue<string>("name");
                                break;
                            case "lead":
                            case "contact":
                                Nombre = regCRM.GetAttributeValue<string>("fullname");
                                break;
                        }

                        Entity newLog = new Entity() { LogicalName = "atm_logmensajemasivo" };
                        newLog.Attributes.Add("regardingobjectid", regCRM.ToEntityReference());
                        newLog.Attributes.Add("description", logRequest.Descripcion);
                        newLog.Attributes.Add("atm_flujoid", flujo.ToEntityReference());
                        newLog.Attributes.Add("subject", $"{Nombre} - {DateTime.UtcNow.ToString()}");
                        newLog.Attributes.Add("scheduledstart", DateTime.UtcNow);
                        newLog.Attributes.Add("scheduledend", DateTime.UtcNow);

                        Guid log = service.Create(newLog);

                        SetStateRequest setStateRequest = new SetStateRequest()
                        {
                            EntityMoniker = new EntityReference
                            {
                                Id = log,
                                LogicalName = newLog.LogicalName,
                            },
                            State = new OptionSetValue(1),
                            Status = new OptionSetValue(2)
                        };
                        service.Execute(setStateRequest);

                        response.Code = HttpStatusCode.Created;
                        response.Success = true;
                        response.Message = "Registro Creado";
                    }
                    else
                    {
                        response.Code = HttpStatusCode.BadRequest;
                        response.Success = false;
                        response.Message = "Flujo no encontrado";
                    }
                }
                else
                {
                    response.Code = HttpStatusCode.BadRequest;
                    response.Success = false;
                    response.Message = "ID no encontrado";
                }
            }
            return response;
        }
    }
}
