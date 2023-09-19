using ATM.Utilidades;
using ATM.Utilidades.Responses;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk.Workflow;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Activities;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Net;
using System.Net.Http;
using System.Runtime.ConstrainedExecution;
using System.Security.Policy;
using System.Text;

namespace VENTAS.CA.ElementoListaPrecio.CargarProductos
{
    public class CargarProducto : CodeActivity
    {
        [Input("ListaPrecio")]
        //[ReferenceTarget("pricelevel")]
        public InArgument<string> ListaPrecio { get; set; }

        [Input("Productos")]
        public InArgument<string> Productos { get; set; }

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

            Run(service, this.ListaPrecio.Get(executionContext), this.Productos.Get(executionContext), seguimiento, out exitosoOut, out mensajeOut);

            this.Exito.Set(executionContext, exitosoOut);
            this.Mensaje.Set(executionContext, mensajeOut);
        }

        public void Run(IOrganizationService service, string Lista, string Productos, ITracingService seguimiento, out bool exito, out string mensaje)
        {
            API API = new API();
            Utilidades util = new Utilidades(service);

            exito = true;
            mensaje = "";
            string pluginName = "VENTAS.CA.ElementoListaPrecio.CargarProductos";

            try
            {
                List<DataExcel> productos = JsonConvert.DeserializeObject<List<DataExcel>>(Productos);

                EjecutarAF(util, Lista, productos);
            }
            catch (Exception ex)
            {
                mensaje = $"Error inexperado: {ex.Message} en {pluginName}";
                exito = false;
            }
        }

        private async void EjecutarAF(Utilidades util, string Lista, List<DataExcel> Productos)
        {

            List<ConditionExpression> lc = new List<ConditionExpression>
            {
                new ConditionExpression("atm_nombre", ConditionOperator.Equal, "CONECTARAF")
            };

            var parametros = util.ConsultarMultiplesRegistros(util.CrearConsulta("atm_parametro", new string[] { "atm_valor" }, lc));
            string[] parametro = parametros[0].GetAttributeValue<string>("atm_valor").Split(',');
            CargarProductosRequest cpr = new CargarProductosRequest()
            {
                Ambiente = parametro[0],
                Usuario = parametro[1],
                Contrasena = parametro[2],
                ListaPrecio = Lista,
                Productos = Productos,
                Propietario = "4b94b9f8-ba22-ec11-b6e6-002248375fc3"
            };


            //using (var client = new HttpClient())
            //{
            //    var message = client.PostAsync($"{parametro[3]}api/CargarProductoListaPrecio",
            //        new StringContent(JsonConvert.SerializeObject(cpr), Encoding.UTF8, "application/json")).GetAwaiter().GetResult();

            //    var content = message.Content.ReadAsStringAsync().GetAwaiter().GetResult();
            //    Console.Write(content);
            //}

            var client = new HttpClient
            {
                BaseAddress = new Uri(parametro[3])
            };
            var content = new StringContent(JsonConvert.SerializeObject(cpr), Encoding.UTF8, "application/json");
            HttpResponseMessage responseMessage = await client.PostAsync("api/CargarProductoListaPrecio?", content);
            responseMessage.EnsureSuccessStatusCode();

            //using (var wb = new WebClient())
            //{
            //    var data = new NameValueCollection();
            //    data["Ambiente"] = parametro[0];
            //    data["Usuario"] = parametro[1];
            //    data["Contrasena"] = parametro[2];
            //    data["ListaPrecio"] = Lista;
            //    data["Productos"] = Productos;
            //    data["Propietario"] = "4b94b9f8-ba22-ec11-b6e6-002248375fc3";

            //    var response = wb.UploadValues($"{parametro[3]}api/CargarProductoListaPrecio", "POST", data);
            //    string responseInString = Encoding.UTF8.GetString(response);
            //}
            //await API.POST<RespuestaAF>($"{parametro[3]}api/CargarProductoListaPrecio", cpr).ConfigureAwait(true);
        }

        private class DataExcel
        {
            public string A { get; set; }
            public decimal B { get; set; }
            public bool existe { get; set; }
            public Guid idProd { get; set; }
        }

        private class CargarProductosRequest
        {
            public string Propietario { get; set; }
            public string Ambiente { get; set; }
            public string Usuario { get; set; }
            public string Contrasena { get; set; }
            public string ListaPrecio { get; set; }
            public List<DataExcel> Productos { get; set; }
        }
    }
}
