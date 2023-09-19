using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Activities;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Workflow;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Crm.Sdk.Messages;

namespace VENTAS.CA.Objetivos.RecalcularDatosReales
{
    public class RecalcularDatosReales : CodeActivity
    {
        [Output("Mensaje")]
        public OutArgument<string> Mensaje { get; set; }

        [Output("Exito")]
        public OutArgument<bool> Exito { get; set; }


        protected override void Execute(CodeActivityContext executionContext)
        {
            IExecutionContext context = (IExecutionContext)executionContext.GetExtension<IExecutionContext>();
            IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)executionContext.GetExtension<IOrganizationServiceFactory>();
            IOrganizationService service = (IOrganizationService)serviceFactory.CreateOrganizationService(context.UserId);
            ITracingService tracing = executionContext.GetExtension<ITracingService>();

            bool exitosoOut = false;
            string mensajeOut = string.Empty;

            Run(service, tracing, out mensajeOut, out exitosoOut);

            this.Mensaje.Set(executionContext, mensajeOut);
            this.Exito.Set(executionContext, exitosoOut);
        }

        public void Run(IOrganizationService service, ITracingService tracing, out string mensaje, out bool exito)
        {
            exito = true;
            mensaje = "ok";

            try
            {
                var query = new QueryExpression("goal");

                query.ColumnSet.AddColumns("actualmoney", "title", "lastrolledupdate");

                
                var query_Criteria_0 = new FilterExpression();
                query.Criteria.AddFilter(query_Criteria_0);

              
                query_Criteria_0.AddCondition("statecode", ConditionOperator.Equal, 0);
                var query_Criteria_1 = new FilterExpression();
                query.Criteria.AddFilter(query_Criteria_1);

               
                query_Criteria_1.FilterOperator = LogicalOperator.Or;
                query_Criteria_1.AddCondition("lastrolledupdate", ConditionOperator.OlderThanXHours, 4);
                query_Criteria_1.AddCondition("lastrolledupdate", ConditionOperator.Null);

                EntityCollection listadoObjetivos = service.RetrieveMultiple(query);

                ExecuteMultipleRequest multipleRequest = new ExecuteMultipleRequest()
                {
                    Settings = new ExecuteMultipleSettings()
                    {
                        ContinueOnError = true,
                        ReturnResponses = true
                    },
                    Requests = new OrganizationRequestCollection()

                };

                foreach (Entity item in listadoObjetivos.Entities)
                {
                    RecalculateRequest recalculateRequestGoals = new RecalculateRequest()
                    {
                        Target = new EntityReference(item.LogicalName, item.Id)
                    };
                    multipleRequest.Requests.Add(recalculateRequestGoals);
                }
                service.Execute(multipleRequest);

            }
            catch (Exception ex)
            {
                exito = false;
                mensaje = ex.Message;
            }
        }
    }
}
