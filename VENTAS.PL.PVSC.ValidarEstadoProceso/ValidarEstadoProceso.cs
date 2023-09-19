using Microsoft.Crm.Sdk.Messages;
using Microsoft.SharePoint.Client;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.PL.PVSC.ValidarEstadoProceso
{
    public class ValidarEstadoProceso : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(null); //Se coloca null para que se ejecute como SYSTEM

            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            Entity targetEntity = null;


            if (context.MessageName == "Update")
            {
                targetEntity = context.PostEntityImages["postImage"];
            }

            if (targetEntity != null)
                Run(service, targetEntity, seguimiento);
        }

        public void Run(IOrganizationService service, Entity reference, ITracingService seguimiento)
        {
            string pluginName = "VENTAS.PL.PVSC.ValidarEstadoProceso";
            string SEM = string.Empty;
            try
            {

                if (seguimiento != null) { seguimiento.Trace(string.Format("Inicia ejecución PL: {0}", pluginName)); }

                //Buscamos la solicitud de crédito
                Entity SC = service.Retrieve("atm_solicitudcredito", reference.GetAttributeValue<EntityReference>("bpf_atm_solicitudcreditoid").Id, new ColumnSet(true));

                var autor = SC.GetAttributeValue<EntityReference>("createdby");
                var propietarioact = SC.GetAttributeValue<EntityReference>("ownerid");

                string fase = reference.GetAttributeValue<EntityReference>("activestageid").Name;

                Entity updateSC = new Entity() { Id = SC.Id, LogicalName = SC.LogicalName };

                if (fase == "Solicitud")
                {
                    if (!SC.Contains("atm_razondevolucion"))
                    {
                        throw new InvalidPluginExecutionException("Debe diligenciar la razón de la devolución");
                    }
                    else
                    {
                        updateSC.Attributes.Add("ownerid", autor);
                        updateSC.Attributes.Add("atm_faseactivacode", new OptionSetValue(963540000));
                        service.Update(updateSC);

                        //Se envia correo electronico
                        Entity plantilla = obtenerPlantilla(service, "PlantillaNotificacionSC-SolicitudDevuelta");
                        if (plantilla != null)
                        {
                            enviarCorreo(service, plantilla, SC.ToEntityReference(), propietarioact, autor);
                        }
                        else
                        {
                            throw new InvalidPluginExecutionException("¡No se encuentra la plantilla PlantillaNotificacionSC-SolicitudDevuelta!");
                        }
                    }
                }
                else if (fase == "Revisión De Documentos")
                {
                    bool valor = true;

                    EntityReference account = SC.GetAttributeValue<EntityReference>("atm_accountid");

                    Entity atm_accountid = service.Retrieve(
                        "account",
                        account.Id,
                        new ColumnSet(new string[] { "atm_regimencontributivocode", "atm_semsicecode" }));

                    QueryExpression consultaDocumentoCredito = new QueryExpression() { EntityName = "atm_documentocredito" };
                    consultaDocumentoCredito.NoLock = true;
                    consultaDocumentoCredito.Criteria.AddCondition("statecode", ConditionOperator.Equal, 0);
                    consultaDocumentoCredito.Criteria.AddCondition("atm_solicitudcreditoid", ConditionOperator.Equal, SC.Id);

                    LinkEntity linkTipoDocumento = new LinkEntity(
                        linkFromEntityName: "atm_documentocredito",
                        linkToEntityName: "atm_tipodocumento",
                        linkFromAttributeName: "atm_tipodocumentoid",
                        linkToAttributeName: "atm_tipodocumentoid",
                        joinOperator: JoinOperator.Inner);
                    linkTipoDocumento.Columns.AddColumns("atm_codigo", "atm_nombre");
                    linkTipoDocumento.EntityAlias = "atm_tipodocumento";
                    consultaDocumentoCredito.LinkEntities.Add(linkTipoDocumento);

                    LinkEntity linkDocumentLocation = new LinkEntity(
                        linkFromEntityName: "atm_documentocredito",
                        linkToEntityName: "sharepointdocumentlocation",
                        linkFromAttributeName: "atm_documentocreditoid",
                        linkToAttributeName: "regardingobjectid",
                        joinOperator: JoinOperator.LeftOuter);
                    linkDocumentLocation.Columns.AddColumns("relativeurl", "sharepointdocumentlocationid");
                    linkDocumentLocation.EntityAlias = "documentlocation";
                    consultaDocumentoCredito.LinkEntities.Add(linkDocumentLocation);

                    EntityCollection resultadoDocumentoCredito = service.RetrieveMultiple(consultaDocumentoCredito);

                    List<string> DCArray = new List<string>();

                    string[] credenciales = ConsultaParametros(service, "CREDENCIALESSP", null);

                    foreach (Entity entity in resultadoDocumentoCredito.Entities)
                    {
                        DCArray.Add(entity.GetAttributeValue<AliasedValue>("atm_tipodocumento.atm_codigo").Value.ToString());

                        if (entity.Attributes.Contains("documentlocation.relativeurl"))
                        {
                            var spDoc = entity.GetAttributeValue<AliasedValue>("documentlocation.sharepointdocumentlocationid");

                            RetrieveAbsoluteAndSiteCollectionUrlRequest retrieveRequest = new RetrieveAbsoluteAndSiteCollectionUrlRequest
                            {
                                Target = new EntityReference(spDoc.EntityLogicalName, new Guid(spDoc.Value.ToString()))
                            };
                            RetrieveAbsoluteAndSiteCollectionUrlResponse retriveResponse = (RetrieveAbsoluteAndSiteCollectionUrlResponse)service.Execute(retrieveRequest);

                            if (retriveResponse != null)
                            {
                                var urls = retriveResponse.AbsoluteUrl.Split('/');
                                if (urls.Length == 7)
                                {
                                    ClientContext context = new ClientContext($"{urls[0]}//{urls[2]}/{urls[3]}/{urls[4]}");
                                    SecureString secureString = new SecureString();
                                    credenciales[1].ToList().ForEach(secureString.AppendChar);
                                    context.Credentials = new SharePointOnlineCredentials(credenciales[0], secureString);

                                    Web web = context.Web;
                                    context.Load(web, w => w.ServerRelativeUrl);
                                    context.ExecuteQuery();

                                    var url = $"{web.ServerRelativeUrl}/{urls[5]}/{urls[6]}";
                                    Folder folder = web.GetFolderByServerRelativeUrl(url);

                                    context.Load(folder, f => f.Files);

                                    context.ExecuteQuery();

                                    if (folder.Files.Count() == 0)
                                    {
                                        throw new InvalidPluginExecutionException($"El documento de crédito -{ entity.GetAttributeValue<AliasedValue>("atm_tipodocumento.atm_nombre").Value }- no tiene datos adjuntos");
                                    }
                                }
                            }
                        }
                        else
                        {
                            throw new InvalidPluginExecutionException($"El documento de crédito -{ entity.GetAttributeValue<AliasedValue>("atm_tipodocumento.atm_nombre").Value }- no tiene datos adjuntos");
                        }
                    }

                    //DETERMINO EL SEGMENTO
                    if (atm_accountid.Contains("atm_semsicecode"))
                    {
                        switch (atm_accountid.GetAttributeValue<OptionSetValue>("atm_semsicecode").Value)
                        {
                            case 963540005:
                                SEM = "DIS";
                                break;
                        }
                    }


                    if (SC.GetAttributeValue<OptionSetValue>("atm_tiposolicitudcode").Value == 963540000) // AUMENTO DE CUPO
                    {
                        var acSplit = ConsultaParametros(service, "AUMENTOCUPO", "");
                        valor = RevisarDocumentos(DCArray, acSplit);
                    }
                    else
                    {
                        if (atm_accountid.Attributes.Contains("atm_regimencontributivocode"))
                        {
                            switch (atm_accountid.GetAttributeValue<OptionSetValue>("atm_regimencontributivocode").Value)
                            {
                                case 963540000: /// PERSONA NATURAL
                                    var nSplit = ConsultaParametros(service, "PERSONANATURAL", SEM);
                                    valor = RevisarDocumentos(DCArray, nSplit);
                                    break;
                                case 963540001: /// PERSONA JURIDICA
                                    var jSplit = ConsultaParametros(service, "PERSONAJURIDICA", SEM);
                                    valor = RevisarDocumentos(DCArray, jSplit);
                                    break;
                                case 963540002: /// GRANDES CONTRIBUYENTES
                                    var gSplit = ConsultaParametros(service, "GRANDESCONTRIBUYENTES", SEM);
                                    valor = RevisarDocumentos(DCArray, gSplit);
                                    break;
                                case 963540003: /// PERSONAS NATURALES RETENEDORAS
                                    var rplit = ConsultaParametros(service, "PERSONASNATURALESRETENEDORAS", SEM);
                                    valor = RevisarDocumentos(DCArray, rplit);
                                    break;
                            }
                        }
                        else
                        {
                            throw new InvalidPluginExecutionException("La cuenta no tiene un regimen contributivo asignado");
                        }
                    }

                    if (!valor)
                    {
                        throw new InvalidPluginExecutionException("No puede continuar con el proceso si la documentación requerida no está completa");
                    }
                    else
                    {
                        var revisor = SC.GetAttributeValue<EntityReference>("atm_revisordocumentosid");

                        updateSC.Attributes.Add("atm_faseactivacode", new OptionSetValue(963540001));
                        updateSC.Attributes.Add("ownerid", revisor);
                        service.Update(updateSC);

                        if (SC.Contains("atm_aprobarsolicitudcode"))
                        {
                            if (!SC.Contains("atm_comentariodevolucionanalisis"))
                            {
                                throw new InvalidPluginExecutionException($"El campo - Comentario de Devolución Análisis - debe estar diligenciado");
                            }
                        }

                        //Se envia correo electronico
                        Entity plantilla = obtenerPlantilla(service, "PlantillaNotificacionSC-RevisionDocumentos");
                        if (plantilla != null)
                        {
                            enviarCorreo(service, plantilla, SC.ToEntityReference(), propietarioact, revisor, autor);
                        }
                        else
                        {
                            throw new InvalidPluginExecutionException("¡No se encuentra la plantilla PlantillaNotificacionSC-RevisionDocumentos!");
                        }
                    }
                }
                else if (fase == "Análisis")
                {
                    bool aprobado = true;
                    QueryExpression consultaDocumentoCredito = new QueryExpression() { EntityName = "atm_documentocredito" };
                    consultaDocumentoCredito.NoLock = true;
                    consultaDocumentoCredito.ColumnSet = new ColumnSet(new string[] { "atm_aprobado" });
                    consultaDocumentoCredito.Criteria.AddCondition("statecode", ConditionOperator.Equal, 0);
                    consultaDocumentoCredito.Criteria.AddCondition("atm_solicitudcreditoid", ConditionOperator.Equal, SC.Id);

                    EntityCollection resultadoDocumentoCredito = service.RetrieveMultiple(consultaDocumentoCredito);
                    foreach (Entity entity in resultadoDocumentoCredito.Entities)
                    {
                        if (!entity.GetAttributeValue<bool>("atm_aprobado"))
                        {
                            aprobado = false;
                        }
                    }

                    if (!aprobado)
                    {
                        throw new InvalidPluginExecutionException("No puede continuar con el proceso si toda la documentación no está aprobada");
                    }
                    else
                    {
                        var analista = SC.GetAttributeValue<EntityReference>("atm_analistacreditoid");
                        var revisor = SC.GetAttributeValue<EntityReference>("atm_revisordocumentosid");

                        updateSC.Attributes.Add("atm_faseactivacode", new OptionSetValue(963540002));
                        updateSC.Attributes.Add("ownerid", analista);
                        service.Update(updateSC);

                        //Se envia correo electrónico
                        Entity plantilla = obtenerPlantilla(service, "PlantillaNotificacionSC-Analisis");
                        if (plantilla != null)
                        {
                            enviarCorreo(service, plantilla, SC.ToEntityReference(), propietarioact, analista, autor, revisor);
                        }
                        else
                        {
                            throw new InvalidPluginExecutionException("¡No se encuentra la plantilla PlantillaNotificacionSC-Analisis!");
                        }
                    }

                }
                else if (fase == "Definición Del Cupo")
                {
                    var analista = SC.GetAttributeValue<EntityReference>("atm_analistacreditoid");
                    var revisor = SC.GetAttributeValue<EntityReference>("atm_revisordocumentosid");

                    updateSC.Attributes.Add("atm_faseactivacode", new OptionSetValue(963540003));
                    service.Update(updateSC);

                    Entity plantilla = obtenerPlantilla(service, "PlantillaNotificacionSC-AprobacionRechazo");
                    if (plantilla != null)
                    {
                        enviarCorreo(service, plantilla, SC.ToEntityReference(), analista, autor, revisor);
                    }
                    else
                    {
                        throw new InvalidPluginExecutionException("¡No se encuentra la plantilla PlantillaNotificacionSC-AprobacionRechazo");
                    }
                }
                else if (fase == "Finalizar")
                {
                    var analista = SC.GetAttributeValue<EntityReference>("atm_analistacreditoid");
                    var revisor = SC.GetAttributeValue<EntityReference>("atm_revisordocumentosid");

                    updateSC.Attributes.Add("atm_faseactivacode", new OptionSetValue(963540004));
                    service.Update(updateSC);

                    Entity plantilla = obtenerPlantilla(service, "PlantillaNotificacionSC-Finalizada");
                    if (plantilla != null)
                    {
                        enviarCorreo(service, plantilla, SC.ToEntityReference(), analista, autor, revisor);
                    }
                    else
                    {
                        throw new InvalidPluginExecutionException("¡No se encuentra la plantilla PlantillaNotificacionSC-Finalizada");
                    }
                }

                if (seguimiento != null) { seguimiento.Trace(string.Format("Finaliza ejecución PL: {0}", pluginName)); }
            }
            catch (Exception e)
            {
                if (seguimiento != null) { seguimiento.Trace("Error: " + e.Message); }
                throw new InvalidPluginExecutionException($"Error: {e.Message}", e);
            }
        }

        private string[] ConsultaParametros(IOrganizationService service, string nombreParametro, string SEM)
        {
            try
            {
                string[] returnParametro = new string[] { };
                QueryExpression consultaParamero = new QueryExpression() { EntityName = "atm_parametro" };
                consultaParamero.NoLock = true;
                consultaParamero.ColumnSet = new ColumnSet(new string[] { "atm_valor" });
                consultaParamero.Criteria.AddCondition("atm_nombre", ConditionOperator.Equal, nombreParametro + SEM);

                Entity resultadoParametros = service.RetrieveMultiple(consultaParamero).Entities[0];

                if (resultadoParametros != null)
                {
                    returnParametro = resultadoParametros.GetAttributeValue<string>("atm_valor").Split(',');
                }

                return returnParametro;
            }
            catch
            {
                throw new InvalidPluginExecutionException($"Error: Parámetro {nombreParametro}{SEM} no encontrado");
            }
        }

        private bool RevisarDocumentos(List<string> DCArray, string[] Arreglo)
        {
            var value = true;

            for (var index = 0; index < Arreglo.Length; index++)
            {
                var element = Arreglo[index];
                var d = DCArray.Where(item => item == element);
                if (DCArray.Where(item => item == element).Count() == 0)
                {
                    return false;
                }
            }

            return value;
        }

        private static Entity obtenerPlantilla(IOrganizationService service, String nombrePlantilla)
        {
            QueryExpression query = new QueryExpression("template");
            query.ColumnSet = new ColumnSet(false);
            query.Criteria.AddCondition("title", ConditionOperator.Equal, nombrePlantilla);

            EntityCollection result = service.RetrieveMultiple(query);

            return result.Entities.FirstOrDefault();
        }

        private static void enviarCorreo(IOrganizationService service, Entity plantilla, EntityReference solicitudCreditoRef, EntityReference usuarioFromRef, EntityReference usuarioToRef, EntityReference usuarioCC = null, EntityReference revisor = null)
        {
            try
            {
                InstantiateTemplateRequest instantiateTemplateRequest = new InstantiateTemplateRequest
                {
                    TemplateId = plantilla.Id,
                    ObjectId = solicitudCreditoRef.Id,
                    ObjectType = solicitudCreditoRef.LogicalName
                };

                InstantiateTemplateResponse instantiateTemplateResponse = (InstantiateTemplateResponse)service.Execute(instantiateTemplateRequest);

                Entity email = instantiateTemplateResponse.EntityCollection.Entities.FirstOrDefault();

                if (email != null)
                {
                    email["regardingobjectid"] = solicitudCreditoRef;
                    email["from"] = new Entity[] { new Entity("activityparty") { Attributes = new AttributeCollection() { new KeyValuePair<string, object>("partyid", usuarioFromRef) } } };
                    email["to"] = new Entity[] { new Entity("activityparty") { Attributes = new AttributeCollection() { new KeyValuePair<string, object>("partyid", usuarioToRef) } } };
                    EntityCollection cc = new EntityCollection();
                    if (usuarioCC != null)
                    {
                        cc.Entities.Add(new Entity("activityparty")
                        {
                            Attributes = new AttributeCollection() {
                                new KeyValuePair<string, object>("partyid", usuarioCC)
                            }
                        });
                    }

                    if (revisor != null)
                    {
                        cc.Entities.Add(new Entity("activityparty")
                        {
                            Attributes = new AttributeCollection() {
                                new KeyValuePair<string, object>("partyid", revisor)
                            }
                        });
                    }

                    if (cc.Entities.Count > 0)
                    {
                        email["cc"] = cc;
                    }

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

    }
}
