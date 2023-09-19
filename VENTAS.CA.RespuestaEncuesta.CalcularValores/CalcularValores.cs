using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using System.Activities;
using Microsoft.Xrm.Sdk.Workflow;
using Microsoft.Xrm.Sdk.Query;
using Newtonsoft.Json;
using System.Collections;

namespace VENTAS.CA.RespuestaEncuesta.CalcularValores
{
    public class CalcularValores : CodeActivity
    {
        [Input("Encuesta")]
        public InArgument<string> Encuesta { get; set; }

        [Output("Respuesta")]
        [Default("")]
        public OutArgument<string> Respuesta { get; set; }

        [Output("Exito")]
        [Default("False")]
        public OutArgument<bool> Exito { get; set; }

        protected override void Execute(CodeActivityContext executionContext)
        {
            IWorkflowContext context = executionContext.GetExtension<IWorkflowContext>();
            IOrganizationServiceFactory factory = executionContext.GetExtension<IOrganizationServiceFactory>();
            IOrganizationService service = factory.CreateOrganizationService(context.UserId);
            ITracingService seguimiento = executionContext.GetExtension<ITracingService>();

            bool exitosoOut = false;
            string mensajeOut = "";

            Run(service, seguimiento, this.Encuesta.Get(executionContext), out exitosoOut, out mensajeOut);

            this.Exito.Set(executionContext, exitosoOut);
            this.Respuesta.Set(executionContext, mensajeOut);
        }

        public void Run(IOrganizationService service, ITracingService seguimiento, string idrespuestaencuesta, out bool exitosoOut, out string mensajeOut)
        {

            exitosoOut = false;
            mensajeOut = "";
            int executionSection = 0;
            string pluginName = "VENTAS.PL.RespuestaEncuesta.CalculoValores";
            int val = 0;
            bool actualizar = false;

            try
            {
                Entity respuestaEncuesta = service.Retrieve("msfp_surveyresponse", new Guid(idrespuestaencuesta), new ColumnSet(true));

                if (respuestaEncuesta != null)
                {

                    if (respuestaEncuesta.Attributes.Contains("msfp_satisfactionmetricvalue") && respuestaEncuesta.Attributes.Contains("msfp_surveyid"))
                    {

                        List<ValorMetritrica> json = JsonConvert.DeserializeObject<List<ValorMetritrica>>(respuestaEncuesta.GetAttributeValue<string>("msfp_satisfactionmetricvalue"));
                        ValorMetritrica metrica = json.Where(x => x.type == "nps").FirstOrDefault();
                        ValorMetritrica satisfaccion = json.Where(x => x.type == "csat").FirstOrDefault();

                        if (metrica != null)
                        {
                            switch (metrica.value)
                            {
                                case "detractor":
                                    val = 963540000;
                                    break;
                                case "passive":
                                    val = 963540001;
                                    break;
                                case "promoter":
                                    val = 963540002;
                                    break;
                            }
                            actualizar = true;
                        }

                        EntityReference encuesta = respuestaEncuesta.GetAttributeValue<EntityReference>("msfp_surveyid");

                        if (encuesta.Name == "Satisfacción trimestral" & respuestaEncuesta.Attributes.Contains("regardingobjectid"))
                        {
                            List<RespuestasEncuesta> listaPreguntas = new List<RespuestasEncuesta>();
                            listaPreguntas.Add(new RespuestasEncuesta() { pregunta = "¿Cuál es la probabilidad que vuelva adquirir nuestros productos y servicios?", campo = "atm_intencionrecompra" });

                            var resPregunta = ConsultarPreguntaEncuesta(service, listaPreguntas, respuestaEncuesta, encuesta);

                            EntityReference cliente = respuestaEncuesta.GetAttributeValue<EntityReference>("regardingobjectid");

                            Entity updateAccount = new Entity() { Id = cliente.Id, LogicalName = cliente.LogicalName };


                            if (metrica != null && cliente.LogicalName == "account")
                            {
                                updateAccount.Attributes.Add("atm_nps", int.Parse(metrica.decimalvalue));
                                updateAccount.Attributes.Add("atm_npscode", new OptionSetValue(val));

                                if (resPregunta.Count > 0)
                                {
                                    foreach (RespuestasEncuesta item in resPregunta)
                                    {
                                        updateAccount.Attributes.Add(item.campo, Int32.Parse(item.respuesta));
                                    }
                                }
                            }

                            if (satisfaccion != null && cliente.LogicalName == "account")
                            {
                                updateAccount.Attributes.Add("atm_csat", int.Parse(satisfaccion.decimalvalue));
                                actualizar = true;
                            }
                            if (actualizar)
                            {
                                service.Update(updateAccount);
                            }
                        }
                        if (encuesta.Name == "Satisfacción trimestral - Diligenciamiento")
                        {
                            DilgenciamientoEncuestasConRespuestaQueTienenELNit(encuesta, respuestaEncuesta, service, metrica, satisfaccion, actualizar, val);
                        }
                    }
                    else if (respuestaEncuesta.Attributes.Contains("msfp_questionresponseslist") && respuestaEncuesta.Attributes.Contains("msfp_surveyid"))
                    {
                        EntityReference encuesta = respuestaEncuesta.GetAttributeValue<EntityReference>("msfp_surveyid");
                        DilgenciamientoEncuestasConRespuestaQueTienenELNit(encuesta, respuestaEncuesta, service, null, null, false, val);
                    }
                }
            }
            catch (Exception ex)
            {
                seguimiento.Trace(ex.Message);
            }
        }


