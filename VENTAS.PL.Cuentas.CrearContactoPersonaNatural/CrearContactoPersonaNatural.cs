using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

namespace VENTAS.PL.Cuenta.CrearContactoPersonaNatural
{
    public class CrearContactoPersonaNatural : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(context.UserId);// se coloca null para que se ejecute como SYSTEM

            ITracingService seguimiento = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            Entity TargetEntity = null;


            if (context.MessageName == "Create")
            {
                TargetEntity = (Entity)context.InputParameters["Target"];
            }

            if (TargetEntity != null)
            {
                Run(service, TargetEntity, seguimiento);
            }
        }



        public void Run(IOrganizationService service, Entity cuenta, ITracingService seguimiento)
        {
            int executionSection = 0;
            string pluginName = "VENTAS.PL.Cuenta.CrearContactoPersonaNatural";
            try
            {
                if (cuenta.Contains("atm_regimencontributivocode") && cuenta.Contains("name"))
                {
                                                                                                         
                    if (cuenta.GetAttributeValue<OptionSetValue>("atm_regimencontributivocode").Value == 963540000)//PERSONA NATURAL
                    {
                        executionSection = 1;
                        string[] nombreDividido = cuenta.GetAttributeValue<string>("name").Split(' ');
                        string nombres = "";
                        string apellidos = "";
                        switch (nombreDividido.Length)
                        {
                            case 4:
                                nombres = nombreDividido[2] + " " + nombreDividido[3];
                                apellidos = nombreDividido[0] + " " + nombreDividido[1];
                                break;
                            case 3:
                                nombres = nombreDividido[2];
                                apellidos = nombreDividido[0] + " " + nombreDividido[1];
                                break;
                            case 2:
                                nombres = nombreDividido[1];
                                apellidos = nombreDividido[0];
                                break;
                            case 1:
                                apellidos = nombreDividido[0];
                                break;
                            default:
                                apellidos = cuenta.GetAttributeValue<string>("name");
                                break;
                        }
                        executionSection = 2;

                        Entity NewContact = new Entity("contact");

                        NewContact.Attributes.Add("firstname", nombres);
                        NewContact.Attributes.Add("lastname", apellidos);
                        NewContact.Attributes.Add("parentcustomerid", cuenta.ToEntityReference());
                        NewContact.Attributes.Add("atm_idcontacto", cuenta.GetAttributeValue<string>("atm_idcuenta"));
                        NewContact.Attributes.Add("emailaddress1", cuenta.GetAttributeValue<string>("emailaddress1"));
                        NewContact.Attributes.Add("telephone1", cuenta.GetAttributeValue<string>("telephone1"));
                        NewContact.Attributes.Add("atm_telefonofijocompleto", cuenta.GetAttributeValue<string>("atm_telefonofijocompleto"));
                        NewContact.Attributes.Add("mobilephone", cuenta.GetAttributeValue<string>("telephone2"));
                        NewContact.Attributes.Add("ownerid", cuenta.GetAttributeValue<EntityReference>("ownerid"));
                        Guid contact = service.Create(NewContact);


                        executionSection = 3;

                        Entity account = new Entity() { LogicalName = "account", Id = cuenta.ToEntityReference().Id };
                        account.Attributes.Add("primarycontactid", new EntityReference() { Id = contact, LogicalName = "contact" });
                        service.Update(account);
                    }
                }

            }
            catch (Exception e)
            {
                throw new InvalidPluginExecutionException(string.Format("Error: {0} - ({1}) Execution Section {2}", e.Message, pluginName, executionSection.ToString()), e);
            }
        }
    }
}
