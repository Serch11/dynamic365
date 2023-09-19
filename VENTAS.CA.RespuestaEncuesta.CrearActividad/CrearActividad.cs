using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk.Workflow;
using Newtonsoft.Json;
using System;
using System.Activities;
using System.Collections.Generic;
using System.Linq;

namespace VENTAS.CA.RespuestaEncuesta.CrearActividad
{
    public class CrearActividad : CodeActivity
    {

        [Input("Referencia")]
        [ReferenceTarget("msfp_surveyresponse")]
        public InArgument<EntityReference> Referencia { get; set; }

        [Output("Exito")]
        [Default("False")]
        public OutArgument<bool> Exito { get; set; }

        [Output("Mensaje")]
        [Default("")]
        public OutArgument<string> Mensaje { get; set; }



        protected override void Execute(CodeActivityContext executionContext)
        {
            IWorkflowContext context = executionContext.GetExtension<IWorkflowContext>();
            IOrganizationServiceFactory factory = executionContext.GetExtension<IOrganizationServiceFactory>();
            IOrganizationService service = factory.CreateOrganizationService(context.UserId);
            ITracingService seguimiento = executionContext.GetExtension<ITracingService>();

            bool exitosoOut = false;
            string mensajeOut = "";

            Run(service, this.Referencia.Get(executionContext).Id.ToString(), seguimiento, out exitosoOut, out mensajeOut);

            this.Exito.Set(executionContext, exitosoOut);
            this.Mensaje.Set(executionContext, mensajeOut);
        }

        public void Run(IOrganizationService service, string reference, ITracingService seguimiento, out bool exito, out string mensaje)
        {
            exito = true;
            mensaje = "";
            int executionSection = 0;

            try
            {
                executionSection = 1;
                Entity RespuestaEncuesta = service.Retrieve("msfp_surveyresponse", new Guid(reference), new ColumnSet(true));

                if (RespuestaEncuesta.Contains("msfp_npsscore") || RespuestaEncuesta.Contains("msfp_satisfactionmetricvalue"))
                {
                    List<msfp_satisfactionmetricvalue> metricas = null;
                    msfp_satisfactionmetricvalue csat = null;
                    msfp_satisfactionmetricvalue nps = null;

                    if (RespuestaEncuesta.Contains("msfp_satisfactionmetricvalue"))
                    {
                        metricas = JsonConvert.DeserializeObject<List<msfp_satisfactionmetricvalue>>(RespuestaEncuesta.GetAttributeValue<string>("msfp_satisfactionmetricvalue"));
                        csat = metricas.Where(x => x.type == "csat").FirstOrDefault();
                        nps = metricas.Where(x => x.type == "nps").FirstOrDefault();
                    }

                    executionSection = 2;

                    if ((csat != null && int.Parse(csat?.value) < 3) || RespuestaEncuesta.GetAttributeValue<int>("msfp_npsscore") < 7 || nps?.value == "detractor")
                    {
                        executionSection = 3;
                        //Consultar Equipo
                        FilterExpression fe = new FilterExpression();
                        fe.AddCondition("name", ConditionOperator.Equal, "Automundial - Servicio al cliente");

                        QueryExpression consultaEquipo = new QueryExpression()
                        {
                            EntityName = "team",
                            NoLock = true,
                            Criteria = fe
                        };

                        Entity resultadoEquipo = service.RetrieveMultiple(consultaEquipo).Entities.FirstOrDefault();

                        executionSection = 4;
                        Entity newActividad = new Entity() { LogicalName = "phonecall" };
                        newActividad.Attributes.Add("atm_tipollamadacode", new OptionSetValue(963540010));
                        newActividad.Attributes.Add("directioncode", true);
                        newActividad.Attributes.Add("description", "Llamada de seguimiento SAC como respuesta a un evento de insatisfacción.");

                        if (RespuestaEncuesta.Attributes.Contains("msfp_surveyid"))
                        {
                            EntityReference regardingobjectid = RespuestaEncuesta.GetAttributeValue<EntityReference>("regardingobjectid");
                            string nombre = regardingobjectid != null ? regardingobjectid.Name : "";
                            if (RespuestaEncuesta.Contains("regardingobjectid"))
                            {
                                newActividad.Attributes.Add("regardingobjectid", regardingobjectid);
                            }
                            newActividad.Attributes.Add("subject", "Seguimiento SAC " + nombre);
                            newActividad.Attributes.Add("to", regardingobjectid);
                        }
                        else
                        {
                            newActividad.Attributes.Add("subject", "Seguimiento SAC");
                        }

                        newActividad.Attributes.Add("scheduledend", DateTime.Now.AddDays(2));
                        newActividad.Attributes.Add("ownerid", resultadoEquipo.ToEntityReference());

                        Guid idAct = service.Create(newActividad);

                        executionSection = 5;
                        //Consultar Cola
                        QueryExpression consultaCola = new QueryExpression()
                        {
                            EntityName = "queue",
                            ColumnSet = new ColumnSet(new string[] { "name" }),
                            NoLock = true,
                            Criteria = fe
                        };

                        Entity resultadoCola = service.RetrieveMultiple(consultaCola).Entities.FirstOrDefault();

                        executionSection = 6;
                        //Agregamos la actividad a la cola
                        AddToQueueRequest QueueRequest = new AddToQueueRequest()
                        {
                            Target = new EntityReference() { Id = idAct, LogicalName = "phonecall" },
                            DestinationQueueId = resultadoCola.Id
                        };

                        AddToQueueResponse res = (AddToQueueResponse)service.Execute(QueueRequest);
                        executionSection = 7;
                    }
                }
            }
            catch (InvalidPluginExecutionException e)
            {
                exito = false;
                mensaje = e.Message;

                if (seguimiento != null) { seguimiento.Trace("Error: " + e.Message); }
                throw new InvalidPluginExecutionException(string.Format("Error: {0} - Execution Section {1}", e.Message, executionSection.ToString()), e);

            }
        }

        private class msfp_satisfactionmetricvalue
        {
            public Guid id { get; set; }
            public string type { get; set; }
            public string value { get; set; }
            public decimal decimalValue { get; set; }
        }
    }
}
