using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Models
{
    public class AccessTkn
    {
        public string? AccessToken { get; set; }
        public int ExpireIn { get; set; }
    }
}
