using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Metadata;
using Microsoft.Xrm.Sdk.Query;

namespace VENTAS.CA.Objetivos.CrearObjetivos.Helper
{
    public class Utilidades
    {

        string qfetch;
        string qfetch1;
        string filter;
        //obtener categorias
        public string ObtenerCategorias(IOrganizationService services, string[] categorias)
        {
            List<string> idCategorias = new List<string>();

            foreach (var cat in categorias)
            {
                Entity categoria = consultarRegistros("atm_categoria", "atm_codigo", cat, services);
                if (categoria != null)
                {
                    idCategorias.Add(categoria.Id.ToString());
                }
            }

            //preparamos el fetch para los registros tipo categoria
            if (idCategorias.Count > 0)
            {
                qfetch1 = PrepararFetch(idCategorias, "invoicedetail");
            }
            idCategorias = new List<string>();
            return qfetch1;
        }

        //function para obtener fetch de segmentos segmentos
        public string ValidarSegmento(string[] segmentos, List<Segmento> optionList, string entidad)
        {
            List<string> codigo = new List<string>();
            var result = optionList.Where((x, index) => segmentos.Contains(x.Nombre.Trim()));
            codigo.AddRange(result.Select(x => x.Codigo.ToString()));

            if (codigo.Count > 0)
            {
                qfetch = PrepararFetch(codigo, entidad);
            }
            return qfetch;
        }

        //funcion para realizar consultas multiples a la entidad
        public Entity consultarRegistros(string entidad, string condicion, string valor, IOrganizationService service)
        {
            var query = new QueryExpression(entidad);
            // Add columns to query.ColumnSet
            query.ColumnSet.AllColumns = true;
            // Add filter query.Criteria
            query.Criteria.AddCondition(condicion, ConditionOperator.Equal, valor);

            if (entidad == "systemuser")
            {
                query.Criteria.AddCondition("isdisabled", ConditionOperator.Equal, false);
            }

            return service.RetrieveMultiple(query).Entities.FirstOrDefault();
        }

        //funcion para realizar consultas multiples a la entidad
        public EntityCollection consultarMultiplesRegistros(string entidad, string condicion, string valor, IOrganizationService service)
        {
            var query = new QueryExpression(entidad);
            // Add columns to query.ColumnSet
            query.ColumnSet.AllColumns = true;
            // Add filter query.Criteria
            query.Criteria.AddCondition(condicion, ConditionOperator.Equal, valor);
            return service.RetrieveMultiple(query);
        }

        //funcion para crear la consulta de consolidado
        public Guid PrepararCreacionConsultaConsolidad(Entity usuario, string queryentitytype, string queryfetch, string mes, int y, IOrganizationService service)
        {
            Entity goalRollupQuery = new Entity("goalrollupquery");
            goalRollupQuery.Attributes.Add("name", $"CONSULTA CONSOLIDAD-{usuario.GetAttributeValue<string>("fullname")}-{mes}-{y}".ToUpper());
            goalRollupQuery.Attributes.Add("queryentitytype", queryentitytype);
            goalRollupQuery.Attributes.Add("fetchxml", queryfetch);
            goalRollupQuery.Attributes.Add("ownerid", usuario.ToEntityReference());
            goalRollupQuery.Attributes.Add("createdby", usuario.ToEntityReference());
            return service.Create(goalRollupQuery);
        }


        //funcion para armar el fetch para categorias y segmentos
        public string PrepararFetch(List<string> parametros, string queryentitytype)
        {
            string str = string.Empty;
            string str1 = string.Empty;
            string variablefiltradocategoria = string.Empty;
            string variablefiltrosegmentos = string.Empty;
            string filtrofinal = string.Empty;

            foreach (var item in parametros)
            {
                string x = "{" + item + "}";
                //// se arma el listado de parametros por categoria de productos
                if (queryentitytype == "invoicedetail")
                {

                    //str1 += $@"<condition attribute=""atm_categoriaid"" operator=""eq"" value=""{x}"" uiname=""LLANTAS IMPORTADAS"" uitype=""atm_categoria"" />";
                    //str1 += $@"<condition attribute=""atm_categoriaid"" operator=""eq"" value=""{x}""  uitype=""atm_categoria"" />";
                    //str += $@"<value  uitype='atm_categoria'>{x}</value>";
                    str += $@"<condition attribute=""atm_categoriaid"" operator=""eq"" value=""{x}""  uitype=""atm_categoria"" />";
                }

                if (queryentitytype == "account" || queryentitytype == "invoicedetail-account")
                {
                    str += $@"<condition attribute='atm_semsicecode' operator='eq' value='{item}' />";
                }
                if (queryentitytype == "lead")
                {
                    str += $@"<condition attribute=""atm_preventistaid"" operator=""eq"" value=""{x}""  uitype=""systemuser"" />";
                }


            }

            if (queryentitytype == "invoicedetail")
            {
                variablefiltradocategoria = $@"<link-entity name='product' from='productid' to='productid' link-type='inner' alias='product'>
                                                <attribute name='atm_subcategoriaid' />
                                                 <attribute name='atm_categoriaid' />
                                                    <filter type='and'>
                                                         {str}
                                                         </filter>
                                                </link-entity>";

                filtrofinal = variablefiltradocategoria;
            }

            if (queryentitytype == "invoicedetail-account")
            {
                variablefiltrosegmentos = $@"<link-entity name='invoice' alias='ab' link-type='inner' from='invoiceid' to='invoiceid'>
                                                  <link-entity name='account' alias='ad' link-type='inner' from='accountid' to='customerid'>
                                                    <filter type='and'>
                                                    {str}
                                                    </filter>
                                                  </link-entity>
                                                </link-entity>";

                filtrofinal = variablefiltrosegmentos;
            }

            if (queryentitytype == "account")
            {
                filtrofinal = str;
            }

            if (queryentitytype == "lead")
            {
                filtrofinal = str;
            }


            //invoice


            return filtrofinal;
        }

