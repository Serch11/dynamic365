using ATM.Utilidades;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk.Workflow;
using Newtonsoft.Json;
using System;
using System.Activities;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.CA.Actividad.RegistroEnvioMensajeWhatsApp
{
    public class GuardarRegistro : CodeActivity
    {
        [Input("Cuentas")]
        public InArgument<string> Cuentas { get; set; }

        [Input("Tipo")]
        public InArgument<string> Tipo { get; set; }

        [Input("Flujo")]
        public InArgument<string> Flujo { get; set; }

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

            Run(service, this.Cuentas.Get(executionContext), this.Tipo.Get(executionContext), this.Flujo.Get(executionContext), seguimiento, out exitosoOut, out mensajeOut);

            this.Exito.Set(executionContext, exitosoOut);
            this.Mensaje.Set(executionContext, mensajeOut);
        }

        public void Run(IOrganizationService service, string Cuentas, string tipo, string flujo, ITracingService seguimiento, out bool exito, out string mensaje)
        {
            Utilidades util = new Utilidades(service);
            exito = true;
            mensaje = "";
            string pluginName = "VENTAS.CA.Actividad.RegistroEnvioMensajeWhatsApp";
            List<Guid> valores = JsonConvert.DeserializeObject<List<Guid>>(Cuentas);

            try
            {
                List<ConditionExpression> lc = new List<ConditionExpression>();
                lc.Add(new ConditionExpression("atm_nombre", ConditionOperator.Equal, flujo));

                var atm_flujo = util.ConsultarMultiplesRegistros(util.CrearConsulta("atm_flujoterceros", new string[] { }, lc));

                if (atm_flujo.Count > 0)
                {
                    List<Entity> lista = new List<Entity>();
                    foreach (Guid item in valores)
                    {
                        Entity cuenta = util.ConsultarRegistro(tipo, item, new string[] { "ownerid" });
                        Entity act = new Entity() { LogicalName = "atm_registroenviomensajewhatsapp" };
                        act.Attributes.Add("regardingobjectid", new EntityReference() { Id = item, LogicalName = tipo });
                        act.Attributes.Add("subject", $"Envio de mensaje masivo - {DateTime.Now}");
                        act.Attributes.Add("atm_flujoid", atm_flujo[0].ToEntityReference());
                        act.Attributes.Add("scheduledend", DateTime.Now);
                        act.Attributes.Add("ownerid", cuenta.GetAttributeValue<EntityReference>("ownerid"));
                        lista.Add(act);
                    }

                    if (lista.Count > 0)
                    {
                        util.EjecutarGuardadoMultiple(lista);
                    }
                }
                else
                {
                    exito = false;
                    throw new InvalidPluginExecutionException("No se encuentra el flujo en CRM...");
                }
            }
            catch (Exception ex)
            {
                mensaje = "Error inexperado: " + ex.Message + " en " + pluginName;
                exito = false;
            }
        }

    }
}
