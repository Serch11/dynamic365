using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.PL.Cuenta.CompartirRegistros
{
    public class CompartirRegistros : IPlugin
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

        public void Run(IOrganizationService service, Entity cuentaHijo, ITracingService seguimiento)
        {
            int executionSection = 0;
            string pluginName = "VENTAS.PL.Cuenta.CompartirRegistros";
            try
            {
                if (seguimiento != null) { seguimiento.Trace(string.Format("Inicia ejecución PL: {0}", pluginName)); }

                if (cuentaHijo.Contains("parentaccountid"))
                {
                    Entity cuentaPadre = service.Retrieve("account", cuentaHijo.GetAttributeValue<EntityReference>("parentaccountid").Id, new ColumnSet("ownerid"));

                    EntityReference userHijo = cuentaHijo.GetAttributeValue<EntityReference>("ownerid");
                    EntityReference userPadre = cuentaPadre.GetAttributeValue<EntityReference>("ownerid");

                    if (userHijo.Id != userPadre.Id)
                    {
                        //se comparte la cuenta hija con el propietario padre
                        ShareRecords(service, cuentaHijo.ToEntityReference(), userPadre);

                        //se comparte la cuenta padre con el propietario del hijo
                        ShareRecords(service, cuentaPadre.ToEntityReference(), userHijo);
                    }


                    QueryExpression teamQE = new QueryExpression() { EntityName = "team" };
                    teamQE.ColumnSet = new ColumnSet(new string[] { "teamid", "name" });
                    teamQE.Criteria.AddCondition("name", ConditionOperator.Equal, "Directores Regionales");

                    EntityCollection teams = service.RetrieveMultiple(teamQE);

                    if(teams.Entities.Count > 0)
                    {
                        //Se comparte el padre con el grupo de directores
                        QueryExpression usersTeamQE = new QueryExpression("systemuser");
                        usersTeamQE.ColumnSet.AllColumns = true;
                        var query_teammembership = usersTeamQE.AddLink("teammembership", "systemuserid", "systemuserid");
                        query_teammembership.LinkCriteria.AddCondition("teamid", ConditionOperator.Equal, teams.Entities[0].Id);

                        EntityCollection usersTeam = service.RetrieveMultiple(usersTeamQE);

                        foreach(Entity user in usersTeam.Entities)
                        {
                            ShareRecords(service, cuentaPadre.ToEntityReference(), user.ToEntityReference(), true);
                        }
                    }

                    return;
                }
            }
            catch (Exception e)
            {
                if (seguimiento != null) { seguimiento.Trace("Error: " + e.Message); }

                throw new InvalidPluginExecutionException(string.Format("Error: {0} - ({1}) Execution Section {2}", e.Message, pluginName, executionSection.ToString()), e);
            }
        }

        private void ShareRecords(IOrganizationService service, EntityReference entityRef, EntityReference segmentUser, bool read = false)
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
            service.Execute(grantAccessRequest);
        }

    }
}
