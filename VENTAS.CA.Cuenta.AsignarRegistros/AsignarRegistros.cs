using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk.Workflow;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Activities;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;

namespace VENTAS.CA.Cuenta.AsignarRegistros
{
    public class AsignarRegistros : CodeActivity
    {
        [Input("Cuentas")]
        //[RequiredArgument]
        public InArgument<string> Cuentas { get; set; }

        [Input("Correo")]
        //[RequiredArgument]
        public InArgument<string> Correo { get; set; }

        [Output("Exito")]
        [Default("False")]
        public OutArgument<bool> Exito { get; set; }

        [Output("Mensaje")]
        [Default("")]
        public OutArgument<string> Mensaje { get; set; }

        [Output("Respuesta")]
        [Default("")]
        public OutArgument<string> Respuesta { get; set; }

        protected override void Execute(CodeActivityContext executionContext)
        {
            IWorkflowContext context = executionContext.GetExtension<IWorkflowContext>();
            IOrganizationServiceFactory factory = executionContext.GetExtension<IOrganizationServiceFactory>();
            IOrganizationService service = factory.CreateOrganizationService(context.UserId);
            ITracingService seguimiento = executionContext.GetExtension<ITracingService>();

            bool exitosoOut = false;
            string mensajeOut = "";
            string respuestaOut = "";

            Run(service, this.Cuentas.Get(executionContext), this.Correo.Get(executionContext), seguimiento, out exitosoOut, out mensajeOut, out respuestaOut);

            this.Exito.Set(executionContext, exitosoOut);
            this.Mensaje.Set(executionContext, mensajeOut);
            this.Respuesta.Set(executionContext, respuestaOut);
        }

