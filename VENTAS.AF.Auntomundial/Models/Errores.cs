using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.AF.Automundial.Models
{
    public class Errores
    {
        public List<DescripcionError> ErroresGenerales { get; set; }
        public List<DescripcionError> ErroresEnvioCorreo { get; set; }
    }

    public class DescripcionError
    {
        public string Mensaje { get; set; }
    }
}
