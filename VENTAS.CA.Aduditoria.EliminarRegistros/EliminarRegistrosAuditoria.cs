using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Activities;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Workflow;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Crm.Sdk.Messages;

namespace VENTAS.CA.Auditoria.EliminarRegistros
{
    public class EliminarRegistrosAuditoria : CodeActivity
    {
        [Output("Exito")]
        //[Default("False")]
        public OutArgument<bool> Exito { get; set; }

        [Output("Mensaje")]
        //[Default("")]
        public OutArgument<string> Mensaje { get; set; }

        protected override void Execute(CodeActivityContext executionContext)
        {
            IExecutionContext context = (IExecutionContext)executionContext.GetExtension<IExecutionContext>();
            IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)executionContext.GetExtension<IOrganizationServiceFactory>();
            IOrganizationService service = (IOrganizationService)serviceFactory.CreateOrganizationService(context.UserId);
            ITracingService tracing = executionContext.GetExtension<ITracingService>();

            bool outexito = false;
            string outmensaje = string.Empty;

            Run(tracing,service,out outmensaje,out outexito);

            this.Exito.Set(executionContext, outexito);
            this.Mensaje.Set(executionContext, outmensaje);

        }

        public void Run(ITracingService tracing,IOrganizationService service,out string mensaje , out bool exito)
        {
            mensaje = "";
            exito = true;
            try
            {
                QueryExpression queryAuditoria = new QueryExpression("audit");
                
              
                BulkDeleteRequest request = new BulkDeleteRequest()
                {
                    QuerySet = new QueryExpression[] { queryAuditoria },
                    JobName = $"Eliminacion masiva de registros de auditoria",
                    SendEmailNotification = false,
                    ToRecipients = new Guid[] { },
                    CCRecipients = new Guid[] { },
                    RecurrencePattern = string.Empty,
                    StartDateTime = DateTime.UtcNow
                };

                BulkDeleteResponse response = (BulkDeleteResponse)service.Execute(request);

                mensaje = "Eliminacion realizada correctamente";
            }
            catch (Exception ex )
            {
                tracing.Trace("Error eliminacion masiva de auditoria CA " + ex.Message);
                mensaje = ex.Message;
                exito = false;
            }
        }
    }
}
