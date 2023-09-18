using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INCIDENT_Calculo_de_estados
{
    public class Calculo_de_estados : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            ITracingService tracing = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);
            Entity entity = (Entity)context.InputParameters["Target"];

            Entity incident = new Entity();
            incident = service.Retrieve(entity.LogicalName, entity.Id, new ColumnSet(true));

            DateTime fecha_inicio = incident.GetAttributeValue<DateTime>("createdon").AddHours(-5);
            int statuscode = incident.GetAttributeValue<OptionSetValue>("statuscode").Value;
            int tiempo_asignado = incident.GetAttributeValue<int>("ap_asignadotiempo");
            int ultimo_estado = incident.GetAttributeValue<int>("ap_ultimoestado");
            DateTime ultima_modificacion_estado = incident.GetAttributeValue<DateTime>("ap_ultimamodificaciondeestado");
            DateTime fecha_actual = DateTime.Now.AddHours(-5);

            // Registrado = 778.210.001
            // endiagnostico = 4
            // Esperando atencion por tercero = 3
            // Esperando respuesta del cliente 778.210.002
            // Esperando respuesta ejecutivo 778.210.000
            // Revisión trabajo 778.210.005
            // Listo para entregar 778.210.004
            // Cumplido 2
            // Asignado 1

            Entity caso = new Entity("incident");
            caso.Id = new Guid(entity.Id.ToString());

            TimeSpan minutos_transcurridos;
            int min_transcurridos = 0;
            if (ultimo_estado == 0)
            {
                minutos_transcurridos = fecha_actual - fecha_inicio;
                min_transcurridos = Convert.ToInt32(minutos_transcurridos.TotalMinutes);
                caso["ap_registradotiempo"] = min_transcurridos;
            }
            else
            {
                minutos_transcurridos = fecha_actual - ultima_modificacion_estado.AddHours(-5);
                min_transcurridos = Convert.ToInt32(minutos_transcurridos.TotalMinutes);
            }

            switch (statuscode)
            {
                case 1:
                    int asignado_tiempo = incident.GetAttributeValue<int>("ap_asignadotiempo");
                    caso["ap_asignadotiempo"] = asignado_tiempo + min_transcurridos;
                    break;
                case 2:
                    int cumplido_tiempo = incident.GetAttributeValue<int>("ap_cumplidotiempo");
                    caso["ap_cumplidotiempo"] = cumplido_tiempo + min_transcurridos;
                    break;
                case 3:
                    int esperando_tercero_tiempo = incident.GetAttributeValue<int>("ap_esperandotercerotiempo");
                    caso["ap_esperandotercerotiempo"] = esperando_tercero_tiempo + min_transcurridos;
                    break;
                case 4:
                    int diagnostico_tiempo = incident.GetAttributeValue<int>("ap_diagnosticotiempo");
                    caso["ap_diagnosticotiempo"] = diagnostico_tiempo + min_transcurridos;
                    break;
                case 778210000:
                    int esperando_ejecutivo_tiempo = incident.GetAttributeValue<int>("ap_esperandoejecutivotiempo");
                    caso["ap_esperandoejecutivotiempo"] = esperando_ejecutivo_tiempo + min_transcurridos;
                    break;
                case 778210002:
                    int esperando_cliente_tiempo = incident.GetAttributeValue<int>("ap_esperandoclientetiempo");
                    caso["ap_esperandoclientetiempo"] = esperando_cliente_tiempo + min_transcurridos;
                    break;
                case 778210004:
                    int listo_entrega_tiempo = incident.GetAttributeValue<int>("ap_listoentregatiempo");
                    caso["ap_listoentregatiempo"] = listo_entrega_tiempo + min_transcurridos;
                    break;
                case 778210005:
                    int revision_trabajo_tiempo = incident.GetAttributeValue<int>("ap_revisiontrabajotiempo");
                    caso["ap_revisiontrabajotiempo"] = revision_trabajo_tiempo + min_transcurridos;
                    break;
            }

            if (ultimo_estado == 0)
            {
                caso["ap_ultimoestado"] = 778210001;
            }
            else
            {
                caso["ap_ultimoestado"] = statuscode;
            }
            caso["ap_ultimamodificaciondeestado"] = fecha_actual;
            service.Update(caso);
        }
    }
}