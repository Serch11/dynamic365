using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Tooling.Connector;
using System;
using VENTAS.PL.PVSC.ValidarEstadoProceso;

namespace Pruebas
{
    [TestClass]
    public class VENTAS_PL_PVSC_ValidarEstadoProceso
    {
        [TestMethod]
        public void TMValidarEstadoProceso()
        {
            Conexion con = new Conexion();
            IOrganizationService service = con.getCRMConnv2();
            ITracingService seguimiento = null;

            Entity entity = service.Retrieve("atm_procesosolicitudcredito", new Guid("31bb950d-8151-4305-8632-27faaf94d8a9"), new Microsoft.Xrm.Sdk.Query.ColumnSet(true));

            ValidarEstadoProceso prueba = new ValidarEstadoProceso();
            //LeerArchivos prueba = new LeerArchivos();

            prueba.Run(service, entity, seguimiento);

            //QueryExpression consultaccount = new QueryExpression() { EntityName = "product" };
            //consultaccount.NoLock = true;
            //consultaccount.Criteria.AddCondition("atm_categoriaid", ConditionOperator.Equal, new Guid("2dbf2ed8-ebeb-ec11-bb3c-002248d31e2d"));
            //EntityCollection collection = service.RetrieveMultiple(consultaccount);

            //var count = 0;
            //foreach (Entity product in collection.Entities)
            //{
            //    count = count + 1;
            //    // Buscarmos que no tenga propiedades
            //    QueryExpression consultaProp = new QueryExpression() { EntityName = "dynamicproperty" };
            //    consultaProp.NoLock = true;
            //    consultaProp.Criteria.AddCondition("regardingobjectid", ConditionOperator.Equal, product.Id);
            //    EntityCollection collectionProp = service.RetrieveMultiple(consultaProp);

            //    if (collectionProp.Entities.Count == 0)
            //    {
            //        //Cambiamos el estado del producto
            //        Entity updateProduct = new Entity() { LogicalName = product.LogicalName, Id = product.Id };
            //        updateProduct.Attributes.Add("statecode", new OptionSetValue(2));
            //        updateProduct.Attributes.Add("statuscode", new OptionSetValue(0));
            //        service.Update(updateProduct);

            //        //Agregamos Propiedad
            //        Entity property = new Entity() { LogicalName = "dynamicproperty" };
            //        property.Attributes.Add("name", "Tiquete");
            //        property.Attributes.Add("datatype", new OptionSetValue(4));
            //        property.Attributes.Add("isrequired", false);
            //        property.Attributes.Add("isreadonly", false);
            //        property.Attributes.Add("maxvalueinteger", 2147483647);
            //        property.Attributes.Add("minvalueinteger", 0);
            //        property.Attributes.Add("ishidden", false);
            //        property.Attributes.Add("regardingobjectid", product.ToEntityReference());
            //        service.Create(property);

            //        //Volvemos a activar el producto
            //        updateProduct.Attributes["statecode"] = new OptionSetValue(0);
            //        updateProduct.Attributes["statuscode"] = new OptionSetValue(1);
            //        service.Update(updateProduct);
            //    }
            //}            
        }
    }
}