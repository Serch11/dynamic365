using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.PL.Factura.CalculoImporteAjustado
{
    public class CalculoImporteAjustado : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(context.UserId);

            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            Entity targetEntity = null;

            if (context.MessageName == "Create")
            {
                targetEntity = (Entity)context.InputParameters["Target"];
            }
            else if (context.MessageName == "Update")
            {
                targetEntity = context.PostEntityImages["PostImage"];
            }
            else if (context.MessageName == "Delete")
            {
                targetEntity = (Entity)context.PreEntityImages["PreImage"];
            }

            if (targetEntity != null)
                Run(service, targetEntity, seguimiento, context.MessageName);
        }

        public void Run(IOrganizationService service, Entity entity, ITracingService seguimiento, string contexto)
        {
            int executionSection = 0;
            string pluginName = "VENTAS.PL.Factura.CalculoImporteAjustado";

            try
            {
                executionSection = 1;

                if (contexto == "Create" || contexto == "Update")
                {
                    executionSection = 2;

                    QueryExpression consultaInvoiceDetail = new QueryExpression() { EntityName = "invoicedetail" };
                    consultaInvoiceDetail.NoLock = true;
                    consultaInvoiceDetail.ColumnSet.AddColumns(new string[] { "extendedamount", "tax" });
                    consultaInvoiceDetail.Criteria.AddCondition("invoicedetailid", ConditionOperator.Equal, entity.Id);

                    LinkEntity linkInvoice = new LinkEntity(
                        linkFromEntityName: "invoicedetail",
                        linkToEntityName: "invoice",
                        linkFromAttributeName: "invoiceid",
                        linkToAttributeName: "invoiceid",
                        joinOperator: JoinOperator.Inner);
                    linkInvoice.Columns.AddColumns("atm_porcentajefinanciacion");
                    linkInvoice.EntityAlias = "invoice";

                    consultaInvoiceDetail.LinkEntities.Add(linkInvoice);

                    Entity rInvDet = service.RetrieveMultiple(consultaInvoiceDetail).Entities.FirstOrDefault();

                    executionSection = 3;

                    if (rInvDet != null)
                    {
                        executionSection = 4;

                        decimal tax = rInvDet.Contains("tax") ? rInvDet.GetAttributeValue<Money>("tax").Value : 0;
                        decimal extendedamount = rInvDet.Contains("extendedamount") ? rInvDet.GetAttributeValue<Money>("extendedamount").Value : 0;
                        decimal atm_porcentajefinanciacion = rInvDet.Contains("invoice.atm_porcentajefinanciacion") ? (decimal)rInvDet.GetAttributeValue<AliasedValue>("invoice.atm_porcentajefinanciacion").Value : 0;
                        decimal importeAjustado = (extendedamount - tax) / (1 + ((atm_porcentajefinanciacion) / 100));

                        Entity updateID = new Entity() { Id = rInvDet.Id, LogicalName = rInvDet.LogicalName };
                        updateID.Attributes.Add("atm_importeajustado", importeAjustado);
                        service.Update(updateID);
                    }
                }

                executionSection = 5;

                EntityReference invoice = entity.GetAttributeValue<EntityReference>("invoiceid");
                QueryExpression consultaDetallesFactura = new QueryExpression() { EntityName = "invoicedetail" };
                consultaDetallesFactura.NoLock = true;
                consultaDetallesFactura.ColumnSet.AddColumns("atm_importeajustado");
                consultaDetallesFactura.Criteria.AddCondition("invoiceid", ConditionOperator.Equal, invoice.Id);

                EntityCollection resultadoDetallesFactura = service.RetrieveMultiple(consultaDetallesFactura);

                decimal importeAjustadoTotal = resultadoDetallesFactura.Entities
                                                     .Sum(x => x.Contains("atm_importeajustado") ?
                                                     x.GetAttributeValue<Money>("atm_importeajustado").Value : 0);

                executionSection = 6;

                Entity updateInvoice = new Entity() { Id = invoice.Id, LogicalName = "invoice" };
                updateInvoice.Attributes.Add("atm_importeajustado", importeAjustadoTotal);

                service.Update(updateInvoice);
            }
            catch (Exception e)
            {
                if (seguimiento != null) { seguimiento.Trace("Error: " + e.Message); }
                throw new InvalidPluginExecutionException(string.Format("Error: {0} - ({1}) Execution Section {2}", e.Message, pluginName, executionSection.ToString()), e);
            }
        }
    }
}
