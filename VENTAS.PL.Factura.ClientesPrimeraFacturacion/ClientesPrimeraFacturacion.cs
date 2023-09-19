using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Crm.Sdk.Messages;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.IO;
using Newtonsoft.Json;

namespace VENTAS.PL.Factura.ClientesPrimeraFacturacion
{
    public class ClientesPrimeraFacturacion : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {

            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(null); // se coloca null para que se ejecute como SYSTEM

            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            Entity TargetEntity = null;

            if (context.MessageName == "Create")
            {
                TargetEntity = (Entity)context.InputParameters["Target"];
            }
            if (TargetEntity != null)
            {
                Run(service, TargetEntity, seguimiento);
            }
        }

        public void Run(IOrganizationService service, Entity entity, ITracingService seguimiento)
        {
            int executionSection = 0;
            //string pluginName = "VENTAS.PL.Factura.ClientesPrimeraFacturacion";
            try
            {
                QueryExpression ConsultarInvoice = new QueryExpression() { EntityName = "invoice" };
                ConsultarInvoice.NoLock = true;
                ConsultarInvoice.ColumnSet.AddColumns(new string[] { "customerid", "createdon" });
                ConsultarInvoice.Criteria.AddCondition("invoiceid", ConditionOperator.Equal, entity.Id);

                LinkEntity linkAccount = new LinkEntity(
                       linkFromEntityName: "invoice",
                       linkToEntityName: "account",
                       linkFromAttributeName: "customerid",
                       linkToAttributeName: "accountid",
                       joinOperator: JoinOperator.Inner);
                linkAccount.Columns.AddColumns(new string[] { "atm_semsicecode", "createdon", "emailaddress1", "atm_correofacturacionelectronica", "ownerid", "accountid" });
                linkAccount.EntityAlias = "account";

                ConsultarInvoice.LinkEntities.Add(linkAccount);

                executionSection = 1;

                Entity resInvoice = service.RetrieveMultiple(ConsultarInvoice).Entities.FirstOrDefault();

                EntityReference RegardingObject = new EntityReference() { Id = (Guid)resInvoice.GetAttributeValue<AliasedValue>("account.accountid").Value, LogicalName = "account" };

                if (resInvoice.Contains("account.atm_semsicecode"))
                {
                    executionSection = 2;
                    DateTime fcInvoice = resInvoice.GetAttributeValue<DateTime>("createdon");
                    DateTime fcAccount = (DateTime)resInvoice.GetAttributeValue<AliasedValue>("account.createdon").Value;

                    if (fcAccount.Date == fcInvoice.Date)
                    {
                        executionSection = 3;
                        if (((OptionSetValue)resInvoice.GetAttributeValue<AliasedValue>("account.atm_semsicecode").Value).Value == 963540000)
                        {
                            executionSection = 4;
                            QueryExpression consultaParametros = new QueryExpression("atm_parametro");
                            consultaParametros.ColumnSet.AllColumns = true;
                            consultaParametros.Criteria.AddCondition("atm_nombre", ConditionOperator.BeginsWith, "MB-");
                            consultaParametros.AddOrder("atm_nombre", OrderType.Ascending);

                            EntityCollection resParametros = service.RetrieveMultiple(consultaParametros);

                            executionSection = 5;
                            if (resParametros.Entities.Count == 2)
                            {
                                QueryExpression consultaFlujo = new QueryExpression("atm_flujoterceros");
                                consultaFlujo.ColumnSet.AllColumns = false;
                                consultaFlujo.NoLock = true;
                                consultaFlujo.Criteria.AddCondition("atm_nombre", ConditionOperator.Equal, resParametros.Entities[1].GetAttributeValue<string>("atm_valor"));

                                Entity flujo = service.RetrieveMultiple(consultaFlujo).Entities.FirstOrDefault();

                                string URL = resParametros.Entities[0].GetAttributeValue<string>("atm_valor");
                                var resp = ConsultarApi<ResponseAPI>(service, URL, "GET", RegardingObject, flujo);
                                if (resp != null)
                                {
                                    Items item = resp.items.Where(x => x.title == resParametros.Entities[1].GetAttributeValue<string>("atm_valor")).FirstOrDefault();

                                    QueryExpression consultarAccount = new QueryExpression() { EntityName = "account" };
                                    consultarAccount.NoLock = true;
                                    consultarAccount.ColumnSet.AddColumns(item.options.variables.Where(x => !x.Contains("_")).ToArray());
                                    consultarAccount.Criteria.AddCondition("accountid", ConditionOperator.Equal, entity.GetAttributeValue<EntityReference>("customerid").Id);

                                    LinkEntity linkPais = new LinkEntity(
                                               linkFromEntityName: "account",
                                               linkToEntityName: "atm_pais",
                                               linkFromAttributeName: "atm_paisid",
                                               linkToAttributeName: "atm_paisid",
                                               joinOperator: JoinOperator.Inner);
                                    linkPais.Columns.AddColumns("atm_indicativo");
                                    linkPais.EntityAlias = "pais";

                                    LinkEntity linkPropietario = new LinkEntity(
                                              linkFromEntityName: "account",
                                              linkToEntityName: "systemuser",
                                              linkFromAttributeName: "ownerid",
                                              linkToAttributeName: "systemuserid",
                                              joinOperator: JoinOperator.Inner);
                                    linkPropietario.Columns.AddColumns(new string[] { "fullname", "mobilephone" });
                                    linkPropietario.EntityAlias = "owninguser";

                                    consultarAccount.LinkEntities.Add(linkPais);
                                    consultarAccount.LinkEntities.Add(linkPropietario);


                                    Entity resultadoAccount = service.RetrieveMultiple(consultarAccount).Entities.FirstOrDefault();

                                    if (resultadoAccount != null)
                                    {
                                        if (resultadoAccount.Contains("owninguser.mobilephone") && resultadoAccount.Contains("pais.atm_indicativo"))
                                        {
                                            string sendData = "{ ";
                                            int cont = 0;
                                            foreach (string par in item.options.variables)
                                            {
                                                var par1 = par.Replace("_", ".");
                                                if (resultadoAccount.Contains(par1))
                                                {
                                                    string valor = "";
                                                    switch (par1)
                                                    {
                                                        case "telephone1":
                                                        case "telephone2":
                                                        case "telephone3":
                                                        case "mobilephone":
                                                            valor = resultadoAccount.GetAttributeValue<AliasedValue>("pais.atm_indicativo").Value.ToString() + resultadoAccount.Attributes[par1].ToString();
                                                            break;
                                                        case "owninguser.mobilephone":
                                                            valor = resultadoAccount.GetAttributeValue<AliasedValue>("pais.atm_indicativo").Value.ToString() + resultadoAccount.GetAttributeValue<AliasedValue>(par1).Value.ToString();
                                                            break;
                                                        case "owninguser.fullname":
                                                            valor = resultadoAccount.GetAttributeValue<AliasedValue>(par1).Value.ToString();
                                                            break;
                                                        default:
                                                            valor = resultadoAccount.Attributes[par1].ToString();
                                                            break;
                                                    }
                                                    sendData += $"'{par1.Replace(".", "_")}' : '{valor}', ";
                                                    cont++;
                                                }
                                                else
                                                {
                                                    LlenarLog(service, $"Parametro {par1} no encontrado", RegardingObject, "Error", flujo);
                                                    return;
                                                }
                                            }

                                            if (item.options.variables.Length == cont)
                                            {
                                                sendData = sendData.Remove(sendData.Length - 2, 1) + "}";
                                                ConsultarApi<string>(service, item.options.invokeUrl, "POST", RegardingObject, flujo, sendData);
                                                LlenarLog(service, $"MENSAJE ENVIADO {DateTime.Now}", RegardingObject, "Correcto", flujo, $"{resultadoAccount.ToEntityReference().Name} - {DateTime.Now}");
                                            }
                                            else
                                            {
                                                LlenarLog(service, $"Los parametros para la petición se encuentran incompletos", RegardingObject, "Error", flujo);
                                                return;
                                            }
                                        }
                                        else
                                        {
                                            LlenarLog(service, $"El cliente no tiene asignado un país o la información del asesor está incompleta", RegardingObject, "Error", flujo);
                                            return;
                                        }
                                    }
                                }
                            }
                            else
                            {
                                LlenarLog(service, $"Parámetros de invocación de flujos no encontrados", RegardingObject, "Error", new Entity());
                                return;
                            }
                        }
                        else //diferente a segmento no particular
                        {
                            executionSection = 6;
                            if (resInvoice.Contains("account.emailaddress1"))
                            {
                                QueryExpression consultaUsuario = new QueryExpression("systemuser");
                                consultaUsuario.ColumnSet.AddColumn("internalemailaddress");
                                consultaUsuario.Criteria.AddCondition("systemuserid", ConditionOperator.Equal, ((EntityReference)resInvoice.GetAttributeValue<AliasedValue>("account.ownerid").Value).Id);

                                Entity resUsuario = service.RetrieveMultiple(consultaUsuario).Entities.FirstOrDefault();

                                Entity plantilla = obtenerPlantilla(service, "Cliente Nuevo No Particular");

                                InstantiateTemplateRequest instantiateTemplateRequest = new InstantiateTemplateRequest
                                {
                                    TemplateId = plantilla.Id,
                                    ObjectId = resInvoice.GetAttributeValue<EntityReference>("customerid").Id,
                                    ObjectType = resInvoice.GetAttributeValue<EntityReference>("customerid").LogicalName,
                                };

                                InstantiateTemplateResponse instantiateTemplateResponse = (InstantiateTemplateResponse)service.Execute(instantiateTemplateRequest);

                                Entity email = instantiateTemplateResponse.EntityCollection.Entities.FirstOrDefault();

                                email["regardingobjectid"] = entity.GetAttributeValue<EntityReference>("customerid");
                                email["from"] = new Entity[] { new Entity("activityparty") { Attributes = new AttributeCollection() { new KeyValuePair<string, object>("partyid", resUsuario.ToEntityReference()) } } };
                                email["to"] = new Entity[] { new Entity("activityparty") { Attributes = new AttributeCollection() { new KeyValuePair<string, object>("partyid", entity.GetAttributeValue<EntityReference>("customerid")) } } };
                                email["ownerid"] = resUsuario.ToEntityReference();

                                executionSection = 7;

                                Guid idEmail = service.Create(email);
                                SendEmailRequest request = new SendEmailRequest();
                                request.EmailId = idEmail;
                                request.IssueSend = true;
                                request.TrackingToken = "";
                                service.Execute(request);
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                if (seguimiento != null) { seguimiento.Trace("Error: " + e.Message); }
                //throw new InvalidPluginExecutionException(string.Format("Error: {0} - ({1}) Execution Section {2}", e.Message, pluginName, executionSection.ToString()), e);
            }
        }

        public T ConsultarApi<T>(IOrganizationService service, string URL, string Methodo, EntityReference reference, Entity flujo, string sendData = null)
        {
            T respuesta;

            var request = (HttpWebRequest)WebRequest.Create(URL);
            request.Method = Methodo;
            request.Headers.Add(HttpRequestHeader.Authorization, "AccessKey 7UJf4RspFJagu6PZp6mogwRAg");

            if (!string.IsNullOrEmpty(sendData))
            {
                using (var streamWriter = new StreamWriter(request.GetRequestStream()))
                {
                    streamWriter.Write(sendData.Replace("'", "\""));
                }
            }

            var content = string.Empty;
            var httpResponse = (HttpWebResponse)request.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                content = streamReader.ReadToEnd();
            }

            if (content != null)
            {
                respuesta = JsonConvert.DeserializeObject<T>(content);
            }
            else
            {
                respuesta = JsonConvert.DeserializeObject<T>("");
                LlenarLog(service, "No hay información en la respuesta", reference, "Error", flujo);
            }

            return respuesta;
        }

        public void LlenarLog(IOrganizationService service, string mensaje, EntityReference reference, string tipoLog, Entity flujo, string asunto = "")
        {
            int tl = 0;
            Entity entity = new Entity() { LogicalName = "atm_logmensajemasivo" };
            entity.Attributes.Add("subject", asunto == "" ? "Error invocación flujo " + DateTime.UtcNow.ToString() : asunto);
            entity.Attributes.Add("description", mensaje);
            if(flujo != null)
            {
                entity.Attributes.Add("atm_flujoid", flujo.ToEntityReference());
            }
            entity.Attributes.Add("regardingobjectid", reference);
            entity.Attributes.Add("scheduledstart", DateTime.UtcNow);
            entity.Attributes.Add("scheduledend", DateTime.UtcNow);

            switch (tipoLog)
            {
                case "Correcto":
                    tl = 963540000;
                    break;
                case "Error":
                    tl = 963540001;
                    break;
                case "Pendiente":
                    tl = 963540002;
                    break;
            }
            entity.Attributes.Add("atm_tipologcode", new OptionSetValue(tl));
            Guid log = service.Create(entity);

            SetStateRequest setStateRequest = new SetStateRequest()
            {
                EntityMoniker = new EntityReference
                {
                    Id = log,
                    LogicalName = entity.LogicalName,
                },
                State = new OptionSetValue(1),
                Status = new OptionSetValue(2)
            };

            service.Execute(setStateRequest);
        }


        private static Entity obtenerPlantilla(IOrganizationService service, String nombrePlantilla)
        {
            QueryExpression query = new QueryExpression("template");
            query.ColumnSet = new ColumnSet(false);
            query.Criteria.AddCondition("title", ConditionOperator.Equal, nombrePlantilla);

            EntityCollection result = service.RetrieveMultiple(query);

            return result.Entities.FirstOrDefault();
        }

        #region Respuestas
        private class ResponseAPI
        {
            public string offset { get; set; }
            public List<Items> items { get; set; }

        }

        private class Items
        {
            public Guid id { get; set; }
            public string title { get; set; }
            public Options options { get; set; }
        }

        private class Options
        {
            public string invokeUrl { get; set; }
            public string[] variables { get; set; }
        }

        #endregion
    }
}
