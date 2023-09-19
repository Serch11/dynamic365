using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ATM.Utilidades.Responses
{
    public class PresupuestoSICEResponse
    {
        public output_presupuesto output { get; set; }
    }

    public class output_presupuesto
    {
        public string error { get; set; }
        public int presupuestos_cargados { get; set; }
        public List<presupuestos_error> presupuestos_error { get; set; } = new List<presupuestos_error>();
    }

    public class presupuestos_error
    {
        public string vendedor { get; set; }
        public string message { get; set; }
        public string categoria { get; set; }
        public string regional { get; set; }
    }
}
