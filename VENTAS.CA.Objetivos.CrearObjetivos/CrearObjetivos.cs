using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Activities;
using System.Net.Http;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Workflow;
using Newtonsoft.Json;
using Microsoft.Xrm.Sdk.Metadata;
using VENTAS.CA.Objetivos.CrearObjetivos.Helper.Principal;


namespace VENTAS.CA.Objetivos.CrearObjetivos
{

    public class CrearObjetivos : CodeActivity
    {
        [Input("Objetivos")]
        public InArgument<string> Objetivos { get; set; }

        [Input("TipoObjetivo")]
        public InArgument<string> TipoObjetivo { get; set; }


        [Output("Exito")]
        [Default("False")]
        public OutArgument<bool> Exito { get; set; }

        [Output("Respuesta")]
        [Default("")]
        public OutArgument<string> Respuesta { get; set; }

        protected override void Execute(CodeActivityContext executionContext)
        {
            IWorkflowContext context = executionContext.GetExtension<IWorkflowContext>();
            IOrganizationServiceFactory factory = executionContext.GetExtension<IOrganizationServiceFactory>();
            IOrganizationService services = factory.CreateOrganizationService(context.UserId);
            ITracingService tracingServices = executionContext.GetExtension<ITracingService>();

            bool exitosoOut = false;
            string respuestaOut = "";

            Run(services, this.Objetivos.Get(executionContext), this.TipoObjetivo.Get(executionContext), tracingServices, out exitosoOut, out respuestaOut);

            this.Exito.Set(executionContext, exitosoOut);
            this.Respuesta.Set(executionContext, respuestaOut);
        }
        public void Run(IOrganizationService services, string objetivos, string tipoObjetivos, ITracingService seguimiento, out bool exitoso, out string respuesta)
        {
            string pluginName = "VENTAS.CA.Objetivos.CrearObjetivos";
            int executionSection = 10;
            exitoso = true;
            respuesta = "";
            try
            {
                List<Modelo> listadoDeObjetivos = JsonConvert.DeserializeObject<List<Modelo>>(objetivos);
                List<TipoObjetivo> listaTipoObjetivo = JsonConvert.DeserializeObject<List<TipoObjetivo>>(tipoObjetivos);
                Principal principal = new Principal();
                principal.ValidarObjetivos(listadoDeObjetivos, listaTipoObjetivo, services, seguimiento, out exitoso, out respuesta);
            }
            catch (Exception ex)
            {
                exitoso = false;
                respuesta = string.Format("Error: {0} - ({1}) Execution Section {2}", ex.Message, pluginName, executionSection.ToString());
                if (seguimiento != null) seguimiento.Trace("Error " + ex.Message);
            }
        }
    }
}
