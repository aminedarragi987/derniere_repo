using System;
using System.Collections.Generic;

namespace Core.Entities;

public partial class Utilisateur
{
    public int Iduser { get; set; }

    public string Nom { get; set; }

    public string Username { get; set; }

    public string Motpass { get; set; }

    public string Email { get; set; }

    public string Telephone { get; set; }

    public int? Idrole { get; set; }

    public virtual Role IdroleNavigation { get; set; }

    public virtual ICollection<Refreshtoken> Refreshtokens { get; set; } = new List<Refreshtoken>();
}
