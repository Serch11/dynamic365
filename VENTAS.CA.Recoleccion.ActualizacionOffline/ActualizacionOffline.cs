using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Workflow;
using System.Activities;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;

namespace VENTAS.CA.Recoleccion.ActualizacionOffline
{
    public class ActualizacionOffline : CodeActivity
    {
        [Input("Recoleccion")]
        //[ReferenceTarget("atm_recoleccion")]
        public InArgument<string> Recoleccion { get; set; }

        [Output("Mensaje")]
        public OutArgument<string> Mensaje { get; set; }

        [Output("Exito")]
        public OutArgument<bool> Exito { get; set; }

        protected override void Execute(CodeActivityContext executionContext)
        {
            bool exitosoOut = false;
            string mensajeOut = "";
            try
            {
                IWorkflowContext context = executionContext.GetExtension<IWorkflowContext>();
                IOrganizationServiceFactory factory = executionContext.GetExtension<IOrganizationServiceFactory>();
                IOrganizationService service = factory.CreateOrganizationService(context.UserId);
                ITracingService seguimiento = executionContext.GetExtension<ITracingService>();


                Run(service, this.Recoleccion.Get(executionContext), seguimiento, out mensajeOut, out exitosoOut);


                this.Mensaje.Set(executionContext, mensajeOut);
                this.Exito.Set(executionContext, exitosoOut);

            }
            catch (Exception ex)
            {
                mensajeOut = ex.Message.ToString();
                throw new InvalidPluginExecutionException(ex.Message.ToString());
            }
        }

        public void Run(IOrganizationService service, string recoleccion, ITracingService seguimiento, out string mensajeOut, out bool exitosoOut)
        {
            mensajeOut = "";
            exitosoOut = true;
            try
            {
                Guid recoleccionid = new Guid(recoleccion);
                string atrr = string.Empty;

                //crear consecutivo recoleccion
                Entity Recoleccion = service.Retrieve("atm_recoleccion", recoleccionid, new ColumnSet(true));

                EntityReference recoleccionregarding = Recoleccion.GetAttributeValue<EntityReference>("regardingobjectid");
                EntityReference autor = Recoleccion.GetAttributeValue<EntityReference>("createdby");

                Entity regarding = service.Retrieve(recoleccionregarding.LogicalName, recoleccionregarding.Id, new ColumnSet(true));

                QueryExpression query = new QueryExpression("atm_recoleccion");
                query.ColumnSet.AddColumn("activityid");
                query.Criteria.AddCondition("activitytypecode", ConditionOperator.Equal, 10578);
                query.Criteria.AddCondition("regardingobjectid", ConditionOperator.Equal, recoleccionregarding.Id);

                EntityCollection actAsociadas = service.RetrieveMultiple(query);

                Entity RecoleccionUpdate = new Entity("atm_recoleccion", recoleccionid);

                string idregarding = regarding.LogicalName == "account" ? regarding.GetAttributeValue<string>("atm_idcuenta") : regarding.GetAttributeValue<string>("atm_consecutivo");

                string subject = $"AR_{idregarding}_{actAsociadas.Entities.Count + 1}".ToUpper();
                RecoleccionUpdate.Attributes.Add("subject", subject);

                service.Update(RecoleccionUpdate);

                if (Recoleccion.Contains("requiredattendees") && Recoleccion.GetAttributeValue<EntityCollection>("requiredattendees").Entities.Count > 0)
                {
                    EntityCollection requiredattendees = Recoleccion.GetAttributeValue<EntityCollection>("requiredattendees");
                    List<Entity> usuariosToRef = new List<Entity>();
                    Entity regional = null;
                    if (recoleccion.Contains("atm_regionalid"))
                    {
                        regional = service.Retrieve(regional.GetAttributeValue<EntityReference>("atm_regionalid").LogicalName, regional.GetAttributeValue<EntityReference>("atm_regionalid").Id,new ColumnSet("atm_responsabledelogistica"));
                        if (regional.Contains("atm_responsabledelogistica"))
                        {
                            usuariosToRef.Add(new Entity("activityparty") 
                            {
                                ["addressused"] = regional.GetAttributeValue<string>("atm_responsabledelogistica")
                            });
                        }

                    }
                    foreach (Entity item in requiredattendees.Entities)
                    {
                        usuariosToRef.Add(item);
                    }
                    Entity plantilla = obtenerPlantilla(service, "PlantillaNotificacionAR-CreacionActividad");
                    enviarCorreo(service, plantilla, Recoleccion.ToEntityReference(), autor, usuariosToRef.ToArray(), regarding.ToEntityReference());
                }
            }
            catch (Exception ex)
            {
                exitosoOut = false;
                mensajeOut = ex.Message;

                if (seguimiento != null) { seguimiento.Trace("Error: " + ex.Message); }
                throw new InvalidPluginExecutionException(ex.Message);
            }
        }


        private static void enviarCorreo(IOrganizationService service, Entity plantilla, EntityReference entRec, EntityReference usuarioFromRef, Entity[] usuarioToRef, EntityReference entAcc)
        {
            try
            {
                List<Entity> listaUsuarios = new List<Entity>();

                foreach (var item in usuarioToRef)
                {
                    var usuario = item.GetAttributeValue<EntityReference>("partyid");
                    listaUsuarios.Add(new Entity("activityparty") { Attributes = new AttributeCollection() { new KeyValuePair<string, object>("partyid", usuario) } });
                }

                InstantiateTemplateRequest instantiateTemplateRequest = new InstantiateTemplateRequest
                {
                    TemplateId = plantilla.Id,
                    ObjectId = entRec.Id,
                    ObjectType = entRec.LogicalName
                };

                InstantiateTemplateResponse instantiateTemplateResponse = (InstantiateTemplateResponse)service.Execute(instantiateTemplateRequest);

                Entity email = instantiateTemplateResponse.EntityCollection.Entities.FirstOrDefault();

                //Entity[] array = new Entity[] { new Entity("activityparty") { Attributes = new AttributeCollection() { new KeyValuePair<string, object>("partyid", usuarioFromRef) }},
                //                                 new Entity("activityparty") { Attributes = new AttributeCollection() { new KeyValuePair<string, object>("partyid", karem) }}
                //                                        };

                if (email != null)
                {
                    email["regardingobjectid"] = entAcc;
                    email["from"] = new Entity[] { new Entity("activityparty") { Attributes = new AttributeCollection() { new KeyValuePair<string, object>("partyid", usuarioFromRef) } } };
                    email["to"] = listaUsuarios.ToArray().Cast<Entity>();

                    Guid idEmail = service.Create(email);
                    SendEmailRequest request = new SendEmailRequest();
                    request.EmailId = idEmail;
                    request.IssueSend = true;
                    request.TrackingToken = "";
                    service.Execute(request);
                }
            }
            catch (Exception e)
            {
                throw new InvalidPluginExecutionException($"Error enviando correo: { e.Message } ", e);
            }
        }

        private static Entity obtenerPlantilla(IOrganizationService service, string nombrePlantilla)
        {
            QueryExpression query = new QueryExpression("template");
            query.ColumnSet = new ColumnSet(false);
            query.Criteria.AddCondition("title", ConditionOperator.Equal, nombrePlantilla);

            EntityCollection result = service.RetrieveMultiple(query);

            return result.Entities.FirstOrDefault();
        }
    }
}
