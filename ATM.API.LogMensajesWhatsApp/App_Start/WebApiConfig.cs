using ATM.API.LogMensajesWhatsApp.Data.Interface;
using ATM.API.LogMensajesWhatsApp.Services.Interfaces;
using ATM.API.MWA.Data;
using ATM.API.MWA.Services;
using System.Web.Http;
using Unity;


namespace ATM.API.MWA
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            var container = new UnityContainer();

            container.RegisterType<ILogAPIService, LogAPIService>();
            container.RegisterType<ILogAPIRepository, LogAPIRepository>();

            config.DependencyResolver = new UnityResolver(container);

            // Enable cors
            config.EnableCors();

            // Rutas de API web
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
