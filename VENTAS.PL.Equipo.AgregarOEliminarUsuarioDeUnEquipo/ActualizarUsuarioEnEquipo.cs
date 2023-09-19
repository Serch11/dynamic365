using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;
using System.Net;
using System.IO;
using Newtonsoft.Json;

namespace VENTAS.PL.Equipo.AgregarOEliminarUsuarioDeUnEquipo
{
    public class ActualizarUsuarioEnEquipo : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(null); // se coloca null para que se ejecute como SYSTEM
            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            //Entity TargetEntity = null;
            EntityReferenceCollection relatedEntities = null;

            //TargetEntity = (Entity)context.InputParameters["Target"];
            //Run(service, TargetEntity, seguimiento);

            if (context.MessageName.ToLower() == "associate")
            {
                var nombreRelacion = ((Relationship)context.InputParameters["Relationship"]).SchemaName;
                
                if (nombreRelacion == "teammembership_association")
                {
                    EntityReference equipo = (EntityReference)context.InputParameters["Target"];

                    relatedEntities = context.InputParameters["RelatedEntities"]  as EntityReferenceCollection;

                    EntityReference relatedEntity = relatedEntities[0];

                    EjecutarFlujo(equipo,relatedEntity);
                   
                   //throw new InvalidPluginExecutionException("hola" + " - " + equipo.Id.ToString()  + " _  " + relatedEntity.Id.ToString() + "_ "  +  relatedEntities.Count().ToString());
                }
            }
            else { }//Disassociate
        }


        public void Run(IOrganizationService service, AddMembersTeamRequest entity, ITracingService seguimiento)
        {
            AddMembersTeamRequest sergio = entity;
            
 
            try
            {
                throw new InvalidPluginExecutionException("Usuario Agregado");
            }
            catch (Exception)
            {


            }
        }

        public void EjecutarFlujo(EntityReference idEquipo, EntityReference idUsuario)
        {
            try
            {
                var URL = "https://prod-19.brazilsouth.logic.azure.com:443/workflows/745a23b144594841966d9213ddbf74d5/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=jh--oYEqmYIWo6ZM-UgbHVeI1TOeHHCVHUckCWjvV4k";
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(URL);
                request.Method = "POST";
                //request.ContentType = "application/json";
                request.ContentType = "application/x-www-form-urlencoded";

                var postData = "IdEquipo=" + Uri.EscapeDataString(idEquipo.Id.ToString());
                postData += "&IdUsuario=" + Uri.EscapeDataString(idUsuario.Id.ToString());
                var data = Encoding.ASCII.GetBytes(postData.ToString());

                request.ContentLength = data.Length;

                using (var stream = request.GetRequestStream())
                {
                    stream.Write(data, 0, data.Length);
                }

                var response = (HttpWebResponse)request.GetResponse();
                var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
            }
            catch (Exception e)
            {
                throw new InvalidPluginExecutionException(e.ToString());
            }
        }
    }

    
}
