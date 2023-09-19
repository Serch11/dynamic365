using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using Microsoft.Crm.Sdk;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;
using VENTAS.CA.Objetivos.CrearObjetivos;
using VENTAS.CA.Objetivos.CrearObjetivos.Helper;
using Newtonsoft.Json;
using System.Net.Http;
using ATM.Utilidades;
using ATM.Utilidades.Responses;

namespace VENTAS.CA.Objetivos.CrearObjetivos.Helper.Principal
{
    public class Principal
    {
        Guid? cc;
        int totalrecuento = 0;
        decimal totalpresupuesto = 0;
        string nombreobjetivo = string.Empty;
        string nombreTipoObjetivo = string.Empty;
        string fetchcategoria = string.Empty;
        string fetchunificado = string.Empty;
        string qfetchsegmento = string.Empty;
        string fetchDinamico = string.Empty;
        string text = string.Empty;
        string primario = null; string inprogressint = null; string inactualint = null; string inprogressmoney = null; string inactualmoney = null;
        string mensajeRegistrosIncompletos = "Registros con columnas incompletas : las columnas A,D,E,F,G,H,I para cada fila deben ser completadas con la informacion correcta";
        Entity usuario = null; Entity objetivo = null; Entity regional = null;
        Entity metrica = null;
        EntityCollection rollupfields;
        List<Guid> objetivosactualizados = new List<Guid>();
        List<Guid> listaObjetivosPrimarios = new List<Guid>();
        List<string> idCategorias = new List<string>();
        List<Modelo> ListaObjPresupuesto = new List<Modelo>();
        List<Modelo> ListaObjPresupuestoActualizado = new List<Modelo>();
        List<Modelo> ListaObjActEcu = new List<Modelo>();
        List<Modelo> ListaObjCreadoEcu = new List<Modelo>();
        List<ObjetivosCreados> objetivoscreados = new List<ObjetivosCreados>();
        List<RegistrosNoEncontrados> usuariosnoprecesados = new List<RegistrosNoEncontrados>();

