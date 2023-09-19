using System;

namespace ATM.Utilidades.Responses
{
    public class RespuestaAF
    {
        public string Mensaje { get; set; }
        public bool Correcto { get; set; }
        public Object Datos { get; set; }
    }
}