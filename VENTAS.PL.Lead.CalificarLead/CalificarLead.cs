using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.PL.Lead.CalificarLead
{
    public class CalificarLead : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(null); //Se coloca null para que se ejecute como SYSTEM

            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));


            if (context.MessageName == "QualifyLead")
            {
                EntityReference reference = (EntityReference)context.InputParameters["LeadId"];
                Run(service, reference, seguimiento);
            }
        }

        public void Run(IOrganizationService service, EntityReference reference, ITracingService seguimiento)
        {
            int executionSection = 0;
            string pluginName = "VENTAS.PL.Lead.CalificarLead";

            try
            {

                Entity account;
                DateTime fecha = DateTime.Now;
                if (seguimiento != null) { seguimiento.Trace(string.Format("Inicia ejecución PL: {0}", pluginName)); }
                executionSection = 1000;

                //Buscamos el lead, si es una conversion de cliente existente debe agregar modificar el campo originating lead
                Entity lead = service.Retrieve("lead", reference.Id, new ColumnSet(new string[] { "parentaccountid", "atm_paisid", "atm_fecharealcalificacion" }));

                if (lead.Attributes.Contains("parentaccountid"))
                {
                    account = service.Retrieve("account", lead.GetAttributeValue<EntityReference>("parentaccountid").Id, new ColumnSet(new string[] { "originatingleadid", "atm_fechaultimafacturacion" }));
                    executionSection = 1001;

                    if (!account.Contains("originatingleadid"))
                    {
                        Entity updateEnt = new Entity()
                        {
                            Id = lead.GetAttributeValue<EntityReference>("parentaccountid").Id,
                            LogicalName = "account"
                        };
                        updateEnt.Attributes.Add("atm_leadreactivacionid", lead.ToEntityReference());

                        executionSection = 1002;
                        service.Update(updateEnt);
                    }

                    if (account.Contains("atm_fechaultimafacturacion"))
                        fecha = account.GetAttributeValue<DateTime>("atm_fechaultimafacturacion");
                }

                executionSection = 2000;

                //consulta divisas
                QueryExpression consultaMonedas = new QueryExpression() { EntityName = "transactioncurrency" };
                consultaMonedas.Distinct = true;
                consultaMonedas.ColumnSet.AddColumns("transactioncurrencyid", "currencyname", "isocurrencycode");
                consultaMonedas.Criteria.AddCondition("isocurrencycode", ConditionOperator.Equal, lead.GetAttributeValue<EntityReference>("atm_paisid").Name == "COLOMBIA" ? "COP" : "USD");
                Entity resultadoDivisas = service.RetrieveMultiple(consultaMonedas).Entities.FirstOrDefault();

                executionSection = 3000;
                //Modificamos la fecha de calificacion y la divisa cada vez que se califica
                Entity updateLead = new Entity() { LogicalName = lead.LogicalName, Id = lead.Id };
                updateLead.Attributes.Add("atm_fecharealcalificacion", fecha);

                updateLead.Attributes.Add("transactioncurrencyid", resultadoDivisas.ToEntityReference());

                //Actualizamos el lead
                service.Update(updateLead);

                executionSection = 4000;

                QueryExpression consultaccount = new QueryExpression() { EntityName = "account" };
                consultaccount.NoLock = true;
                consultaccount.ColumnSet.AddColumns("originatingleadid");

                FilterExpression fe = new FilterExpression();

                fe.FilterOperator = LogicalOperator.Or;
                fe.AddCondition("originatingleadid", ConditionOperator.Equal, reference.Id);
                fe.AddCondition("atm_leadreactivacionid", ConditionOperator.Equal, reference.Id);

                consultaccount.Criteria.AddFilter(fe);

                Entity resultadoAccount = service.RetrieveMultiple(consultaccount).Entities.FirstOrDefault();

                executionSection = 5000;

                if (resultadoAccount != null)
                {
                    string[] fields = new string[] { "atm_ubicacion", "atm_detalle", "atm_paisid", "atm_departamentoid", "atm_esprincipal", "atm_latitud", "atm_longitud", "atm_tipodireccioncode" };
                    QueryExpression consultadirecciones = new QueryExpression() { EntityName = "atm_direccion" };
                    consultadirecciones.NoLock = true;
                    consultadirecciones.ColumnSet.AddColumns(fields);
                    consultadirecciones.Criteria.AddCondition("atm_leadid", ConditionOperator.Equal, reference.Id);

                    EntityCollection resultadoDirecciones = service.RetrieveMultiple(consultadirecciones);
                    foreach (Entity entity in resultadoDirecciones.Entities)
                    {
                        executionSection = 5001;

                        Entity created = new Entity() { LogicalName = entity.LogicalName };
                        created.Attributes.Add("atm_cuentaid", resultadoAccount.ToEntityReference());
                        foreach (string field in fields)
                        {
                            if (entity.Attributes.Contains(field))
                            {
                                created.Attributes.Add(field, entity.Attributes[field]);
                            }
                        }
                        executionSection = 5002;

                        service.Create(created);
                    }
                }


                if (seguimiento != null) { seguimiento.Trace(string.Format("Finaliza ejecución PL: {0}", pluginName)); }
            }
            catch (Exception e)
            {
                if (seguimiento != null) { seguimiento.Trace("Error: " + e.Message); }
                throw new InvalidPluginExecutionException(string.Format("Error: {0} - ({1}) Execution Section {2}", e.Message, pluginName, executionSection.ToString()), e);
            }
        }
    }
}