        public void Run(IOrganizationService service, string ids, string asesor, ITracingService seguimiento, out bool exitoso, out string mensaje, out string respuesta)
        {
            //int executionSection = 0;
            //string customActivityName = "VENTAS.CA.Cuenta.AsignarRegistros";
            exitoso = true;
            mensaje = "";
            respuesta = "";
            string URL = string.Empty;
            try
            {
                //Buscamos el usuario
                QueryExpression consultaUser = new QueryExpression() { EntityName = "systemuser" };
                consultaUser.NoLock = true;
                consultaUser.ColumnSet.AddColumns("systemuserid", "atm_paisid", "domainname");
                consultaUser.Criteria.AddCondition("domainname", ConditionOperator.Equal, asesor);

                Entity user = service.RetrieveMultiple(consultaUser).Entities.FirstOrDefault();


                if (!user.Attributes.Contains("atm_paisid"))
                {
                    throw new InvalidPluginExecutionException("El usuario al que desea asignar los registros no tiene asignado un país válido");
                }

                List<Guid> listId = JsonConvert.DeserializeObject<List<Guid>>(ids);

                string fetchquery = @"<fetch version='1.0' output-format='xml-platform' mapping='logical' no-lock='false' distinct='true'>
                                        <entity name='account'><attribute name='name'/>
                                            <attribute name='atm_idcuenta'/>
                                            <attribute name='ownerid'/>
                                            <attribute name='accountid'/>
                                            <filter type='and'>
                                                <condition attribute='accountid' operator='in'>";

                listId.ForEach((x) =>
                {
                    fetchquery += "<value uitype='account'>{" + x.ToString() + "}</value>";
                });

                fetchquery += @"</condition>
                                        </filter>
                                    </entity>
                                </fetch>";

                EntityCollection accounts = service.RetrieveMultiple(new FetchExpression(fetchquery));

                if (ValidarRolUsuario(user, accounts.Entities[0].ToEntityReference(), service))
                {
                    //Llamar el API de duvar
                    List<string> cuentas = new List<string>();
                    foreach (Entity ent in accounts.Entities)
                    {
                        if (ent.Contains("atm_idcuenta"))
                        {
                            cuentas.Add(ent.GetAttributeValue<string>("atm_idcuenta"));
                        }
                        else
                        {
                            throw new InvalidPluginExecutionException("Existe una cuenta en el listado que desea actualizar que no tiene un nit válido");
                        }
                    }

                    Asesor Asesor = new Asesor()
                    {
                        Correo = user.GetAttributeValue<string>("domainname"),
                        Pais = user.GetAttributeValue<EntityReference>("atm_paisid").Name.Substring(0, 3)
                    };

                    SendData data = new SendData() { cuentas = cuentas.ToArray() };

                    //Consultar Parametro
                    FilterExpression fe = new FilterExpression();
                    fe.AddCondition("atm_nombre", ConditionOperator.Equal, "URLAPIACTUALIZACIONCLIENTESSICE");

                    QueryExpression consultaParamero = new QueryExpression()
                    {
                        EntityName = "atm_parametro",
                        NoLock = true,
                        ColumnSet = new ColumnSet(new string[] { "atm_valor" }),
                        Criteria = fe
                    };

                    Entity resultadoParametros = service.RetrieveMultiple(consultaParamero).Entities[0];

                    URL = string.Format(resultadoParametros.GetAttributeValue<string>("atm_valor"), Asesor.Pais, Asesor.Correo);

                    //consulta API
                    RestClient client = new RestClient(URL);

                    RestRequest request = new RestRequest()
                    {
                        Method = Method.Patch
                    };
                    request.AddHeader("Content-Type", "application/json");
                    request.AddJsonBody(data);

                    RestResponse response = client.Execute(request);

                    var respuestaApi = JsonConvert.DeserializeObject<RespuestaApi>(response.Content);
                    if (string.IsNullOrEmpty(respuestaApi.output.error))
                    {
                        EntityCollection newAccounts = new EntityCollection();
                        List<Cuenta> CuentasAct = new List<Cuenta>();

                        foreach (Entity acc in accounts.Entities)
                        {
                            clientes_error dato = respuestaApi.output.clientes_error.Where(x => x.nit == acc.GetAttributeValue<string>("atm_idcuenta")).FirstOrDefault();
                            if (dato == null)
                            {
                                newAccounts.Entities.Add(acc);
                                CuentasAct.Add(new Cuenta()
                                {
                                    Actividades = ConsultarActividades(service, acc.Id),
                                    Propietario = acc.GetAttributeValue<EntityReference>("ownerid").Id
                                });
                            }
                        }

                        if (newAccounts.Entities.Count > 0)
                        {
                            ActualizarCuentas(service, newAccounts, user);
                            EjecutarAF(service, CuentasAct);
                        }
                    }

                    respuesta = JsonConvert.SerializeObject(respuestaApi.output);
                }
                else
                {
                    exitoso = false;
                    mensaje = "El usuario no tiene un rol asignado, o no tiene permisos sobre la entidad de Cuentas";
                    throw new InvalidPluginExecutionException(mensaje);
                }
            }
            catch (InvalidPluginExecutionException e)
            {
                exitoso = false;
                mensaje = e.Message;

                if (seguimiento != null) { seguimiento.Trace("Error: " + e.Message); }
                throw new InvalidPluginExecutionException(e.Message);
            }
        }

        private void ActualizarCuentas(IOrganizationService service, EntityCollection cuentas, Entity usuario)
        {
            ExecuteMultipleRequest multipleRequest = new ExecuteMultipleRequest()
            {
                Settings = new ExecuteMultipleSettings()
                {
                    ContinueOnError = true,
                    ReturnResponses = true
                },
                Requests = new OrganizationRequestCollection()
            };

            foreach (var cuenta in cuentas.Entities)
            {
                AssignRequest assignRequest = new AssignRequest();
                assignRequest.Assignee = new EntityReference("systemuser", usuario.Id);
                assignRequest.Target = new EntityReference(cuenta.LogicalName, cuenta.Id);
                multipleRequest.Requests.Add(assignRequest);
            }
            ExecuteMultipleResponse multipleResponse = (ExecuteMultipleResponse)service.Execute(multipleRequest);
        }

