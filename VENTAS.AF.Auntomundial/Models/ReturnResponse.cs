using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.AF.Automundial.Models
{
    public class ReturnResponse
    {
        public string Mensaje { get; set; }
        public bool Correcto { get; set; }
        public Object Datos { get; set; }
    }
}
