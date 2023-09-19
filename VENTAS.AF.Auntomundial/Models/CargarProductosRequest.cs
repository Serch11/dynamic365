using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.AF.Automundial.Models
{
    public  class CargarProductosRequest : ConectarRequest
    {
        public string Propietario { get; set; }
        public string ListaPrecio { get; set; }
        public List<DataExcel> Productos { get; set; }
    }

    public class DataExcel
    {
        public string A { get; set; }
        public decimal B { get; set; }
        public bool existe { get; set; }
        public Guid idProd { get; set; }
    }
}