        public void ValidarObjetivos(List<Modelo> listaObjetivos, List<TipoObjetivo> tiposdeobjetivos, IOrganizationService service, ITracingService seguimiento, out bool exitoso, out string respuesta)
        {
            string pluginName = "VENTAS.CA.Objetivos.CrearObjetivos";
            int executionSection = 0;
            exitoso = true;
            respuesta = "";
            RegistrosNoEncontrados registrosnoencontrados = new RegistrosNoEncontrados();
            try
            {
                //recorrer cada uno de los objetivos
                foreach (Modelo item in listaObjetivos)
                {
                    if ((!string.IsNullOrEmpty(item.A) && !string.IsNullOrEmpty(item.E) && !string.IsNullOrEmpty(item.G) && !string.IsNullOrEmpty(item.I) && item.H != 0) && (!string.IsNullOrEmpty(item.C) || !string.IsNullOrEmpty(item.D)))
                    {
                        executionSection = 1;
                        resetearVariables();

                        string referenteA = !string.IsNullOrEmpty(item.D) ? "código" : "correo";

                        switch (item.A)
                        {
                            case "PRESUPUESTO":
                                if (!string.IsNullOrEmpty(item.J))
                                {

                                    CrearObjetivo(item, tiposdeobjetivos, service, out exitoso, out respuesta);
                                }
                                else
                                {
                                    registrosnoencontrados.codigo = !string.IsNullOrEmpty(item.D) ? item.D : item.C;
                                    registrosnoencontrados.filaexcel = item.P;
                                    registrosnoencontrados.mensaje = $"Los siguientes registros con el {referenteA} de usuario no se puede crear! agregue el producto asociado de la factura.";
                                    usuariosnoprecesados.Add(registrosnoencontrados);
                                }
                                break;
                            case "PREVENTA":
                                if (!string.IsNullOrEmpty(item.C))
                                {
                                    CrearObjetivo(item, tiposdeobjetivos, service, out exitoso, out respuesta);
                                }
                                else
                                {
                                    registrosnoencontrados.codigo = !string.IsNullOrEmpty(item.D) ? item.D : item.C;
                                    registrosnoencontrados.filaexcel = item.P;
                                    registrosnoencontrados.mensaje = $"Los siguientes registros no se pueden crear! Agregue el correo del asesor.";
                                    usuariosnoprecesados.Add(registrosnoencontrados);
                                }
                                break;
                            case "CLIENTES":
                                if (!string.IsNullOrEmpty(item.L))
                                {
                                    CrearObjetivo(item, tiposdeobjetivos, service, out exitoso, out respuesta);
                                }
                                else
                                {
                                    registrosnoencontrados.codigo = !string.IsNullOrEmpty(item.D) ? item.D : item.C;
                                    registrosnoencontrados.filaexcel = item.P;
                                    registrosnoencontrados.mensaje = $@"Los siguiente registros con el {referenteA} de usuario no se pueden crear! agregue el segmento del cliente.";
                                    usuariosnoprecesados.Add(registrosnoencontrados);
                                }
                                break;
                            case "VENTA DE SERVICIOS Y SEGMENTO":
                                if ((!string.IsNullOrEmpty(item.J) && !string.IsNullOrEmpty(item.L)))
                                {
                                    CrearObjetivo(item, tiposdeobjetivos, service, out exitoso, out respuesta);
                                }
                                else
                                {
                                    registrosnoencontrados.codigo = !string.IsNullOrEmpty(item.D) ? item.D : item.C;
                                    registrosnoencontrados.filaexcel = item.P;
                                    registrosnoencontrados.mensaje = $"los siguientes registros con el {referenteA} de usuario no se pueden crear! agregue el segmento y producto de la factura.";
                                    usuariosnoprecesados.Add(registrosnoencontrados);
                                }
                                break;
                            case "RUEDA FACIL":
                                CrearObjetivo(item, tiposdeobjetivos, service, out exitoso, out respuesta);
                                break;
                            default:
                                registrosnoencontrados.codigo = !string.IsNullOrEmpty(item.D) ? item.D : item.C;
                                registrosnoencontrados.filaexcel = item.P;
                                registrosnoencontrados.mensaje = $"Los siguientes registros con el {referenteA} de usuario no se pueden crear! agregue un tipo de objetivo valido.";
                                usuariosnoprecesados.Add(registrosnoencontrados);
                                break;
                        }
                    }
                    else
                    {
                        RegistrosNoEncontrados reg = new RegistrosNoEncontrados();
                        reg.filaexcel = item.P;
                        reg.mensaje = mensajeRegistrosIncompletos;
                        usuariosnoprecesados.Add(reg);
                    }
                }

                var datos = ObtenerRegistroFallidos(usuariosnoprecesados, service);

                ActualizarObjetivosPrimarios(listaObjetivosPrimarios, service);

                CrearObjetivosDirectorRegional(service);


                List<PresupuestoSICEResponse> listaPresupuesto = new List<PresupuestoSICEResponse>();

                //llamar api de duvar
                if (ListaObjPresupuesto.Count > 0) listaPresupuesto.Add(CrearObjetivosSice(service, ListaObjPresupuesto, seguimiento, "COL", "N"));
                if (ListaObjPresupuestoActualizado.Count > 0) listaPresupuesto.Add(CrearObjetivosSice(service, ListaObjPresupuestoActualizado, seguimiento, "COL", "S"));
                if (ListaObjCreadoEcu.Count > 0) listaPresupuesto.Add(CrearObjetivosSice(service, ListaObjCreadoEcu, seguimiento, "ECU", "N"));
                if (ListaObjActEcu.Count > 0) listaPresupuesto.Add(CrearObjetivosSice(service, ListaObjActEcu, seguimiento, "ECU", "S"));

                Object data = new
                {
                    cantObjetivos = listaObjetivos.Count(),
                    objCreados = objetivoscreados.Count(),
                    usuariono = datos,
                    preciototal = new Money(totalpresupuesto),
                    conteototal = totalrecuento,
                    actualizados = objetivosactualizados.Count(),
                    respuestasice = ProcesarRespuestaSice(listaPresupuesto)
                };

                respuesta = JsonConvert.SerializeObject(data);
            }
            catch (Exception ex)
            {
                exitoso = false;
                respuesta = string.Format("Error: {0} - ({1}) Execution Section {2}", ex.Message, pluginName, executionSection.ToString());
                if (seguimiento != null) seguimiento.Trace("Error " + ex.Message);
            }
        }

        private PresupuestoSICEResponse ProcesarRespuestaSice(List<PresupuestoSICEResponse> listaPresupuesto)
        {
            output_presupuesto output = new output_presupuesto();
            foreach (var item in listaPresupuesto)
            {
                output.error = item.output.error;
                output.presupuestos_cargados = output.presupuestos_cargados + item.output.presupuestos_cargados;
                foreach (var item2 in item.output.presupuestos_error)
                {
                    output.presupuestos_error.Add(item2);
                }
            }
            return new PresupuestoSICEResponse() { output = output };
        }

