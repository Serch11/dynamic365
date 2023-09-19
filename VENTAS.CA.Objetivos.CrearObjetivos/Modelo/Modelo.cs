using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.CA.Objetivos.CrearObjetivos
{
    public class Modelo
    {
        public string A { get; set; }  //tipo de objetivo
        public string B { get; set; }  // 
        public string C { get; set; } = "";  //correo asesor
        public string D { get; set; } = "";  //codigo asesor
        public string E { get; set; }  //regional
        public string F { get; set; }  //objetivo primario
        public string G { get; set; }     //metrica de objetivo
        public int H { get; set; }   //año 
        public string I { get; set; }   //mes
        public string J { get; set; }   //filtro objetivo categoria producto
        public string K { get; set; } // CATEGORIA DE PRESUPUESTO
        public string L { get; set; }  //filtro segmento - cuenta
        public int M { get; set; } = 0; //CANTIDAD 
        public decimal N { get; set; } //destino moneda 
        public int O { get; set; }  //destino recuento
        public string P { get; set; }  //IDEXCEL
    }

    public class TipoObjetivo
    {
        public string tipo { get; set; }
        public string valor { get; set; }
        public string codigo { get; set; }
    }

    public class Segmento
    {
        public Segmento(int _value, string _name)
        {
            Codigo = _value;
            Nombre = _name;
        }
        public int Codigo { get; set; }
        public string Nombre { get; set; }
    }

    public class Filtro
    {
        public string atributo { get; set; }
        public string operador { get; set; }
        public string valor { get; set; }
        public string tipo { get; set; }
    }

    public class RegistrosNoEncontrados
    {
        public string codigo { get; set; }
        public string filaexcel { get; set; }
        public string mensaje { get; set; }
        public string nombreUsuario { get; set; }
    }

    public class RegistrosFallidos
    {
        public string nombre { get; set; }
        public List<RegistrosNoEncontrados> datos { get; set; } = new List<RegistrosNoEncontrados>();
    }

    public class ObjetivosCreados
    {
        public Guid id { get; set; }
        public bool objetivoprimario { get; set; }
    }


    public class ObjetivosSice
    {
        public string year { get; set; }
        public string month { get; set; }
        public string regional { get; set; }
        public string zone { get; set; } = null;
        public string vendor { get; set; }
        public string category { get; set; }
        public string budget_category { get; set; }
        public int quantity { get; set; }
        public decimal amount { get; set; }
    }

    public class ObjetivoPrimario
    {
        public Entity usuario { get; set; }
        public Entity metrica { get; set; }
        public Entity regional { get; set; }
        public string nregional { get; set; }
        public int atm_tipoobjetivo { get; set; }
        public int fiscalperiod { get; set; }
        public int fiscalyear { get; set; }
        public string ntipoobjectivo { get; set; }

    }

    public class ArrayObjetivos
    {
        public ObjetivosSice[] Objetivos { get; set; }
    }
}
