using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ATM.Utilidades.Responses
{
    public class CuentasSICEResponse
    {
        public output_cuentasSICE output { get; set; }
    }

    public class output_cuentasSICE
    {
        public string error { get; set; }
        public int clientes_actualizados { get; set; }
        public List<clientes_error> clientes_error { get; set; }
    }

    public class clientes_error
    {
        public string nit { get; set; }
        public string message { get; set; }
    }
}
