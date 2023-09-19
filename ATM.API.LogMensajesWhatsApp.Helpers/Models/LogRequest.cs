using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ATM.API.LogMensajesWhatsApp.Helpers.Models
{
    public class LogRequest
    {
        [Required(ErrorMessage = "El ID del registro es obligatorio")]
        public string ID { get; set; }

        [Required(ErrorMessage = "El Tipo de consulta es obligatorio")]
        public string Tipo { get; set; }

        [Required(ErrorMessage = "La Descripción es obligatoria")]
        public string Descripcion { get; set; }

        [Required(ErrorMessage = "El Nombre del flujo es obligatorio")]
        public string Flujo { get; set; }
    }
}
