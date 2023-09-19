using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.AF.Automundial.Models
{
    public class CompartirRegistrosRequest : ConectarRequest
    {
        public Guid IdHijo { get; set; }
    }
}