        public string FetchDinamico(string queryentitytype, List<Filtro> listafiltro)
        {
            string str = string.Empty;
            //invoice
            if (queryentitytype == "invoice")
            {
                foreach (Filtro item in listafiltro)
                {
                    str += $@"<condition attribute=""{item.atributo}"" operator=""{item.operador}"" value=""{item.valor}"" />";
                }
            }
            return str;
        }


        //funcion para unificar fetch
        public string UnificarFetch(string filtrofinal, string entidad, Entity usuario, string mes, int año)
        {
            string[] fecha = ObtenerFecha(mes, año).Split(',');

            var fetchData2 = new
            {
                createdon = fecha[0],
                createdon2 = fecha[1],
                usuario = "{" + usuario.Id + "}",
            };

            switch (entidad)
            {
                case "invoicedetail":
                    filter = $@"<filter type='and'>
                                <condition attribute='createdon' operator='on-or-after' value='{fetchData2.createdon}' />
                                <condition attribute='createdon' operator='on-or-before' value='{fetchData2.createdon2}' />
                                <condition attribute='createdby' operator='eq' value='{fetchData2.usuario}'  uitype='systemuser' />
                            </filter>
                            {filtrofinal}";
                    break;

                case "account":

                    filter = $@"<filter>
                                <condition attribute='createdon' operator='on-or-after' value='{fetchData2.createdon}' />
                                <condition attribute='createdon' operator='on-or-before' value='{fetchData2.createdon2}' />
                                <condition attribute='ownerid' operator='eq' value='{fetchData2.usuario}'  uitype='systemuser' />
                                {filtrofinal}
                            </filter>";
                    break;

                case "lead":

                    filter = $@"<filter>
                                <condition attribute='createdon' operator='on-or-after' value='{fetchData2.createdon}' />
                                <condition attribute='createdon' operator='on-or-before' value='{fetchData2.createdon2}' />
                             {filtrofinal}
                            </filter>";
                    break;
                case "invoice":
                    filter = $@"<filter>
                                <condition attribute='createdon' operator='on-or-after' value='{fetchData2.createdon}' />
                                <condition attribute='createdon' operator='on-or-before' value='{fetchData2.createdon2}' />
                                {filtrofinal}
                            </filter>";
                    break;


            }

            return $@"<?xml version='1.0' encoding='utf-16'?>
                                    <fetch version='1.0'  mapping='logical' distinct='false'>
                                      <entity name='{entidad}'>
                                        <attribute name='createdon' />
                                        <attribute name='createdby' />
                                        {filter} 
                                      </entity>
                                    </fetch>";
        }


        public string ObtenerFecha(string mes, int año)
        {

            CultureInfo cult = new CultureInfo("es-ES", false);
            int numeromes = DateTime.ParseExact(mes.Split('-')[0], "MMMM", cult).Month;

            DateTime primerida = new DateTime(año, numeromes, 1);
            DateTime fechaFin = primerida.AddMonths(1).AddDays(-1);

            return $"{primerida.ToString("yyyy-MM-dd")},{fechaFin.ToString("yyyy-MM-dd")}";
        }


        //validamos si un usuario tiene roles de seguridad
        public bool ValidarRolesDeSeguridad(Guid idusuario, IOrganizationService service)
        {
            bool valor = false;

            QueryExpression query = new QueryExpression("role");
            query.ColumnSet.AddColumn("name");

            LinkEntity systemuserrol = new LinkEntity(
                linkFromEntityName: "role",
                linkToEntityName: "systemuserroles",
                linkFromAttributeName: "roleid",
                linkToAttributeName: "roleid",
                joinOperator: JoinOperator.Inner);
            systemuserrol.LinkCriteria.AddCondition("systemuserid", ConditionOperator.Equal, idusuario);
            systemuserrol.EntityAlias = "systemuserrole";
            query.LinkEntities.Add(systemuserrol);

            EntityCollection resultado = service.RetrieveMultiple(query);

            if (resultado.Entities.Count > 0)
            {
                valor = true;
            }

            return valor;
        }

        //function para obtener listado de opciones
        public List<Segmento> obtenerOpciones(IOrganizationService service)
        {
            List<Segmento> optionList = new List<Segmento>();

            var attributeRequest = new RetrieveAttributeRequest
            {
                EntityLogicalName = "account",
                LogicalName = "atm_semsicecode",
                RetrieveAsIfPublished = true
            };

            RetrieveAttributeResponse response = (RetrieveAttributeResponse)service.Execute(attributeRequest);
            EnumAttributeMetadata attributeData = (EnumAttributeMetadata)response.AttributeMetadata;
            optionList = (from option in attributeData.OptionSet.Options
                          select new Segmento(
                                           option.Value.Value,
                                           option.Label.UserLocalizedLabel.Label)).ToList();

            return optionList;
        }

      
    }
}
