using ATM.Utilidades;
using ATM.Utilidades.Responses;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;

namespace VENTAS.PL.Direccion.EstablecerDireccionPrincipal
{
    public class EstablecerDireccionPrincipal : IPlugin
    {

        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(null); //Se coloca null para que se ejecute como SYSTEM

            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            Entity targetEntity = null;



            if (context.MessageName == "Create")
            {
                targetEntity = (Entity)context.InputParameters["Target"];
            }
            else if (context.MessageName == "Update")
            {
                targetEntity = context.PostEntityImages["postImage"];
            }

            //throw new InvalidPluginExecutionException(context.MessageName+ " - " + targetEntity.LogicalName);
            if (targetEntity != null)
                Run(service, targetEntity, seguimiento);
        }

        public void Run(IOrganizationService service, Entity target, ITracingService seguimiento)
        {
            int executionSection = 0;
            string pluginName = "VENTAS.PL.Direccion.EstablecerDireccionPrincipal";
            Utilidades Util = new Utilidades(service);
            API API = new API();

            try
            {
                if (seguimiento != null) { seguimiento.Trace(string.Format("Inicia ejecución PL: {0}", pluginName)); }

                if (target.GetAttributeValue<bool>("atm_esprincipal"))
                {
                    executionSection = 1;
                    int atm_tipodireccioncode = target.GetAttributeValue<OptionSetValue>("atm_tipodireccioncode").Value;
                    string attr = target.Attributes.Contains("atm_cuentaid") ? "atm_cuentaid" :
                                  target.Attributes.Contains("atm_leadid") ? "atm_leadid" :
                                  string.Empty;

                    EntityReference clienteRef = target.GetAttributeValue<EntityReference>(attr);

                    if (!string.IsNullOrEmpty(attr))
                    {
                        executionSection = 2;

                        QueryExpression consulta = new QueryExpression() { EntityName = "atm_direccion" };
                        consulta.NoLock = true;
                        consulta.ColumnSet.AddColumns("atm_esprincipal", attr);
                        consulta.Criteria.AddCondition(attr, ConditionOperator.Equal, clienteRef.Id);
                        consulta.Criteria.AddCondition("atm_tipodireccioncode", ConditionOperator.Equal, atm_tipodireccioncode);

                        //Si es entrega (963540000) o facturación (963540001)
                        if (atm_tipodireccioncode == 963540000 || atm_tipodireccioncode == 963540001)
                        {
                            consulta.Criteria.AddCondition("atm_direccionid", ConditionOperator.NotEqual, target.Id);

                            Entity cuenta = service.Retrieve(clienteRef.LogicalName, clienteRef.Id, new ColumnSet(new string[] { "atm_direccionprincipalid" }));
                            if (attr == "atm_cuentaid")
                            {
                                cuenta[
                                        atm_tipodireccioncode == 963540000 ?
                                        "atm_direccionprincipalid" : "atm_direccionprincipalfacturacionid"
                                      ] = target.ToEntityReference();
                            }
                            else
                            {
                                cuenta[atm_tipodireccioncode == 963540000 ?
                                        "atm_direccionprincipalid" : "atm_direccionprincipalid"
                                      ] = target.ToEntityReference();
                            }
                            service.Update(cuenta);
                        }

                        executionSection = 3;
                        // Si es entrega (963540000) o facturación (963540001)
                        if ((atm_tipodireccioncode == 963540000 || atm_tipodireccioncode == 963540001) && attr == "atm_cuentaid")
                        {
                            string branch_code = string.Empty, customer_code = string.Empty;
                            Entity cuenta = service.Retrieve(clienteRef.LogicalName, clienteRef.Id, new ColumnSet(new string[] { "atm_idcuenta", "atm_paisid", "parentaccountid" }));
                            string pais = cuenta.Contains("atm_paisid") ? cuenta.GetAttributeValue<EntityReference>("atm_paisid").Name.Substring(0, 3) : "";

                            customer_code = cuenta.GetAttributeValue<string>("atm_idcuenta");
                            if (cuenta.Contains("parentaccountid"))
                            {
                                Entity cuentaPadre = service.Retrieve(clienteRef.LogicalName, cuenta.GetAttributeValue<EntityReference>("parentaccountid").Id, new ColumnSet(new string[] { "atm_idcuenta", "atm_paisid" }));
                                customer_code = cuentaPadre.GetAttributeValue<string>("atm_idcuenta");
                                branch_code = cuenta.GetAttributeValue<string>("atm_idcuenta");
                                pais = cuentaPadre.Contains("atm_paisid") ? cuentaPadre.GetAttributeValue<EntityReference>("atm_paisid").Name.Substring(0, 3) : "";
                            }

                            Entity updateDireccion = new Entity() { Id = target.Id, LogicalName = target.LogicalName };
                            string tipo = atm_tipodireccioncode == 963540000 ? "ENTREGA" : "FACTURACION";
                            string dirSice = $"{target.GetAttributeValue<string>("atm_ubicacion").Replace(" ", "").ToUpper()}-{cuenta.GetAttributeValue<string>("atm_idcuenta")}/{tipo}";
                            updateDireccion.Attributes.Add("atm_direccionsice", dirSice);
                            service.Update(updateDireccion);

                            Data data = new Data();
                            List<cuentas> cuentas = new List<cuentas>();

                            executionSection = 4;
                            // VIAJA A LA API
                            if (atm_tipodireccioncode == 963540000 && !string.IsNullOrEmpty(pais))
                            {
                                cuentas.Add(new cuentas()
                                {
                                    address = target.GetAttributeValue<string>("atm_ubicacion"),
                                    branch_code = branch_code,
                                    customer_code = customer_code,
                                    latitude = target.GetAttributeValue<string>("atm_latitud"),
                                    longitude = target.GetAttributeValue<string>("atm_longitud"),
                                });
                                data.cuentas = cuentas;

                                executionSection = 5;
                                List<ConditionExpression> lc = new List<ConditionExpression>();
                                lc.Add(new ConditionExpression("atm_nombre", ConditionOperator.Equal, "URLAPIACTUALIZACIONDIRECCIONSICE"));
                                List<Entity> entities = Util.ConsultarMultiplesRegistros(Util.CrearConsulta("atm_parametro", new string[] { "atm_valor" }, lc));
                                string URL = string.Format(entities[0].GetAttributeValue<string>("atm_valor"), pais);

                                executionSection = 61;

                                CuentasSICEResponse respuesta = API.PUT<CuentasSICEResponse>(URL, data).Result;

                                if (respuesta.output.clientes_error.Count > 0)
                                {
                                    throw new InvalidPluginExecutionException(respuesta.output.clientes_error[0].message);
                                }
                            }
                        }

                        EntityCollection resultado = service.RetrieveMultiple(consulta);

                        executionSection = 7;

                        //Para facturacion
                        foreach (Entity entity in resultado.Entities)
                        {
                            Entity updateDir = new Entity() { Id = entity.Id, LogicalName = entity.LogicalName };
                            updateDir.Attributes.Add("atm_esprincipal", false);
                            service.Update(updateDir);
                        }
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
        
        public class Data
        {
            public List<cuentas> cuentas { get; set; }
        }

        public class cuentas
        {
            public string customer_code { get; set; }
            public string address { get; set; }
            public string branch_code { get; set; }
            public string latitude { get; set; }
            public string longitude { get; set; }
        }
    }
}