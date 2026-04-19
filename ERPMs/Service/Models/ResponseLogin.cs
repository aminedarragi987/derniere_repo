using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Models
{
    public class ResponseLogin
    {
        public int Iduser { get; set; }
        public string? Nom { get; set; }
        public string? Email { get; set; }
        public int? Idrole { get; set; }
        public string? AccessToken { get; set; }
        public string TokenType { get; set; } = string.Empty;
        public int ExpireIn { get; set; }
    }
}
