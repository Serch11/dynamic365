using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.AF.Automundial.Models
{
    public class OptionList
    {
        public OptionList(int _value, string _name)
        {
            Codigo = _value;
            Nombre = _name;
        }
        public int Codigo { get; set; }
        public string Nombre { get; set; }
    }
}