        public PresupuestoSICEResponse CrearObjetivosSice(IOrganizationService service, List<Modelo> listaCreados, ITracingService seguimiento, string pais, string actualizacion)
        {

            PresupuestoSICEResponse resul = null;
            QueryExpression queryUrlParametros = new QueryExpression("atm_parametro");
            queryUrlParametros.ColumnSet.AddColumn("atm_valor");
            queryUrlParametros.Criteria.AddCondition("atm_nombre", ConditionOperator.Equal, "URLSICECRM");
            Entity parametro = service.RetrieveMultiple(queryUrlParametros).Entities.FirstOrDefault();
            string URL = "";

            if (parametro != null) URL = parametro.GetAttributeValue<string>("atm_valor") + "integrationCRM/budget.php?country={0}&status={1}";

            URL = string.Format(URL, pais, actualizacion);

            if (listaCreados.Count > 0)
            {
                List<ObjetivosSice> listobjsice = new List<ObjetivosSice>();
                foreach (Modelo item in listaCreados)
                {
                    ObjetivosSice objsice = new ObjetivosSice()
                    {
                        amount = item.N,
                        budget_category = item.K,
                        category = item.J,
                        month = item.I.Substring(item.I.Length - 2),
                        year = item.H.ToString(),
                        regional = item.E,
                        vendor = item.D,
                        zone = null,
                        quantity = item.M
                    };

                    listobjsice.Add(objsice);
                }

                resul = API.PUT<PresupuestoSICEResponse>(URL, listobjsice).Result;
            }
            return resul;
        }

        public void resetearVariables()
        {
            //inicializamos variables
            usuario = null;
            objetivo = null;
            metrica = null;
            inprogressint = null;
            inactualint = null;
            inprogressmoney = null;
            inactualmoney = null;
            nombreTipoObjetivo = string.Empty;
            fetchcategoria = string.Empty;
            qfetchsegmento = string.Empty;

        }

        public List<RegistrosFallidos> ObtenerRegistroFallidos(List<RegistrosNoEncontrados> registrosNoEncontrados, IOrganizationService service)
        {

            Utilidades utilidades = new Utilidades();
            List<RegistrosFallidos> listaRegistrosFallidos = new List<RegistrosFallidos>();
            List<RegistrosNoEncontrados> listaNoEncontrados = new List<RegistrosNoEncontrados>();

            var registrosAgrupadosMensaje = registrosNoEncontrados.GroupBy(x => x.mensaje);

            foreach (var agrupadoMensaje in registrosAgrupadosMensaje)
            {
                var registrosAgrupadosCodigo = agrupadoMensaje.GroupBy(x => x.codigo);
                var registrosDistintos = registrosAgrupadosCodigo.Distinct();
                List<RegistrosNoEncontrados> newListado = new List<RegistrosNoEncontrados>();
                foreach (var distinto in registrosDistintos)
                {
                    if (agrupadoMensaje.Key.ToString() == mensajeRegistrosIncompletos)
                    {
                        foreach (var item2 in distinto)
                        {
                            newListado.Add(new RegistrosNoEncontrados() { codigo = item2.codigo, filaexcel = item2.filaexcel, mensaje = item2.mensaje });
                        }
                    }
                    else
                    {
                        var nombre = string.Empty;
                        Entity codigovendedor = utilidades.consultarRegistros("systemuser", "atm_codigovendedor", distinto.Key.ToString(), service);
                        Entity correovendedor = utilidades.consultarRegistros("systemuser", "domainname", distinto.Key.ToString(), service);
                        if (codigovendedor != null || correovendedor != null)
                        {
                            nombre = codigovendedor != null ? codigovendedor.GetAttributeValue<string>("fullname") : correovendedor.GetAttributeValue<string>("fullname");
                        }


                        newListado.Add(new RegistrosNoEncontrados() { codigo = distinto.Key, mensaje = agrupadoMensaje.Key, nombreUsuario = nombre });
                    }
                }
                listaRegistrosFallidos.Add(new RegistrosFallidos() { nombre = agrupadoMensaje.Key, datos = newListado });
            }
            return listaRegistrosFallidos;
        }


        public TipoObjetivo ObtenerTipoDeObjetivo(List<TipoObjetivo> tipos, string tipoobjetivo)
        {
            List<string> lista = new List<string>() { tipoobjetivo };
            var result = tipos.Where((x, index) => lista.Contains(x.tipo)).FirstOrDefault();

            return new TipoObjetivo { codigo = result.codigo, tipo = result.tipo, valor = result.valor };
            //return result.Select(x => x.valor.ToString()).FirstOrDefault().ToString();
        }

