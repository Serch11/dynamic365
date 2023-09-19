using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk.Workflow;
using Newtonsoft.Json;
using System;
using System.Activities;
using System.Net.Http;
using System.Text;

namespace VENTAS.CA.Cuenta.CompartirRegistros
{
    public class CompartirRegistros : CodeActivity
    {
        [Input("Cuenta")]
        [ReferenceTarget("account")]
        public InArgument<EntityReference> Cuenta { get; set; }

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

            Run(service, this.Cuenta.Get(executionContext), seguimiento, out exitosoOut, out mensajeOut);

            this.Exito.Set(executionContext, exitosoOut);
            this.Mensaje.Set(executionContext, mensajeOut);
        }


        public void Run(IOrganizationService service, EntityReference refHijo, ITracingService seguimiento, out bool exito, out string mensaje)
        {
            exito = true;
            mensaje = "";
            int executionSection = 0;
            string pluginName = "VENTAS.CA.Cuenta.CompartirRegistros";
            try
            {
                Entity cuentaHijo = service.Retrieve(refHijo.LogicalName, refHijo.Id, new ColumnSet(new string[] { "parentaccountid", "ownerid" }));

                QueryExpression consultaParamero = new QueryExpression() { EntityName = "atm_parametro" };
                consultaParamero.NoLock = true;
                consultaParamero.ColumnSet = new ColumnSet(new string[] { "atm_valor" });
                consultaParamero.Criteria.AddCondition("atm_nombre", ConditionOperator.Equal, "CONECTARAF");

                Entity resultadoParametros = service.RetrieveMultiple(consultaParamero).Entities[0];

                if (resultadoParametros != null)
                {
                    string[] parm = resultadoParametros.GetAttributeValue<string>("atm_valor").Split(',');

                    CompartirRegistrosR crr = new CompartirRegistrosR()
                    {
                        Ambiente = parm[0],
                        Usuario = parm[1],
                        Contrasena = parm[2],
                        IdHijo = cuentaHijo.Id
                    };
                    EjecutarAF(crr, parm[3]);
                }             
            }
            catch (Exception e)
            {
                if (seguimiento != null) { seguimiento.Trace("Error: " + e.Message); }
                exito = false;
                mensaje = string.Format("Error: {0} - ({1}) Execution Section {2}", e.Message, pluginName, executionSection.ToString());
            }
        }

        private async void EjecutarAF(CompartirRegistrosR crr, string URL)
        {
            
            var client = new HttpClient();
            client.BaseAddress = new Uri(URL);

            var content = new StringContent(JsonConvert.SerializeObject(crr), Encoding.UTF8, "application/json");

            HttpResponseMessage responseMessage = await client.PostAsync("api/CompartirRegistros?", content);

            responseMessage.EnsureSuccessStatusCode();
        }

        private class CompartirRegistrosR
        {
            public string Ambiente { get; set; }
            public string Usuario { get; set; }
            public string Contrasena { get; set; }
            public Guid IdHijo { get; set; }
        }
    }
}
