
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VENTAS.AF.Automundial.Models
{
    public class OutPut
    {
        public List<CuentaSICERequest> output { get; set; }
    }

    public class CuentaSICERequest
    {
        public string customer_code { get; set; }
        public string email { get; set; }
        public string email_fe { get; set; }
        public string first_surname { get; set; }
        public string second_surname { get; set; }
        public string first_name { get; set; }
        public string second_name { get; set; }
        public string complete_name { get; set; }
        public string phone { get; set; }
        public string phone2 { get; set; }
        public string fax_number { get; set; }
        public string mobile_number { get; set; }
        public string address { get; set; }
        public string city_code { get; set; }
        public string city_name { get; set; }
        public string department_code { get; set; }
        public string department_name { get; set; }
        public string country { get; set; }
        public string name_country { get; set; }
        public string region_code { get; set; }
        public string region_name { get; set; }
        public string customer_type { get; set; }
        public string seller_code { get; set; }
        public string seller_name { get; set; }
        public string seller_email { get; set; }
        public string invoice_period { get; set; }
        public string bill_rejects { get; set; }
        public string bill_secure { get; set; }
        public DateTime? creation_date { get; set; }
        public string status { get; set; }
        public string status_name { get; set; }
        public string observation { get; set; }
        public DateTime? last_invoice_date { get; set; }
        public int? contributory_code { get; set; }
        public string contributory_name { get; set; }
        public string assigned_quota { get; set; }
        public DateTime? actualization_date { get; set; }
        public string average_sales { get; set; }
        public string mark { get; set; }
        public string branch { get; set; }
        public string branch_code { get; set; }
        public string customer_group { get; set; }
    }
}