        public void CrearObjetivo(Modelo item, List<TipoObjetivo> tiposdeobjetivos, IOrganizationService service, out bool exitoso, out string respuesta)
        {
            string pluginName = "VENTAS.CA.Objetivos.CrearObjetivos";
            int executionSection = 0;
            exitoso = true;
            respuesta = "";
            //instanciamos clases
            Utilidades utilidades = new Utilidades();

            //obtener opciones listado de segmento
            List<Segmento> listadosegmento = utilidades.obtenerOpciones(service);

            TipoObjetivo tipoobjetivo = ObtenerTipoDeObjetivo(tiposdeobjetivos, item.A);

            //valido tipo de objetivo para consultar usuario
            if (tipoobjetivo.valor == "lead")
            {
                if (item.C.Trim() == "") usuario = null;
                usuario = utilidades.consultarRegistros("systemuser", "domainname", item.C, service);
            }
            else
            {
                if (item.D.Trim() == "") usuario = null;
                usuario = utilidades.consultarRegistros("systemuser", "atm_codigovendedor", item.D, service);
            }

            //consulto metrica
            if (!string.IsNullOrEmpty(item.G)) metrica = utilidades.consultarRegistros("metric", "name", item.G, service);

            if (usuario != null && metrica != null)
            {
                executionSection = 2;
                bool tienerol = utilidades.ValidarRolesDeSeguridad(usuario.Id, service);

                if (tienerol == true)
                {
                    executionSection = 3;
                    //consulta regional
                    string nregional = string.Empty;
                    string saberegional = item.E == "Colombia" || item.E == "Ecuador" ? $"-{item.E}" : string.Empty;
                    if (item.E != null)
                    {
                        regional = utilidades.consultarRegistros("atm_regional", "atm_codigoregional", item.E, service);
                        nregional = regional != null ? $"-{regional.GetAttributeValue<string>("atm_nombre")}" : $"-{item.E}";
                    }


                    rollupfields = utilidades.consultarMultiplesRegistros("rollupfield", "metricid", metrica.Id.ToString(), service);

                    if (regional != null)
                    {
                        if (rollupfields.Entities.Count > 0)
                        {
                            foreach (Entity rolup in rollupfields.Entities)
                            {
                                switch (rolup.GetAttributeValue<string>("goalattribute"))
                                {
                                    case "inprogressinteger":
                                        inprogressint = rolup.GetAttributeValue<string>("goalattribute");
                                        break;
                                    case "actualinteger":
                                        inactualint = rolup.GetAttributeValue<string>("goalattribute");
                                        break;
                                    case "actualmoney":
                                        inactualmoney = rolup.GetAttributeValue<string>("goalattribute");
                                        break;
                                    case "inprogressmoney":
                                        inprogressmoney = rolup.GetAttributeValue<string>("goalattribute");
                                        break;
                                }
                            }
                            executionSection = 6;
                            switch (tipoobjetivo.valor)
                            {
                                case "lead":

                                    //nombreTipoObjetivo = regional != null ? $"-{regional.GetAttributeValue<string>("atm_nombre")}" : "";
                                    List<string> idusuario = new List<string>() { usuario.Id.ToString() };
                                    string fetchpreventa = utilidades.PrepararFetch(idusuario, "lead");
                                    fetchunificado = utilidades.UnificarFetch(fetchpreventa, "lead", usuario, item.I, item.H);
                                    cc = utilidades.PrepararCreacionConsultaConsolidad(usuario, "lead", fetchunificado, item.I, item.H, service);

                                    break;
                                case "invoicedetail":

                                    if (!string.IsNullOrEmpty(item.J))
                                    {
                                        item.J = item.J.Trim();
                                        nombreTipoObjetivo = $"-{item.J.TrimEnd(',').Replace(',', '-')}";
                                        fetchcategoria = utilidades.ObtenerCategorias(service, item.J.Split(','));
                                        fetchunificado = utilidades.UnificarFetch(fetchcategoria, "invoicedetail", usuario, item.I, item.H);
                                        cc = utilidades.PrepararCreacionConsultaConsolidad(usuario, "invoicedetail", fetchunificado, item.I, item.H, service);
                                    }

                                    break;
                                case "invoice":

                                    if (item.A == "RUEDA FACIL")
                                    {
                                        List<Filtro> listafiltro = new List<Filtro>()
                                                {
                                                   new Filtro(){atributo = "atm_porcentajefinanciacion" ,operador="gt",valor="0"},
                                                   new Filtro(){atributo = "ownerid" ,operador="eq",valor="{"+usuario.Id.ToString()+"}"}
                                                };

                                        fetchDinamico = utilidades.FetchDinamico("invoice", listafiltro);
                                        fetchunificado = utilidades.UnificarFetch(fetchDinamico, "invoice", usuario, item.I, item.H);
                                        cc = utilidades.PrepararCreacionConsultaConsolidad(usuario, "invoice", fetchunificado, item.I.Split('-')[0], item.H, service);
                                    }

                                    break;
                                case "account":
                                    if (!string.IsNullOrEmpty(item.L))
                                    {
                                        item.L = item.L.Trim();
                                        nombreTipoObjetivo = $"-{item.L.TrimEnd(',').Replace(',', '-')}";
                                        string[] segmentos = item.L.Replace(" ", "").Split(',');
                                        qfetchsegmento = utilidades.ValidarSegmento(segmentos, listadosegmento, "account");
                                        fetchunificado = utilidades.UnificarFetch(qfetchsegmento, "account", usuario, item.I, item.H);
                                        cc = utilidades.PrepararCreacionConsultaConsolidad(usuario, "account", fetchunificado, item.I, item.H, service);
                                    }
                                    break;
                                case "invoicedetail-account":
                                    if (!string.IsNullOrEmpty(item.J) && !string.IsNullOrEmpty(item.L))
                                    {
                                        item.J = item.J.Trim(); item.L = item.L.Trim();
                                        nombreTipoObjetivo = $@"-{item.L.TrimEnd(',').Replace(',', '-')}-{item.J.TrimEnd(',').Replace(',', '-')}";
                                        fetchcategoria = utilidades.ObtenerCategorias(service, item.J.Split(','));
                                        qfetchsegmento = utilidades.ValidarSegmento(item.K.Replace(" ", "").Split(','), listadosegmento, "invoicedetail-account");
                                        if (fetchcategoria != null && qfetchsegmento != null)
                                        {
                                            string fetchanidados = $@"{fetchcategoria}{qfetchsegmento}";
                                            fetchunificado = utilidades.UnificarFetch(fetchanidados, "invoicedetail", usuario, item.I, item.H);
                                            cc = utilidades.PrepararCreacionConsultaConsolidad(usuario, "invoicedetail", fetchunificado, item.I, item.H, service);
                                        }
                                    }
                                    break;
                                default:
                                    break;
                            }
                            //CREAR OBJETIVO
                            Entity nuevoObjetivo = new Entity("goal");

                            nombreobjetivo = $"{usuario.GetAttributeValue<string>("fullname")}-{item.H}-{item.I.Split('-')[0]}-{item.A}{nregional}{nombreTipoObjetivo}".ToUpper();

                            nuevoObjetivo.Attributes.Add("title", nombreobjetivo);
                            nuevoObjetivo.Attributes.Add("atm_nombrellave", $"{nombreobjetivo}-{metrica.Id.ToString()}".ToUpper());

                            //SE CONSULTA EXISTENCIA DE OBJETIVO PRIMARIO

                            primario = null;
                            primario = ConsultarObjetivoPrimario(service, usuario.Id, item.H, Int32.Parse(item.I.Split('-')[1]), Int32.Parse(tipoobjetivo.codigo), regional);

                            if (primario == null)
                            {
                                primario = CrearObjetivoPrincipal(service,
                                          new ObjetivoPrimario
                                          {
                                              usuario = usuario,
                                              metrica = metrica,
                                              regional = regional,
                                              nregional = nregional,
                                              atm_tipoobjetivo = Int32.Parse(tipoobjetivo.codigo),
                                              fiscalperiod = Int32.Parse(item.I.Split('-')[1]),
                                              fiscalyear = item.H,
                                              ntipoobjectivo = tipoobjetivo.valor
                                          }
                                      ).ToString();

                            }

                            if (primario != null) nuevoObjetivo.Attributes.Add("parentgoalid", new EntityReference("goal", new Guid(primario))); listaObjetivosPrimarios.Add(new Guid(primario));
                            if (regional != null) nuevoObjetivo.Attributes.Add("atm_regionalid", regional.ToEntityReference());

                            nuevoObjetivo.Attributes.Add("goalownerid", usuario.ToEntityReference());
                            nuevoObjetivo.Attributes.Add("ownerid", usuario.ToEntityReference());
                            nuevoObjetivo.Attributes.Add("metricid", metrica.ToEntityReference());
                            nuevoObjetivo.Attributes.Add("isfiscalperiodgoal", true);
                            nuevoObjetivo.Attributes.Add("targetmoney", new Money(item.N)); totalpresupuesto += item.N;
                            nuevoObjetivo.Attributes.Add("targetinteger", item.O); totalrecuento += item.O;
                            nuevoObjetivo.Attributes.Add("rolluponlyfromchildgoals", false);
                            nuevoObjetivo.Attributes.Add("consideronlygoalownersrecords", false);
                            nuevoObjetivo.Attributes.Add("atm_objetivoprimario", false);
                            nuevoObjetivo.Attributes.Add("isamount", metrica.GetAttributeValue<bool>("isamount"));
                            nuevoObjetivo.Attributes.Add("atm_tipoobjetivo", new OptionSetValue(int.Parse(tipoobjetivo.codigo)));

                            if (cc != null)
                            {
                                if (inactualmoney != null) nuevoObjetivo.Attributes.Add("rollupqueryactualmoneyid", new EntityReference("goalrollupquery", cc.Value));
                                if (inprogressmoney != null) nuevoObjetivo.Attributes.Add("rollupqueryinprogressmoneyid", new EntityReference("goalrollupquery", cc.Value));
                                if (inactualint != null) nuevoObjetivo.Attributes.Add("rollupqueryactualintegerid", new EntityReference("goalrollupquery", cc.Value));
                                if (inprogressint != null) nuevoObjetivo.Attributes.Add("rollupqueryinprogressintegerid", new EntityReference("goalrollupquery", cc.Value));
                            }

                            //VALIDAR SI OBJETIVO EXISTE
                            objetivo = utilidades.consultarRegistros("goal", "atm_nombrellave", $"{nombreobjetivo}-{metrica.Id.ToString()}", service);
                            if (objetivo == null)
                            {
                                nuevoObjetivo.Attributes.Add("fiscalyear", new OptionSetValue(item.H));
                                nuevoObjetivo.Attributes.Add("fiscalperiod", new OptionSetValue(Int32.Parse(item.I.Split('-')[1])));
                                Guid res = service.Create(nuevoObjetivo);
                                objetivoscreados.Add(new ObjetivosCreados { id = res, objetivoprimario = nuevoObjetivo.GetAttributeValue<bool>("atm_objetivoprimario") });
                                if (item.A == "PRESUPUESTO" && (item.E == "819" || item.E == "810" || item.E == "820")) { ListaObjCreadoEcu.Add(item); } else if (item.A == "PRESUPUESTO") { ListaObjPresupuesto.Add(item); }

                            }
                            else
                            {
                                nuevoObjetivo.Id = objetivo.Id;
                                service.Update(nuevoObjetivo);
                                objetivosactualizados.Add(nuevoObjetivo.Id);
                                if (item.A == "PRESUPUESTO" && (item.E == "819" || item.E == "810" || item.E == "820")) { ListaObjActEcu.Add(item); } else if (item.A == "PRESUPUESTO") { ListaObjPresupuestoActualizado.Add(item); }
                            }
                        }
                    }
                    else
                    {
                        text = "Los siguientes registros no contienen una regional valida";

                        RegistrosNoEncontrados reg = new RegistrosNoEncontrados();

                        reg.codigo = tipoobjetivo.valor == "lead" ? item.C : item.D;
                        reg.filaexcel = item.P;
                        reg.mensaje = text;
                        reg.nombreUsuario = usuario.GetAttributeValue<string>("fullname").ToUpper();
                        usuariosnoprecesados.Add(reg);
                    }
                }
                else
                {
                    /// usuarios no tiene rol 
                    if (tienerol == false) text = "los registros con los siguientes usuarios no tienen un rol de seguridad asignado";
                    RegistrosNoEncontrados reg = new RegistrosNoEncontrados();

                    reg.codigo = tipoobjetivo.valor == "lead" ? item.C : item.D;
                    reg.filaexcel = item.P;
                    reg.mensaje = text;
                    reg.nombreUsuario = usuario.GetAttributeValue<string>("fullname").ToUpper();
                    usuariosnoprecesados.Add(reg);
                }
            }
            else
            {
                /// usuarios no encontrados 
                if (metrica == null && usuario == null) text = $"Los siguientes registros no contienen una metrica de objetivo y  vendedor valido.";
                if (metrica == null) text = $"Los siguiente registros no contienen una metrica de objetivo valido.";
                if (usuario == null) text = $"Los registros con los siguientes usuarios no se encuentran en CRM o estan deshabilitados";

                RegistrosNoEncontrados reg = new RegistrosNoEncontrados();
                reg.codigo = tipoobjetivo.valor == "lead" ? item.C : item.D;
                reg.filaexcel = item.P;
                reg.mensaje = text;
                reg.nombreUsuario = usuario != null ? usuario.GetAttributeValue<string>("fullname") : "";
                usuariosnoprecesados.Add(reg);
            }
        }

