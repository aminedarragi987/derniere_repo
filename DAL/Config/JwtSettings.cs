using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Config
{

    public class JwtSettings
    {
        public string Issuer { get; set; } = default!;
        public string Audience { get; set; } = default!;
        public string Key { get; set; } = default!;
        public int LifetimeMinutes { get; set; }
    }

}
