using ATM.Utilidades.Responses;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ATM.Utilidades
{
    public class Utilidades
    {
        IOrganizationService servicio;

        public Utilidades(IOrganizationService _service)
        {
            servicio = _service;
        }

        public void CompartirRegistros(EntityReference entityRef, EntityReference segmentUser, bool read = false)
        {
            AccessRights AccessRights = new AccessRights();

            if (read)
            {
                AccessRights = AccessRights.ReadAccess;
            }
            else
            {
                AccessRights = AccessRights.ReadAccess |
                                 AccessRights.WriteAccess |
                                 AccessRights.AppendToAccess |
                                 AccessRights.AppendAccess;
            }

            var grantAccessRequest = new GrantAccessRequest
            {
                PrincipalAccess = new PrincipalAccess
                {
                    AccessMask = AccessRights,
                    Principal = segmentUser
                },
                Target = entityRef
            };
            servicio.Execute(grantAccessRequest);
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

        public List<Entity> ConsultarMultiplesEntidadesFetch(string fetch)
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

        public ExecuteMultipleResponse EjecutarGuardadoMultiple(List<Entity> lista)
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
            return (ExecuteMultipleResponse)servicio.Execute(multipleRequest);
        }

        public Entity ConsultarRegistro(string entidad, Guid id, string[] campos)
        {
            return servicio.Retrieve(entidad, id, new ColumnSet(campos));
        }

        public ErroresResponse EnviarCorreoMasivoSinPlantilla(List<Entity> lista)
        {
            ErroresResponse errores = new ErroresResponse();

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
                        Guid idEmail = (Guid)email.Response.Results.Values.First();

                        SendEmailRequest sendEmailRequest = new SendEmailRequest
                        {
                            EmailId = idEmail,
                            TrackingToken = "",
                            IssueSend = true
                        };

                        SendEmailResponse sendEmailresp = (SendEmailResponse)servicio.Execute(sendEmailRequest);
                    }
                    catch (Exception e)
                    {
                        errores.ErroresEnvioCorreo.Add(new DescripcionError() { Mensaje = $"Error enviando correo: {e.Message}" });
                    }
                }
            }
            catch (Exception e)
            {
                errores.ErroresGenerales.Add(new DescripcionError() { Mensaje = $"Error no controlado enviando correo: {e.Message}" });
            }

            return errores;
        }
    }
}