        //ACTUALIZAR OBJETIVOS PRIMARIOS
        private void ActualizarObjetivosPrimarios(List<Guid> objetivoscreados, IOrganizationService service)
        {
            var obj = objetivoscreados.Distinct();
            decimal sumadinero = 0;
            int sumarecuento = 0;

            foreach (Guid item in obj)
            {
                sumadinero = 0;
                sumarecuento = 0;
                var query_parentgoalid = item;
                QueryExpression query = new QueryExpression("goal");
                query.ColumnSet.AddColumns("targetinteger", "stretchtargetdecimal", "targetmoney");
                query.Criteria.AddCondition("parentgoalid", ConditionOperator.Equal, query_parentgoalid);

                EntityCollection objetivos = service.RetrieveMultiple(query);

                if (objetivos.Entities.Count > 0)
                {
                    foreach (var registro in objetivos.Entities)
                    {
                        sumadinero = sumadinero + registro.GetAttributeValue<Money>("targetmoney").Value;
                        sumarecuento = sumarecuento + registro.GetAttributeValue<int>("targetinteger");
                    }
                }
                Entity updateObjetivo = new Entity("goal", item);
                updateObjetivo.Attributes.Add("targetmoney", new Money(sumadinero));
                updateObjetivo.Attributes.Add("targetinteger", sumarecuento);

                service.Update(updateObjetivo);
            }
        }

