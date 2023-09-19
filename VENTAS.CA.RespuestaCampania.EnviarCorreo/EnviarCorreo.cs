using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using Microsoft.Crm.Sdk;
using System.Activities;
using Microsoft.Xrm.Sdk.Workflow;
using Newtonsoft.Json;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;
using ATM.Utilidades;
using ATM.Utilidades.Responses;

namespace VENTAS.CA.RespuestaCampania.EnviarCorreo
{
    public class EnviarCorreo : CodeActivity
    {

        [Input("ResCampania")]
        public InArgument<string> ResCampania { get; set; }

        [Input("Plantilla")]
        public InArgument<string> Plantilla { get; set; }

        [Output("Mensaje")]
        //[Default("")]
        public OutArgument<string> Mensaje { get; set; }

        [Output("Exito")]
        //[Default("False")]
        public OutArgument<bool> Exito { get; set; }


        protected override void Execute(CodeActivityContext executioncontext)
        {
            IWorkflowContext context = executioncontext.GetExtension<IWorkflowContext>();
            IOrganizationServiceFactory factory = executioncontext.GetExtension<IOrganizationServiceFactory>();
            IOrganizationService service = factory.CreateOrganizationService(context.UserId);
            ITracingService seguimiento = executioncontext.GetExtension<ITracingService>();


            bool exitosoOut = false;
            string respuestaOut = "";

            Run(service, seguimiento, this.ResCampania.Get(executioncontext), new Guid(this.Plantilla.Get(executioncontext)), out exitosoOut, out respuestaOut);

            this.Mensaje.Set(executioncontext, respuestaOut);
            this.Exito.Set(executioncontext, exitosoOut);
        }

        public void Run(IOrganizationService service, ITracingService seguimiento, string respuestacampain, Guid plantillaid, out bool exitosoOut, out string respuestaOut)
        {
            Utilidades util = new Utilidades(service);
            List<Entity> listnew = new List<Entity>();
            List<Entity> listacampanias = ConsultarRegistros(JsonConvert.DeserializeObject<List<Guid>>(respuestacampain), service);
            string nombreCA = "VENTAS.CA.RespuestaCampania.EnviarCorreo";
            exitosoOut = true;
            respuestaOut = "";

            try
            {
                
                if (listacampanias.Count > 0)
                {
                    foreach (Entity item in listacampanias)
                    {
                        InstantiateTemplateRequest instantiateTemplateRequest = new InstantiateTemplateRequest
                        {
                            TemplateId = plantillaid,
                            ObjectId = item.Id,
                            ObjectType = item.LogicalName
                        };

                        InstantiateTemplateResponse instantiateTemplateResponse = (InstantiateTemplateResponse)service.Execute(instantiateTemplateRequest);

                        EntityCollection sender = new EntityCollection();
                        sender.Entities.Add(new Entity("activityparty")
                        {
                            ["addressused"] = item.GetAttributeValue<string>("emailaddress")
                        });

                        Entity email = instantiateTemplateResponse.EntityCollection.Entities.FirstOrDefault();

                        email["from"] = new Entity[] { new Entity("activityparty") { Attributes = new AttributeCollection() { new KeyValuePair<string, object>("partyid", item.GetAttributeValue<EntityReference>("ownerid")) } } };
                        email["to"] = sender;
                        email["ownerid"] = item.GetAttributeValue<EntityReference>("ownerid");
                        email["createdby"] = item.GetAttributeValue<EntityReference>("ownerid");

                        if (item.Contains("customer") && item.GetAttributeValue<EntityCollection>("customer").Entities.Count > 0)
                        {
                            var data = crearUsuariosActivityParty(item.GetAttributeValue<EntityCollection>("customer"));
                            email["to"] = data.registros;
                            email["regardingobjectid"] = data.registro;
                        }

                        Guid idEmail = service.Create(email);
                        SendEmailRequest request = new SendEmailRequest();
                        request.EmailId = idEmail;
                        request.IssueSend = true;
                        request.TrackingToken = "";
                        var res = service.Execute(request);
                        
                        if(res != null)
                        {
                            listnew.Add(email);
                        }
                    }

                    Object result = new
                    {
                        cantcorreoenviados = listnew.Count,
                        cantcorreosnoenviados = listacampanias.Count - listnew.Count
                    };
                    respuestaOut = JsonConvert.SerializeObject(result);
                }
            }
            catch (Exception ex)
            {
                exitosoOut = false;
                seguimiento.Trace(nombreCA + " " + ex.Message.ToString());
                Object result = new
                {
                    error = ex.Message.ToString(),
                    cantcorreosnoenviados = listacampanias.Count - listnew.Count
                };
                respuestaOut = JsonConvert.SerializeObject(result);
                throw new InvalidPluginExecutionException(ex.Message);
            }
        }

        public List<Entity> ConsultarRegistros(List<Guid> registros, IOrganizationService service)
        {
            List<Entity> lista = new List<Entity>();
            if (registros.Count > 0)
            {
                foreach (var item in registros)
                {
                    lista.Add(service.Retrieve("campaignresponse", item, new ColumnSet(true)));
                }
            }
            return lista;
        }


        public RetornoPartys crearUsuariosActivityParty(EntityCollection lista)
        {
            List<Entity> listaUsuarios = new List<Entity>();
            EntityReference usuario = null;

            foreach (var item in lista.Entities)
            {
                usuario = item.GetAttributeValue<EntityReference>("partyid");
                listaUsuarios.Add(new Entity("activityparty") { Attributes = new AttributeCollection() { new KeyValuePair<string, object>("partyid", usuario) } });
            }

            return new RetornoPartys() { registros = new EntityCollection(listaUsuarios), registro = usuario };
        }

        public class RetornoPartys
        {
            public EntityCollection registros { get; set; }
            public EntityReference registro { get; set; }
        }
    }
}