        public bool ValidarRolUsuario(Entity usuario, EntityReference accounts, IOrganizationService service)
        {
            bool hasroles = false;
            RetrievePrincipalAccessRequest retrievePrincipalAccess = new RetrievePrincipalAccessRequest();
            retrievePrincipalAccess.Principal = usuario.ToEntityReference();
            retrievePrincipalAccess.Target = accounts; RetrievePrincipalAccessResponse accessResponse = (RetrievePrincipalAccessResponse)service.Execute(retrievePrincipalAccess);
            if (accessResponse.AccessRights != AccessRights.None)
            {
                hasroles = true;
            }
            return hasroles;
        }

        private async void EjecutarAF(IOrganizationService service, List<Cuenta> cuentas)
        {
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
                    Cuentas = cuentas
                };

                var client = new HttpClient();
                client.BaseAddress = new Uri(parm[3]);
                var content = new StringContent(JsonConvert.SerializeObject(crr), Encoding.UTF8, "application/json");
                HttpResponseMessage responseMessage = await client.PostAsync("api/EliminarActividadesCambioAsesor?", content);

                responseMessage.EnsureSuccessStatusCode();
            }
        }

        public List<Actividad> ConsultarActividades(IOrganizationService service, Guid cuenta)
        {
            List<Actividad> entRef = new List<Actividad>();

            QueryExpression consAct = new QueryExpression("activitypointer");
            consAct.Distinct = true;
            consAct.NoLock = true;
            consAct.ColumnSet.AddColumns("activityid", "activitytypecode", "ownerid", "statecode");
            //consAct.Criteria.AddCondition("ownerid", ConditionOperator.Equal, propietario);
            consAct.Criteria.AddCondition("regardingobjectid", ConditionOperator.Equal, cuenta);
            consAct.Criteria.AddCondition("activitytypecode", ConditionOperator.In, 4212, 4210, 4201); // Tareas, Llamadas, Citas
            //consAct.Criteria.AddCondition("statecode", ConditionOperator.Equal, 0);

            foreach (Entity ent in service.RetrieveMultiple(consAct).Entities)
            {
                entRef.Add(new Actividad()
                {
                    Id = ent.Id,
                    LogicalName = ent.GetAttributeValue<string>("activitytypecode"),
                    Propietario = ent.GetAttributeValue<EntityReference>("ownerid").Id,
                    LogicalNamePropietario = ent.GetAttributeValue<EntityReference>("ownerid").LogicalName,
                    Estado = ent.GetAttributeValue<OptionSetValue>("statecode").Value
                });
            }

            return entRef;
        }


        #region Llamado API DUVAR
        private class SendData
        {
            public string[] cuentas { get; set; }
        }

        private class RespuestaApi
        {
            public output output { get; set; }
        }

        private class output
        {
            public string error { get; set; }
            public int clientes_actualizados { get; set; }
            public List<clientes_error> clientes_error { get; set; }
        }

        private class clientes_error
        {
            public string nit { get; set; }
            public string message { get; set; }
        }

        private class Asesor
        {
            public string Correo { get; set; }
            public string Pais { get; set; }
        }
        #endregion

        #region LlamarAZ
        public class CompartirRegistrosR
        {
            public string Ambiente { get; set; }
            public string Usuario { get; set; }
            public string Contrasena { get; set; }
            public List<Cuenta> Cuentas { get; set; }
        }

        public class Cuenta
        {
            public List<Actividad> Actividades { get; set; }
            public Guid Propietario { get; set; }
        }

        public class Actividad
        {
            public Guid Id { get; set; }
            public string LogicalName { get; set; }
            public Guid Propietario { get; set; }
            public string LogicalNamePropietario { get; set; }
            public int Estado { get; set; }

        }
        #endregion
    }
}