        private void CrearObjetivosDirectorRegional(IOrganizationService service)
        {
            try
            {
                QueryExpression ObjetivosPrimarios = new QueryExpression("goal");
                ObjetivosPrimarios.ColumnSet.AddColumns("parentgoalid", "goalownerid", "atm_regionalid", "metricid", "fiscalperiod", "fiscalyear", "targetinteger", "targetmoney", "atm_tipoobjetivo");
                ObjetivosPrimarios.Criteria.AddCondition("atm_objetivoprimario", ConditionOperator.Equal, true);
                ObjetivosPrimarios.Criteria.AddCondition("atm_directorregional", ConditionOperator.Equal, false);
                ObjetivosPrimarios.Criteria.AddCondition("parentgoalid", ConditionOperator.Null);
                LinkEntity linkRegional = new LinkEntity(
                    linkFromEntityName: "goal",
                    linkToEntityName: "atm_regional",
                    linkFromAttributeName: "atm_regionalid",
                    linkToAttributeName: "atm_regionalid",
                    joinOperator: JoinOperator.Inner
                    );
                linkRegional.Columns.AddColumns("atm_directorregional");
                linkRegional.EntityAlias = "regional";
                ObjetivosPrimarios.LinkEntities.Add(linkRegional);

                EntityCollection consultaObjetivosPrimario = service.RetrieveMultiple(ObjetivosPrimarios);

                if (consultaObjetivosPrimario.Entities.Count > 0)
                {
                    foreach (Entity obj in consultaObjetivosPrimario.Entities)
                    {
                        EntityReference directorRegional = ((EntityReference)obj.GetAttributeValue<AliasedValue>("regional.atm_directorregional").Value);

                        QueryExpression queryObjDirector = new QueryExpression("goal");
                        queryObjDirector.ColumnSet.AddColumns("goalid", "targetmoney", "targetinteger", "title");
                        queryObjDirector.Criteria.AddCondition("atm_directorregional", ConditionOperator.Equal, true);
                        queryObjDirector.Criteria.AddCondition("fiscalperiod", ConditionOperator.Equal, obj.GetAttributeValue<OptionSetValue>("fiscalperiod").Value);
                        queryObjDirector.Criteria.AddCondition("atm_regionalid", ConditionOperator.Equal, obj.GetAttributeValue<EntityReference>("atm_regionalid").Id);
                        queryObjDirector.Criteria.AddCondition("goalownerid", ConditionOperator.Equal, directorRegional.Id);
                        queryObjDirector.Criteria.AddCondition("atm_tipoobjetivo", ConditionOperator.Equal, obj.GetAttributeValue<OptionSetValue>("atm_tipoobjetivo").Value);

                        Entity objDirector = service.RetrieveMultiple(queryObjDirector).Entities.FirstOrDefault();

                        if (objDirector != null)
                        {
                            Entity UpdateObjetivoPrimario = new Entity("goal", obj.Id);
                            UpdateObjetivoPrimario.Attributes.Add("parentgoalid", objDirector.ToEntityReference());
                            service.Update(UpdateObjetivoPrimario);

                            Entity updateObjetivoDirector = new Entity("goal", objDirector.Id);
                            updateObjetivoDirector.Attributes.Add("targetmoney", new Money(objDirector.GetAttributeValue<Money>("targetmoney").Value + obj.GetAttributeValue<Money>("targetmoney").Value));
                            updateObjetivoDirector.Attributes.Add("targetinteger", objDirector.GetAttributeValue<int>("targetinteger") + obj.GetAttributeValue<int>("targetinteger"));

                            service.Update(updateObjetivoDirector);
                        }
                        else
                        {
                            Entity nuevoObjDirector = new Entity("goal");
                            nuevoObjDirector.Attributes.Add("goalownerid", directorRegional);
                            nuevoObjDirector.Attributes.Add("atm_regionalid", obj.GetAttributeValue<EntityReference>("atm_regionalid"));
                            nuevoObjDirector.Attributes.Add("ownerid", directorRegional);
                            nuevoObjDirector.Attributes.Add("isfiscalperiodgoal", true);
                            nuevoObjDirector.Attributes.Add("fiscalyear", new OptionSetValue(obj.GetAttributeValue<OptionSetValue>("fiscalyear").Value));
                            nuevoObjDirector.Attributes.Add("fiscalperiod", new OptionSetValue(obj.GetAttributeValue<OptionSetValue>("fiscalperiod").Value));
                            nuevoObjDirector.Attributes.Add("metricid", obj.GetAttributeValue<EntityReference>("metricid"));
                            nuevoObjDirector.Attributes.Add("isamount", obj.GetAttributeValue<bool>("isamount"));
                            nuevoObjDirector.Attributes.Add("targetmoney", new Money(obj.GetAttributeValue<Money>("targetmoney").Value));
                            nuevoObjDirector.Attributes.Add("targetinteger", obj.GetAttributeValue<int>("targetinteger"));
                            nuevoObjDirector.Attributes.Add("rolluponlyfromchildgoals", true);
                            nuevoObjDirector.Attributes.Add("consideronlygoalownersrecords", true);
                            nuevoObjDirector.Attributes.Add("atm_objetivoprimario", true);
                            nuevoObjDirector.Attributes.Add("atm_directorregional", true);
                            nuevoObjDirector.Attributes.Add("atm_tipoobjetivo", new OptionSetValue(obj.GetAttributeValue<OptionSetValue>("atm_tipoobjetivo").Value));

                            string nombreobjetivo = $"OBJETIVO DIRECTOR REGIONAL-{directorRegional.Name}-{obj.GetAttributeValue<EntityReference>("atm_regionalid").Name}".ToUpper();

                            nuevoObjDirector.Attributes.Add("title", nombreobjetivo);
                            nuevoObjDirector.Attributes.Add("atm_nombrellave", $"{nombreobjetivo}-{obj.GetAttributeValue<EntityReference>("metricid").Id}".ToUpper());


                            Guid newObj = service.Create(nuevoObjDirector);
                            Entity UpdateObjetivoPrimario = new Entity("goal", obj.Id);
                            UpdateObjetivoPrimario.Attributes.Add("parentgoalid", new EntityReference("goal", newObj));
                            service.Update(UpdateObjetivoPrimario);
                        }
                    }
                }
            }
            catch (Exception ex)
            {

                throw new InvalidPluginExecutionException(ex.Message);
            }
        }

