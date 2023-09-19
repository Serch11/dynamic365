using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;
using Newtonsoft.Json;
using VENTAS.AF.Automundial.Helpers;
using VENTAS.AF.Automundial.Models;

namespace VENTAS.AF.Automundial
{
    public static class AF_Cuenta
    {
        private static Conexion con;
        private static Utilidades utilidades;

        [FunctionName("CompartirRegistros")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "CompartirRegistros")] HttpRequestMessage req, TraceWriter log)
        {
            try
            {
                CompartirRegistrosRequest data = await utilidades.ConvertirRequest<CompartirRegistrosRequest>(req);
                con = new Conexion(data.Ambiente, data.Usuario, data.Contrasena);
                IOrganizationService service = con.getCRMConn();

                EntityReference refHijo = new EntityReference() { Id = data.IdHijo, LogicalName = "account" };

                Entity cuentaHijo = service.Retrieve(refHijo.LogicalName, refHijo.Id, new ColumnSet(new string[] { "parentaccountid", "ownerid" }));

                if (cuentaHijo.Contains("parentaccountid"))
                {
                    Entity cuentaPadre = service.Retrieve("account", cuentaHijo.GetAttributeValue<EntityReference>("parentaccountid").Id, new ColumnSet("ownerid"));

                    EntityReference userHijo = cuentaHijo.GetAttributeValue<EntityReference>("ownerid");
                    EntityReference userPadre = cuentaPadre.GetAttributeValue<EntityReference>("ownerid");

                    if (userHijo.Id != userPadre.Id)
                    {
                        //se comparte la cuenta hija con el propietario padre
                        //se comparte la cuenta padre con el propietario del hijo
                        utilidades.ShareRecords(cuentaHijo.ToEntityReference(), userPadre, cuentaPadre.ToEntityReference(), userHijo);
                    }

                    QueryExpression teamQE = new QueryExpression() { EntityName = "team" };
                    teamQE.ColumnSet = new ColumnSet(new string[] { "teamid", "name" });
                    teamQE.Criteria.AddCondition("name", ConditionOperator.Equal, "Directores Regionales");

                    EntityCollection teams = service.RetrieveMultiple(teamQE);

                    if (teams.Entities.Count > 0)
                    {
                        //Se comparte el padre con el grupo de directores
                        QueryExpression usersTeamQE = new QueryExpression("systemuser");
                        usersTeamQE.ColumnSet.AllColumns = true;
                        var query_teammembership = usersTeamQE.AddLink("teammembership", "systemuserid", "systemuserid");
                        query_teammembership.LinkCriteria.AddCondition("teamid", ConditionOperator.Equal, teams.Entities[0].Id);

                        EntityCollection usersTeam = service.RetrieveMultiple(usersTeamQE);

                        if (usersTeam.Entities.Count > 0)
                            utilidades.ShareRecordsMultiple(cuentaPadre.ToEntityReference(), usersTeam);
                    }
                }

                return req.CreateResponse(HttpStatusCode.OK, "Permisos asignados");
            }
            catch (Exception e)
            {
                return req.CreateResponse(HttpStatusCode.InternalServerError, "Error No Controlado: " + e.Message);
            }
        }

        [FunctionName("EliminarActividadesCambioAsesor")]
        public static async Task<HttpResponseMessage> EliminarActividadesCambioAsesor([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "EliminarActividadesCambioAsesor")] HttpRequestMessage req, TraceWriter log)
        {
            try
            {
                EliminarActiCambioAsesorRequest data = await utilidades.ConvertirRequest<EliminarActiCambioAsesorRequest>(req);
                con = new Conexion(data.Ambiente, data.Usuario, data.Contrasena);
                IOrganizationService service = con.getCRMConn();

                foreach (Cuenta entity in data.Cuentas)
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


                    foreach (Actividad act in entity.Actividades)
                    {
                        //Eliminamos actividades abiertas
                        if (act.Estado == 0 && act.Propietario == entity.Propietario)
                        {
                            DeleteRequest deleteRequest = new DeleteRequest()
                            {
                                Target = new EntityReference() { Id = act.Id, LogicalName = act.LogicalName }
                            };
                            multipleRequest.Requests.Add(deleteRequest);
                        }
                        else
                        //cambiamos propietarios actividades abiertas
                        {
                            AssignRequest assignRequest = new AssignRequest()
                            {
                                Assignee = new EntityReference(act.LogicalNamePropietario, act.Propietario),
                                Target = new EntityReference() { Id = act.Id, LogicalName = act.LogicalName }
                            };
                            multipleRequest.Requests.Add(assignRequest);
                        }
                    }

                    ExecuteMultipleResponse multipleResponse = (ExecuteMultipleResponse)service.Execute(multipleRequest);
                }

                return req.CreateResponse(HttpStatusCode.OK, new ReturnResponse() { Correcto = true, Mensaje = "Cuantes actualizadas" });
            }
            catch (Exception e)
            {
                return req.CreateResponse(HttpStatusCode.InternalServerError, new ReturnResponse() { Correcto = false, Mensaje = "Error No Controlado: " + e.Message });
            }
        }

        [FunctionName("MigrarCuentasSICE")]
        public static async Task<HttpResponseMessage> MigrarCuentasSICE([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "MigrarCuentasSICE")] HttpRequestMessage req, TraceWriter log)
        {
            try
            {
                MigrarCuentasSICERequest data = await utilidades.ConvertirRequest<MigrarCuentasSICERequest>(req);
                con = new Conexion(data.Ambiente, data.Usuario, data.Contrasena);
                IOrganizationService service = con.getCRMConn();
                utilidades = new Utilidades(service);

                HttpClient client = new HttpClient();
                string content = await client.GetStringAsync(data.URL);
                OutPut respuestaApi = JsonConvert.DeserializeObject<OutPut>(content);

                //Traemos las cuentas
                var Cuentas = utilidades.ConsultarMultiplesRegistros(
                        utilidades.CrearConsulta(
                            "account",
                            new string[] { "atm_idcuenta" }
                            ));

                //Traemos los usuarios
                var Usuarios = utilidades.ConsultarMultiplesRegistros(
                        utilidades.CrearConsulta(
                            "systemuser",
                            new string[] { "systemuserid", "fullname", "firstname", "lastname", "domainname" }
                            ));

                foreach (CuentaSICERequest clienteSICE in respuestaApi.output)
                {
                    //Buscamos el ID de la cuenta si existe
                    Entity idCuenta = Cuentas.Where(x => x.GetAttributeValue<string>("atm_idcuenta") == clienteSICE.customer_code).FirstOrDefault();

                    Entity cuentaCRM = new Entity() { LogicalName = "account" };

                    if (idCuenta != null)
                    {
                        cuentaCRM.Id = idCuenta.Id;
                    }
                    else
                    {
                        //cuentaCRM.Attributes.Add("createdby", clienteSICE.email);
                        cuentaCRM.Attributes.Add("overriddecreatedon", clienteSICE.creation_date);
                    }

                    cuentaCRM.Attributes.Add("atm_codigoasesor", clienteSICE.seller_code);
                    cuentaCRM.Attributes.Add("atm_correofacturacionelectronica", clienteSICE.email_fe);
                    cuentaCRM.Attributes.Add("atm_fechaultimafacturacion", clienteSICE.last_invoice_date);
                    cuentaCRM.Attributes.Add("atm_idcuenta", clienteSICE.customer_code);
                    cuentaCRM.Attributes.Add("emailaddress1", clienteSICE.email);
                    cuentaCRM.Attributes.Add("fax", clienteSICE.fax_number);
                    cuentaCRM.Attributes.Add("name", clienteSICE.complete_name);
                    cuentaCRM.Attributes.Add("telephone1", clienteSICE.phone);
                    cuentaCRM.Attributes.Add("telephone2", clienteSICE.mobile_number);
                    cuentaCRM.Attributes.Add("telephone3", clienteSICE.phone2);

                    cuentaCRM.Attributes.Add("atm_fechaultimaactualizacionclientesise", clienteSICE.actualization_date);

                    //segmento
                    var atm_semsicecode = utilidades.ValidarOpcion(utilidades.ObtenerOpciones(service, "atm_semsicecode"), clienteSICE.customer_type, "Nombre");
                    if (atm_semsicecode != null)
                        cuentaCRM.Attributes.Add("atm_semsicecode", new OptionSetValue(atm_semsicecode.Codigo));


                    //regimen contributivo
                    if (clienteSICE.contributory_name != null)
                    {
                        if(Enum.IsDefined(typeof(ERegimenContributivo), clienteSICE.contributory_name.Replace(" ", "")))
                        {
                            var number = (int)((ERegimenContributivo)Enum.Parse(typeof(ERegimenContributivo), clienteSICE.contributory_name.Replace(" ", "")));
                            cuentaCRM.Attributes.Add("atm_regimencontributivocode", new OptionSetValue(number));
                        }
                    }

                    service.Update(cuentaCRM);
                }

                return req.CreateResponse(HttpStatusCode.OK, new ReturnResponse() { Correcto = true, Mensaje = "Cuentas migradas con éxito" });
            }
            catch (Exception e)
            {
                return req.CreateResponse(HttpStatusCode.InternalServerError, new ReturnResponse() { Correcto = false, Mensaje = "Error No Controlado: " + e.Message });
            }
        }
    }
}
