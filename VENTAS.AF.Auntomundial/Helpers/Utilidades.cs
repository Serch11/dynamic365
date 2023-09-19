using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Metadata;
using Microsoft.Xrm.Sdk.Query;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Services.Description;
using VENTAS.AF.Automundial.Models;

namespace VENTAS.AF.Automundial.Helpers
{
    public class Utilidades
    {
        private IOrganizationService servicio;
        public Errores errores = new Errores();

        public Utilidades() { }

        public Utilidades(IOrganizationService _service)
        {
            servicio = _service;
        }

        public void ShareRecords(EntityReference cuentaHijoRef, EntityReference userPadre, EntityReference cuentaPadreRef, EntityReference userHijo)
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


            GrantAccessRequest grantAccessRequest = new GrantAccessRequest
            {
                PrincipalAccess = new PrincipalAccess
                {
                    AccessMask = AccessRights.ReadAccess |
                             AccessRights.WriteAccess |
                             AccessRights.AppendToAccess |
                             AccessRights.AppendAccess,
                    Principal = userPadre
                },
                Target = cuentaHijoRef
            };

            multipleRequest.Requests.Add(grantAccessRequest);

            grantAccessRequest = new GrantAccessRequest
            {
                PrincipalAccess = new PrincipalAccess
                {
                    AccessMask = AccessRights.ReadAccess |
                             AccessRights.WriteAccess |
                             AccessRights.AppendToAccess |
                             AccessRights.AppendAccess,
                    Principal = userHijo
                },
                Target = cuentaPadreRef
            };
            multipleRequest.Requests.Add(grantAccessRequest);

            ExecuteMultipleResponse multipleResponse = (ExecuteMultipleResponse)servicio.Execute(multipleRequest);
        }

        public void ShareRecordsMultiple(EntityReference entityRef, EntityCollection users)
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

            foreach (var user in users.Entities)
            {
                GrantAccessRequest grantAccessRequest = new GrantAccessRequest
                {
                    PrincipalAccess = new PrincipalAccess
                    {
                        AccessMask = AccessRights.ReadAccess,
                        Principal = user.ToEntityReference()
                    },
                    Target = entityRef
                };

                multipleRequest.Requests.Add(grantAccessRequest);
            }