        private Guid CrearObjetivoPrincipal(IOrganizationService service, ObjetivoPrimario data)
        {
            //executionSection = 5;
            Entity goal = new Entity("goal");

            string nombreobjetivo = $"OBJETIVO PRINCIPAL-{data.usuario.GetAttributeValue<string>("fullname")}-{data.fiscalyear}-{data.fiscalperiod}-{data.ntipoobjectivo}{data.nregional}".ToUpper();

            goal.Attributes.Add("title", nombreobjetivo);
            goal.Attributes.Add("atm_nombrellave", $"{nombreobjetivo}-{metrica.Id.ToString()}".ToUpper());
            goal.Attributes.Add("goalownerid", data.usuario.ToEntityReference());
            goal.Attributes.Add("atm_regionalid", data.regional.ToEntityReference());
            goal.Attributes.Add("metricid", data.metrica.ToEntityReference());
            goal.Attributes.Add("ownerid", data.usuario.ToEntityReference());
            goal.Attributes.Add("isfiscalperiodgoal", true);
            goal.Attributes.Add("fiscalperiod", new OptionSetValue(data.fiscalperiod));
            goal.Attributes.Add("fiscalyear", new OptionSetValue(data.fiscalyear));
            goal.Attributes.Add("rolluponlyfromchildgoals", true);
            goal.Attributes.Add("consideronlygoalownersrecords", true);
            goal.Attributes.Add("atm_objetivoprimario", true);
            goal.Attributes.Add("atm_tipoobjetivo", new OptionSetValue(data.atm_tipoobjetivo));
            goal.Attributes.Add("atm_directorregional", false);

            return service.Create(goal);
        }


        private string ConsultarObjetivoPrimario(IOrganizationService service, Guid userid, int fiscalyear, int fiscalperido, int tipodeobjetivo, Entity regional)
        {
            ATM.Utilidades.Utilidades util = new ATM.Utilidades.Utilidades(service);
            string id = null;
            var res = util.ConsultarMultiplesRegistros(util.CrearConsulta("goal", new string[] { "title" },
                new List<ConditionExpression>
                {
                    new ConditionExpression("atm_objetivoprimario", ConditionOperator.Equal, true),
                    new ConditionExpression("atm_directorregional", ConditionOperator.Equal, false),
                    new ConditionExpression("goalownerid", ConditionOperator.Equal, userid),
                    new ConditionExpression("fiscalyear", ConditionOperator.Equal, fiscalyear),
                    new ConditionExpression("fiscalperiod", ConditionOperator.Equal, fiscalperido),
                    new ConditionExpression("atm_tipoobjetivo", ConditionOperator.Equal, tipodeobjetivo),
                    new ConditionExpression("atm_regionalid", ConditionOperator.Equal,regional.Id),
                }
                ));
            if (res.Count > 0)
            {
                id = res.FirstOrDefault().Id.ToString();
            }
            return id;
        }
    }
}