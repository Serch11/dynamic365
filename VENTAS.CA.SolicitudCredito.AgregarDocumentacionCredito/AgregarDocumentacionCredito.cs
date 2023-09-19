using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk.Workflow;
using System;
using System.Activities;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.CA.SolicitudCredito.AgregarDocumentacionCredito
{
    public class AgregarDocumentacionCredito : CodeActivity
    {
        [Input("Solicitud de crédito")]
        [ReferenceTarget("atm_solicitudcredito")]
        public InArgument<EntityReference> atm_solicitudcredito { get; set; }

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

            Run(service, this.atm_solicitudcredito.Get(executionContext), seguimiento, out exitosoOut, out mensajeOut);

            this.Exito.Set(executionContext, exitosoOut);
            this.Mensaje.Set(executionContext, mensajeOut);
        }

        public void Run(IOrganizationService service, EntityReference reference, ITracingService seguimiento, out bool exitoso, out string mensaje)
        {
            int executionSection = 0;
            string customActivityName = "VENTAS.CA.SolicitudCredito.AgregarDocumentacionCredito";
            string SEM = string.Empty;
            exitoso = true;
            mensaje = "";

            try
            {
                if (seguimiento != null) { seguimiento.Trace(string.Format("Inicia ejecución PL: {0}", customActivityName)); }

                executionSection = 1;

                QueryExpression consultaSC = new QueryExpression() { EntityName = reference.LogicalName };
                consultaSC.NoLock = true;
                consultaSC.ColumnSet.AddColumns("atm_accountid", "atm_idsolicitud", "createdby", "ownerid", "atm_tiposolicitudcode");
                consultaSC.Criteria.AddCondition("atm_solicitudcreditoid", ConditionOperator.Equal, reference.Id);

                LinkEntity linkCuenta = new LinkEntity(
                                            linkFromEntityName: "atm_solicitudcredito",
                                            linkToEntityName: "account",
                                            linkFromAttributeName: "atm_accountid",
                                            linkToAttributeName: "accountid",
                                            joinOperator: JoinOperator.Inner);
                linkCuenta.Columns.AddColumns("atm_paisid");
                linkCuenta.EntityAlias = "cuenta";
                consultaSC.LinkEntities.Add(linkCuenta);

                Entity solicitudCredito = service.RetrieveMultiple(consultaSC).Entities.FirstOrDefault();

                QueryExpression consultaTD = new QueryExpression() { EntityName = "atm_tipodocumento" };
                consultaTD.ColumnSet = new ColumnSet(new string[] { "atm_codigo" });
                consultaTD.NoLock = true;

                EntityCollection resultadoTD = service.RetrieveMultiple(consultaTD);

                EntityReference account = solicitudCredito.GetAttributeValue<EntityReference>("atm_accountid");

                if (solicitudCredito.GetAttributeValue<OptionSetValue>("atm_tiposolicitudcode").Value == 963540000) //Aumento de cupo
                {
                    Entity TD = resultadoTD.Entities.Where(x => x.GetAttributeValue<string>("atm_codigo") == "1001").FirstOrDefault();

                    Entity agregarDC = new Entity() { LogicalName = "atm_documentocredito" };
                    agregarDC.Attributes.Add("atm_solicitudcreditoid", solicitudCredito.ToEntityReference());
                    agregarDC.Attributes.Add("atm_tipodocumentoid", TD.ToEntityReference());
                    agregarDC.Attributes.Add("atm_nombre", solicitudCredito.GetAttributeValue<string>("atm_idsolicitud") + "_" + TD.GetAttributeValue<string>("atm_codigo"));
                    agregarDC.Attributes.Add("createdby", solicitudCredito.GetAttributeValue<EntityReference>("createdby"));
                    agregarDC.Attributes.Add("ownerid", solicitudCredito.GetAttributeValue<EntityReference>("ownerid"));
                    service.Create(agregarDC);
                }
                else
                {
                    Entity atm_accountid = service.Retrieve(
                        "account",
                        account.Id,
                        new ColumnSet(new string[] { "atm_regimencontributivocode", "atm_semsicecode" }));

                    executionSection = 2;

                    if (atm_accountid.Contains("atm_semsicecode"))
                    {
                        switch (atm_accountid.GetAttributeValue<OptionSetValue>("atm_semsicecode").Value)
                        {
                            case 963540005:
                                SEM = "DIS";
                                break;
                        }
                    }

                    executionSection = 3;

                    string[] pSplit = new string[] { };
                    switch (atm_accountid.GetAttributeValue<OptionSetValue>("atm_regimencontributivocode").Value)
                    {
                        case 963540000: /// PERSONA NATURAL
                            pSplit = ConsultaParametros(service, "PERSONANATURAL", SEM);
                            break;
                        case 963540001: /// PERSONA JURIDICA
                            pSplit = ConsultaParametros(service, "PERSONAJURIDICA", SEM);
                            break;
                        case 963540002: /// GRANDES CONTRIBUYENTES
                            pSplit = ConsultaParametros(service, "GRANDESCONTRIBUYENTES", SEM);
                            break;
                        case 963540003: /// PERSONAS NATURALES RETENEDORAS
                            pSplit = ConsultaParametros(service, "PERSONASNATURALESRETENEDORAS", SEM);
                            break;
                        default:
                            mensaje = "El cliente no tiene asignado un regimen contributivo";
                            exitoso = false;
                            break;
                    }

                    for (var index = 0; index < pSplit.Length; index++)
                    {
                        var element = pSplit[index];
                        Entity TD = resultadoTD.Entities.Where(x => x.GetAttributeValue<string>("atm_codigo") == element).FirstOrDefault();
                        if (TD != null)
                        {
                            Entity agregarDC = new Entity() { LogicalName = "atm_documentocredito" };
                            agregarDC.Attributes.Add("atm_solicitudcreditoid", solicitudCredito.ToEntityReference());
                            agregarDC.Attributes.Add("atm_tipodocumentoid", TD.ToEntityReference());
                            agregarDC.Attributes.Add("atm_nombre", solicitudCredito.GetAttributeValue<string>("atm_idsolicitud") + "_" + element);
                            agregarDC.Attributes.Add("createdby", solicitudCredito.GetAttributeValue<EntityReference>("createdby"));
                            agregarDC.Attributes.Add("ownerid", solicitudCredito.GetAttributeValue<EntityReference>("ownerid"));
                            service.Create(agregarDC);
                        }
                        else
                        {
                            exitoso = false;
                            mensaje = "No se encuentra un tipo de documento con código " + element;
                        }
                    }
                }

                //Compartir registros

                if (solicitudCredito.Contains("cuenta.atm_paisid"))
                {
                    EntityReference pais = (EntityReference)solicitudCredito.GetAttributeValue<AliasedValue>("cuenta.atm_paisid").Value;

                    if (pais.Name == "ECUADOR")
                    {
                        var usuario = ConsultaParametros(service, "DIRECTORADMINISTRATIVO", "");
                        QueryExpression consultaUser = new QueryExpression() { EntityName = "systemuser" };
                        consultaUser.NoLock = true;
                        consultaUser.ColumnSet.AddColumns("systemuserid", "atm_paisid", "domainname");
                        consultaUser.Criteria.AddCondition("domainname", ConditionOperator.Equal, usuario[0]);

                        Entity user = service.RetrieveMultiple(consultaUser).Entities.FirstOrDefault();

                        var CreatedReference = new EntityReference("systemuser", user.Id);

                        AccessRights AccessRights = new AccessRights();

                        AccessRights = AccessRights.ReadAccess |
                                         AccessRights.WriteAccess |
                                         AccessRights.AppendToAccess |
                                         AccessRights.AppendAccess;

                        var grantAccessRequest = new GrantAccessRequest
                        {
                            PrincipalAccess = new PrincipalAccess
                            {
                                AccessMask = AccessRights,
                                Principal = CreatedReference
                            },
                            Target = new EntityReference(solicitudCredito.LogicalName, solicitudCredito.Id)
                        };
                        service.Execute(grantAccessRequest);
                    }
                }

                if (seguimiento != null) { seguimiento.Trace(string.Format("Finaliza ejecución CA: {0}", customActivityName)); }
            }
            catch (Exception e)
            {
                exitoso = false;
                mensaje = e.Message;

                if (seguimiento != null) { seguimiento.Trace("Error: " + e.Message); }
                throw new InvalidPluginExecutionException(string.Format("({0}) - Error: {1} - Execution Section {2}", customActivityName, e.Message, executionSection.ToString()), e);
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

    }
}