            ExecuteMultipleResponse multipleResponse = (ExecuteMultipleResponse)servicio.Execute(multipleRequest);
        }

        public async Task<T> ConvertirRequest<T>(HttpRequestMessage req)
        {
            T data;
            string body = await req.Content.ReadAsStringAsync();
            data = JsonConvert.DeserializeObject<T>(body);
            return data;
        }

        public Entity ConsultarRegistro(string entidad, Guid id, string[] campos)
        {
            return servicio.Retrieve(entidad, id, new ColumnSet(campos));
        }

        public List<Entity> ConsultarMultiplesRegistros(QueryExpression QE)
        {
            EntityCollection resp;
            var pageNumber = 1;
            var pagingCookie = string.Empty;
            var resultado = new List<Entity>();

            do
            {
                if (pageNumber != 1)
                {
                    QE.PageInfo.PageNumber = pageNumber;
                    QE.PageInfo.PagingCookie = pagingCookie;
                }

                resp = servicio.RetrieveMultiple(QE);

                if (resp.MoreRecords)
                {
                    pageNumber++;
                    pagingCookie = resp.PagingCookie;
                }

                resultado.AddRange(resp.Entities);
            }
            while (resp.MoreRecords);

            return resultado;
        }

        public List<Entity> ConsultarMultiplesRegistrosFetch(string fetch)
        {
            var moreRecords = false;
            int page = 1;
            var cookie = string.Empty;
            List<Entity> Entities = new List<Entity>();

            do
            {
                var xml = string.Format(fetch, cookie);
                var collection = servicio.RetrieveMultiple(new FetchExpression(xml));
                if (collection.Entities.Count >= 0)
                    Entities.AddRange(collection.Entities);

                moreRecords = collection.MoreRecords;

                if (moreRecords)
                {
                    page++;
                    cookie = string.Format("paging-cookie='{0}' page='{1}'", System.Security.SecurityElement.Escape(collection.PagingCookie), page);
                }

            } while (moreRecords);

            return Entities;
        }

        public void EjecutarGuardadoMultiple(List<Entity> lista)
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

            foreach (var entidad in lista)
                {
                var createRequest = new CreateRequest()
                {
                    Target = entidad
                };

                multipleRequest.Requests.Add(createRequest);
            }
            ExecuteMultipleResponse multipleResponse = (ExecuteMultipleResponse)servicio.Execute(multipleRequest);
        }

        public QueryExpression CrearConsulta(string entidad, string[] campos, List<ConditionExpression> condiciones = null)
        {
            QueryExpression QE = new QueryExpression(entidad)
            {
                ColumnSet = new ColumnSet(campos),
                NoLock = true,
            };

            foreach (var condicion in condiciones)
            {
                QE.Criteria.AddCondition(condicion);
            }
            return QE;
        }

        public OptionList ValidarOpcion(List<OptionList> optionList, string opcion, string tipo)
        {
            return optionList.Where(x => tipo == "Nombre" ? x.Nombre == opcion : x.Codigo == int.Parse(opcion)).FirstOrDefault();
        }

        public List<OptionList> ObtenerOpciones(IOrganizationService Service, string LogicalName)
        {
            List<OptionList> optionList = new List<OptionList>();
            var attributeRequest = new RetrieveAttributeRequest
            {
                EntityLogicalName = "account",
                LogicalName = LogicalName,
                RetrieveAsIfPublished = true
            };

            RetrieveAttributeResponse response = (RetrieveAttributeResponse)Service.Execute(attributeRequest);
            EnumAttributeMetadata attributeData = (EnumAttributeMetadata)response.AttributeMetadata;
            optionList = (from option in attributeData.OptionSet.Options
                          select new OptionList(
                                           option.Value.Value,
                                           option.Label.UserLocalizedLabel.Label)).ToList();
            return optionList;
        }

        public Entity ObtenerPlantilla(string nombrePlantilla)
        {
            QueryExpression query = new QueryExpression("template");
            query.ColumnSet = new ColumnSet(true);
            query.Criteria.AddCondition("title", ConditionOperator.Equal, nombrePlantilla);

            EntityCollection result = servicio.RetrieveMultiple(query);

            return result.Entities.FirstOrDefault();
        }

        public void EnviarCorreoMasivoSinPlantilla(List<Entity> lista)
        {
            try
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

                foreach (var entidad in lista)
                {
                    var createRequest = new CreateRequest()
                    {
                        Target = entidad
                    };

                    multipleRequest.Requests.Add(createRequest);
                }

                ExecuteMultipleResponse multipleResponse = (ExecuteMultipleResponse)servicio.Execute(multipleRequest);

                foreach (var email in multipleResponse.Responses)
                {
                    try
                    {
                        if (email.Response != null)
                        {
                            Guid idEmail = (Guid)email.Response.Results.Values.First();

                            SendEmailRequest sendEmailRequest = new SendEmailRequest
                            {
                                EmailId = idEmail,
                                TrackingToken = "",
                                IssueSend = true
                            };

                            SendEmailResponse sendEmailresp = (SendEmailResponse)servicio.Execute(sendEmailRequest);
                        }                        
                    }
                    catch(Exception e) {
                        errores.ErroresEnvioCorreo.Add(new DescripcionError() { Mensaje = $"Error enviando correo: {e.Message}" });
                    }
                }
            }
            catch (Exception e)
            {
                errores.ErroresGenerales.Add(new DescripcionError() { Mensaje = $"Error no controlado enviando correo: {e.Message}" });
            }
        }

        public void CrearNotificacion(string titulo, string mensaje, EntityReference propietario, OptionSetValue tipo )
        {
            Entity notificacion = new Entity() { LogicalName = "appnotification" };
            notificacion.Attributes.Add("title", titulo);
            notificacion.Attributes.Add("body", mensaje);
            notificacion.Attributes.Add("ownerid", propietario);
            notificacion.Attributes.Add("icontype", tipo);
            notificacion.Attributes.Add("toasttype", new OptionSetValue(200000000));
            servicio.Create(notificacion);
        }
    }
}
