using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk.Workflow;
using System;
using System.Activities;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;

namespace VENTAS.CA.InvitacionEncuestaCustomerVoice.EnviarCorreo
{
    public class EnviarCorreoEncuestaFallida : CodeActivity
    {
        [Input("Encuesta")]
        [ReferenceTarget("msfp_surveyinvite")]
        public InArgument<EntityReference> Encuesta { get; set; }

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

            Run(service, this.Encuesta.Get(executionContext), seguimiento, out exitosoOut, out mensajeOut);

            this.Exito.Set(executionContext, exitosoOut);
            this.Mensaje.Set(executionContext, mensajeOut);
        }

        public void Run(IOrganizationService service, EntityReference refHijo, ITracingService seguimiento, out bool exito, out string mensaje)
        {
            exito = true;
            mensaje = "";
            int executionSection = 0;
            string pluginName = "VENTAS.CA.InvitacionDeEncuesta.EnviarCorreo";


            try
            {
                Entity encuesta = service.Retrieve(refHijo.LogicalName, refHijo.Id, new ColumnSet(new string[] { "to", "msfp_invitefailurereason", "regardingobjectid" }));

                if (encuesta.Contains("msfp_invitefailurereason") && encuesta.GetAttributeValue<OptionSetValue>("msfp_invitefailurereason").Value != 413190013)
                {

                    executionSection = 1;

                    if (encuesta.Contains("regardingobjectid"))
                    {
                        executionSection = 2;
                        EntityReference entidad = encuesta.GetAttributeValue<EntityReference>("regardingobjectid");
                        if (entidad.LogicalName == "account")
                        {
                            string nombrePlantillaCuenta = "PlantillaNotificacionAsesor-CorreoFallido-Cuenta";
                            var (cuenta,usuario) = Query(service, entidad.LogicalName.ToString(),"accountid", encuesta);
                            EnviarMensajeDeCorreo(service,cuenta,usuario,seguimiento, nombrePlantillaCuenta, out exito,out mensaje);
                        }
                        else if (entidad.LogicalName == "contact")
                        {

                            string nombrePlantillaContacto = "PlantillaNotificacionAsesor-CorreoFallido";
                            var (contacto, usuario) = Query(service, entidad.LogicalName.ToString(),"contactid", encuesta);
                            EnviarMensajeDeCorreo(service, contacto, usuario, seguimiento, nombrePlantillaContacto,out exito, out mensaje);
                        }
                        executionSection = 3;
                    }
                }
            }
            catch (Exception ex)
            {
                exito = false;
                mensaje = string.Format("Error: {0} - ({1}) Execution Section {2}", ex.Message, pluginName, executionSection.ToString());
                if (seguimiento != null) seguimiento.Trace("Error " + ex.Message);
            }
        }


        public (Entity,Entity) Query(IOrganizationService service, string entidad, string campo, Entity encuesta)
        {
            QueryExpression query = new QueryExpression(entidad);
            query.Criteria.AddCondition(campo, ConditionOperator.Equal, encuesta.GetAttributeValue<EntityReference>("regardingobjectid").Id);
            LinkEntity registro = query.AddLink("owner", "ownerid", "ownerid");
            registro.EntityAlias = entidad;
            registro.Columns.AddColumns("name", "ownerid");

            Entity res = service.RetrieveMultiple(query).Entities.FirstOrDefault();

            Entity systemUserId = new Entity() { Id = (Guid)res.GetAttributeValue<AliasedValue>($"{entidad}.ownerid").Value, LogicalName = "systemuser" };

            Entity crearEntidad = new Entity() { Id = res.Id, LogicalName = res.LogicalName };

            return (crearEntidad,systemUserId);
        }

        public void EnviarMensajeDeCorreo(IOrganizationService service, Entity entidaEnvio, Entity usuario, ITracingService seguimiento,string nombrePlantilla, out bool exito, out string mensaje)
        {
            string pluginName = "VENTAS.CA.InvitacionDeEncuesta.EnviarCorreo";
            int executionSection = 4;
            exito = true;
            mensaje = "";
            try
            {
                QueryExpression plantilla = new QueryExpression("template");
                plantilla.ColumnSet = new ColumnSet(false);
                plantilla.Criteria.AddCondition("title", ConditionOperator.Equal,nombrePlantilla);
                Entity plantillacorreo = service.RetrieveMultiple(plantilla).Entities.FirstOrDefault();

                InstantiateTemplateRequest instantiateTemplateRequest = new InstantiateTemplateRequest
                {
                    TemplateId = plantillacorreo.Id,
                    ObjectId = entidaEnvio.Id,
                    ObjectType = entidaEnvio.LogicalName
                };

                InstantiateTemplateResponse instantiateTemplateResponse = (InstantiateTemplateResponse)service.Execute(instantiateTemplateRequest);

                Entity email = instantiateTemplateResponse.EntityCollection.Entities.FirstOrDefault();

                email["regardingobjectid"] = entidaEnvio.ToEntityReference();
                email["from"] = new Entity[] { new Entity("activityparty") { Attributes = new AttributeCollection() { new KeyValuePair<string, object>("partyid", usuario.ToEntityReference()) } } };
                email["to"] = new Entity[] { new Entity("activityparty") { Attributes = new AttributeCollection() { new KeyValuePair<string, object>("partyid", usuario.ToEntityReference()) } } };
                email["ownerid"] = usuario.ToEntityReference();

                Guid idEmail = service.Create(email);
                SendEmailRequest request = new SendEmailRequest();
                request.EmailId = idEmail;
                request.IssueSend = true;
                request.TrackingToken = "";
                service.Execute(request);

            }
            catch (Exception ex)
            {
                exito = false;
                mensaje = string.Format("Error: {0} - ({1}) Execution Section {2}", ex.Message, pluginName, executionSection.ToString());
                if (seguimiento != null) seguimiento.Trace("Error " + ex.Message);
            }
        }
    }



}
