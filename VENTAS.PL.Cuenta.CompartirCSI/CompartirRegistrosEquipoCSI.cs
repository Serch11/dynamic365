using Microsoft.Xrm.Sdk;
using System;
using ATM.Utilidades;
using Microsoft.Xrm.Sdk.Query;
using System.Collections.Generic;

namespace VENTAS.PL.Cuenta.CompartirCSI
{
    public class CompartirRegistrosEquipoCSI : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(context.UserId); //Se coloca null para que se ejecute como SYSTEM

            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            Entity targetEntity = null;


            if (context.MessageName == "Update")
            {
                targetEntity = context.PostEntityImages["postImage"];
            }

            if (targetEntity != null)
                Run(service, targetEntity, seguimiento);
        }

        public void Run(IOrganizationService service, Entity cuenta, ITracingService seguimiento)
        {
            Utilidades util = new Utilidades(service);

            int executionSection = 0;
            string pluginName = "VENTAS.PL.Cuenta.CompartirCSI";
            try
            {
                if (seguimiento != null) { seguimiento.Trace(string.Format("Inicia ejecución PL: {0}", pluginName)); }

                if (cuenta.GetAttributeValue<bool>("atm_cuentaclave"))
                {
                    List<ConditionExpression> lc = new List<ConditionExpression>();
                    lc.Add(new ConditionExpression("name", ConditionOperator.Equal, "Centro de Servicios Integrados"));

                    var teams = util.ConsultarMultiplesRegistros(
                                            util.CrearConsulta("team", new string[] { "teamid", "name" }, lc)
                                        );

                    if (teams.Count > 0)
                    {
                        //Se comparte el padre con el grupo de directores
                        QueryExpression usersTeamQE = new QueryExpression("systemuser");
                        usersTeamQE.ColumnSet.AllColumns = true;
                        var query_teammembership = usersTeamQE.AddLink("teammembership", "systemuserid", "systemuserid");
                        query_teammembership.LinkCriteria.AddCondition("teamid", ConditionOperator.Equal, teams[0].Id);

                        EntityCollection usersTeam = service.RetrieveMultiple(usersTeamQE);

                        foreach (Entity user in usersTeam.Entities)
                        {
                            util.CompartirRegistros(cuenta.ToEntityReference(), user.ToEntityReference());
                        }
                    }
                }
            }
            catch (Exception e)
            {
                if (seguimiento != null) { seguimiento.Trace("Error: " + e.Message); }

                throw new InvalidPluginExecutionException(string.Format("Error: {0} - ({1}) Execution Section {2}", e.Message, pluginName, executionSection.ToString()), e);
            }
        }

    }
}
