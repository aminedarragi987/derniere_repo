using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System;

namespace Service.Models
{
    public class ResponseLogin
    {
        public int Iduser { get; set; }
        public string? Nom { get; set; }
        public string? Email { get; set; }
        public int? Idrole { get; set; }
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
        public string TokenType { get; set; } = "Bearer";
        public int ExpireIn { get; set; }
    }
}
