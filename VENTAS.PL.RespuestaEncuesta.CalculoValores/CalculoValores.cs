using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.PL.RespuestaEncuesta.CalculoValores
{
    public class CalculoValores : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {

            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(null); // se coloca null para que se ejecute como SYSTEM

            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            try
            {
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
            catch (Exception ex)
            {
                seguimiento.Trace("VENTAS.PL.RespuestaEncuesta" + " - " + ex.Message);
            }
        }

        public void Run(IOrganizationService service, Entity entity, ITracingService seguimiento)
        {
            int executionSection = 0;
            string pluginName = "VENTAS.PL.RespuestaEncuesta.CalculoValores";
            int val = 0;
            bool actualizar = false;
            try
            {

                if (entity.Contains("msfp_satisfactionmetricvalue") && entity.Attributes.Contains("msfp_surveyid"))
                {
                    List<ValorMetritrica> json = JsonConvert.DeserializeObject<List<ValorMetritrica>>(entity.GetAttributeValue<string>("msfp_satisfactionmetricvalue"));
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


                    EntityReference encuesta = entity.GetAttributeValue<EntityReference>("msfp_surveyid");


                    if (encuesta.Name == "Satisfacción trimestral" & entity.Attributes.Contains("regardingobjectid"))
                    {
                        EntityReference cliente = entity.GetAttributeValue<EntityReference>("regardingobjectid");

                        Entity updateAccount = new Entity() { Id = cliente.Id, LogicalName = cliente.LogicalName };

                        if (metrica != null && cliente.LogicalName == "account")
                        {
                            updateAccount.Attributes.Add("atm_nps", int.Parse(metrica.decimalvalue));
                            updateAccount.Attributes.Add("atm_npscode", new OptionSetValue(val));
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

                        string pregunta = "Por favor digite documento de identificación de la cuenta (NIT/RUC/CC) como cliente de Automundial";

                        QueryExpression query = new QueryExpression("msfp_questionresponse");
                        query.ColumnSet.AllColumns = true;
                        query.Criteria.AddCondition("msfp_surveyresponseid", ConditionOperator.Equal, entity.Id);


                        var query_msfp_question = query.AddLink("msfp_question", "msfp_questionid", "msfp_questionid");
                        query_msfp_question.LinkCriteria.AddCondition("msfp_survey", ConditionOperator.Equal, encuesta.Id);
                        query_msfp_question.LinkCriteria.AddCondition("msfp_name", ConditionOperator.Equal, pregunta);

                        Entity respuestaPregunta = service.RetrieveMultiple(query).Entities.FirstOrDefault();

                        if (respuestaPregunta != null && respuestaPregunta.Contains("msfp_response"))
                        {
                            QueryExpression queryCuenta = new QueryExpression("account");
                            queryCuenta.Criteria.AddCondition("atm_idcuenta", ConditionOperator.Equal, respuestaPregunta.GetAttributeValue<string>("msfp_response"));
                            Entity cuenta = service.RetrieveMultiple(queryCuenta).Entities.FirstOrDefault();
                            Entity ActualizarCuenta = new Entity("account", cuenta.Id);
                            if (cuenta != null)
                            {
                                Entity ActualizarEncuesta = new Entity("msfp_surveyresponse", entity.Id);
                                ActualizarEncuesta.Attributes["regardingobjectid"] = cuenta.ToEntityReference();
                                service.Update(ActualizarEncuesta);

                                if (metrica != null && cuenta.LogicalName == "account")
                                {

                                    ActualizarCuenta.Attributes.Add("atm_nps", int.Parse(metrica.decimalvalue));
                                    ActualizarCuenta.Attributes.Add("atm_npscode", new OptionSetValue(val));
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

                }
            }
            catch (Exception e)
            {
                if (seguimiento != null) { seguimiento.Trace("Error: " + e.Message); }
                throw new InvalidPluginExecutionException(string.Format("Error: {0} - ({1}) Execution Section {2}", e.Message, pluginName, executionSection.ToString()), e);
            }
        }

        public class ValorMetritrica
        {
            public Guid id { get; set; }
            public string type { get; set; }
            public string value { get; set; }
            public string decimalvalue { get; set; }
        }
    }
}