        public void DilgenciamientoEncuestasConRespuestaQueTienenELNit(EntityReference encuesta, Entity respuestaEncuesta, IOrganizationService service, ValorMetritrica metrica, ValorMetritrica satisfaccion, bool actualizar, int val)
        {
            List<RespuestasEncuesta> listaPreguntas = new List<RespuestasEncuesta>();


            if (encuesta.Name == "Satisfacción trimestral - Diligenciamiento")
            {
                Entity pregunta = ConsultaParametros("atm_nombre", "atm_parametro", "PREGUNTA-NIT-SATISFACCIONTRIMESTRALDILIGENCIAMIENTO", service);
                listaPreguntas.Add(new RespuestasEncuesta() { pregunta = pregunta.GetAttributeValue<string>("atm_valor"), campo = "atm_idcuenta" });
                listaPreguntas.Add(new RespuestasEncuesta() { pregunta = "¿Cuál es la probabilidad que vuelva adquirir nuestros productos y servicios?", campo = "atm_intencionrecompra" });
            }


            if (encuesta.Name.ToString().ToLower().Contains("encuesta cds"))
            {
                Entity pregunta = ConsultaParametros("atm_nombre", "atm_parametro", "PREGUNTA-NIT-ENCUESTACDS", service);
                listaPreguntas.Add(new RespuestasEncuesta() { pregunta = pregunta.GetAttributeValue<string>("atm_valor"), campo = "atm_idcuenta" });
            }



            var respuestaPregunta = ConsultarPreguntaEncuesta(service, listaPreguntas, respuestaEncuesta, encuesta);

            if (respuestaPregunta.Count > 0)
            {
                QueryExpression queryCuenta = new QueryExpression("account");

                foreach (RespuestasEncuesta item in respuestaPregunta)
                {
                    if (item.campo == "atm_idcuenta" && item.respuesta != null) queryCuenta.Criteria.AddCondition("atm_idcuenta", ConditionOperator.Equal, item.respuesta);
                }
                Entity cuenta = service.RetrieveMultiple(queryCuenta).Entities.FirstOrDefault();
                Entity ActualizarCuenta = new Entity("account", cuenta.Id);
                if (cuenta != null)
                {
                    Entity ActualizarEncuesta = new Entity("msfp_surveyresponse", respuestaEncuesta.Id);
                    ActualizarEncuesta.Attributes["regardingobjectid"] = cuenta.ToEntityReference();
                    service.Update(ActualizarEncuesta);

                    if (metrica != null && cuenta.LogicalName == "account")
                    {
                        ActualizarCuenta.Attributes.Add("atm_nps", int.Parse(metrica.decimalvalue));
                        ActualizarCuenta.Attributes.Add("atm_npscode", new OptionSetValue(val));

                        foreach (RespuestasEncuesta item in respuestaPregunta)
                        {
                            if ("atm_intencionrecompra" == item.campo && item.respuesta != null)
                            {
                                ActualizarCuenta.Attributes.Add(item.campo, int.Parse(item.respuesta));
                            }
                        }
                    }
                    if (satisfaccion != null && cuenta.LogicalName == "account")
                    {
                        ActualizarCuenta.Attributes.Add("atm_csat", int.Parse(satisfaccion.decimalvalue));
                        actualizar = true;
                    }

                    if (actualizar)
                    {
                        service.Update(ActualizarCuenta);
                    }
                }
            }
        }

