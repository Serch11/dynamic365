using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.AF.Automundial.Models
{
    public class ConectarRequest
    {
        public string Ambiente { get; set; }
        public string Usuario { get; set; }
        public string Contrasena { get; set; }
    }
}
