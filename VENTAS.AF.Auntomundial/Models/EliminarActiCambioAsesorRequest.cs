using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.AF.Automundial.Models
{
    public class EliminarActiCambioAsesorRequest : ConectarRequest
    {
        public List<Cuenta> Cuentas { get; set; }
    }

    public class Cuenta
    {
        public List<Actividad> Actividades { get; set; }
        public Guid Propietario { get; set; }
    }

    public class Actividad
    {
        public Guid Id { get; set; }
        public string LogicalName { get; set; }
        public Guid Propietario { get; set; }
        public string LogicalNamePropietario { get; set; }
        public int Estado { get; set; }
    }
}