        public List<RespuestasEncuesta> ConsultarPreguntaEncuesta(IOrganizationService service, List<RespuestasEncuesta> preguntas, Entity respuestaEncuesta, EntityReference encuesta)
        {
            string str = string.Empty;

            if (preguntas.Count > 0)
            {
                foreach (RespuestasEncuesta item in preguntas)
                {

                    str += $@"<condition attribute=""msfp_questiontext"" operator=""eq"" value=""{item.pregunta}"" />";
                }
            }

            var fetchData = new
            {
                msfp_surveyresponseid = respuestaEncuesta.Id,
                msfp_survey = encuesta.Id,
            };


            var fetchXml = $@"<?xml version=""1.0"" encoding=""utf-16""?>
                                <fetch>
                                  <entity name=""msfp_questionresponse"">
                                    <attribute name=""msfp_response"" />
                                    <filter>
                                      <condition attribute=""msfp_surveyresponseid"" operator=""eq"" value=""{fetchData.msfp_surveyresponseid/*f0188be8-2939-ee11-bdf4-6045bd3c2679*/}"" uitype=""msfp_surveyresponse"" />
                                    </filter>
                                    <link-entity name=""msfp_question"" from=""msfp_questionid"" to=""msfp_questionid"" alias=""question"">
                                      <attribute name=""msfp_questiontext"" />
                                      <attribute name=""msfp_questionid"" />
                                      <attribute name=""msfp_name"" />
                                      <filter type=""or"">
                                        {str}
                                      </filter>
                                    </link-entity>
                                  </entity>
                                </fetch>";

            EntityCollection res = service.RetrieveMultiple(new FetchExpression(fetchXml));

            List<RespuestasEncuesta> list = new List<RespuestasEncuesta>();

            if (res.Entities.Count > 0)
            {
                foreach (Entity entidad in res.Entities)
                {
                    foreach (RespuestasEncuesta pregunta in preguntas)
                    {
                        if (pregunta.pregunta == (string)entidad.GetAttributeValue<AliasedValue>("question.msfp_questiontext").Value)
                        {
                            list.Add(new RespuestasEncuesta() { pregunta = pregunta.pregunta, respuesta = entidad.GetAttributeValue<string>("msfp_response"), campo = pregunta.campo });
                        }
                    }
                }
            }
            return list;
        }

        public class ValorMetritrica
        {
            public Guid id { get; set; }
            public string type { get; set; }
            public string value { get; set; }
            public string decimalvalue { get; set; }
        }

        public class RespuestasEncuesta
        {
            public string pregunta { get; set; }
            public string respuesta { get; set; }
            public string campo { get; set; }
        }

        public Entity ConsultaParametros(string parametro, string entidad, string dato, IOrganizationService service)
        {
            EntityCollection registro = null;

            QueryExpression query = new QueryExpression(entidad);
            query.ColumnSet.AllColumns = true;
            query.Criteria.AddCondition(parametro, ConditionOperator.Equal, dato);

            registro = service.RetrieveMultiple(query);

            return registro.Entities.FirstOrDefault();
        }
    }
}
